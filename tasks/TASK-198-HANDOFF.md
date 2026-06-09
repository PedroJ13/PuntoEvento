# TASK-198 - Handoff Backend/API

## Estado

Completado.

## Emails revisados

- Empresa registrada, modelo nuevo: `notifyCompanyRegistration`.
- Empresa registrada, endpoint legacy plano: `notifyProviderRegistration`.
- Empresa aprobada / activacion: `sendCompanyActivationInviteEmail`.
- Servicio enviado a revision: `notifyServiceSubmittedForReview`.
- Cotizacion/contacto recibido: `sendLeadEmailToCompany`.

## Asuntos y copy final

- Registro empresa: `Nueva empresa registrada en Punto Evento: {empresa}`.
  - Indica que la empresa queda pendiente de revision interna.
  - Incluye datos principales, descripcion y siguiente paso para admin.
- Aprobacion / activacion: `Tu empresa fue aprobada en Punto Evento`.
  - Agrega bienvenida.
  - Explica que la empresa puede activar acceso al panel, revisar perfil, cargar servicios y mantener informacion actualizada.
  - Mantiene enlace de activacion generado con `APP_PUBLIC_URL` cuando esta configurado.
- Servicio enviado: `Servicio enviado a revision en Punto Evento: {servicio}`.
  - Indica que el servicio queda para moderacion interna.
  - Incluye empresa, email, servicio, categoria, precio e IDs utiles.
- Cotizacion/contacto: `Nueva solicitud desde Punto Evento: {servicio}`.
  - Indica origen Punto Evento.
  - Incluye servicio, empresa, datos del cliente, tipo de evento, fecha, invitados, `leadId` y mensaje.
  - Aclara que el correo es respaldo/trazabilidad y que la empresa puede responder por email o contactar por WhatsApp.

## Comportamiento mantenido

- Registro empresa: si falla email interno, el registro no falla.
- Servicio enviado a revision: si falla email interno, el cambio a `pending` no falla.
- Empresa aprobada: si falla invitacion/email, la empresa queda aprobada y la respuesta conserva `invite.status`/`warning`.
- Cotizacion publica: si falla ACS Email, el lead queda persistido con `emailStatus=failed` y la API responde `502` con `leadId`.
- No se cambio proveedor, secretos, variables de entorno, rutas ni payloads.
- No se agregaron logs con datos sensibles.

## Docs actualizados

- `docs/API_CONTRACTS_MVP.md`
  - Agrega aprobacion de empresa e email de cotizacion dentro de emails operativos.
  - Aclara diferencia de fallos entre emails internos y cotizacion publica.
  - Agrega regla de asuntos/cuerpos claros.
- `docs/ARCHITECTURE.md`
  - Agrega email de bienvenida/activacion dentro de usos actuales de ACS Email.

## Verificacion local/estructural

- `node --check api/shared/email.js` OK.
- `git diff --check -- api/shared/email.js docs/API_CONTRACTS_MVP.md docs/ARCHITECTURE.md` OK.
- Revision estructural de llamadas:
  - `api/companies-register/index.js` mantiene fallback no bloqueante.
  - `api/company-services-submit-review/index.js` mantiene fallback no bloqueante.
  - `api/shared/internalModeration.js` mantiene aprobacion con `invite.status` y warnings.
  - `api/public-leads/index.js` mantiene `502` con `leadId` si falla email de cotizacion.

## Riesgos y notas

- No se envio email real desde ACS en esta tarea; queda para QA/Infra Azure con variables reales.
- Los HTML siguen siendo simples, sin redisenio de plantilla.
- `APP_PUBLIC_URL` debe estar configurado en Azure para que el enlace de activacion use URL absoluta; si falta, el helper genera `/panel.html?invite=...`.
