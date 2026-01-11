/**
 * Logger Service - Logging condicional basado en entorno
 * 
 * En desarrollo: Muestra todos los logs
 * En producción: Solo muestra errores y warnings
 * 
 * Uso:
 * import { logger } from '../utils/logger';
 * logger.debug('Info de debug');
 * logger.error('Error crítico');
 */

const isDev = import.meta.env.DEV;

export const logger = {
    /**
     * Logs informativos (solo en desarrollo)
     */
    info: (...args) => {
        if (isDev) {
            console.log('ℹ️', ...args);
        }
    },

    /**
     * Logs de debugging (solo en desarrollo)
     */
    debug: (...args) => {
        if (isDev) {
            console.log('🔍', ...args);
        }
    },

    /**
     * Logs de éxito (solo en desarrollo)
     */
    success: (...args) => {
        if (isDev) {
            console.log('✅', ...args);
        }
    },

    /**
     * Warnings (siempre se muestran)
     */
    warn: (...args) => {
        console.warn('⚠️', ...args);
    },

    /**
     * Errores (siempre se muestran)
     */
    error: (...args) => {
        console.error('❌', ...args);
    },

    /**
     * Grupos colapsables (solo en desarrollo)
     */
    group: (label) => {
        if (isDev) {
            console.group(label);
        }
    },

    groupEnd: () => {
        if (isDev) {
            console.groupEnd();
        }
    },

    /**
     * Tablas (solo en desarrollo)
     */
    table: (data) => {
        if (isDev) {
            console.table(data);
        }
    }
};

export default logger;
