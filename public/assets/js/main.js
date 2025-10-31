// IIFE (Immediately Invoked Function Expression) para encapsular la lógica y evitar la contaminación del scope global.
(function() {
    /**
     * @namespace VitrinasApp
     * @description Objeto principal que encapsula toda la lógica de la aplicación de la página.
     */
    const VitrinasApp = {
        // Referencias a los elementos del DOM cacheados para un acceso rápido.
        elements: {},

        // Constantes de la aplicación.
        config: {
            FADE_ANIMATION_DURATION: 400, // Debe coincidir con la transición CSS en .content-wrapper
        },

        // Contenido dinámico para las diferentes secciones de la página.
        contentData: {
            vitrinas: {
                heroTitle: "El Escenario Perfecto para sus Productos",
                heroSubtitle: "Creamos vitrinas de exhibición que capturan la atención, generan impacto y aumentan el valor percibido.",
                heroImage: "assets/img/glass_showcase_4.png",
                productsTitle: "Nuestras Vitrinas",
                productsSubtitle: "Combinamos estética y funcionalidad para crear la solución de exhibición que necesita.",
                products: [
                    { img: 'assets/img/glass_showcase_4.png', title: 'Vitrina Ejecutiva', desc: 'Diseño minimalista con iluminación LED integrada y sistema de apertura suave.', tags: ['Cristal Templado', 'LED Premium', 'Personalizable'] },
                    { img: 'assets/img/glass_showcase_3.jpeg', title: 'Vitrina Torre', desc: 'Máxima visibilidad con estructura de aluminio anodizado y cristal ultra claro.', tags: ['360° Vista', 'Altura Ajustable', 'Antirreflejo'] },
                    { img: 'assets/img/glass_showcase_2.png', title: 'Vitrina Modular', desc: 'Sistema modular expandible con conectividad inteligente y control remoto.', tags: ['IoT Ready', 'Modular', 'App Control'] }
                ]
            },
            muebleria: {
                heroTitle: "Mobiliario Comercial que Vende por Sí Mismo",
                heroSubtitle: "Diseñamos y fabricamos muebles a la medida que optimizan tu espacio y mejoran la experiencia de compra.",
                heroImage: "assets/img/mueble.png", 
                productsTitle: "Soluciones en Mueblería",
                productsSubtitle: "Desde mostradores hasta islas de exhibición, creamos el mobiliario ideal para tu negocio.",
                products: [
                    { img: 'assets/img/mueble1.png', title: 'Mostrador de Recepción', desc: 'Acabados premium, diseño ergonómico y espacio de almacenamiento integrado.', tags: ['Melamina Alto Brillo', 'Diseño a Medida', 'Iluminación Indirecta'] },
                    { img: 'assets/img/mueble2.png', title: 'Isla de Exhibición Central', desc: 'Perfecta para destacar productos clave y crear flujos de clientes en tu tienda.', tags: ['Vista 360°', 'Almacenamiento Inferior', 'Materiales Mixtos'] },
                    { img: 'assets/img/mueble3.png', title: 'Panel Ranurado y Estantería', desc: 'Solución versátil y adaptable para exhibir una amplia gama de productos de forma ordenada.', tags: ['Alta Resistencia', 'Accesorios Variados', 'Fácil Instalación'] }
                ]
            }
        },

        /**
         * @function init
         * @description Inicializa la aplicación. Se llama cuando el DOM está completamente cargado.
         */
        init() {
            this.cacheDOMElements();
            this.bindEvents();
            this.setupScrollObserver();
            this.updateContent('vitrinas', false); // Carga el contenido inicial sin animación de fade
        },

        /**
         * @function cacheDOMElements
         * @description Selecciona y guarda referencias a los elementos del DOM para evitar consultas repetidas.
         */
        cacheDOMElements() {
            this.elements = {
                body: document.body,
                header: document.getElementById('header'),
                modal: document.getElementById('contactModal'),
                modalCloseBtn: document.getElementById('modalCloseBtn'),
                contactNavBtn: document.getElementById('contactNavBtn'),
                contactForm: document.getElementById('contactForm'),
                navLinksContainer: document.getElementById('navLinks'),
                allNavLinks: document.querySelectorAll('#navLinks a'),
                contentWrapper: document.querySelector('.content-wrapper'),
                contentElements: document.querySelectorAll('[data-content]'),
                productsGrid: document.querySelector('[data-content="productsGrid"]'),
                hamburger: document.getElementById('hamburgerMenu'),
                menuOverlay: document.getElementById('menuOverlay')
            };
        },

        /**
         * @function bindEvents
         * @description Centraliza todos los event listeners de la aplicación.
         */
        bindEvents() {
            window.addEventListener('scroll', () => this.handleHeaderScroll());
            
            this.elements.allNavLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            // Eventos del Modal
            this.elements.modalCloseBtn.addEventListener('click', () => this.toggleModal(false));
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target === this.elements.modal) this.toggleModal(false);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) this.toggleModal(false);
            });
            
            // Evento del Formulario
            this.elements.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Eventos del Menú Móvil
            this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
            this.elements.menuOverlay.addEventListener('click', () => this.toggleMobileMenu(false));
        },

        /**
         * @function handleNavClick
         * @description Maneja los clics en los enlaces de navegación.
         * @param {Event} e - El objeto del evento de clic.
         */
        handleNavClick(e) {
            const link = e.currentTarget;

            if (link.dataset.section) {
                e.preventDefault();
                this.switchSection(link.dataset.section);
            } else if (link.id === 'contactNavBtn') {
                e.preventDefault();
                this.toggleModal(true);
            }

            // Cierra el menú móvil si está abierto después de cualquier clic
            if (this.elements.navLinksContainer.classList.contains('open')) {
                this.toggleMobileMenu(false);
            }
        },

        /**
         * @function switchSection
         * @description Cambia el tema y el contenido de la página.
         * @param {string} sectionName - El nombre de la sección a mostrar ('vitrinas' o 'muebleria').
         */
        switchSection(sectionName) {
            // Evita recargar si ya estamos en la sección
            if (this.elements.body.dataset.currentTheme === sectionName) return;

            // Actualiza la clase del body para el tema CSS
            this.elements.body.classList.toggle('theme-muebleria', sectionName === 'muebleria');
            this.elements.body.dataset.currentTheme = sectionName;

            // Actualiza el enlace activo en la navegación
            this.elements.allNavLinks.forEach(navLink => {
                navLink.classList.toggle('active', navLink.dataset.section === sectionName);
            });
            
            // Animación de desvanecimiento y actualización de contenido
            this.elements.contentWrapper.classList.add('fade-out');
            setTimeout(() => {
                this.updateContent(sectionName);
                this.elements.contentWrapper.classList.remove('fade-out');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, this.config.FADE_ANIMATION_DURATION);
        },

        /**
         * @function updateContent
         * @description Actualiza el contenido dinámico de la página según la sección seleccionada.
         * @param {string} sectionName - El nombre de la sección ('vitrinas' o 'muebleria').
         * @param {boolean} [animate=true] - Si se deben re-observar los elementos para animación.
         */
        updateContent(sectionName, animate = true) {
            const data = this.contentData[sectionName];
            if (!data) return;

            // Actualiza texto, imágenes, etc.
            this.elements.contentElements.forEach(el => {
                const key = el.dataset.content;
                if (data[key]) {
                    el.tagName === 'IMG' ? (el.src = data[key]) : (el.innerHTML = data[key]);
                }
            });

            // Genera la cuadrícula de productos
            this.elements.productsGrid.innerHTML = data.products.map(product => `
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
            
            // Si se especifica, reinicia el observador para animar los nuevos elementos
            if(animate) this.setupScrollObserver();
        },

        /**
         * @function toggleModal
         * @description Muestra u oculta el modal de contacto.
         * @param {boolean} show - True para mostrar, false para ocultar.
         */
        toggleModal(show) {
            this.elements.modal.classList.toggle('active', show);
            this.elements.body.style.overflow = show ? 'hidden' : '';
        },

        /**
         * @function toggleMobileMenu
         * @description Muestra u oculta el menú de navegación móvil.
         * @param {boolean} [forceState] - Opcional. Forzar a un estado (true para abrir, false para cerrar).
         */
        toggleMobileMenu(forceState) {
            const show = forceState !== undefined ? forceState : !this.elements.navLinksContainer.classList.contains('open');
            this.elements.navLinksContainer.classList.toggle('open', show);
            this.elements.hamburger.classList.toggle('open', show);
            this.elements.menuOverlay.classList.toggle('open', show);
            this.elements.body.classList.toggle('no-scroll', show);
        },

        /**
         * @function handleFormSubmit
         * @description Maneja el envío del formulario de contacto.
         * @param {Event} e - El objeto del evento de envío.
         */
        handleFormSubmit(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const phone = formData.get('phone');
            
            console.log('Formulario enviado:', Object.fromEntries(formData));
            alert(`¡Gracias por tu interés! Nos comunicaremos contigo pronto al número ${phone}.`);
            
            this.toggleModal(false);
            e.target.reset();
        },

        /**
         * @function handleHeaderScroll
         * @description Añade o quita una clase al header al hacer scroll para aplicar sombras.
         */
        handleHeaderScroll() {
            this.elements.header.classList.toggle('scrolled', window.scrollY > 50);
        },

        /**
         * @function setupScrollObserver
         * @description Configura el IntersectionObserver para animar elementos al hacer scroll.
         */
        setupScrollObserver() {
            const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const elementsToAnimate = document.querySelectorAll('.scroll-animate');
            elementsToAnimate.forEach((element, index) => {
                // Limpiamos clases y estilos previos para una re-animación limpia
                element.classList.remove('visible');
                element.style.transitionDelay = `${(index % 4) * 100}ms`; // Efecto escalonado sutil
                observer.observe(element);
            });
        }
    };

    // Inicia la aplicación cuando el DOM esté completamente cargado.
    document.addEventListener('DOMContentLoaded', () => VitrinasApp.init());

})();