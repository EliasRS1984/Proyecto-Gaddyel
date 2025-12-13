import { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../Servicios/authService';

// Crear contexto de autenticación
export const AuthContext = createContext();

/**
 * Proveedor de contexto de autenticación para clientes
 * Gestiona el estado de autenticación globalmente en la tienda
 */
export const AuthProvider = ({ children }) => {
    const [cliente, setCliente] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autenticación al montar componente
    useEffect(() => {
        const verificarAutenticacion = () => {
            const token = authService.obtenerToken();
            const clienteLocal = authService.obtenerClienteLocal();

            console.log('🔍 Verificando autenticación:');
            console.log('  Token:', token ? '✅ Existe' : '❌ No existe');
            console.log('  Cliente:', clienteLocal ? '✅ Existe' : '❌ No existe');

            if (token && clienteLocal) {
                setCliente(clienteLocal);
                setIsAuthenticated(true);
                console.log('✅ Usuario autenticado:', clienteLocal.email);
            } else {
                console.log('❌ No hay sesión activa');
                setCliente(null);
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        verificarAutenticacion();
    }, []);

    // Registrar nuevo cliente
    const registrar = useCallback(async (datosCliente) => {
        try {
            const response = await authService.registro(datosCliente);
            
            if (response.exito) {
                setCliente(response.cliente);
                setIsAuthenticated(true);
                return { exito: true, mensaje: response.mensaje };
            } else {
                return { exito: false, mensaje: response.mensaje };
            }
        } catch (error) {
            console.error('❌ Error al registrar:', error);
            return { 
                exito: false, 
                mensaje: error.mensaje || 'Error al registrar usuario' 
            };
        }
    }, []);

    // Iniciar sesión
    const iniciarSesion = useCallback(async (email, password) => {
        try {
            const response = await authService.login(email, password);
            
            if (response.exito) {
                setCliente(response.cliente);
                setIsAuthenticated(true);
                return { exito: true, mensaje: response.mensaje };
            } else {
                return { exito: false, mensaje: response.mensaje };
            }
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error);
            return { 
                exito: false, 
                mensaje: error.mensaje || 'Error al iniciar sesión' 
            };
        }
    }, []);

    // Cerrar sesión
    const cerrarSesion = useCallback(() => {
        console.log('🔐 Cerrando sesión...');
        authService.logout();
        setCliente(null);
        setIsAuthenticated(false);
        console.log('✅ Sesión cerrada, localStorage limpiado');
    }, []);

    // Actualizar perfil
    const actualizarPerfil = useCallback(async (datosActualizados) => {
        try {
            const response = await authService.actualizarPerfil(datosActualizados);
            
            if (response.exito) {
                setCliente(response.cliente);
                return { exito: true, mensaje: response.mensaje };
            }
            
            return { exito: false, mensaje: response.mensaje };
        } catch (error) {
            console.error('❌ Error al actualizar perfil:', error);
            return { 
                exito: false, 
                mensaje: error.mensaje || 'Error al actualizar perfil' 
            };
        }
    }, []);

    // Refrescar datos del perfil
    const refrescarPerfil = useCallback(async () => {
        try {
            const response = await authService.obtenerPerfil();
            
            if (response.exito) {
                setCliente(response.cliente);
                return { exito: true };
            }
            
            return { exito: false };
        } catch (error) {
            console.error('❌ Error al refrescar perfil:', error);
            
            // Si hay error de autenticación, cerrar sesión
            if (error.mensaje?.includes('sesión')) {
                cerrarSesion();
            }
            
            return { exito: false };
        }
    }, [cerrarSesion]);

    const value = {
        cliente,
        isAuthenticated,
        isLoading,
        registrar,
        iniciarSesion,
        cerrarSesion,
        actualizarPerfil,
        refrescarPerfil
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
