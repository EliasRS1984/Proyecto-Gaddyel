# 🛍️ Gaddyel - Tienda Online

E-commerce completo desarrollado con React + Vite para la tienda Gaddyel.

## 🚀 Inicio Rápido

### Desarrollo Local

**1. Verificar configuración:**
```powershell
.\verificar-config.ps1
```

**2. Iniciar Backend (Terminal 1):**
```powershell
cd c:\Users\Eliana\Desktop\gaddyel-backend
npm run dev
```

**3. Iniciar Frontend (Terminal 2):**
```powershell
cd c:\Users\Eliana\Desktop\programacion-Gemini\Proyecto-Gaddyel
npm run dev
```

**4. Abrir navegador:**
```
http://localhost:5173
```

### Verificar Conexión

En la consola del navegador deberías ver:
```
🌐 Frontend Web - API_BASE: http://localhost:5000/api
📤 Fetch: GET /productos
✅ Productos obtenidos: X
```

## 📁 Estructura del Proyecto

```
Proyecto-Gaddyel/
├── src/
│   ├── Componentes/        # Componentes reutilizables
│   │   ├── Cart.jsx       # Carrito de compras
│   │   ├── UI/            # Componentes UI (FormField, etc.)
│   │   └── Layout/        # Header, Footer, etc.
│   ├── Paginas/           # Páginas principales
│   │   ├── Inicio.jsx
│   │   ├── Catalogo.jsx
│   │   ├── DetalleProducto.jsx
│   │   └── Checkout.jsx   # Formulario mejorado
│   ├── Context/           # Context API
│   │   └── CartContext.jsx
│   ├── Servicios/         # Llamadas API
│   │   └── productosService.js
│   └── hooks/             # Custom hooks
│       └── useCheckoutForm.js
├── .env.local             # Config desarrollo (local)
├── .env                   # Config desarrollo (backup)
└── .env.production        # Config producción (Render)
```

## 🔧 Configuración

### Variables de Entorno

**Desarrollo Local (`.env.local`):**
```env
VITE_API_BASE=http://localhost:5000/api
```

**Producción (`.env.production`):**
```env
VITE_API_BASE=https://gaddyel-backend.onrender.com/api
```

Ver más detalles en: [CONFIGURACION_DESARROLLO.md](CONFIGURACION_DESARROLLO.md)

## 🎯 Características Principales

### ✅ Formulario de Checkout Mejorado
- Validación en tiempo real
- 6 campos obligatorios: nombre, email, WhatsApp, dirección, ciudad, código postal
- Guardado automático en localStorage
- Indicador de progreso visual
- Formato automático de WhatsApp
- Resumen de datos antes de enviar

### ✅ Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- **Envío gratis** con 3 o más productos
- Persistencia en localStorage
- Resumen de totales

### ✅ Catálogo de Productos
- Vista de cuadrícula responsive
- Filtrado por categorías
- Búsqueda de productos
- Detalles de producto

## 🛠️ Stack Tecnológico

- **React 18** - Framework frontend
- **Vite** - Build tool
- **React Router v7** - Navegación
- **Tailwind CSS** - Estilos
- **Context API** - Estado global
- **Axios** - HTTP client

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.x",
  "axios": "^1.x",
  "tailwindcss": "^4.x"
}
```

## 🐛 Solución de Problemas

### ❌ Error: "Network Error"
**Solución**: Verificar que el backend esté corriendo en puerto 5000

### ❌ Error: "CORS policy"
**Solución**: Backend ya configurado para localhost:5173-5176

### ❌ Cambios en .env no se aplican
**Solución**: Reiniciar servidor de desarrollo (Ctrl+C → `npm run dev`)

Ver más en: [CONFIGURACION_DESARROLLO.md](CONFIGURACION_DESARROLLO.md)

## 🚢 Despliegue

### Build de Producción
```powershell
npm run build
```

### Preview del Build
```powershell
npm run preview
```

### Despliegue en Vercel
El proyecto está configurado para desplegarse automáticamente en Vercel desde Git.

**Producción usa automáticamente**:
- Backend: `https://gaddyel-backend.onrender.com/api`
- Variables desde `.env.production`

## 📚 Documentación Adicional

- [CONFIGURACION_DESARROLLO.md](CONFIGURACION_DESARROLLO.md) - Guía completa de configuración
- [INTEGRACION_BACKEND.md](INTEGRACION_BACKEND.md) - Integración con backend
- [TESTING_FRONTEND_WEB.md](TESTING_FRONTEND_WEB.md) - Pruebas frontend

## 🤝 Contribución

Este es un proyecto privado de Gaddyel.

## 📄 Licencia

Propiedad de Gaddyel - Todos los derechos reservados
