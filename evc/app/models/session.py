import os
import subprocess
from pathlib import Path
from typing import List, Optional, Tuple, Dict


class SessionModel:
    """
    Modelo para interactuar con sesiones de trabajo documentadas.

    Esta clase encapsula la lógica para encontrar, validar y ejecutar comandos
    del script `sessions.sh` dentro de un proyecto. Permite gestionar sesiones
    de trabajo como iniciar, añadir notas, obtener contexto y finalizar sesiones,
    abstraendo los detalles de la ejecución de subprocessos y la gestión de rutas.
    """
    
    # La subcarpeta de scripts es una constante, no un parámetro configurable
    # Define el nombre del subdirectorio donde se espera encontrar el script 'sessions.sh'.
    _SCRIPT_SUBFOLDER = "scripts"
    
    def __init__(self):
        """
        Inicializa una nueva instancia de SessionModel.

        Al inicializar, busca automáticamente la raíz del proyecto y la ruta
        del script `sessions.sh`. También define los comandos de sesión disponibles.

        Raises:
            FileNotFoundError: Si 'sessions.sh' no se encuentra en la jerarquía
                               de directorios dentro de la subcarpeta esperada.
        """
        # _find_sessions_root ahora devuelve la raíz del proyecto y la ruta real del script.
        # self.project_root: Path al directorio raíz del proyecto (donde se encuentra 'scripts/sessions.sh').
        # self.sessions_script_path: Path completo al script 'sessions.sh'.
        self.project_root, self.sessions_script_path = self._find_sessions_root()
        
        # Comandos disponibles para sesiones que este modelo puede ejecutar.
        self.available_session_commands = [
            "start",
            "list-issues", 
            "issue-direct",
            "issue",
            "note",
            "context",
            "end", 
            "commit"
        ]
            
    def _find_sessions_root(self) -> Tuple[Path, Path]:
        """
        Encuentra la ruta raíz del proyecto buscando el script 'sessions.sh'
        dentro de la subcarpeta definida (`_SCRIPT_SUBFOLDER`).

        La búsqueda se realiza ascendiendo desde el directorio actual hasta
        encontrar el script.

        Returns:
            Tuple[Path, Path]: Una tupla que contiene:
                - Path: La ruta al directorio raíz del proyecto.
                - Path: La ruta completa al script 'sessions.sh'.

        Raises:
            FileNotFoundError: Si 'sessions.sh' no se encuentra dentro de la
                               subcarpeta 'scripts' en la jerarquía de directorios superior.
        """
        current_path = Path.cwd()
        
        # Buscar hacia arriba en la jerarquía de directorios hasta encontrar
        # 'sessions.sh' dentro del subdirectorio 'scripts'.
        while current_path != current_path.parent:
            sessions_script_in_subfolder = current_path / self._SCRIPT_SUBFOLDER / "sessions_test.sh"
            if sessions_script_in_subfolder.exists():
                return current_path, sessions_script_in_subfolder
            
            current_path = current_path.parent # Subir al directorio padre
        
        # Si no se encuentra después de recorrer toda la jerarquía de directorios hasta la raíz.
        raise FileNotFoundError(
            f"No se encontró 'sessions.sh' dentro de la carpeta '{self._SCRIPT_SUBFOLDER}' "
            f"en la jerarquía de directorios superior desde {Path.cwd()}"
        )
    
    def get_project_name(self) -> str:
        """
        Retorna el nombre del directorio raíz del proyecto.

        Returns:
            str: El nombre del proyecto.
        """
        return self.project_root.name
    
    def get_available_session_commands(self) -> List[str]:
        """
        Retorna la lista de comandos de sesión disponibles que el modelo puede ejecutar.

        Returns:
            List[str]: Una copia de la lista de comandos disponibles.
        """
        return self.available_session_commands.copy()
    
    def validate_sessions_script(self) -> Tuple[bool, str]:
        """
        Valida que el script 'sessions.sh' existe y tiene permisos de ejecución.

        Realiza dos comprobaciones: si el archivo existe y si el usuario actual
        tiene permisos para ejecutarlo.

        Returns:
            Tuple[bool, str]: Una tupla donde:
                - bool: True si el script es válido (existe y es ejecutable), False en caso contrario.
                - str: Un mensaje descriptivo del resultado de la validación.
        """
        if not self.sessions_script_path.exists():
            # Este caso debería ser capturado por FileNotFoundError en _find_sessions_root,
            # pero se mantiene como una doble verificación de seguridad.
            return False, f"Script sessions.sh no encontrado en {self.sessions_script_path}"
        
        if not os.access(self.sessions_script_path, os.X_OK):
            # os.X_OK verifica el permiso de ejecución.
            return False, f"Script sessions.sh no es ejecutable: {self.sessions_script_path}"
        
        return True, "Script sessions.sh válido"
    
    def _run_sessions_command(self, command_parts: List[str]) -> subprocess.Popen:
        """
        Ejecuta un comando a través del script 'sessions.sh' como un subproceso.

        Esta es una función interna que maneja la lógica de ejecución del script,
        incluyendo el cambio al directorio raíz del proyecto para asegurar que
        el script se ejecute en el contexto correcto.

        Args:
            command_parts (List[str]): Una lista con las partes del comando
                                       a pasar al script (ej. ['start', 'session', 'descripción']).

        Returns:
            subprocess.Popen: El objeto de proceso en ejecución, permitiendo la
                              interacción con su salida o su finalización.
        """
        # Obtener la ruta del script relativa al project_root.
        # Esto es CRUCIAL para ejecutar el script utilizando una ruta relativa
        # desde la raíz del proyecto, lo que es una práctica común en scripts Bash.
        relative_script_path = self.sessions_script_path.relative_to(self.project_root)

        # Construir el comando completo (ej. ['./scripts/sessions.sh', 'start', 'session', 'descripción']).
        cmd_parts = [str(relative_script_path)] + command_parts
        
        # Cambiar temporalmente al directorio raíz del proyecto.
        # Esto es importante para que 'sessions.sh' pueda gestionar las rutas relativas
        # a la estructura del proyecto correctamente (ej. al guardar archivos de sesión).
        old_cwd = os.getcwd() # Guarda el directorio de trabajo actual para restaurarlo después.
        os.chdir(self.project_root)
        
        try:
            # Ejecutar el comando como un subproceso.
            # stdout=subprocess.PIPE: Captura la salida estándar.
            # stderr=subprocess.STDOUT: Redirige la salida de error a la salida estándar para una única captura.
            # universal_newlines=True: Decodifica la salida como texto usando la codificación por defecto.
            # bufsize=1: Configura un búfer de línea para una lectura más interactiva (linea por linea).
            process = subprocess.Popen(
                cmd_parts,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            return process
        finally:
            # Asegura que el directorio de trabajo original sea restaurado,
            # incluso si ocurre una excepción durante la ejecución del subproceso.
            os.chdir(old_cwd)
    
    def _run_sessions_command_blocking(self, command_parts: List[str]) -> Tuple[int, str]:
        """
        Ejecuta un comando de sesión de forma bloqueante y retorna su resultado completo.

        Este método espera a que el subproceso termine y recolecta toda su salida.

        Args:
            command_parts (List[str]): Lista con las partes del comando a ejecutar.

        Returns:
            Tuple[int, str]: Una tupla que contiene:
                - int: El código de salida del subproceso (0 para éxito, diferente de 0 para error).
                - str: La salida completa (stdout + stderr) del subproceso.
        """
        process = self._run_sessions_command(command_parts)
        output_lines = []
        
        # Leer toda la salida línea por línea mientras el proceso está en ejecución.
        if process.stdout:
            for line in process.stdout:
                output_lines.append(line.rstrip()) # Elimina el salto de línea al final.
        
        # Esperar a que el subproceso termine y obtener su código de retorno.
        return_code = process.wait()
        
        return return_code, "\n".join(output_lines)
    
    def has_active_session(self) -> bool:
        """
        Verifica si hay una sesión de trabajo activa.

        Lo hace ejecutando el comando 'context' del script 'sessions.sh'
        y verificando si su código de retorno es 0 (indicando una sesión activa).

        Returns:
            bool: True si hay una sesión activa, False en caso contrario o si ocurre un error.
        """
        try:
            return_code, _ = self._run_sessions_command_blocking(["context"])
            return return_code == 0
        except Exception:
            # Captura cualquier excepción durante la ejecución del comando,
            # asumiendo que un error implica que no hay sesión activa o no se pudo verificar.
            return False
    
    def get_active_session_info(self) -> Tuple[bool, Dict[str, str]]:
        """
        Obtiene información detallada de la sesión activa, si existe.

        Ejecuta el comando 'context' y parsea su salida para extraer
        el nombre, la hora de inicio y la descripción de la sesión.

        Returns:
            Tuple[bool, Dict[str, str]]: Una tupla donde:
                - bool: True si se encontró una sesión activa y se pudo obtener información, False en caso contrario.
                - Dict[str, str]: Un diccionario con la información de la sesión
                                  (keys: 'status', 'content', 'name', 'start_time', 'description').
                                  Si no hay sesión o hay un error, el diccionario puede estar vacío
                                  o contener un mensaje de error.
        """
        try:
            return_code, output = self._run_sessions_command_blocking(["context"])
            
            if return_code != 0:
                # No hay sesión activa o el comando falló.
                return False, {}
            
            # Parsear la información básica del output.
            # Se asume que el script retorna información estructurada o fácilmente parseable.
            info: Dict[str, str] = {
                'status': 'active',
                'content': output.strip() # Contenido completo de la salida del contexto.
            }
            
            # Intentar extraer información específica si el script la proporciona en líneas predecibles.
            lines = output.strip().split('\n')
            for line in lines:
                if line.startswith('# Sesión:'):
                    info['name'] = line.replace('# Sesión:', '').strip()
                elif line.startswith('**Inicio:**'):
                    info['start_time'] = line.replace('**Inicio:**', '').strip()
                elif line.startswith('**Descripción:**'):
                    info['description'] = line.replace('**Descripción:**', '').strip()
            
            return True, info
            
        except Exception as e:
            # Captura cualquier error durante la ejecución o el parseo.
            return False, {'error': str(e)}
    
    def start_session(self, description: str) -> Tuple[int, str]:
        """
        Inicia una nueva sesión de trabajo con una descripción dada.

        Args:
            description (str): La descripción de la nueva sesión a iniciar.

        Returns:
            Tuple[int, str]: Una tupla con el código de salida y la salida del comando.
        """
        return self._run_sessions_command_blocking(["start", "session", description])
    
    def add_note(self, text: str) -> Tuple[int, str]:
        """
        Añade una nota al archivo de la sesión activa.

        Args:
            text (str): El texto de la nota a añadir.

        Returns:
            Tuple[int, str]: Una tupla con el código de salida y la salida del comando.
        """
        return self._run_sessions_command_blocking(["note", text])
    
    def get_session_context(self) -> Tuple[int, str]:
        """
        Obtiene el contenido completo (contexto) de la sesión activa.

        Esto típicamente incluye el estado actual, notas anteriores y otra información
        relevante proporcionada por el script 'sessions.sh context'.

        Returns:
            Tuple[int, str]: Una tupla con el código de salida y el contenido completo de la sesión.
        """
        return self._run_sessions_command_blocking(["context"])
    
    def end_session(self, closing_note: str = "") -> Tuple[int, str]:
        """
        Finaliza la sesión activa, opcionalmente añadiendo una nota de cierre.

        Args:
            closing_note (str, optional): Una nota de cierre para la sesión.
                                         Se añade solo si no está vacía. Defaults to "".

        Returns:
            Tuple[int, str]: Una tupla con el código de salida y la salida del comando.
        """
        if closing_note:
            return self._run_sessions_command_blocking(["end", "session", closing_note])
        else:
            return self._run_sessions_command_blocking(["end", "session"])
    
    def get_sessions_status(self) -> Tuple[bool, str]:
        """
        Obtiene el estado actual del sistema de sesiones.

        Verifica si hay una sesión activa y, si la hay, retorna su contexto completo.
        De lo contrario, informa que no hay sesión activa.

        Returns:
            Tuple[bool, str]: Una tupla donde:
                - bool: True si la operación fue exitosa (pudo verificar el estado), False si hubo un error.
                - str: Un mensaje descriptivo del estado actual o de cualquier error.
        """
        try:
            has_active = self.has_active_session()
            
            if has_active:
                return_code, context = self.get_session_context()
                if return_code == 0:
                    return True, f"Sesión activa encontrada:\n\n{context}"
                else:
                    return False, "Error obteniendo contexto de sesión activa"
            else:
                return True, "No hay sesión activa"
                
        except Exception as e:
            return False, f"Error obteniendo estado de sesiones: {str(e)}"
    
    def run_sessions_command_streaming(self, command_parts: List[str]) -> subprocess.Popen:
        """
        Ejecuta un comando de sesiones para uso con streaming de salida.

        A diferencia de `_run_sessions_command_blocking`, este método retorna
        el objeto `Popen` directamente, permitiendo al llamador leer la salida
        en tiempo real (streaming) sin esperar a que el proceso termine.
        Es útil para comandos de larga duración o para mostrar el progreso.

        Args:
            command_parts (List[str]): Lista con las partes del comando a ejecutar.

        Returns:
            subprocess.Popen: El objeto de proceso en ejecución.
                              El llamador es responsable de leer la salida y esperar al proceso.
        """
        return self._run_sessions_command(command_parts)

    def list_issues(self) -> Tuple[int, str]:
        """Lista los issues disponibles de GitHub."""
        return self._run_sessions_command_blocking(["list-issues"])

    def start_session_with_issue(self, branch_name: str) -> Tuple[int, str]:
        """Inicia sesión con selección interactiva de issue."""
        return self._run_sessions_command_blocking(["issue", branch_name])

    def start_session_with_issue_direct(self, branch_name: str, issue_number: str, issue_title: str) -> Tuple[int, str]:
        """Inicia sesión con issue específico directamente."""
        return self._run_sessions_command_blocking(["issue-direct", branch_name, issue_number, issue_title])

    def commit_and_close(self, commit_message: str) -> Tuple[int, str]:
        """Hace commit y cierra la sesión."""
        return self._run_sessions_command_blocking(["commit", commit_message])