import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * ============================================================================
 * GALERÍA DE IMÁGENES DE PRODUCTO (CarruselVertical)
 * ============================================================================
 * 
 * ¿QUÉ ES ESTO?
 * Este archivo controla la galería de fotos que ves cuando abres un producto.
 * Muestra una imagen grande arriba y las miniaturas abajo (o al lado en pantallas grandes).
 * 
 * ¿CÓMO FUNCIONA?
 * 1. El usuario ve las miniaturas de todas las fotos del producto
 * 2. Al hacer click en una miniatura, la imagen grande cambia
 * 3. Al hacer click en la imagen grande, se abre un visor ampliado (lightbox)
 * 4. En el visor ampliado puede hacer zoom y mover la imagen
 * 
 * ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
 * 
 * → "Las imágenes no cargan o se ven borrosas"
 *   Revisa la función 'optimizarUrlCloudinary' (línea ~25)
 *   Esta función transforma las URLs para que Cloudinary entregue imágenes optimizadas
 * 
 * → "El zoom no funciona"
 *   Revisa la sección 'CONTROLES DE ZOOM' (líneas ~135-175)
 *   Ahí están las funciones para scroll, arrastre y doble-click
 * 
 * → "El visor ampliado no se abre/cierra"
 *   Revisa el estado 'lightboxAbierto' y dónde se usa 'setLightboxAbierto'
 * 
 * → "Las flechas del teclado no funcionan"
 *   Revisa el bloque que dice 'ATAJOS DE TECLADO' (línea ~113)
 * 
 * → "Las miniaturas no se ven bien"
 *   Revisa la sección 'MINIATURAS' en el JSX (línea ~230)
 * 
 * ARCHIVOS RELACIONADOS:
 * - Este componente se usa en: Paginas/DetalleProducto.jsx
 * - Las imágenes vienen de: Cloudinary (servicio externo de almacenamiento)
 */

// ============================================================================
// OPTIMIZACIÓN DE IMÁGENES DE CLOUDINARY
// ============================================================================
/**
 * Esta función toma la URL de una imagen de Cloudinary y le agrega parámetros
 * para que se entregue en el mejor formato (WebP o AVIF) y calidad automática.
 * 
 * Ejemplo de lo que hace:
 * ANTES: https://res.cloudinary.com/.../upload/imagen.jpg
 * DESPUÉS: https://res.cloudinary.com/.../upload/q_auto,f_auto/imagen.jpg
 * 
 * ¿Por qué? Las imágenes pesan menos y cargan más rápido sin perder calidad visible.
 */
const optimizarUrlCloudinary = (url, calidad = 'auto') => {
    // Si no es una URL de Cloudinary, la devolvemos sin cambios
    if (!url?.includes('cloudinary.com')) return url;
    // Si ya tiene los parámetros de optimización, no los agregamos de nuevo
    if (url.includes('q_auto') && url.includes('f_auto')) return url;
    
    // Insertamos los parámetros de calidad y formato después de '/upload/'
    const partes = url.split('/upload/');
    if (partes.length === 2) {
        return `${partes[0]}/upload/q_${calidad},f_auto/${partes[1]}`;
    }
    return url;
};

