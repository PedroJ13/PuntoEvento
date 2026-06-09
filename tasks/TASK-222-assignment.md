# TASK-222: Web Dev - corregir P1 logout en icon button del panel

## Equipo asignado

Web Dev.

## Contexto

`TASK-213` completo el fix visual final del panel empresa, pero `TASK-214` no aprobo por un P1 funcional:

- el icon button `Cerrar sesion` no ejecuta logout cuando el usuario hace click real sobre el SVG/path interno;
- causa probable documentada por QA: el handler usa `event.target.matches("[data-logout]")`, por lo que no detecta clicks en hijos internos del boton.

`TASK-215` no desplego y `TASK-216` quedo bloqueada porque no habia deploy nuevo.

## Tarea

Corregir el P1 del icon button `Cerrar sesion` manteniendo intacto el fix visual de `TASK-213`.

## Alcance

1. Ajustar el handler de logout para que el click funcione aunque el target sea el SVG/path interno.
   - Opcion recomendada: `event.target.closest("[data-logout]")`.
   - Alternativa aceptable: `pointer-events: none` en el SVG/path si no rompe accesibilidad.
2. Mantener la accion actual de `Cerrar sesion`.
3. Mantener `Volver a la pagina publica` funcionando.
4. Mantener icon buttons con `aria-label`, `title`, hover y focus.
5. Mantener `panel.css?v=11` si no cambia CSS, o actualizar cache busting si corresponde.
6. Actualizar `panel.js`/cache busting si se modifica JS.

## No tocar

- No cambiar backend/API.
- No cambiar auth server-side.
- No redisenar sidebar, logo ni botones mas alla del fix necesario.
- No cambiar pagina publica ni admin.
- No cambiar el renombre `Punto Evento CR`; eso es `TASK-217` a `TASK-221`.

## Verificacion

- Click real sobre el centro del icon button `Cerrar sesion` ejecuta logout.
- Click sobre el SVG/path interno tambien ejecuta logout.
- `dispatchEvent` y click fisico tienen mismo resultado.
- `Volver a la pagina publica` sigue funcionando.
- Sidebar sigue sin overflow.
- Logo sigue integrado.
- Botones siguen accesibles.
- `node --check panel.js` OK.
- `git diff --check -- panel.html panel.css panel.js` OK.

## Handoff esperado

Crear `tasks/TASK-222-HANDOFF.md` con:

- Resumen de fix.
- Archivos tocados.
- Versiones/cache busting.
- Evidencia local enfocada.
- Riesgos.
- Recomendacion para QA `TASK-223`.
