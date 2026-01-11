/**
 * orderStorage.js - Gestión centralizada de órdenes en localStorage
 * 
 * Responsabilidades:
 * - Una única fuente de verdad para datos de órdenes
 * - Manejo consistente de errores
 * - Limpieza automática de datos antiguos
 * - Tipado implícito de datos
 */

const ORDER_STORAGE_KEY = 'gaddyel_order_data';
const ORDER_EXPIRY_DAYS = 7; // Órdenes expiran después de 7 días

/**
 * Estructura del objeto de orden almacenado:
 * {
 *   order: { ordenId, total, items, ... },
 *   status: 'pending_payment' | 'approved' | 'rejected',
 *   timestamp: number,
 *   orderNumber: string
 * }
 */

export const orderStorage = {
    /**
     * Guardar datos de orden en localStorage
     * @param {Object} orderData - Datos completos de la orden
     * @param {string} status - Estado de la orden
     */
    save: (orderData, status = 'pending_payment') => {
        try {
            const dataToStore = {
                order: orderData,
                status: status,
                timestamp: Date.now(),
                orderNumber: orderData.orderNumber || orderData.ordenId || 'N/A'
            };

            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(dataToStore));
            
            // Limpiar keys antiguas si existen (migración)
            orderStorage.clearLegacyKeys();
            
            return true;
        } catch (error) {
            console.error('❌ Error guardando orden en localStorage:', error);
            return false;
        }
    },

    /**
     * Obtener datos de orden desde localStorage
     * @returns {Object|null} Datos de la orden o null si no existe
     */
    get: () => {
        try {
            const data = localStorage.getItem(ORDER_STORAGE_KEY);
            if (!data) return null;

            const parsed = JSON.parse(data);
            
            // Verificar si la orden expiró
            if (orderStorage.isExpired(parsed.timestamp)) {
                orderStorage.clear();
                return null;
            }

            return parsed;
        } catch (error) {
            console.error('❌ Error leyendo orden de localStorage:', error);
            return null;
        }
    },

    /**
     * Obtener solo la orden (sin metadatos)
     * @returns {Object|null}
     */
    getOrder: () => {
        const data = orderStorage.get();
        return data ? data.order : null;
    },

    /**
     * Obtener solo el estado de la orden
     * @returns {string|null}
     */
    getStatus: () => {
        const data = orderStorage.get();
        return data ? data.status : null;
    },

    /**
     * Actualizar solo el estado sin modificar la orden
     * @param {string} newStatus - Nuevo estado
     */
    updateStatus: (newStatus) => {
        const data = orderStorage.get();
        if (data) {
            data.status = newStatus;
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(data));
            return true;
        }
        return false;
    },

    /**
     * Limpiar datos de orden
     */
    clear: () => {
        try {
            localStorage.removeItem(ORDER_STORAGE_KEY);
            orderStorage.clearLegacyKeys();
            return true;
        } catch (error) {
            console.error('❌ Error limpiando orden de localStorage:', error);
            return false;
        }
    },

    /**
     * Verificar si una orden expiró
     * @param {number} timestamp - Timestamp de cuando se guardó
     * @returns {boolean}
     */
    isExpired: (timestamp) => {
        const expiryTime = ORDER_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // días en ms
        return Date.now() - timestamp > expiryTime;
    },

    /**
     * Limpiar órdenes antiguas automáticamente
     * Debe llamarse al iniciar la app o al verificar órdenes
     */
    cleanup: () => {
        const data = orderStorage.get();
        if (data && orderStorage.isExpired(data.timestamp)) {
            orderStorage.clear();
            return true; // Se limpió
        }
        return false; // No era necesario limpiar
    },

    /**
     * Limpiar keys antiguas de versiones previas (migración)
     * Elimina: lastOrder, lastOrderStatus, lastOrderData, lastOrderTotal, etc.
     */
    clearLegacyKeys: () => {
        const legacyKeys = [
            'lastOrder',
            'lastOrderStatus',
            'lastOrderData',
            'lastOrderTotal',
            'lastOrderNumber',
            'lastOrderShipping'
        ];

        legacyKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        });
    },

    /**
     * Verificar si hay una orden guardada
     * @returns {boolean}
     */
    hasOrder: () => {
        return orderStorage.get() !== null;
    },

    /**
     * Obtener información resumida para debugging
     * @returns {Object}
     */
    getInfo: () => {
        const data = orderStorage.get();
        if (!data) {
            return { exists: false };
        }

        return {
            exists: true,
            orderNumber: data.orderNumber,
            status: data.status,
            timestamp: new Date(data.timestamp).toLocaleString(),
            isExpired: orderStorage.isExpired(data.timestamp),
            daysOld: Math.floor((Date.now() - data.timestamp) / (24 * 60 * 60 * 1000))
        };
    }
};

export default orderStorage;
