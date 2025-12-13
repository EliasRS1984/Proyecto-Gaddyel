# 🎨 DIAGRAMA VISUAL - Arquitectura Nueva del Proceso de Compra

---

## 🏗️ ARQUITECTURA DE CAPAS

```
┌─────────────────────────────────────────────────────────────────┐
│                         🎨 INTERFAZ DE USUARIO                   │
│                                                                   │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│   │  Checkout    │      │   Carrito    │      │ Confirmación │  │
│   │    Page      │      │     Page     │      │     Page     │  │
│   └──────┬───────┘      └──────────────┘      └──────────────┘  │
│          │                                                        │
└──────────┼────────────────────────────────────────────────────────┘
           │
           │ 📡 useOrder(), useCart(), handleChange(), validateField()
           │
┌──────────▼────────────────────────────────────────────────────────┐
│                      🧠 LÓGICA DE NEGOCIO                         │
│                                                                   │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │         orderService.js                                    │ │
│   ├────────────────────────────────────────────────────────────┤ │
│   │ • createOrder(checkoutData, cartItems)                    │ │
│   │ • getOrder(orderId)                                       │ │
│   │ • retryPayment(orderId)                                   │ │
│   │ • calculateShipping(cantidadProductos)                    │ │
│   │ • validateCheckoutData(data)                              │ │
│   │ • normalizeCheckoutData()    ← Frontend → Backend         │ │
│   │ • denormalizeResponse()      ← Backend → Frontend         │ │
│   └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │         checkoutSchema.js                                  │ │
│   ├────────────────────────────────────────────────────────────┤ │
│   │ • validateField(name, value)                              │ │
│   │ • formatField(name, value)                                │ │
│   │ • validateForm(formData)                                  │ │
│   │ • validators = { nombre, email, whatsapp, ... }          │ │
│   │ • formatters = { whatsApp formatter, trim, ... }         │ │
│   └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
           │
           │ 💾 setState() OrderContext + persist localStorage
           │
┌──────────▼────────────────────────────────────────────────────────┐
│                    🌍 ESTADO GLOBAL (CONTEXTOS)                  │
│                                                                   │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │         OrderContext.jsx                                   │ │
│   ├────────────────────────────────────────────────────────────┤ │
│   │ State:                                                     │ │
│   │  • currentOrder (orden en proceso)                        │ │
│   │  • lastOrder (orden confirmada)    ← FUENTE DE VERDAD    │ │
│   │  • lastOrderStatus (estado del pago)                     │ │
│   │  • isLoading, lastError                                   │ │
│   │                                                            │ │
│   │ Actions:                                                  │ │
│   │  • createOrder(), getOrder(), retryPayment()            │ │
│   │  • updateOrderStatus(), clearOrder()                     │ │
│   └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │         CartContext.jsx (sin cambios)                      │ │
│   ├────────────────────────────────────────────────────────────┤ │
│   │ State:                                                     │ │
│   │  • cartItems (productos en carrito)                       │ │
│   │                                                            │ │
│   │ Actions:                                                  │ │
│   │  • addToCart(), removeFromCart(), updateQuantity()       │ │
│   │  • getTotal(), getTotalItems(), getCartForCheckout()     │ │
│   └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
           │
           │ 💾 localStorage.setItem('lastOrder')
           │
┌──────────▼────────────────────────────────────────────────────────┐
│                      💾 PERSISTENCIA LOCAL                        │
│                                                                   │
│   localStorage:                                                 │
│   • 'lastOrder'       → { ordenId, total, items, ... }        │
│   • 'gaddyel_cart'    → cartItems array                        │
│   • 'checkoutDraft'   → form data siendo editado               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
           │
           │ 🌐 fetch('/api/orders/create')
           │
┌──────────▼────────────────────────────────────────────────────────┐
│                        🖥️  BACKEND API                           │
│                                                                   │
│   POST /api/orders/create                                        │
│   ├─ Valida datos normalizados                                 │
│   ├─ Consulta BD (productos, precios)                          │
│   ├─ Calcula impuestos (21% IVA)                               │
│   ├─ Crea orden en BD                                          │
│   └─ Devuelve: { orderId, orderStatus, totals, items }       │
│                                                                   │
│   GET /api/orders/:id                                           │
│   └─ Devuelve detalles completos de orden                       │
│                                                                   │
│   POST /api/orders/:id/retry                                    │
│   └─ Reinicia flujo de pago                                     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS EN CHECKOUT

```
START
  │
  ├─→ 👤 Usuario ingresa datos en formulario
  │     ├─ handleChange() → formatField() → formData
  │     └─ Si touched → validateField() → fieldErrors
  │
  ├─→ 🔍 Click en "Confirmar Pedido"
  │     └─ handleSubmit()
  │
  ├─→ ✅ validateForm() via checkoutSchema
  │     ├─ SI: errores → mostrar mensajes
  │     └─ NO: continuar
  │
  ├─→ 📦 Preparar datos para crear orden
  │     ├─ cartItems desde CartContext
  │     ├─ Calcular: subtotal, envío, total
  │     └─ checkoutData = { nombre, email, domicilio, ... }
  │
  ├─→ 📡 createOrder(checkoutData, cartItems)
  │     ├─ Validar datos nuevamente
  │     ├─ normalizeCheckoutData()
  │     │   ├─ nombre → fullName
  │     │   ├─ domicilio → address
  │     │   ├─ codigoPostal → postalCode
  │     │   └─ items: [{ productId, quantity }]
  │     └─ fetch('/api/orders/create')
  │
  ├─→ 🖥️  Backend procesa
  │     ├─ Valida estructura
  │     ├─ Consulta productos
  │     ├─ Calcula precios finales
  │     ├─ Crea registro en BD
  │     └─ Responde: { orderId, orderStatus, totals, items }
  │
  ├─→ 📥 orderService recibe respuesta
  │     ├─ denormalizeResponse()
  │     │   ├─ fullName → nombre (para compatibilidad)
  │     │   ├─ address → domicilio
  │     │   └─ postalCode → codigoPostal
  │     └─ Retorna: { ordenId, total, items, ... }
  │
  ├─→ 💾 OrderContext.createOrder()
  │     ├─ setLastOrder(response)
  │     ├─ setLastOrderStatus('pending_payment')
  │     ├─ localStorage.setItem('lastOrder', JSON.stringify(...))
  │     └─ clearCart()
  │
  ├─→ 🧹 Limpiar datos
  │     ├─ localStorage.removeItem('checkoutDraft')
  │     └─ cartItems = []
  │
  └─→ 📍 navigate(`/pedido-confirmado/${ordenId}`)
       │
       └─→ 📄 PedidoConfirmado accede a OrderContext
           └─ const { lastOrder } = useOrder()
           └─ Muestra confirmación con datos

