# TASK-253 HANDOFF

## Resumen

Se ajustó el drawer público de contacto en mobile para que el CTA principal quede visible y usable al abrir.

- En mobile, `.drawer-panel` usa layout vertical con `100dvh`.
- El formulario tiene scroll interno.
- El botón `Enviar solicitud` queda sticky al fondo del drawer.
- Se evita scroll horizontal en viewport mobile.

## Archivos tocados

- `styles.css`
- `index.html` por cache-busting de `styles.css?v=24`

## Viewports probados

- Mobile: `390x844`
- Desktop smoke: `1366x900`

## Verificación

- `git diff --check -- index.html app.js styles.css panel.html panel.js admin.html admin.js data/categories.json data/event-types.json`
- Playwright smoke:
  - CTA de servicio abre drawer en mobile.
  - `submitVisibleOnOpen: true`
  - `noHorizontalScrollMobile: true`
  - Desktop API OK renderiza servicio publicado.

## Riesgos

- El sticky aplica solo al botón principal del formulario del drawer en mobile.
- Si se agregan nuevos CTAs dentro del drawer, conviene revisar que no compitan con el botón sticky.

## Pendientes

- QA visual debe confirmar en dispositivo real o emulación de navegador móvil después del deploy.

## Siguiente recomendación

Probar el flujo completo desde una card de servicio publicada en mobile: abrir drawer, completar formulario y confirmar que el CTA permanece accesible.
