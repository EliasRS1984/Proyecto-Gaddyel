// =====================================================
// ¿QUÉ ES ESTO?
// Función que consulta al servidor cuántos productos necesita el cliente
// para obtener el envío bonificado, y cuánto cuesta el envío si no aplica.
//
// ¿CÓMO FUNCIONA?
// 1. Al cargar el sitio, siempre consulta al servidor en /api/config/envio
// 2. Si el Carrito, el Checkout y el FAQ necesitan el dato al mismo tiempo,
//    comparten una sola consulta activa (no se hacen 3 pedidos al servidor).
// 3. El resultado se guarda EN LA SESIÓN actual (mientras el navegador esté abierto).
//    Al recargar la página se vuelve a consultar para reflejar cambios del admin.
// 4. Si el servidor no responde, usa el valor predeterminado de 3 productos.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El carrito sigue mostrando "3" aunque el admin cambió a "4"? → Recargá la página.
//   Si sigue igual, verificá que GET /api/config/envio devuelva el nuevo valor.
// ¿Siempre muestra el valor predeterminado? → El servidor no responde, revisar Render.
// =====================================================
import { useState, useEffect } from 'react';
import axiosInstance from '../Servicios/axiosInstance';

// ======== VALORES PREDETERMINADOS ========
// Se usan SOLO mientras carga la config del servidor o si hay un error de conexión.
// NUNCA deben verse en producción con el servidor activo.
const DEFAULTS = {
    cantidadMinima: 3,   // Productos para envío gratis (fallback)
    costoEnvio: 12000,   // Costo en pesos si no aplica el beneficio (fallback)
    habilitarEnvioGratis: true
};

// ======== CACHÉ DE SESIÓN ========
// Evita repetir la consulta si múltiples componentes (Carrito, FAQ, Checkout)
// piden el dato al mismo tiempo durante la misma carga de página.
// Se reinicia automáticamente cuando el usuario recarga el navegador.
let cachedConfig = null;
let fetchPromise = null;

const fetchConfig = () => {
    // Si la consulta ya está en curso, espera esa misma consulta
    if (fetchPromise) return fetchPromise;

    // Si ya tenemos el dato de esta sesión, usarlo directamente
    if (cachedConfig) return Promise.resolve(cachedConfig);

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
        .catch(() => {
            // Si falla la consulta, usa los predeterminados pero NO los cachea,
            // para intentar de nuevo la próxima vez que se monte el componente
            return DEFAULTS;
        })
        .finally(() => { fetchPromise = null; });

    return fetchPromise;
};

/**
 * Devuelve la configuración de envío del sistema.
 * Se usa en: Cart, OrderSummary, useCheckoutState, FAQ.
 * ¿Datos incorrectos? Verificar GET /api/config/envio — recargar página para reflejar cambios.
 */
export const useShippingConfig = () => {
    // Arranca con DEFAULTS mientras llega la respuesta del servidor.
    // Si cachedConfig ya tiene datos de esta sesión, los usa inmediatamente.
    const [config, setConfig] = useState(cachedConfig ?? DEFAULTS);

    useEffect(() => {
        // Siempre consulta al servidor al montar (la primera vez que carga la página).
        // Si cachedConfig ya tiene el valor de esta sesión, el useState de arriba ya
        // mostró los datos correctos y fetchConfig devuelve la promesa resuelta.
        fetchConfig().then(result => setConfig(result));
    }, []);

    return config;
};