END
```

---

## 📊 MAPEO DE DATOS (VISUALIZADO)

### Transformación de Datos en el Flujo

```
┌─────────────────────────────────┐
│  USUARIO RELLENA FORMULARIO     │
│                                 │
│ nombre: "Juan Pérez"            │
│ email: "juan@email.com"         │
│ whatsapp: "1112345678"          │
│ domicilio: "Calle 123"          │
│ localidad: "Capital"            │
│ provincia: "Buenos Aires"       │
│ codigoPostal: "1425"            │
└────────────┬────────────────────┘
             │
             ↓ formatField() (automático)
             │ whatsapp: "11 1234-5678"
             │ email: "juan@email.com" (lowercase)
             │ ...
             │
┌────────────▼────────────────────┐
│ NORMALIZACIÓN: Frontend → Backend│
│                                 │
│ {                               │
│   items: [                      │
│     { productId, quantity }     │
│   ],                            │
│   customer: {                   │
│     fullName: "Juan Pérez"      │
│     email: "juan@email.com"     │
│     whatsapp: "1112345678"      │
│   },                            │
│   shipping: {                   │
│     address: "Calle 123"        │
│     city: "Capital"             │
│     province: "Buenos Aires"    │
│     postalCode: "1425"          │
│   },                            │
│   totals: {                     │
│     subtotal: 1500,             │
│     shippingCost: 0,            │
│     total: 1500                 │
│   }                             │
│ }                               │
└────────────┬────────────────────┘
             │
             ↓ API: POST /api/orders/create
             │ 🌐 Backend
             │
┌────────────▼────────────────────┐
│ PROCESAMIENTO EN BACKEND         │
│                                 │
│ 1. Valida estructura            │
│ 2. Consulta BD: productos       │
│ 3. Valida stock                 │
│ 4. Recalcula precios            │
│ 5. Calcula impuestos (21%)      │
│ 6. Crea registro en BD          │
│ 7. Retorna: {                   │
│    orderId: "658a...",          │
│    orderStatus: "pending_...",  │
│    totals: {...},               │
│    items: [{                    │
│      productId,                 │
│      name,                      │
│      unitPrice,                 │
│      quantity,                  │
│      subtotal                   │
│    }]                           │
│  }                              │
└────────────┬────────────────────┘
             │
             ↓ DESNORMALIZACIÓN: Backend → Frontend
             │
