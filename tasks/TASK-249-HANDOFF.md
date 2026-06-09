# TASK-249 HANDOFF

## Resumen

Se ajusto el copy publico P1 para pre-lanzamiento:

- Metadata publica actualizada a `Punto Evento CR | Proveedores para eventos en Costa Rica`.
- Meta description actualizada a `Encuentra y contacta proveedores para eventos en Costa Rica.`.
- Se eliminaron textos visibles de demo/propuesta en home, fallback de perfil, registro local y planes.
- Se reemplazaron metricas no verificables por beneficios no numericos.
- Se reemplazo `Cotizacion multiple` por CTAs orientados a elegir un servicio publicado.
- `Planes demo` paso a `Opciones de visibilidad` / `Planes para empresas`.

## Archivos tocados

- `index.html`
- `app.js`

## Verificacion

- `node --check app.js`
- `git diff --check -- index.html app.js admin.html admin.js`
- `rg -n "Demo propuesta|Punto Evento CR demo|Cotizacion multiple|Planes demo" index.html app.js` sin coincidencias.
- Playwright smoke local:
  - `foundForbidden: []`
  - Home desktop no contiene textos prohibidos ni metricas `13k+`, `15+`, `50+`.
  - Vista mobile `#bodas` renderiza resultados.

## Riesgos

- Quedan identificadores internos con `demo` en `app.js` (`buildDemoServices`, `serviceDataSource = "demo"`, etc.) porque todavia existe fallback local de referencia. No son copy visible normal.
- La eliminacion total del fallback visual de datos de referencia queda para la tarea posterior de fallback publico productivo.

## Pendientes

- QA debe validar en Azure luego de deploy que no haya cache viejo sirviendo `app.js?v=28`.
- Si Product decide eliminar por completo fallback local publico, coordinarlo con la tarea de no mostrar datos de referencia en produccion.

## Siguiente recomendacion

Validar en Azure home, empresas y perfil de servicio publicado despues de deploy, buscando especificamente `demo`, `Cotizacion multiple` y `Planes demo` en superficie visible.
