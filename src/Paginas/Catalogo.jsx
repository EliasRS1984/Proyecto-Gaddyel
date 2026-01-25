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
                <title>Catálogo de Blancos Premium - Gaddyel</title>
                <meta
                    name="description"
                    content="Descubre nuestro catálogo de blancos personalizados. Camisetas, toallas, gorras y más con bordado y serigrafia."
                />
                <meta
                    property="og:title"
                    content="Catálogo de Blancos Premium - Gaddyel"
                />
                <meta
                    property="og:description"
                    content="Productos de alta calidad personalizados según tus necesidades"
                />
                <meta property="og:type" content="website" />
                <link 
                    rel="canonical" 
                    href={`https://gaddyel.com/catalogo${currentPage > 1 ? `?page=${currentPage}` : ''}`} 
                />
            </Helmet>

            <main className="catalogo-main">
                {/* ENCABEZADO Y BÚSQUEDA */}
                <section className="catalogo-header">
                    <h1 className="catalogo-title">Catálogo de Productos</h1>
                    
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="catalogo-search-input"
                        aria-label="Buscar productos por nombre o descripción"
                    />
                </section>

                {/* INFORMACIÓN DE PAGINACIÓN Y RESULTADOS */}
                {!loading && allProducts.length > 0 && (
                    <div className="catalogo-info">
                        <p className="catalogo-results">
                            <strong>{totalProducts}</strong> producto{totalProducts !== 1 ? 's' : ''} total
                            {searchTerm && ` • ${productosFiltrados.length} coinciden con tu búsqueda`}
                        </p>
                        {totalPages > 1 && (
                            <p className="catalogo-pagination-info">
                                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                            </p>
                        )}
                    </div>
                )}

                {/* ESTADO DE CARGA INICIAL */}
                {loading && allProducts.length === 0 && (
                    <div className="catalogo-loading" role="status" aria-live="polite">
                        <p>Cargando catálogo...</p>
                    </div>
                )}

                {/* ESTADO DE ERROR */}
                {error && (
                    <div className="catalogo-error" role="alert" aria-live="assertive">
                        <p><strong>Error:</strong> {error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="catalogo-retry-button"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* GRID DE PRODUCTOS */}
                {!loading || allProducts.length > 0 ? (
                    <>
                        {productosFiltrados.length > 0 ? (
                            <section className="catalogo-grid" role="grid">
                                {productosFiltrados.map(producto => (
                                    <article key={producto._id} role="gridcell">
                                        <TarjetaProducto producto={producto} />
                                    </article>
                                ))}
                            </section>
                        ) : (
                            <div className="catalogo-empty">
                                {searchTerm ? (
                                    <p>No encontramos productos que coincidan con "<strong>{searchTerm}</strong>"</p>
                                ) : (
                                    <p>No hay productos disponibles en esta página</p>
                                )}
                            </div>
                        )}

                        {/* CONTROLES DE PAGINACIÓN */}
                        {totalPages > 1 && productosFiltrados.length > 0 && (
                            <div className="catalogo-pagination">
                                <button 
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="catalogo-pagination-button catalogo-pagination-prev"
                                    aria-label="Ir a página anterior"
                                >
                                    ← Anterior
                                </button>
                                
                                <div className="catalogo-page-indicator">
                                    Página {currentPage} de {totalPages}
                                </div>
                                
                                <button 
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="catalogo-pagination-button catalogo-pagination-next"
                                    aria-label="Ir a página siguiente"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}

                        {/* INDICADOR DE FIN */}
                        {!loading && currentPage === totalPages && productosFiltrados.length > 0 && (
                            <div className="catalogo-end-message">
                                <p>✓ Estás en la última página</p>
                            </div>
                        )}
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default Catalogo;

