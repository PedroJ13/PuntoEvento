# TASK-257 - Handoff Backend/API

## Estado

Completado local/estructuralmente.

## Emails actualizados

- Email interno de registro legacy/proveedor plano.
- Email interno de registro de empresa del modelo nuevo.
- Email interno de servicio enviado.
- Email de cotización/contacto a empresa.
- Email de activación/invitación a empresa.

## Strings reemplazados

- `Categoria` -> `Categoría`.
- `Telefono` -> `Teléfono`.
- `Canton` -> `Cantón`.
- `Descripcion` -> `Descripción`.
- `envio` / `envio sus datos` -> `envió`.
- `registro` en cuerpo -> `registró`.
- `revision` -> `revisión` en emails internos.
- `moderacion` se removió del email interno de servicio y se reemplazó por `revisión interna`.
- `Nueva solicitud de cotizacion` -> `Nueva solicitud de cotización`.
- Email de activación:
  - Subject: `Tu acceso a Punto Evento CR está listo`.
  - Título: `Tu acceso a Punto Evento CR está listo`.
  - Cuerpo: `Ya puedes activar tu acceso al panel.`
  - `podras` -> `podrás`.
  - `informacion` -> `información`.
  - `automaticamente` -> `automáticamente`.

## Palabras evitadas hacia empresa

En el email de activación a empresa se eliminaron:

- `aprobada`
- `revisión`
- `moderación`
- `pendiente`

El email de cotización/contacto a empresa no usa esas palabras.

## Contrato/provider

- No se cambió ACS Email.
- No se cambiaron variables, destinatarios, rutas, `replyTo`, payload ni flujo de invitación.
- No se tocaron endpoints ni frontend.

## Validación ejecutada

- `node --check api/shared/email.js` OK.
- Smoke estructural con `node -e` sobre el bloque `sendCompanyActivationInviteEmail`:
  - confirma ausencia de `aprobada`, `revisión`, `moderación`, `pendiente`;
  - confirma presencia de `Tu acceso a Punto Evento CR está listo`, `Ya puedes activar tu acceso al panel.`, `podrás`, `información`, `automáticamente`.
- `rg -n "cotizacion|revision|moderacion|aprobada|podras|informacion|automaticamente|Descripcion|Telefono|Categoria|Canton|publicos|imagenes" api/shared/email.js` sin matches.
- `git diff --check -- api/shared/email.js` OK.

## Riesgos

- No se envió email real desde ACS en esta tarea.
- El texto plano final depende de `htmlToText`, que no cambió.
- QA real de inbox sigue siendo recomendable para confirmar rendering, asunto y previsualización del cliente de correo.
