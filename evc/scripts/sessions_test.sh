#!/usr/bin/env bash
set -e

################################################################################
# evc (Entre Vetas Core) - Orquestador de Flujo de Desarrollo
#
# Sistema de sesiones de trabajo documentadas con integración completa a Git
# e issue tracking. Combina gestión de infraestructura con documentación del
# proceso cognitivo humano durante el desarrollo.
#
# Funcionalidades principales:
#   - start session : Inicia sesión manual (trabajo exploratorio)
#   - issue         : Inicializa workspace completo (rama + sesión + metadata)
#   - note          : Añade nota timestampeada a sesión activa
#   - context       : Muestra contenido de sesión + contexto relacionado
#   - end session   : Finaliza sesión manual
#   - commit        : Cristaliza ciclo completo (commit + cierre + metadata)
#
# Estructura de archivos:
#   sessions/
#   ├── active_session -> session_YYYY-MM-DD_HHMMSS/
#   ├── session_YYYY-MM-DD_HHMMSS/
#   │   ├── session.md
#   │   └── evc.json
#   └── ...
#
# Autor: Sistema basado en metodología Bespoke
# Fecha: 2025-08-23
################################################################################

# Configuración global
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSIONS_DIR="$BASE_DIR/sessions"
ACTIVE_SESSION_LINK="$SESSIONS_DIR/active_session"
CONFIG_FILE="$BASE_DIR/.evc_config"

################################################################################
# Funciones de configuración y utilidades
################################################################################

ensure_sessions_dir() {
    if [[ ! -d "$SESSIONS_DIR" ]]; then
        mkdir -p "$SESSIONS_DIR"
        echo "Directorio de sesiones creado: $SESSIONS_DIR" >&2
    fi
}

get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

get_session_dirname() {
    local session_timestamp=$(date '+%Y-%m-%d_%H%M%S')
    echo "session_${session_timestamp}"
}

get_uuid() {
    if command -v uuidgen >/dev/null 2>&1; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    else
        # Fallback UUID generation
        cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "$(date +%s)-$(od -An -N4 -tx /dev/random | tr -d ' ')"
    fi
}

################################################################################
# Funciones de contexto Git y servicios
################################################################################

get_git_info() {
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        echo "**Rama:** no-git | **Commit:** no-commit"
        return
    fi
    
    local git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "detached")
    local git_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "no-commits")
    echo "**Rama:** $git_branch | **Commit:** $git_commit"
}

