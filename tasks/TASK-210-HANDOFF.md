# TASK-210 - QA Handoff

Equipo: QA

Tarea validada: `TASK-210: QA - validar ajustes finales panel empresa local/estructural`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: local/estructural
- URL local: `http://127.0.0.1:60130/panel.html?demo=local`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado local/estructuralmente con observaciones P3.**

No se detectaron P0/P1. Los ajustes de `TASK-209` funcionan localmente y quedan recomendados para deploy en `TASK-211`.

## Resultado por punto validado

### 1. Contexto y versiones

Resultado: **aprobado**.

- Se reviso `tasks/TASK-209-HANDOFF.md`.
- `panel.html` carga `panel.css?v=10`: OK.
- `panel.html` carga `panel.js?v=9`: OK.
- `styles.css?v=20` se mantiene.
- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.css panel.js`: OK, solo warnings LF/CRLF.

### 2. Formulario de servicio

Resultado: **aprobado**.

Checks desktop `1440x900`:

- `Categoria` sigue siendo `SELECT` de seleccion unica:
  - `categoryTag=SELECT`
  - `categoryMultiple=false`
- `Tipos de evento` ahora es `SELECT multiple`:
  - `eventTag=SELECT`
  - `eventMultiple=true`
  - helper visible: `Selecciona uno o varios tipos de evento.`
- Opciones cargadas:
  - `Bodas`
  - `Cumpleanos`
  - `Eventos corporativos`
  - `Baby Shower`
  - `Graduaciones`
  - `Fiestas infantiles`
- Validacion sin eventos: OK.
  - Mensaje: `Selecciona al menos un tipo de evento.`
  - No se creo servicio sin eventos.
- Crear servicio con varios tipos: OK.
  - Seleccionados: `Bodas`, `Cumpleanos`.
  - Tarjeta muestra `Eventos Bodas, Cumpleanos`.
  - Mensaje: `Tu informacion fue recibida.`
- Editar servicio: OK.
  - Formulario entra en modo `Editar servicio`.
  - Preselecciona `Bodas` y `Cumpleanos`.
  - Guardar edicion conserva varios tipos en la tarjeta.
- Enviar a revision local/demo: OK.
  - Estado visible `Recibido`.
  - Multiples tipos se mantienen en la tarjeta.

### 3. Visual marca e iconos

Resultado: **aprobado con observacion P3**.

Checks desktop:

- Logo carga completo: OK.
- Logo natural: `1024x1024`.
- Logo render desktop: `180x180`.
- `object-fit=contain`: OK.
- No se observo deformacion por dimensiones; el render mantiene proporcion cuadrada.
- Iconos SVG en menu: `7`.
- Iconos renderizados: `18x18`.
- Stroke observado: blanco (`rgb(255, 255, 255)`).
- Items futuros deshabilitados con `Proximamente`: `5/5`.

Checks mobile `390x844`:

- Logo carga completo: OK.
- Logo render mobile: `210x210`.
- Iconos SVG: `7`.
- Items futuros deshabilitados: `5`.
- Badges `Proximamente`: `5`.
- Sin overflow horizontal.

Observacion: el logo sigue siendo JPEG de referencia, no asset final vectorial/optimizado. Para el tamano probado se ve correcto y no bloquea.

### 4. Regresion minima panel

Resultado: **aprobado local/demo**.

- `Mi empresa`: OK.
  - Titulo `Mi empresa`.
  - Empresa demo `Aurisbel Eventos`.
  - Nota `Datos generales` visible.
- `Mis servicios`: OK.
- Upload/portada local: OK.
  - Preview count: `1`.
  - Boton `Portada` visible.
- Desactivar servicio demo: OK.
  - Texto `Inactivo` visible.
  - Mensaje `Servicio demo desactivado.`
- `Volver a la pagina publica`: OK.
  - Navega a `index.html#inicio`.
- `Cerrar sesion`: OK en modo demo.
  - Redirige a pagina publica `index.html#empresas`, comportamiento esperado del demo local.

Limitacion: login/activacion reales no se probaron porque `TASK-210` es local/estructural y no se levanto API local. Ya estaban cubiertos en Azure por `TASK-208`; deben revalidarse post-deploy en `TASK-212`.

### 5. Regresion minima publica/admin local

Resultado: **aprobado con observacion de entorno local**.

Pagina publica local:

- `index.html` carga.
- Titulo: `Punto Evento CR | Demo propuesta`.
- Busqueda presente.
- CTA `Contactar` presente.
- Sin overflow horizontal.

Admin local:

- `admin.html` carga.
- Login/admin visible.
- Sin overflow horizontal.
- Consola sin errores durante smoke.

Observacion: en local, la pagina publica puede registrar error de fetch porque no esta corriendo Azure Functions/API local. No se observa rotura visual por CSS.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno.

### P3

1. **Logo usa JPEG de referencia**
   - Funciona y se ve proporcionado en desktop/mobile.
   - Riesgo menor: no es logo final optimizado/vectorial.
   - Recomendacion: reemplazar por asset final limpio cuando exista.

2. **Ruido de consola en regresion publica local sin API**
   - En local, `app.js` intenta cargar datos y puede fallar si no esta corriendo API.
   - No afecta la validacion visual local ni el panel.
   - Revalidar publica/admin en Azure durante `TASK-212`.

## Evidencia resumida

```text
panelCssV10=true
panelJsV9=true
categoryMultiple=false
eventMultiple=true
eventOptions=6
noEventsValidation=Selecciona al menos un tipo de evento.
selectedEventTypes=Bodas,Cumpleanos
editPreselect=Bodas,Cumpleanos
afterCreateReceived=true
afterEditEventsStillShown=true
photoPreviewCount=1
hasPortada=true
desktopLogo=180x180
mobileLogo=210x210
iconCount=7
futureDisabled=5
mobileOverflow=false
publicLocalLoads=true
adminLocalLoads=true
```

## Riesgos aceptables

- El selector multiple nativo puede variar visualmente entre navegadores; el helper visible reduce ambiguedad.
- El logo JPEG es aceptable para esta etapa, pero no reemplaza el asset final de marca.
- Esta validacion no sustituye revalidacion Azure real con API/sesion despues de deploy.

## Recomendacion para Infra Azure TASK-211

**Procede deploy de `TASK-209` en `TASK-211`.**

Validar en deploy:

- `/panel.html` contiene `panel.css?v=10`.
- `/panel.html` contiene `panel.js?v=9`.
- `/panel.css?v=10` responde `200`.
- `/panel.js?v=9` responde `200`.

Luego ejecutar `TASK-212` en Azure real para confirmar que seleccion multiple, upload, login/activacion, crear/editar/desactivar y regresion publica/admin siguen funcionando contra API desplegada.
