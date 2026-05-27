# TASK-029: Backend renombrar endpoint invitaciones a internal

## Equipo

Backend API.

## Estado

Completada.

## Resultado general

Se renombro la Function de generacion de invitaciones para evitar el prefijo reservado `admin`.

Antes:

```text
Function folder: api/admin-company-invites
Route: admin/company-invites
URL: /api/admin/company-invites
```

Ahora:

```text
Function folder: api/internal-company-invites
Route: internal/company-invites
URL: /api/internal/company-invites
```

Se mantuvo el mismo comportamiento:

- Basic Auth admin con `requireAdminAuth`.
- Validacion de origin con `enforceAllowedOrigin`.
- Persistencia en `CompanyInvites`.
- Verificacion de empresa en `Companies`.
- Response con `inviteUrl`.
- Sin devolver `tokenHash`.
- Sin guardar token plano.

No se tocaron:

- `accept-invite`
- `logout`
- UI
- endpoints admin legacy
- `GET /api/companies/me`

## Archivos modificados/eliminados

Agregados:

- `api/internal-company-invites/function.json`
- `api/internal-company-invites/index.js`
- `tasks/TASK-029-HANDOFF.md`

Eliminados del build activo:

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`

Modificados:

- `docs/BACKLOG.md`

## Ruta final

```text
POST /api/internal/company-invites
```

`function.json` final:

```json
{
  "route": "internal/company-invites",
  "methods": ["post"],
  "authLevel": "anonymous"
}
```

La ruta mantiene `authLevel: anonymous` siguiendo el patron de los endpoints internos actuales, pero la proteccion real sigue dentro del handler:

```text
requireAdminAuth(req, config)
```

## Contrato mantenido

Request:

```json
{
  "companyId": "company_123",
  "email": "empresa@email.com"
}
```

Response `201`:

```json
{
  "inviteId": "invite_123",
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner",
  "expiresAt": "2026-05-28T00:00:00Z",
  "inviteUrl": "https://.../panel.html?invite=..."
}
```

Errores esperados se mantienen:

```text
401 Unauthorized
403 Forbidden
400 companyId is required
404 Company not found
400 email is required
405 Method not allowed
500 Unexpected server error
```

## Verificacion ejecutada

Sintaxis:

```text
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/internal-company-invites/index.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

Validacion de `function.json`:

```text
route: internal/company-invites
methods: post
authLevel: anonymous
```

Revision de Function vieja:

```text
api/admin-company-invites/function.json eliminado
api/admin-company-invites/index.js eliminado
```

Busqueda de rutas:

```text
api/internal-company-invites/function.json contiene route internal/company-invites.
docs/API_CONTRACTS_MVP.md ya documenta POST /api/internal/company-invites.
docs/BACKLOG.md marca el rename como completado.
```

Git status relevante:

```text
D  api/admin-company-invites/function.json
D  api/admin-company-invites/index.js
?? api/internal-company-invites/
M  docs/BACKLOG.md
?? tasks/TASK-029-HANDOFF.md
```

Nota:

El repo ya tenia otros cambios sin commit antes de esta tarea, principalmente docs y handoffs de TASK-027/TASK-028. No se revirtieron ni se tocaron fuera del alcance.

## Riesgos

- No se hizo deploy en esta tarea.
- Hasta que Infra despliegue, Azure seguira sirviendo el estado anterior.
- Si algun cliente o prueba sigue apuntando a `/api/admin/company-invites`, recibira `404` o endpoint ausente.
- Basic Auth admin sigue siendo mecanismo temporal MVP; este cambio resuelve routing, no hardening.
- Los endpoints admin legacy siguen usando prefijo `admin` y pueden seguir fallando en Azure; quedan fuera de alcance de TASK-029.

## Siguiente tarea recomendada

QA:

```text
Validar local/estructuralmente POST /api/internal/company-invites:
- sin auth -> 401
- auth incorrecta -> 401
- companyId faltante -> 400
- company inexistente -> 404
- company existente -> 201 sin tokenHash
```

Infra Azure:

```text
Desplegar y ejecutar smoke:
POST /api/internal/company-invites sin auth
Esperado: 401 Unauthorized + WWW-Authenticate
```

Despues:

```text
QA Azure puede generar una invitacion controlada y continuar con accept-invite -> cookie -> logout.
```

