// ============================================================
// ¿QUÉ ES ESTO?
// Funciones que se comunican con el servidor para traer la lista
// de productos del catálogo y los detalles de un producto en
// particular.
//
// ¿CÓMO FUNCIONA?
// 1. Cada función hace una solicitud al servidor con los filtros
//    o el ID que recibe.
// 2. Si el servidor tarda o falla (cold start de Render), reintenta
//    automáticamente hasta 3 veces antes de mostrar un error.
// 3. Retorna los datos listos para que el componente los muestre.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿Productos no cargan? → Revisar obtenerProductos() y la URL de API.
// - ¿Un producto no se encuentra? → Revisar obtenerProductoPorId().
// - ¿Timeout recurrente? → El servidor puede estar en cold start.
//   El manejo de reintentos está en fetchWithRetry().
// ============================================================

import axiosInstance from './axiosInstance';
import { logger } from '../utils/logger';

/**
 * ✅ Reintentos con backoff exponencial para manejar Cold Start de Render
 * 
 * FLUJO:
 * - Reintento 1: Falla inmediatamente
 * - Espera 1s → Reintento 2
 * - Espera 2s → Reintento 3
 * - Espera 4s → Reintento 4 (máximo)
 * 
 * Esto da tiempo a Render (~20-30s) para despertar del Cold Start
 */
// Reintentos con backoff exponencial para manejar el arranque lento del servidor.
// Intento 1: 35s (cubre cold start de Render que tarda hasta 50s)
// Intento 2+: 20s (el servidor ya debería estar despierto)
async function fetchWithRetry(path, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        // El primer intento espera más tiempo porque el servidor puede estar dormido.
        // Los reintentos son más cortos: si el servidor tardó, ya estará despierto.
        const timeout = attempt === 1 ? 35000 : 20000;

        try {
            const response = await axiosInstance.get(path, { timeout });
            return response;

        } catch (error) {
            lastError = error;
            const status = error.response?.status;

            const shouldRetry = attempt <= maxRetries && (
                status === 503 ||
                status === 502 ||
                error.code === 'ECONNABORTED' ||
                error.message?.toLowerCase().includes('timeout') ||
                error.message?.toLowerCase().includes('network error')
            );

            if (shouldRetry) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                logger.warn(
                    `[productosService] Reintentando en ${delay}ms ` +
                    `(intento ${attempt}/${maxRetries + 1}): ${error.message}`
                );
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            throw lastError;
        }
    }

    throw lastError;
}

/**
 * ✅ MEJORADO: Obtiene todos los productos con paginación servidor
 * Backend ahora retorna: { data: [], pagination: { total, page, limit, pages } }
 * 
 * MANEJO DE COLD START:
 * - Reintentos automáticos cada 1s, 2s, 4s
 * - Timeout de 8s por intento
 * - Máximo 3 reintentos antes de fallar
 */
export const obtenerProductos = async (params = {}) => {
    try {
        logger.debug("📤 GET /productos", params);
        
        // Construir query string
        const queryParams = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 12,
            sortBy: params.sortBy || 'createdAt',
            sortDir: params.sortDir || -1,
            ...params
        });
        
        const respuesta = await fetchWithRetry(`/api/productos?${queryParams.toString()}`);
        const resultado = respuesta.data;
        
        // ✅ Backend retorna { data, pagination }
        const productos = resultado.data || resultado; // Backwards compatibility
        
        logger.debug("✅ Productos cargados:", productos.length, "items");
        logger.debug("📊 Paginación:", resultado.pagination);
        
        // Retornar estructura compatible con frontend
        return {
            productos,
            pagination: resultado.pagination || null
        };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            logger.error('[productosService] Timeout en solicitud de productos');
            throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
        }
        logger.error('[productosService] Error cargando productos:', error.message);
        throw new Error('No se pudieron cargar los productos. Por favor, intenta más tarde.');
    }
};

// Obtiene un producto por ID con reintentos automáticos.
export const obtenerProductoPorId = async (id) => {
    try {
        logger.debug(`📤 GET /productos/${id}`);
        const respuesta = await fetchWithRetry(`/api/productos/${id}`);
        const producto = respuesta.data;
        logger.debug("✅ Producto cargado:", producto.nombre);
        return producto;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            logger.error('[productosService] Timeout en solicitud de producto');
            throw new Error('La solicitud tardó demasiado.');
        }
        logger.error('[productosService] Error cargando producto:', error.message);
        throw new Error('Error al obtener el producto');
    }
};
