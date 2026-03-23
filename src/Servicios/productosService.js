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

import { logger } from '../utils/logger';

const API_BASE = import.meta.env.VITE_API_BASE || "https://gaddyel-backend.onrender.com";
const API_URL = `${API_BASE}/api/productos`;

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
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    const { timeout = 8000, ...fetchOptions } = options;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // ✅ Éxito
            if (response.ok) {
                return response;
            }

            // ⚠️ Cold Start (503 Service Unavailable)
            if (response.status === 503) {
                lastError = new Error(`Server unavailable (Cold Start)`);
                if (attempt <= maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                    logger.warn(
                        `[productosService] 503 - Reintentando en ${delay}ms ` +
                        `(intento ${attempt}/${maxRetries + 1})`
                    );
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw lastError;
            }

            // ❌ Otros errores HTTP
            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            lastError = error;

            // Reintentar solo en errores de red o timeout
            if (attempt <= maxRetries && (
                error.name === 'AbortError' || 
                error.message.includes('Cold Start') ||
                error.message.includes('Failed to fetch')
            )) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                logger.warn(
                    `[productosService] Error de red - Reintentando en ${delay}ms ` +
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
        logger.debug("🌐 Frontend Web - API_BASE:", API_BASE);
        logger.debug("📤 Fetch: GET /productos", params);
        
        // Construir query string
        const queryParams = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 12,
            sortBy: params.sortBy || 'createdAt',
            sortDir: params.sortDir || -1,
            ...params
        });
        
        const respuesta = await fetchWithRetry(
            `${API_URL}?${queryParams.toString()}`,
            { headers: { 'Accept': 'application/json' } }
        );
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al obtener productos`);
        }
        
        const resultado = await respuesta.json();
        
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
        if (error.name === 'AbortError') {
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
        logger.debug(`📤 Fetch: GET /productos/${id}`);
        
        const respuesta = await fetchWithRetry(
            `${API_URL}/${id}`,
            { headers: { 'Accept': 'application/json' } }
        );
        
        if (!respuesta.ok) {
            throw new Error(`Producto no encontrado`);
        }
        
        const producto = await respuesta.json();
        logger.debug("✅ Producto cargado:", producto.nombre);
        return producto;
    } catch (error) {
        if (error.name === 'AbortError') {
            logger.error('[productosService] Timeout en solicitud de producto');
            throw new Error('La solicitud tardó demasiado.');
        }
        logger.error('[productosService] Error cargando producto:', error.message);
        throw new Error('Error al obtener el producto');
    }
};
