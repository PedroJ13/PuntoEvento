# TASK-256 HANDOFF

## Resumen

Se corrigieron tildes, signos y consistencia de copy visible transversal en público, panel empresa, admin y datos visibles.

## Superficies corregidas

- Público:
  - Home, listados, flujo de contacto, registro empresa, planes, mensajes de error/toast y drawer.
- Panel empresa:
  - Sidebar, login/activación, mensajes de sesión, formulario de servicios y estados visibles.
- Admin:
  - Header, navegación, mensajes de revisión interna, imágenes pendientes y errores visibles.
- Datos:
  - `data/categories.json`: `Decoración`.
  - `data/event-types.json`: label `Cumpleaños`.

## Archivos tocados

- `index.html`
- `app.js`
- `panel.html`
- `panel.js`
- `admin.html`
- `admin.js`
- `data/categories.json`
- `data/event-types.json`

## Zonas dejadas sin tocar por ser técnicas

- IDs/slugs JSON como `cumpleanos`, `graduaciones`.
- Nombres de campos y payload como `password`, `email`, `eventTypes`, `submit-review`.
- Selectores y atributos como `data-tab-target="revision"`.
- Endpoints y claves internas como `/internal/uploads/...`.

## Verificación

- `node --check app.js`
- `node --check panel.js`
- `node --check admin.js`
- `git diff --check -- index.html app.js styles.css panel.html panel.js admin.html admin.js data/categories.json data/event-types.json`
- Búsqueda local de términos frecuentes sin tilde; residuos revisados corresponden a ids, selectores o términos técnicos.
- Playwright smoke confirmó panel sin strings antiguos de password/copy.

## Riesgos

- Algunos valores visibles de categoría/evento ahora llevan tilde; los filtros usan normalización sin diacríticos, por lo que deberían seguir comparando correctamente.
- Si algún backend externo compara labels exactos con strings sin tilde, QA debe detectarlo en panel al crear servicios.

## Pendientes

- QA visual básica en público, panel y admin después del deploy.

## Siguiente recomendación

Validar creación de servicio en panel usando `Decoración` y `Cumpleaños` para confirmar que la API acepta labels con tilde.
