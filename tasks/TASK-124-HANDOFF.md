# TASK-124: Pagina publica - busqueda por empresa y limpieza de filtros

## Estado

Completada.

## Resultado general

La pagina publica mantiene resultados centrados en servicios, pero el texto libre ahora contempla datos de empresa para que una busqueda como `Demo Owner Jardines del Sol` pueda coincidir si la API entrega al menos un servicio publicado con `company.name` o `company.slug`.

## Archivos modificados

- `index.html`
- `app.js`
- `styles.css`
- `tasks/TASK-124-HANDOFF.md`

## Cambios UI

- Se agrego campo de busqueda libre en home y en filtros de `#bodas`.
- Se ocultaron/removieron de filtros publicos:
  - `Invitados`;
  - `Presupuesto`;
  - sidebar de checks `Servicios para boda`.
- El filtro `Servicio` y `Provincia` ahora usan `value="Todos"` y seleccion estable por defecto.
- Se ajusto layout sin sidebar y responsive del subhero mobile.

## Como se busca por empresa

`serviceMatchesFilters()` arma el indice local con:

- nombre de servicio;
- categoria;
- descripcion;
- nombre de empresa;
- slug/id de empresa;
- provincia;
- tipos de evento.

La API tambien debe filtrar por empresa cuando `q` viaja a `/api/public/services`; si Azure no lo hace, queda dependencia con `TASK-127`.

## Verificacion

- `node --check app.js`: OK.
- `git diff --check -- index.html app.js styles.css`: OK, solo avisos LF -> CRLF.
- Smoke navegador local:
  - existe input `q`;
  - primer option de `Servicio` es `Todos`;
  - no existe `guests` ni `budget` dentro de `#weddingFilters`;
  - no existe `.checkbox-list` en pagina publica renderizada.
- Capturas:
  - `tasks/generated/TASK-124-desktop.png`;
  - `tasks/generated/TASK-124-mobile.png`.

## Riesgos / dependencia API

- La busqueda local ya incluye empresa, pero en Azure depende de que `/api/public/services?q=...` filtre por `company.name` y `company.slug`.
- Si una empresa no tiene servicios publicados, no aparece en resultados MVP por decision de triage.

## Recomendacion QA

Validar en Azure:

- buscar `Demo Owner Jardines del Sol`;
- confirmar que aparece al menos un servicio publicado de esa empresa;
- aplicar/quitar filtros y confirmar que `Todos` se mantiene estable.
