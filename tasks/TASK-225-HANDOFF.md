# TASK-225 - QA Handoff

Equipo: QA

Tarea validada: `TASK-225: QA - revalidar Azure fix visual final panel empresa`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: Azure real
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado con observaciones.**

Azure sirve el fix visual final del panel empresa y el P1 de logout queda cerrado sobre el asset desplegado. No se detectan P0/P1/P2 nuevos. Queda como observacion P3 aceptable que el logo raster de referencia mantiene arte interno hasta tener asset final.

## Assets / versiones observadas

- `/panel.html`: `200`.
- `/panel.html` contiene `panel.css?v=11`.
- `/panel.html` contiene `panel.js?v=11`.
- `/panel.html` contiene `Punto Evento CR`.
- `/panel.css?v=11`: `200`.
- `/panel.js?v=11`: `200`.
- `/panel.js?v=11` contiene `closest("[data-logout]")`.
- `/`: `200`.
- `/admin.html`: `200`.
- `/api/public/services?limit=1`: `200`.

## Checks ejecutados

- HTTP Azure:
  - `/`
  - `/app.js?v=28`
  - `/panel.html`
  - `/panel.css?v=11`
  - `/panel.js?v=11`
  - `/admin.html`
  - `/api/public/services?limit=1`
- Playwright contra Azure:
  - Panel desktop `1440x900`.
  - Panel desktop estrecho `1024x900`.
  - Panel mobile `390x844`.
  - Smokes desktop/mobile de publica, panel y admin.
  - Click real sobre `Cerrar sesion` en modo demo desplegado para evitar tocar datos reales.

## Resultado por superficie

### Panel empresa visual

Resultado: **aprobado**.

- Desktop `1440x900`:
  - `overflowX=false`.
  - `scrollWidth=1440`.
  - sidebar `280px`.
  - item activo contenido.
  - `Proximamente`: `5/5` badges presentes y contenidos.
  - `Contactanos`: visible y contenido.
  - logo `164x164`, natural `1024x1024`, `border-radius: 50%`, `object-fit: contain`.
  - icon buttons `46x46`, con SVG, `aria-label` y `title`.
- Desktop `1024x900`:
  - `overflowX=false`.
  - `scrollWidth=1024`.
  - sidebar `240px`.
  - `Proximamente`: `5/5` badges presentes y contenidos.
  - `Contactanos`: visible y contenido.
  - icon buttons accesibles.
- Mobile `390x844`:
  - `overflowX=false`.
  - `scrollWidth=390`.
  - sidebar `390px`.
  - `Proximamente`: `5/5` badges presentes y contenidos.
  - `Contactanos`: visible y contenido.
  - logo `188x188`.
  - icon buttons accesibles.

### Logout icon button

Resultado: **aprobado**.

Validado contra `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html?demo=local` para usar el panel desplegado sin modificar datos reales.

- Click real sobre centro del boton `Cerrar sesion`: OK, navega a `index.html#empresas`.
- Click real sobre SVG interno: OK, navega a `index.html#empresas`.
- Click real sobre `path` interno: OK, navega a `index.html#empresas`.
- No hubo errores JS durante las tres interacciones.

### Volver a la pagina publica

Resultado: **aprobado**.

- Click en icon button `Volver a la pagina publica`: OK.
- Navega a `https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#inicio`.

### Regresion minima

Resultado: **aprobada**.

- Pagina publica carga en desktop/mobile sin errores JS y sin overflow horizontal.
- Panel carga en desktop/mobile sin errores JS y sin overflow horizontal.
- Admin carga en desktop/mobile sin errores JS y sin overflow horizontal.
- `/api/public/services?limit=1` responde `200`.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

El P1 de `TASK-214` queda cerrado en Azure.

### P2

Ninguno nuevo.

### P3

1. **Logo raster pendiente de asset final**
   - Severidad: P3.
   - El logo renderiza integrado y accesible, pero el arte raster de referencia puede conservar texto interno anterior hasta reemplazo final.
   - Ya estaba documentado como riesgo aceptable.

## Evidencia resumida

```text
azureCommitEsperado=main/3a56d898b2f35bf04d271bbdb2c62dde632d666b
panelHtml.status=200
panelHtml.hasCssV11=true
panelHtml.hasJsV11=true
panelJs.status=200
panelJs.hasClosestLogout=true
public.status=200
admin.status=200
publicApiServices.status=200
desktop1440.overflowX=false
desktop1440.sidebarWidth=280
desktop1440.soonCount=5
desktop1440.soonContained=true
desktop1440.helpContained=true
desktop1440.logo=164x164
desktop1024.overflowX=false
desktop1024.sidebarWidth=240
mobile390.overflowX=false
mobile390.sidebarWidth=390
mobile390.logo=188x188
logout.center.ok=true
logout.svg.ok=true
logout.path.ok=true
backLink.ok=true
```

## Riesgos o pendientes

- La validacion de logout se hizo en modo demo del panel desplegado para no modificar datos reales; valida el asset Azure, el handler y el comportamiento de click real sobre boton/SVG/path.
- No se declara go comercial nuevo desde QA; queda para Product / Architect / Release.
- El asset raster final de logo sigue pendiente fuera de este bloque.

## Recomendacion para Product / Architect / Release

**Aceptar `TASK-225` y cerrar el bloque P1 visual/logout del panel empresa.**

No quedan P0/P1/P2 nuevos para este fix. Mantener el P3 del logo raster como seguimiento de branding, no bloqueante para pre-lanzamiento controlado.
