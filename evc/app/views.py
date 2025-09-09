"""
TuiView - Interfaz de usuario para la TUI de gestión de sesiones
"""
import subprocess
from typing import List, Optional, Dict
from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.panel import Panel
from rich.table import Table
from rich.live import Live
from rich.text import Text
from rich.layout import Layout
from rich import box


class TuiView:
    """
    Vista de la TUI usando Rich para una interfaz elegante de gestión de sesiones
    """
    
    def __init__(self):
        self.console = Console()
        self.live_output_lines = []
    
    def clear_screen(self):
        """Limpia la pantalla"""
        self.console.clear()
    
    def show_header(self, title_text: str):
        """Muestra el header de la aplicación con un título dinámico"""
        header_text = f"📝  Entre Vetas Sessions - {title_text}"
        header_panel = Panel(
            header_text,
            style="bold blue",
            box=box.DOUBLE,
            expand=False
        )
        self.console.print(header_panel)
        self.console.print()
    
    def display_action_menu(self, actions: List[str], action_descriptions: Dict[str, str], menu_title: str = "🎯 Acciones Disponibles") -> Optional[str]:
        """
        Muestra un menú de acciones genérico.
        
        Args:
            actions: Lista de acciones disponibles (ej. ["start", "note"]).
            action_descriptions: Un diccionario mapeando acciones a sus descripciones.
            menu_title: El título a mostrar en la tabla del menú.
            
        Returns:
            La acción seleccionada o None si el usuario quiere salir.
        """
        table = Table(title=menu_title, box=box.ROUNDED)
        table.add_column("Opción", style="cyan", width=8)
        table.add_column("Comando", style="green")
        table.add_column("Descripción", style="white")
        
        for i, action in enumerate(actions, 1):
            description = action_descriptions.get(action, "Ejecutar comando")
            table.add_row(str(i), action, description)
        
        table.add_row("q", "salir", "Salir de la aplicación")
        
        self.console.print(table)
        self.console.print()
        
        while True:
            choice = Prompt.ask(
                "Selecciona una acción",
                choices=[str(i) for i in range(1, len(actions) + 1)] + ["q"],
                show_choices=False
            )
            
            if choice == "q":
                return None  # Señal para salir
            
            try:
                index = int(choice) - 1
                return actions[index]
            except (ValueError, IndexError):
                self.show_error("Opción inválida")
                continue
    
    def show_issues(self, issues_output: str):
        """
        Muestra una lista de issues en formato tabla bonita.
        
        Args:
            issues_output: Texto crudo con formato "id|titulo" por línea.
        """
        if not issues_output.strip():
            self.show_message("No hay issues disponibles", "warning")
            return
        
        lines = issues_output.strip().split("\n")
        rows = [line.split("|", 1) for line in lines if "|" in line]

        if not rows:
            self.show_message("No se encontraron issues válidos", "warning")
            return

        table = Table(
            title="📊 Issues Disponibles",
            box=box.ROUNDED,
            show_lines=True,
            expand=True
        )
        table.add_column("ID", style="bold cyan", justify="right", width=6, no_wrap=True)
        table.add_column("Título", style="white", overflow="fold")

        for issue_id, title in rows:
            # Colorear títulos según categorías
            style = "green"
            if "[Infra]" in title:
                style = "yellow"
            elif "[Core]" in title:
                style = "magenta"
            elif "[Workflow]" in title:
                style = "cyan"

            table.add_row(issue_id.strip(), f"[{style}]{title.strip()}[/{style}]")

        panel = Panel(table, title="✅ Lista de Issues", border_style="blue", box=box.DOUBLE)
        self.console.print(panel)

    def show_live_command_output(self, process: subprocess.Popen):
        """
        Muestra la salida del comando en tiempo real.
        
        Args:
            process: El proceso subprocess en ejecución.
        """
        self.console.print("\n[bold yellow]🚀 Ejecutando comando...[/bold yellow]\n")
        
        # Panel para la salida en vivo
        with Live(console=self.console, refresh_per_second=4) as live:
            output_lines = []
            
            if process.stdout:
                for line in process.stdout:
                    line = line.rstrip()
                    output_lines.append(line)
                    
                    # Mantener solo las últimas 30 líneas para no desbordar
                    if len(output_lines) > 30:
                        output_lines.pop(0)
                    
                    # Crear panel con la salida
                    output_text = "\n".join(output_lines)
                    panel = Panel(
                        output_text,
                        title="📋 Salida del Comando",
                        border_style="green"
                    )
                    live.update(panel)
        
        # Mostrar resultado final
        return_code = process.wait()
        if return_code == 0:
            self.console.print("\n[bold green]✅ Comando ejecutado exitosamente[/bold green]")
        else:
            self.console.print(f"\n[bold red]❌ Comando falló con código: {return_code}[/bold red]")
        
        self.console.print("\n[dim]Presiona Enter para continuar...[/dim]")
        input()
    
    def show_message(self, message: str, style: str = "info"):
        """
        Muestra un mensaje informativo.
        
        Args:
            message: El mensaje a mostrar.
            style: El estilo del mensaje (info, success, warning, error).
        """
        styles = {
            "info": ("blue", "ℹ️"),
            "success": ("green", "✅"),
            "warning": ("yellow", "⚠️"),
            "error": ("red", "❌")
        }
        
        color, icon = styles.get(style, styles["info"])
        self.console.print(f"[{color}]{icon} {message}[/{color}]")
    
    def show_error(self, error_message: str):
        """Muestra un mensaje de error."""
        self.show_message(error_message, "error")
    
    def ask_confirmation(self, message: str) -> bool:
        """
        Pide confirmación al usuario.
        
        Args:
            message: El mensaje de confirmación.
            
        Returns:
            True si el usuario confirma, False en caso contrario.
        """
        return Confirm.ask(f"[yellow]⚠️  {message}[/yellow]")
    
    def show_status_info(self, success: bool, output: str, title: str = "Estado"):
        """
        Muestra información de estado en un panel.
        
        Args:
            success: True si la operación fue exitosa, False en caso contrario.
            output: El texto a mostrar en el panel.
            title: El título del panel.
        """
        if success:
            panel = Panel(
                output,
                title=f"📊 {title}",
                border_style="green"
            )
        else:
            panel = Panel(
                output,
                title=f"❌ {title} (Error)",
                border_style="red"
            )
        
        self.console.print(panel)
    
    def get_user_input(self, prompt_message: str, optional: bool = False) -> str:
        """
        Pide una entrada de texto al usuario.

        Args:
            prompt_message: El mensaje a mostrar al usuario.
            optional: Si la entrada es opcional (permitir cadena vacía).

        Returns:
            La cadena de texto introducida por el usuario.
        """
        while True:
            user_input = Prompt.ask(f"[blue]{prompt_message}[/blue]")
            if not user_input.strip() and not optional:
                self.show_error("La entrada no puede estar vacía. Por favor, inténtalo de nuevo.")
            else:
                return user_input.strip()

    def pause_for_user(self):
        """Pausa hasta que el usuario presione Enter."""
        self.console.print("\n[dim]Presiona Enter para continuar...[/dim]")
        input()

    def display_issue_selection_menu(self, issues_output: str) -> Optional[str]:
        """
        Muestra una lista de issues para selección interactiva.

        Args:
            issues_output: La salida cruda del comando list-issues (formato "id|titulo")

        Returns:
            El issue seleccionado en formato "número|título" o None si se cancela
        """
        if not issues_output.strip():
            self.show_message("No hay issues disponibles", "warning")
            return None

        # Parsear issues en formato id|titulo
        issues = []
        for line in issues_output.strip().splitlines():
            if "|" in line:
                number, title = line.split("|", 1)
                issues.append((number.strip(), title.strip()))

        if not issues:
            self.show_message("No se encontraron issues válidos", "warning")
            return None

        # Crear tabla interactiva
        table = Table(title="📋 Seleccionar Issue", box=box.ROUNDED, show_lines=True)
        table.add_column("Opción", style="bold cyan", width=8, justify="center")
        table.add_column("ID", style="yellow", width=6, justify="right")
        table.add_column("Título", style="white", overflow="fold")

        for i, (number, title) in enumerate(issues, 1):
            # Colorear según categorías
            style = "white"
            if "[Infra]" in title:
                style = "bold yellow"
            elif "[Core]" in title:
                style = "magenta"
            elif "[Workflow]" in title:
                style = "cyan"

            table.add_row(str(i), number, f"[{style}]{title}[/{style}]")

        table.add_row("q", "-", "[red]Cancelar[/red]")

        panel = Panel(table, border_style="blue", box=box.DOUBLE, title="Issues")
        self.console.print(panel)
        self.console.print()

        while True:
            choice = Prompt.ask(
                "Selecciona un issue",
                choices=[str(i) for i in range(1, len(issues) + 1)] + ["q"],
                show_choices=False
            )

            if choice == "q":
                return None

            try:
                index = int(choice) - 1
                number, title = issues[index]
                return f"{number}|{title}"
            except (ValueError, IndexError):
                self.show_error("Opción inválida")
                continue