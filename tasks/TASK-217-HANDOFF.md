# TASK-217: Web Dev - renombrar marca visible a Punto Evento CR

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se actualizo la marca visible frontend de `Punto Evento` a `Punto Evento CR`.
- Se cubrieron textos visibles, metadata, titulos, `aria-label`, `alt` y copy generado por JS en superficies estaticas frontend.
- No se tocaron backend/API, rutas, slugs, dominios, storage keys, emails ni modelos.
- No se edito el logo raster.

## Archivos tocados

- `index.html`
- `app.js`
- `panel.html`
- `panel.js`
- `admin.html`
- `tasks/TASK-217-HANDOFF.md`

Nota: `panel.css` aparece modificado en el worktree por el bloque visual anterior (`TASK-213`), pero no fue cambiado para este renombre.

## Versiones / cache busting

- `index.html` sube `app.js?v=28`.
- `panel.html` mantiene `panel.css?v=11`.
- `panel.html` sube `panel.js?v=11`.
- `admin.html` no sube `admin.css`/`admin.js` porque solo cambio el `<title>` del HTML.

## Lugares actualizados

- Publica:
  - `<title>` ya queda `Punto Evento CR | Demo propuesta`.
  - Meta description: `Punto Evento CR`.
  - Header brand visible: `Punto Evento CR`.
  - Header brand `aria-label`: `Punto Evento CR demo`.
  - WhatsApp message generado desde servicios: `Punto Evento CR`.
  - Copy de registro/moderacion publica en `app.js`: `Punto Evento CR`.
- Panel empresa:
  - `<title>`: `Panel empresa | Punto Evento CR`.
  - Brand `aria-label`: `Punto Evento CR panel empresa`.
  - Logo `alt`: `Punto Evento CR - Catalogo digital de proveedores para eventos`.
  - Copy de `Mi empresa`: `Punto Evento CR`.
  - Nota de datos generales: `Punto Evento CR`.
  - Error de acceso `403`: `Punto Evento CR`.
- Admin:
  - `<title>`: `Admin | Punto Evento CR`.

## Usos no cambiados

- `Reference Images/Propeusta logo e imagen de pagina.jpeg` contiene texto raster interno `Punto Evento`.
- No se edito porque la asignacion excluye modificar el logo raster si requiere edicion grafica.
- Pendiente: reemplazar por asset final limpio con `Punto Evento CR`.

## Verificacion local

- `node --check app.js`: OK.
- `node --check panel.js`: OK.
- `node --check admin.js`: OK.
- `git diff --check -- index.html app.js panel.html panel.js admin.html panel.css`: OK.
- Busqueda textual:
  - `rg -n "Punto Evento(?! CR)" index.html app.js panel.html panel.js admin.html admin.js --pcre2`: sin resultados.
- Servidor local:
  - `http://127.0.0.1:60008/index.html#inicio`
  - `http://127.0.0.1:60008/panel.html?demo=local`
  - `http://127.0.0.1:60008/admin.html`
- Playwright local:
  - Publica muestra title, marca, aria-label y meta con `Punto Evento CR`.
  - Panel muestra title, brand aria-label, logo alt, copy de empresa y nota con `Punto Evento CR`.
  - Admin muestra title `Admin | Punto Evento CR`.
  - Publica, panel y admin sin overflow horizontal en `1280x820`.

Observacion:

- En servidor estatico local aparecio un `404` no critico de recurso no app; no hubo errores JS relacionados al renombre.

## Riesgos

- El logo visible sigue mostrando internamente `Punto Evento` por ser JPEG de referencia.
- Backend/API y emails pueden seguir usando `Punto Evento` hasta que Backend/API ejecute su tarea separada.
- Si hay referencias fuera de los archivos frontend estaticos revisados, quedan fuera de esta tarea por alcance.

## Recomendacion para QA TASK-219

Validar en local o Azure post-deploy:

- Header publico muestra `Punto Evento CR`.
- Panel empresa muestra `Punto Evento CR` en title, accesibilidad/copy y no rompe login/logout.
- Admin title usa `Punto Evento CR`.
- No aparecen textos visibles frontend `Punto Evento` sin `CR`, excepto el logo raster documentado.
- Smoke basico de busqueda publica, panel y admin sin regresion funcional.
