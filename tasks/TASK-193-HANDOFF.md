# TASK-193: Web Dev - CTA publico Contactar con WhatsApp primario

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Cambios realizados

- En resultados y perfil publico, el CTA principal de servicios ahora dice `Contactar`.
- Si `service.company.whatsapp` o `service.whatsapp` existe, `Contactar` abre `https://wa.me/...` con mensaje prellenado.
- Cuando hay WhatsApp, el formulario/email queda como accion secundaria `Enviar solicitud`.
- Cuando no hay WhatsApp, `Contactar` abre el formulario/email como fallback claro.
- El drawer de contacto ahora dice `Contactar empresa` / `Contactar por {servicio}` y aclara que el formulario va por email.
- Se eliminaron CTAs visibles ambiguos tipo `Pedir presupuesto`, `Cotizar servicio`, `Cotizar paquete` y `Cotizar seleccionados`.

## Archivos cambiados

- `index.html`
- `app.js`
- `styles.css`

## Cache busting

- `index.html` carga `styles.css?v=20`.
- `index.html` carga `app.js?v=26`.

## URLs/pantallas probadas

- `http://127.0.0.1:60002/index.html#bodas` con mocks locales.
- Viewport mobile `390x844`.

## Casos probados

- Servicio con WhatsApp:
  - Mostro `Contactar`.
  - Genero link `https://wa.me/50688887777?...`.
  - No mostro CTAs ambiguos de presupuesto/cotizacion.
- Servicio sin WhatsApp:
  - `Contactar` abrio el drawer de formulario/email.
  - Drawer mobile ancho `354px`, sin corte visible.

## Verificacion

- `node --check app.js`: OK.
- Playwright local con mocks: OK.

## Riesgos o dependencias Backend/API

- El listado publico solo puede abrir WhatsApp si el backend incluye `whatsapp` en `company` o en el servicio.
- El perfil publico ya puede usar `company.whatsapp` cuando viene en `GET /api/public/companies/{slug}`.
- `TASK-194` debe alinear contrato para ambos canales y confirmar que WhatsApp publico se entrega donde corresponde.

## Recomendacion para QA

Validar en Azure un servicio publicado con WhatsApp real y otro sin WhatsApp. Confirmar que WhatsApp abre con mensaje prellenado, que el formulario/email sigue disponible y que no reaparecen CTAs ambiguos.
