import React from 'react';

/**
 * ✅ LoadingScreen - Pantalla de carga para React.lazy()
 * Se muestra mientras el chunk se carga
 */
const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Cargando...</h2>
            <p className="text-gray-500 text-sm mt-2">Un momento por favor</p>
        </div>
    </div>
);

export default LoadingScreen;
