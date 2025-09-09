# Sesión de Trabajo - 2025-09-08

## Metadata
- **Inicio:** 2025-09-08 19:00:42
- **Directorio:** `/home/actra_dev/Documents/silixe-web/evc`
- **Rama:** main | **Commit:** 5e5a62d

- **Estado:** Finalizada
- **Fin:** 2025-09-08 19:11:25
- **Duración:** 10 minutos

## Descripción Inicial
*2025-09-08 19:00:42*

Definir el roadmap de issues para el proyecto.

## Notas

*2025-09-08 19:03:18*

Primero que nada tengo que definir la tecnología de despliegue, que, en este caso será Docker, utilizaré un servidor ligero en Nginx para alojar la página detras de un proxy inverso cifrado con cerbot y let's encrypt también montado con nginx.

*2025-09-08 19:05:38*

La arquitectura del proyecto será de vanilla js, lo más ligera posible siguiendo buenas practicas.

*2025-09-08 19:07:54*

Lo primero entonces a mi criterio es comenzar del centro hacia afuera primero definir la estructura básica de directorios, luego montar con docker, luego agregar contenedores de cifrado y proxy inverso y al final integrar docker compose.

*2025-09-08 19:08:38*

Despues de acoplar todo lo anterior descrito en esta sesión lo ideal sería desarrollar un script de despliegue en el servidor de Digital Ocean (Ya listo).

## Cierre de Sesión
*2025-09-08 19:11:25*

El paso siguiente es pasar esto a un LLM para generar unadmap de issues para los primeros días de desarrollo.

