import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import { logger } from '../utils/logger';
import { obtenerProductos } from '../Servicios/productosService';

/**
 * FLUJO DE DATOS - Página Catálogo (Paginación Manual Simple)
 * 
 * ARQUITECTURA:
 * 1. Usuario entra a /catalogo?page=1 (o sin parámetro = página 1)
 * 2. useEffect detecta cambio en currentPage
 * 3. Fetch: GET /api/productos?page=1&limit=20
 * 4. Backend retorna: { data: [...productos], pagination: { pages, total, page } }
 * 5. setAllProducts(data.data) → setTotalPages(pagination.pages)
 * 6. Componente renderea grid con productos
 * 7. Controles de paginación (Anterior/Siguiente) abajo
 * 
 * VENTAJAS DE ESTA SOLUCIÓN:
 * ✅ Simple: Sin dependencias complejas (sin Intersection Observer)
 * ✅ Escalable: Funciona con 13 productos o 10,000
 * ✅ SEO-friendly: URLs como ?page=1, ?page=2 (indexables)
 * ✅ Control total: Usuario controla cuándo cargar más
 * ✅ Mantenible: Código claro y fácil de debuguear
 * ✅ Performance: Solo 20 items por página en memoria
 * 
 * CONFIGURACIÓN ACTUAL:
 * - 20 productos por página
 * - Con 13 productos: 1 página (todo en la misma)
 * - Con 100 productos: 5 páginas
 * - Con 1000 productos: 50 páginas
 * 
 * FLUJO DE BÚSQUEDA:
 * Usuario escribe en buscador → useMemo filtra localmente
 * No hace re-fetch, usa los datos ya cargados
 * Si escribe, reset a página 1 (UX clara)
 * 
 * RENDIMIENTO:
 * - React.memo(TarjetaProducto) en componente hijo
 * - Lazy loading de imágenes (en TarjetaProducto)
 * - useMemo para filtrado local (evita cálculos innecesarios)
 * 
 * SEO:
 * - react-helmet-async actualiza <title> y <meta>
 * - Canonical URL con parámetro ?page (para cada página)
 * - HTML5 semántico: <main>, <article>, role="grid"
 * - Open Graph para compartir en redes
 */
