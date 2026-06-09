# TASK-171: QA Azure - emails internos de registro y revision

Equipo: QA

Ambiente probado: Azure real `https://zealous-field-08fdd720f.7.azurestaticapps.net`

Resultado: no aprobado para pre-lanzamiento como emails internos reales; aprobado solo que los flujos principales no se bloquean con email no operativo.

## Datos QA usados

Se reutilizo la ejecucion real de `TASK-169`:

- Company ID: `company_682241b9-a1f0-440d-aa30-67f007ff712c`
- Email QA: `qa-task-169-20260531102109@example.test`
- Service ID: `service_67247ce4-bc83-4a63-8aaa-519f9b82eb5f`

No se imprimieron secretos, tokens, cookies ni invite URL completa.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Registro empresa nueva | PASS flujo principal | `POST /api/companies/register -> 201` aunque SendGrid no esta listo. |
| Enviar servicio a revision | PASS flujo principal | `POST /api/companies/me/services/{serviceId}/submit-review -> 200`, servicio `pending`. |
| Recepcion email interno por registro | NOT RUN | Sin SendGrid completo ni mailbox/log observable. |
| Recepcion email interno por revision | NOT RUN | Sin SendGrid completo ni mailbox/log observable. |
| Flujo principal aunque email falle | PASS | Registro y submit-review respondieron exito con config incompleta. |
| Logs sin secretos | NOT RUN | No hubo acceso a logs Azure en esta tarea. |

## Bugs / riesgos

### P0/P1

- P1: emails internos reales no se pueden aprobar porque faltan `SENDGRID_API_KEY`, `NOTIFICATION_EMAIL_FROM` y mailbox/log observable segun `TASK-168`.

### P2

- No se pudo validar contenido de email, destinatario real ni warning real en logs.
- La empresa QA quedo rechazada por cleanup; no hard delete.

## Recomendacion para Product / Architect / Release

No aprobar `TASK-171` para pre-lanzamiento hasta completar configuracion SendGrid y acceso QA a mailbox/logs. El comportamiento best-effort si esta validado: registro y envio a revision no se bloquean cuando email no esta operativo.
