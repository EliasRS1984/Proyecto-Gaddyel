import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

/**
 * ✅ useFetchWithCache - Hook personalizado para fetch con caché
 * Características:
 * - Caché en memoria para evitar re-fetches innecesarios
 * - Revalidación configurable (por tiempo o manual)
 * - Manejo de errores
 * - Estados: loading, error, data
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos por defecto
const API_BASE = (import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com').replace(/\/api$/, '');
const cache = new Map();

function useFetchWithCache(urlPath, options = {}) {
    const [data, setData] = useState(null);
    const [previousData, setPreviousData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const {
        cacheDuration = CACHE_DURATION,
        revalidateOnFocus = true,
        skipCache = false,
        params = {},
        keepPreviousData = true // Nuevo: mantener datos anteriores mientras carga
    } = options;

    // ✅ Construir URL completa
    const fullUrl = useMemo(() => {
        if (urlPath.startsWith('http')) return urlPath;
        
        // Quitamos /api del inicio de urlPath si ya existe para evitar duplicados
        const cleanPath = urlPath.startsWith('/api') ? urlPath.replace('/api', '') : urlPath;
        
        // Forzamos una sola estructura: BASE + /api + RUTA
        // Evitar barras dobles innecesarias
        const url = `${API_BASE}/api${cleanPath}`.replace(/\/+/g, '/').replace(':/', '://');
        
        // DEBUG: Log de URL construida
        if (cleanPath.includes('productos')) {
            console.log('🔵 [useFetchWithCache] URL construida:', url);
            console.log('   API_BASE:', API_BASE);
            console.log('   urlPath:', urlPath);
            console.log('   cleanPath:', cleanPath);
        }
        
        return url;
    }, [urlPath]);
    
    // ✅ Serializar params para dependencias del efecto
    const paramsKey = useMemo(() => JSON.stringify(params), [params]);
    const queryString = useMemo(() => new URLSearchParams(params).toString(), [params]);
    const cacheKey = useMemo(() => `${fullUrl}?${queryString}`, [fullUrl, queryString]);

    /**
     * ✅ Fetch de datos - sin getCachedData en dependencias
     */
    useEffect(() => {
        const getCachedData = () => {
            if (skipCache) return null;

            const cached = cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < cacheDuration) {
                return cached.data;
            }

            // Caché expirado
            if (cached) {
                cache.delete(cacheKey);
            }

            return null;
        };

        const fetchData = async () => {
            // Verificar caché primero
            const cachedData = getCachedData();
            if (cachedData) {
                setData(cachedData);
                setPreviousData(cachedData);
                setLoading(false);
                return;
            }

            try {
                // Si keepPreviousData es true, no limpiar data al comenzar carga
                if (!keepPreviousData) {
                    setData(null);
                }
                setLoading(true);
                setError(null);

                // DEBUG: Log antes de fetch
                if (fullUrl.includes('productos')) {
                    console.log('📤 [useFetchWithCache] Iniciando fetch:', fullUrl);
                }

                // Crear AbortController para cancelar requests
                abortControllerRef.current = new AbortController();

                const response = await axios.get(fullUrl, {
                    params,
                    signal: abortControllerRef.current.signal,
                    timeout: 10000 // 10 segundos timeout
                });

                // DEBUG: Log respuesta
                if (fullUrl.includes('productos')) {
                    console.log('✅ [useFetchWithCache] Respuesta recibida:', response.data);
                }

                // Guardar en caché
                cache.set(cacheKey, {
                    data: response.data,
                    timestamp: Date.now()
                });

                // Actualizar con nuevos datos
                setPreviousData(response.data);
                setData(response.data);
                setError(null);
            } catch (err) {
                // DEBUG: Log error
                if (fullUrl.includes('productos')) {
                    console.log('❌ [useFetchWithCache] Error en fetch:', err.message, err.response?.status, err.response?.data);
                }

                // Ignorar errores de cancelación
                if (err.name === 'AbortError') {
                    return;
                }

                setError(err.message || 'Error al cargar datos');
                
                // Mantener datos anteriores si está disponible
                if (!keepPreviousData && previousData) {
                    setData(previousData);
                } else if (!keepPreviousData) {
                    setData(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            // Limpiar: cancelar request pendiente
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fullUrl, paramsKey, cacheKey, skipCache, cacheDuration, keepPreviousData, previousData]);

    /**
     * ✅ Revalidar caché manualmente
     */
    const refetch = useCallback(() => {
        cache.delete(cacheKey);
        setLoading(true);
        // Trigger effect again by clearing cache
        setData(null);
    }, [cacheKey]);

    /**
     * ✅ Invalidar caché de forma manual
     */
    const invalidateCache = useCallback(() => {
        cache.delete(cacheKey);
    }, [cacheKey]);

    return {
        data,
        loading,
        error,
        refetch,
        invalidateCache,
        previousData // Exportar datos anteriores para referencia
    };
}

export default useFetchWithCache;
