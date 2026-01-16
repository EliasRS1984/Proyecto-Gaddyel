import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * 🔄 useFetchWithRetry - Hook para fetch con reintentos automáticos
 * 
 * FLUJO (Maneja Cold Start de Render):
 * 1. Intenta fetch
 * 2. Si falla (timeout/503) → Reintentar con backoff exponencial
 * 3. Espera 1s → 2s → 4s → 8s (máximo 3 reintentos)
 * 4. Si sigue fallando → muestra error
 * 
 * BENEFICIO: Cuando Render desperta (20-30s), usuario NO ve datos vacíos
 * El hook reintentar automáticamente hasta que backend responda
 * 
 * @param {string} url - Ruta de API (/api/productos, etc)
 * @param {object} options - {retries, backoff, timeout}
 * @returns {object} {data, loading, error, refetch}
 */
export function useFetchWithRetry(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const retryCountRef = useRef(0);
    const timeoutRef = useRef(null);

    const {
        retries = 3,              // Reintentos totales
        initialDelay = 1000,      // Primer reintento: 1s
        maxDelay = 8000,          // Máximo delay: 8s
        timeout = 10000,          // Timeout por request: 10s
        params = {}
    } = options;

    const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

    /**
     * Calcular delay con backoff exponencial
     * Reintento 1: 1s
     * Reintento 2: 2s
     * Reintento 3: 4s
     */
    const getBackoffDelay = useCallback((attemptNumber) => {
        const delay = Math.min(
            initialDelay * Math.pow(2, attemptNumber - 1),
            maxDelay
        );
        return delay;
    }, [initialDelay, maxDelay]);

    /**
     * Fetch con reintentos automáticos
     */
    const fetchWithRetry = useCallback(async (attemptNumber = 1) => {
        try {
            setLoading(true);
            setError(null);

            logger.debug(`[useFetchWithRetry] Intento ${attemptNumber}/${retries + 1}: ${fullUrl}`);

            const response = await axios.get(fullUrl, {
                params,
                timeout,
                // Para detectar Cold Start (503 Service Unavailable)
                validateStatus: (status) => status < 500 || status === 503
            });

            // ✅ Éxito
            if (response.status === 200 || response.status === 304) {
                setData(response.data);
                setError(null);
                setLoading(false);
                retryCountRef.current = 0;
                logger.debug(`[useFetchWithRetry] ✅ Datos cargados exitosamente`);
                return;
            }

            // ⚠️ Cold Start (503) o servidor ocupado → REINTENTAR
            if (response.status === 503 || response.status === 429) {
                throw new Error(`Server unavailable (${response.status})`);
            }

            // ❌ Otros errores HTTP (4xx) → NO reintentar
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        } catch (err) {
            const isNetworkError = !err.response; // Timeout, CORS, etc
            const shouldRetry = attemptNumber <= retries && (
                isNetworkError || 
                err.response?.status === 503 || 
                err.code === 'ECONNABORTED' ||
                err.message.includes('Service unavailable')
            );

            if (shouldRetry) {
                // Calcular delay para reintento
                const delay = getBackoffDelay(attemptNumber);
                logger.warn(
                    `[useFetchWithRetry] Reintentando en ${delay}ms ` +
                    `(intento ${attemptNumber}/${retries}): ${err.message}`
                );

                // Programar reintento
                timeoutRef.current = setTimeout(() => {
                    fetchWithRetry(attemptNumber + 1);
                }, delay);

                return;
            }

            // ❌ No hay más reintentos
            setLoading(false);
            setData(null);
            setError(err.message || 'Error al cargar datos');
            retryCountRef.current = 0;

            logger.error(
                `[useFetchWithRetry] ❌ Fallo definitivo después de ${attemptNumber} intentos: ${err.message}`
            );
        }
    }, [fullUrl, params, timeout, retries, getBackoffDelay]);

    /**
     * Al montar: Iniciar fetch
     */
    useEffect(() => {
        fetchWithRetry(1);

        return () => {
            // Limpiar timeout pendiente
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [fullUrl, JSON.stringify(params)]);

    /**
     * Refetch manual
     */
    const refetch = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        retryCountRef.current = 0;
        fetchWithRetry(1);
    }, [fetchWithRetry]);

    return { data, loading, error, refetch };
}
