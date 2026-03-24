// ============================================================
// ¿QUÉ ES ESTO?
//   Página de detalle de un producto individual.
//   Se accede desde /catalogo/:id al hacer click en una tarjeta.
//
// ¿CÓMO FUNCIONA?
//   1. Lee el :id de la URL
//   2. Obtiene los datos del producto desde el backend (con reintentos)
//   3. Muestra carrusel de imágenes a la izquierda y ficha a la derecha
//   4. El usuario elige cantidad con botones ± y agrega al carrito
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
//   - Producto no carga → revisar obtenerProductoPorId en productosService
//   - Carrusel no muestra imágenes → revisar campo imagenes[] en el backend
//   - Agregar al carrito no funciona → revisar addToCart en CartContext
//   - Precio incorrecto → revisar formatPriceWithSymbol en utils/formatPrice
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import CarruselVertical from '../Componentes/UI/Carrusel/CarruselVertical';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../Context/CartContext';
import { obtenerProductoPorId } from '../Servicios/productosService';
import { formatPriceWithSymbol } from '../utils/formatPrice';
import { logger } from '../utils/logger';

// ======== COMPONENTE PRINCIPAL ========

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [productoData, setProductoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // Referencia al timer de confirmación — necesaria para limpiarlo si el componente
    // se desmonta antes de que pasen los 2 segundos (evita actualizar estado en componente muerto)
    const confirmTimerRef = useRef(null);

    // ======== CARGA DE DATOS ========

    useEffect(() => {
        // Cuando cambia el :id en la URL, vuelve a cargar el producto
        const cargarProducto = async () => {
            try {
                setLoading(true);
                const data = await obtenerProductoPorId(id);
                setProductoData(data);
            } catch (error) {
                logger.error('Error al obtener producto:', error);
                setProductoData(null);
            } finally {
                setLoading(false);
            }
        };

        cargarProducto();

        // Limpieza: si el usuario navega a otro producto antes de que cargue,
        // cancela el timer de confirmación del carrito para evitar errores
        return () => {
            if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
        };
    }, [id]);

    // ======== AGREGAR AL CARRITO ========

    // Cuando el usuario hace click en "Agregar al carrito":
    // 1. Agrega el producto al contexto global del carrito
    // 2. Muestra confirmación visual por 2 segundos
    const handleAddToCart = useCallback(() => {
        addToCart(productoData, cantidad);
        setAddedToCart(true);
        if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
        confirmTimerRef.current = setTimeout(() => setAddedToCart(false), 2000);
    }, [addToCart, productoData, cantidad]);

    // ======== ESTADOS DE CARGA ========

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12
                        bg-slate-100 dark:bg-slate-800
                        border border-slate-200/50 dark:border-slate-700/50
                        rounded-2xl mb-6 animate-pulse">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 tracking-tight">
                        Cargando producto...
                    </p>
                </div>
            </div>
        );
    }

    if (!productoData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14
                    bg-red-50 dark:bg-red-950/30
                    border border-red-200/50 dark:border-red-800/40
                    rounded-2xl mb-6
                    ring-2 ring-red-100 dark:ring-red-900/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950">
                    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 mb-2">
                    Producto no encontrado
                </h1>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 mb-8">
                    El producto que buscás no está disponible o fue removido del catálogo.
                </p>
                <NavLink
                    to="/catalogo"
                    className="inline-flex items-center gap-2
                        px-8 py-3 rounded-2xl
                        bg-indigo-600 hover:bg-indigo-700
                        text-white text-[14px] font-semibold tracking-tight
                        transition-all duration-500 ease-out"
                >
                    Volver al catálogo
                </NavLink>
            </div>
        );
    }

    // ======== DATOS DEL PRODUCTO ========

    const {
        nombre = 'Producto sin nombre',
        descripcionCompleta = 'No hay descripción disponible.',
        material = 'No especificado',
        tamanos = [],
        colores = [],
        imagenes = [],
        personalizable = false,
        precio = 0,
        cantidadUnidades = 1,
        categoria = 'Producto'
    } = productoData;

    // ======== RENDER PRINCIPAL ========

    return (
        <>
            {/* SEO — Google puede mostrar precio e imágenes en resultados de búsqueda */}
            <Helmet>
                <title>{`${nombre} Personalizado | ${categoria} con Logo Bordado | Gaddyel`}</title>
                <meta name="description" content={`${descripcionCompleta.substring(0, 145)}... Personalizado con logo bordado. Desde 12 unidades. Envíos a Argentina.`} />
                <meta name="keywords" content={`${nombre}, ${categoria} personalizado, bordado logo, estética spa, gaddyel`} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://gaddyel.vercel.app/catalogo/${id}`} />
                <meta property="og:title" content={`${nombre} Personalizado | Gaddyel`} />
                <meta property="og:description" content={`${descripcionCompleta.substring(0, 145)}... Personalizable con logo bordado.`} />
                <meta property="og:type" content="product" />
                <meta property="og:image" content={imagenes[0]?.src || productoData.imagenSrc} />
                <meta property="og:url" content={`https://gaddyel.vercel.app/catalogo/${id}`} />
                <meta property="og:site_name" content="Gaddyel" />
                <meta property="og:locale" content="es_AR" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "@id": `https://gaddyel.vercel.app/catalogo/${id}`,
                        "name": nombre,
                        "description": descripcionCompleta,
                        "image": imagenes.map(img => img.src || img),
                        "brand": { "@type": "Brand", "name": "Gaddyel" },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://gaddyel.vercel.app/catalogo/${id}`,
                            "priceCurrency": "ARS",
                            "price": precio.toString(),
                            "availability": "https://schema.org/InStock"
                        }
                    })}
                </script>
            </Helmet>

            <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-start gap-10">

                {/* ── Carrusel de imágenes — sticky en desktop ── */}
                <div className="lg:w-1/2 w-full lg:sticky lg:top-24" aria-label={`Imágenes de ${nombre}`}>
                    <CarruselVertical imagenes={imagenes} />
                </div>

                {/* ── Ficha del producto ── */}
                <div className="lg:w-1/2 w-full
                    bg-white/80 dark:bg-slate-900/80
                    backdrop-blur-xl
                    border border-slate-200/50 dark:border-slate-800/50
                    rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-slate-950/40
                    p-8">

                    {/* Nombre */}
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-4">
                        {nombre}
                    </h1>

                    {/* Descripción */}
                    <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                        {descripcionCompleta}
                    </p>

                    {/* ── Precio ── */}
                    <div className="flex items-baseline gap-3 px-6 py-5 mb-6
                        bg-indigo-50/60 dark:bg-indigo-900/25
                        border border-indigo-100 dark:border-indigo-700/40
                        rounded-2xl">
                        <span className="text-4xl font-bold tracking-tight text-indigo-600 dark:text-indigo-300">
                            {formatPriceWithSymbol(precio)}
                        </span>
                        <span className="text-[13px] font-semibold text-indigo-500 dark:text-indigo-300">
                            · incluye {cantidadUnidades} {cantidadUnidades === 1 ? 'unidad' : 'unidades'}
                        </span>
                    </div>

                    {/* ── Características ── */}
                    <div className="mb-6">
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-400 mb-3">
                            Características
                        </p>
                        <ul className="space-y-2">
                            {[
                                { label: 'Material', value: material },
                                { label: 'Tamaño', value: tamanos.length > 0 ? tamanos.join(', ') : 'No especificado' },
                                { label: 'Colores', value: colores.length > 0 ? colores.join(', ') : 'No especificado' },
                            ].map(({ label, value }) => (
                                <li key={label} className="flex justify-between items-center text-[14px]">
                                    <span className="text-slate-400 dark:text-slate-400">{label}</span>
                                    <span className="font-medium tracking-tight text-slate-700 dark:text-slate-200">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Banner personalizable ── */}
                    {personalizable && (
                        <div className="flex items-start gap-3 px-5 py-4 mb-6
                            bg-indigo-50/60 dark:bg-indigo-900/25
                            border border-indigo-100 dark:border-indigo-700/40
                            rounded-2xl">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                            <p className="text-[13px] font-semibold text-indigo-700 dark:text-indigo-200 leading-relaxed">
                                Este producto es personalizable con tu logo. Contactanos para coordinar el diseño.
                            </p>
                        </div>
                    )}

                    {/* ── Selector de cantidad con botones ± ── */}
                    {/* Mismo patrón que el carrito para consistencia visual */}
                    <div className="mb-8">
                        <p className="text-[13px] font-semibold tracking-tight text-slate-600 dark:text-slate-300 mb-3">
                            Cantidad
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                                disabled={cantidad <= 1}
                                aria-label="Disminuir cantidad"
                                className="w-9 h-9 flex items-center justify-center
                                    bg-slate-100 dark:bg-slate-800
                                    hover:bg-slate-200 dark:hover:bg-slate-700
                                    border border-slate-200/60 dark:border-slate-700/60
                                    text-slate-600 dark:text-slate-400
                                    font-bold rounded-xl
                                    transition-all duration-500 ease-out
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                −
                            </button>
                            <span className="w-12 text-center font-semibold text-[16px] tracking-tight text-slate-800 dark:text-slate-100">
                                {cantidad}
                            </span>
                            <button
                                onClick={() => setCantidad(c => c + 1)}
                                aria-label="Aumentar cantidad"
                                className="w-9 h-9 flex items-center justify-center
                                    bg-slate-100 dark:bg-slate-800
                                    hover:bg-slate-200 dark:hover:bg-slate-700
                                    border border-slate-200/60 dark:border-slate-700/60
                                    text-slate-600 dark:text-slate-400
                                    font-bold rounded-xl
                                    transition-all duration-500 ease-out"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* ── Acciones ── */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Agregar al carrito — feedback visual de 2 segundos */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 inline-flex items-center justify-center gap-2
                                px-6 py-3.5 rounded-2xl
                                bg-indigo-600 hover:bg-indigo-700
                                text-white text-[14px] font-semibold tracking-tight
                                transition-all duration-500 ease-out
                                hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                        >
                            {addedToCart ? (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Agregado al carrito
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Agregar al carrito
                                </>
                            )}
                        </button>

                        {/* Contacto directo */}
                        <NavLink
                            to="/contacto"
                            aria-label={`Contactar para comprar ${nombre}`}
                            className="flex-1 inline-flex items-center justify-center gap-2
                                px-6 py-3.5 rounded-2xl
                                bg-slate-100 dark:bg-slate-800
                                hover:bg-slate-200 dark:hover:bg-slate-700
                                border border-slate-200 dark:border-slate-700
                                text-slate-700 dark:text-slate-300
                                text-[14px] font-semibold tracking-tight
                                transition-all duration-500 ease-out
                                hover:-translate-y-0.5"
                        >
                            Consultar
                        </NavLink>
                    </div>

                </div>
            </div>
        </>
    );
};

export default DetalleProducto;
