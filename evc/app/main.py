"""
main.py - Punto de entrada principal para Entre Vetas Sessions
"""
import sys
import argparse

from .models import SessionModel
from .views import TuiView
from .presenter import CorePresenter


def create_argument_parser() -> argparse.ArgumentParser:
    """
    Crea y configura el parser de argumentos
    
    Returns:
        ArgumentParser configurado
    """
    parser = argparse.ArgumentParser(
        prog="evc-sessions",
        description="Entre Vetas Sessions - Gestor de sesiones de trabajo documentadas",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos de uso:
  evc-sessions                  # Modo interactivo (TUI)

Comandos de sesión disponibles en modo interactivo:
  - start session: Iniciar una nueva sesión de trabajo
  - list-issues: Listar issues disponibles de GitHub
  - issue-direct: Iniciar sesión con issue específico
  - issue: Iniciar sesión seleccionando issue interactivamente
  - note: Añadir una nota a la sesión activa
  - context: Ver el contexto y notas de la sesión activa
  - end session: Finalizar la sesión activa
  - commit: Hacer commit y cerrar sesión
  - status: Ver estado actual del gestor de sesiones

Todas las funcionalidades están disponibles únicamente en el modo interactivo (TUI).
        """
    )
    
    parser.add_argument(
        "--version",
        action="version",
        version="evc-sessions 0.1.0"
    )
    
    return parser


def run_interactive_mode():
    """
    Ejecuta la aplicación en modo interactivo (TUI).
    """
    try:
        session_model = SessionModel()
        view = TuiView()
        
        presenter = CorePresenter(session_model, view)
        
        presenter.start()
    except FileNotFoundError as e:
        print(f"Error de configuración inicial: {e}")
        print("Asegúrate de ejecutar 'evc-sessions' desde un directorio dentro de tu proyecto, "
              "donde se encuentre la carpeta 'scripts' con 'sessions.sh'.")
        sys.exit(1)


def main():
    """
    Función principal - punto de entrada del comando evc-sessions
    """
    parser = create_argument_parser()
    args = parser.parse_args()
    
    try:
        # Solo modo interactivo - mostrar TUI
        run_interactive_mode()
            
    except KeyboardInterrupt:
        print("\n¡Operación cancelada por el usuario!")
        sys.exit(130)  # Código estándar para Ctrl+C
    except Exception as e:
        # Esto atrapará errores no manejados
        print(f"Error crítico inesperado: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()