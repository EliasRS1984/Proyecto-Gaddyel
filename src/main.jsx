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
      
      return event;
    },
  });
  
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);