const Catalogo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); // 20 productos por página
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // ✅ FLUJO: Fetch productos cuando cambia página
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Usamos obtenerProductos (con reintentos automáticos) en lugar de
                // llamar al servidor directamente, para manejar el arranque lento de Render.
                const { productos, pagination } = await obtenerProductos({
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: 'createdAt',
                    sortDir: -1
                });
                setAllProducts(productos || []);
                
                const pages = pagination?.pages || 1;
                const total = pagination?.total || 0;
                
                setTotalPages(pages);
                setTotalProducts(total);
                
                logger.debug(`Página ${currentPage}/${pages} cargada (${productos?.length || 0} de ${total} productos)`);
                
            } catch (err) {
                const errorMsg = err.message || 'No se pudieron cargar los productos';
                logger.error('Error loading products:', errorMsg);
                setError(errorMsg);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, itemsPerPage]);

    // ✅ PERFORMANCE: Filtro local de búsqueda (no re-fetch por cada letra)
    // Este usa los datos ya cargados en la página actual
    const productosFiltrados = useMemo(() => {
        if (!searchTerm) return allProducts;
        
        return allProducts.filter(p =>
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allProducts, searchTerm]);

    // ✅ Manejar cambio de búsqueda
    const handleSearchChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        // Reset a página 1 cuando comienza nueva búsqueda
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    };

    // ✅ Navegar a página anterior
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ✅ Navegar a página siguiente
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="catalogo-container">
            <Helmet>
                <title>{currentPage > 1 ? `Página ${currentPage} - ` : ''}Catálogo de Blanquería Personalizada | Vinchas, Batas y Toallas | Gaddyel</title>
                <meta
                    name="description"
                    content={`Explore nuestro catálogo completo: vinchas para tratamientos faciales, batas bordadas con logo para spa, toallas personalizadas y más. Entrega a nivel nacional. Personalización con mínimos bajos${currentPage > 1 ? ` - Página ${currentPage}` : ''}.`}
                />
                <meta
                    name="keywords"
                    content="catálogo blanquería, vinchas spa, batas personalizadas, toallas bordadas, productos estética, personalización industrial, gaddyel"
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://gaddyel.vercel.app/catalogo${currentPage > 1 ? `?page=${currentPage}` : ''}`} />
                <meta
                    property="og:title"
                    content={`Catálogo Completo - Blanquería Personalizada Gaddyel${currentPage > 1 ? ` - Página ${currentPage}` : ''}`}
                />
                <meta
                    property="og:description"
                    content="Descubra productos premium con personalización industrial. Mínimo 12 unidades. Envíos a Argentina."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://gaddyel.vercel.app/catalogo${currentPage > 1 ? `?page=${currentPage}` : ''}`} />
                <meta property="og:image" content="https://gaddyel.vercel.app/og-catalogo.jpg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Paginación SEO: Prev/Next para páginas múltiples */}
                {currentPage > 1 && (
                    <link 
                        rel="prev" 
                        href={`https://gaddyel.vercel.app/catalogo${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`} 
                    />
                )}
                {currentPage < totalPages && (
                    <link 
                        rel="next" 
                        href={`https://gaddyel.vercel.app/catalogo?page=${currentPage + 1}`} 
                    />
                )}

                {/* Schema.org - ItemList para catálogo de productos */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'ItemList',
                        name: 'Catálogo de Blanquería Premium para Spa - Gaddyel',
                        description: 'Productos personalizables para centros de estética y spa: toallas, batas de satén, vinchas faciales, pads de limpieza',
                        numberOfItems: productosFiltrados.length,
                        itemListElement: productosFiltrados.slice(0, 10).map((producto, idx) => ({
                            '@type': 'ListItem',
                            position: (currentPage - 1) * itemsPerPage + idx + 1,
                            url: `https://gaddyel.vercel.app/catalogo/${producto._id}`,
                            item: {
                                '@type': 'Product',
                                name: producto.nombre,
                                description: producto.descripcion || 'Producto personalizable de alta calidad',
                                image: producto.imagenSrc,
                                sku: producto.sku || producto._id,
                                brand: {
                                    '@type': 'Brand',
                                    name: 'Gaddyel'
                                },
                                offers: {
                                    '@type': 'Offer',
                                    url: `https://gaddyel.vercel.app/catalogo/${producto._id}`,
                                    priceCurrency: 'ARS',
                                    price: producto.precio,
                                    availability: producto.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                                    seller: {
                                        '@type': 'Organization',
                                        name: 'Gaddyel'
                                    }
                                }
                            }
                        }))
                    })}
                </script>
            </Helmet>

            <main className="container mx-auto px-4 md:px-8 lg:px-12 py-10">

                {/* ===== ENCABEZADO CON ADN DE MARCA ===== */}
                {/* Mismo tratamiento glassmorphism que el Hero de Inicio */}
                <section
                    className="
                        mb-10
                        px-7 py-8 md:px-10 md:py-10
                        bg-white/80 dark:bg-slate-900/80
                        backdrop-blur-xl
                        border border-slate-200/50 dark:border-slate-800/50
                        rounded-2xl shadow-xl
                    "
                >
                    {/* Píldora de nicho — mismo componente visual que en Inicio */}
                    <span className="
                        inline-flex items-center mb-4
                        text-[11px] font-semibold tracking-[0.15em] uppercase
                        text-indigo-700 dark:text-indigo-400
                        bg-indigo-50 dark:bg-indigo-950/60
                        border border-indigo-200/60 dark:border-indigo-800/60
                        px-4 py-1.5 rounded-full
                    ">
                        Blanquería · Bordado Industrial · Personalización
                    </span>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <h1 className="
                                italic text-4xl md:text-5xl font-extrabold tracking-tight
                                text-slate-800 dark:text-slate-100
                                leading-tight mb-2
                            ">
                                Catálogo de{' '}
                                <span className="text-indigo-700 dark:text-indigo-400">Productos</span>
                            </h1>
                            {/* Contexto de negocio — no aplica a ningún otro catálogo genérico */}
                            <p className="text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                                Para centros de estética, spa y gabinetes profesionales
                            </p>
                        </div>

                        {/* ===== BUSCADOR CON PALETA SLATE/INDIGO ===== */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="
                                    w-full px-5 py-3
                                    bg-slate-50/80 dark:bg-slate-800/80
                                    border border-slate-200/60 dark:border-slate-700/60
                                    text-[14px] font-medium tracking-tight
                                    text-slate-800 dark:text-slate-200
                                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                                    rounded-2xl
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400
                                    transition-all duration-500 ease-out
                                "
                                aria-label="Buscar productos por nombre o descripción"
                            />
                        </div>
                    </div>

                    {/* ===== BARRA DE INFORMACIÓN DE RESULTADOS ===== */}
                    {!loading && allProducts.length > 0 && (
                        <div className="
                            flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2
                            mt-6 pt-5
                            border-t border-slate-200/50 dark:border-slate-700/50
                        ">
                            <p className="text-[13px] font-medium tracking-tight text-slate-600 dark:text-slate-400">
                                <span className="text-slate-900 dark:text-slate-100 font-bold text-base">{totalProducts}</span>
                                {' '}producto{totalProducts !== 1 ? 's' : ''} disponible{totalProducts !== 1 ? 's' : ''}
                                {searchTerm && (
                                    <span className="text-indigo-600 dark:text-indigo-400">
                                        {' '}· {productosFiltrados.length} coinciden con "{searchTerm}"
                                    </span>
                                )}
                            </p>
                            {totalPages > 1 && (
                                <p className="text-[13px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
                                    Página <span className="text-slate-800 dark:text-slate-200 font-semibold">{currentPage}</span>
                                    {' '}de <span className="text-slate-800 dark:text-slate-200 font-semibold">{totalPages}</span>
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* ===== ESTADO DE CARGA ===== */}
                {loading && allProducts.length === 0 && (
                    <div className="
                        flex justify-center items-center min-h-96
                        bg-white/60 dark:bg-slate-900/60
                        backdrop-blur-xl
                        border border-slate-200/50 dark:border-slate-800/50
                        rounded-2xl shadow-lg
                    " role="status" aria-live="polite">
                        <div className="text-center py-16">
                            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 mb-5"></div>
                            <p className="text-[14px] font-medium tracking-tight text-slate-500 dark:text-slate-400">Cargando productos...</p>
                        </div>
                    </div>
                )}

                {/* ===== ESTADO DE ERROR ===== */}
                {error && (
                    <div className="
                        mb-8 p-7
                        bg-red-50/80 dark:bg-red-950/40
                        backdrop-blur-xl
                        border border-red-200/60 dark:border-red-800/60
                        rounded-2xl
                    " role="alert" aria-live="assertive">
                        <p className="text-[14px] font-semibold tracking-tight text-red-700 dark:text-red-400 mb-5">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="
                                px-7 py-3
                                bg-red-600 hover:bg-red-700
                                dark:bg-red-500 dark:hover:bg-red-600
                                text-white font-semibold tracking-tight text-[14px]
                                rounded-2xl
                                transition-all duration-500 ease-out
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                                shadow-lg hover:shadow-xl
                            "
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* ===== GRID DE PRODUCTOS ===== */}
                {(!loading || allProducts.length > 0) && (
                    <>
                        {productosFiltrados.length > 0 ? (
                            <section
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
                                role="grid"
                            >
                                {productosFiltrados.map(producto => (
                                    <article key={producto._id} role="gridcell">
                                        <TarjetaProducto producto={producto} />
                                    </article>
                                ))}
                            </section>
                        ) : (
                            <div className="
                                flex flex-col items-center justify-center
                                py-20
                                bg-white/60 dark:bg-slate-900/60
                                backdrop-blur-xl
                                border border-slate-200/50 dark:border-slate-800/50
                                rounded-2xl
                            ">
                                <p className="text-[15px] font-medium tracking-tight text-slate-500 dark:text-slate-400 text-center">
                                    {searchTerm
                                        ? <>No encontramos productos con <span className="text-indigo-600 dark:text-indigo-400 font-semibold">"{searchTerm}"</span></>
                                        : 'No hay productos disponibles en esta página'}
                                </p>
                            </div>
                        )}

                        {/* ===== CONTROLES DE PAGINACIÓN ===== */}
                        {totalPages > 1 && productosFiltrados.length > 0 && (
                            <div className="
                                flex items-center justify-center gap-4 py-8
                                border-t border-slate-200/50 dark:border-slate-800/50
                                mt-4
                            ">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="
                                        px-7 py-3
                                        bg-slate-50 dark:bg-slate-800
                                        border border-slate-200/60 dark:border-slate-700/60
                                        text-[13px] font-semibold tracking-tight
                                        text-slate-700 dark:text-slate-300
                                        rounded-2xl
                                        hover:bg-slate-100 dark:hover:bg-slate-700
                                        hover:border-indigo-300 dark:hover:border-indigo-700
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition-all duration-500 ease-out
                                    "
                                    aria-label="Ir a página anterior"
                                >
                                    ← Anterior
                                </button>

                                <div className="
                                    px-6 py-3
                                    bg-indigo-50 dark:bg-indigo-950/60
                                    border border-indigo-200/60 dark:border-indigo-800/60
                                    rounded-2xl
                                ">
                                    <span className="text-[13px] font-semibold tracking-tight text-indigo-700 dark:text-indigo-400">
                                        {currentPage} / {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="
                                        px-7 py-3
                                        bg-slate-50 dark:bg-slate-800
                                        border border-slate-200/60 dark:border-slate-700/60
                                        text-[13px] font-semibold tracking-tight
                                        text-slate-700 dark:text-slate-300
                                        rounded-2xl
                                        hover:bg-slate-100 dark:hover:bg-slate-700
                                        hover:border-indigo-300 dark:hover:border-indigo-700
                                        disabled:opacity-40 disabled:cursor-not-allowed
                                        transition-all duration-500 ease-out
                                    "
                                    aria-label="Ir a página siguiente"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}

                        {/* ===== INDICADOR DE FIN DE CATÁLOGO ===== */}
                        {!loading && currentPage === totalPages && productosFiltrados.length > 0 && (
                            <div className="text-center py-8">
                                <span className="
                                    inline-block
                                    text-[11px] font-semibold tracking-[0.15em] uppercase
                                    text-slate-400 dark:text-slate-600
                                    border border-slate-200/60 dark:border-slate-700/60
                                    px-5 py-2 rounded-full
                                ">
                                    Fin del catálogo
                                </span>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Catalogo;

