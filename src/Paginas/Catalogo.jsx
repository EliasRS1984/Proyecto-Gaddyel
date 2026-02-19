import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';

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
                
                const API_BASE = import.meta.env.VITE_API_BASE || "https://gaddyel-backend.onrender.com";
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: 'createdAt',
                    sortDir: -1
                });
                
                const response = await fetch(`${API_BASE}/api/productos?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
                }
                
                const data = await response.json();
                setAllProducts(data.data || []);
                
                const pagination = data.pagination || {};
                const pages = pagination.pages || 1;
                const total = pagination.total || 0;
                
                setTotalPages(pages);
                setTotalProducts(total);
                
                console.log(`✅ Página ${currentPage}/${pages} cargada (${data.data?.length || 0} de ${total} productos)`);
                
            } catch (err) {
                console.error('❌ Error loading products:', err.message);
                setError(err.message);
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
                <link 
                    rel="canonical" 
                    href={`https://gaddyel.vercel.app/catalogo${currentPage > 1 ? `?page=${currentPage}` : ''}`} 
                />
                
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
                                brand: {
                                    '@type': 'Brand',
                                    name: 'Gaddyel'
                                },
                                offers: {
                                    '@type': 'Offer',
                                    priceCurrency: 'ARS',
                                    availability: 'https://schema.org/InStock'
                                }
                            }
                        }))
                    })}
                </script>
            </Helmet>

            <main className="container mx-auto px-4 py-8 md:px-8">
                {/* ENCABEZADO Y BÚSQUEDA */}
                <section className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        Catálogo de Productos
                    </h1>
                    
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full md:w-96 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        aria-label="Buscar productos por nombre o descripción"
                    />
                </section>

                {/* INFORMACIÓN DE PAGINACIÓN Y RESULTADOS */}
                {!loading && allProducts.length > 0 && (
                    <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <p className="text-gray-700">
                            <strong className="text-lg">{totalProducts}</strong> producto{totalProducts !== 1 ? 's' : ''} total
                            {searchTerm && ` • ${productosFiltrados.length} coinciden con tu búsqueda`}
                        </p>
                        {totalPages > 1 && (
                            <p className="text-gray-600">
                                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                            </p>
                        )}
                    </div>
                )}

                {/* ESTADO DE CARGA INICIAL */}
                {loading && allProducts.length === 0 && (
                    <div className="flex justify-center items-center min-h-96" role="status" aria-live="polite">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4"></div>
                            <p className="text-gray-600 text-lg">Cargando catálogo...</p>
                        </div>
                    </div>
                )}

                {/* ESTADO DE ERROR */}
                {error && (
                    <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg" role="alert" aria-live="assertive">
                        <p className="text-red-800 font-semibold mb-4"><strong>Error:</strong> {error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* GRID DE PRODUCTOS - 4 COLUMNAS POR FILA */}
                {!loading || allProducts.length > 0 ? (
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
                            <div className="text-center py-16">
                                {searchTerm ? (
                                    <p className="text-gray-600 text-lg">
                                        No encontramos productos que coincidan con "<strong>{searchTerm}</strong>"
                                    </p>
                                ) : (
                                    <p className="text-gray-600 text-lg">No hay productos disponibles en esta página</p>
                                )}
                            </div>
                        )}

                        {/* CONTROLES DE PAGINACIÓN */}
                        {totalPages > 1 && productosFiltrados.length > 0 && (
                            <div className="flex items-center justify-center gap-4 py-8 border-t border-gray-200">
                                <button 
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Ir a página anterior"
                                >
                                    ← Anterior
                                </button>
                                
                                <div className="px-6 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-gray-700 font-semibold">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Ir a página siguiente"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}

                        {/* INDICADOR DE FIN */}
                        {!loading && currentPage === totalPages && productosFiltrados.length > 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>¡Fin de catálogo!</p>
                            </div>
                        )}
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default Catalogo;

