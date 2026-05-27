# TASK-025: Backend endpoint admin para generar invitaciones

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-025-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-025-HANDOFF.md`.
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
- `tasks/TASK-022-HANDOFF.md`
- `tasks/TASK-023-HANDOFF.md`
- `tasks/TASK-024-HANDOFF.md`

Codigo relevante:

- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/company-auth-accept-invite/index.js`
- `api/admin-pending-providers/index.js`
- `api/admin-pending-providers-flat/function.json`

## Objetivo

Implementar un mecanismo protegido para generar invitaciones reales de empresa, desbloqueando QA Azure de `accept-invite` sin depender de Azure CLI manual ni secretos locales.

## Endpoint requerido

Crear endpoint admin:

```text
POST /api/admin/company-invites
```

Por historial del proyecto, usar carpeta plana si ayuda al deploy:

```text
api/admin-company-invites/function.json
api/admin-company-invites/index.js
```

con route:

```text
admin/company-invites
```

## Auth

Usar Basic Auth admin existente:

```text
api/shared/adminAuth.js
```

Tambien aplicar `enforceAllowedOrigin` como endpoints admin actuales.

## Request

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com"
}
```

Reglas:

- `companyId` requerido.
- Si `email` no viene, usar email de la empresa.
- Validar que la empresa exista en `Companies`.
- Usar role default:

```text
company_owner
```

## Response `201`

```json
{
  "inviteId": "invite_123",
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner",
  "expiresAt": "2026-05-28T00:00:00Z",
  "inviteUrl": "https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html?invite=<token>"
}
```

Notas:

- `inviteUrl` puede contener token porque esta response va a admin autenticado.
- No devolver `tokenHash`.
- No guardar token plano.
- El token solo debe existir en la response.

## Persistencia

Crear entidad en `CompanyInvites`:

```json
{
  "PartitionKey": "companyId",
  "RowKey": "invite_...",
  "tokenHash": "...",
  "email": "...",
  "role": "company_owner",
  "status": "active",
  "expiresAt": "...",
  "usedAt": "",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Usar helpers existentes de `api/shared/companyAuth.js` cuando sea posible:

- `createSecureToken`
- `hashSecret`

Si algun helper no encaja, ajustar de forma compatible y documentarlo.

## Config

Usar:

```text
APP_PUBLIC_URL
COMPANY_INVITE_TOKEN_TTL_MINUTES
AZURE_TABLE_COMPANY_INVITES
AZURE_TABLE_COMPANIES
```

Si `APP_PUBLIC_URL` falta, construir URL relativa o documentar fallback.

## Fuera de alcance

- No enviar email real.
- No crear UI admin todavia.
- No cambiar `panel.html`.
- No implementar `GET /api/companies/me`.
- No tocar flujo publico.

## Criterios de aceptacion

- Endpoint protegido por admin Basic Auth.
- Sin auth responde `401`.
- Company inexistente responde `404`.
- Company existente crea invitacion `active`.
- Response incluye `inviteUrl`.
- Response no incluye `tokenHash`, connection strings ni secrets.
- Token no se persiste plano.
- `accept-invite` existente puede consumir el token generado.
- Checks de sintaxis pasan.

## Handoff requerido

Crear:

```text
tasks/TASK-025-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contrato implementado.
- Como probar local/estructuralmente.
- Como QA debe usarlo para repetir TASK-024.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-025. Product/Architect debe leer `tasks/TASK-025-HANDOFF.md`.
```
