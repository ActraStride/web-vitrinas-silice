// js/modules/auth.js

export function initAuth() {
    /* 
     * Hemos eliminado la lógica de la modal de login.
     * Ahora, el enlace del candado en el HTML simplemente 
     * redirige a /crm/login.
     * 
     * Tu aplicación Svelte (crm-web) se encargará de:
     * 1. Mostrar la pantalla de login.
     * 2. Validar las credenciales con el backend (crm-service).
     * 3. Guardar el token y gestionar la sesión.
     * 4. Redirigir al dashboard (/crm/) si el usuario ya tiene sesión.
     */
    
    console.log("Módulo Auth inicializado: Redirección delegada al CRM en Svelte.");
}