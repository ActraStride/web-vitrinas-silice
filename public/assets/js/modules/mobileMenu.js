// js/modules/mobileMenu.js
import { elements } from '../dom.js';

function toggleMobileMenu(forceState) {
    const show = forceState !== undefined ? forceState : !elements.navLinksContainer.classList.contains('open');
    elements.navLinksContainer.classList.toggle('open', show);
    elements.hamburger.classList.toggle('open', show);
    elements.menuOverlay.classList.toggle('open', show);
    elements.body.classList.toggle('no-scroll', show);
}

export function initMobileMenu() {
    elements.hamburger.addEventListener('click', () => toggleMobileMenu());
    elements.menuOverlay.addEventListener('click', () => toggleMobileMenu(false));
}

// Exportamos también la función para poder llamarla desde fuera si es necesario
export { toggleMobileMenu };