┌────────────▼────────────────────┐
│ RESPUESTA UNIFORME PARA FRONTEND│
│                                 │
│ {                               │
│   ordenId: "658a...",           │
│   pedidoId: "658a..." (alias)   │
│   success: true, ok: true,      │
│   total: 1815, // con impuestos│
│   subtotal: 1500,               │
│   costoEnvio: 0,                │
│   cantidadProductos: 2,         │
│   items: [                      │
│     {                           │
│       productId,                │
│       name,                     │
│       unitPrice,                │
│       quantity                  │
│     }                           │
│   ]                             │
│ }                               │
└────────────┬────────────────────┘
             │
             ↓ OrderContext.createOrder()
             │ setLastOrder(response)
             │
┌────────────▼────────────────────┐
│ ALMACENAMIENTO EN CONTEXTO      │
│ + localStorage                  │
│                                 │
│ const lastOrder = {             │
│   ordenId: "658a...",           │
│   total: 1815,                  │
│   subtotal: 1500,               │
│   costoEnvio: 0,                │
│   cantidadProductos: 2,         │
│   items: [...],                 │
│   estado: "pending_payment"     │
│ }                               │
│                                 │
│ localStorage.setItem(            │
│   'lastOrder',                  │
│   JSON.stringify(lastOrder)     │
│ )                               │
└────────────┬────────────────────┘
             │
             ↓ navigate(/pedido-confirmado/{id})
             │
┌────────────▼────────────────────┐
│ PÁGINA DE CONFIRMACIÓN          │
│                                 │
│ const { lastOrder } = useOrder()│
│                                 │
│ ✅ Pedido #{lastOrder.ordenId}  │
│ Total: ${lastOrder.total}       │
│ Items: {lastOrder.items}        │
│                                 │
│ Estado: PENDIENTE DE PAGO       │
│ Ir a pagar con Mercado Pago     │
└─────────────────────────────────┘
```

---

## 🔀 COMPARATIVA: ANTES vs DESPUÉS

### ANTES (Problemático)
```
Checkout.jsx                    Backend API
    ↓                              ↓
Validar (local)          Validar (remoto)
    ↓                              ↓
Calcular precios         Calcular precios (¡NUEVAMENTE!)
    ↓                              ↓
Mapear campos            Mapear campos (¡MANUAL!)
    ↓                              ↓
fetch(/pedidos/crear)    [Endpoint no existe]
    ↓                              ↓
localStorage (4 keys)    [Confusión de datos]
    ↓
Componentes de confirmación
    ↓
Recalcular totales (¡NUEVAMENTE!)
```

**Problemas**:
- ❌ Código duplicado
- ❌ Cálculos inconsistentes
- ❌ Validación múltiple
- ❌ Endpoint incorrecto
- ❌ localStorage confuso
- ❌ Fácil quebrar

### DESPUÉS (Optimizado)
```
Checkout.jsx           orderService.js              Backend API
    ↓                       ↓                            ↓
Validar con      normalizeCheckoutData()        Validar
checkoutSchema           ↓                        Calcular
    ↓            fetch(/api/orders/create)      Guardar
Formatear                 ↓                        ↓
automático        denormalizeResponse()      Respuesta estándar
    ↓                       ↓
Crear orden            OrderContext.createOrder()
    ↓                       ↓
                    localStorage (1 key)
                       + Context state
                            ↓
                    PedidoConfirmado
                    (accede a useOrder())
