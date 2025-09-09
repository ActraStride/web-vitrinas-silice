# Entre Vetas Core (EVC) 🏗️

> Orquestador de infraestructura Docker Compose con interfaz de terminal elegante

EVC es una herramienta que proporciona una interfaz de usuario intuitiva (TUI) para gestionar infraestructuras Docker Compose complejas organizadas en grupos lógicos de servicios.

## ✨ Características

- **🎯 Interfaz Interactiva**: TUI elegante con menús visuales y selección múltiple
- **⚡ Modo Línea de Comandos**: Ejecución directa para automatización y scripts
- **📊 Monitoreo en Tiempo Real**: Visualización de logs y salida de comandos en vivo
- **🎛️ Gestión por Grupos**: Organización de servicios en grupos lógicos funcionales
- **🔍 Auto-detección**: Encuentra automáticamente la estructura de tu proyecto
- **🛡️ Validaciones**: Confirmaciones para acciones destructivas y validación de scripts

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd entre-vetas-core

# Instalar en modo desarrollo
pip install -e .

# O instalar desde PyPI (cuando esté disponible)
pip install entre-vetas-core-orchestrator
```

## 📋 Prerrequisitos

- Python 3.8+
- Docker y Docker Compose instalados
- Script `run.sh` ejecutable en la carpeta `scripts/` de tu proyecto

### Estructura de Proyecto Esperada

```
tu-proyecto/
├── scripts/
│   └── run.sh          # Script principal de orquestación
├── docker-compose.yml  # Archivo(s) de Docker Compose
└── ...                 # Otros archivos del proyecto
```

## 🎮 Uso

### Modo Interactivo (TUI)

Simplemente ejecuta `evc` desde cualquier directorio dentro de tu proyecto:

```bash
evc
```

Esto abrirá la interfaz interactiva donde podrás:
- Seleccionar comandos desde un menú visual
- Elegir grupos específicos de servicios
- Ver la ejecución en tiempo real
- Confirmar acciones destructivas

### Modo Línea de Comandos

Para automatización y scripts, usa los comandos directamente:

```bash
# Construir todas las imágenes
evc build

# Construir solo grupos específicos
evc build base web

# Levantar todos los servicios
evc up

# Levantar grupos específicos
evc up timon iot

# Detener todos los servicios
evc down

# Ver logs de un grupo
evc logs web

# Ver estado general
evc status

# Reiniciar servicios específicos
evc restart cadvisor
```

## 🏗️ Grupos de Servicios

EVC organiza los servicios en grupos lógicos predefinidos:

- **`base`**: Servicios fundamentales (bases de datos, cache, etc.)
- **`timon`**: Servicios del módulo Timon
- **`web`**: Servicios web y aplicaciones frontend
- **`iot`**: Servicios relacionados con IoT
- **`cadvisor`**: Monitoreo de contenedores

## 🛠️ Comandos Disponibles

| Comando   | Descripción                    | Ejemplo                |
|-----------|--------------------------------|------------------------|
| `build`   | Construir imágenes Docker      | `evc build web base`   |
| `up`      | Levantar servicios            | `evc up`               |
| `down`    | Detener servicios             | `evc down`             |
| `restart` | Reiniciar servicios           | `evc restart timon`    |
| `logs`    | Ver logs de servicios         | `evc logs web`         |
| `status`  | Ver estado de servicios       | `evc status`           |

## 🔧 Configuración

### Script `run.sh`

EVC requiere un script `run.sh` en la carpeta `scripts/` que actúe como wrapper para Docker Compose. Ejemplo básico:

```bash
#!/bin/bash
# scripts/run.sh

COMMAND=$1
shift
GROUPS=$@

case $COMMAND in
    "build")
        if [ -z "$GROUPS" ]; then
            docker-compose build
        else
            docker-compose build $GROUPS
        fi
        ;;
    "up")
        if [ -z "$GROUPS" ]; then
            docker-compose up -d
        else
            docker-compose up -d $GROUPS
        fi
        ;;
    "down")
        docker-compose down
        ;;
    "status")
        docker-compose ps
        ;;
    "logs")
        if [ -z "$GROUPS" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f $GROUPS
        fi
        ;;
    "restart")
        if [ -z "$GROUPS" ]; then
            docker-compose restart
        else
            docker-compose restart $GROUPS
        fi
        ;;
    *)
        echo "Comando no reconocido: $COMMAND"
        exit 1
        ;;
esac
```

### Personalización de Grupos

Los grupos disponibles están definidos en `app/models.py`. Para personalizarlos:

```python
# En InfrastructureModel.__init__()
self.available_groups = [
    "database",
    "api",
    "frontend",
    "monitoring",
    # tus grupos personalizados
]
```

## 🏛️ Arquitectura

EVC utiliza el patrón MVP (Model-View-Presenter):

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     TuiView     │    │   Presenter     │    │ Infrastructure  │
│                 │◄───┤                 ├───►│     Model       │
│  - Rich UI      │    │  - Flujo App    │    │  - Shell Exec   │
│  - Interacción  │    │  - Validación   │    │  - Validación   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Desarrollo Local

```bash
# Clonar repositorio
git clone <repository-url>
cd entre-vetas-core

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias de desarrollo
pip install -e ".[dev]"

# Ejecutar tests
pytest

# Formatear código
black app/

# Linter
flake8 app/
```

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🚨 Solución de Problemas

### Error: "Script run.sh no encontrado"

Asegúrate de que:
1. Existe el archivo `scripts/run.sh` en tu proyecto
2. El archivo tiene permisos de ejecución: `chmod +x scripts/run.sh`
3. Ejecutas `evc` desde dentro del directorio del proyecto o subdirectorios

### Error: "Grupos inválidos"

Los grupos especificados deben coincidir exactamente con los definidos en el código. Usa `evc status` para ver los grupos disponibles.

### La TUI no se ve correctamente

Asegúrate de usar una terminal que soporte colores y caracteres Unicode. Se recomienda usar terminales modernas como:
- Terminal en macOS
- Windows Terminal
- iTerm2
- Terminales de Linux modernas

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/entre-vetas-core/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/entre-vetas-core/wiki)
- **Email**: soporte@entre-vetas.com

---

**Entre Vetas Core Team** © 2024