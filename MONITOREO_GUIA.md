# 📊 GUÍA DE MONITOREO - GADDYEL

## 1️⃣ SENTRY - Monitoreo de Errores

### Frontend (React + Vercel)

#### Instalación:
```bash
cd Pagina-Gaddyel
npm install @sentry/react @sentry/vite-plugin
```

#### Configuración en `src/main.jsx`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.jsx';
import './index.css';

// ✅ Inicializar Sentry ANTES de renderizar
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, // Obtenido de sentry.io
    environment: import.meta.env.MODE, // 'production' o 'development'
    
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% de transacciones (para no exceder free tier)
    
    // Session Replay (para ver qué hizo el usuario antes del error)
    replaysSessionSampleRate: 0.1, // 10% de sesiones normales
    replaysOnErrorSampleRate: 1.0, // 100% cuando hay error
    
    integrations: [
      new Sentry.BrowserTracing({
        // Rastrear navegación de React Router
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
      new Sentry.Replay({
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
      
      // Ignorar errores de red intermitentes sin contexto
      if (event.exception?.values?.[0]?.value?.includes('NetworkError')) {
        // Solo reportar si tenemos contexto de usuario
        if (!event.user) return null;
      }
      
      return event;
    },
    
    // Agregar contexto de usuario (cuando esté autenticado)
    beforeSend(event) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.email) {
        Sentry.setUser({
          id: user._id,
          email: user.email,
          username: user.nombre,
        });
      }
      return event;
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Agregar VITE_SENTRY_DSN en `.env`:
```env
VITE_SENTRY_DSN=https://tu-dsn@o123456.ingest.sentry.io/789456
```

#### En Vercel Environment Variables:
```
VITE_SENTRY_DSN = https://tu-dsn@o123456.ingest.sentry.io/789456
```

---

### Backend (Node.js + Render)

#### Instalación:
```bash
cd gaddyel-backend
npm install @sentry/node @sentry/profiling-node
```

#### Configuración en `src/index.js`:
```javascript
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

// ✅ Inicializar Sentry AL PRINCIPIO del archivo (antes de imports de rutas)
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: 0.2, // 20% de requests
    
    // Profiling (detectar código lento)
    profilesSampleRate: 0.2,
    integrations: [
      new ProfilingIntegration(),
    ],
    
    // Contexto adicional
    beforeSend(event, hint) {
      // Agregar info de request
      if (hint.originalException?.request) {
        event.contexts = {
          ...event.contexts,
          request: {
            url: hint.originalException.request.url,
            method: hint.originalException.request.method,
            headers: hint.originalException.request.headers,
          }
        };
      }
      return event;
    }
  });
}

// ... resto del código

// ✅ Middleware de Sentry DESPUÉS de rutas
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... tus rutas aquí

// ✅ Error handler de Sentry ANTES del error handler global
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler); // Tu error handler personalizado
```

#### En Render Environment Variables:
```
SENTRY_DSN = https://tu-dsn@o123456.ingest.sentry.io/789456
```

---

## 2️⃣ LOGGING ESTRUCTURADO

### Backend - Mejorar Winston Logger

#### Actualizar `src/utils/logger.js`:
```javascript
import winston from 'winston';

const { combine, timestamp, printf, errors, json } = winston.format;

// Formato custom para logs legibles
const customFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  if (Object.keys(meta).length > 0) {
    log += ` | ${JSON.stringify(meta)}`;
  }
  
  if (stack) {
    log += `\n${stack}`;
  }
  
  return log;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    process.env.NODE_ENV === 'production' ? json() : customFormat
  ),
  transports: [
    new winston.transports.Console(),
    
    // ✅ Archivo de errores críticos
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // ✅ Archivo de todo (info, warn, error)
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// ✅ Helpers específicos para Gaddyel
logger.order = (action, orderId, details = {}) => {
  logger.info(`ORDER ${action}`, { orderId, ...details });
};

logger.payment = (action, paymentId, details = {}) => {
  logger.info(`PAYMENT ${action}`, { paymentId, ...details });
};

logger.security = (message, details = {}) => {
  logger.warn(`SECURITY: ${message}`, details);
};

export default logger;
```

#### Uso en controladores:
```javascript
// orderController.js
import logger from '../utils/logger.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    
    // ✅ Log estructurado
    logger.order('CREATED', order._id, {
      clienteId: order.clienteId,
      total: order.total,
      items: order.items.length,
      ip: req.ip,
    });
    
    res.status(201).json(order);
  } catch (error) {
    logger.error('Error creating order', { 
      error: error.message, 
      stack: error.stack,
      body: req.body 
    });
    next(error);
  }
};
```

---

## 3️⃣ ANALYTICS DE COMPORTAMIENTO

### Google Analytics 4 (Gratis)

#### Crear propiedad en Google Analytics:
1. https://analytics.google.com/
2. Admin → Create Property → "Gaddyel"
3. Copiar Measurement ID: `G-XXXXXXXXXX`

#### Instalar en Frontend:
```bash
npm install react-ga4
```

#### Configurar en `src/main.jsx`:
```javascript
import ReactGA from 'react-ga4';

if (import.meta.env.PROD) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

// En App.jsx, trackear page views
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    if (import.meta.env.PROD) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname });
    }
  }, [location]);
  
  return <Router>...</Router>;
}
```

#### Eventos personalizados:
```javascript
// En DetalleProducto.jsx
const handleAddToCart = (producto) => {
  // ... lógica de agregar
  
  // ✅ Track evento
  ReactGA.event({
    category: 'E-commerce',
    action: 'Add to Cart',
    label: producto.nombre,
    value: producto.precio,
  });
};

// En Checkout
const handleCheckout = () => {
  ReactGA.event({
    category: 'E-commerce',
    action: 'Begin Checkout',
    value: totalCart,
  });
};
```

---

## 4️⃣ UPTIME MONITORING (¿El sitio está caído?)

### UptimeRobot (Gratis - 50 monitores)

1. Ir a: https://uptimerobot.com/
2. Crear monitores:
   - **Frontend**: `https://gaddyel.vercel.app/`
   - **Backend API**: `https://gaddyel-backend.onrender.com/api/productos`
   - **Backend Health**: `https://gaddyel-backend.onrender.com/api/diagnostico/env`

3. Configurar alertas:
   - Email cuando sitio cae > 5 minutos
   - Intervalo de check: 5 minutos

4. Opcional: Integrar con Telegram/Discord para alertas instantáneas

---

## 5️⃣ REAL USER MONITORING (RUM) - Vercel Analytics

### Activar Vercel Analytics (Gratis en plan Hobby)

#### En dashboard de Vercel:
1. Ir a proyecto: `gaddyel`
2. Analytics → Enable
3. Vercel Speed Insights (gratis)

#### Instalar en código:
```bash
npm install @vercel/analytics @vercel/speed-insights
```

#### En `src/main.jsx`:
```javascript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
```

Esto te da:
- ✅ Core Web Vitals reales
- ✅ Performance por página
- ✅ Navegadores más lentos
- ✅ Errores JavaScript

---

## 6️⃣ CUSTOM ERROR BOUNDARY (Frontend)

### Crear componente para capturar errores de React:

#### `src/components/ErrorBoundary.jsx`:
```javascript
import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // ✅ Enviar a Sentry
    Sentry.captureException(error, { contexts: { react: errorInfo } });
    
    // ✅ Log local
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              ¡Algo salió mal! 😕
            </h1>
            <p className="text-gray-700 mb-4">
              Hemos detectado un error. Nuestro equipo fue notificado automáticamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Recargar página
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Detalles técnicos
                </summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Usar en `App.jsx`:
```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* tus rutas */}
      </Router>
    </ErrorBoundary>
  );
}
```

---

## 7️⃣ MONITOREO DE BASE DE DATOS

### MongoDB Atlas - Alertas Integradas

1. MongoDB Atlas Dashboard → Alerts
2. Configurar alertas para:
   - ✅ CPU > 80%
   - ✅ Memoria > 80%
   - ✅ Conexiones > 450 (límite 500)
   - ✅ Disk space < 10%

3. Email de notificación: tu-email@gmail.com

---

## 8️⃣ DASHBOARD DE MONITOREO CENTRALIZADO

### Opción 1: Sentry Dashboard (Recomendado)
- ✅ Errores frontend + backend en un solo lugar
- ✅ Gráficos de tendencias
- ✅ Release tracking (por commit)
- ✅ Performance insights

### Opción 2: Grafana Cloud (Gratis 10k logs/mes)
- Logs de Winston → Grafana Loki
- Métricas custom
- Dashboards personalizados

---

## 📊 RESUMEN: Stack de Monitoreo Recomendado

| Herramienta | Propósito | Costo | Prioridad |
|-------------|-----------|-------|-----------|
| **Sentry** | Error tracking (frontend + backend) | Gratis 5k eventos/mes | 🔴 CRÍTICA |
| **Vercel Analytics** | Core Web Vitals, RUM | Gratis | 🟡 ALTA |
| **Google Analytics 4** | Comportamiento usuario | Gratis | 🟡 ALTA |
| **UptimeRobot** | Uptime monitoring | Gratis 50 monitores | 🟢 MEDIA |
| **MongoDB Atlas Alerts** | DB performance | Incluido | 🟢 MEDIA |
| **Winston Logs** | Backend structured logs | Gratis | 🟢 MEDIA |

---

## 🚀 PLAN DE IMPLEMENTACIÓN (4 Pasos)

### **Semana 1: Básico (Crítico)**
1. ✅ Configurar Sentry (frontend + backend)
2. ✅ Activar Vercel Analytics
3. ✅ Crear ErrorBoundary en React

### **Semana 2: Analytics**
4. ✅ Google Analytics 4
5. ✅ Eventos custom (Add to Cart, Checkout)

### **Semana 3: Monitoreo Proactivo**
6. ✅ UptimeRobot para sitios
7. ✅ MongoDB Atlas alerts

### **Semana 4: Optimización**
8. ✅ Revisar logs de Sentry
9. ✅ Optimizar errores recurrentes
10. ✅ Mejorar performance basado en Vercel Analytics

---

## 💡 EJEMPLO DE FLUJO REAL

### Usuario reporta: "No puedo agregar al carrito"

**Con monitoreo:**
1. **Sentry** te alerta: Error en `CartContext.jsx` línea 45
2. **Session Replay** te muestra: Usuario hizo click 3 veces seguidas
3. **Stack trace**: `Cannot read property 'precio' of undefined`
4. **Contexto**: Producto sin precio en BD
5. **Fix**: Agregar validación + precio por defecto

**Sin monitoreo:**
- Usuario frustra, abandona sitio
- Pierdes venta
- No sabes del problema hasta que se repite 10 veces

---

¿Quieres que implemente alguno de estos sistemas primero? Recomiendo empezar con **Sentry** (lo más crítico).
