// ============================================================
// ¿QUÉ ES ESTO?
// Punto de acceso al estado de autenticación del usuario. Permite
// a cualquier componente de la página saber si hay alguien
// conectado, quién es, y ejecutar acciones como cerrar sesión.
//
// ¿CÓMO FUNCIONA?
// Simplemente lee la información que ya gestiona AuthContext
// y la entrega al componente que la pida. Si el componente
// está fuera del árbol correcto, lanza un error explicativo
// en lugar de fallar silenciosamente.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿Error "useAuth debe usarse dentro de AuthProvider"? →
//   Verificar que el componente esté dentro del árbol de
//   AuthProvider en App.jsx.
// - ¿Los datos del usuario no se actualizan? → Revisar
//   AuthContext.jsx, específicamente establecerCliente y
//   refrescarPerfil.
// - Para login/registro no usar este archivo — llamar
//   directamente a Servicios/authService.js.
// ============================================================

import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

// Devuelve todo lo que AuthContext expone:
//   cliente          → objeto con los datos del usuario (nombre, email, etc.)
//   isAuthenticated  → verdadero si el usuario está conectado
//   isLoading        → verdadero mientras se verifica la sesión al abrir la página
//   establecerCliente → guarda los datos del usuario después de login/registro
//   refrescarPerfil  → consulta el servidor y actualiza los datos del usuario
//   cerrarSesion     → cierra la sesión y limpia los datos locales
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }

    return context;
};

export default useAuth;
