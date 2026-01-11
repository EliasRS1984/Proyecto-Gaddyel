import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../Servicios/authService';

// Crear contexto de autenticación
export const AuthContext = createContext();

/**
 * ✅ REFACTORIZADO: AuthContext - Gestión de Estado Únicamente
 * 
 * RESPONSABILIDAD: Proveer estado global de autenticación (cliente, isAuthenticated, isLoading)
 * NO HACE: Funciones wrapper de authService (que duplican lógica)
 * 
 * FLUJO:
 * - Login.jsx → authService.login() → setCliente + setIsAuthenticated
 * - Registro.jsx → authService.registro() → setCliente + setIsAuthenticated
 * - Logout → authService.logout() + setCliente(null)
 * 
 * Los componentes son responsables de llamar authService directamente
 * AuthContext solo mantiene el estado sincronizado
 */
export const AuthProvider = ({ children }) => {
    const [cliente, setCliente] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ FLUJO: Al montar, verificar si hay sesión activa
    // Leer localStorage y restaurar estado
    useEffect(() => {
        const verificarAutenticacion = () => {
            const token = authService.obtenerToken();
            const clienteLocal = authService.obtenerClienteLocal();

            if (token && clienteLocal) {
                setCliente(clienteLocal);
                setIsAuthenticated(true);
            } else {
                setCliente(null);
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        verificarAutenticacion();
    }, []);

    /**
     * ✅ FUNCIÓN: Actualizar estado de autenticación después de login/registro
     * Responsabilidad: Sincronizar estado global con datos nuevos
     * Llamada desde: Login.jsx, Registro.jsx
     */
    const establecerCliente = useCallback((datosCliente) => {
        setCliente(datosCliente);
        setIsAuthenticated(!!datosCliente);
    }, []);

    /**
     * ✅ FUNCIÓN: Cerrar sesión limpiando estado global y localStorage
     * Responsabilidad: Limpiar todos los datos de autenticación
     * Llamada desde: Navbar.jsx, Login.jsx, componentes protegidos
     */
    const cerrarSesion = useCallback(() => {
        authService.logout();
        setCliente(null);
        setIsAuthenticated(false);
    }, []);


    // ✅ OPTIMIZACIÓN: Memoizar value para prevenir re-renders innecesarios
    const value = useMemo(() => ({
        cliente,
        isAuthenticated,
        isLoading,
        establecerCliente,
        cerrarSesion
    }), [
        cliente,
        isAuthenticated,
        isLoading,
        establecerCliente,
        cerrarSesion
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
