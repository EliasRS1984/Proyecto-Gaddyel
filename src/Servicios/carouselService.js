// ============================================================
// ¿QUÉ ES ESTO?
// Función que trae las imágenes del carrusel desde el servidor
// para mostrarlas en la página de inicio.
//
// ¿CÓMO FUNCIONA?
// Si el servidor tarda en responder (arranque lento en Render),
// reintenta automáticamente hasta 3 veces con pausas crecientes
// de 1s, 2s y 4s antes de mostrar un error.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El carrusel no carga? → Revisar getCarouselImages() y la
//   URL del endpoint /api/carousel/public.
// - ¿Timeout frecuente? → El servidor puede estar en cold start.
//   El manejo de reintentos está en fetchWithRetry().
// ============================================================

import axiosInstance from './axiosInstance';
import { logger } from '../utils/logger';

// Reintentos con backoff para manejar cold start de Render.
// Intento 1: inmediato — 2: 1s — 3: 2s — 4: 4s.
async function fetchWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            logger.debug(`[carouselService] Intento ${attempt}/${maxRetries + 1}: ${url}`);
            
            const response = await axiosInstance.get(url, { timeout: 8000 });
            
            logger.debug('[carouselService] ✅ Carrusel cargado');
            return response;

        } catch (error) {
            lastError = error;

            // Reintentar en caso de Cold Start (503) o timeout
            const status = error.response?.status;
            const shouldRetry = attempt <= maxRetries && (
                status === 503 || 
                error.code === 'ECONNABORTED' ||
                error.message.includes('timeout')
            );

            if (shouldRetry) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
                logger.warn(
                    `[carouselService] Error ${status} - Reintentando en ${delay}ms: ${error.message}`
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
 * Servicio para obtener imágenes del carrusel (frontend público)
 * 
 * MANEJO DE COLD START:
 * - Reintentos automáticos cada 1s, 2s, 4s
 * - Máximo 3 reintentos
 */
const carouselService = {
    getCarouselImages: async () => {
        try {
            const response = await fetchWithRetry('/api/carousel/public');
            return response.data.data;
        } catch (error) {
            logger.error('[carouselService] Error al obtener carrusel:', error.message);
            return [];
        }
    }
};

export default carouselService;
