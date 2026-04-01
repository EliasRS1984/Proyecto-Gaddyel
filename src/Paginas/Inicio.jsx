import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogoGaddyel, imagenFondo, getFaqs } from '../Datos/datos.js';
import { useShippingConfig } from '../hooks/useShippingConfig';
import { seoMeta } from '../utils/seoMeta';
import { obtenerProductos } from '../Servicios/productosService.js';
import carouselService from '../Servicios/carouselService.js';
import Carrusel from '../Componentes/UI/Carrusel/Carrusel.jsx';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal.jsx';
import ParallaxBackground from '../Componentes/UI/ParallaxBackground/ParallaxBackground.jsx';
import FaqItem from '../Componentes/FaqItem';
import ImagenArticulo from '../Activos/Imagenes/imagen-articulo/imagen-articulo.jpg';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import ImageOptimizer from '../Componentes/ImageOptimizer.jsx';
import { logger } from '../utils/logger';
import useLoadingMessage from '../hooks/useLoadingMessage';

/**
 * CTAButton - Componente reutilizable para botones de llamada a acción
 * 
 * DISEÑO:
 * - Paleta indigo (no purple) según Design System
 * - Transiciones de 500ms ease-out (profesionales)
 * - Focus states con ring slate
 * - Hover scale sutil (105%)
 * - Typography tracking-tight
 * 
 * @prop {string} to - Ruta de navegación
 * @prop {string} children - Texto del botón
 */