const CarruselVertical = ({ imagenes = [], nombreProducto = 'Producto' }) => {
    
    // ========================================================================
    // PREPARACIÓN DE IMÁGENES
    // ========================================================================
    /**
     * Convierte el array de imágenes a un formato uniforme.
     * Las imágenes pueden llegar como texto simple ("url.jpg") o como objetos ({src, alt}).
     * Esta función las convierte todas a objetos con 'src' (la URL) y 'alt' (descripción para SEO).
     * 
     * ¿Problema con las imágenes que llegan del producto?
     * Revisa aquí cómo se procesan.
     */
    const imagenesNormalizadas = useMemo(() => {
        if (!Array.isArray(imagenes)) return [];
        
        return imagenes
            .map((img, index) => {
                const src = typeof img === 'string' ? img : img?.src;
                const alt = typeof img === 'string' 
                    ? `${nombreProducto} - Vista ${index + 1}` 
                    : img?.alt || `${nombreProducto} - Vista ${index + 1}`;
                
                return src ? { src, alt } : null;
            })
            .filter(Boolean);
    }, [imagenes, nombreProducto]);

    // ========================================================================
    // ESTADOS DE LA GALERÍA (qué imagen se muestra, si el visor está abierto, etc.)
    // ========================================================================
    
    // ¿Cuál miniatura está seleccionada? (0 = primera, 1 = segunda, etc.)
    const [indiceActual, setIndiceActual] = useState(0);
    
    // ¿El visor ampliado está abierto? (true = sí, false = no)
    const [lightboxAbierto, setLightboxAbierto] = useState(false);
    
    // ¿La imagen del visor está cargando? (muestra un spinner mientras carga)
    const [imagenCargando, setImagenCargando] = useState(false);
    
    // ========================================================================
    // ESTADOS DEL ZOOM (qué tan ampliada está la imagen y dónde está posicionada)
    // ========================================================================
    
    // Nivel de zoom: 1 = tamaño normal, 2 = doble, 4 = máximo
    const [zoom, setZoom] = useState(1);
    
    // Posición de la imagen cuando está con zoom (para moverla arrastrando)
    const [posicion, setPosicion] = useState({ x: 0, y: 0 });
    
    // ¿El usuario está arrastrando la imagen? (para moverla con zoom)
    const [arrastrando, setArrastrando] = useState(false);
    
    // Punto donde empezó el arrastre (para calcular cuánto se movió)
    // useRef en lugar de useState: es un valor interno de movimiento que no
    // necesita disparar renders — solo se lee y escribe durante el arrastre.
    const puntoInicio = useRef({ x: 0, y: 0 });
    
    // Referencia al contenedor de la imagen (para cálculos de posición)
    const contenedorRef = useRef(null);

    // ========================================================================
    // ACCIONES DEL USUARIO EN LA GALERÍA
    // ========================================================================
    
    /**
     * Cuando el usuario hace click en una miniatura, esta función cambia 
     * la imagen principal a la que corresponde a esa miniatura.
     */
    const handleSeleccionarImagen = useCallback((index) => {
        setIndiceActual(index);
    }, []);

    /**
     * Botón "siguiente" en el visor ampliado.
     * Pasa a la siguiente imagen y resetea el zoom.
     */
    const handleSiguiente = useCallback(() => {
        setImagenCargando(true);
        setZoom(1);
        setPosicion({ x: 0, y: 0 });
        setIndiceActual((prev) => (prev + 1) % imagenesNormalizadas.length);
    }, [imagenesNormalizadas.length]);

    /**
     * Botón "anterior" en el visor ampliado.
     * Vuelve a la imagen anterior y resetea el zoom.
     */
    const handleAnterior = useCallback(() => {
        setImagenCargando(true);
        setZoom(1);
        setPosicion({ x: 0, y: 0 });
        setIndiceActual((prev) => (prev - 1 + imagenesNormalizadas.length) % imagenesNormalizadas.length);
    }, [imagenesNormalizadas.length]);

    // ========================================================================
    // COMPORTAMIENTOS AUTOMÁTICOS
    // ========================================================================
    
    /**
     * Cuando cambian las imágenes del producto (ej: navegas a otro producto),
     * vuelve a mostrar la primera imagen.
     */
    useEffect(() => {
        setIndiceActual(0);
    }, [imagenesNormalizadas.length]);

    /**
     * Cuando se abre el visor ampliado, asegura que el zoom empiece en 1x
     * y la imagen esté centrada.
     */
    useEffect(() => {
        if (lightboxAbierto) {
            setZoom(1);
            setPosicion({ x: 0, y: 0 });
        }
    }, [lightboxAbierto]);

    /**
     * PRE-CARGA DE IMÁGENES
     * Cuando el visor está abierto, carga en segundo plano la imagen siguiente
     * y la anterior para que cuando el usuario navegue, ya estén listas.
     */
    useEffect(() => {
        if (lightboxAbierto && imagenesNormalizadas.length > 1) {
            const precargar = (index) => {
                const img = new Image();
                img.src = optimizarUrlCloudinary(imagenesNormalizadas[index]?.src);
            };
            const siguiente = (indiceActual + 1) % imagenesNormalizadas.length;
            const anterior = (indiceActual - 1 + imagenesNormalizadas.length) % imagenesNormalizadas.length;
            precargar(siguiente);
            precargar(anterior);
        }
    }, [lightboxAbierto, indiceActual, imagenesNormalizadas]);

    // ========================================================================
    // ATAJOS DE TECLADO
    // ========================================================================
    /**
     * Cuando el visor ampliado está abierto, el usuario puede usar el teclado:
     * - ESC: Cierra el visor
     * - Flecha derecha (→): Siguiente imagen
     * - Flecha izquierda (←): Imagen anterior
     * - Tecla + : Acerca el zoom
     * - Tecla - : Aleja el zoom
     * - Tecla 0 : Resetea el zoom a tamaño normal
     * 
     * ¿Los atajos no funcionan? Revisa este bloque.
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxAbierto(false);
            if (e.key === 'ArrowRight') handleSiguiente();
            if (e.key === 'ArrowLeft') handleAnterior();
            if (e.key === '+' || e.key === '=') setZoom(prev => Math.min(prev + 0.5, 4));
            if (e.key === '-') setZoom(prev => Math.max(prev - 0.5, 1));
            if (e.key === '0') { setZoom(1); setPosicion({ x: 0, y: 0 }); }
        };
        
        if (lightboxAbierto) {
            // Activamos los atajos de teclado
            document.addEventListener('keydown', handleKeyDown);
            // Bloqueamos el scroll de la página mientras el visor está abierto
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            // Limpiamos cuando se cierra el visor
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxAbierto, handleSiguiente, handleAnterior]);

    // ========================================================================
    // CONTROLES DE ZOOM
    // ========================================================================
    
    /**
     * ZOOM CON LA RUEDA DEL MOUSE
     * Girar la rueda hacia arriba acerca, hacia abajo aleja.
     * Límites: mínimo 1x (normal), máximo 4x
     * 
     * NOTA TÉCNICA: Se adjunta de forma imperativa con { passive: false } porque
     * React 17+ registra onWheel como listener pasivo por defecto, lo que hace
     * que e.preventDefault() sea ignorado y el scroll del mouse no funcione.
     * 
     * ¿El zoom con scroll no funciona? Revisa el useEffect que lo adjunta (línea ~207)
     */
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        setZoom(prev => {
            const nuevoZoom = Math.max(1, Math.min(4, prev + delta));
            // Si vuelve a tamaño normal, centra la imagen
            if (nuevoZoom === 1) setPosicion({ x: 0, y: 0 });
            return nuevoZoom;
        });
    }, []);

    // ========================================================================
    // ADJUNTAR WHEEL LISTENER DE FORMA IMPERATIVA (NO PASIVO)
    // ========================================================================
    /**
     * El zoom con la rueda del mouse necesita bloquear el scroll nativo del browser.
     * Para eso se necesita { passive: false }, que no se puede usar con los eventos
     * de React (onWheel). Por eso lo adjuntamos directamente al elemento del DOM.
     * 
     * Se activa solo cuando el lightbox está abierto para no interferir con el
     * scroll normal de la página.
     */
    useEffect(() => {
        const contenedor = contenedorRef.current;
        if (!contenedor || !lightboxAbierto) return;
        contenedor.addEventListener('wheel', handleWheel, { passive: false });
        return () => contenedor.removeEventListener('wheel', handleWheel);
    }, [lightboxAbierto, handleWheel]);

    /**
     * ARRASTRAR LA IMAGEN (inicio)
     * Cuando el usuario hace click y mantiene presionado sobre la imagen con zoom,
     * comienza el arrastre para mover la imagen.
     */
    const handleMouseDown = useCallback((e) => {
        if (zoom > 1) {
            e.preventDefault();
            setArrastrando(true);
            puntoInicio.current = { x: e.clientX - posicion.x, y: e.clientY - posicion.y };
        }
    }, [zoom, posicion]);

    /**
     * ARRASTRAR LA IMAGEN (movimiento)
     * Mientras el usuario mueve el mouse con el botón presionado,
     * la imagen se mueve siguiendo el cursor.
     */
    const handleMouseMove = useCallback((e) => {
        if (arrastrando && zoom > 1) {
            setPosicion({
                x: e.clientX - puntoInicio.current.x,
                y: e.clientY - puntoInicio.current.y
            });
        }
    }, [arrastrando, zoom]);

    /**
     * ARRASTRAR LA IMAGEN (fin)
     * Cuando el usuario suelta el botón del mouse, termina el arrastre.
     */
    const handleMouseUp = useCallback(() => {
        setArrastrando(false);
    }, []);

    /**
     * DOBLE CLICK PARA ZOOM RÁPIDO
     * - Si la imagen está en tamaño normal (1x), la amplía a 2.5x
     * - Si ya tiene zoom, la devuelve a tamaño normal
     */
    const handleDoubleClick = useCallback(() => {
        if (zoom === 1) {
            setZoom(2.5);
        } else {
            setZoom(1);
            setPosicion({ x: 0, y: 0 });
        }
    }, [zoom]);

    // ========================================================================
    // CONTROLES TÁCTILES PARA MÓVIL
    // ========================================================================
    /**
     * Las siguientes funciones permiten mover la imagen con el dedo
     * cuando está con zoom en dispositivos móviles.
     * 
     * ¿El arrastre táctil no funciona? Revisa estos handlers.
     */
    
    const handleTouchStart = useCallback((e) => {
        if (zoom > 1 && e.touches.length === 1) {
            const touch = e.touches[0];
            setArrastrando(true);
            puntoInicio.current = { x: touch.clientX - posicion.x, y: touch.clientY - posicion.y };
        }
    }, [zoom, posicion]);

    const handleTouchMove = useCallback((e) => {
        if (arrastrando && zoom > 1 && e.touches.length === 1) {
            const touch = e.touches[0];
            setPosicion({
                x: touch.clientX - puntoInicio.current.x,
                y: touch.clientY - puntoInicio.current.y
            });
        }
    }, [arrastrando, zoom]);

    const handleTouchEnd = useCallback(() => {
        setArrastrando(false);
    }, []);

    // ========================================================================
    // IMAGEN ACTUAL A MOSTRAR
    // ========================================================================
    /**
     * Obtiene la imagen que corresponde al índice seleccionado.
     * Si no hay imágenes, muestra un placeholder gris con texto "Sin imagen".
     */
    const imagenActual = imagenesNormalizadas[indiceActual] || {
        src: 'https://via.placeholder.com/400?text=Sin+imagen',
        alt: 'Sin imagen disponible'
    };

    // ========================================================================
    // INTERFAZ VISUAL (lo que el usuario ve)
    // ========================================================================
    return (
        <>
            {/* ----------------------------------------------------------------
                GALERÍA PRINCIPAL
                Contiene la imagen grande arriba y las miniaturas abajo.
                En pantallas grandes (laptop/desktop): miniaturas a la izquierda, imagen a la derecha.
                
                ¿La galería se ve mal en móvil o desktop? Revisa las clases de Tailwind aquí.
            ---------------------------------------------------------------- */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:items-start gap-4 h-full">
                
                {/* ------------------------------------------------------------
                    IMAGEN PRINCIPAL
                    Es un botón porque al hacer click abre el visor ampliado.
                    El cursor cambia a lupa (zoom-in) para indicar que se puede ampliar.
                    
                    ¿La imagen principal no responde al click? Revisa el onClick aquí.
                    ¿Se ve muy pequeña/grande? Ajusta h-[400px] o md:h-[500px]
                ------------------------------------------------------------ */}
                <button
                    type="button"
                    onClick={() => setLightboxAbierto(true)}
                    className="w-full lg:w-4/5 h-[400px] md:h-[500px]
                        bg-slate-100 dark:bg-slate-800
                        rounded-2xl overflow-hidden
                        shadow-lg cursor-zoom-in
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        transition-all duration-500 ease-out"
                    aria-label="Ver imagen ampliada"
                >
                    <img
                        src={optimizarUrlCloudinary(imagenActual.src)}
                        alt={imagenActual.alt}
                        className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                        loading="eager"
                    />
                </button>

                {/* ------------------------------------------------------------
                    MINIATURAS (las imágenes pequeñas de selección)
                    Muestran todas las fotos disponibles del producto.
                    La miniatura seleccionada tiene borde morado y está más grande.
                    
                    ¿Las miniaturas no se ven? Revisa si 'imagenesNormalizadas' tiene datos.
                    ¿El borde de selección no aparece? Revisa la clase 'border-purple-600'.
                ------------------------------------------------------------ */}
                <div className="flex items-center justify-center gap-2 p-2 w-full overflow-visible lg:flex-col lg:items-start lg:p-0 lg:w-1/5">
                    {imagenesNormalizadas.length > 0 ? (
                        imagenesNormalizadas.map((imagen, index) => (
                            <button
                                key={imagen.src}
                                type="button"
                                className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer
                                    transition-all duration-500 ease-out
                                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                                    index === indiceActual
                                        ? 'border-2 border-indigo-500 scale-110 shadow-lg ring-2 ring-indigo-100 dark:ring-indigo-900/50'
                                        : 'border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                                onClick={() => handleSeleccionarImagen(index)}
                                aria-label={`Ver ${imagen.alt}`}
                                aria-pressed={index === indiceActual}
                            >
                                <img
                                    src={optimizarUrlCloudinary(imagen.src)}
                                    alt={imagen.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Sin imágenes disponibles</p>
                    )}
                </div>
            </div>

            {/* ----------------------------------------------------------------
                VISOR AMPLIADO (LIGHTBOX)
                Se muestra cuando el usuario hace click en la imagen principal.
                Ocupa toda la pantalla con fondo oscuro.
                Permite: zoom con scroll, mover imagen arrastrando, navegar con flechas.
                
                ¿El visor no se abre? Revisa si 'lightboxAbierto' cambia a true.
                ¿El fondo no es oscuro? Revisa 'bg-black/[0.97]' (97% opacidad)
                NOTA: z-[9999] en lugar de z-50 porque backdrop-blur-xl en el panel
                del producto crea un nuevo contexto de apilamiento que supera z-50.
            ---------------------------------------------------------------- */}
            {lightboxAbierto && createPortal(
                <div 
                    className="fixed inset-0 z-[9999] bg-black/[0.97] flex items-center justify-center"
                    onClick={() => setLightboxAbierto(false)}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Imagen ampliada con zoom"
                >
                    {/* --------------------------------------------------------
                        BOTÓN CERRAR (X)
                        Ubicado arriba a la derecha. También se puede cerrar con ESC.
                        
                        ¿No cierra el visor? Revisa setLightboxAbierto(false)
                    -------------------------------------------------------- */}
                    <button
                        type="button"
                        onClick={() => setLightboxAbierto(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                        aria-label="Cerrar (ESC)"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* --------------------------------------------------------
                        CONTROLES DE ZOOM (botones + y -)
                        Ubicados arriba a la izquierda.
                        El porcentaje aparece cuando hay zoom activo y al clickearlo resetea.
                        
                        ¿Los botones no funcionan? Revisa setZoom()
                    -------------------------------------------------------- */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        {/* Botón acercar (+) */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.min(prev + 0.5, 4)); }}
                            className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Acercar (+)"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                            </svg>
                        </button>
                        {/* Botón alejar (-) */}
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setZoom(prev => { const n = Math.max(prev - 0.5, 1); if(n===1) setPosicion({x:0,y:0}); return n; }); }}
                            className="text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Alejar (-)"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                            </svg>
                        </button>
                        {/* Indicador de porcentaje de zoom (aparece solo cuando hay zoom) */}
                        {zoom > 1 && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setZoom(1); setPosicion({x:0,y:0}); }}
                                className="text-white/80 hover:text-white px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
                                aria-label="Resetear zoom"
                            >
                                {Math.round(zoom * 100)}%
                            </button>
                        )}
                    </div>

                    {/* --------------------------------------------------------
                        FLECHA IZQUIERDA (imagen anterior)
                        Solo aparece si hay más de una imagen.
                        
                        ¿No navega? Revisa handleAnterior()
                    -------------------------------------------------------- */}
                    {imagenesNormalizadas.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleAnterior(); }}
                            className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            aria-label="Imagen anterior (←)"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* --------------------------------------------------------
                        CONTENEDOR DE LA IMAGEN CON ZOOM
                        Aquí se aplica el zoom y el arrastre.
                        El scroll del mouse controla el zoom.
                        
                        ¿La imagen no hace zoom? Revisa handleWheel
                        ¿No se puede arrastrar? Revisa handleMouseDown/Move/Up
                    -------------------------------------------------------- */}
                    <div 
                        ref={contenedorRef}
                        className="relative flex items-center justify-center overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Indicador de carga (spinner giratorio) */}
                        {imagenCargando && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                        
                        {/* La imagen ampliada con todos los controles de zoom y arrastre */}
                        <img
                            key={indiceActual}
                            src={optimizarUrlCloudinary(imagenActual.src)}
                            alt={imagenActual.alt}
                            className={`max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none ${imagenCargando ? 'opacity-0' : 'opacity-100'}`}
                            style={{
                                transform: `scale(${zoom}) translate(${posicion.x / zoom}px, ${posicion.y / zoom}px)`,
                                cursor: zoom > 1 ? (arrastrando ? 'grabbing' : 'grab') : 'zoom-in',
                                transition: arrastrando ? 'none' : 'transform 0.15s ease-out'
                            }}
                            draggable="false"
                            onLoad={() => setImagenCargando(false)}
                            onMouseDown={handleMouseDown}
                            onDoubleClick={handleDoubleClick}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        />
                    </div>

                    {/* --------------------------------------------------------
                        FLECHA DERECHA (imagen siguiente)
                        Solo aparece si hay más de una imagen.
                        
                        ¿No navega? Revisa handleSiguiente()
                    -------------------------------------------------------- */}
                    {imagenesNormalizadas.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleSiguiente(); }}
                            className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                            aria-label="Imagen siguiente (→)"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* --------------------------------------------------------
                        BARRA DE INFORMACIÓN INFERIOR
                        Muestra qué imagen se está viendo (ej: "2 / 5") y
                        instrucciones de cómo usar el zoom.
                    -------------------------------------------------------- */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-3">
                        {imagenesNormalizadas.length > 1 && (
                            <span>{indiceActual + 1} / {imagenesNormalizadas.length}</span>
                        )}
                        <span className="text-white/50 text-xs hidden sm:inline">
                            scroll zoom • doble-click {zoom > 1 ? 'reset' : '2.5x'} • {zoom > 1 ? 'arrastra para mover' : 'ESC cerrar'}
                        </span>
                    </div>
                </div>
            , document.body)}
        </>
    );
};

// Exportamos el componente con memo para evitar re-renderizados innecesarios
// cuando los datos del producto padre cambian pero las imágenes son las mismas.
export default React.memo(CarruselVertical);