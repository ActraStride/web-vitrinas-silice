// js/modules/modal.js
import { elements } from '../dom.js';

function toggleModal(show) {
    elements.modal.classList.toggle('active', show);
    elements.body.style.overflow = show ? 'hidden' : '';
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const phone = formData.get('phone');
    
    console.log('Formulario enviado:', Object.fromEntries(formData));
    alert(`¡Gracias por tu interés! Nos comunicaremos contigo pronto al número ${phone}.`);
    
    toggleModal(false);
    e.target.reset();
}

export function initModal() {
    elements.contactNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(true);
    });
    elements.modalCloseBtn.addEventListener('click', () => toggleModal(false));
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