# 📚 Documentación del Frontend - Pagina-Gaddyel

> Guía de documentación para el proyecto frontend React 19

---

## 📁 Estructura de Carpetas

```
docs/
├── history/
│   └── CHANGELOG_LOGIC.md      # Historial de cambios lógicos
└── architecture/
    └── ADR-XXX-nombre.md       # Decisiones de arquitectura críticas
```

---

## 📝 Qué va en cada carpeta

### `/history/CHANGELOG_LOGIC.md`
**Cambios lógicos del frontend** que requieren tracking:
- Nuevas features en hooks personalizados
- Cambios en flujo de datos (Context, Redux)
- Optimizaciones de rendimiento documentadas
- Integraciones nuevas (APIs, librerías)
- Cambios en estructura de rutas
- Validaciones y seguridad

**Formato:** Tabla comparativa (Flujo Anterior vs Flujo Nuevo)

**Ejemplo:**
```markdown
## [2026-01-25] - Implementar useAuth Hook

**Tipo:** Feature  
**Módulo:** Auth

### Flujo Anterior
```
Componente → localStorage directamente
→ Inconsistencia entre componentes
```

### Flujo Nuevo
```
Componente → useAuth() hook
→ AuthContext.jsx maneja estado
→ Consistent en toda la app
```
```

---

### `/architecture/ADR-XXX-*.md`
**Decisiones críticas de arquitectura** que afectan:
- Flujo de autenticación/seguridad
- Integración con APIs externas (Mercado Pago, etc)
- Estructura de datos global
- Core features del negocio

**Formato:** ADR estándar con tabla comparativa

**Ejemplo de nombrado:**
```
ADR-001-mercado-pago-checkout-flow.md
ADR-002-dark-mode-implementation.md
ADR-003-react-router-v7-migration.md
```

---

## 🚫 Qué NO va en archivos .md

❌ **NO crear** en la raíz del proyecto:
- `DARK_MODE_ANALYSIS.md`
- `ESTRUCTURA_VALIDACION.json`
- `FLUJO_DATOS.md`
- etc.

✅ **Estos deben ir:**
- Si es histórico de cambio → `docs/history/CHANGELOG_LOGIC.md`
- Si es decisión crítica → `docs/architecture/ADR-XXX-*.md`
- Si es análisis técnico importante → considerar moverlo a docs/

---

## 📋 Checklist antes de Commit

```checklist
□ ¿Cambio lógico documentado en CHANGELOG_LOGIC.md?
□ ¿Cambio crítico tiene ADR en docs/architecture/?
□ ¿No hay .md files nuevos en la raíz?
□ ¿Tabla comparativa incluida (Flujo Anterior/Nuevo)?
□ ¿Impacto identificado (archivos, hooks, performance)?
□ ¿Validación checklist completada?
```

---

## 📚 Referencia: Stack Tech

**Frontend:**
- React 19 (Stable)
- React Router 7 (v7.8.2)
- Axios
- Mercado Pago SDK JS
- Tailwind CSS
- Vite

**Key Hooks:**
- `useAuth()` - Autenticación
- `useFetch()` / `useFetchWithCache()` - Data fetching
- `useFormStatus()` - Manejo de formularios (React 19)
- `usePricing()` - Lógica de precios (custom)

---

## 🔗 Relacionados

- **Backend:** `/gaddyel-backend/docs/`
- **Admin:** `/gaddyel-admin/docs/`
- **Copilot Instructions:** `/.github/copilot-instructions.md` (NO modificar)
