import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

/**
 * FLUJO DE DATOS - Página Catálogo (Infinite Scroll)
 * 
 * 1. Usuario entra a /catalogo
 * 2. Componente monta → useInfiniteScroll() hook
 * 3. Hook: GET /api/productos?page=1&limit=12 → Backend
 * 4. Backend retorna: { data: [...12 productos], pagination: { pages, total } }
 * 5. Hook: setItems(12 productos)
 * 6. Componente renderea grid con 12 productos
 * 7. Usuario scrollea hacia abajo
 * 8. Intersection Observer detecta scroll al final
 * 9. Hook carga página 2 automáticamente: GET /api/productos?page=2&limit=12
 * 10. Nuevos 12 productos se AGREGAN a lista (no reemplazan)
 * 11. Usuario ve continuidad sin saltos
 * 
 * INTERACCIÓN DEL USUARIO:
 * - Scroll natural hacia abajo → Carga automática de más productos
 * - Búsqueda por nombre → Reset de infinite scroll, filtra localmente
 * - No hay botones de página (UX más limpia)
 * 
 * DIFERENCIA vs PAGINACIÓN ANTERIOR:
 * ✅ Nuevo: Scroll continuo, carga automática
 * ✅ Nuevo: Mejora UX (scroll natural en mobile)
 * ✅ Nuevo: No hay clics en números de página
 * ❌ Removido: Paginación manual (números de página)
 * 
 * RENDIMIENTO:
 * - useInfiniteScroll con Intersection Observer (no scroll events)
 * - React.memo(TarjetaProducto) = evita re-render si props iguales
 * - Lazy loading de imágenes en TarjetaProducto
 * - Debouncing automático (evita múltiples requests simultáneos)
 * 
 * SEO:
 * - react-helmet-async actualiza <title> y <meta>
 * - Canonical URL única (no por página, ya que es scroll continuo)
 * - HTML5 semántico: <article>, <main>, role="grid"
 * - Open Graph para redes sociales
 */
const Catalogo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage] = useState(12);

    // ✅ FLUJO: Usar custom hook infinite scroll
    // El hook gestiona automáticamente:
    // - Carga de páginas
    // - Detección de scroll
    // - Agregación de items
    const { 
        items: todosLosProductos, 
        loading, 
        error, 
        hasMore, 
        refetch,
        sentinelRef,
        reset
    } = useInfiniteScroll(
        '/productos',
        {
            limit: itemsPerPage,
            params: {
                sortBy: 'createdAt',
                sortDir: -1
            }
        }
    );

    // ✅ PERFORMANCE: Filtro local de búsqueda (evita re-fetch por cada letra)
    // Si hay muchos productos (>5000), migrar a búsqueda en backend
    const productosFiltrados = useMemo(() => {
        if (!searchTerm) return todosLosProductos;
        
        return todosLosProductos.filter(p =>
            p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [todosLosProductos, searchTerm]);

    // ✅ UX: Cuando cambia búsqueda, resetear infinite scroll
    const handleSearchChange = (e) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        
        // Si es búsqueda, resetear (sin búsqueda, no resetear para mantener scroll)
        if (newTerm && !searchTerm) {
            reset();
        }
    };

    return (
        <>
            {/* SEO: Metadatos optimizados - Canonical única (no por página) */}
            <Helmet>
                <title>Catálogo de Productos Artesanales - Gaddyel</title>
                <meta 
                    name="description" 
                    content="Explora nuestro catálogo completo de productos artesanales personalizables. Cientos de productos únicos con scroll continuo." 
                />
                {/* Canonical única (sin ?page=X ya que es infinite scroll) */}
                <link rel="canonical" href={`${window.location.origin}/catalogo`} />
                
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

            <div className="container mx-auto p-4 md:p-8">
                {/* HEADER: Título y contador */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Catálogo de Productos
                    </h1>
                    {todosLosProductos.length > 0 && (
                        <p className="text-gray-600">
                            Mostrando {todosLosProductos.length} productos{' '}
                            {!hasMore && '(Todos cargados)'}
                        </p>
                    )}
                </header>

                {/* BÚSQUEDA LOCAL: Filtro rápido sin re-fetch */}
                {todosLosProductos.length > 0 && (
                    <div className="mb-6">
                        <label htmlFor="search-input" className="sr-only">
                            Buscar productos
                        </label>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                {loading && todosLosProductos.length === 0 ? (
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

                        {/* SENTINEL: Elemento invisible que detecta scroll al final */}
                        {!searchTerm && hasMore && (
                            <div
                                ref={sentinelRef}
                                className="h-10 mt-12 flex items-center justify-center"
                                role="status"
                                aria-live="polite"
                                aria-label="Cargando más productos"
                            >
                                {loading && (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                                        <span className="text-sm text-gray-600">Cargando más productos...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mensaje cuando se termina el scroll */}
                        {!hasMore && (
                            <p className="mt-12 text-center text-gray-600 text-sm">
                                ✓ Todos los productos han sido cargados
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
                            onClick={() => {
                                setSearchTerm('');
                                reset();
                            }}
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

