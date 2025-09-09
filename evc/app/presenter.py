"""
CorePresenter - Orquestador del flujo de la TUI para gestión de sesiones
"""
from typing import Optional
from .models import SessionModel
from .views import TuiView


class CorePresenter:
    """
    Presenter que orquesta la interacción entre el modelo de sesiones y la vista.
    """
    
    def __init__(self, session_model: SessionModel, view: TuiView):
        """
        Inicializa el presentador con el modelo de sesión y la vista.

        Args:
            session_model: El modelo para gestionar las sesiones de trabajo.
            view: La vista para interactuar con el usuario.
        """
        self.session_model = session_model
        self.view = view

        # Descripciones de los comandos de sesión
        self._session_command_descriptions = {
            "start session": "Iniciar una nueva sesión de trabajo",
            "list-issues": "Listar issues disponibles de GitHub",
            "issue-direct": "Iniciar sesión con issue específico",
            "issue": "Iniciar sesión seleccionando issue interactivamente", 
            "note": "Añadir una nota a la sesión activa",
            "context": "Ver el contexto y notas de la sesión activa",
            "end session": "Finalizar la sesión activa",
            "commit": "Hacer commit y cerrar sesión",
            "status": "Ver estado actual del gestor de sesiones"
        }
    
    def start(self):
        """
        Punto de entrada principal para la TUI interactiva.
        Realiza validaciones iniciales y comienza el bucle del menú principal.
        """
        try:
            # Validar que el script sessions.sh existe y es ejecutable
            is_session_valid, session_validation_message = self.session_model.validate_sessions_script()
            if not is_session_valid:
                self.view.show_error(session_validation_message)
                return
            
            # Mostrar header
            self.view.clear_screen()
            
            # Obtener nombre del proyecto para el header
            project_name = self.session_model.get_project_name()
            
            # Usar el nombre del proyecto como principal en el header
            self.view.show_header(f"Sesiones - {project_name}")
            
            # Mostrar mensajes de bienvenida y validación
            self.view.show_message(
                f"Gestor de sesiones detectado en: {self.session_model.project_root}",
                "success"
            )
            self.view.show_message(session_validation_message, "info")
            
            # Iniciar el bucle del menú principal
            self._loop_session_menu()
            
        except KeyboardInterrupt:
            self.view.show_message("\n¡Hasta luego! 👋", "info")
        except Exception as e:
            self.view.show_error(f"Error inesperado: {str(e)}")
            self.view.pause_for_user()
    
    def _loop_session_menu(self):
        """
        Bucle para gestionar los comandos de sesión.
        """
        while True:
            self.view.clear_screen()
            project_name = self.session_model.get_project_name()
            self.view.show_header(f"🗓️  Sesiones - {project_name}")
            self.view.console.print("[bold yellow]Gestión de Sesiones de Trabajo[/bold yellow]\n")

            selected_action = self._show_session_menu()
            
            if selected_action is None:  # El usuario eligió salir
                break
            
            self._handle_session_action(selected_action)

    def _show_session_menu(self) -> Optional[str]:
        """
        Muestra el menú de comandos de sesión y retorna la acción seleccionada.

        Returns:
            La acción seleccionada o None si el usuario quiere salir.
        """
        available_commands = self.session_model.get_available_session_commands()
        return self.view.display_action_menu(
            available_commands,
            self._session_command_descriptions,
            menu_title="📝 Comandos de Sesión"
        )

    def _handle_session_action(self, action: str):
        """
        Maneja la acción de sesión seleccionada por el usuario.

        Args:
            action: La acción a ejecutar.
        """
        try:
            if action == "start":
                self._handle_start_session()
            elif action == "list-issues":
                self._handle_list_issues()
            elif action == "issue-direct":
                self._handle_issue_direct()
            elif action == "issue":
                self._handle_issue_interactive()
            elif action == "note":
                self._handle_add_note()
            elif action == "context":
                self._handle_get_session_context()
            elif action == "end":
                self._handle_end_session()
            elif action == "commit":
                self._handle_commit_and_close()
            elif action == "status":
                self._handle_session_status()
            else:
                self.view.show_error(f"Comando de sesión desconocido: {action}")
            self.view.pause_for_user()
        except Exception as e:
            self.view.show_error(f"Error ejecutando acción de sesión '{action}': {str(e)}")
            self.view.pause_for_user()

    def _handle_session_status(self):
        """
        Obtiene y muestra el estado actual de las sesiones.
        """
        self.view.show_message("Obteniendo estado de sesiones...", "info")
        success, output = self.session_model.get_sessions_status()
        self.view.show_status_info(success, output, title="Estado de Sesiones")

    def _handle_start_session(self):
        """
        Maneja el inicio de una nueva sesión.
        """
        self.view.show_message("Iniciando nueva sesión...", "info")
        description = self.view.get_user_input("Introduce una descripción para la nueva sesión")
        if not description:
            self.view.show_message("Descripción vacía. Sesión no iniciada.", "warning")
            return

        return_code, output = self.session_model.start_session(description)
        if return_code == 0:
            self.view.show_message(f"✅ Sesión iniciada exitosamente:\n{output}", "success")
        else:
            self.view.show_error(f"❌ Error al iniciar sesión (código {return_code}):\n{output}")

    def _handle_add_note(self):
        """
        Maneja la adición de una nota a la sesión activa.
        """
        if not self.session_model.has_active_session():
            self.view.show_message("No hay una sesión activa para añadir notas.", "warning")
            return

        self.view.show_message("Añadiendo nota a la sesión activa...", "info")
        note_text = self.view.get_user_input("Introduce el texto de la nota")
        if not note_text:
            self.view.show_message("Nota vacía. No se añadió nada.", "warning")
            return

        return_code, output = self.session_model.add_note(note_text)
        if return_code == 0:
            self.view.show_message(f"✅ Nota añadida exitosamente:\n{output}", "success")
        else:
            self.view.show_error(f"❌ Error al añadir nota (código {return_code}):\n{output}")

    def _handle_get_session_context(self):
        """
        Maneja la obtención y muestra el contexto completo de la sesión activa.
        """
        if not self.session_model.has_active_session():
            self.view.show_message("No hay una sesión activa para mostrar contexto.", "warning")
            return

        self.view.show_message("Obteniendo contexto de sesión activa...", "info")
        return_code, output = self.session_model.get_session_context()
        if return_code == 0:
            self.view.show_status_info(True, output, title="Contexto de Sesión Activa")
        else:
            self.view.show_error(f"❌ Error al obtener contexto (código {return_code}):\n{output}")

    def _handle_end_session(self):
        """
        Maneja la finalización de la sesión activa.
        """
        if not self.session_model.has_active_session():
            self.view.show_message("No hay una sesión activa para finalizar.", "warning")
            return

        if not self.view.ask_confirmation("¿Estás seguro de finalizar la sesión activa?"):
            self.view.show_message("Operación cancelada.", "warning")
            return

        self.view.show_message("Finalizando sesión activa...", "info")
        closing_note = self.view.get_user_input("Introduce una nota de cierre (opcional)", optional=True)

        return_code, output = self.session_model.end_session(closing_note)
        if return_code == 0:
            self.view.show_message(f"✅ Sesión finalizada exitosamente:\n{output}", "success")
        else:
            self.view.show_error(f"❌ Error al finalizar sesión (código {return_code}):\n{output}")
        
    def _handle_list_issues(self):
        """Maneja el listado de issues disponibles."""
        self.view.show_message("Obteniendo issues disponibles...", "info")
        return_code, output = self.session_model.list_issues()
        if return_code == 0:
            self.view.show_issues(output)
        else:
            self.view.show_error(f"Error al obtener issues (código {return_code}):\n{output}")

    def _handle_issue_direct(self):
        """Maneja el inicio de sesión con issue específico."""
        branch_name = self.view.get_user_input("Introduce el nombre de la rama")
        if not branch_name:
            self.view.show_message("Nombre de rama requerido.", "warning")
            return
        
        issue_number = self.view.get_user_input("Introduce el número del issue")
        issue_title = self.view.get_user_input("Introduce el título del issue")
        
        if not issue_number or not issue_title:
            self.view.show_message("Issue number y título son requeridos.", "warning")
            return
        
        return_code, output = self.session_model.start_session_with_issue_direct(branch_name, issue_number, issue_title)
        if return_code == 0:
            self.view.show_message(f"Sesión iniciada con issue:\n{output}", "success")
        else:
            self.view.show_error(f"Error iniciando sesión con issue:\n{output}")

    def _handle_issue_interactive(self):
        """Maneja el inicio de sesión con selección interactiva de issue."""
        
        # Primero obtener la lista de issues
        self.view.show_message("Obteniendo lista de issues...", "info")
        return_code, issues_output = self.session_model.list_issues()
        
        if return_code != 0:
            self.view.show_error(f"Error obteniendo issues:\n{issues_output}")
            return
        
        # Mostrar selección interactiva
        selected_issue = self.view.display_issue_selection_menu(issues_output)
        if not selected_issue:
            self.view.show_message("Selección cancelada.", "warning")
            return
        
        # Extraer número y título del issue seleccionado
        issue_number, issue_title = selected_issue.split('|', 1)
        
        # Generar nombre de rama sugerido
        suggested_branch = f"feat/{issue_number}-{issue_title.strip().lower().replace(' ', '-')[:30]}"
        
        # Preguntar al usuario (con valor por defecto sugerido)
        branch_name = self.view.get_user_input(
            f"Introduce el nombre de la rama [{suggested_branch}]: "
        ) or suggested_branch
        
        if not branch_name:
            self.view.show_message("Nombre de rama requerido.", "warning")
            return
        
        # Usar issue-direct con los datos seleccionados
        return_code, output = self.session_model.start_session_with_issue_direct(
            branch_name, issue_number, issue_title
        )
        if return_code == 0:
            self.view.show_message(f"Sesión iniciada con issue:\n{output}", "success")
        else:
            self.view.show_error(f"Error iniciando sesión con issue:\n{output}")

    def _handle_commit_and_close(self):
        """Maneja el commit y cierre de sesión."""
        if not self.session_model.has_active_session():
            self.view.show_message("No hay una sesión activa para cerrar.", "warning")
            return
        
        commit_message = self.view.get_user_input("Introduce el mensaje del commit")
        if not commit_message:
            self.view.show_message("Mensaje de commit requerido.", "warning")
            return
        
        return_code, output = self.session_model.commit_and_close(commit_message)
        if return_code == 0:
            self.view.show_message(f"Sesión cerrada con commit:\n{output}", "success")
        else:
            self.view.show_error(f"Error al cerrar sesión:\n{output}")