// ============================================================
// ¿QUÉ ES ESTO?
// El "cerebro" de autenticación del sitio. Guarda en un lugar
// central si el usuario está logueado, quién es, y si la app
// todavía está cargando esa información.
//
// ¿CÓMO FUNCIONA?
// 1. Al abrir el sitio, verifica si hay una sesión guardada en
//    el navegador y restaura al usuario automáticamente.
// 2. Expone el estado (¿está logueado? ¿quién es?) a cualquier
//    componente que lo necesite via useAuth() o useContext(AuthContext).
// 3. Cuando el usuario guarda cambios en su perfil, refrescarPerfil()
//    trae los datos actualizados del servidor y los sincroniza aquí.
// 4. Cuando cierra sesión, cerrarSesion() limpia todo.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El usuario aparece como no logueado aunque hay sesión guardada?
//   → Revisa verificarAutenticacion() (se ejecuta al abrir el sitio)
// ¿Los datos del perfil no se actualizan después de guardar?
//   → Revisa refrescarPerfil()
// ¿El botón de logout no funciona?
//   → Revisa cerrarSesion()
// ¿Un componente no puede leer el estado?
//   → Verificar que esté dentro de <AuthProvider> en App.jsx
// ============================================================

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../Servicios/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ======== ESTADO DE AUTENTICACIÓN ========
    // cliente: objeto con los datos del usuario logueado (null si no hay sesión)
    // isAuthenticated: true si el usuario está logueado
    // isLoading: true mientras la app verifica si hay sesión guardada al inicio
    const [cliente, setCliente] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ======== VERIFICACIÓN INICIAL DE SESIÓN ========
    // Al abrir el sitio por primera vez, esta función revisa si el usuario
    // ya tenía una sesión guardada en el navegador y la restaura.
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

    // ======== FUNCIONES DEL CONTEXTO ========

    /**
     * Después de que el usuario hace login o se registra, esta función
     * guarda sus datos aquí para que todo el sitio sepa que está logueado.
     * La llaman: Login.jsx y RegistroNuevo.jsx
     */
    const establecerCliente = useCallback((datosCliente) => {
        setCliente(datosCliente);
        setIsAuthenticated(!!datosCliente);
    }, []);

    /**
     * Después de que el usuario guarda cambios en su perfil (nombre, dirección, etc.),
     * esta función pide al servidor los datos actualizados y los sincroniza aquí.
     * La llaman: Perfil.jsx (tras guardar datos personales o dirección)
     *
     * ¿Perfil.jsx muestra datos desactualizados tras guardar? Revisa esta función.
     */
    const refrescarPerfil = useCallback(async () => {
        try {
            const data = await authService.obtenerPerfil();
            setCliente(data.cliente);
        } catch (error) {
            // Si el token venció mientras el usuario editaba su perfil,
            // cerramos la sesión para no dejarlo en un estado inconsistente.
            if (error?.status === 401) {
                authService.logout();
                setCliente(null);
                setIsAuthenticated(false);
            }
            throw error;
        }
    }, []);

    /**
     * Cuando el usuario hace click en "Cerrar sesión", esta función
     * borra todos sus datos del navegador y marca la sesión como cerrada.
     * La llaman: Navbar.jsx, Perfil.jsx
     */
    const cerrarSesion = useCallback(() => {
        authService.logout();
        setCliente(null);
        setIsAuthenticated(false);
    }, []);

    // ======== EMPAQUETADO DEL CONTEXTO ========
    // Agrupa todo en un objeto que se comparte con el resto de la app.
    // useMemo evita que los componentes que consumen este contexto
    // se actualicen innecesariamente cuando nada cambió.
    const value = useMemo(() => ({
        cliente,
        isAuthenticated,
        isLoading,
        establecerCliente,
        refrescarPerfil,
        cerrarSesion
    }), [
        cliente,
        isAuthenticated,
        isLoading,
        establecerCliente,
        refrescarPerfil,
        cerrarSesion
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

