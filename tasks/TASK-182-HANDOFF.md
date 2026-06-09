# TASK-182: QA Azure - aprobar empresa envia email de activacion

Equipo: QA

Tarea validada: aprobacion de empresa envia invitacion/email de activacion y permite activar password/login.

Ambiente probado:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Dependencias revisadas:
  - `TASK-180-HANDOFF.md`: Backend/API completado local/estructuralmente.
  - `TASK-181-HANDOFF.md`: Web Dev completado local/estructuralmente.
- Commit Azure actual observado en repo local: `origin/main` / `dbb3f75` (`Deploy ACS email provider`).

Resultado: no aprobado.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-180-HANDOFF.md`, `TASK-181-HANDOFF.md` y `TASK-182-assignment.md`. |
| Confirmar assets admin en Azure | FAIL deploy pendiente | `/admin.html -> 200`, pero sirve `admin.js?v=16` y `admin.css?v=11`; no sirve `admin.js?v=17` ni `admin.css?v=12` de `TASK-181`. |
| Registrar empresa QA con mailbox observable | PASS | `POST /api/companies/register -> 201`, empresa `company_fd5e4acb-81b4-4237-bf92-96e4458a2070`, slug `qa-task-182-invite-20260601094704`. El mailbox no fue impreso. |
| Aprobar empresa desde admin interno/API | FAIL alcance TASK-182 | `POST /api/internal/companies/{companyId}/approve -> 200`, body `{ "ok": true, "status": "published" }`; no incluye `invite`, `invite.status`, `emailSent` ni warning. |
| Confirmar mensaje admin de invitacion enviada | NO EJECUTABLE | Azure aun no sirve UI `TASK-181`; falta deploy de `admin.js?v=17/admin.css?v=12`. |
| Confirmar email recibido con enlace de activacion | NO APROBADO | El backend desplegado no genero invite automatico ni indicador de email enviado. |
| Activar password desde enlace | NO EJECUTABLE | No hubo enlace generado por el flujo de aprobacion. |
| Login recurrente con email/password | NO EJECUTABLE | Depende de activar password desde invite automatico. |
| Reintento/no duplicado | NO EJECUTABLE | El endpoint desplegado no expone contrato `invite.status`. |
| No exposicion de secretos | PASS parcial | Responses probadas no exponen token completo, `inviteUrl`, `tokenHash`, cookies, connection strings ni secretos. |
| Limpieza de datos QA | PASS | Empresa QA rechazada despues del smoke: `POST /api/internal/companies/{companyId}/reject -> 200`, status `rejected`, razon `QA cleanup TASK-182`. |

Hallazgos:

- Azure no tiene desplegados los cambios de `TASK-180` ni `TASK-181`.
- El endpoint desplegado de aprobacion mantiene el contrato anterior: publica la empresa, pero no crea invite automatico ni envia email de activacion.
- La UI admin desplegada tambien es anterior al cambio de mensaje de invitacion enviada.

P0/P1:

- P1: El flujo requerido para pre-lanzamiento no esta disponible en Azure. Al aprobar empresa no se genera invite/email automatico de activacion.
- P1: No se puede validar activacion de password ni login recurrente desde enlace automatico porque no existe invite generado por approve en el ambiente desplegado.

P2/P3:

- P2: La respuesta actual es segura porque no filtra tokens ni secretos, pero tampoco ofrece trazabilidad del invite porque el contrato nuevo no esta desplegado.

Evidencia:

```text
GET /admin.html -> 200
admin.js?v=17=false
admin.css?v=12=false
admin.js?v=16=true
admin.css?v=11=true

POST /api/companies/register -> 201
companyId=company_fd5e4acb-81b4-4237-bf92-96e4458a2070
slug=qa-task-182-invite-20260601094704

POST /api/internal/companies/{companyId}/approve -> 200
{
  "ok": true,
  "status": "published"
}

invite object present=false
invite.status=""
emailSent=false
warning=""

POST /api/internal/companies/{companyId}/reject -> 200
status=rejected
```

Riesgos o pendientes:

- Invitar primeras empresas reales sigue bloqueado hasta desplegar y validar `TASK-180`/`TASK-181` en Azure.
- No hay evidencia de email de activacion porque el backend desplegado no lo intenta en approve.
- Se uso mailbox observable sin imprimirlo; no hubo enlace/token que redactar.

Recomendacion go/no-go para invites:

- No-go para invites automaticos.
- Infra Azure debe desplegar `TASK-180` y `TASK-181` o crear una tarea de deploy equivalente.
- Reintentar `TASK-182` cuando Azure sirva `admin.js?v=17/admin.css?v=12` y `POST /api/internal/companies/{companyId}/approve` devuelva `invite.status=email_sent` o un warning claro.
