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
    cantidadMinima: 12,   // Productos mínimos para habilitar checkout (fallback)
    montoParaEnvioGratis: 200000,
    costoEnvio: 12000,   // Costo en pesos si no aplica el beneficio (fallback)
    habilitarEnvioGratis: true
};

// ======== CACHÉ DE SESIÓN ========
// Evita repetir la consulta si múltiples componentes (Carrito, FAQ, Checkout)
// piden el dato al mismo tiempo durante la misma carga de página.
// El valor se vuelve a revisar automáticamente para reflejar cambios del admin.
let cachedConfig = null;
let fetchPromise = null;
let lastFetchTime = 0;
const REFRESH_INTERVAL_MS = 5000;

const fetchConfig = ({ force = false } = {}) => {
    const now = Date.now();

    // Si la consulta ya está en curso, espera esa misma consulta.
    if (fetchPromise) return fetchPromise;

    // Si ya tenemos un valor reciente y no se pidió una actualización forzada,
    // lo reutiliza para no saturar el servidor.
    if (!force && cachedConfig && now - lastFetchTime < REFRESH_INTERVAL_MS) {
        return Promise.resolve(cachedConfig);
    }

    fetchPromise = axiosInstance
        .get('/api/config/envio')
        .then(({ data }) => {
            cachedConfig = {
                cantidadMinima: data.cantidadMinimaPedido ?? data.cantidadParaEnvioGratis ?? DEFAULTS.cantidadMinima,
                montoParaEnvioGratis: data.montoParaEnvioGratis ?? DEFAULTS.montoParaEnvioGratis,
                costoEnvio: data.costoBase ?? DEFAULTS.costoEnvio,
                habilitarEnvioGratis: data.habilitarEnvioGratis ?? DEFAULTS.habilitarEnvioGratis,
            };
            lastFetchTime = Date.now();
            return cachedConfig;
        })
        .catch(() => {
            // Si falla la consulta, conserva el valor anterior en vez de reemplazarlo
            // por el fallback, para evitar parpadeos innecesarios.
            return cachedConfig ?? DEFAULTS;
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
        let cancelled = false;

        const syncConfig = async () => {
            const result = await fetchConfig({ force: true });
            if (!cancelled) {
                setConfig(result);
            }
        };

        syncConfig();

        const intervalId = window.setInterval(() => {
            fetchConfig().then((result) => {
                if (!cancelled) {
                    setConfig(result);
                }
            });
        }, REFRESH_INTERVAL_MS);

        const handleFocus = () => {
            fetchConfig({ force: true }).then((result) => {
                if (!cancelled) {
                    setConfig(result);
                }
            });
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus);

        return () => {
            cancelled = true;
            window.clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, []);

    return config;
};
