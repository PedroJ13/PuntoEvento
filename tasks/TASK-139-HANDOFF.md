# TASK-139 Handoff

## Estado

Completado.

## Archivos modificados

- `admin.html`
- `admin.js`
- `admin.css`

## Cache busting

- `admin.css`: `v=8` -> `v=9`
- `admin.js`: `v=14` -> `v=15`

## Cambios realizados

- En `Modelo nuevo`, el expediente sigue siendo por empresa.
- Se quito el bloque final viejo de listas globales:
  - `Empresas pendientes`
  - `Servicios revisables`
  - `Imagenes pendientes`
- Se quito la columna separada `Imagenes relacionadas` del expediente.
- Cada card de servicio ahora muestra sus imagenes asociadas dentro del mismo bloque.
- Las imagenes se distinguen por tipo:
  - `Cover`
  - `Galeria`
  - fallback a `Imagen` si llega otro `imageType`
- El estado de cada imagen se muestra como informacion con `status-pill`; ya no aparece como accion principal separada.
- El boton principal del servicio cambia a:
  - `Aprobar servicio e imagenes` cuando el servicio tiene imagenes pendientes asociadas.
  - `Aprobar servicio` cuando no tiene imagenes.
- El rechazo de servicio se muestra como `Rechazar servicio`.

## Como se renderizan las imagenes

- `serviceImages(service)` combina:
  - `service.images[]` devuelto por `GET /api/internal/services/pending` segun TASK-138.
  - fallback de `GET /api/internal/uploads/pending` filtrado por `companyId`, `scope=service` y `serviceId`.
- `serviceImagesMarkup(service)` renderiza una grilla dentro de la card del servicio.
- Si la imagen trae `previewUrl`, `loadInternalPreviews()` carga el blob con `fetch` autenticado usando `X-Punto-Admin-Credential`, crea un object URL local y lo asigna al `<img>`.
- Si falla la preview, se muestra `Preview no disponible`.

## Verificacion ejecutada

- PASS: `node --check admin.js`
- PASS: smoke estructural con Node:
  - no existe `internal-grid` en `admin.html`;
  - no existe `data-case-uploads`;
  - no existe `data-internal-list="uploads"`;
  - existe render de `data-service-image`;
  - existe copy `Aprobar servicio e imagenes`;
  - no queda accion primaria `scopedInternalActionsMarkup("uploads", ...)`;
  - previews usan `adminFetchBlob()` con header admin.
- PASS: cache busting confirmado en `admin.html`.

## Riesgos o pendientes

- No se pudo ejecutar smoke visual con navegador embebido porque la sesion reporto `No active Codex browser pane available`.
- El endpoint de preview requiere credencial interna; por eso la UI usa `fetch` autenticado y object URLs en vez de poner `previewUrl` directo en `src`.
- Los endpoints de upload individuales siguen existiendo como soporte tecnico backend, pero el flujo visual primario ya no los presenta como decision separada.

## Deploy

Requiere deploy de `admin.html`, `admin.js` y `admin.css`.
