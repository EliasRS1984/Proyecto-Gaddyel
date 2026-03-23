// =====================================================
// ¿QUÉ ES ESTO?
// Módulo que guarda y recupera los datos del último pedido
// en el almacenamiento local del navegador (localStorage).
// Actúa como memoria temporal entre el checkout y la pantalla
// de confirmación de pago.
//
// ¿CÓMO FUNCIONA?
// 1. Al confirmar un pedido, orderStorage.save() guarda los datos
//    junto con la fecha y hora actuales.
// 2. La pantalla de confirmación llama a orderStorage.get()
//    para mostrar el resumen al usuario.
// 3. Los datos expiran automáticamente después de 7 días.
// 4. Al guardar o limpiar, se eliminan también claves antiguas
//    de versiones anteriores de la app (migración).
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿La pantalla de confirmación no muestra el pedido?
//   Revisá orderStorage.get() y que el pedido no haya expirado.
// ¿Los datos se pierden al volver de Mercado Pago?
//   Revisá que orderStorage.save() se llame antes del redirect.
// ¿El total no es correcto?
//   Revisá que save() reciba los datos correctos desde orderService.
// =====================================================

import { logger } from './logger';

const ORDER_STORAGE_KEY = 'gaddyel_order_data';
const ORDER_EXPIRY_DAYS = 7; // Órdenes expiran después de 7 días

// Estructura de los datos guardados:
// {
//   order:       datos completos del pedido,
//   status:      estado del pago ('pending_payment' / 'approved' / 'rejected'),
//   timestamp:   fecha en milisegundos de cuándo se guardó,
//   orderNumber: número identificador del pedido
// }

export const orderStorage = {
    // Guarda los datos del pedido en el navegador.
    // El estado por defecto es "pendiente de pago".
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
            logger.error('Error guardando orden en localStorage:', error);
            return false;
        }
    },

    // Obtiene los datos del último pedido guardado.
    // Si no hay pedido o ya expiró (más de 7 días), devuelve null.
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
            logger.error('Error leyendo orden de localStorage:', error);
            return null;
        }
    },

    // Devuelve solo los datos del pedido, sin fecha ni estado.
    getOrder: () => {
        const data = orderStorage.get();
        return data ? data.order : null;
    },

    // Devuelve solo el estado del pedido (ej: 'approved', 'rejected').
    getStatus: () => {
        const data = orderStorage.get();
        return data ? data.status : null;
    },

    // Actualiza el estado del pedido sin modificar los demás datos.
    updateStatus: (newStatus) => {
        const data = orderStorage.get();
        if (data) {
            data.status = newStatus;
            localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(data));
            return true;
        }
        return false;
    },

    // Borra todos los datos del pedido del navegador.
    clear: () => {
        try {
            localStorage.removeItem(ORDER_STORAGE_KEY);
            orderStorage.clearLegacyKeys();
            return true;
        } catch (error) {
            logger.error('Error limpiando orden de localStorage:', error);
            return false;
        }
    },

    // Verifica si el pedido tiene más de 7 días y ya no es válido.
    isExpired: (timestamp) => {
        const expiryTime = ORDER_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // días en ms
        return Date.now() - timestamp > expiryTime;
    },

    // Borra el pedido si ya expiró. Se puede llamar al iniciar la app.
    cleanup: () => {
        const data = orderStorage.get();
        if (data && orderStorage.isExpired(data.timestamp)) {
            orderStorage.clear();
            return true; // Se limpió
        }
        return false; // No era necesario limpiar
    },

    // Elimina entradas viejas guardadas por versiones anteriores de la app.
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

    // Indica si hay un pedido activo guardado en el navegador.
    hasOrder: () => {
        return orderStorage.get() !== null;
    },

    // Devuelve un resumen del pedido guardado. Útil para revisar el estado en desarrollo.
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
