// ============================================================
// ¿QUÉ ES ESTO?
// Conjunto de funciones que manejan todo lo relacionado con la
// sesión del usuario: registrarse, iniciar sesión, ver y editar
// el perfil, y cerrar sesión.
//
// ¿CÓMO FUNCIONA?
// 1. Cada función se comunica directamente con el servidor.
// 2. Al iniciar sesión o registrarse, guarda el token y los datos
//    del usuario en el navegador (localStorage).
// 3. Al hacer cualquier operación que requiere estar autenticado,
//    adjunta el token guardado al encabezado de la solicitud.
// 4. Si el servidor responde 401 (token expirado), limpia la sesión
//    automáticamente para no dejar al usuario en un estado roto.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿Login no funciona? → Revisar la función login()
// - ¿El perfil no se actualiza? → Revisar actualizarPerfil()
// - ¿El usuario queda "logueado" sin estarlo? → Revisar logout()
//   y limpiarSesionAnterior()
// ============================================================

import axiosInstance from './axiosInstance';
import { logger } from '../utils/logger';

// Registrar nuevo cliente
export const registro = async (datosCliente) => {
    try {
        const { data } = await axiosInstance.post('/api/auth/registro', {
            nombre: datosCliente.nombre,
            email: datosCliente.email,
            password: datosCliente.password,
            whatsapp: datosCliente.whatsapp
        });

        // Guardar token en localStorage
        if (data.token) {
            localStorage.setItem('clientToken', data.token);
            localStorage.setItem('clientData', JSON.stringify(data.cliente));
        }
        
        return {
            exito: true,
            mensaje: data.mensaje || 'Registro exitoso',
            cliente: data.cliente,
            token: data.token
        };
    } catch (error) {
        logger.error('[authService] Error en registro:', error.message);
        return {
            exito: false,
            mensaje: error.response?.data?.error || 'Error al conectar con el servidor'
        };
    }
};

// Login de cliente existente
export const login = async (email, password) => {
    try {
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });

        // Guardar token y datos del cliente
        if (data.token) {
            localStorage.setItem('clientToken', data.token);
            localStorage.setItem('clientData', JSON.stringify(data.cliente));
        }
        
        return {
            exito: true,
            mensaje: data.mensaje || 'Inicio de sesión exitoso',
            cliente: data.cliente,
            token: data.token
        };
    } catch (error) {
        logger.error('[authService] Error en login:', error.message);
        return {
            exito: false,
            mensaje: error.response?.data?.error || 'Credenciales incorrectas'
        };
    }
};

// Obtener perfil del cliente autenticado
export const obtenerPerfil = async () => {
    try {
        if (!localStorage.getItem('clientToken')) {
            throw { mensaje: 'No hay sesión activa' };
        }

        const { data } = await axiosInstance.get('/api/auth/perfil');

        // Actualizar datos en localStorage (incluye domicilio/localidad/provincia)
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        logger.error('[authService] Error al obtener perfil:', error.message);
        throw error;
    }
};

// Actualizar perfil del cliente
export const actualizarPerfil = async (datosActualizados) => {
    try {
        if (!localStorage.getItem('clientToken')) {
            throw { mensaje: 'No hay sesión activa' };
        }

        const { data } = await axiosInstance.put('/api/auth/perfil', datosActualizados);

        // Actualizar datos en localStorage
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        logger.error('[authService] Error al actualizar perfil:', error.message);
        throw error;
    }
};

// Cierra la sesión eliminando el token y los datos del usuario del navegador.
export const logout = () => {
    try {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientData');
        localStorage.removeItem('clienteData'); // Clave legacy por compatibilidad
        logger.info('[authService] Sesión cerrada');
    } catch (error) {
        logger.error('[authService] Error al cerrar sesión:', error.message);
    }
};

// Verificar si hay sesión activa
export const estaAutenticado = () => {
    const token = localStorage.getItem('clientToken');
    const clientData = localStorage.getItem('clientData');
    
    return !!(token && clientData);
};

// Obtener datos del cliente desde localStorage
export const obtenerClienteLocal = () => {
    try {
        const clientData = localStorage.getItem('clientData');
        return clientData ? JSON.parse(clientData) : null;
    } catch (error) {
        logger.error('[authService] Error al leer datos del cliente:', error.message);
        return null;
    }
};

// Actualizar dirección del cliente
export const actualizarDireccion = async (datosDireccion) => {
    try {
        if (!localStorage.getItem('clientToken')) {
            throw { mensaje: 'No hay sesión activa' };
        }

        const { data } = await axiosInstance.put('/api/auth/direccion', datosDireccion);

        // Actualizar datos en localStorage
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        logger.error('[authService] Error al actualizar dirección:', error.message);
        throw error;
    }
};

// Obtener token
export const obtenerToken = () => {
    return localStorage.getItem('clientToken');
};

/**
 * FUNCIÓN AUXILIAR: Limpiar sesión anterior
 * Usada por páginas de login/registro para eliminar sesiones previas
 * Responsabilidad: Centralizar la limpieza de datos de autenticación
 */
// Limpia cualquier sesión activa antes de un nuevo login o registro.
// Centraliza la limpieza para evitar que tokens anteriores interfieran.
export const limpiarSesionAnterior = () => {
    try {
        const tokenExistente = localStorage.getItem('clientToken');
        if (tokenExistente) {
            localStorage.removeItem('clientToken');
            localStorage.removeItem('clientData');
            localStorage.removeItem('clienteData'); // Clave legacy por compatibilidad
            logger.info('[authService] Sesión anterior eliminada');
        }
    } catch (error) {
        logger.error('[authService] Error limpiando sesión anterior:', error.message);
    }
};

/**
 * FUNCIÓN AUXILIAR: Guardar sesión después de login/registro
 * Responsabilidad: Centralizar el almacenamiento de datos de autenticación
 * @param {Object} respuestaAPI - Response con token y cliente
 */
export const guardarSesion = (respuestaAPI) => {
    try {
        if (respuestaAPI.token && respuestaAPI.cliente) {
            localStorage.setItem('clientToken', respuestaAPI.token);
            localStorage.setItem('clientData', JSON.stringify(respuestaAPI.cliente));
            logger.info('✅ Sesión guardada correctamente');
        }
    } catch (error) {
        logger.error('Error guardando sesión:', error);
    }
};

export default {
    registro,
    login,
    obtenerPerfil,
    actualizarPerfil,
    actualizarDireccion,
    logout,
    estaAutenticado,
    obtenerClienteLocal,
    obtenerToken,
    limpiarSesionAnterior,
    guardarSesion
};