const CTAButton = React.memo(({ to, children }) => (
    <NavLink
        to={to}
        className="
            inline-block
            font-semibold tracking-tight
            bg-indigo-600 hover:bg-indigo-700 
            dark:bg-indigo-500 dark:hover:bg-indigo-600
            text-white
            py-3 px-8
            rounded-full
            transition-all duration-500 ease-out
            hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            shadow-lg hover:shadow-xl
        "
    >
        {children}
    </NavLink>
));
CTAButton.displayName = 'CTAButton';

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
    const { mensaje: mensajeCarga, submensaje, isLong } = useLoadingMessage(cargando);

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
                logger.error("Error al obtener datos:", err.message);
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

    // Obtiene la cantidad mínima de productos para envío gratis desde el servidor.
    // Si el admin cambia el valor en el panel, el FAQ se actualiza automáticamente.
    // ¿El FAQ siempre muestra "3"? Revisá useShippingConfig.js y /api/config/envio
    const { cantidadMinima } = useShippingConfig();

    // Genera el array de FAQs con el valor dinámico de cantidadMinima.
    // Se recalcula solo si cantidadMinima o showAllFaqs cambian.
    const faqs = useMemo(() => getFaqs(cantidadMinima), [cantidadMinima]);
    const faqsToShow = useMemo(() => {
        return showAllFaqs ? faqs : faqs.slice(0, initialFaqCount);
    }, [showAllFaqs, faqs]);

    return (
        <>
            {/* SEO 2026: Metadatos optimizados para máxima indexación y CTR */}
            <Helmet>
                {/* ✅ SEO: Metadatos optimizados para nicho B2B blanquería personalizada */}
                <title>Vinchas y Batas Personalizadas para Estética y Spa | Gaddyel Blanquería</title>
                <meta
                    name="description"
                    content="Potenciá la imagen de tu centro de estética con blanquería personalizada de alta calidad. Vinchas, batas y toallas con tu logo bordado. Pedidos desde 12 unidades. Envíos a todo el país."
                />
                <meta
                    name="keywords"
                    content="vinchas personalizadas, batas con logo, toallas bordadas, blanquería estética, insumos textiles spa, personalización bordado, gaddyel"
                />
                <meta name="author" content="Gaddyel" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <link rel="canonical" href="https://gaddyel.vercel.app/" />

                {/* ✅ Open Graph para redes sociales */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://gaddyel.vercel.app/" />
                <meta property="og:title" content="Vinchas y Batas Personalizadas para Estética y Spa | Gaddyel" />
                <meta
                    property="og:description"
                    content="Blanquería de lujo personalizada con bordado industrial. Vinchas, batas y toallas para spa, estética y gabinetes. Desde 12 unidades. Envíos a Argentina."
                />
                <meta property="og:site_name" content="Gaddyel" />
                <meta property="og:locale" content="es_AR" />
                <meta property="og:image" content="https://gaddyel.vercel.app/og-home.jpg" />

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

            <ParallaxBackground 
                imageSrc={imagenFondo}
                parallaxSpeed={-0.1}
                overlay={false}
                overlayColor="bg-slate-950/5 dark:bg-slate-950/20"
                className="w-full"
            >
                <div className="w-full max-w-7xl mx-auto pt-0 pb-8">

                    {/* Hero Section - Contenido principal */}
                    <main>
                        <section
                            className="
                                flex items-center justify-center flex-col text-center 
                                px-4 md:px-8 lg:px-12
                                pt-8 pb-12
                                bg-white/80 dark:bg-slate-900/80
                                backdrop-blur-xl
                                border border-slate-200/50 dark:border-slate-800/50
                                rounded-b-2xl
                                shadow-xl
                                mt-12 mb-8
                            "
                            aria-label="Presentación principal de Gaddyel"
                        >
                            {/* ===== FIRMA DE MARCA: Logo reducido + Píldora de identidad ===== */}
                            {/* El logo pasa de ser el protagonista a ser una firma elegante */}
                            <div className="flex flex-col items-center mb-8 mt-2">
                                {/*
                                 * LOGO CON ANIMACIONES:
                                 * - animate-float: sube y baja 16px (4s loop) — amplitud mayor = más perceptible
                                 * - Halo exterior pulsante: blur grande que late de 50% a 0% opacidad
                                 * - Halo interior estático: brillo base siempre visible (no depende del pulso)
                                 * - drop-shadow-2xl: profundidad visual sobre el fondo blanco
                                 */}
                                <div className="relative flex items-center justify-center mb-4
                                    w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48">
                                    {/* Halo exterior — pulsa entre visible e invisible */}
                                    <div
                                        className="absolute -inset-6 rounded-full animate-pulse opacity-50"
                                        style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 65%)', filter: 'blur(32px)' }}
                                        aria-hidden="true"
                                    />
                                    {/* Halo interior — siempre visible, da brillo base constante */}
                                    <div
                                        className="absolute -inset-2 rounded-full opacity-30"
                                        style={{ background: 'radial-gradient(circle, #a5b4fc 0%, transparent 60%)', filter: 'blur(16px)' }}
                                        aria-hidden="true"
                                    />
                                    <ImageOptimizer
                                        src={LogoGaddyel}
                                        alt="Logo Gaddyel - Blanquería personalizada premium"
                                        className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 object-contain drop-shadow-2xl animate-float"
                                        width={176}
                                        height={176}
                                        priority={true}
                                    />
                                </div>
                                {/* Píldora con el nicho exacto de Gaddyel — no aplica a ningún otro negocio */}
                                <span className="
                                    inline-flex items-center
                                    text-[11px] font-semibold tracking-[0.15em] uppercase
                                    text-indigo-700 dark:text-indigo-400
                                    bg-indigo-50 dark:bg-indigo-950/60
                                    border border-indigo-200/60 dark:border-indigo-800/60
                                    px-4 py-1.5 rounded-full
                                ">
                                    Blanquería Personalizada · Bordado Industrial
                                </span>
                            </div>

                            {/* ===== TÍTULO CON JERARQUÍA DE MARCA ===== */}
                            {/* Línea pequeña = categoría del negocio / Línea grande = promesa de marca */}
                            <h1 className="mb-12 max-w-3xl mx-auto">
                                <span className="block text-[12px] md:text-[13px] font-semibold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400 mb-3">
                                    Para centros de estética y spa
                                </span>
                                <span className="block italic text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
                                    Tu marca presente en{' '}
                                    <span className="text-indigo-700 dark:text-indigo-400">
                                        cada detalle de tu servicio.
                                    </span>
                                </span>
                            </h1>

                            {/* ===== DOS COLUMNAS SIMÉTRICAS ===== */}
                            {/* Ambas columnas usan items-stretch para forzar igual altura */}
                            {/* Ambas tienen el mismo tratamiento visual: borde + rounded-2xl + sombra */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full max-w-5xl mx-auto mb-10">

                                {/* Columna de texto */}
                                <ScrollReveal>
                                    <article className="
                                        flex flex-col justify-between
                                        text-left p-7 lg:p-9 h-full
                                        bg-slate-50/70 dark:bg-slate-800/70
                                        backdrop-blur-sm
                                        border border-slate-200/50 dark:border-slate-700/50
                                        rounded-2xl
                                        shadow-md
                                        transition-all duration-500 ease-out
                                        hover:shadow-lg hover:border-indigo-200/60 dark:hover:border-indigo-800/60
                                    ">
                                        <div>
                                            {/* Etiqueta de sección — aclara el propósito del texto */}
                                            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-4">
                                                ¿Por qué Gaddyel?
                                            </p>
                                            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
                                                La Estrategia detrás del Confort
                                            </h3>
                                            <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                                No solo personalizamos Blanquería, diseñamos embajadores silenciosos para tu gabinete. En cada bata y vincha bordada, tu logo está presente en el momento de mayor atención del cliente.
                                            </p>
                                            <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                                Nuestra blanquería de alta gama fusiona durabilidad extrema con una suavidad que cautiva. Estás invirtiendo en un sello de identidad que eleva la percepción de tu servicio.
                                            </p>
                                        </div>

                                        {/* Tags de diferenciadores reales de Gaddyel — no aplican a ningún otro negocio */}
                                        <div className="flex flex-wrap gap-2 mt-7">
                                            {['Bordado con tu logo', 'Diseños Profesionales', 'Envíos a todo el país'].map(tag => (
                                                <span key={tag} className="
                                                    text-[11px] font-semibold tracking-tight
                                                    text-slate-600 dark:text-slate-400
                                                    bg-white dark:bg-slate-900
                                                    border border-slate-200 dark:border-slate-700
                                                    px-3 py-1 rounded-full
                                                ">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </article>
                                </ScrollReveal>

                                {/* Columna de imagen — mismo borde y redondeo que la tarjeta de texto */}
                                <ScrollReveal>
                                    <div className="
                                        relative overflow-hidden
                                        rounded-2xl
                                        border border-slate-200/50 dark:border-slate-700/50
                                        shadow-md h-full min-h-[320px]
                                        transition-all duration-500 ease-out
                                        hover:shadow-lg hover:border-indigo-200/60 dark:hover:border-indigo-800/60
                                    ">
                                        {/* object-cover + h-full asegura que llene igual espacio que el texto */}
                                        <ImageOptimizer
                                            src={ImagenArticulo}
                                            alt="Blanquería personalizada Gaddyel - Toallas y batas bordadas de alta calidad"
                                            className="w-full h-full object-cover"
                                            width={512}
                                            height={512}
                                            loading="lazy"
                                            crop="fill"
                                        />
                                        {/* Overlay sutil que unifica la imagen con la paleta Slate del sitio */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" aria-hidden="true" />
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
                        className="
                            flex flex-col items-center justify-center 
                            p-6 md:p-12 lg:p-16
                            bg-slate-50/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            border border-slate-200/50 dark:border-slate-800/50
                            rounded-2xl 
                            mt-72
                            shadow-xl
                        "
                        aria-label="Galería de productos destacados"
                    >
                        <div className="flex flex-col items-center w-full">
                            <h2 className="italic text-3xl md:text-4xl font-bold tracking-tight text-center text-slate-900 dark:text-slate-100 mb-6 md:mb-8 shrink-0">
                                Nuestros Destacados
                            </h2>
                            <ScrollReveal>
                                {carouselImages?.length > 0 ? (
                                    <Carrusel imagenes={carouselImages} />
                                ) : (
                                    <p className="text-slate-600 dark:text-slate-400 text-center">
                                        No hay imágenes para mostrar.
                                    </p>
                                )}
                            </ScrollReveal>
                        </div>
                    </section>


                    {/* Productos destacados dinámicos */}
                    <section
                        className="
                            flex items-center justify-center flex-col 
                            p-6 md:p-12 lg:p-16
                            bg-white/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            border border-slate-200/50 dark:border-slate-800/50
                            rounded-2xl 
                            mt-72
                            shadow-xl
                        "
                        aria-label="Productos destacados de Gaddyel"
                    >
                        <h2 className="italic text-3xl md:text-4xl font-bold tracking-tight text-center text-slate-900 dark:text-slate-100 mb-8">
                            Productos que te Encantarán
                        </h2>

                        {cargando ? (
                            // Mientras carga: skeletons + mensaje que cambia con el tiempo
                            <div role="status" aria-live="polite" aria-label={mensajeCarga}>
                                <div className="text-center mb-8">
                                    <p className="text-[15px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                        {mensajeCarga}
                                    </p>
                                    {submensaje && (
                                        <p className="mt-2 text-[13px] text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                                            {submensaje}
                                        </p>
                                    )}
                                </div>
                                {/* 4 skeleton cards imitan la grilla de productos destacados */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden">
                                            <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                            <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                                                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/3 mt-1" />
                                                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mt-1" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center" role="alert" aria-live="assertive">
                                <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="
                                        px-6 py-3 
                                        bg-red-600 hover:bg-red-700 
                                        dark:bg-red-500 dark:hover:bg-red-600
                                        text-white 
                                        rounded-2xl 
                                        transition-all duration-500 ease-out
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                                        shadow-lg hover:shadow-xl
                                    "
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
                            <p className="text-slate-600 dark:text-slate-400 text-center">No hay productos destacados disponibles.</p>
                        )}
                    </section>

                    {/* Preguntas frecuentes */}
                    <section
                        className="
                            bg-slate-50/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            border border-slate-200/50 dark:border-slate-800/50
                            py-16 px-6 sm:px-12 lg:px-16
                            rounded-2xl 
                            mt-72
                            shadow-xl
                        "
                        aria-label="Preguntas frecuentes sobre Gaddyel"
                    >
                        <h2 className="italic text-3xl md:text-4xl font-bold tracking-tight text-center text-slate-900 dark:text-slate-100 mb-12">
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
                                        className="
                                            font-semibold tracking-tight
                                            bg-indigo-600 hover:bg-indigo-700 
                                            dark:bg-indigo-500 dark:hover:bg-indigo-600
                                            text-white 
                                            py-3 px-8 
                                            rounded-full 
                                            transition-all duration-500 ease-out
                                            hover:scale-105
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                            shadow-lg hover:shadow-xl
                                        "
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
                        className="
                            flex items-center justify-center flex-col text-center 
                            bg-white/80 dark:bg-slate-900/80
                            backdrop-blur-xl
                            p-12 lg:p-20
                            border border-slate-200/50 dark:border-slate-800/50
                            rounded-2xl 
                            mt-72 mb-24
                            shadow-xl
                        "
                        aria-label="Llamado a la acción - Contacto"
                    >
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-indigo-900 dark:text-indigo-300 mb-6">
                                Tu imagen también define cómo te eligen.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal>
                            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
                                La blanquería personalizada no es un detalle decorativo.
                                Es una herramienta que refuerza tu identidad profesional en cada experiencia del cliente.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                                Si tu centro cuida cada tratamiento, cada protocolo y cada resultado,
                                tu imagen debería comunicar el mismo nivel.
                            </p>
                        </ScrollReveal>

                        <CTAButton to="/contacto">
                            Quiero potenciar mi imagen
                        </CTAButton>
                    </section>

                </div>
            </ParallaxBackground>
        </>
    );
};

export default Inicio;
