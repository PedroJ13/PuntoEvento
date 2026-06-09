# TASK-222: Web Dev - corregir P1 logout en icon button del panel

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Resumen de fix

- Se corrigio el handler de `Cerrar sesion` para detectar clicks en hijos internos del icon button.
- Cambio aplicado:
  - antes: `event.target.matches("[data-logout]")`
  - ahora: `event.target.closest("[data-logout]")`
- Esto permite que el logout se ejecute cuando el click cae sobre:
  - el boton;
  - el SVG;
  - un `path` interno del SVG;
  - un evento despachado desde el `path`.
- Se mantuvo intacta la accion existente de logout.
- Se mantuvo el fix visual de `TASK-213`.

## Archivos tocados

- `panel.js`
- `panel.html`
- `tasks/TASK-222-HANDOFF.md`

Nota: `panel.css` ya estaba modificado por `TASK-213` y no se cambio para este fix.

## Versiones / cache busting

- `panel.html` mantiene `panel.css?v=11`.
- `panel.html` sube `panel.js?v=10`.
- `styles.css?v=20` se mantiene sin cambios.

## Evidencia local enfocada

Servidor local usado:

- `http://127.0.0.1:60007/panel.html`
- `http://127.0.0.1:60007/panel.html?demo=local`

Checks estaticos:

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK.

Playwright con API mockeada en modo real:

- Click real sobre `path` interno de `[data-logout]`: `POST /api/company-auth/logout` llamado 1 vez.
- Despues del click sobre `path`, se muestra auth nuevamente con titulo `Iniciar sesion`.
- Click real sobre `svg` de `[data-logout]`: logout llamado 1 vez.
- Click fisico al centro del boton `[data-logout]`: logout llamado 1 vez.
- `dispatchEvent` desde `path`: logout llamado 1 vez.

Playwright modo demo:

- Click sobre `path` interno de logout navega a `index.html#empresas`.
- `Volver a la pagina publica` navega a `index.html#inicio`.

Smoke visual conservado:

- Desktop: sin overflow horizontal.
- Mobile `390x844`: sin overflow horizontal.
- Sidebar contenido.
- Futuros items siguen deshabilitados.
- Icon buttons siguen `46x46`, con SVG, `aria-label` y `title`.
- Logo conserva mascara radial.

## Riesgos

- Riesgo bajo: el cambio usa delegacion con `closest`, patron esperado para botones con contenido interno.
- QA debe validar en navegador real que click sobre cualquier punto del icon button ejecuta logout.
- El deploy sigue pendiente porque `TASK-215` habia quedado bloqueado por el P1 de `TASK-214`.

## Recomendacion para QA TASK-223

Validar local/estructuralmente:

- Click sobre centro del boton `Cerrar sesion`.
- Click directo sobre el icono/SVG de `Cerrar sesion`.
- Click sobre los trazos internos del icono si la herramienta lo permite.
- Confirmar que vuelve a pantalla de login o cierra sesion segun modo.
- Confirmar `Volver a la pagina publica`.
- Confirmar que sidebar/logo/icon buttons del fix visual final no regresionan.
