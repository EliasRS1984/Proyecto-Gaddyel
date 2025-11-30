# 🧪 Testing Frontend Web - Guía Rápida

## 🎯 Objetivo
Verificar que el frontend web `Proyecto-Gaddyel` conecta correctamente con el backend Render.

---

## 🚀 Paso a Paso

### PASO 1: Instalar Dependencias
```bash
cd c:\Users\Eliana\Desktop\programacion-Gemini\Proyecto-Gaddyel
npm install
```

**Tiempo estimado:** 1-2 minutos  
**Nota:** Si ya está instalado, omitir este paso

---

### PASO 2: Iniciar Servidor de Desarrollo
```bash
npm run dev
```

**Resultado esperado:**
```
  VITE v7.1.0  ready in XXX ms

  ➜  Local:   http://localhost:5173
  ➜  press h + enter to show help
```

**Nota:** Puede que use puerto diferente (5174, 5175, etc) si el anterior está ocupado

---

### PASO 3: Abrir en Navegador
```
http://localhost:5173 (o el puerto que mostró)
```

---

### PASO 4: Abrir DevTools (F12)
Ir a **Console** tab

---

### PASO 5: Verificar Logs Iniciales

En la console deberías ver:

```javascript
🌐 Frontend Web - API_BASE: http://localhost:5000/api
🌐 Frontend Web - API_URL: http://localhost:5000/api/productos
```

✅ Si ves esto → Variables de entorno se cargaron correctamente

❌ Si NO ves esto → Problema con import.meta.env.VITE_API_BASE

---

### PASO 6: Esperar Carga de Productos

En la console deberías ver:

```javascript
📤 Fetch: GET http://localhost:5000/api/productos
✅ Productos cargados: 12 items
```

✅ Si ves esto → Frontend web conecta correctamente

❌ Si ves error → Revisar que el backend local está corriendo en puerto 5000

---

## 🔍 Troubleshooting

### ❌ Error: "Cannot read properties of undefined"
**Causa:** Variables de entorno no cargadas

**Solución:**
1. Verificar que existe `.env` en la carpeta raíz
2. Contenido debe ser: `VITE_API_BASE=http://localhost:5000/api`
3. Reiniciar servidor: `npm run dev`

---

### ❌ Error: "Failed to fetch" o "CORS error"
**Causa:** Backend local no está corriendo en puerto 5000

**Solución:**
1. Abrir terminal separada
2. `cd c:\Users\Eliana\Desktop\gaddyel-backend`
3. `npm run dev`
4. Esperar a que diga "Puerto 5000"
5. Reintentar en frontend web

---

### ❌ Error: 404 "productos not found"
**Causa:** URL de backend incorrecta

**Solución:**
1. F12 → Console
2. Verificar el log: `🌐 Frontend Web - API_BASE: `
3. Debe ser: `http://localhost:5000/api`
4. Si es diferente, revisar `.env` file

---

### ❌ Error: "ERR_FAILED" o "net::ERR_NAME_NOT_RESOLVED"
**Causa:** Backend no responde

**Solución:**
1. En terminal, ir a backend: `cd gaddyel-backend`
2. Ejecutar: `npm run dev`
3. Esperar el mensaje: "Servidor funcionando en el puerto 5000"
4. Reintentar fetch en console

---

## 📊 Estado de Conexión

### Verificación Manual en Console
```javascript
// Test 1: ¿Carga la variable de entorno?
console.log(import.meta.env.VITE_API_BASE)
// Debe mostrar: http://localhost:5000/api

// Test 2: ¿Puede hacer fetch?
fetch('http://localhost:5000/api/productos')
  .then(r => r.json())
  .then(d => console.log('✅ Productos:', d.length))
  .catch(e => console.error('❌ Error:', e.message))
```

---

## 📝 Checklist de Testing

### Configuración
- [ ] `.env` existe en raíz del proyecto
- [ ] Contenido de `.env` es correcto
- [ ] `.env.production` existe para deploy

### Desarrollo Local
- [ ] `npm install` completado
- [ ] `npm run dev` iniciado
- [ ] Navegador abre sin errores
- [ ] DevTools muestra logs de API_BASE
- [ ] DevTools muestra "Productos cargados: 12"

### Funcionalidad
- [ ] Productos se renderean en la página
- [ ] Se pueden filtrar/buscar (si existe funcionalidad)
- [ ] Imágenes se cargan correctamente
- [ ] No hay errores en console

### Producción
- [ ] `.env.production` apunta a Render
- [ ] `npm run build` completa sin errores
- [ ] Build se puede servir con `npm run preview`
- [ ] Listo para deploy a Vercel/Netlify

---

## 🚀 Deploy a Producción

### Cuando está listo:

```bash
# 1. Build optimizado
npm run build

# 2. Preview local
npm run preview

# 3. Conectar con Vercel/Netlify (desde su panel)
# - Seleccionar repo
# - Build command: npm run build
# - Output directory: dist
# - Environment variable: VITE_API_BASE=https://gaddyel-backend.onrender.com/api
```

---

## 📊 Logs Esperados Completos

**Cuando todo funciona correctamente:**

```
[Console Output]

🌐 Frontend Web - API_BASE: http://localhost:5000/api
🌐 Frontend Web - API_URL: http://localhost:5000/api/productos

[Al cargar página]

📤 Fetch: GET http://localhost:5000/api/productos
✅ Productos cargados: 12 items

[Al ver producto específico - si existe esa funcionalidad]

📤 Fetch: GET http://localhost:5000/api/productos/[id]
✅ Producto cargado: [nombre]
```

---

## ✅ Cuando Verificar Que Todo Funciona

1. ✅ Productos aparecen en la página
2. ✅ Console muestra los logs correctos
3. ✅ No hay errores rojos en console
4. ✅ Las imágenes se ven
5. ✅ El sitio se ve bien (responsive)

---

## 📋 Próximo Paso

Después de verificar que funciona localmente:

```bash
# 1. Asegurar que backend Render está online
curl https://gaddyel-backend.onrender.com/api/productos

# 2. Cambiar .env para probar con Render
VITE_API_BASE=https://gaddyel-backend.onrender.com/api

# 3. Reiniciar servidor
npm run dev

# 4. Verificar que sigue funcionando desde Render
```

---

**Última actualización:** 28 de noviembre de 2025  
**Tiempo estimado para testing:** 5-10 minutos
