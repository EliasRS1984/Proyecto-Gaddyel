import { logger } from '../utils/logger';

// URL base de la API - usar variable de entorno o localhost
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

/**
 * Servicio de autenticación de clientes
 * Gestiona registro, login, perfil y logout usando fetch nativo
 */

// Registrar nuevo cliente
export const registro = async (datosCliente) => {
    try {
        const response = await fetch(`${API_BASE}/api/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: datosCliente.nombre,
                email: datosCliente.email,
                password: datosCliente.password,
                whatsapp: datosCliente.whatsapp
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                exito: false,
                mensaje: data.error || 'Error al registrar usuario'
            };
        }

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
        console.error('❌ Error en registro:', error);
        return {
            exito: false,
            mensaje: 'Error al conectar con el servidor'
        };
    }
};

// Login de cliente existente
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                exito: false,
                mensaje: data.error || 'Error al iniciar sesión'
            };
        }

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
        console.error('❌ Error en login:', error);
        return {
            exito: false,
            mensaje: 'Error al conectar con el servidor'
        };
    }
};

// Obtener perfil del cliente autenticado
export const obtenerPerfil = async () => {
    try {
        const token = localStorage.getItem('clientToken');
        
        if (!token) {
            throw { mensaje: 'No hay sesión activa' };
        }
        
        const response = await fetch(`${API_BASE}/api/auth/perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const error = await response.json();
            
            // Si el token expiró, limpiar localStorage
            if (response.status === 401) {
                localStorage.removeItem('clientToken');
                localStorage.removeItem('clientData');
            }
            
            throw error;
        }

        const data = await response.json();
        
        // Actualizar datos en localStorage
        // Actualizar datos en localStorage (incluye domicilio/localidad/provincia)
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        throw error || { mensaje: 'Error al obtener perfil' };
    }
};

// Actualizar perfil del cliente
export const actualizarPerfil = async (datosActualizados) => {
    try {
        const token = localStorage.getItem('clientToken');
        
        if (!token) {
            throw { mensaje: 'No hay sesión activa' };
        }
        
        const response = await fetch(`${API_BASE}/api/auth/perfil`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) {
            const error = await response.json();
            
            // Si el token expiró, limpiar localStorage
            if (response.status === 401) {
                localStorage.removeItem('clientToken');
                localStorage.removeItem('clientData');
            }
            
            throw error;
        }

        const data = await response.json();
        
        // Actualizar datos en localStorage
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        throw error || { mensaje: 'Error al actualizar perfil' };
    }
};

// Cerrar sesión
export const logout = () => {
    try {
        logger.debug('🔐 [authService.logout] Iniciando limpieza de sesión...');
        
        // Verificar qué hay en localStorage antes de limpiar
        const tokenAntes = localStorage.getItem('clientToken');
        const dataAntes = localStorage.getItem('clientData');
        
        logger.debug('  📊 Antes de limpiar:');
        logger.debug('    - clientToken existe:', !!tokenAntes);
        logger.debug('    - clientData existe:', !!dataAntes);
        
        // Limpiar todos los items de sesión
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientData');
        localStorage.removeItem('clienteData'); // En caso que esté con este nombre
        
        // Verificar que se limpió
        const tokenDespues = localStorage.getItem('clientToken');
        const dataDespues = localStorage.getItem('clientData');
        
        logger.debug('  📊 Después de limpiar:');
        logger.debug('    - clientToken eliminado:', !tokenDespues ? '✅ SÍ' : '❌ NO');
        logger.debug('    - clientData eliminado:', !dataDespues ? '✅ SÍ' : '❌ NO');

        logger.success('✅ [authService.logout] Sesión limpiada completamente');
    } catch (error) {
        console.error('❌ Error limpiando localStorage:', error);
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
        console.error('❌ Error al leer datos del cliente:', error);
        return null;
    }
};

// Actualizar dirección del cliente
export const actualizarDireccion = async (datosDireccion) => {
    try {
        const token = localStorage.getItem('clientToken');
        
        if (!token) {
            throw { mensaje: 'No hay sesión activa' };
        }
        
        const response = await fetch(`${API_BASE}/api/auth/direccion`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosDireccion)
        });

        if (!response.ok) {
            const error = await response.json();
            
            // Si el token expiró, limpiar localStorage
            if (response.status === 401) {
                localStorage.removeItem('clientToken');
                localStorage.removeItem('clientData');
            }
            
            throw error;
        }

        const data = await response.json();
        
        // Actualizar datos en localStorage
        localStorage.setItem('clientData', JSON.stringify(data.cliente));
        
        return data;
    } catch (error) {
        console.error('❌ Error al actualizar dirección:', error);
        throw error || { mensaje: 'Error al actualizar dirección' };
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
export const limpiarSesionAnterior = () => {
    try {
        logger.info('🔄 [authService] Limpiando sesión anterior...');
        const tokenExistente = localStorage.getItem('clientToken');
        
        if (tokenExistente) {
            localStorage.removeItem('clientToken');
            localStorage.removeItem('clientData');
            localStorage.removeItem('clienteData'); // Legacy
            logger.info('✅ Sesión anterior eliminada');
        }
    } catch (error) {
        console.error('❌ Error limpiando sesión anterior:', error);
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
        console.error('❌ Error guardando sesión:', error);
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
