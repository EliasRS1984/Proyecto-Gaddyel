import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../utils/logger';

// =====================================================================
// ¿QUÉ ES ESTO?
// Guardián de rutas privadas — protege páginas que solo pueden ver
// usuarios con sesión iniciada (checkout, perfil, mis pedidos, etc.).
//
// ¿CÓMO FUNCIONA?
// 1. Verifica si el usuario está autenticado (via AuthContext)
// 2. Si todavía se está verificando → muestra un spinner (evita parpadeos)
// 3. Si no tiene sesión → redirige a /login y guarda la página que quería visitar
//    para que, después de iniciar sesión, vuelva directamente ahí
// 4. Si tiene sesión → deja pasar y renderiza la página solicitada
//
// ¿CÓMO SE USA?
// En el router, envolver las rutas que requieren sesión:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/checkout" element={<Checkout />} />
//     <Route path="/perfil" element={<Perfil />} />
//   </Route>
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Redirige aunque el usuario tiene sesión → Revisar AuthContext (isAuthenticated)
// - Spinner infinito → Revisar que AuthContext resuelva isLoading correctamente
// - No vuelve a la página original → El state { from: location } lo maneja Login.jsx
// =====================================================================

const ProtectedRoute = ({ redirectTo = '/login' }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mientras AuthContext verifica el token guardado, mostrar spinner
    // (evita que el usuario vea un parpadeo de redirección incorrecta)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-9 w-9 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-500 animate-spin"></div>
                    <p className="text-[13px] font-medium tracking-tight text-slate-400 dark:text-slate-500">
                        Verificando sesión...
                    </p>
                </div>
            </div>
        );
    }

    // Sin sesión: redirigir a login guardando la página de origen
    // Login.jsx puede leer location.state.from para volver aquí después
    if (!isAuthenticated) {
        logger.debug('[ProtectedRoute] Acceso denegado — redirigiendo a login desde:', location.pathname);
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Con sesión: renderizar la página solicitada
    return <Outlet />;
};

export default ProtectedRoute;
