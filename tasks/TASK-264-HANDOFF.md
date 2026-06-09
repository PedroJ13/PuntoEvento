# TASK-264 HANDOFF

## Resumen

Se ocultó la banda estática de paquetes/proveedores de referencia cuando la API pública responde OK pero el catálogo real está vacío en host productivo/no-local.

## Cambio aplicado

- `shouldShowReferenceCatalog()` ahora bloquea referencias en productivo cuando:
  - `serviceDataSource === "error"`;
  - `serviceDataSource === "api"` y `services.length === 0`.
- `emptyServicesState()` ahora distingue catálogo real vacío de filtros sin coincidencias:
  - muestra `No hay servicios publicados todavía` cuando API OK devuelve `0` items sin filtros activos.
- `providerPage()` evita caer a `providerDemoPage()` si API OK no tiene servicios reales en productivo.
- En local o `?demo=local`, si API OK devuelve `0` items, se usan servicios de referencia para desarrollo.
- Cache busting actualizado a `app.js?v=32`.

## Archivos tocados

- `app.js`
- `index.html`

## Evidencia: catálogo vacío productivo sin referencias

Playwright smoke con host productivo simulado `punto-evento.test` y `/api/public/services` devolviendo `{ items: [] }`:

- `emptyControlled: true`
- `emptyNoReferenceNames: []`
- `emptyNoPackageBand: true`
- `emptyProfileControlled: true`

No aparecen:

- `Paquetes de boda`
- `Comparación rápida de precios`
- `Casa Arboleda Eventos`
- `Bocados y Copas`
- `Luz Viva Producciones`
- `Flor de Abril`
- `Captura Dorada`
- `Nexo Corporativo`

## Evidencia: API OK con servicios

Smoke con API OK y un servicio mock:

- `okShowsReal: true`
- `okNoEmptyState: true`

## Evidencia: API fallida productiva

Smoke con `/api/public/services` forzado a `500`:

- `failControlled: true`
- `failNoReferenceNames: []`

## Evidencia: local/demo

Smoke con `?demo=local` y API OK vacía:

- `demoFlagCanShowReference: true`

## Verificación estática

- `node --check app.js`
- `git diff --check -- app.js index.html`

## Riesgos

- En producción con catálogo real vacío, el sitio queda intencionalmente sobrio y sin catálogo visual hasta publicar servicios reales.
- En local/demo, una API vacía ahora activa servicios de referencia para desarrollo; esto no aplica a host productivo sin `?demo=local`.

## Pendientes

- QA debe validar en Azure con `/api/public/services?limit=50` devolviendo `0` items y confirmar que no hay referencias debajo del estado vacío.
- Confirmar que Azure sirva `app.js?v=32` tras deploy.

## Siguiente recomendación

Cuando se publique la primera empresa real, repetir smoke de `#bodas` para validar que el estado vacío desaparece y que solo se listan servicios reales.
