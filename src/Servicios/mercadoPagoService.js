/**
 * ✅ SERVICIO MERCADO PAGO - FRONTEND
 * 
 * FLUJO DE DATOS:
 * 1. Frontend llama a createPreference(ordenId)
 * 2. Backend crea preferencia en Mercado Pago
 * 3. Backend retorna checkoutUrl + preferenceId
 * 4. Frontend redirige usuario a Mercado Pago
 * 5. Usuario paga y Mercado Pago envía webhook al backend
 * 6. Mercado Pago redirige a /pedido-confirmado o /pedido-fallido
 * 
 * INTEGRACIONES:
 * - Backend: POST /api/mercadopago/preferences (crear checkout)
 * - Backend: GET /api/mercadopago/payment/:ordenId (consultar estado)
 * 
 * SEGURIDAD:
 * - Todos los endpoints requieren JWT (excepto webhook)
 * - Device ID enviado para anti-fraude
 * - No se manejan datos de tarjeta (PCI-DSS compliance)
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';

/**
 * Obtener token JWT del cliente autenticado
 * Busca en múltiples ubicaciones posibles para compatibilidad
 */
const getAuthToken = () => {
    // Intentar obtener de diferentes ubicaciones
    const token = localStorage.getItem('clientToken') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('clientToken');
    
    if (!token) {
        console.error('❌ No se encontró token de autenticación en localStorage/sessionStorage');
        console.log('📋 Claves en localStorage:', Object.keys(localStorage));
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    return token;
};

/**
 * Crear preferencia de pago en Mercado Pago
 * 
 * @param {string} ordenId - ID de la orden en MongoDB
 * @param {string} deviceId - Device ID de Mercado Pago (anti-fraude)
 * @returns {Promise<Object>} { checkoutUrl, sandboxCheckoutUrl, preferenceId }
 */
export const createPreference = async (ordenId, deviceId = null) => {
    try {
        console.log('🔵 [MP Service] Creando preferencia para orden:', ordenId);

        const token = getAuthToken();

        const response = await fetch(`${API_BASE}/api/mercadopago/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ordenId,
                deviceId
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ [MP Service] Preferencia creada:', {
            preferenceId: data.preferenceId,
            checkoutUrl: data.checkoutUrl
        });

        return data;

    } catch (error) {
        console.error('❌ [MP Service] Error creando preferencia:', error);
        throw error;
    }
};

/**
 * Obtener estado de pago de una orden
 * 
 * @param {string} ordenId - ID de la orden en MongoDB
 * @returns {Promise<Object>} { status, paymentId, statusDetail, amount, ... }
 */
export const getPaymentStatus = async (ordenId) => {
    try {
        console.log('🔵 [MP Service] Consultando estado de pago:', ordenId);

        const token = getAuthToken();

        const response = await fetch(`${API_BASE}/api/mercadopago/payment/${ordenId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ [MP Service] Estado de pago:', {
            status: data.status,
            paymentId: data.paymentId
        });

        return data;

    } catch (error) {
        console.error('❌ [MP Service] Error obteniendo estado:', error);
        throw error;
    }
};

/**
 * Consultar estado de pago con polling (cada N segundos)
 * Útil para actualizar UI cuando webhook aún no llegó
 * 
 * @param {string} ordenId - ID de la orden
 * @param {Function} callback - Función que recibe el estado actualizado
 * @param {number} interval - Intervalo en ms (default: 3000)
 * @param {number} maxAttempts - Máximo de intentos (default: 20)
 * @returns {Function} clearInterval function
 */
export const pollPaymentStatus = (ordenId, callback, interval = 3000, maxAttempts = 20) => {
    let attempts = 0;

    const intervalId = setInterval(async () => {
        attempts++;

        try {
            const status = await getPaymentStatus(ordenId);
            callback(status);

            // Detener polling si estado es final (approved, rejected, cancelled)
            if (['approved', 'rejected', 'cancelled', 'refunded'].includes(status.status)) {
                clearInterval(intervalId);
            }

            // Detener si se alcanzó el máximo de intentos
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.warn('⚠️ [MP Service] Polling detenido: máximo de intentos alcanzado');
            }

        } catch (error) {
            console.error('❌ [MP Service] Error en polling:', error);
            clearInterval(intervalId);
        }
    }, interval);

    return () => clearInterval(intervalId);
};

export default {
    createPreference,
    getPaymentStatus,
    pollPaymentStatus
};
