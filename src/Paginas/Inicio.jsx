import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogoGaddyel, imagenFondo, faqs } from '../Datos/datos.js';
import { obtenerProductos } from '../Servicios/productosService.js';
import carouselService from '../Servicios/carouselService.js';
import Carrusel from '../Componentes/UI/Carrusel/Carrusel.jsx';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal.jsx';
import ImagenArticulo from '../Activos/Imagenes/imagen-articulo/imagen-articulo.jpg';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import ImageOptimizer from '../Componentes/ImageOptimizer.jsx';

/**
 * CTAButton - Componente reutilizable para botones de llamada a acción
 * 
 * @prop {string} to - Ruta de navegación
 * @prop {string} children - Texto del botón
 */
const CTAButton = React.memo(({ to, children }) => (
    <NavLink
        to={to}
        className="inter font-bold bg-purple-500 hover:bg-purple-700 text-black hover:text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:scale-105"
    >
        {children}
    </NavLink>
));
CTAButton.displayName = 'CTAButton';

/**
 * FaqItem - Componente de pregunta frecuente con acordeón
 * 
 * FLUJO:
 * - Usuario hace click en pregunta → toggle isOpen
 * - Si abierta: muestra respuesta con animación
 * - Accesibilidad: aria-expanded, aria-controls
 * 
 * @prop {string} question - Texto de la pregunta
 * @prop {string} answer - Texto de la respuesta
 */
const FaqItem = React.memo(({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const id = `faq-${question.replace(/\s+/g, '-')}`;

    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none transition-colors duration-300"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={id}
            >
                <span className="text-lg font-semibold text-gray-800">{question}</span>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div
                    id={id}
                    className="px-6 pb-4 text-gray-600 leading-relaxed transition-all duration-500 ease-in-out"
                >
                    {answer}
                </div>
            )}
        </div>
    );
});
FaqItem.displayName = 'FaqItem';

/**
 * FLUJO DE DATOS - Página Inicio
 * 
 * 1. Usuario entra a raíz del sitio (/)
 * 2. Componente monta → useEffect dispara fetchData()
 * 3. Promise.all obtiene: productos destacados + imágenes carrusel
 * 4. Hook actualiza estados: productosDestacados, carouselImages
 * 5. Componente re-renderea con datos
 * 6. Usuario ve: Hero, Carrusel, Productos, FAQs, CTA
 * 
 * INTERACCIÓN DEL USUARIO:
 * - Scroll → ScrollReveal anima secciones
 * - Click FAQ → Acordeón abre/cierra
 * - Click "Explorar Catálogo" → Navega a /catalogo
 * - Click "Ver más preguntas" → Muestra todas las FAQs
 * - Click producto destacado → Navega a /catalogo/:id
 * 
 * Cada interacción → Estado local se actualiza → Re-render controlado
 * 
 * RENDIMIENTO:
 * - Promise.all: Peticiones paralelas (no secuenciales)
 * - React.memo: FaqItem y CTAButton memoizados
 * - ImageOptimizer: Lazy loading + Cloudinary
 * - useMemo: faqsToShow calculado solo cuando cambia showAllFaqs
 * 
 * SEO:
 * - react-helmet-async con Schema.org (LocalBusiness)
 * - Open Graph + Twitter Cards completos
 * - Canonical URL
 * - HTML5 semántico: <main>, <article>, <section>
 * 
 * VALIDACIÓN:
 * - Productos: Verificar array antes de .filter()
 * - Imágenes carrusel: Validar existencia
 * - Error handling: Try/catch con retry button
 */
