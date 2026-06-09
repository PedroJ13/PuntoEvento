# TASK-233 - Handoff Backend/API

## Estado

Completado local/estructuralmente.

## Templates/helpers modificados

- `api/shared/email.js`
  - Nuevo helper `EMAIL_STYLES` con paleta inline.
  - Nuevo wrapper `emailShell(content)` para contenedor/card/header/acento.
  - Nuevo helper `emailRows(details)` para tablas de datos operativos.
  - Nuevo helper `emailCta(href, label)` para links tipo boton.

## Emails actualizados visualmente

- Email de activacion/invitacion de empresa aprobada.
- Email interno de nueva empresa registrada, modelo nuevo.
- Email interno de nueva empresa registrada, endpoint legacy plano.
- Email interno de servicio enviado a revision.
- Email de cotizacion/contacto recibido.

## Colores aplicados

Basado en `tasks/TASK-231-HANDOFF.md`:

- Fondo externo: `#f8f5ef`.
- Card/superficie: `#fffdf8`.
- Borde/linea: `#e4dacb`.
- Texto principal: `#17191d`.
- Texto secundario: `#2a2c31`.
- Superficie muted para labels de tabla: `#f3eee6`.
- Acento superior: `#b9934b`.
- CTA/link boton: fondo `#17191d`, texto blanco.

## Contrato/provider

- No cambio proveedor ACS Email.
- No cambio SendGrid fallback.
- No cambio destinatarios, subjects, replyTo, payloads, rutas, app settings ni estados `emailStatus`.
- No se agregaron dependencias.
- Se mantiene marca visible `Punto Evento CR`.
- No se agregaron logs ni exposicion de secretos.

## Pruebas/checks ejecutados

- `node --check api/shared/email.js` OK.
- `git diff --check -- api` OK.
- Revision estructural:
  - `postAcsEmail` y `postSendGridEmail` sin cambios.
  - `sendEmail` sin cambios funcionales.
  - `sendInternalNotification` sin cambios funcionales.
  - `api/public-leads/index.js` mantiene `emailStatus=pending/sent/failed` y respuesta `502` con `leadId` ante fallo de email.

## Riesgos

- No se envio email real desde ACS en esta tarea.
- Clientes de correo pueden variar el render de bordes/radius, pero los estilos son inline y simples.
- El texto plano derivado por `htmlToText` ahora incluye el header visual `Punto Evento CR`; sigue siendo legible.

## Recomendacion para QA TASK-234

- Revisar render visual de al menos:
  - activacion/invitacion;
  - cotizacion/contacto;
  - notificacion interna de empresa registrada;
  - notificacion interna de servicio enviado a revision.
- Confirmar que subjects no cambiaron respecto al contrato actual.
- Confirmar que los links siguen presentes y accionables.
- Confirmar que datos operativos de tablas siguen completos.
- Confirmar que no hay regresion de envio: cotizacion `201` en exito y `502` con `leadId` si falla email.
