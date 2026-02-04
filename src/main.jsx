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
      // Ignorar errores de extensiones de navegador
      if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
        return null;
      }
      
      // Ignorar errores de ad-blockers
      if (event.exception?.values?.[0]?.value?.includes('adsbygoogle')) {
        return null;
      }
      
      return event;
    },
  });
  
  console.log('✅ Sentry inicializado en producción');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);