// ============================================================
// ¿QUÉ ES ESTO?
// Pantalla de carga que aparece SOLO mientras el navegador descarga
// el archivo JS de una página por primera vez (code splitting).
//
// ¿CUÁNDO APARECE?
// - El usuario navega a una ruta nueva por primera vez
// - React.lazy() en App.jsx pide el chunk → tarda ~200-500ms
// - Suspense muestra este componente como "mientras tanto"
// - Luego desaparece y se muestra la página real
//
// ¿CUÁNDO NO APARECE?
// - Si el chunk ya está en caché del navegador (visitas siguientes)
// - NO es el spinner de carga de productos ni de llamadas a la API
//   — esos los maneja cada página por separado
// ============================================================

import React from 'react';

const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
            {/* Spinner con colores del DS */}
            <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[13px] font-medium tracking-tight text-slate-400 dark:text-slate-500">
                Cargando...
            </p>
        </div>
    </div>
);

export default LoadingScreen;
