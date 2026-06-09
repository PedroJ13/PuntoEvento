# TASK-228 - QA Handoff

Equipo: QA

Tarea validada: `TASK-228: QA - validar nuevo logo Punto Evento CR local/estructural`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: local/estructural
- URL local: `http://127.0.0.1:60225/panel.html?demo=local`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado con observaciones.**

El nuevo logo `Punto Evento CR` se ve correcto en el panel empresa local: es legible, usa el asset recomendado, no muestra patron falso de transparencia, no conserva el tratamiento circular/mask/blend anterior y mantiene proporcion correcta en desktop y mobile. No hay P0/P1/P2 nuevos. Queda solo un P3 local ya conocido: `404` no critico al navegar a la pagina publica desde servidor estatico.

## Versiones / assets observados

- `panel.html` referencia `panel.css?v=12`.
- `panel.html` mantiene `panel.js?v=11`.
- `panel.html` usa `assets/images/logo-punto-evento-cr-panel.png`.
- Logo `alt`: `Punto Evento CR`.
- Asset existe:
  - `assets/images/logo-punto-evento-cr-panel.png`
  - peso observado: `288158` bytes.
  - dimensiones naturales en navegador: `1218x940`.
- `panel.js`: `node --check` OK.
- `git diff --check -- panel.html panel.css panel.js`: OK, solo warnings esperados LF/CRLF.

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
  - muestras de esquinas del PNG: `[248,245,239,255]`, consistente con fondo calido recomendado.
- Texto `Punto Evento CR`: visible y legible en inspeccion visual del asset.
- Sin patron de transparencia falso visible.
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
- Texto principal `Punto Evento CR` se mantiene legible en el asset; tagline es pequeno pero aceptable para MVP segun riesgo de `TASK-226`.
- Sin overflow horizontal:
  - `overflowX=false`.
  - `scrollWidth=390`.
  - sidebar `390px`.
- `Proximamente`: `5/5` badges contenidos.
- Icon buttons superiores accesibles.
- Sin errores JS.

## Regresion minima panel

Resultado: **aprobada**.

- `Mi empresa`: OK, navega y muestra titulo `Mi empresa`.
- `Mis servicios`: OK, navega y muestra titulo `Carga tus servicios`.
- Icon buttons superiores:
  - `Volver a la pagina publica`: OK, navega a `index.html#inicio`.
  - `Cerrar sesion`: OK, en modo demo navega a `index.html#empresas`.
- No se detecto overflow horizontal en desktop ni mobile.
- No se detecto error JS relacionado al logo.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno.

### P3

1. **Ruido local `404` al navegar a pagina publica desde servidor estatico**
   - Severidad: P3.
   - Observado despues de `Cerrar sesion` hacia `index.html#empresas`.
   - No afecta el panel ni el logo; consistente con observaciones locales previas.

## Evidencia resumida

```text
panelCssV12=true
panelJsV11=true
logoSrc=assets/images/logo-punto-evento-cr-panel.png
logoAlt=Punto Evento CR
logoNatural=1218x940
desktop1440.logo=212x164
desktop1440.overflowX=false
desktop1440.brandBackground=rgb(248,245,239)
desktop1440.maskImage=none
desktop1440.mixBlendMode=normal
desktop1440.cornerSamples=[248,245,239,255]
desktop1024.logo=199x154
desktop1024.overflowX=false
mobile390.logo=168x130
mobile390.overflowX=false
soonBadges=5/5 contained
miEmpresa.ok=true
misServicios.ok=true
logout.ok=true
backLink.ok=true
```

## Riesgos aceptables

- El asset sigue siendo raster derivado de JPEG, no SVG/vector definitivo.
- El fondo solido del PNG esta optimizado para el fondo calido del panel; sobre fondos distintos podria notarse, pero en el panel actual queda integrado.
- El tagline puede ser pequeno en mobile; no bloquea porque la marca principal `Punto Evento CR` se mantiene legible y el `alt` accesible es correcto.

## Recomendacion para Infra Azure TASK-229

**Proceder con `TASK-229`.**

QA aprueba local/estructuralmente el nuevo logo del panel empresa. Infra debe desplegar `panel.html`, `panel.css` y el asset `assets/images/logo-punto-evento-cr-panel.png`, confirmando en Azure:

- `panel.css?v=12`.
- `panel.js?v=11`.
- asset PNG servido `200`.
- panel desktop/mobile sin overflow.
- logo sin patron falso ni fondo montado evidente.
