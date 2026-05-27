# TASK-021: Backend auth empresa por invitacion

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-021-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-021-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `tasks/TASK-020-HANDOFF.md`

Codigo relevante:

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/validation.js`
- `api/companies-register/index.js`

## Objetivo

Implementar la base de autenticacion MVP para empresas por invitacion/token y sesion server-side.

## Alcance

Crear:

```text
api/shared/companyAuth.js
api/company-auth-accept-invite/function.json
api/company-auth-accept-invite/index.js
api/company-auth-logout/function.json
api/company-auth-logout/index.js
```

Rutas publicas esperadas:

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/logout
```

Nota:

Aunque las carpetas sean planas, el `route` en `function.json` puede exponer la ruta anidada. Esto mantiene compatibilidad con el historial del proyecto y reduce riesgo de deploy.

## Contratos

### POST `/api/company-auth/accept-invite`

Request:

```json
{
  "token": "token-largo"
}
```

Response `200`:

```json
{
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner"
}
```

Debe responder con cookie:

```text
Set-Cookie: pe_company_session=<session>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

### POST `/api/company-auth/logout`

Response `200`:

```json
{
  "ok": true
}
```

Debe revocar sesion si existe y limpiar cookie.

## Tablas MVP

Usar Azure Table Storage:

```text
CompanyInvites
CompanySessions
```

App settings con defaults:

```text
AZURE_TABLE_COMPANY_INVITES=CompanyInvites
AZURE_TABLE_COMPANY_SESSIONS=CompanySessions
COMPANY_SESSION_COOKIE_NAME=pe_company_session
COMPANY_INVITE_TOKEN_TTL_MINUTES=1440
COMPANY_SESSION_TTL_DAYS=14
```

## Reglas de seguridad

- Guardar solo hash de token de invitacion.
- Guardar solo hash de sesion.
- Token de invitacion debe ser de un solo uso.
- Token vencido/usado/revocado debe fallar.
- Cookie debe ser `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api`.
- No devolver token, hash, connection strings ni secrets.
- El helper debe poder derivar `companyId` desde cookie para futuros endpoints.

## Helper esperado

`api/shared/companyAuth.js` debe exponer funciones reutilizables para:

- Parsear cookies.
- Hashear token/sesion.
- Crear token/session ids seguros.
- Validar invitacion activa.
- Crear sesion.
- Leer sesion actual desde request.
- Revocar sesion.

Nombres exactos quedan a criterio de Backend, pero deben ser claros para reutilizar en `GET /api/companies/me`.

## Datos de prueba

No crear invitaciones reales en Azure desde esta tarea salvo que sea necesario para prueba local.

Si hace falta un mecanismo para probar, documentar claramente como crear una entidad `CompanyInvites` manualmente, sin incluir tokens reales en el repo.

## Fuera de alcance

- No implementar `GET /api/companies/me` todavia.
- No implementar CRUD de servicios.
- No implementar envio real de email.
- No cambiar `panel.html`.
- No crear endpoint admin de generar invitacion todavia.

## Criterios de aceptacion

- Endpoints implementados.
- Helpers reutilizables creados.
- Config defaults documentados en codigo.
- Tests/manual checks documentados en handoff.
- No se rompe `/api/companies/register`.
- No se guardan ni devuelven tokens/hashes en responses.

## Handoff requerido

Crear:

```text
tasks/TASK-021-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contratos implementados.
- Como crear una invitacion de prueba.
- Como probar accept-invite localmente.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-021. Product/Architect debe leer `tasks/TASK-021-HANDOFF.md`.
```