```

**Ventajas**:
- ✅ Un solo lugar de verdad
- ✅ Validación centralizada
- ✅ Endpoint correcto
- ✅ localStorage limpio
- ✅ Datos sincronizados
- ✅ Fácil mantener

---

## 🎯 MATRIZ DE RESPONSABILIDADES

```
╔════════════════════╦════════════════════╦════════════════════╗
║  COMPONENTE        ║  ANTES              ║  DESPUÉS           ║
╠════════════════════╬════════════════════╬════════════════════╣
║ Checkout.jsx       ║ TODO (UI + lógica) ║ UI + eventos       ║
║                    ║ - Validar          ║ - Renderizar       ║
║                    ║ - Calcular precios ║ - Formatear        ║
║                    ║ - Mapear datos     ║ - Llamar servicio  ║
║                    ║ - Hacer fetch      ║                    ║
║                    ║ - Persistir datos  ║                    ║
╠════════════════════╬════════════════════╬════════════════════╣
║ orderService.js    ║ ∅ NO EXISTÍA       ║ Lógica principal   ║
║                    ║                    ║ - Normalizar       ║
║                    ║                    ║ - Fetch            ║
║                    ║                    ║ - Desnormalizar    ║
║                    ║                    ║ - Validar          ║
║                    ║                    ║ - Persistir        ║
╠════════════════════╬════════════════════╬════════════════════╣
║ OrderContext.jsx   ║ ∅ NO EXISTÍA       ║ Estado global      ║
║                    ║                    ║ - Almacenar orden  ║
║                    ║                    ║ - Sincronizar LS   ║
║                    ║ (localStorage)     ║ - Proporcionar LS  ║
╠════════════════════╬════════════════════╬════════════════════╣
║ checkoutSchema.js  ║ ½ PARCIAL          ║ Validadores        ║
║                    ║ (en 2 lugares)     ║ - Reglas únicas    ║
║                    ║                    ║ - Reutilizable     ║
╚════════════════════╩════════════════════╩════════════════════╝
```

---

## 📱 CASO DE USO: Usuario Invitado Completa Compra

```
┌─────────────────────────────────────────┐
│ 1️⃣  Usuario ingresa a carrito           │
│    ├─ Productos: 2 items                │
│    ├─ Total: $1500                      │
│    └─ Click: "Ir a Checkout"            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 2️⃣  Carga Checkout.jsx                  │
│    ├─ Carga datos de localStorage       │
│    │  (si hay draft anterior)           │
│    ├─ Valida en tiempo real             │
│    └─ Usuario completa form             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 3️⃣  Usuario ingresa datos               │
│    ├─ nombre: "Juan Pérez"              │
│    ├─ email: "juan@ex.com"              │
│    ├─ whatsapp: "1112345678"            │
│    ├─ domicilio: "Calle 123"            │
│    ├─ localidad: "Capital"              │
│    ├─ provincia: "Buenos Aires"         │
│    ├─ codigoPostal: "1425"              │
│    └─ notasAdicionales: "Dejar timbre"  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 4️⃣  Validación en tiempo real           │
│    ├─ handleChange() → formatField()    │
│    ├─ Si touched → validateField()      │
│    └─ Mostrar errores en rojo           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 5️⃣  Usuario revisa resumen              │
│    ├─ 2 productos × $750 = $1500        │
│    ├─ Envío: GRATIS (>= 3 items? NO)   │
│    │   Envío: $0 (>= 2 items)          │
│    ├─ Total: $1500                      │
│    └─ Click: "Confirmar Pedido"         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 6️⃣  handleSubmit() → orderService        │
│    ├─ Prepara checkoutData              │
│    ├─ createOrder(checkoutData, items)  │
│    │  ├─ Normaliza datos               │
│    │  ├─ Valida newamente              │
│    │  ├─ fetch POST /api/orders/create │
│    │  └─ Desnormaliza respuesta        │
│    └─ Loading = true                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 7️⃣  Backend procesa                     │
│    ├─ Valida: fullName, email, etc     │
│    ├─ Consulta: productos en BD        │
│    ├─ Valida: stock disponible         │
│    ├─ Calcula: subtotal, impuestos 21% │
│    │  1500 + 315 (IVA) = 1815         │
│    ├─ Crea: registro Order en BD       │
│    ├─ Genera: preferencia Mercado Pago │
│    └─ Devuelve: { orderId, status,... }│
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 8️⃣  OrderContext actualiza estado       │
│    ├─ setLastOrder(response)            │
│    ├─ setLastOrderStatus("pending...")  │
│    ├─ localStorage['lastOrder'] = {..}  │
│    ├─ clearCart()                       │
│    └─ Loading = false                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 9️⃣  Navegación automática               │
│    └─ navigate(`/pedido-confirmado/..`) │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ 🔟 Página de confirmación               │
│    ├─ useOrder() → lastOrder            │
│    ├─ Muestra:                          │
│    │  ✅ Pedido #[ID]                   │
│    │  📝 Detalles cliente               │
│    │  📦 Items (2 productos)            │
│    │  💰 Total: $1815                   │
│    │  ⏳ Estado: PENDIENTE DE PAGO      │
│    │  🔗 "Completar Pago"               │
│    └─ → Mercado Pago                    │
└─────────────────────────────────────────┘
```

---

**Visualización completa de la arquitectura y flujos de datos**

