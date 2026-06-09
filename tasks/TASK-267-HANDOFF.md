# TASK-267 HANDOFF

## Resumen

Se aclaró el flujo público de contacto/cotización para diferenciar WhatsApp de solicitud por formulario/email.

## Archivos modificados

- `app.js`
- `index.html`
- `styles.css`

## Estados WhatsApp/formulario

- WhatsApp:
  - CTA visible: `Solicitar cotización`.
  - Microcopy cercano: `Te abriremos WhatsApp con {servicio} de {empresa}.`
  - Se conserva `wa.me` con mensaje prellenado que incluye el servicio.
  - Al tocar el enlace se muestra feedback: `WhatsApp listo para enviar.`
- Formulario/email:
  - CTA: `Enviar por formulario` cuando WhatsApp existe, o `Solicitar cotización` cuando no hay WhatsApp.
  - Microcopy: `Enviaremos tu solicitud a {empresa} y quedará registrada por Punto Evento CR.`
  - Confirmación: `Solicitud enviada por formulario`.

## Verificación

- `node --check app.js`
- `git diff --check -- index.html app.js styles.css panel.html panel.js admin.html admin.js`
- Playwright smoke con API simulada:
  - `whatsappMicrocopy: true`
  - `whatsappHrefHasService: true`
  - `formMicrocopy: true`
  - `leadPayload.companyId: co-email`
  - `leadPayload.serviceId: svc-email`
  - Confirmación incluye `Solicitud enviada por formulario`.

## Confirmación API/backend

No se tocó backend ni contrato de `/api/public/leads`. El payload sigue usando `companyId + serviceId`.

## Riesgos

- En servicios con WhatsApp aparecen dos caminos: WhatsApp y formulario. El microcopy aclara la diferencia, pero QA debe validar que visualmente no parezcan acciones equivalentes.

## Pendiente recomendado

Validar copy final con Copy/Gramática si Product quiere otro término para `cotización`.
