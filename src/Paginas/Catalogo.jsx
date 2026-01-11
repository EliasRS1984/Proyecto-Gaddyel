import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import useFetchWithCache from '../hooks/useFetchWithCache';

/**
 * FLUJO DE DATOS - Página Catálogo
 * 
 * 1. Usuario entra a /catalogo
 * 2. Componente monta → useFetchWithCache() hook
 * 3. Hook: GET /api/productos?page=1&limit=12 → Backend
 * 4. Backend retorna: { data: [...productos], pagination: { page, pages, total } }
 * 5. Hook: setData(resultado) + Guarda en caché (5 min)
 * 6. Componente re-renderea con datos
 * 7. TarjetaProducto mapea y renderea cada producto
 * 8. Usuario ve: Grid de productos con paginación
 * 
 * INTERACCIÓN DEL USUARIO:
 * - Click siguiente/anterior → updatePage → Scroll al tope
 * - Click número página → setCurrentPage → Re-fetch datos
 * - Búsqueda por nombre → updateSearchTerm → Filtro local
 * 
 * Cada cambio de página → Nuevo GET /api/productos?page=X → Re-fetch datos
 * 
 * RENDIMIENTO:
 * - useFetchWithCache con caché de 5 minutos
 * - React.memo(TarjetaProducto) = evita re-render si props iguales
 * - Lazy loading de imágenes en TarjetaProducto
 * - keepPreviousData = true (muestra datos anteriores mientras carga)
 * 
 * SEO:
 * - react-helmet-async actualiza <title> y <meta>
 * - Canonical URL para evitar contenido duplicado
 * - HTML5 semántico: <article>, <nav>, role="grid"
 * - Open Graph para redes sociales
 */
