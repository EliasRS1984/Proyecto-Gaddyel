// =====================================================================
// ¿QUÉ ES ESTO?
// Conjunto de funciones que conectan el frontend con el backend
// para todo lo relacionado con los pagos de Mercado Pago.
//
// ¿CÓMO FUNCIONA?
// 1. createPreference(ordenId)
//    → Le pide al backend que arme el "objeto de pago" en MP (precio, ítems, URLs de retorno)
//    → El backend retorna el preferenceId que necesita el Wallet Brick para mostrarse
//
// 2. getPaymentStatus(ordenId)
//    → Consulta al backend cuál es el estado actual del pago de esa orden
//    → Retorna: approved / rejected / pending / cancelled
//
// 3. pollPaymentStatus(ordenId, callback)
//    → Consulta el estado cada N segundos hasta que sea definitivo (aprobado/rechazado)
//    → Útil cuando el webhook de MP tarda en llegar
//    → Retorna una función para detener las consultas manualmente
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - "No estás autenticado"   → El usuario cerró sesión o el token expiró. Revisar getAuthToken.
// - "Error HTTP 4xx"         → El backend rechazó la solicitud. Revisar el ordenId enviado.
// - Brick no aparece         → createPreference falló. Revisar la consola de red del browser.
// - Polling no para          → Revisar que el backend retorne status 'approved'/'rejected'.
//
// SEGURIDAD:
// - El token de sesión nunca se muestra en consola (riesgo eliminado)
// - Los datos de tarjeta NUNCA pasan por este archivo (los maneja MP directamente)
// =====================================================================

const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';

// ======== OBTENER TOKEN DE SESIÓN ========
// Recupera el token de sesión guardado al iniciar sesión.
// El token fue guardado por authService.js en localStorage con la clave 'clientToken'.
// ¿Sin token? El usuario no está autenticado o su sesión expiró.
const getAuthToken = () => {
    const token = localStorage.getItem('clientToken');

    if (!token) {
        throw new Error('Tu sesión expiró. Por favor, iniciá sesión nuevamente.');
    }

    return token;
};

// ======== CREAR PREFERENCIA DE PAGO ========
// Le pide al backend que registre esta orden en Mercado Pago y obtenga
// el "preferenceId" — el identificador único que MP necesita para mostrar el botón de pago.
//
// @param {string} ordenId  - ID de la orden creada (viene de MongoDB)
// @param {string} deviceId - Identificador del dispositivo del usuario (anti-fraude de MP, opcional)
// @returns {{ preferenceId, checkoutUrl, sandboxCheckoutUrl }}
export const createPreference = async (ordenId, deviceId = null) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE}/api/mercadopago/preferences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ordenId, deviceId })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `No se pudo iniciar el checkout (Error ${response.status})`);
    }

    return response.json();
};

// ======== CONSULTAR ESTADO DE PAGO ========
// Pregunta al backend cuál es el estado actual del pago de una orden específica.
// Retorna el estado más reciente que el backend tiene registrado.
//
// @param {string} ordenId - ID de la orden a consultar
// @returns {{ status, paymentId, statusDetail, amount, ... }}
export const getPaymentStatus = async (ordenId) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE}/api/mercadopago/payment/${ordenId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `No se pudo obtener el estado del pago (Error ${response.status})`);
    }

    return response.json();
};

// ======== CONSULTAR ESTADO AUTOMÁTICAMENTE (POLLING) ========
// Cuando el usuario vuelve de MP, el pago puede tardar unos segundos en confirmarse.
// Esta función pregunta al backend cada N segundos hasta que el estado sea definitivo.
//
// Se detiene automáticamente cuando el estado es: aprobado, rechazado, cancelado o reembolsado.
// También se detiene si se alcanza el límite de intentos (para no consultar para siempre).
//
// @param {string}   ordenId     - ID de la orden a consultar
// @param {Function} callback    - Función que se ejecuta con cada respuesta (recibe el estado)
// @param {number}   interval    - Cada cuántos ms consultar (por defecto: 3000 = 3 segundos)
// @param {number}   maxAttempts - Máximo de consultas antes de parar (por defecto: 20)
// @returns {Function} - Llamar a esta función detiene el polling manualmente
export const pollPaymentStatus = (ordenId, callback, interval = 3000, maxAttempts = 20) => {
    let attempts = 0;

    const intervalId = setInterval(async () => {
        attempts++;

        try {
            const status = await getPaymentStatus(ordenId);
            callback(status);

            // Si el pago ya tiene un resultado definitivo, detener las consultas
            const estadosFinales = ['approved', 'rejected', 'cancelled', 'refunded'];
            if (estadosFinales.includes(status.status)) {
                clearInterval(intervalId);
            }

            // Detener si ya se consultó demasiadas veces (evita bucle infinito)
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
            }

        } catch {
            // Si falla una consulta, detener el polling para no generar errores en cadena
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
