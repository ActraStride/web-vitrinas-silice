// js/app.js
import { elements } from './dom.js';
import { contentData } from './content.js';
import { FADE_ANIMATION_DURATION } from './config.js';
import { initModal } from './modules/modal.js';
import { initMobileMenu, toggleMobileMenu } from './modules/mobileMenu.js';
import { initHeader } from './modules/header.js';
import { setupScrollObserver } from './modules/scrollObserver.js';
import { initTracking } from './modules/tracking.js';

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

function switchSection(sectionName, isInitialLoad = false) {
    if (elements.body.dataset.currentTheme === sectionName) return;

    elements.body.classList.toggle('theme-muebleria', sectionName === 'muebleria');
    elements.body.dataset.currentTheme = sectionName;

    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === sectionName);
    });

    // Actualiza la URL en la barra de direcciones sin recargar la página
    // Usa replaceState para la carga inicial para no crear una entrada inútil en el historial
    if (isInitialLoad) {
        history.replaceState(null, '', `#${sectionName}`);
    } else {
        history.pushState(null, '', `#${sectionName}`);
    }
    
    // Anima la transición de contenido
    elements.contentWrapper.classList.add('fade-out');
    setTimeout(() => {
        updateContent(sectionName);
        elements.contentWrapper.classList.remove('fade-out');
        if (!isInitialLoad) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, FADE_ANIMATION_DURATION);
}

function handleNavClick(e) {
    const link = e.currentTarget;
    const section = link.dataset.section;

    if (section) {
        e.preventDefault();
        switchSection(section);
    }
    
    if (elements.navLinksContainer.classList.contains('open')) {
        toggleMobileMenu(false);
    }
}

/**
 * Función "Router": Lee el ancla de la URL en la carga inicial
 * para mostrar la sección correcta.
 */
function handleInitialLoad() {
    const hash = window.location.hash.substring(1);

    // Si hay un ancla válida en la URL (ej: #muebleria), muéstrala.
    // De lo contrario, carga 'vitrinas' como la sección por defecto.
    const initialSection = (hash && contentData[hash]) ? hash : 'vitrinas';

    updateContent(initialSection, false); // Carga el contenido inicial sin animar
    
    // Establece el estado visual correcto para la sección inicial
    elements.body.classList.toggle('theme-muebleria', initialSection === 'muebleria');
    elements.body.dataset.currentTheme = initialSection;
    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === initialSection);
    });

    // Asegura que el ancla correcta esté en la URL desde el principio
    history.replaceState(null, '', `#${initialSection}`);
}


function init() {
    // Inicializar seguimiento (GTM)
    initTracking();
    // Inicializar módulos de UI
    initHeader();
    initModal();
    initMobileMenu();
    
    // Bind eventos principales de navegación
    elements.allNavLinks.forEach(link => {
        if(link.dataset.section) link.addEventListener('click', handleNavClick);
    });

    // Configuración inicial de la página basada en la URL
    handleInitialLoad();
    setupScrollObserver();
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);