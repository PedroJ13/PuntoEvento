# TASK-232: Web Dev - aplicar paleta global a pagina publica y admin

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de cambios

- Se aplico la paleta global `Punto Evento CR` definida en `TASK-231` a la pagina publica y al admin interno.
- Se agregaron tokens `--brand-*` en `styles.css` y se mapearon los tokens legacy a la nueva paleta para preservar compatibilidad.
- La pagina publica cambia CTAs principales a ink, secundarios a dorado suave, superficies a blanco/calido, fondos a calido claro y acentos a dorado/ink.
- El admin interno cambia fondos, cards, tabs, mensajes, formularios y chips al sistema de color global.
- Los estados operativos del admin conservan semantica:
  - success/aprobado: verde;
  - warning/pendiente: amarillo funcional;
  - error/rechazado: terracota;
  - draft/inactivo: neutro/deshabilitado.
- No se cambiaron layouts, estructura HTML, copy, JS, backend/API ni flujos.

## Archivos tocados

- `index.html`
- `styles.css`
- `admin.html`
- `admin.css`
- `tasks/TASK-232-HANDOFF.md`

## Versiones / cache busting

- `index.html` sube `styles.css?v=21`.
- `admin.html` sube `styles.css?v=21`.
- `admin.html` sube `admin.css?v=14`.
- `app.js?v=28` se mantiene sin cambios.
- `admin.js?v=18` se mantiene sin cambios.

## Evidencia local desktop/mobile

Checks estaticos:

- `git diff --check -- index.html styles.css admin.html admin.css`: OK.
- No se tocaron archivos JS, por lo que no aplica `node --check`.

Playwright con servidor HTTP local embebido:

- Publica desktop `1440x900`:
  - titulo `Punto Evento CR | Demo propuesta`;
  - sin overflow horizontal;
  - fondo body `rgb(248, 245, 239)`;
  - CTA principal `rgb(23, 25, 29)` con texto blanco;
  - secundario `rgb(239, 228, 207)`;
  - superficies `rgb(255, 253, 248)`.
- Publica mobile `390x844`:
  - sin overflow horizontal;
  - mismos colores base verificados.
- Admin desktop `1440x900`:
  - titulo `Admin | Punto Evento CR`;
  - sin overflow horizontal;
  - fondo body `rgb(248, 245, 239)`;
  - CTA principal `rgb(23, 25, 29)` con texto blanco;
  - secundario `rgb(239, 228, 207)`;
  - superficie login `rgba(255, 253, 248, 0.96)`;
  - sin errores de consola.
- Admin mobile `390x844`:
  - sin overflow horizontal;
  - mismos colores base verificados;
  - sin errores de consola.

Observacion:

- En pagina publica local aparecio un `404` no critico de recurso auxiliar no app. No hubo errores JS ni fallos relacionados con los cambios CSS.

## Riesgos

- El cambio es visual por color, pero `styles.css` es compartido por pagina publica y admin; QA debe revisar ambas superficies con atencion.
- Algunos colores legacy siguen existiendo como aliases para compatibilidad, aunque ya apuntan a la nueva paleta.
- El admin mantiene claridad operativa, pero QA debe confirmar que los estados se distinguen bien en datos reales/demo.

## Pendientes

- `TASK-233` debe alinear los emails con la misma paleta mediante estilos inline minimos.
- Falta QA local/estructural formal en `TASK-234`.

## Recomendacion para QA TASK-234

Validar:

- Pagina publica desktop/mobile mantiene layout actual.
- Admin desktop/mobile mantiene login, tabs, expedientes, listados y estados legibles.
- Botones principales tienen contraste suficiente.
- Botones secundarios no parecen acciones destructivas o de aprobacion.
- Estados admin siguen usando texto + color y se distinguen correctamente.
- No hay overflow nuevo en mobile.
- Confirmar que `index.html` sirve `styles.css?v=21` y `admin.html` sirve `styles.css?v=21` / `admin.css?v=14`.
