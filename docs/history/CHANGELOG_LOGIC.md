# CHANGELOG - Historial de Cambios Lógicos (Frontend)

> Toda modificación lógica del sistema frontend debe registrarse aquí con formato de tabla comparativa.

---

## Template para Nuevas Entradas

```markdown
## [YYYY-MM-DD] - Título del Cambio

**Tipo:** [Feature/Fix/Refactor/Performance/Security]  
**Módulo:** [Auth/Catalogo/Cart/Checkout/...]

### Problema
Descripción breve del problema identificado o funcionalidad nueva

### Flujo Anterior
```
Paso 1 → Paso 2 → Resultado
```

### Flujo Nuevo
```
Paso 1 → Paso 2 → Paso 3 → Resultado mejorado
```

### Impacto
- **Archivos modificados:** Lista de archivos
- **Hooks afectados:** Qué hooks o contextos cambian
- **Performance:** ¿Mejoras de Lighthouse?
- **SEO:** ¿Cambios en metadatos o estructura?

### Validación
- [ ] Tests pasados
- [ ] Lighthouse score verificado
- [ ] React DevTools - sin re-renders infinitos
- [ ] Documentación actualizada
```

---

## Notas de Implementación

### Reglas para el Frontend (React 19)

**✅ PERMITIDO documentar:**
1. Cambios en flujo de datos (hooks, context)
2. Optimizaciones de rendimiento (React.memo, useMemo)
3. Integraciones nuevas (Mercado Pago, APIs)
4. Cambios en estructura de rutas
5. Validaciones y seguridad (JWT, CSRF)

**❌ NUNCA documentar en archivo .md:**
1. Cambios estéticos solo en CSS (van en comentarios del código)
2. Correcciones simples de typos
3. Updates de librerías sin cambio lógico

### Estructura de Cambios Críticos

Si el cambio afecta:
- **Cálculo de precios** → ADR en docs/architecture/
- **Autenticación/seguridad** → ADR en docs/architecture/
- **Flujo de pago** → ADR en docs/architecture/
- **Estructura de datos global** → ADR en docs/architecture/

Ejemplo:
```
docs/architecture/ADR-001-mercado-pago-checkout-flow.md
docs/architecture/ADR-002-dark-mode-implementation.md
```
