import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * ✅ REFACTORIZADO: Ahora solo devuelve estado (cliente, isAuthenticated, isLoading)
 * y funciones simples (establecerCliente, cerrarSesion)
 * 
 * NOTA: Para login/registro, usa authService directamente:
 * - authService.login(email, password)
 * - authService.registro(datosCliente)
 * - authService.logout()
 * - authService.limpiarSesionAnterior()
 * 
 * Este hook NO tiene funciones wrapper que duplican lógica de authService
 * 
 * @returns {Object} 
 *   - cliente: objeto con datos del usuario
 *   - isAuthenticated: boolean
 *   - isLoading: boolean de carga inicial
 *   - establecerCliente: función para actualizar cliente
 *   - cerrarSesion: función para limpiar sesión
 * @throws {Error} Si se usa fuera de AuthProvider
 * 
 * @example
 * const { cliente, isAuthenticated, cerrarSesion } = useAuth()
 * 
 * // Para login/registro, llamar directamente:
 * const resultado = await authService.login(email, password)
 * if (resultado.exito) {
 *   establecerCliente(resultado.cliente)
 * }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    
    return context;
};

export default useAuth;
