// js/app.js
import { elements } from './dom.js';
import { contentData } from './content.js';
import { FADE_ANIMATION_DURATION } from './config.js';
import { initModal } from './modules/modal.js';
import { initMobileMenu, toggleMobileMenu } from './modules/mobileMenu.js';
import { initHeader } from './modules/header.js';
import { setupScrollObserver } from './modules/scrollObserver.js';

function updateContent(sectionName, animate = true) {
    const data = contentData[sectionName];
    if (!data) return;

    elements.contentElements.forEach(el => {
        const key = el.dataset.content;
        if (data[key]) {
            el.tagName === 'IMG' ? (el.src = data[key]) : (el.innerHTML = data[key]);
        }
    });

    elements.productsGrid.innerHTML = data.products.map(product => `
        <div class="product-card scroll-animate">
            <div class="product-image"><img src="${product.img}" alt="${product.title}"></div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.desc}</p>
                <div class="product-features">
                    ${product.tags.map(tag => `<span class="feature-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    if(animate) setupScrollObserver();
}

function switchSection(sectionName) {
    if (elements.body.dataset.currentTheme === sectionName) return;

    elements.body.classList.toggle('theme-muebleria', sectionName === 'muebleria');
    elements.body.dataset.currentTheme = sectionName;

    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === sectionName);
    });
    
    elements.contentWrapper.classList.add('fade-out');
    setTimeout(() => {
        updateContent(sectionName);
        elements.contentWrapper.classList.remove('fade-out');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, FADE_ANIMATION_DURATION);
}

function handleNavClick(e) {
    const link = e.currentTarget;
    const section = link.dataset.section;

    if (section) {
        e.preventDefault();
        switchSection(section);
    }
    // El clic en el botón de contacto ya es manejado por el módulo del modal

    if (elements.navLinksContainer.classList.contains('open')) {
        toggleMobileMenu(false);
    }
}

function init() {
    // Inicializar módulos de UI
    initHeader();
    initModal();
    initMobileMenu();
    
    // Bind eventos principales de navegación
    elements.allNavLinks.forEach(link => {
        if(link.dataset.section) link.addEventListener('click', handleNavClick);
    });

    // Configuración inicial de la página
    updateContent('vitrinas', false);
    setupScrollObserver();
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);