const Inicio = () => {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [carouselImages, setCarouselImages] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // ✅ FLUJO: Obtener datos iniciales al montar componente
    // ¿Por qué useEffect? Datos necesarios antes de renderizar contenido
    // ¿Cuándo? Solo una vez al montar (dependency array vacío)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
                setError(null);

                // ✅ PERFORMANCE: Promise.all para peticiones paralelas
                // Ahorra ~50% del tiempo vs peticiones secuenciales
                const [resultadoProductos, imagenes] = await Promise.all([
                    obtenerProductos(),
                    carouselService.getCarouselImages()
                ]);

                // ✅ VALIDACIÓN: Verificar que productos sea array antes de filtrar
                // Previene crash si backend retorna estructura diferente
                const productos = Array.isArray(resultadoProductos?.productos)
                    ? resultadoProductos.productos
                    : Array.isArray(resultadoProductos?.data)
                        ? resultadoProductos.data
                        : Array.isArray(resultadoProductos)
                            ? resultadoProductos
                            : [];

                const destacados = productos
                    .filter(p => p && p.destacado === true)
                    .slice(0, 3);

                setProductosDestacados(destacados);
                // ✅ VALIDACIÓN: Asegurar que imagenes sea array
                setCarouselImages(Array.isArray(imagenes) ? imagenes : []);
            } catch (err) {
                console.error("Error al obtener datos:", err.message);
                // ✅ ERROR HANDLING: Mensaje específico según tipo de error
                const mensajeError = err.message.includes('timeout')
                    ? 'La conexión tardó demasiado. Por favor, intenta de nuevo.'
                    : err.message.includes('Network')
                        ? 'Sin conexión a internet. Verifica tu red.'
                        : 'No se pudieron cargar los datos. Intenta de nuevo.';
                setError(mensajeError);
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    // ✅ HELPER: Función para reintentar carga de datos
    const handleRetry = () => {
        window.location.reload();
    };

    const [showAllFaqs, setShowAllFaqs] = useState(false);
    const initialFaqCount = 3;

    // ✅ PERFORMANCE: useMemo para evitar cálculo en cada render
    // ¿Por qué? faqsToShow solo debe recalcularse cuando showAllFaqs cambia
    // ¿Por qué no incluir faqs? Es constante importada, nunca cambia
    const faqsToShow = useMemo(() => {
        return showAllFaqs ? faqs : faqs.slice(0, initialFaqCount);
    }, [showAllFaqs]); // ✅ Solo showAllFaqs como dependencia

    return (
        <>
            {/* SEO 2026: Metadatos optimizados para máxima indexación y CTR */}
            <Helmet>
                <title>Gaddyel - Blancos Personalizados | Bordado, Serigrafía | Envíos Argentina</title>
                <meta
                    name="description"
                    content="🔥 Personalización de blancos profesional: camisetas, toallas, gorras, remeras. Bordado y serigrafía de alta calidad. ✅ Envíos a todo el país ✅ Presupuesto sin cargo."
                />
                <meta
                    name="keywords"
                    content="gaddyel, blancos personalizados, camisetas bordadas, toallas personalizadas, gorras serigrafiadas, remeras estampadas, uniformes, merchandising empresarial, regalos corporativos, bordado textil, serigrafía, argentina, buenos aires"
                />
                <link rel="canonical" href="https://proyecto-gaddyel.vercel.app/" />

                {/* Open Graph para Facebook/WhatsApp */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://proyecto-gaddyel.vercel.app/" />
                <meta property="og:title" content="Gaddyel - Blancos Personalizados | Bordado y Serigrafía" />
                <meta property="og:description" content="Especialistas en personalización de camisetas, toallas y gorras. Calidad premium, envíos a todo el país." />
                <meta property="og:site_name" content="Gaddyel" />
                <meta property="og:locale" content="es_AR" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Gaddyel - Blancos Personalizados" />
                <meta name="twitter:description" content="Personalización profesional de textiles: bordado y serigrafía de alta calidad." />

                {/* Schema.org JSON-LD - LocalBusiness + Organization */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'Organization',
                                '@id': 'https://proyecto-gaddyel.vercel.app/#organization',
                                name: 'Gaddyel',
                                url: 'https://proyecto-gaddyel.vercel.app/',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: LogoGaddyel
                                },
                                description: 'Especialistas en personalización de blancos: camisetas, toallas, gorras con bordado y serigrafía profesional',
                                areaServed: {
                                    '@type': 'Country',
                                    name: 'Argentina'
                                },
                                sameAs: []
                            },
                            {
                                '@type': 'LocalBusiness',
                                '@id': 'https://proyecto-gaddyel.vercel.app/#localbusiness',
                                name: 'Gaddyel - Blancos Personalizados',
                                description: 'Personalización de textiles con bordado y serigrafía. Camisetas, toallas, gorras, remeras y uniformes empresariales.',
                                url: 'https://proyecto-gaddyel.vercel.app/',
                                priceRange: '$$',
                                areaServed: 'Argentina',
                                hasOfferCatalog: {
                                    '@type': 'OfferCatalog',
                                    name: 'Catálogo de Blancos Personalizados',
                                    itemListElement: productosDestacados.slice(0, 5).map((producto, idx) => ({
                                        '@type': 'Offer',
                                        position: idx + 1,
                                        url: `https://proyecto-gaddyel.vercel.app/catalogo/${producto._id}`,
                                        priceCurrency: 'ARS',
                                        availability: 'https://schema.org/InStock',
                                        itemOffered: {
                                            '@type': 'Product',
                                            name: producto.nombre,
                                            description: producto.descripcion || 'Producto personalizable de alta calidad',
                                            image: producto.imagenSrc,
                                            brand: {
                                                '@type': 'Brand',
                                                name: 'Gaddyel'
                                            }
                                        }
                                    }))
                                }
                            },
                            {
                                '@type': 'WebSite',
                                '@id': 'https://proyecto-gaddyel.vercel.app/#website',
                                url: 'https://proyecto-gaddyel.vercel.app/',
                                name: 'Gaddyel',
                                description: 'Blancos personalizados con bordado y serigrafía',
                                publisher: {
                                    '@id': 'https://proyecto-gaddyel.vercel.app/#organization'
                                },
                                potentialAction: {
                                    '@type': 'SearchAction',
                                    target: {
                                        '@type': 'EntryPoint',
                                        urlTemplate: 'https://proyecto-gaddyel.vercel.app/catalogo?buscar={search_term_string}'
                                    },
                                    'query-input': 'required name=search_term_string'
                                }
                            }
                        ]
                    })}
                </script>

                {/* Schema.org - FAQPage para preguntas frecuentes */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer
                            }
                        }))
                    })}
                </script>
            </Helmet>

            <div className="w-full min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${imagenFondo})` }}>
                <div className="container mx-auto overflow-hidden">

                    {/* Hero Section - Contenido principal */}
                    <main>
                        <section
                            className="min-h-screen flex items-center justify-center flex-col text-center p-4 md:p-8 bg-white rounded-b-2xl shadow-xl my-24"
                            aria-label="Presentación principal de Gaddyel"
                        >
                            <ImageOptimizer
                                src={LogoGaddyel}
                                alt="Logo Gaddyel - Blanquería personalizada premium"
                                className="mx-auto w-40 h-40 sm:w-48 sm:h-48 md:h-64 md:w-64 lg:h-80 lg:w-80 mb-4 object-contain"
                                width={320}
                                height={320}
                                priority={true}
                            />
                            <h1 className="italic text-3xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-8 leading-tight max-w-4xl mx-auto">
                                <span className="block text-gray-800">Blanquería Personalizada con Distinción</span>
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl h-full mx-auto mb-12">
                                <ScrollReveal>
                                    <article className="text-left p-6 bg-gray-50 rounded-lg shadow-md ">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">La Estrategia detrás del Confort</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            En Gaddyel, no solo personalizamos textiles; **diseñamos embajadores silenciosos para tu negocio**. Entendemos que en un spa, hotel o clínica, el tacto de una bata o la distinción de un logo bordado son las herramientas de marketing más poderosas para fidelizar a tus clientes.
                                        </p>
                                        <p className="text-gray-700 leading-relaxed">
                                            Nuestra blanquería de alta gama fusiona durabilidad extrema con una suavidad que cautiva. Al elegir Gaddyel, no solo adquieres equipamiento profesional, estás invirtiendo en un **sello de identidad** que eleva la percepción de tu servicio y garantiza que tu marca sea la protagonista en la memoria de quien la visita.
                                        </p>
                                    </article>
                                </ScrollReveal>

                                <ScrollReveal>
                                    <div className="flex justify-center items-center h-full">
                                        <ImageOptimizer
                                            src={ImagenArticulo}
                                            alt="Blanquería personalizada Gaddyel - Toallas y batas bordadas de alta calidad"
                                            className="w-full h-auto max-w-lg rounded-lg shadow-xl object-contain"
                                            width={512}
                                            height={512}
                                            loading="lazy"
                                        />
                                    </div>
                                </ScrollReveal>
                            </div>

                            <CTAButton to="/catalogo">
                                Explorar Catálogo
                            </CTAButton>
                        </section>
                    </main>

                    {/* Carrusel */}
                    <section
                        className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 rounded-2xl my-72 shadow-xl"
                        aria-label="Galería de productos destacados"
                    >
                        <div className="flex flex-col items-center w-full">
                            <h2 className="italic text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-8 shrink-0">
                                Nuestros Destacados
                            </h2>
                            <ScrollReveal>
                                {carouselImages?.length > 0 ? (
                                    <Carrusel imagenes={carouselImages} />
                                ) : (
                                    <p className="text-gray-600 text-center">
                                        No hay imágenes para mostrar.
                                    </p>
                                )}
                            </ScrollReveal>
                        </div>
                    </section>


                    {/* Productos destacados dinámicos */}
                    <section
                        className="min-h-screen flex items-center justify-center flex-col p-4 md:p-8 bg-white rounded-2xl my-72 shadow-xl"
                        aria-label="Productos destacados de Gaddyel"
                    >
                        <h2 className="italic text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
                            Productos que te Encantarán
                        </h2>

                        {cargando ? (
                            <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
                                <p className="text-gray-500">Cargando productos destacados...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center" role="alert" aria-live="assertive">
                                <p className="text-red-600 mb-4 font-semibold">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                    aria-label="Reintentar carga de productos"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : productosDestacados.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {productosDestacados.map((producto) => (
                                    <ScrollReveal key={producto._id}>
                                        <TarjetaProducto producto={producto} showPrice={false} />
                                    </ScrollReveal>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">No hay productos destacados disponibles.</p>
                        )}
                    </section>

                    {/* Preguntas frecuentes */}
                    <section
                        className="bg-gray-50 py-16 px-4 sm:px-6 rounded-xl my-72 shadow-xl"
                        aria-label="Preguntas frecuentes sobre Gaddyel"
                    >
                        <h2 className="italic text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                            Preguntas Frecuentes
                        </h2>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {faqsToShow.map((faq, index) => (
                                <ScrollReveal key={index}>
                                    <FaqItem question={faq.question} answer={faq.answer} />
                                </ScrollReveal>
                            ))}
                            {faqs.length > initialFaqCount && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => setShowAllFaqs(!showAllFaqs)}
                                        className="inter font-bold bg-purple-500 hover:bg-purple-700 text-black hover:text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:scale-105"
                                        aria-expanded={showAllFaqs}
                                        aria-label={showAllFaqs ? 'Ver menos preguntas frecuentes' : 'Ver más preguntas frecuentes'}
                                    >
                                        {showAllFaqs ? 'Ver menos preguntas' : 'Ver más preguntas'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTA final */}
                    <section
                        className="min-h-screen flex items-center justify-center flex-col text-center bg-blue-100 p-12 rounded-xl my-72 shadow-xl"
                        aria-label="Llamado a la acción - Contacto"
                    >
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
                                Tu imagen también define cómo te eligen.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal>
                            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-4">
                                La blanquería personalizada no es un detalle decorativo.
                                Es una herramienta que refuerza tu identidad profesional en cada experiencia del cliente.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal>
                            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Si tu centro cuida cada tratamiento, cada protocolo y cada resultado,
                                tu imagen debería comunicar el mismo nivel.
                            </p>
                        </ScrollReveal>

                        <CTAButton to="/contacto">
                            Quiero potenciar mi imagen
                        </CTAButton>
                    </section>

                </div>
            </div>
        </>
    );
};

export default Inicio;
