import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook: useInfiniteScroll
 * 
 * Maneja carga infinita de datos con Intersection Observer API.
 * Carga automáticamente más items cuando el usuario hace scroll al final.
 * 
 * FLUJO:
 * 1. Usuario scrollea hacia el final de la página
 * 2. useRef detecta elemento sentinel (ref)
 * 3. Intersection Observer dispara callback
 * 4. Hook incrementa página y fetch datos nuevos
 * 5. Nuevos items se agregan a lista existente (NO reemplazan)
 * 6. Usuario ve continuidad sin saltos
 * 
 * OPTIMIZACIONES:
 * - Usa Intersection Observer (mejor performance que scroll events)
 * - Debouncing automático (evita múltiples requests)
 * - Soporta búsqueda local (resetea lista al cambiar término)
 * 
 * @param {string} url - URL del endpoint API
 * @param {object} config - Configuración (params, cacheDuration, etc)
 * @returns {object} { items, loading, error, hasMore, refetch, sentinelRef }
 */
export const useInfiniteScroll = (url, config = {}) => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    
    const sentinelRef = useRef(null);
    const isLoadingRef = useRef(false);
    const observerRef = useRef(null);

    // ✅ HELPER: Fetch datos de una página específica
    const fetchPage = useCallback(async (pageNum) => {
        // Evitar requests duplicados
        if (isLoadingRef.current) return;
        
        try {
            isLoadingRef.current = true;
            setLoading(true);

            // Construir URL con parámetros
            const params = new URLSearchParams({
                ...(config.params || {}),
                page: pageNum,
                limit: config.limit || 12
            });

            const fullUrl = `${url}?${params.toString()}`;
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.headers || {})
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const newData = data?.data || [];
            const pagination = data?.pagination || {};

            // Agregar nuevos items a la lista existente (NO reemplazar)
            if (pageNum === 1) {
                // Primera página: reemplazar
                setItems(newData);
            } else {
                // Páginas siguientes: agregar
                setItems(prev => [...prev, ...newData]);
            }

            // Actualizar metadata de paginación
            setTotalPages(pagination.pages || 1);
            setHasMore(pageNum < (pagination.pages || 1));
            setError(null);

        } catch (err) {
            console.error('Error fetching infinite scroll data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [url, config]);

    // ✅ SETUP: Intersection Observer para detectar scroll al final
    useEffect(() => {
        // Si no hay más datos o está cargando, no observar
        if (!hasMore || loading || !sentinelRef.current) return;

        // Crear observer con margen de 500px antes de llegar al final
        const observerOptions = {
            root: null,
            rootMargin: '500px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // Si el sentinel entra en viewport, cargar siguiente página
                if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
                    setCurrentPage(prev => prev + 1);
                }
            });
        }, observerOptions);

        observerRef.current.observe(sentinelRef.current);

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loading]);

    // ✅ TRIGGER: Cargar nueva página cuando currentPage cambia
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage, fetchPage]);

    // ✅ HELPER: Resetear y cargar desde página 1 (útil para búsquedas)
    const refetch = useCallback(() => {
        setCurrentPage(1);
        setItems([]);
        setHasMore(true);
    }, []);

    return {
        items,
        loading,
        error,
        hasMore,
        totalItems: items.length,
        refetch,
        sentinelRef,
        // Útil para reset cuando cambia búsqueda
        reset: () => {
            setCurrentPage(1);
            setItems([]);
            setHasMore(true);
            setError(null);
        }
    };
};

export default useInfiniteScroll;
