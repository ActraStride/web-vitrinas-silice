// js/modules/auth.js

export function initAuth() {
    const openBtn = document.getElementById('loginBtn'); // Tu candadito
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeLoginBtn');
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginErrorMsg');
    const submitBtn = document.getElementById('loginSubmitBtn');

    // 1. ABRIR Y CERRAR EL MODAL
    if (openBtn) {
        // En tu web principal (js/modules/auth.js)
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const existingToken = localStorage.getItem('silixe_token') || sessionStorage.getItem('silixe_token');
            
            // Si quieres ser estricto, podrías validar el token aquí. 
            // Por ahora, si te da problemas, borra el token manualmente una vez y loguéate de nuevo.
            if (existingToken) {
                window.location.href = '/crm/'; 
                return;
            }
            loginModal.classList.add('active');
        });
    }

    function closeModal() {
        loginModal.classList.remove('active');
        loginForm.reset();
        errorMsg.style.display = 'none';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeModal();
        });
    }

    // 2. PROCESAR EL LOGIN Y EL "RECUÉRDAME"
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const user = document.getElementById('adminUser').value;
            const pass = document.getElementById('adminPass').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            // Estado de carga visual
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Verificando...';
            submitBtn.disabled = true;
            errorMsg.style.display = 'none';

            try {
                // Hacemos fetch a tu backend de Python (lo armaremos luego)
                const response = await fetch('/api/crm/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token; // El JWT que te dará Python

                    // === LA LÓGICA DEL RECUÉRDAME ===
                    if (rememberMe) {
                        // localStorage: Se guarda PERMANENTE en el navegador.
                        localStorage.setItem('silixe_token', token);
                    } else {
                        // sessionStorage: Se borra cuando cierra la pestaña.
                        sessionStorage.setItem('silixe_token', token);
                    }

                    // Redirigir al panel CRM privado
                    window.location.href = '/crm/'; // <-- CAMBIA ESTO por la URL de tu CRM
                } else {
                    // Falló el login
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.textContent = 'Error de conexión con el servidor.';
                errorMsg.style.display = 'block';
            } finally {
                // Restaurar el botón
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}