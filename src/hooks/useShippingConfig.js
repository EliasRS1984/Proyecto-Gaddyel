// =====================================================
// ¿QUÉ ES ESTO?
// Función que consulta al servidor cuántos productos necesita el cliente
// para obtener el envío bonificado, y cuánto cuesta el envío si no aplica.
//
// ¿CÓMO FUNCIONA?
// 1. La primera vez que se usa, consulta al servidor en /api/config/envio
// 2. Guarda el resultado en memoria para que otras pantallas no vuelvan a consultar
// 3. Si el servidor no responde, usa el valor predeterminado de 3 productos
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El FAQ muestra siempre "3"?   Revisá que el endpoint /api/config/envio responda
// ¿El carrito no usa el valor correcto?  Revisá que Cart.jsx importe y use este hook
// =====================================================
import { useState, useEffect } from 'react';
import axiosInstance from '../Servicios/axiosInstance';

// ======== VALORES PREDETERMINADOS ========
// Se usan mientras carga la config del servidor o si hay un error de conexión
const DEFAULTS = {
    cantidadMinima: 3,   // Productos iguales o diferentes para envío gratis
    costoEnvio: 12000,   // Costo en pesos si no aplica el beneficio
    habilitarEnvioGratis: true
};

// ======== CACHÉ EN MEMORIA ========
// Guarda la respuesta del servidor para no repetir la consulta
// si el Carrito, el Checkout y la página de inicio necesitan el dato al mismo tiempo
let cachedConfig = null;
let fetchPromise = null;

const fetchConfig = () => {
    // Si ya consultamos el servidor antes, devuelve el valor guardado
    if (cachedConfig) return Promise.resolve(cachedConfig);

    // Si la consulta ya está en curso, espera esa misma consulta
    if (fetchPromise) return fetchPromise;

    fetchPromise = axiosInstance
        .get('/api/config/envio')
        .then(({ data }) => {
            cachedConfig = {
                cantidadMinima: data.cantidadParaEnvioGratis ?? DEFAULTS.cantidadMinima,
                costoEnvio: data.costoBase ?? DEFAULTS.costoEnvio,
                habilitarEnvioGratis: data.habilitarEnvioGratis ?? DEFAULTS.habilitarEnvioGratis,
            };
            return cachedConfig;
        })
        .catch(() => DEFAULTS) // Si falla la consulta, usa los predeterminados
        .finally(() => { fetchPromise = null; });

    return fetchPromise;
};

/**
 * Devuelve la configuración de envío del sistema.
 * Se usa en: Cart, OrderSummary, useCheckoutState, FAQ.
 * ¿Datos incorrectos? Revisá el endpoint GET /api/config/envio del backend
 */
export const useShippingConfig = () => {
    const [config, setConfig] = useState(cachedConfig ?? DEFAULTS);

    useEffect(() => {
        // Si ya está en caché, no hace falta volver a consultar
        if (cachedConfig) return;
        fetchConfig().then(result => setConfig(result));
    }, []);

    return config;
};