const Catalogo = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const catalogoRef = useRef(null);

    // ✅ FLUJO: Usar custom hook con caché (5 minutos)
    // ¿Por qué keepPreviousData? Muestra productos anteriores mientras carga nuevos (mejor UX)
    const { data: resultado, loading, error, refetch } = useFetchWithCache(
        '/productos',
        {
            params: {
                page: currentPage,
                limit: itemsPerPage,
                sortBy: 'createdAt',
                sortDir: -1
            },
            cacheDuration: 5 * 60 * 1000, // 5 minutos
            keepPreviousData: true // Mantener datos previos mientras carga
        }
    );

    const productos = resultado?.data || [];
    const pagination = resultado?.pagination || {};

    // ✅ PERFORMANCE: Filtro local de búsqueda (evita re-fetch por cada letra)
    // Si hay muchos productos (>1000), migrar a búsqueda en backend
    const productosFiltrados = searchTerm
        ? productos.filter(p =>
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : productos;

    // ✅ UX: Scroll al tope al cambiar página
    // ¿Por qué? Usuario debe ver inicio de resultados nuevos
    useEffect(() => {
        if (catalogoRef.current && currentPage > 1) {
            catalogoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    // ✅ HELPER: Cambiar página con validación
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setCurrentPage(newPage);
        }
    };

    // ✅ HELPER: Generar array de números de página
    // Muestra: [1] ... [4] [5] [6] ... [10]
    const getPageNumbers = () => {
        const pages = [];
        const totalPages = pagination.pages || 1;
        const currentPageNum = currentPage;

        if (totalPages <= 7) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Mostrar: primera, últimas 2 de cada lado, y última
            pages.push(1);

            if (currentPageNum > 3) {
                pages.push('...');
            }

            for (let i = Math.max(2, currentPageNum - 1); i <= Math.min(totalPages - 1, currentPageNum + 1); i++) {
                pages.push(i);
            }

            if (currentPageNum < totalPages - 2) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <>
            {/* SEO: Metadatos optimizados con canonical y Open Graph */}
            <Helmet>
                <title>{`Catálogo de Productos Artesanales - Gaddyel | Página ${currentPage}`}</title>
                <meta 
                    name="description" 
                    content={`Explora nuestro catálogo completo de productos artesanales personalizables. ${pagination.total || ''} productos únicos. Página ${currentPage} de ${pagination.pages || 1}.`} 
                />
                <link rel="canonical" href={`${window.location.origin}/catalogo?page=${currentPage}`} />
                
                {/* Open Graph */}
                <meta property="og:title" content="Catálogo de Productos Artesanales - Gaddyel" />
                <meta property="og:description" content="Productos únicos y personalizables para cada ocasión." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${window.location.origin}/catalogo`} />
                
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Catálogo de Productos - Gaddyel" />
                <meta name="twitter:description" content="Explora nuestro catálogo completo de productos artesanales." />
            </Helmet>

            <div ref={catalogoRef} className="container mx-auto p-4 md:p-8">
                {/* HEADER: Título y contador */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Catálogo de Productos
                    </h1>
                    {pagination.total > 0 && (
                        <p className="text-gray-600">
                            Mostrando {productos.length} de {pagination.total} productos
                        </p>
                    )}
                </header>

                {/* BÚSQUEDA LOCAL: Filtro rápido sin re-fetch */}
                {productos.length > 0 && (
                    <div className="mb-6">
                        <label htmlFor="search-input" className="sr-only">
                            Buscar productos
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Campo de búsqueda de productos"
                        />
                        {searchTerm && (
                            <p className="mt-2 text-sm text-gray-600">
                                {productosFiltrados.length} resultado(s) encontrado(s)
                            </p>
                        )}
                    </div>
                )}

                {/* 1. PRIORIDAD MÁXIMA: Si está cargando por primera vez (sin datos previos) */}
                {loading && productos.length === 0 ? (
                    <div className="flex justify-center items-center min-h-[400px]" role="status" aria-live="polite">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                            <p className="text-gray-600">Cargando productos...</p>
                        </div>
                    </div>
                ) : error ? (
                    /* 2. SEGUNDA PRIORIDAD: Si ya terminó de cargar y hubo un error */
                    <div 
                        className="mb-4 p-6 bg-red-50 border-l-4 border-red-400 text-red-700 rounded"
                        role="alert"
                        aria-live="assertive"
                    >
                        <h2 className="text-lg font-semibold mb-2">Error al cargar productos</h2>
                        <p className="mb-4">{error}</p>
                        <button
                            onClick={refetch}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            aria-label="Reintentar carga de productos"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : productosFiltrados.length > 0 ? (
                    /* 3. TERCERA PRIORIDAD: Si hay productos para mostrar */
                    <>
                        {/* Indicador de carga entre páginas */}
                        {loading && productos.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center">
                                <span className="inline-block animate-pulse">Cargando nueva página...</span>
                            </div>
                        )}

                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            role="grid"
                            aria-label="Catálogo de productos"
                        >
                            {productosFiltrados.map(producto => (
                                <article key={producto._id} role="gridcell">
                                    <TarjetaProducto producto={producto} showPrice={true} />
                                </article>
                            ))}
                        </div>

                        {/* PAGINACIÓN COMPLETA */}
                        {pagination.pages > 1 && !searchTerm && (
                            <nav 
                                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3" 
                                aria-label="Paginación del catálogo"
                                role="navigation"
                            >
                                {/* Botón Anterior */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                                    aria-label="Ir a página anterior"
                                    aria-disabled={currentPage === 1}
                                >
                                    ← Anterior
                                </button>

                                {/* Números de página */}
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {getPageNumbers().map((pageNum, idx) => (
                                        pageNum === '...' ? (
                                            <span 
                                                key={`ellipsis-${idx}`} 
                                                className="px-3 py-2 text-gray-500"
                                                aria-hidden="true"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                disabled={currentPage === pageNum}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                    currentPage === pageNum
                                                        ? 'bg-blue-600 text-white cursor-default'
                                                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                                                }`}
                                                aria-label={`Ir a página ${pageNum}`}
                                                aria-current={currentPage === pageNum ? 'page' : undefined}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    ))}
                                </div>

                                {/* Botón Siguiente */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.pages}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                                    aria-label="Ir a página siguiente"
                                    aria-disabled={currentPage === pagination.pages}
                                >
                                    Siguiente →
                                </button>
                            </nav>
                        )}

                        {/* Info de página actual */}
                        {pagination.pages > 1 && !searchTerm && (
                            <p className="mt-4 text-center text-sm text-gray-600">
                                Página {currentPage} de {pagination.pages}
                            </p>
                        )}
                    </>
                ) : searchTerm ? (
                    /* 4. No hay resultados de búsqueda */
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-2">
                            No se encontraron productos con "{searchTerm}"
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 hover:text-blue-700 underline focus:ring-2 focus:ring-blue-500 rounded"
                        >
                            Limpiar búsqueda
                        </button>
                    </div>
                ) : (
                    /* 5. ÚLTIMO CASO: Si terminó de cargar, no hay error pero la lista está vacía */
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No hay productos disponibles.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Catalogo;

