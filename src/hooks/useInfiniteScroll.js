import { useState, useEffect, useRef, useCallback } from 'react';

// Asegurarse de que la URL sea completa
const getFullUrl = (url) => {
    if (url.startsWith('http')) return url;
    const API_BASE = import.meta.env.VITE_API_BASE || "https://gaddyel-backend.onrender.com";
    // Si URL ya empieza con /api, no duplicar
    // Si URL no tiene /api, agregarlo
    const path = url.startsWith('/api') ? url : '/api/' + url;
    return `${API_BASE}${path}`;
};

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
    const failedAttemptsRef = useRef(0); // Contador de intentos fallidos

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

            const fullUrl = `${getFullUrl(url)}?${params.toString()}`;
            
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
            const totalPagesFromAPI = pagination.pages || 1;
            setTotalPages(totalPagesFromAPI);
            
            // CORREGIR: hasMore debe ser true si aún hay más páginas por cargar
            // Si currentPage (1-indexed) < totalPages, significa hay más páginas
            // EJEMPLO: si totalPages=5, podemos cargar páginas 1,2,3,4,5
            // cuando currentPage=5, no hay más (5 no es < 5)
            const morePages = pageNum < totalPagesFromAPI;
            setHasMore(morePages);
            
            console.log(`📄 Página ${pageNum}/${totalPagesFromAPI} cargada. Items: ${newData.length}, hasMore: ${morePages}`);
            
            setError(null);
            failedAttemptsRef.current = 0; // Reset contador de fallos

        } catch (err) {
            console.error('Error fetching infinite scroll data:', err);
            failedAttemptsRef.current += 1;
            
            // Detener después de 3 intentos fallidos
            if (failedAttemptsRef.current >= 3) {
                setError(`Error cargando productos: ${err.message}. Por favor recarga la página.`);
                setHasMore(false); // Detener intentos de cargar más
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [url, config]);

    // ✅ SETUP: Intersection Observer para detectar scroll al final
    useEffect(() => {
        // Siempre observar si hay sentinel (incluso si loading=true)
        // Solo evitar si hasMore=false
        if (!sentinelRef.current) {
            console.log('❌ Sentinel ref no existe aún');
            return;
        }

        if (!hasMore) {
            console.log('✅ No hay más páginas, desconectar observer');
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            return;
        }

        console.log('👁️ Configurando Intersection Observer...');

        // Crear observer con margen de 500px antes de llegar al final
        const observerOptions = {
            root: null,
            rootMargin: '500px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log('🔍 Sentinel detectado:', {
                    isIntersecting: entry.isIntersecting,
                    isLoading: isLoadingRef.current,
                    hasMore: hasMore
                });
                
                // Si el sentinel entra en viewport, cargar siguiente página
                if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
                    console.log('📥 Cargando página siguiente...');
                    setCurrentPage(prev => prev + 1);
                }
            });
        }, observerOptions);

        observerRef.current.observe(sentinelRef.current);
        console.log('👀 Observer iniciado');

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore]);

    // ✅ TRIGGER: Cargar nueva página cuando currentPage cambia
    useEffect(() => {
        console.log(`📤 Fetcheando página ${currentPage}...`);
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
