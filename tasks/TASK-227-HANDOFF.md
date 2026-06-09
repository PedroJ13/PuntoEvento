# TASK-227: Web Dev - actualizar panel con nuevo logo Punto Evento CR

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se reemplazo el logo anterior del panel empresa por el asset recomendado por `TASK-226`.
- El panel ahora usa `assets/images/logo-punto-evento-cr-panel.png`.
- Se elimino el tratamiento CSS anterior pensado para el JPEG viejo:
  - sin `mask-image`;
  - sin `mix-blend-mode`;
  - sin recorte circular.
- El contenedor del logo usa el fondo calido del panel para integrarse con el PNG preparado.
- Se mantuvo `alt="Punto Evento CR"`.
- No se tocaron flujos de login, logout, servicios, upload, pagina publica, admin ni backend.

## Archivos tocados

- `panel.html`
- `panel.css`
- `tasks/TASK-227-HANDOFF.md`

## Asset usado

- `assets/images/logo-punto-evento-cr-panel.png`

Origen segun `TASK-226`:

- `Reference Images/Logo.jpeg`

Decision:

- Se uso el PNG preparado en `assets/`, no el JPEG directo.
- Motivo: el PNG ya reemplaza el patron falso de transparencia con fondo solido calido `#f8f5ef`, recomendado para el panel.

## Versiones / cache busting

- `panel.html` sube `panel.css?v=12`.
- `panel.html` mantiene `panel.js?v=11`.
- `styles.css?v=20` se mantiene sin cambios.

## Evidencia local desktop/mobile

Servidor local:

- `http://127.0.0.1:60009/panel.html?demo=local`

Checks estaticos:

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK.

Playwright desktop `1440x900`:

- Logo carga desde `assets/images/logo-punto-evento-cr-panel.png`.
- `alt`: `Punto Evento CR`.
- Dimensiones renderizadas: `212x164`.
- Dimensiones naturales: `1218x940`.
- Fondo del contenedor: `rgb(248, 245, 239)`.
- `object-fit: contain`.
- Sin `mask-image`.
- `mix-blend-mode: normal`.
- Sin overflow horizontal.
- Sidebar y badges contenidos.
- Icon buttons superiores siguen `46x46`, con SVG, `aria-label` y `title`.

Playwright desktop estrecho `1024x900`:

- Logo renderizado `199x154`.
- Sin overflow horizontal.
- Sidebar y badges contenidos.

Playwright mobile `390x844`:

- Logo renderizado `168x130`.
- Sin overflow horizontal.
- Sidebar y badges contenidos.

Smoke funcional:

- `Mi empresa` navega y muestra la vista.
- `Mis servicios` navega y muestra la vista.
- `Volver a la pagina publica` navega a `index.html#inicio`.
- `Cerrar sesion` en modo demo navega a `index.html#empresas`.

Observacion:

- En servidor estatico local aparecio un `404` no critico de recurso no app; no hubo errores JS relacionados al logo.

## Riesgos

- El asset sigue siendo raster derivado de JPEG, no SVG/vector definitivo.
- El fondo solido del PNG esta optimizado para el fondo calido del panel; sobre otros fondos podria notarse.
- El asset `assets/images/logo-punto-evento-cr-panel.png` debe incluirse en el deploy.

## Recomendacion para QA TASK-228

Validar local/estructuralmente:

- El panel usa `assets/images/logo-punto-evento-cr-panel.png`.
- El logo visible dice `Punto Evento CR`.
- No se ve patron falso de transparencia.
- No se ve rectangulo montado en desktop ni mobile.
- Desktop `1440x900`, desktop `1024x900` y mobile `390x844` sin overflow.
- `Mi empresa`, `Mis servicios`, `Volver a la pagina publica` y `Cerrar sesion` sin regresion.
