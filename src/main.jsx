import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.jsx';
import './index.css';

// ✅ SENTRY: Monitoreo de errores en producción
// Solo se activa en build de producción para no contaminar logs de desarrollo
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE, // 'production' o 'development'
    
    // Performance Monitoring (10% de transacciones para no exceder free tier)
    tracesSampleRate: 0.1,
    
    // Session Replay: graba qué hizo el usuario antes del error
    replaysSessionSampleRate: 0.1, // 10% de sesiones normales
    replaysOnErrorSampleRate: 1.0, // 100% cuando hay error
    
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false, // Ver texto en replays
        blockAllMedia: true, // No grabar imágenes (privacidad)
      }),
    ],
    
    // Filtrar errores irrelevantes
    beforeSend(event, hint) {
      const errorMessage = event.exception?.values?.[0]?.value ?? '';

      // Ignorar errores de extensiones de navegador
      if (errorMessage.includes('chrome-extension')) {
        return null;
      }
      
      // Ignorar errores de ad-blockers
      if (errorMessage.includes('adsbygoogle')) {
        return null;
      }

      // Ignorar errores del WebView de Instagram en Android
      // Causa: Instagram inyecta JS para rastrear el teclado; cuando el Activity de Android
      // se destruye antes de que el JS termine, el bridge de Java ya no existe.
      // No es un bug de la app — no se puede corregir desde el frontend.
      if (errorMessage.includes('enableDidUserTypeOnKeyboardLogging')) {
        return null;
      }

      // Ignorar otros errores conocidos de WebViews de terceros (Facebook, TikTok, etc.)
      // que inyectan scripts nativos que fallan al destruirse la vista
      if (errorMessage.includes('Java object is gone')) {
        return null;
      }

      // Ignorar error del WebView de Safari en iOS (Instagram, Facebook, TikTok en iPhone).
      // Causa: el puente nativo window.webkit.messageHandlers deja de existir cuando
      // la app cierra el WebView antes de que el JS termine de ejecutarse.
      // No es un bug de la app — no tiene solución desde el frontend.
      if (errorMessage.includes('window.webkit.messageHandlers')) {
        return null;
      }

      // Ignorar el error de módulo no encontrado tras un nuevo deploy.
      // Causa: el usuario tenía la pestaña abierta antes del deploy. El navegador
      // intenta descargar un archivo JS con hash viejo que ya no existe en el servidor.
      // La solución real es el listener de 'vite:preloadError' que recarga la página.
      if (errorMessage.includes('Failed to fetch dynamically imported module')) {
        return null;
      }
      
      return event;
    },
  });
  
}

// Cuando el navegador no puede descargar un módulo lazy (chunk con hash viejo tras deploy),
// recarga la página automáticamente para que el usuario obtenga la versión nueva.
// Esto ocurre cuando alguien tenía la pestaña abierta antes de que se hiciera un nuevo deploy.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);