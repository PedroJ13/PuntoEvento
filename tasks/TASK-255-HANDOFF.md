# TASK-255 HANDOFF

## Resumen

Se implementaron las mejoras mobile aprobadas en `TASK-254-HANDOFF.md` para panel empresa y ficha pública, sin cambiar API ni modelo de datos.

## Parte de TASK-254 implementada

- Panel empresa mobile:
  - Sidebar convertido en cabecera compacta.
  - Logo limitado a 56px de alto visible.
  - Navegación MVP `Mi empresa` / `Mis servicios` en dos tabs compactos.
  - Items deshabilitados `Próximamente` ocultos en mobile.
  - Bloque de ayuda sigue oculto en mobile.
  - En estado sin sesión, el header grande del workspace se oculta para que el login aparezca de inmediato.
- Ficha pública mobile:
  - `provider-summary` aparece antes de la galería en mobile.
  - Galería reducida a `min(42vh, 280px)` con mínimo 240px.
  - Thumbnails compactos de 64px con scroll horizontal.
  - CTA principal sin WhatsApp queda como `Solicitar cotización`.

## Archivos tocados

- `panel.css`
- `panel.html`
- `panel.js`
- `styles.css`
- `index.html`
- `app.js`

## Viewports probados

- Mobile panel sin sesión: `390x844`.
- Mobile panel demo/sesión local: `390x844`.
- Mobile ficha pública desde ruta de proveedor: `390x844`.
- Desktop ficha pública: `1366x900`.

## Verificación

- `node --check app.js`
- `node --check panel.js`
- `git diff --check -- index.html app.js styles.css panel.html panel.css panel.js`
- Playwright smoke local:
  - `loginVisibleInFirstViewport: true`
  - `disabledMobile: ["none", "none", "none", "none", "none"]`
  - `logoHeight: 56`
  - `panelNoHorizontalScroll: true`
  - `demoContentY: 352.84375`
  - `demoContentVisibleInFirstViewport: true`
  - `summaryBeforeCarousel: true`
  - `imageHeight: 280`
  - `ctaVisibleInFirstViewport: true`
  - `publicNoHorizontalScroll: true`
  - desktop mantiene columnas: `732px 420px`

## Riesgos

- El header grande del workspace se oculta solo cuando el panel está sin sesión en mobile; si Product quiere mostrar ese contexto también en login, habría que aceptar que el formulario baja.
- El CTA `Solicitar cotización` se aplica al CTA principal de formulario cuando no hay WhatsApp; los servicios con WhatsApp conservan `Contactar` + `Enviar solicitud`.

## Pendientes

- QA Visual debe validar en dispositivo real o emulación: panel sin sesión, panel con `?demo=local`, ficha pública con servicio publicado y desktop básico.

## Siguiente recomendación

Después de deploy, revisar en Azure `panel.html` mobile y una ficha pública real desde resultados para confirmar que no haya cache viejo de `panel.css`/`styles.css`.
