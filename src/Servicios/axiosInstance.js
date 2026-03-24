// ============================================================
// ¿QUÉ ES ESTO?
// Instancia centralizada de Axios que usan TODOS los servicios
// de la aplicación para comunicarse con el servidor.
//
// ¿CÓMO FUNCIONA?
// 1. Configura la URL base del servidor una sola vez (desde .env).
// 2. Antes de cada solicitud, agrega automáticamente el token
//    de sesión al encabezado si el usuario está identificado.
// 3. Si el servidor responde 401 (sesión expirada), limpia los
//    datos guardados del usuario y lo redirige al login.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El token no se envía en los encabezados? → Revisar el
//   interceptor de solicitudes (sección INTERCEPTOR DE SOLICITUDES).
// - ¿No redirige al login cuando la sesión expira? → Revisar el
//   interceptor de respuestas y la condición "hadToken".
// - ¿Error de CORS en desarrollo? → Verificar que VITE_API_BASE
//   esté configurada correctamente en el archivo .env.
// ============================================================

import axios from 'axios';
import { logger } from '../utils/logger';

// Lee la URL del servidor desde la variable de entorno.
// Si no está definida (por ejemplo en producción sin .env),
// usa la URL del servidor de producción como respaldo.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://gaddyel-backend.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// ======== INTERCEPTOR DE SOLICITUDES ========
// Antes de enviar cualquier solicitud al servidor, esta función
// verifica si el usuario tiene una sesión activa (token guardado).
// Si lo tiene, lo agrega automáticamente al encabezado de la solicitud.
// Si no hay token (usuario no identificado), la solicitud sale sin
// encabezado de autorización — lo cual es correcto para rutas públicas.
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('clientToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ======== INTERCEPTOR DE RESPUESTAS ========
// Cuando el servidor responde "sesión expirada" (código 401),
// esta función verifica si la solicitud original tenía un token adjunto.
//
// ¿Por qué ese chequeo?
// - Si había token y llega un 401 → el token expiró → cerrar sesión y redirigir al login.
// - Si NO había token y llega un 401 → el usuario intentó hacer login con credenciales
//   incorrectas → NO redirigir, dejar que el componente maneje el error normalmente.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const hadToken = !!error.config?.headers?.Authorization;

        if (status === 401 && hadToken) {
            logger.warn('[axios] Sesión expirada — cerrando sesión automáticamente');
            localStorage.removeItem('clientToken');
            localStorage.removeItem('clientData');
            // Redirigir al login. Se usa window.location porque este archivo
            // está fuera del árbol de componentes de React y no puede usar useNavigate.
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
