// js/modules/productModal.js

class ProductModal {
    constructor() {
        this.overlay = null;
        this.container = null;
        this.isInitialized = false;
        this.currentProduct = null;
        this.whatsappNumber = '523334683900';

        // --> NUEVO: Estado para el slideshow
        this.slidesContainer = null;
        this.dotsContainer = null;
        this.currentIndex = 0;
    }

    init() {
        if (this.isInitialized) return;
        
        // Crear el HTML del modal
        this.createModalHTML();
        
        // Obtener referencias a los elementos
        this.overlay = document.getElementById('productModal');
        this.container = this.overlay.querySelector('.product-modal-container');
        
        // --> NUEVO: Referencias a elementos del slideshow
        this.slidesContainer = document.getElementById('productModalSlides');
        this.dotsContainer = document.getElementById('productModalDots');

        // Bind eventos
        this.bindEvents();
        
        this.isInitialized = true;
    }

    createModalHTML() {
        // --> MODIFICADO: HTML actualizado para incluir el slideshow
        const modalHTML = `
            <div class="product-modal-overlay" id="productModal">
                <div class="product-modal-container">
                    <button class="product-modal-close" aria-label="Cerrar modal">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="product-modal-image">
                        <div class="slideshow-container">
                            <div class="slideshow-slides" id="productModalSlides">
                                <!-- Las imágenes se generan dinámicamente -->
                            </div>
                            <button class="slideshow-btn prev" id="slideshowPrevBtn" aria-label="Anterior">
                                <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <button class="slideshow-btn next" id="slideshowNextBtn" aria-label="Siguiente">
                                <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                            <div class="slideshow-dots" id="productModalDots">
                                <!-- Los puntos se generan dinámicamente -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-modal-content">
                        <div class="product-modal-header">
                            <h2 id="productModalTitle"></h2>
                            <p id="productModalDescription"></p>
                        </div>
                        
                        <div class="product-modal-features" id="productModalFeatures">
                            <!-- Features se generan dinámicamente -->
                        </div>
                        
                        <div class="product-modal-price" id="productModalPrice" style="display: none;">
                            <span class="product-modal-price-label">Precio desde:</span>
                            <span class="product-modal-price-value" id="productModalPriceValue"></span>
                        </div>
                        
                        <div class="product-modal-actions">
                            <button class="btn-primary" id="productModalQuoteBtn">
                                Solicitar Cotización
                            </button>
                            
                            <a href="#" class="btn-secondary" id="productModalWhatsappBtn" target="_blank" rel="noopener noreferrer">
                                <svg viewBox="0 0 25 25" fill="currentColor" width="23" height="23"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>  
                                WhatsApp
                            </a>
                        </div>
                        
                        <div class="product-modal-delivery">
                            <span id="productModalDelivery"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        // Cerrar con botón X
        const closeBtn = this.overlay.querySelector('.product-modal-close');
        closeBtn.addEventListener('click', () => this.close());
        
        // Cerrar al hacer click fuera del modal
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
        
        // Botón de cotización
        const quoteBtn = document.getElementById('productModalQuoteBtn');
        quoteBtn.addEventListener('click', () => this.handleQuoteClick());
        
        // --> NUEVO: Eventos para los botones del slideshow
        const prevBtn = document.getElementById('slideshowPrevBtn');
        const nextBtn = document.getElementById('slideshowNextBtn');
        prevBtn.addEventListener('click', () => this.showPrevSlide());
        nextBtn.addEventListener('click', () => this.showNextSlide());
    }

    open(productData) {
        this.currentProduct = productData;
        this.populateModal(productData);
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.currentProduct = null;
        this.currentIndex = 0; // --> NUEVO: Resetear índice al cerrar
    }

    
    populateModal(product) {
        console.log("Producto recibido en populateModal:", product);
        // ESTA LÍNEA ES CLAVE:
        // Usa `product.images` si existe. Si no, crea un array usando `product.img`.
        // Esto soluciona el problema para TODOS los productos.
        this.setupSlideshow(product.images || [product.img]);
        
        // Título y descripción (usando "fullDescription")
        document.getElementById('productModalTitle').textContent = product.title;
        document.getElementById('productModalDescription').textContent = product.fullDescription; // <-- CORREGIDO
        
        // Features
        this.renderFeatures(product.features);
        
        // Precio (opcional)
        if (product.price) {
            const priceContainer = document.getElementById('productModalPrice');
            const priceValue = document.getElementById('productModalPriceValue');
            priceContainer.style.display = 'flex';
            priceValue.textContent = product.price;
        } else {
            document.getElementById('productModalPrice').style.display = 'none';
        }
        
        // Delivery info
        const deliveryText = product.delivery || 'Entrega estimada: 3-5 días hábiles.';
        document.getElementById('productModalDelivery').textContent = deliveryText;
        
        // Actualizar link de WhatsApp con mensaje personalizado
        const whatsappBtn = document.getElementById('productModalWhatsappBtn');
        const message = `Hola! Me interesa el producto: *${product.title}*. ¿Podrían darme más información?`;
        whatsappBtn.href = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    setupSlideshow(images) {
        this.slidesContainer.innerHTML = '';
        this.dotsContainer.innerHTML = '';
        this.currentIndex = 0;
        const totalSlides = images.length;

        // YA NO NECESITAMOS ESTO:
        // this.slidesContainer.style.width = `${totalSlides * 100}%`;

        images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'slideshow-slide';
            
            // TAMPOCO NECESITAMOS ESTO:
            // slide.style.width = `${100 / totalSlides}%`;

            const img = document.createElement('img');
            img.src = src;
            img.alt = `${this.currentProduct.title} - Imagen ${index + 1}`;
            slide.appendChild(img);
            this.slidesContainer.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = 'slideshow-dot';
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.showSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        const controls = this.overlay.querySelectorAll('.slideshow-btn, .slideshow-dots');
        if (totalSlides <= 1) {
            controls.forEach(el => el.style.display = 'none');
        } else {
            controls.forEach(el => el.style.display = '');
        }

        this.showSlide(0); // Llama a la versión corregida de showSlide
    }
    
    showSlide(index) {
        const totalSlides = this.slidesContainer.children.length;
        if (totalSlides === 0) return;

        if (index >= totalSlides) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = totalSlides - 1;
        } else {
            this.currentIndex = index;
        }

        // <-- ¡RESTAURAR ESTA LÍNEA! Es la correcta.
        const offset = -this.currentIndex * 100;
        this.slidesContainer.style.transform = `translateX(${offset}%)`;

        // Actualizar puntos
        const dots = this.dotsContainer.querySelectorAll('.slideshow-dot');
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
    }

    showNextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    showPrevSlide() {
        this.showSlide(this.currentIndex - 1);
    }
    // <-- FIN DE NUEVAS FUNCIONES

    renderFeatures(features) {
        const container = document.getElementById('productModalFeatures');
        
        const icons = {
            'lightbulb': '<path d="M9 18h6M10 22h4M15 2a7 7 0 0 1-5 13.4V18a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6A7 7 0 0 1 15 2z"/>',
            'box': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
            'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
            'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
        };
        
        container.innerHTML = features.map(feature => `
            <div class="product-feature-item">
                <svg class="product-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[feature.icon] || icons['box']}
                </svg>
                <span class="product-feature-text">${feature.text}</span>
            </div>
        `).join('');
    }

    handleQuoteClick() {
        // Cerrar este modal
        this.close();
        
        // Abrir el modal de contacto después de un pequeño delay
        setTimeout(() => {
            const contactModal = document.getElementById('contactModal');
            if (contactModal) {
                contactModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Pre-llenar el formulario con el producto seleccionado
                const interestSelect = document.getElementById('interest');
                if (interestSelect && this.currentProduct.category !== undefined) {
                    interestSelect.value = this.currentProduct.category;
                }
            }
        }, 300);
    }
}

// Exportar instancia única (singleton)
const productModal = new ProductModal();

export function initProductModal() {
    productModal.init();
}

export function openProductModal(productData) {
    productModal.open(productData);
}