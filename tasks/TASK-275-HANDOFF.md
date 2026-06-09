# TASK-275 HANDOFF

## Resumen

Se corrigio el overflow horizontal desktop en la ficha publica service-first para la ruta mock `#proveedor/empresa-whatsapp/catering-whatsapp`.

La causa era que `.contact-note.full-note` tenia `flex-basis: 100%`, pero el contenedor `.card-actions` no permitia wrap. En desktop, esa nota larga quedaba en la misma fila que los CTAs y empujaba el ancho del documento junto con `Ver más servicios`.

## Archivos modificados

- `styles.css`
  - `.card-actions` ahora permite `flex-wrap: wrap`.
  - `.contact-note.full-note` queda limitado a `max-width: 100%` y permite cortar texto largo con `overflow-wrap: anywhere`.
- `index.html`
  - Cache busting de CSS actualizado de `styles.css?v=26` a `styles.css?v=27`.

## Verificacion

- `git diff --check -- index.html styles.css tasks/TASK-275-smoke.mjs`
  - Sin errores de whitespace.
- `node --check tasks/TASK-275-smoke.mjs`
  - Sin errores de sintaxis en el smoke temporal.
- Smoke Playwright local con API mock:
  - Desktop `1366x768`: `scrollWidth = 1366`, `clientWidth = 1366`.
  - Mobile `390x844`: `scrollWidth = 390`, `clientWidth = 390`.
  - `.contact-note.full-note` y `Ver más servicios` quedaron dentro del viewport.
  - CTA WhatsApp mantiene el servicio seleccionado en el enlace.
  - CTA formulario envio payload con `companyId = empresa-whatsapp` y `serviceId = catering-whatsapp`.

## Confirmacion API

No se cambiaron API, backend, modelo de datos ni flujo de contacto/cotizacion.

## Riesgos

- El ajuste permite que las notas y CTAs bajen de linea en cards con contenido largo. Es el comportamiento esperado para evitar overflow, pero conviene revisar visualmente con nombres reales de empresa/servicio muy largos.

## Pendientes

- Sin pendientes tecnicos para esta tarea.

## Siguiente recomendacion

QA puede revalidar en Azure la misma ruta mock reportada por TASK-274 y confirmar que el scroll horizontal desktop desaparecio manteniendo mobile aprobado.
