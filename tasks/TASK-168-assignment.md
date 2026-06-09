# TASK-168: Infra Azure - deploy pre-lanzamiento y configuracion SendGrid

## Equipo asignado

Infra Azure.

## Contexto

Los handoffs `TASK-158` a `TASK-167` completaron login recurrente, cotizacion por email, emails internos y pulido UX en validacion local/estructural. QA no aprobo pre-lanzamiento real porque falta ambiente Azure con assets/endpoints nuevos y SendGrid/mailbox observable.

## Tarea

Desplegar a Azure el bloque pre-lanzamiento y configurar variables necesarias para validacion real de emails.

## Alcance

- Deploy de endpoints nuevos: `/api/company-auth/activate`, `/api/company-auth/login`, `/api/public/leads`.
- Deploy de assets finales: `app.js?v=25`, `styles.css?v=19`, `panel.js?v=6`, `panel.css?v=7`, `admin.js?v=16`, `admin.css?v=11`.
- Configurar variables sin imprimir valores: `SENDGRID_API_KEY`, `NOTIFICATION_EMAIL_FROM`, `NOTIFICATION_EMAIL_TO`, `NOTIFICATION_EMAIL_FROM_NAME`, `AZURE_TABLE_USERS` si aplica y `AZURE_TABLE_LEADS` si aplica.
- Confirmar mailbox interno observable para QA o documentar limitacion.
- Smoke HTTP basico de rutas/assets desplegados.

## No tocar

- No cambiar logica de negocio.
- No modificar UI/API salvo ajustes estrictamente necesarios de deploy/config.
- No imprimir secretos, tokens, cookies, connection strings ni API keys.

## Verificacion

- Azure sirve assets con cache busting esperado.
- Endpoints nuevos responden con metodo esperado y errores controlados.
- Variables requeridas existen en ambiente correcto, sin valores en handoff.
- Si es posible, smoke de SendGrid sin exponer datos sensibles.

## Handoff esperado

Crear `tasks/TASK-168-HANDOFF.md` con:

- Commit/deploy/ambiente.
- Assets observados.
- Endpoints observados.
- Variables configuradas: si/no, sin valores.
- Mailbox/logs disponibles para QA.
- Riesgos o bloqueos.
- Recomendacion para QA.
