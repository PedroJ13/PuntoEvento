# TASK-268 HANDOFF

## Resumen

Se reforzó la jerarquía `servicio primero, empresa como contexto` en tarjetas/listados y ficha pública.

## Archivos modificados

- `app.js`

## Cambios aplicados

- Tarjetas de servicio:
  - título principal sigue siendo el servicio.
  - subtítulo ahora explicita `Servicio de {empresa}` más categoría/ubicación.
- Ficha pública:
  - el hero muestra como título el servicio seleccionado.
  - la empresa pasa a contexto: `De {empresa} · {ubicación}`.
  - precio desde y CTA quedan cerca del servicio.
  - microcopy: `Estás cotizando este servicio de {empresa}.`

## Verificación

- `node --check app.js`
- Playwright smoke con API simulada:
  - `serviceFirstCards: true`
  - Ficha mobile mantiene summary antes de galería por CSS previo.
  - CTA sigue asociado a servicio con `companyId + serviceId`.

## Confirmación API

No se cambiaron endpoints, filtros, búsqueda ni modelo de datos.

## Riesgos

- Nombres de servicio muy largos siguen protegidos por estilos existentes de `provider-title`, pero QA visual debe revisar casos reales con nombres extensos.

## Pendiente recomendado

Validar una ficha real en mobile cuando exista primera empresa publicada para confirmar que servicio, empresa y CTA aparecen sin scroll largo.
