import axios from 'axios';
import { logger } from '../utils/logger';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';
const API_URL = `${API_BASE}/api/carousel`;

/**
 * ✅ Reintentos con backoff para manejar Cold Start de Render
 */
async function fetchWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            logger.debug(`[carouselService] Intento ${attempt}/${maxRetries + 1}: ${url}`);
            
            const response = await axios.get(url, { timeout: 8000 });
            
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
            const response = await fetchWithRetry(`${API_URL}/public`);
            return response.data.data;
        } catch (error) {
            logger.error('[carouselService] Error al obtener carrusel:', error.message);
            return [];
        }
    }
};

export default carouselService;
