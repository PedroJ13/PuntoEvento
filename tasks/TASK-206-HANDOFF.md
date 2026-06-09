# TASK-206 - QA Handoff

Equipo: QA

Tarea validada: `TASK-206: QA - validar refresh visual panel empresa`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Local estructural: `http://127.0.0.1:60126/panel.html?demo=local`
- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04

## Resultado

**No aprobado en Azure por deploy pendiente.**

**Aprobado local/estructuralmente con observaciones.**

El refresh visual de `TASK-205` existe localmente, pero Azure todavia sirve la version anterior del panel:

- Local `panel.html`: `panel.css?v=9`, `panel.js?v=8`
- Azure `/panel.html`: `panel.css?v=8`, `panel.js?v=7`

Por lo tanto, no queda validado el refresh visual en el ambiente real ni los flujos reales con sesion/API contra la version nueva.

## Checks ejecutados

### Contexto y estaticos

- `git rev-parse --show-toplevel`: OK.
- Lectura de `chat-start/QA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/MVP_CRITERIA.md`, `tasks/TASK-206-assignment.md` y `tasks/TASK-205-HANDOFF.md`.
- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK, solo warnings de normalizacion LF/CRLF.

### Azure - versiones y smoke minimo

Base: `https://zealous-field-08fdd720f.7.azurestaticapps.net`

- `/`: HTTP `200`, contiene `app.js?v=27`.
- `/panel.html`: HTTP `200`, pero contiene `panel.js?v=7` y `panel.css?v=8`; no contiene `panel.js?v=8` ni `panel.css?v=9`.
- `/admin.html`: HTTP `200`, contiene `admin.js?v=18`.
- `/api/public/services?limit=1`: HTTP `200`.

Resultado Azure: **no aprobado para el refresh del panel por assets anteriores**.

### Local - panel desktop

Playwright Chromium headless, viewport `1440x900`.

- Layout con sidebar: OK, sidebar observado de `280px`.
- Sin overflow horizontal: OK.
- Navegacion:
  - `Mi empresa`: OK, muestra empresa demo y bloque `Datos generales`.
  - `Mis servicios`: OK.
- Items futuros deshabilitados: OK.
  - `Mensajes - Proximamente`
  - `Configuracion - Proximamente`
  - `Metricas - Proximamente`
  - `Planes - Proximamente`
  - `Reportes - Proximamente`
- `Cargar servicio`: OK, abre formulario.
- Subir foto local y elegir portada: OK, preview `1`, boton `Portada` visible.
- `Guardar y enviar`: OK local demo, servicio queda visible y estado `Recibido` aparece.
- Editar servicio: OK local demo, nombre editado queda visible.
- `Volver a la pagina publica`: OK, navega a `index.html#inicio`.
- `Cerrar sesion`: OK local demo, muestra seccion de acceso.

Observacion: el flujo `desactivar servicio` no quedo validado en local demo porque las tarjetas demo no expusieron boton `data-deactivate-service`; en version real debe revalidarse con sesion/API despues del deploy.

### Local - panel mobile

Playwright Chromium headless, viewport `390x844`.

- Sin overflow horizontal: OK (`scrollWidth=390`, `viewportWidth=390`).
- Sidebar/nav ocupa ancho mobile esperado: OK (`390px`).
- Items `Proximamente`: OK, 5 visibles/deshabilitados.
- `Volver a la pagina publica`: visible.
- `Cerrar sesion`: visible.

Resultado local mobile: **OK**.

### Regresion minima local publica/admin

Publica local:

- `index.html` carga.
- Busqueda presente.
- CTA `Contactar` presente.
- Sin overflow horizontal.

Admin local:

- `admin.html` carga.
- Login/admin visible.
- Sin overflow horizontal.

Resultado regresion local: **OK**.

## Hallazgos

### P0

Ninguno.

### P1

1. **Azure no sirve el refresh visual del panel empresa**
   - Esperado por `TASK-205`: `panel.css?v=9` y `panel.js?v=8`.
   - Observado en Azure: `panel.css?v=8` y `panel.js?v=7`.
   - Impacto: bloquea aprobacion QA del refresh en ambiente real y bloquea validacion real de login, API, uploads, editar/desactivar y `Guardar y enviar` con la UI nueva.
   - Tipo: deploy pendiente / ambiente no actualizado.

### P2

1. **Desactivar servicio no quedo cubierto en local demo**
   - En la demo local no se renderizo boton de desactivar en las tarjetas observadas.
   - No se confirma como bug funcional porque la version real requiere sesion/API y Azure aun no sirve el refresh.
   - Requiere revalidacion post-deploy con empresa QA controlada.

2. **Uploads reales no validados contra API con el refresh**
   - Localmente se valido preview y seleccion de `Portada`.
   - No se valido `uploads/sign`, PUT a Blob ni `uploads/confirm` con `panel.js?v=8` porque Azure no esta actualizado.

### P3

1. **404 local no bloqueante en consola**
   - Se observaron 404 locales no bloqueantes durante navegacion demo/publica, probablemente assets auxiliares como favicon/ruta local.
   - No afectaron layout, navegacion ni flujos validados.

## Evidencia resumida

Azure:

```text
/panel.html HTTP 200
HasPanelJsV8=false
HasPanelCssV9=false
HasPanelJsV7=true
HasPanelCssV8=true
```

Local desktop:

```text
title=Carga tus servicios
sidebarWidth=280
overflowX=false
disabled future items=5
photo preview count=1
has Portada button=true
received visible=true
public nav ok=true
logout/auth visible=true
```

Local mobile:

```text
viewport=390
scrollWidth=390
overflowX=false
disabled future items=5
soon badges=5
```

## Riesgos o pendientes

- Deploy pendiente del refresh visual a Azure.
- Falta validacion real post-deploy de:
  - login recurrente;
  - activacion por invite;
  - crear/editar/desactivar servicio contra API real;
  - upload real y portada contra Blob/API;
  - `Guardar y enviar` contra estado real;
  - logout en sesion real.
- Localmente la regresion visual publica/admin no muestra rotura obvia por CSS compartido, pero debe repetirse en Azure cuando se despliegue `panel.css?v=9`.

## Recomendacion para Product / Architect / Release

No cerrar `TASK-206` como aprobado Azure todavia.

Siguiente recomendado:

1. Pedir a Infra Azure deploy del refresh de `TASK-205`.
2. Confirmar en Azure:
   - `/panel.html` con `panel.css?v=9`;
   - `/panel.html` con `panel.js?v=8`.
3. Repetir QA enfocada en Azure con empresa QA controlada para login, crear/editar/desactivar, upload/portada, `Guardar y enviar`, `Volver a la pagina publica` y `Cerrar sesion`.

El refresh local esta en buen estado visual para avanzar a deploy, pero la aprobacion real queda bloqueada por version desplegada anterior.
