// js/content.js
export const contentData = {
    vitrinas: {
        heroTitle: "Calidad y Diseño en Vitrinas de Exhibición",
        heroSubtitle: "Diseño y fabricación en Guadalajara. Soluciones de exhibición que realzan con elegancia el valor de sus productos.",
        heroImage: "assets/img/v2.webp",
        productsTitle: "Nuestras Vitrinas",
        productsSubtitle: "Combinamos estética y funcionalidad para crear la solución de exhibición que necesita.",
        products: [ 
            { 
                img: 'assets/img/v3.webp',
                title: 'Mostradores', 
                desc: 'Aprovecha el espacio con este mostrador de cristal, ideal para una exhibición segura con visibilidad total.', 
                tags: ['Visibilidad 360°', 'Repisas Ajustables', 'Estructura de Aluminio'],
                // ⭐ Datos para el modal
                images: [
                    'assets/img/v3.webp',
                    'assets/img/v1.webp',
                    'assets/img/v6.webp',

                ],
                fullDescription: 'Mostradores de cristal con estructura de aluminio. Ideales para joyerías, relojerías, ópticas y tiendas de electrónicos. Ofrecen máxima visibilidad todos los ángulos mientras mantienen tus productos seguros.',
                features: [
                    { icon: 'search', text: 'Cristal de 6mm con máxima transparencia' },
                    { icon: 'box', text: 'Medidas: 110 x 120 x 40 cm (Alto/Ancho/Fondo)' },
                    { icon: 'lock', text: 'Cerradura con llave incluida' },
                    { icon: 'lightbulb', text: 'Opción de iluminación LED integrada' }
                ],
                price: '$4,499 MXN',
                delivery: 'Fabricación y entrega: 7-10 días hábiles.',
                category: 0
            },
            { 
                img: 'assets/img/v2.webp',
                title: 'Exhibidores', 
                desc: 'Soluciones versátiles y a medida para su punto de venta, incluyendo mostradores, islas y estanterías adaptadas.', 
                tags: ['A Medida', 'Mobiliario Comercial', 'Optimización de Espacio'],
                // ⭐ Datos para el modal
                images: [
                    'assets/img/v2.webp',
                    'assets/img/v8.webp',
                    'assets/img/v9.webp',
                    'assets/img/v10.webp'
                ],
                fullDescription: 'Exhibidores comerciales diseñados específicamente para tu espacio y productos. Incluye mostradores tipo isla, exhibidores murales, y estanterías modulares que se adaptan a cualquier layout comercial.',
                features: [
                    { icon: 'box', text: 'Fabricamos a la medida de tu espacio' },
                    { icon: 'search', text: 'Materiales de alta calidad: cristal, madera y aluminio' },
                    { icon: 'lightbulb', text: 'Diseño pensado para mejorar la circulación en tu tienda' },
                    { icon: 'lock', text: 'Nos encargamos del montaje e instalación' }
                ],
                price: '$6,499 MXN', // Precio variable según diseño
                delivery: 'Tiempo de fabricación según diseño (consultar).',
                category: 0
            },
            { 
                img: 'assets/img/v7.webp',
                title: 'Vitrinas Iluminadas', 
                desc: 'Con iluminación LED integrada para realzar sus productos. Perfecta para joyerías, ópticas y artículos coleccionables.', 
                tags: ['Iluminación LED', 'Realce de Producto', 'Bajo Consumo'],
                // ⭐ Datos para el modal
                images: [
                    'assets/img/v7.webp',
                    'assets/img/v4.webp'
                ],
                fullDescription: 'Vitrinas con iluminación LED que reparte la luz de forma uniforme, sin crear sombras. Su luz fría no daña los productos delicados y mantiene los colores reales. Perfectas para joyerías, relojerías y todo tipo de colecciones.',
                features: [
                    { icon: 'lightbulb', text: 'Iluminación LED integrada de bajo consumo' },
                    { icon: 'search', text: 'Cristales claros y resistentes para una vista nítida' },
                    { icon: 'box', text: 'Repisas de cristal ajustables en altura' },
                    { icon: 'lock', text: 'Cerradura con llave disponible como opción' }
                ],  
                price: '$4,999 MXN',
                delivery: 'Fabricación y entrega: 10-15 días hábiles.',
                category: 0
            }
        ]
    },
    muebleria: {
        heroTitle: "Carpintería profesional y a la Medida",
        heroSubtitle: "Transformamos espacios con soluciones en madera y otros materiales, diseñadas y fabricadas en Guadalajara.",
        heroImage: "assets/img/m4.webp", 
        productsTitle: "Proyectos de Carpintería a Medida",
        productsSubtitle: "Diseñamos y fabricamos piezas funcionales que se integran perfectamente a su espacio, ya sea residencial o de negocio.",
        products: [
            { 
                img: 'assets/img/m1.webp',
                title: 'Cocinas Integrales', 
                desc: 'Cocinas diseñadas y fabricadas a tu medida. Maximizamos el espacio con materiales duraderos y funcionales.', 
                tags: ['Personalizado', 'Optimización de Espacio', 'Herrajes'],
                // ⭐ Datos para el modal
                fullDescription: 'Cocinas integrales completamente personalizadas. Incluye diseño, fabricación con materiales de tu elección, e instalación profesional. Herrajes de cierre suave, cubiertas de distintos diseños, y acabados en melamina, MDF o madera natural.',
                features: [
                    { icon: 'box', text: 'Diseño previo sin costo adicional' },
                    { icon: 'lock', text: 'Herrajes de cierre suave' },
                    { icon: 'search', text: 'Acabados en melamina, MDF o madera natural' },
                    { icon: 'lightbulb', text: 'Garantía de satisfacción' }
                ],
                price: '$9,999 MXN',
                delivery: 'Proyecto incluye: diseño, fabricación e instalación (4-6 semanas).',
                category: 2
            },
            { 
                img: 'assets/img/m2.webp',
                title: 'Clósets y Vestidores', 
                desc: 'Soluciones de almacenamiento prácticas. Diseñamos interiores según lo que necesitas guardar y organizar.', 
                tags: ['Almacenamiento', 'Interiores a Medida', 'Acabados Diversos'],
                // ⭐ Datos para el modal
                images: [
                    'assets/img/m2.webp',
                    'assets/img/m5.webp',
                    'assets/img/m7.webp',
                ],
                fullDescription: 'Clósets y vestidores walk-in completamente organizados. Diseñamos cada centímetro según tu ropa, zapatos y accesorios. Incluye cajones, zapateras, entrepaños ajustables, y barras para colgar en múltiples niveles.',
                features: [
                    { icon: 'box', text: 'Diseño interior optimizado según tu guardarropa' },
                    { icon: 'lock', text: 'Cajones con rieles telescópicos de alta calidad' },
                    { icon: 'lightbulb', text: 'Opción de iluminación LED integrada' },
                    { icon: 'search', text: 'Acabados en diversos colores y texturas' }
                ],
                price: '$5,999 MXN',
                delivery: 'Fabricación e instalación: 3-4 semanas.',
                category: 2
            },
            { 
                img: 'assets/img/m3.webp',
                title: 'Mobiliario Residencial', 
                desc: 'Mesas, sillas y bancas resistentes para tu hogar. Calidad y diseño adaptado a tus espacios.', 
                tags: ['Durabilidad', 'Diseño Personalizado', 'Fabricación a Medida'],
                // ⭐ Datos para el modal
                images: [
                    'assets/img/m3.webp',
                    'assets/img/m4.webp',
                    'assets/img/m6.webp'
                ],
                fullDescription: 'Mobiliario residencial hecho a mano con maderas seleccionadas. Incluye mesas de comedor, centros de entretenimiento, libreros, bancas, y muebles auxiliares. Cada pieza es fabricada según tus especificaciones exactas.',
                features: [
                    { icon: 'box', text: 'Maderas macizas a elegir: pino, encino o parota' },
                    { icon: 'search', text: 'Acabados a tu gusto: natural, entintado o laqueado' },
                    { icon: 'lock', text: 'Herrajes de alta calidad para mayor durabilidad' }, // Reemplazo de ensambles
                    { icon: 'lightbulb', text: 'Madera tratada con sellador para proteger el acabado' } // Reemplazo de tratamiento
                ],
                price: null, // Precio variable
                delivery: 'Tiempo de fabricación según pieza (2-5 semanas).',
                category: 2
            }
        ]
    }
};