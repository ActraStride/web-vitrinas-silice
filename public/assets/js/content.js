// js/content.js
export const contentData = {
    vitrinas: {
        // ⭐ NUEVOS TEXTOS - MÁS DIRECTOS Y CON SEO LOCAL
        heroTitle: "Fabricación de Vitrinas en Guadalajara",
        heroSubtitle: "Diseñamos y fabricamos vitrinas y exhibidores de calidad que potencian la venta de tus productos.",
        heroImage: "assets/img/v7.webp", // Mantener imagen actual

        // ⭐ TÍTULO Y SUBTÍTULO DE SECCIÓN MÁS CLAROS
        productsTitle: "Nuestra Gama de Vitrinas y Exhibidores",
        productsSubtitle: "Diseños para cada necesidad y espacio, fabricados con precisión para destacar el valor de tus productos.",
        
        // ⭐ CONTENIDO DE PRODUCTOS REFACTORIZADO (DIRECTO, TÉCNICO Y ÚNICO PARA CADA UNO)
        products: [ 
            { 
                img: 'assets/img/v7.webp', // Mostrador
                title: 'Mostradores', 
                desc: 'El punto de venta ideal. Diseñados para una interacción clara con el cliente y exhibición segura de productos clave.', 
                tags: ['Visibilidad Frontal', 'Punto de Venta', 'Estructura de Aluminio'],
                images: [ 'assets/img/v7.webp', 'assets/img/v3.webp', 'assets/img/v1.webp' ],
                fullDescription: 'Nuestros mostradores son el centro de la interacción comercial. Fabricados con cristal templado y perfiles de aluminio de alta resistencia, ofrecen una exhibición panorámica y segura, ideal para joyerías, ópticas y tiendas de electrónica.',
                features: [
                    { icon: 'search', text: 'Cristal templado de 6mm para máxima seguridad y claridad' },
                    { icon: 'box', text: 'Dimensiones estándar y fabricación a la medida de tu local' },
                    { icon: 'lock', text: 'Chapa de seguridad tipo bancaria con juego de llaves' },
                    { icon: 'lightbulb', text: 'Opción de tiras LED de alta densidad (CRI >90)' }
                ],
                price: '$4,499 MXN',
                delivery: 'Fabricación y entrega: 7-10 días hábiles.',
                category: 0
            },
            { 
                img: 'assets/img/v2.webp', // Exhibidor (de armas)
                title: 'Exhibidores', 
                desc: 'Soluciones de exhibición versátiles. Creamos murales, islas y estanterías que se adaptan a tu producto y espacio.', 
                tags: ['A Medida', 'Mobiliario Comercial', 'Optimización de Espacio'],
                images: [ 'assets/img/v2.webp', 'assets/img/v15.webp'],
                fullDescription: 'Desde exhibidores murales para colecciones hasta islas centrales que definen el flujo de tu tienda. Diseñamos cada pieza pensando en la funcionalidad y la estética, utilizando materiales que complementan tu marca y producto.',
                features: [
                    { icon: 'box', text: 'Diseño estructural a la medida del producto a exhibir' },
                    { icon: 'search', text: 'Opciones en madera, melamina y acabados metálicos' },
                    { icon: 'lightbulb', text: 'Sistemas de anclaje seguros para máxima estabilidad' },
                    { icon: 'lock', text: 'Iluminación focalizada para destacar detalles clave' }
                ],
                price: '$6,499 MXN',
                delivery: 'Tiempo de fabricación según diseño (consultar).',
                category: 0
            },
            { 
                img: 'assets/img/v11.webp', // Aparador
                title: 'Aparadores', 
                desc: 'Elegancia y funcionalidad. Combinan una amplia área de exhibición con almacenamiento seguro en la parte inferior.', 
                tags: ['Almacenamiento Integrado', 'Realce de Producto', 'Iluminación LED'],
                images: [ 'assets/img/v11.webp', 'assets/img/v6.webp', 'assets/img/v8.webp' ],
                fullDescription: 'Perfectos para adosar a la pared, los aparadores ofrecen lo mejor de dos mundos: una vitrina superior de alta visibilidad y un gabinete inferior para guardar inventario. Ideal para boutiques, galerías de arte y tiendas especializadas.',
                features: [
                    { icon: 'lightbulb', text: 'Iluminación LED perimetral para una luz uniforme sin sombras' },
                    { icon: 'search', text: 'Cristal frontal y superior para una vista clara desde cualquier ángulo' },
                    { icon: 'box', text: 'Módulos inferiores con cajones o puertas con cerradura' },
                    { icon: 'lock', text: 'Herrajes de cierre suave en puertas y cajones' }
                ],  
                price: '$4,999 MXN',
                delivery: 'Fabricación y entrega: 10-15 días hábiles.',
                category: 0
            },
            { 
                img: 'assets/img/v13.webp', // Torre (usando la imagen nueva)
                title: 'Torres', 
                desc: 'Maximiza tu exhibición en vertical. Diseño de 360° perfecto para destacar piezas centrales en espacios reducidos.', 
                tags: ['Visibilidad 360°', 'Ahorro de Espacio', 'Diseño Vertical'],
                images: [ 'assets/img/v13.webp' /* Añadir más si tienes */ ],
                fullDescription: 'Las vitrinas de torre son la solución ideal para aprovechar el espacio vertical. Su diseño panorámico las hace perfectas para esquinas o como puntos focales, exhibiendo productos de alto valor como trofeos, joyería o coleccionables.',
                features: [
                    { icon: 'search', text: 'Visibilidad panorámica completa sin obstrucciones de aluminio' },
                    { icon: 'box', text: 'Repisas de cristal flotantes y ajustables en altura' },
                    { icon: 'lock', text: 'Puerta de cristal con bisagras y cerradura de seguridad' },
                    { icon: 'lightbulb', text: 'Iluminación LED cenital con spots para un efecto dramático' }
                ],
                price: '$4,499 MXN',
                delivery: 'Fabricación y entrega: 7-10 días hábiles.',
                category: 0
            },
            { 
                img: 'assets/img/v14.webp', // Panel Ranurado
                title: 'Panel Ranurado', 
                desc: 'Flexibilidad total para tu mercancía. Sistema de panel versátil para colgar y organizar productos de forma dinámica.', 
                tags: ['Sistema Modular', 'Alta Capacidad', 'Organización Versátil'],
                images: [ 'assets/img/v14.webp' /* Añadir más si tienes */ ],
                fullDescription: 'El panel ranurado es la base del retail moderno. Te permite reconfigurar tu exhibición en minutos. Lo integramos en mostradores, murales o góndolas, ofreciendo una solución robusta y adaptable para todo tipo de mercancía.',
                features: [
                    { icon: 'box', text: 'Panel de MDF con ranuras de inserción de aluminio para alta resistencia' },
                    { icon: 'search', text: 'Compatible con una amplia gama de ganchos, ménsulas y accesorios' },
                    { icon: 'lightbulb', text: 'Combinable con módulos de mostrador y almacenamiento inferior' },
                    { icon: 'lock', text: 'Disponible en múltiples acabados y colores para tu marca' }
                ],
                price: '$2,499 MXN',
                delivery: 'Tiempo de fabricación según diseño (consultar).',
                category: 0
            },
            { 
                img: 'assets/img/v12.webp', // Proyectos a medida
                title: 'Proyectos a Medida', 
                desc: '¿Una idea única? La construimos. Nos especializamos en mobiliario comercial complejo y soluciones de exhibición integrales.', 
                tags: ['Diseño Personalizado', 'Identidad de Marca', 'Solución Integral'],
                images: [ 'assets/img/v12.webp', 'assets/img/v2.webp', 'assets/img/v10.webp' ],
                fullDescription: 'Transformamos tu visión en realidad. Trabajamos contigo desde el concepto hasta la instalación para crear espacios comerciales únicos. Desde un kiosco para un centro comercial hasta el equipamiento completo de tu tienda.',
                features: [
                    { icon: 'lightbulb', text: 'Proceso de diseño y renderizado 3D para visualización previa' },
                    { icon: 'search', text: 'Integración de identidad de marca, colores y logotipos' },
                    { icon: 'box', text: 'Selección de materiales especiales y herrajes premium' },
                    { icon: 'lock', text: 'Gestión de proyecto de principio a fin, garantizando calidad' }
                ],  
                price: '(a cotizar)', // Es mejor poner 'a cotizar' para proyectos a medida
                delivery: 'Plazo de entrega definido según la complejidad del proyecto.',
                category: 0
            }
        ]
    },
    // ... aquí iría el resto de tu objeto, si lo hubiera (ej. 'muebleria')
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