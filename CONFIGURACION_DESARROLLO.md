# 🔧 Guía de Configuración: Desarrollo Local con Backend

## Configuración Actual

### ✅ Desarrollo Local
- **Frontend**: Conecta a `http://localhost:5000/api`
- **Backend**: Debe correr localmente en puerto 5000
- **Base de datos**: MongoDB (local o Atlas)

### ✅ Producción
- **Frontend**: Desplegado en Vercel
- **Backend**: Desplegado en Render (`https://gaddyel-backend.onrender.com/api`)
- **Base de datos**: MongoDB Atlas

---

## 🚀 Iniciar Desarrollo Local

### 1. Backend (Terminal 1)

```powershell
cd c:\Users\Eliana\Desktop\gaddyel-backend
npm run dev
```

**Verificar que esté corriendo:**
```
✅ Servidor corriendo en puerto 5000
✅ MongoDB conectado
```

### 2. Frontend (Terminal 2)

```powershell
cd c:\Users\Eliana\Desktop\programacion-Gemini\Proyecto-Gaddyel
npm run dev
```

**Verificar que esté corriendo:**
```
✅ Local: http://localhost:5173/
✅ 🌐 Frontend Web - API_BASE: http://localhost:5000/api
```

---

## 📁 Archivos de Configuración

### `.env.local` (Desarrollo - Prioridad máxima)
```env
VITE_API_BASE=http://localhost:5000/api
```
- ✅ Se usa automáticamente en desarrollo
- ✅ **No se sube a Git** (ignorado en `.gitignore`)
- ✅ Tiene prioridad sobre `.env`

### `.env` (Desarrollo - Fallback)
```env
VITE_API_BASE=http://localhost:5000/api
```
- ✅ Backup si no existe `.env.local`
- ⚠️ Se puede subir a Git (sin secretos)

### `.env.production` (Producción)
```env
VITE_API_BASE=https://gaddyel-backend.onrender.com/api
```
- ✅ Se usa automáticamente en build de producción
- ✅ Apunta al backend en Render

---

## 🔍 Verificar Conexión

### En el Navegador (Consola)

Al cargar la página, deberías ver:
```javascript
🌐 Frontend Web - API_BASE: http://localhost:5000/api
📤 Fetch: GET /productos
✅ Productos obtenidos: 25
```

Si ves errores de conexión:
```javascript
❌ Error: Network Error
```

**Solución**: Verifica que el backend esté corriendo en puerto 5000

---

## 📝 Orden de Prioridad de Variables de Entorno

Vite usa el siguiente orden (del más prioritario al menos):

1. **`.env.local`** ← Desarrollo local (ignorado por Git)
2. **`.env.development`** ← Desarrollo específico
3. **`.env`** ← Valores por defecto para desarrollo
4. **`.env.production`** ← Solo en `npm run build`

---

## 🔄 Cambiar entre Local y Render

### Para usar Backend Local:
```powershell
# Ya está configurado en .env.local
npm run dev
```

### Para usar Backend en Render (durante desarrollo):
```powershell
# Opción 1: Renombrar temporalmente .env.local
mv .env.local .env.local.backup

# Opción 2: Crear .env.local con URL de Render
echo "VITE_API_BASE=https://gaddyel-backend.onrender.com/api" > .env.local

npm run dev
```

### Para restaurar Backend Local:
```powershell
# Opción 1: Restaurar archivo
mv .env.local.backup .env.local

# Opción 2: Editar .env.local
# Cambiar URL a http://localhost:5000/api

npm run dev
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Network Error" o "Failed to fetch"

**Causa**: Backend no está corriendo o está en otro puerto

**Solución**:
1. Verificar que backend esté corriendo:
   ```powershell
   # En terminal del backend, buscar:
   Servidor corriendo en puerto 5000
   ```

2. Verificar que no haya otro servicio en puerto 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```

3. Reiniciar backend:
   ```powershell
   # Ctrl+C para detener, luego:
   npm run dev
   ```

### ❌ Error: "CORS policy"

**Causa**: Backend no permite conexiones desde tu puerto frontend

**Solución**: El backend ya está configurado para aceptar puertos 5173-5176, pero si usas otro puerto:

1. Abrir `gaddyel-backend/src/index.js`
2. Agregar tu puerto a `allowedOrigins`:
   ```javascript
   'http://localhost:TUPUERTO',
   ```

### ❌ Cambios en .env no se aplican

**Causa**: Vite cachea variables de entorno

**Solución**:
1. Detener el servidor (Ctrl+C)
2. Reiniciar: `npm run dev`
3. Limpiar caché si persiste: `npm run dev -- --force`

### ❌ Frontend sigue apuntando a Render

**Causa**: `.env.local` no existe o tiene configuración incorrecta

**Solución**:
1. Verificar que existe `.env.local`:
   ```powershell
   ls .env*
   ```

2. Verificar contenido:
   ```powershell
   cat .env.local
   ```

3. Debería contener:
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```

---

## 📊 Estado Actual de Archivos

```
Proyecto-Gaddyel/
├── .env.local          ← Desarrollo local (http://localhost:5000/api) ✅ ACTIVO
├── .env                ← Backup desarrollo (http://localhost:5000/api)
└── .env.production     ← Producción (https://gaddyel-backend.onrender.com/api)
```

---

## 🚢 Desplegar a Producción

Cuando hagas `npm run build` o despliegues a Vercel:

1. **Automáticamente** usa `.env.production`
2. Frontend apunta a `https://gaddyel-backend.onrender.com/api`
3. **No necesitas cambiar nada**

---

## ✅ Checklist de Desarrollo

Antes de empezar a trabajar:

- [ ] Backend corriendo en puerto 5000
- [ ] MongoDB conectado (local o Atlas)
- [ ] Frontend corriendo en puerto 5173 (o 5174)
- [ ] Consola muestra: `API_BASE: http://localhost:5000/api`
- [ ] No hay errores de CORS
- [ ] Productos se cargan correctamente

---

## 💡 Tips

1. **Hot Reload**: Ambos servidores (frontend y backend) tienen hot reload automático
2. **Logs**: Mantén ambas terminales visibles para ver logs en tiempo real
3. **Postman**: Prueba endpoints directamente en `http://localhost:5000/api`
4. **MongoDB Compass**: Conecta a tu base de datos para ver cambios en tiempo real

---

## 🎯 Resumen

✅ **Desarrollo**: Usa backend local (`http://localhost:5000/api`)  
✅ **Producción**: Usa backend en Render (automático en build)  
✅ **No necesitas cambiar configuración** al desplegar  
✅ **Variables separadas** para desarrollo y producción  

¡Todo configurado y listo para desarrollar! 🚀
