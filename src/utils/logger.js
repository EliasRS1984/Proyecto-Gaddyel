// =====================================================
// ¿QUÉ ES ESTO?
// Servicio centralizado para mostrar mensajes en la consola del navegador.
// Reemplaza todos los console.log/warn/error directos de la app.
//
// ¿CÓMO FUNCIONA?
// Tiene 7 métodos con distintos niveles de visibilidad:
//   - debug, info, success, group, table → solo se muestran en desarrollo (npm run dev)
//   - warn, error                        → siempre se muestran (incluso en producción)
//
// Cómo usarlo:
//   import { logger } from '../utils/logger';
//   logger.debug('Revisando datos...');   // solo en desarrollo
//   logger.error('Algo falló');           // siempre visible
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿Aparecen logs en producción que no deberían?
//   Verificá que uses logger.debug/info/success en vez de console.log directo.
// ¿No se ven logs en desarrollo?
//   Comprobá que import.meta.env.DEV sea true (solo activo con npm run dev).
// =====================================================

const isDev = import.meta.env.DEV;

export const logger = {
    // Solo en desarrollo
    info: (...args) => {
        if (isDev) {
            console.log('ℹ️', ...args);
        }
    },

    // Solo en desarrollo
    debug: (...args) => {
        if (isDev) {
            console.log('🔍', ...args);
        }
    },

    // Solo en desarrollo
    success: (...args) => {
        if (isDev) {
            console.log('✅', ...args);
        }
    },

    // Siempre visible (desarrollo y producción)
    warn: (...args) => {
        console.warn('⚠️', ...args);
    },

    // Siempre visible (desarrollo y producción)
    error: (...args) => {
        console.error('❌', ...args);
    },

    // Solo en desarrollo
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

    // Solo en desarrollo
    table: (data) => {
        if (isDev) {
            console.table(data);
        }
    }
};

export default logger;
