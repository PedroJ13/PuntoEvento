# TASK-230 - QA Handoff

Equipo: QA

Tarea validada: `TASK-230: QA - revalidar nuevo logo Punto Evento CR en Azure`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: Azure real
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado con observaciones.**

Azure sirve el nuevo logo `Punto Evento CR` del panel empresa correctamente. El logo es visible, legible, proporcional, sin patron falso de transparencia y sin rectangulo/fondo montado evidente en los viewports probados. No se detectan P0/P1/P2 nuevos. Queda solo el riesgo aceptable P3 de que el asset sigue siendo raster derivado de JPEG, no vector definitivo.

## Assets / versiones observadas

- `/panel.html`: `200`.
- `/panel.html` contiene `panel.css?v=12`.
- `/panel.html` contiene `panel.js?v=11`.
- `/panel.html` contiene `assets/images/logo-punto-evento-cr-panel.png`.
- `/panel.html` contiene `alt="Punto Evento CR"`.
- `/assets/images/logo-punto-evento-cr-panel.png`: `200`, `288158` bytes.
- `/panel.css?v=12`: `200`.
- `/panel.js?v=11`: `200`.
- `/`: `200`.
- `/admin.html`: `200`.
- `/api/public/services?limit=1`: `200`.

## Checks ejecutados

- HTTP Azure:
  - `/`
  - `/panel.html`
  - `/panel.css?v=12`
  - `/panel.js?v=11`
  - `/assets/images/logo-punto-evento-cr-panel.png`
  - `/admin.html`
  - `/api/public/services?limit=1`
- Playwright contra Azure:
  - Panel desktop `1440x900`.
  - Panel desktop estrecho `1024x900`.
  - Panel mobile `390x844`.
  - Regresion minima panel en `panel.html?demo=local` para evitar modificar datos reales.
  - Smoke de pagina publica.
  - Smoke de admin interno.

## Resultado por viewport

### Desktop `1440x900`

Resultado: **aprobado**.

- Logo:
  - `src=assets/images/logo-punto-evento-cr-panel.png`.
  - `alt=Punto Evento CR`.
  - render `212x164`.
  - natural `1218x940`.
  - `object-fit: contain`.
  - `mask-image: none`.
  - `mix-blend-mode: normal`.
  - `border-radius: 0px`.
  - fondo contenedor `rgb(248, 245, 239)`.
  - muestras de esquinas del PNG: `[248,245,239,255]`, consistente con fondo calido integrado.
- Texto `Punto Evento CR`: legible en el asset renderizado.
- Sin patron falso de transparencia.
- Sin rectangulo/fondo montado evidente.
- Layout:
  - `overflowX=false`.
  - `scrollWidth=1440`.
  - sidebar `280px`.
  - item activo contenido.
  - `Proximamente`: `5/5` badges presentes y contenidos.
  - icon buttons superiores `46x46`, con SVG, `aria-label` y `title`.
- Sin errores JS.

### Desktop estrecho `1024x900`

Resultado: **aprobado**.

- Logo:
  - render `199x154`.
  - natural `1218x940`.
  - `object-fit: contain`.
  - sin mask/blend/circulo viejo.
  - fondo contenedor `rgb(248, 245, 239)`.
  - muestras de esquinas del PNG consistentes con `#f8f5ef`.
- Sin overflow horizontal:
  - `overflowX=false`.
  - `scrollWidth=1024`.
  - sidebar `240px`.
- `Proximamente`: `5/5` badges contenidos.
- Icon buttons superiores accesibles.
- Sin errores JS.

### Mobile `390x844`

Resultado: **aprobado**.

- Logo:
  - render `168x130`.
  - natural `1218x940`.
  - `object-fit: contain`.
  - sin mask/blend/circulo viejo.
  - fondo contenedor `rgb(248, 245, 239)`.
  - muestras de esquinas del PNG consistentes con `#f8f5ef`.
- Texto principal `Punto Evento CR` legible; tagline pequeno pero aceptable para MVP.
- Sin overflow horizontal:
  - `overflowX=false`.
  - `scrollWidth=390`.
  - sidebar `390px`.
- `Proximamente`: `5/5` badges contenidos.
- Icon buttons superiores accesibles.
- Sin errores JS.

## Regresion minima

Resultado: **aprobada**.

- Panel carga en Azure con `panel.html?demo=local`.
- `Mi empresa`: OK, navega y muestra titulo `Mi empresa`.
- `Mis servicios`: OK, navega y muestra titulo `Carga tus servicios`.
- `Volver a la pagina publica`: OK, navega a `index.html#inicio`.
- `Cerrar sesion`: OK, en modo demo navega a `index.html#empresas`.
- Pagina publica:
  - `/`: `200`.
  - title `Punto Evento CR | Demo propuesta`.
  - sin overflow horizontal en `1280x820`.
  - sin errores JS observados.
- Admin:
  - `/admin.html`: `200`.
  - title `Admin | Punto Evento CR`.
  - sin overflow horizontal en `1280x820`.
  - sin errores JS observados.
- `/api/public/services?limit=1`: `200`.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno.

### P3

1. **Logo sigue siendo raster derivado de JPEG**
   - Severidad: P3.
   - Estado: riesgo ya documentado y aceptable para MVP.
   - Impacto: no bloquea el panel actual; si se necesita uso en fondos variados, conviene pedir SVG/vector o PNG con transparencia real desde fuente original.

## Evidencia resumida

```text
azureCommitEsperado=main/28d731bfd98ec1e18c96848ed8ab7a69ce4f3dcc
panelHtml.status=200
panelHtml.hasCssV12=true
panelHtml.hasJsV11=true
panelHtml.hasLogoPath=true
panelHtml.hasLogoAlt=true
logoPng.status=200
logoPng.bytes=288158
panelCssV12.status=200
panelJsV11.status=200
desktop1440.logo=212x164
desktop1440.logoNatural=1218x940
desktop1440.overflowX=false
desktop1440.maskImage=none
desktop1440.mixBlendMode=normal
desktop1440.cornerSamples=[248,245,239,255]
desktop1024.logo=199x154
desktop1024.overflowX=false
mobile390.logo=168x130
mobile390.overflowX=false
miEmpresa.ok=true
misServicios.ok=true
logout.ok=true
backLink.ok=true
public.status=200
admin.status=200
apiPublicServices.status=200
```

## Riesgos o pendientes

- No se declara go comercial nuevo desde QA; queda para Product / Architect / Release.
- Mantener como seguimiento P3 la futura version vectorial/transparente del logo si Product la requiere.
- La validacion de panel funcional se hizo en modo demo para no modificar datos reales; el objetivo era validar asset visual y regresion de navegacion/botones.

## Recomendacion para Product / Architect / Release

**Aceptar `TASK-230` y cerrar el bloque del nuevo logo `Punto Evento CR` en panel empresa.**

No quedan P0/P1/P2 nuevos. La observacion P3 del formato raster no bloquea el pre-lanzamiento controlado.
