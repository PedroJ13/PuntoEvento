# TASK-218 - Handoff Backend/API

## Estado

Completado local/estructuralmente.

## Resumen de cambios

Se renombro la marca visible de backend/emails de `Punto Evento` a `Punto Evento CR` sin cambiar infraestructura, dominios, rutas API, tablas, slugs, IDs, secrets ni variables de entorno.

## Archivos tocados

- `api/shared/email.js`
- `api/shared/config.js`
- `api/shared/adminAuth.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-218-HANDOFF.md`

## Emails/casos actualizados

- Cotizacion/contacto recibido:
  - Asunto: `Nueva solicitud desde Punto Evento CR: {servicio}`.
  - Cuerpo indica que la solicitud llega desde `Punto Evento CR`.
- Empresa registrada, modelo nuevo:
  - Asunto: `Nueva empresa registrada en Punto Evento CR: {empresa}`.
  - Cuerpo indica registro pendiente de revision interna en `Punto Evento CR`.
- Empresa registrada, endpoint legacy plano:
  - Asunto: `Nueva empresa registrada en Punto Evento CR: {empresa}`.
  - Link visible: `Abrir Punto Evento CR`.
- Servicio enviado a revision:
  - Asunto: `Servicio enviado a revision en Punto Evento CR: {servicio}`.
  - Cuerpo indica moderacion interna en `Punto Evento CR`.
- Activacion/invitacion:
  - Asunto: `Tu empresa fue aprobada en Punto Evento CR`.
  - Cuerpo da bienvenida a `Punto Evento CR`.
- Remitente visible por defecto:
  - `NOTIFICATION_EMAIL_FROM_NAME` conserva prioridad si existe.
  - Fallback de codigo cambia a `Punto Evento CR`.
- Realm Basic Admin visible:
  - `Punto Evento CR Admin`.

## Verificacion local/estructural

- `node --check api/shared/email.js` OK.
- `node --check api/shared/config.js` OK.
- `node --check api/shared/adminAuth.js` OK.
- `rg -n -P "Punto Evento(?! CR)" api docs/API_CONTRACTS_MVP.md` sin matches. Nota: `rg` devuelve codigo 1 cuando no encuentra coincidencias; en este caso es el resultado esperado.
- `git diff --check -- api/shared/email.js api/shared/config.js api/shared/adminAuth.js docs/API_CONTRACTS_MVP.md` OK.
- Busqueda de tests/fixtures: no se encontraron tests o fixtures de templates que actualizar; solo existe `tools/test-company-invite-flow.ps1`.

## Riesgos

- No se envio email real con ACS en esta tarea.
- Si Azure tiene `NOTIFICATION_EMAIL_FROM_NAME` configurado como `Punto Evento`, el codigo no lo sobreescribe; Infra debe actualizar ese app setting si existe.
- La tarea avanzo localmente aunque el tablero indica que el bloque de renombre debe coordinarse despues de cerrar el P1 visual/logout. Recomiendo no desplegarla hasta que Product/Infra confirme orden.

## Recomendacion para QA TASK-219

- Validar en Azure al menos un email de cotizacion real y un email de activacion/invitacion, confirmando asunto y cuerpo con `Punto Evento CR`.
- Confirmar que no cambio el sender tecnico ACS ni el dominio de envio.
- Confirmar que `POST /api/public/leads` mantiene contrato actual: `201` en envio OK y `502` con `leadId` si falla email.
- Confirmar que aprobacion de empresa sigue devolviendo `invite.status` esperado y no expone `inviteUrl` ni token.
