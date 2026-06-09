# TASK-214 - QA Handoff

Equipo: QA

Tarea validada: `TASK-214: QA - validar fix de overflow sidebar panel empresa`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: local/estructural
- URL local: `http://127.0.0.1:60131/panel.html?demo=local`
- Fecha QA: 2026-06-04

## Resultado

**No aprobado.**

El fix visual del sidebar pasa las validaciones de overflow y contencion, pero queda un **P1** en el icon button `Cerrar sesion`: el click fisico sobre el icono SVG no ejecuta la accion esperada. La tarea explicita que no se debe aprobar deploy si los botones superiores no mantienen accion.

## Resultado por viewport

### Desktop 1440x900

Resultado: **visual aprobado, funcional no aprobado por P1 en logout**.

- `panel.css?v=11`: OK.
- `panel.js?v=9`: OK.
- Sin overflow horizontal:
  - `viewportWidth=1440`
  - `scrollWidth=1440`
  - `overflowX=false`
- Sidebar:
  - ancho `280px`.
  - item activo `Mis servicios` no invade workspace.
  - `activeInvadesWorkspace=false`.
- Badges `Proximamente`:
  - `5/5` contenidos dentro de sus items.
  - `futureAllContained=true`.
- `Contactanos`:
  - contenido dentro de tarjeta de ayuda.
  - `helpButtonContained=true`.
- Logo:
  - render `164x164`.
  - natural `1024x1024`.
  - `border-radius=50%`.
  - `object-fit=contain`.
  - `mix-blend-mode=multiply`.
  - mascara radial aplicada.
- Botones superiores:
  - `Volver a la pagina publica`: icon button `46x46`, SVG `20x20`, `aria-label` y `title`.
  - `Cerrar sesion`: icon button `46x46`, SVG `20x20`, `aria-label` y `title`.
  - Ambos icon-only y con nombre accesible.
- Accion `Volver a la pagina publica`: OK, navega a `index.html#inicio`.
- Accion `Cerrar sesion`: **NO OK**, ver P1.

### Desktop estrecho 1024x900

Resultado: **visual aprobado, condicionado por P1 global en logout**.

- Sin overflow horizontal:
  - `viewportWidth=1024`
  - `scrollWidth=1024`
  - `overflowX=false`
- Sidebar:
  - ancho `240px`.
  - item activo no invade workspace.
- Badges `Proximamente`: `5/5` contenidos.
- `Contactanos`: contenido.
- Botones superiores:
  - icon buttons `46x46`.
  - `aria-label` y `title` presentes.

### Desktop estrecho adicional 900x900

Resultado: **visual aprobado, condicionado por P1 global en logout**.

- Sin overflow horizontal:
  - `viewportWidth=900`
  - `scrollWidth=900`
  - `overflowX=false`
- Sidebar:
  - ancho `240px`.
  - item activo no invade workspace.
- Badges `Proximamente`: `5/5` contenidos.
- `Contactanos`: contenido.
- Logo:
  - `164x164`, proporcionado e integrado.
- Botones superiores:
  - icon buttons `46x46`.
  - `aria-label` y `title` presentes.

### Mobile 390x844

Resultado: **visual aprobado, condicionado por P1 global en logout**.

- Sin overflow horizontal:
  - `viewportWidth=390`
  - `scrollWidth=390`
  - `overflowX=false`
- Menu usable:
  - sidebar/nav ocupa ancho mobile.
  - badges `Proximamente` contenidos.
  - textos no se observan cortados.
- Logo:
  - render `188x188`.
  - natural `1024x1024`.
  - proporcionado, circular, con mascara radial.
- Items futuros:
  - `5/5` deshabilitados.
  - `5/5` badges `Proximamente`.
- Selector multiple `Tipos de evento`: sigue presente.

Nota: en mobile el sidebar esta sobre el workspace por layout vertical; por eso la metrica geometrica de invasion horizontal no aplica como en desktop. No hay overflow horizontal.

## Regresion minima panel

Resultado: **aprobada excepto P1 de logout**.

- `Mi empresa`: OK.
  - Titulo `Mi empresa`.
  - Empresa demo `Aurisbel Eventos`.
  - Nota `Datos generales` visible.
- `Mis servicios`: OK.
- `Cargar servicio`: OK, abre formulario.
- `Tipos de evento`: OK, selector multiple presente.
- Items futuros: OK, siguen deshabilitados.
- Logo: OK, visible.
- `Volver a la pagina publica`: OK.
- `Cerrar sesion`: **NO OK por click fisico sobre icono**.

## Hallazgos

### P0

Ninguno.

### P1

1. **Icon button `Cerrar sesion` no ejecuta accion con click real sobre el icono**
   - Evidencia:
     - Boton existe, visible, no deshabilitado y con `aria-label="Cerrar sesion"` / `title="Cerrar sesion"`.
     - `elementFromPoint` en el centro del boton devuelve el `path`/`svg` interno.
     - Click fisico por coordenadas sobre el centro del boton no navega ni cierra sesion.
     - `dispatchEvent('click')` sobre el boton si navega a `index.html#empresas`.
   - Causa probable:
     - El handler usa `event.target.matches("[data-logout]")`.
     - Cuando el usuario hace click sobre el SVG/path, `event.target` no es el `button`, por lo que no llama a `logout()`.
   - Impacto:
     - El boton superior `Cerrar sesion` puede no funcionar para usuarios que hagan click sobre el icono, que es el caso normal de un icon button.
   - Recomendacion:
     - Ajustar handler a `event.target.closest("[data-logout]")` o hacer que el SVG no capture eventos (`pointer-events: none`) y revalidar.

### P2

Ninguno.

### P3

1. **Ruido de consola local en pagina publica sin API**
   - Al navegar localmente a `index.html#inicio`, `app.js` intenta cargar API y puede registrar fetch fallback/404.
   - Es esperado en entorno local sin Azure Functions.
   - No afecta el fix visual del panel.

## Evidencia resumida

```text
panelCssV11=true
panelJsV9=true
desktop1440Overflow=false
desktop1440Sidebar=280
desktop1440FutureAllContained=true
desktop1440HelpButtonContained=true
desktop1440ActiveInvadesWorkspace=false
narrow1024Overflow=false
narrow1024Sidebar=240
narrow1024FutureAllContained=true
narrow1024HelpButtonContained=true
narrow900Overflow=false
narrow900FutureAllContained=true
mobile390Overflow=false
mobile390FutureAllContained=true
mobile390SoonCount=5
logoDesktop=164x164
logoMobile=188x188
iconButtons=2
buttonsAccessible=true
buttonsIconOnly=true
publicIconActionOk=true
logoutPhysicalClickOk=false
logoutDispatchEventOk=true
```

## Riesgos aceptables

- El logo sigue siendo JPEG de referencia; el tratamiento CSS lo integra mejor y no se ve como bloque rectangular notorio en los viewports probados.
- En navegadores sin soporte completo de mascara CSS, el logo puede verse menos integrado, pero mantiene borde circular y `mix-blend-mode`.

## Recomendacion para Infra Azure TASK-215

**No proceder con deploy de `TASK-213` todavia.**

Antes de `TASK-215`, Web Dev debe corregir el P1 del icon button `Cerrar sesion` y pedir una nueva validacion QA local/estructural enfocada.

El fix de overflow/sidebar/logo esta bien encaminado, pero la accion del boton superior es requisito explicito de la tarea y no debe desplegarse con este fallo.