detect_services() {
    local services=()
    
    # Buscar docker-compose.yml para detectar servicios
    if [[ -f "docker-compose.yml" ]]; then
        services+=($(grep -E "^\s+[a-zA-Z0-9_-]+:" docker-compose.yml | sed 's/://g' | tr -d ' ' | head -5))
    fi
    
    # Buscar directorios con estructura de servicio
    for dir in */; do
        if [[ -f "$dir/Dockerfile" ]] || [[ -f "$dir/package.json" ]] || [[ -f "$dir/requirements.txt" ]]; then
            services+=($(basename "$dir"))
        fi
    done
    
    # Limitar a 5 servicios para evitar spam
    if [[ ${#services[@]} -gt 0 ]]; then
        printf '%s,' "${services[@]:0:5}" | sed 's/,$//g'
    else
        echo "monorepo"
    fi
}

validate_not_main_branch() {
    local current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
    if [[ "$current_branch" == "main" ]] || [[ "$current_branch" == "master" ]]; then
        echo "Error: No se pueden crear sesiones en la rama principal ($current_branch)." >&2
        echo "Cambia a una rama de trabajo o usa 'evc issue' para crear una nueva." >&2
        exit 1
    fi
}

################################################################################
# Funciones de gestión de sesiones
################################################################################

get_active_session_path() {
    if [[ -L "$ACTIVE_SESSION_LINK" ]]; then
        readlink "$ACTIVE_SESSION_LINK"
    else
        return 1
    fi
}

check_active_session() {
    if ! get_active_session_path > /dev/null 2>&1; then
        echo "Error: No hay sesión activa. Usa 'start session' o 'issue' primero." >&2
        exit 1
    fi
}

check_no_active_session() {
    if get_active_session_path > /dev/null 2>&1; then
        echo "Error: Ya existe una sesión activa. Usa 'end session' o 'commit' primero." >&2
        exit 1
    fi
}

create_session_metadata() {
    local session_dir="$1"
    local description="$2"
    local issue_number="$3"
    local issue_title="$4"
    local branch_name="$5"
    local github_url="$6"
    
    local session_id=$(get_uuid)
    local start_time=$(get_timestamp)
    local current_dir=$(pwd)
    local git_commit=$(git rev-parse HEAD 2>/dev/null || echo "no-commit")
    local services=$(detect_services)
    
    # Crear evc.json
    cat > "$session_dir/evc.json" << EOF
{
  "session_id": "$session_id",
  "created": "$start_time",
  "status": "active",
  "directory": "$current_dir",
  "git": {
    "branch": "$branch_name",
    "base_commit": "$git_commit",
    "final_commit": null
  },
  "issue": {
    "number": $issue_number,
    "title": "$issue_title",
    "url": "$github_url"
  },
  "service_context": "$services",
  "description": "$description"
}
EOF

    echo "$session_id"
}

create_session_markdown() {
    local session_file="$1"
    local description="$2"
    local start_time="$3"
    local git_info="$4"
    local current_dir="$5"
    local issue_info="$6"
    
    cat > "$session_file" << EOF
# Sesión de Trabajo - $(date '+%Y-%m-%d')

## Metadata
- **Inicio:** $start_time
- **Directorio:** \`$current_dir\`
- $git_info
$issue_info
- **Estado:** Activa

## Descripción Inicial
*$start_time*

$description

## Notas

EOF
}

################################################################################
# Funciones de integración con issues
################################################################################

get_github_issues() {
    # Función mejorada para obtener issues de GitHub
    
    # 1. Auto-detectar owner y repo desde git remote
    local git_remote
    git_remote=$(git remote get-url origin 2>/dev/null) || {
        echo "Error: No se pudo obtener el remoto origin. ¿Estás en un repo Git?" >&2
        return 1
    }
    
    # Extraer owner y repo con patrones más robustos
    local owner repo
    if [[ "$git_remote" =~ git@github\.com:(.+)/(.+)\.git$ ]] || 
       [[ "$git_remote" =~ git@github\.com:(.+)/(.+)$ ]]; then
        owner="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]%.git}"  # Remueve .git si existe
    elif [[ "$git_remote" =~ https://github\.com/(.+)/(.+)\.git$ ]] || 
         [[ "$git_remote" =~ https://github\.com/(.+)/(.+)/?$ ]]; then
        owner="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]%.git}"  # Remueve .git si existe
        repo="${repo%/}"                # Remueve / final si existe
    else
        echo "Error: No se pudo parsear la URL del remoto: $git_remote" >&2
        echo "Formatos soportados: git@github.com:owner/repo.git, https://github.com/owner/repo.git" >&2
        return 1
    fi
    
    # Debug info (comentar en producción)
    # echo "Debug: owner=$owner, repo=$repo" >&2
    
    # 2. Validación de dependencias con información más útil
    if ! command -v jq &> /dev/null; then
        echo "Warning: 'jq' no encontrado. Instala con: apt install jq / brew install jq" >&2
        _fallback_issues
        return 0
    fi
    
    if ! command -v curl &> /dev/null; then
        echo "Warning: 'curl' no encontrado. Instala con: apt install curl" >&2
        _fallback_issues
        return 0
    fi
    
    if [[ -z "$GITHUB_TOKEN" ]]; then
        echo "Warning: GITHUB_TOKEN no configurado." >&2
        echo "Configura con: export GITHUB_TOKEN=your_token_here" >&2
        echo "Crear token en: https://github.com/settings/tokens" >&2
        echo "Permisos necesarios: repo (para repos privados) o public_repo" >&2
        _fallback_issues
        return 0
    fi
    
    # 3. Construir URL con límites razonables
    local api_url="https://api.github.com/repos/${owner}/${repo}/issues"
    api_url+="?state=open&per_page=20&sort=updated&direction=desc"
    
    # 4. Realizar la llamada con timeout y mejor manejo de errores
    local response http_status
    response=$(curl -s --max-time 10 \
        -w "%{http_code}" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "$api_url" 2>/dev/null)
    
    # Separar código HTTP del body
    http_status="${response: -3}"  # Últimos 3 caracteres
    response="${response%???}"     # Todo excepto los últimos 3
    
    # 5. Verificar respuesta HTTP
    case "$http_status" in
        "200")
            # Todo bien, continuar
            ;;
        "401")
            echo "Warning: Token de GitHub inválido o expirado." >&2
            _fallback_issues
            return 0
            ;;
        "404")
            echo "Warning: Repositorio $owner/$repo no encontrado o sin acceso." >&2
            _fallback_issues
            return 0
            ;;
        "403")
            echo "Warning: Rate limit alcanzado o acceso denegado." >&2
            _fallback_issues
            return 0
            ;;
        *)
            echo "Warning: Error HTTP $http_status al acceder a GitHub API." >&2
            _fallback_issues
            return 0
            ;;
    esac
    
    # 6. Validar que la respuesta sea JSON válido
    if ! echo "$response" | jq empty 2>/dev/null; then
        echo "Warning: Respuesta inválida de GitHub API." >&2
        _fallback_issues
        return 0
    fi
    
    # 7. Procesar issues
    local issues_output
    issues_output=$(echo "$response" | jq -r '
        .[] | 
        select(.pull_request == null) | 
        "\(.number)|\(.title)"
    ' 2>/dev/null)
    
    if [[ -z "$issues_output" ]]; then
        echo "Warning: No se encontraron issues abiertos en $owner/$repo." >&2
        _fallback_issues
        return 0
    fi
    
    echo "$issues_output"
}

_fallback_issues() {
    # Issues de ejemplo más realistas
    cat << 'EOF'
4237|JWT tokens expire prematurely in production
4215|Authentication middleware fails after token refresh
4198|User login session timeout causes data loss
4156|Profile update endpoint returns 500 on validation
4089|Database connection pool exhausted under load
4067|Email notification service queue backing up
4043|API rate limiting not working correctly
4021|File upload fails for files larger than 10MB
3998|Search functionality returns inconsistent results
3976|Memory leak in background worker processes
EOF
}

show_issue_selection() {
    local branch_name="$1"
    
    echo "📋 Issues Disponibles para rama '$branch_name':" >&2
    echo "" >&2
    
    # Leer la salida de get_github_issues preservando líneas completas
    local issues
    mapfile -t issues < <(get_github_issues)

    local count=1
    for issue in "${issues[@]}"; do
        local issue_number=$(echo "$issue" | cut -d'|' -f1)
        local issue_title=$(echo "$issue" | cut -d'|' -f2-)
        echo "  [$count] #$issue_number $issue_title" >&2
        ((count++))
    done
    
    echo "" >&2
    echo -n "Selecciona [1-${#issues[@]}] o [q] cancelar: " >&2
    read -r selection
    
    if [[ "$selection" == "q" ]]; then
        echo "Operación cancelada." >&2
        exit 0
    fi
    
    if [[ "$selection" =~ ^[0-9]+$ ]] && [[ "$selection" -ge 1 ]] && [[ "$selection" -le ${#issues[@]} ]]; then
        local selected_issue="${issues[$((selection-1))]}"
        echo "$selected_issue"
    else
        echo "Selección inválida." >&2
        exit 1
    fi
}


################################################################################
# Comandos principales
################################################################################

start_session() {
    local description="$*"
    
    if [[ -z "$description" ]]; then
        echo "Error: La descripción inicial es obligatoria." >&2
        echo "Uso: $0 start session \"Descripción de la sesión\"" >&2
        exit 1
    fi

    ensure_sessions_dir
    check_no_active_session
    validate_not_main_branch

    local session_dir="$SESSIONS_DIR/$(get_session_dirname)"
    local session_file="$session_dir/session.md"
    local start_time=$(get_timestamp)
    local git_info=$(get_git_info)
    local current_dir=$(pwd)
    local current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-branch")

    mkdir -p "$session_dir"

    # Crear metadata para sesión manual
    create_session_metadata "$session_dir" "$description" "null" "null" "$current_branch" ""
    
    # Crear archivo markdown
    create_session_markdown "$session_file" "$description" "$start_time" "$git_info" "$current_dir" ""

    # Crear symlink a sesión activa
    ln -sf "$session_dir" "$ACTIVE_SESSION_LINK"

    echo "Sesión iniciada: $(basename "$session_dir")" >&2
    echo "Descripción: $description" >&2
}

start_session_with_issue() {
    local branch_name="$1"
    
    if [[ -z "$branch_name" ]]; then
        echo "Error: El nombre de la rama es obligatorio." >&2
        echo "Uso: $0 issue \"nombre-de-rama\"" >&2
        exit 1
    fi

    ensure_sessions_dir
    check_no_active_session

    # Validar que estamos en un repositorio git
    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        echo "Error: No estás en un repositorio Git." >&2
        exit 1
    fi

    # Mostrar selección de issues
    local selected_issue=$(show_issue_selection "$branch_name")
    local issue_number=$(echo "$selected_issue" | cut -d'|' -f1)
    local issue_title=$(echo "$selected_issue" | cut -d'|' -f2)

    # Crear y cambiar a nueva rama
    if git show-ref --verify --quiet refs/heads/"$branch_name"; then
        echo "La rama '$branch_name' ya existe. Cambiando a ella..." >&2
        git checkout "$branch_name"
    else
        echo "Creando y cambiando a rama '$branch_name'..." >&2
        git checkout -b "$branch_name"
    fi

    # Crear sesión
    local session_dir="$SESSIONS_DIR/$(get_session_dirname)"
    local session_file="$session_dir/session.md"
    local start_time=$(get_timestamp)
    local git_info=$(get_git_info)
    local current_dir=$(pwd)
    local issue_info="- **Issue:** #$issue_number - $issue_title"
    local description="Trabajar en issue #$issue_number: $issue_title"

    mkdir -p "$session_dir"

    # Crear metadata
    local github_url=""
    if [[ "$issue_number" != "null" ]] && [[ -n "$GITHUB_TOKEN" ]]; then
        # Intentar obtener la URL del repositorio para construir la URL del issue
        local git_remote
        git_remote=$(git remote get-url origin 2>/dev/null)
        if [[ "$git_remote" =~ github\.com[:/](.+)/(.+)\.git$ ]] || [[ "$git_remote" =~ github\.com/(.+)/(.+)/?$ ]]; then
            local owner="${BASH_REMATCH[1]}"
            local repo="${BASH_REMATCH[2]}"
            github_url="https://github.com/$owner/$repo/issues/$issue_number"
        fi
    fi
    
    create_session_metadata "$session_dir" "$description" "$issue_number" "$issue_title" "$branch_name" "$github_url"
    
    # Crear archivo markdown
    create_session_markdown "$session_file" "$description" "$start_time" "$git_info" "$current_dir" "$issue_info"

    # Crear symlink a sesión activa
    ln -sf "$session_dir" "$ACTIVE_SESSION_LINK"

    echo "✅ Workspace inicializado:" >&2
    echo "  - Rama: $branch_name" >&2
    echo "  - Issue: #$issue_number - $issue_title" >&2
    echo "  - Sesión: $(basename "$session_dir")" >&2
}


list_issues() {
    # Solo devuelve la lista sin interacción
    get_github_issues
}

start_session_with_issue_direct() {
    local branch_name="$1"
    local issue_number="$2" 
    local issue_title="$3"
    
    if [[ -z "$branch_name" ]] || [[ -z "$issue_number" ]] || [[ -z "$issue_title" ]]; then
        echo "Error: Faltan argumentos requeridos." >&2
        exit 1
    fi

    ensure_sessions_dir
    check_no_active_session

    if ! git rev-parse --git-dir >/dev/null 2>&1; then
        echo "Error: No estás en un repositorio Git." >&2
        exit 1
    fi

    # Crear/cambiar a rama
    if git show-ref --verify --quiet refs/heads/"$branch_name"; then
        echo "La rama '$branch_name' ya existe. Cambiando a ella..." >&2
        git checkout "$branch_name"
    else
        echo "Creando y cambiando a rama '$branch_name'..." >&2
        git checkout -b "$branch_name"
    fi

    # Crear sesión (ESTA ES LA PARTE QUE FALTABA)
    local session_dir="$SESSIONS_DIR/$(get_session_dirname)"
    local session_file="$session_dir/session.md"
    local start_time=$(get_timestamp)
    local git_info=$(get_git_info)
    local current_dir=$(pwd)
    local issue_info="- **Issue:** #$issue_number - $issue_title"
    local description="Trabajar en issue #$issue_number: $issue_title"

    mkdir -p "$session_dir"

    # Crear metadata
    local github_url=""
    if [[ "$issue_number" != "null" ]] && [[ -n "$GITHUB_TOKEN" ]]; then
        local git_remote
        git_remote=$(git remote get-url origin 2>/dev/null)
        if [[ "$git_remote" =~ github\.com[:/](.+)/(.+)\.git$ ]] || [[ "$git_remote" =~ github\.com/(.+)/(.+)/?$ ]]; then
            local owner="${BASH_REMATCH[1]}"
            local repo="${BASH_REMATCH[2]}"
            github_url="https://github.com/$owner/$repo/issues/$issue_number"
        fi
    fi
    
    create_session_metadata "$session_dir" "$description" "$issue_number" "$issue_title" "$branch_name" "$github_url"
    
    # Crear archivo markdown
    create_session_markdown "$session_file" "$description" "$start_time" "$git_info" "$current_dir" "$issue_info"

    # Crear symlink a sesión activa
    ln -sf "$session_dir" "$ACTIVE_SESSION_LINK"

    echo "✅ Workspace inicializado:" >&2
    echo "  - Rama: $branch_name" >&2
    echo "  - Issue: #$issue_number - $issue_title" >&2
    echo "  - Sesión: $(basename "$session_dir")" >&2
}

add_note() {
    local note_text="$*"
    
    if [[ -z "$note_text" ]]; then
        echo "Error: El texto de la nota es obligatorio." >&2
        echo "Uso: $0 note \"Texto de la nota\"" >&2
        exit 1
    fi

    check_active_session
    
    local session_dir=$(get_active_session_path)
    local session_file="$session_dir/session.md"
    local timestamp=$(get_timestamp)

    # Añadir nota al archivo de sesión
    echo "*$timestamp*" >> "$session_file"
    echo "" >> "$session_file"
    echo "$note_text" >> "$session_file"
    echo "" >> "$session_file"

    echo "Nota añadida a la sesión activa" >&2
}

show_context() {
    check_active_session
    
    local session_dir=$(get_active_session_path)
    local session_file="$session_dir/session.md"
    
    # Mostrar contenido con glow si está disponible, sino cat
    if command -v glow >/dev/null 2>&1; then
        glow "$session_file"
    else
        cat "$session_file"
    fi
    
    # Mostrar contexto adicional de Git
    echo -e "\n--- Contexto Git ---"
    echo "Rama actual: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no-git')"
    echo "Archivos modificados: $(git status --porcelain 2>/dev/null | wc -l || echo '0')"
}

end_session() {
    local closing_note="$*"
    
    if [[ -z "$closing_note" ]]; then
        echo "Error: La nota de cierre es obligatoria." >&2
        echo "Uso: $0 end session \"Resumen final\"" >&2
        exit 1
    fi

    check_active_session
    
    local session_dir=$(get_active_session_path)
    local session_file="$session_dir/session.md"
    local end_time=$(get_timestamp)
    
    # Calcular duración
    local start_time=$(grep "Inicio:" "$session_file" | sed 's/.*Inicio:\*\* //')
    local start_epoch=$(date -d "$start_time" +%s 2>/dev/null || echo "0")
    local end_epoch=$(date -d "$end_time" +%s)
    local duration_seconds=$((end_epoch - start_epoch))
    local duration_minutes=$((duration_seconds / 60))

    local duration_display
    if [[ $duration_minutes -eq 0 ]]; then
        duration_display="${duration_seconds} segundos"
    else
        duration_display="${duration_minutes} minutos"
    fi

    # Añadir nota de cierre
    echo "## Cierre de Sesión" >> "$session_file"
    echo "*$end_time*" >> "$session_file"
    echo "" >> "$session_file"
    echo "$closing_note" >> "$session_file"
    echo "" >> "$session_file"

    # Actualizar metadata en markdown
    sed -i "s/^- \*\*Estado:\*\* Activa$/- **Estado:** Finalizada\n- **Fin:** $end_time\n- **Duración:** $duration_display/" "$session_file"

    # Actualizar metadata en JSON
    local json_file="$session_dir/evc.json"
    if [[ -f "$json_file" ]]; then
        # Actualizar JSON (requiere jq para manipulación compleja, aquí versión simple)
        sed -i 's/"status": "active"/"status": "completed"/' "$json_file"
    fi

    # Eliminar symlink de sesión activa
    rm "$ACTIVE_SESSION_LINK"

    echo "Sesión finalizada: $(basename "$session_dir")" >&2
    echo "Duración: $duration_display" >&2
    echo "Nota de cierre: $closing_note" >&2
}

commit_and_close() {
    local commit_message="$*"
    
    if [[ -z "$commit_message" ]]; then
        echo "Error: El mensaje de commit es obligatorio." >&2
        echo "Uso: $0 commit \"Mensaje del commit\"" >&2
        exit 1
    fi

    check_active_session

    # Validar que hay cambios para commitear
    if [[ -z "$(git status --porcelain 2>/dev/null)" ]]; then
        echo "Error: No hay cambios para commitear." >&2
        exit 1
    fi

    local session_dir=$(get_active_session_path)
    local session_file="$session_dir/session.md"
    local json_file="$session_dir/evc.json"
    local end_time=$(get_timestamp)

    # Hacer commit
    echo "Haciendo commit..." >&2
    git add --all ':!evc'
    git commit -m "$commit_message"
    
    local commit_hash=$(git rev-parse --short HEAD)

    # Actualizar metadata JSON con hash del commit final
    if [[ -f "$json_file" ]]; then
        sed -i "s/\"final_commit\": null/\"final_commit\": \"$commit_hash\"/" "$json_file"
        sed -i 's/"status": "active"/"status": "completed"/' "$json_file"
    fi

    # Calcular duración
    local start_time=$(grep "Inicio:" "$session_file" | sed 's/.*Inicio:\*\* //')
    local start_epoch=$(date -d "$start_time" +%s 2>/dev/null || echo "0")
    local end_epoch=$(date -d "$end_time" +%s)
    local duration_seconds=$((end_epoch - start_epoch))
    local duration_minutes=$((duration_seconds / 60))

    local duration_display
    if [[ $duration_minutes -eq 0 ]]; then
        duration_display="${duration_seconds} segundos"
    else
        duration_display="${duration_minutes} minutos"
    fi

    # Añadir información de commit al markdown
    echo "## Cierre de Sesión" >> "$session_file"
    echo "*$end_time*" >> "$session_file"
    echo "" >> "$session_file"
    echo "**Commit:** $commit_hash - $commit_message" >> "$session_file"
    echo "" >> "$session_file"

    # Actualizar metadata en markdown
    sed -i "s/^- \*\*Estado:\*\* Activa$/- **Estado:** Finalizada\n- **Fin:** $end_time\n- **Duración:** $duration_display\n- **Commit Final:** $commit_hash/" "$session_file"

    # Eliminar symlink de sesión activa
    rm "$ACTIVE_SESSION_LINK"

    echo "✅ Sesión completada:" >&2
    echo "  - Commit: $commit_hash" >&2
    echo "  - Mensaje: $commit_message" >&2
    echo "  - Duración: $duration_display" >&2
    echo "  - Sesión: $(basename "$session_dir")" >&2
}

show_usage() {
    cat << EOF
evc (Entre Vetas Core) - Orquestador de Flujo de Desarrollo

Uso: $0 {start|issue|note|context|end|commit} [argumentos...]

Comandos:
  start session "descripción"   - Inicia sesión manual (trabajo exploratorio)
  issue "rama"                  - Inicializa workspace completo (rama + issue + sesión)
  note "texto"                  - Añade nota timestampeada a sesión activa
  context                       - Muestra contenido de sesión + contexto Git
  end session "nota_cierre"     - Finaliza sesión manual con nota de cierre
  commit "mensaje"              - Cristaliza ciclo completo (commit + cierre)

Ejemplos:
  $0 issue "fix-jwt-expiry"
  $0 note "JWT refresh implementado correctamente"
  $0 context
  $0 commit "Implement JWT refresh token rotation"

Flujo típico:
  1. $0 issue "nombre-rama"        # Selecciona issue, crea rama, inicia sesión
  2. [desarrollo + notas]
  3. $0 commit "mensaje"           # Commit + cierre automático

Estructura generada:
  sessions/
  ├── active_session -> session_YYYY-MM-DD_HHMMSS/
  ├── session_YYYY-MM-DD_HHMMSS/
  │   ├── session.md               # Documentación human-readable
  │   └── evc.json                 # Metadata estructurada
  └── ...
EOF
}

################################################################################
# Procesamiento de comandos
################################################################################

cmd="$1"
subcmd="$2"

case "$cmd" in
    "start")
        if [[ "$subcmd" == "session" ]]; then
            shift 2
            start_session "$@"
        else
            echo "Error: Comando incompleto. Usa 'start session'." >&2
            show_usage
            exit 1
        fi
        ;;
    "list-issues")
    list_issues
    ;;

    "issue-direct")
        shift
        start_session_with_issue_direct "$@"
        ;;
        
    "issue")
        # Mantener compatibilidad con modo CLI actual
        if [[ $# -eq 2 ]]; then
            # Modo CLI directo (comportamiento actual)
            shift
            start_session_with_issue "$@"
        else
            echo "Error: Usa 'issue-direct' para modo TUI o proporciona todos los argumentos." >&2
            exit 1
        fi
        ;;
    
    "note")
        shift
        add_note "$@"
        ;;
    
    "context")
        show_context
        ;;
    
    "end")
        if [[ "$subcmd" == "session" ]]; then
            shift 2
            end_session "$@"
        else
            echo "Error: Comando incompleto. Usa 'end session'." >&2
            show_usage
            exit 1
        fi
        ;;
    
    "commit")
        shift
        commit_and_close "$@"
        ;;
    
    "-h"|"--help"|"help"|"")
        show_usage
        ;;
    
    *)
        echo "Error: Comando desconocido '$cmd'." >&2
        show_usage
        exit 1
        ;;
esac