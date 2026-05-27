# TASK-036: Backend GET companies me

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-036-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-036-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-021-HANDOFF.md`
- `tasks/TASK-032-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`

Codigo relevante:

- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`
- `api/companies-register/index.js`

## Contexto

El flujo real de auth por invitacion ya fue validado en Azure:

```text
POST /api/internal/company-invites -> 201
POST /api/company-auth/accept-invite -> 200 + pe_company_session
Reuso token -> 400
POST /api/company-auth/logout -> 200
```

Invite usado en prueba:

```text
inviteId: invite_ff2e1721-c461-4533-9387-cf7d678db795
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
```

## Objetivo

Implementar:

```text
GET /api/companies/me
```

para devolver la empresa asociada a la cookie `pe_company_session`.

## Contrato

Request:

```text
GET /api/companies/me
Cookie: pe_company_session=<session>
```

Response `200`:

```json
{
  "id": "company_123",
  "slug": "qa-company-register-test",
  "name": "QA Company Register Test",
  "status": "pending",
  "plan": "free",
  "email": "qa-company-register-test@example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "..."
}
```

Errores:

```text
401
```

si no hay sesion, si esta vencida, revocada o invalida.

```text
404
```

si la sesion existe pero la empresa ya no existe.

## Reglas

- Usar `getCurrentCompanySession(req, config)` desde `api/shared/companyAuth.js`.
- No aceptar `companyId` desde query/body/header como autoridad.
- Derivar `companyId` solo desde la sesion.
- Leer empresa en tabla `Companies` con:

```text
PartitionKey = company
RowKey = companyId
```

- No devolver secretos, hashes, tokens ni datos internos de Table Storage.
- No tocar CRUD de servicios en esta tarea.
- No tocar UI del panel.

## Function sugerida

Crear:

```text
api/companies-me/function.json
api/companies-me/index.js
```

Route:

```text
companies/me
```

Metodo:

```text
GET
```

## Fuera de alcance

- No implementar `PATCH /api/companies/me`.
- No implementar servicios.
- No cambiar `panel.html`.
- No remover `internal/auth-diagnostics` en esta tarea, salvo que Product/Architect lo pida explicitamente.

## Verificacion esperada

- `node --check` de archivos nuevos/modificados.
- Prueba estructural/mocks si es viable.
- Confirmar que `GET /api/companies/me` sin cookie devuelve `401`.
- Documentar como probar con cookie real despues de deploy.

## Handoff requerido

Crear:

```text
tasks/TASK-036-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contrato implementado.
- Como probar local/estructuralmente.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-036. Product/Architect debe leer `tasks/TASK-036-HANDOFF.md`.
```
