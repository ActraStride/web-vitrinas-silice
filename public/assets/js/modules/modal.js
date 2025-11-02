// js/modules/modal.js
import { elements } from '../dom.js';

function toggleModal(show) {
    elements.modal.classList.toggle('active', show);
    elements.body.style.overflow = show ? 'hidden' : '';
}

// js/modules/modal.js (dentro de handleFormSubmit)

async function handleFormSubmit(e) { // <-- Convertimos la función a 'async'
    e.preventDefault();
    
    // 1. Obtener los datos del formulario
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // --- ¡AQUÍ ESTÁ EL PUNTO DE ENLACE! ---
    try {
        // 2. Enviar los datos a la API de FastAPI
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Asegúrate de que estos nombres coincidan con tu schema Pydantic
                name: data.name,
                phone_number: data.phone, // ¡OJO! Asegúrate que el name en HTML es "phone"
                option: parseInt(data.interest, 10) // Convertir a número
            }),
        });

        // 3. Verificar si la petición fue exitosa
        if (!response.ok) {
            // Si la API devuelve un error (ej: 422, 500), lo lanzamos
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Ocurrió un error al enviar el formulario.');
        }

        // Si todo fue bien, la API devolvió un 201 Created
        const result = await response.json();
        console.log('Respuesta de la API:', result);

        // 4. Lógica de UI después del éxito
        toggleModal(false);
        e.target.reset();
        window.location.href = 'thank-you.html'; // Redirigir

    } catch (error) {
        console.error('Falló la petición fetch:', error);
        alert('No se pudo enviar el formulario. Revisa la consola para más detalles.');
    }
}

export function initModal() {
    elements.contactNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) toggleModal(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            toggleModal(false);
        }
    });
    elements.contactForm.addEventListener('submit', handleFormSubmit);
}