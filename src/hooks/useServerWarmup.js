// ============================================================
// ¿QUÉ ES ESTO?
//   Herramienta invisible que "despierta" al servidor apenas el usuario
//   abre la página, antes de que interactúe con ningún botón.
//
// ¿CÓMO FUNCIONA?
//   1. El usuario abre el sitio.
//   2. En ese mismo instante, este código manda un pequeño "ping" al servidor.
//   3. El servidor de Render sale de su estado dormido (cold start).
//   4. Para cuando el usuario llega al catálogo o hace login, el servidor
//      ya está listo y responde rápido.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
//   - ¿El servidor sigue tardo? Revisa que VITE_API_BASE apunte al backend correcto.
//   - ¿Errores en consola? El ping es silencioso — no debería generar errores visibles.
//   - El endpoint que se llama es GET /api/health en el backend (src/index.js).
// ============================================================

import { useEffect } from 'react';
import axiosInstance from '../Servicios/axiosInstance';

// ======== PING AL SERVIDOR ========
// Esta función se ejecuta UNA SOLA VEZ cuando la aplicación abre por primera vez.
// Su único trabajo es tocar el servidor para que salga del sueño.
// No muestra nada en pantalla — trabaja completamente en el fondo.
const useServerWarmup = () => {
    useEffect(() => {
        // Enviamos un ping silencioso.
        // Usamos un tiempo de espera largo (40s) porque el cold start
        // de Render puede tardar hasta 50 segundos en el plan gratuito.
        // Si falla por cualquier motivo, lo ignoramos — no es crítico.
        axiosInstance
            .get('/api/health', { timeout: 40000 })
            .catch(() => {
                // Silencio intencional: si el ping falla, la app funciona igual.
                // Los servicios individuales tienen su propio sistema de reintentos.
            });
    }, []); // El [] hace que esto solo corra al abrir la página, no en cada pantalla
};

export default useServerWarmup;
