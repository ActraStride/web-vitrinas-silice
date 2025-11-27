// js/app.js
import { elements } from './dom.js';
import { contentData } from './content.js';
import { FADE_ANIMATION_DURATION } from './config.js';
import { initModal } from './modules/modal.js';
import { initProductModal, openProductModal } from './modules/productModal.js';
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

    elements.productsGrid.innerHTML = data.products.map((product, index) => `
        <div class="product-card scroll-animate" data-product-index="${index}">
            <div class="product-image">
                <img src="${product.img}" alt="${product.title}" loading="lazy">
                ${product.price ? `<div class="product-price-badge">Desde ${product.price}</div>` : ''}
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.desc}</p>
                <div class="product-features">
                    ${product.tags.map(tag => `<span class="feature-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');

    attachProductClickHandlers(data.products);
    
    if(animate) setupScrollObserver();
}

/**
 * Agrega click handlers a las tarjetas de producto
 */
function attachProductClickHandlers(products) {
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.cursor = 'pointer'; // Indicador visual de que es clickeable
        
        card.addEventListener('click', (e) => {
            const index = parseInt(card.dataset.productIndex);
            const product = products[index];
            
            // --> CAMBIO PRINCIPAL AQUÍ <--
            // No creamos un objeto nuevo. Simplemente pasamos el objeto 'product' original,
            // que ya contiene toda la información necesaria (incluyendo el array 'images').
            openProductModal(product);
        });
        
        // Efecto hover adicional (opcional)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

function switchSection(sectionName, isInitialLoad = false) {
    if (elements.body.dataset.currentTheme === sectionName) return;

    elements.body.classList.toggle('theme-muebleria', sectionName === 'muebleria');
    elements.body.dataset.currentTheme = sectionName;

    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === sectionName);
    });

    if (isInitialLoad) {
        history.replaceState(null, '', `#${sectionName}`);
    } else {
        history.pushState(null, '', `#${sectionName}`);
    }
    
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

    const initialSection = (hash && contentData[hash]) ? hash : 'vitrinas';

    updateContent(initialSection, false);
    
    elements.body.classList.toggle('theme-muebleria', initialSection === 'muebleria');
    elements.body.dataset.currentTheme = initialSection;
    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === initialSection);
    });

    history.replaceState(null, '', `#${initialSection}`);
}

/**
 * Manejo del botón "Atrás" del navegador
 */
function handlePopState() {
    const hash = window.location.hash.substring(1) || 'vitrinas';
    const section = contentData[hash] ? hash : 'vitrinas';
    
    elements.body.classList.toggle('theme-muebleria', section === 'muebleria');
    elements.body.dataset.currentTheme = section;
    elements.allNavLinks.forEach(navLink => {
        navLink.classList.toggle('active', navLink.dataset.section === section);
    });
    
    elements.contentWrapper.classList.add('fade-out');
    setTimeout(() => {
        updateContent(section, false);
        elements.contentWrapper.classList.remove('fade-out');
    }, FADE_ANIMATION_DURATION);
}

function init() {
    // Inicializar seguimiento (GTM)
    initTracking();
    
    // Inicializar módulos de UI
    initHeader();
    initModal();
    initProductModal();
    initMobileMenu();
    
    // Bind eventos principales de navegación
    elements.allNavLinks.forEach(link => {
        if(link.dataset.section) link.addEventListener('click', handleNavClick);
    });

    // Escuchar el evento popstate para el botón "Atrás"
    window.addEventListener('popstate', handlePopState);

    // Configuración inicial de la página basada en la URL
    handleInitialLoad();
    setupScrollObserver();
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', init);