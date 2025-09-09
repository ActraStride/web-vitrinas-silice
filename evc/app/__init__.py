# app/__init__.py

"""
Entre Vetas Core - Orquestador de infraestructura Docker Compose y Gestión de Sesiones

Este paquete proporciona una interfaz de terminal (TUI) elegante y funcional
para gestionar infraestructura Docker Compose y documentar sesiones de trabajo
a través de scripts shell.
"""

__version__ = "0.1.0"
__author__ = "Entre Vetas Core Team"
__description__ = "TUI para orquestación de infraestructura Docker Compose y gestión de sesiones" # Descripción actualizada

# Importaciones principales para facilitar el uso del paquete

# Ahora importamos InfrastructureModel y SessionModel desde el subpaquete 'models'
# Esto funciona porque 'app/models/__init__.py' los expone.
from .models import SessionModel # Correcto, ya estaba así en tu ejemplo

# Las siguientes importaciones no cambian si sus rutas no lo hicieron
from .views import TuiView
from .presenter import CorePresenter # ¡CAMBIO IMPORTANTE AQUÍ! Renombrado de InfrastructureCore a CorePresenter

# Define lo que se expone cuando alguien hace 'from app import *'
__all__ = [
    "SessionModel",
    "TuiView",
    "CorePresenter" # ¡CAMBIO IMPORTANTE AQUÍ! Renombrado de InfrastructurePresenter a CorePresenter
]