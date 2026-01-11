import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../utils/logger';

/**
 * Componente de ruta protegida para clientes
 * Requiere autenticación para acceder a ciertas páginas (ej: checkout)
 */
const ProtectedRoute = ({ redirectTo = '/login' }) => {
    const { isAuthenticated, isLoading } = useAuth(); // ✅ Usar hook useAuth
    const location = useLocation();

    // Mientras se verifica la autenticación, no mostrar nada
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login guardando la ubicación actual
    if (!isAuthenticated) {
        logger.debug('[ProtectedRoute] Usuario no autenticado, redirigiendo a login');
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Si está autenticado, renderizar el componente hijo
    logger.debug('[ProtectedRoute] Usuario autenticado, permitiendo acceso');
    return <Outlet />;
};

export default ProtectedRoute;
