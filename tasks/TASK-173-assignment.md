# TASK-173: Product / Infra - configurar SendGrid para pre-lanzamiento

## Equipo asignado

Product / Infra Azure.

## Contexto

`TASK-168` desplego el bloque pre-lanzamiento en Azure, pero dejo bloqueo parcial de email real porque faltan:

- `SENDGRID_API_KEY`
- `NOTIFICATION_EMAIL_FROM`
- mailbox/log observable para QA

`TASK-170` y `TASK-171` no aprobaron emails reales por esta falta de configuracion.

## Tarea

Configurar fuera del repo la cuenta/remitente de SendGrid y cargar los app settings necesarios en Azure sin exponer secretos.

## Alcance

- Crear o confirmar cuenta SendGrid.
- Crear API key con permisos minimos para envio.
- Verificar remitente/sender en SendGrid.
- Definir mailbox interno observable para QA.
- Cargar en Azure Static Web Apps / Functions:
  - `SENDGRID_API_KEY`
  - `NOTIFICATION_EMAIL_FROM`
  - `NOTIFICATION_EMAIL_TO`
  - `NOTIFICATION_EMAIL_FROM_NAME`
- Confirmar que los settings existen sin imprimir valores.

## No tocar

- No cambiar codigo.
- No commitear secretos.
- No pegar API keys, passwords, tokens, cookies ni connection strings en handoff o chat.

## Verificacion

- App settings existen en el ambiente correcto.
- Remitente esta verificado en SendGrid.
- QA tiene acceso al mailbox/log observable o queda documentada la alternativa.

## Handoff esperado

Crear `tasks/TASK-173-HANDOFF.md` con:

- SendGrid listo: si/no.
- Remitente verificado: si/no, sin valor sensible si no se quiere publicar.
- Variables configuradas: si/no, sin valores.
- Mailbox/log observable para QA: si/no.
- Riesgos.
- Recomendacion para reintento QA.
