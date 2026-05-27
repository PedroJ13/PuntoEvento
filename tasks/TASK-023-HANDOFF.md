# TASK-023: Infra deploy y settings auth por invitacion

## Equipo

Infra Azure.

## Estado

Completada.

## Resultado general

El bloque de autenticacion de empresas por invitacion quedo verificado en Azure.

Se confirmo:

- `origin/main` contiene el commit `3283f67 Add company invite auth endpoints`.
- Azure Static Web Apps reporta environment `Ready`.
- Los endpoints nuevos responden en Azure.
- Se configuraron app settings explicitos no secretos para tablas y TTL de sesion/invitacion.
- Las tablas `CompanyInvites` y `CompanySessions` existen.
- `POST /api/company-auth/logout` devuelve `Set-Cookie` limpiando `pe_company_session`.

No se usaron tokens reales.
No se crearon invitaciones reales.
No se modifico codigo.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-021-HANDOFF.md`
- `tasks/TASK-022-HANDOFF.md`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/function.json`
- `api/company-auth-logout/function.json`
- `staticwebapp.config.json`

## Commit desplegado

Commit esperado:

```text
3283f67 Add company invite auth endpoints
```

Confirmacion Git:

```text
origin/main = 3283f67f7799cb9fb367c58784c018b5a5441e5c
```

Azure Static Web Apps:

```text
Name: puntoevento
Resource group: resource_group_main
Environment: default
Status: Ready
Hostname: zealous-field-08fdd720f.7.azurestaticapps.net
Last updated: 2026-05-27T17:46:34Z
```

Nota:

```text
El conector GitHub no devolvio workflow runs para el SHA, pero Azure reporta environment Ready y los endpoints nuevos responden en produccion.
```

## Endpoints verificados

Endpoints esperados:

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/logout
```

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Smoke tests

### POST /api/company-auth/accept-invite sin token

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/company-auth/accept-invite" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
```

Body:

```json
{
  "error": "token is required"
}
```

Conclusion:

```text
Endpoint desplegado y valida token requerido.
```

### POST /api/company-auth/logout sin cookie

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/company-auth/logout" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

Body:

```json
{
  "ok": true
}
```

Set-Cookie observado:

```text
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
```

Conclusion:

```text
Logout es idempotente sin cookie y Static Web Apps/Functions permite Set-Cookie desde API integrada.
```

## App settings

Antes de TASK-023 faltaban los settings explicitos de auth por invitacion.

Se configuraron en Azure Static Web Apps:

```text
AZURE_TABLE_COMPANIES=Companies
AZURE_TABLE_COMPANY_INVITES=CompanyInvites
AZURE_TABLE_COMPANY_SESSIONS=CompanySessions
COMPANY_SESSION_COOKIE_NAME=pe_company_session
COMPANY_INVITE_TOKEN_TTL_MINUTES=1440
COMPANY_SESSION_TTL_DAYS=14
```

App settings actuales por nombre:

```text
ADMIN_PASSWORD
ADMIN_USERNAME
ALLOWED_ORIGINS
APP_PUBLIC_URL
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_PENDING_CONTAINER
AZURE_STORAGE_PUBLIC_CONTAINER
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDER_IMAGES
AZURE_TABLE_PROVIDERS
NOTIFICATION_EMAIL_TO
AZURE_TABLE_COMPANIES
AZURE_TABLE_COMPANY_INVITES
AZURE_TABLE_COMPANY_SESSIONS
COMPANY_SESSION_COOKIE_NAME
COMPANY_INVITE_TOKEN_TTL_MINUTES
COMPANY_SESSION_TTL_DAYS
```

No se imprimieron valores secretos.

## Tablas

Antes del smoke:

```text
Companies
Providers
ProvidersImages
```

Despues del smoke `logout`, que ejecuta `ensureCompanyAuthTables`:

```text
Companies
CompanyInvites
CompanySessions
Providers
ProvidersImages
```

Conclusion:

```text
CompanyInvites y CompanySessions existen.
```

## Set-Cookie

Confirmado en Azure:

```text
Set-Cookie presente en POST /api/company-auth/logout.
Cookie: pe_company_session
Path: /api
Secure: true
HttpOnly: true
SameSite: lax
Max-Age: 0 en logout
```

Pendiente para QA Azure:

```text
Validar Set-Cookie de accept-invite con token real controlado, porque esta tarea no uso tokens reales.
```

## Riesgos

- `accept-invite` no se probo con token real; falta verificar creacion de sesion activa y marcado de invitacion `used`.
- No existe aun herramienta/admin endpoint para generar invitaciones de forma segura.
- `accept-invite` sigue siendo anonimo por diseno; falta rate limiting o mitigacion anti fuerza bruta.
- La busqueda de `tokenHash` y `sessionHash` sin indice auxiliar puede ser suficiente para MVP cerrado, pero no escala bien en Table Storage.
- No hay cleanup automatico de invitaciones/sesiones vencidas.
- La cookie tiene `Path=/api`, correcto para llamadas API, pero no queda disponible para JS ni paginas estaticas. Esto es intencional por `HttpOnly`; futuros endpoints privados deben leerla server-side.

## Recomendacion para Product/Architect

Marcar TASK-023 como aprobada en alcance infra.

Siguiente paso recomendado:

```text
QA Azure debe crear una invitacion controlada, probar accept-invite con token real, confirmar Set-Cookie de sesion y luego probar logout con esa cookie.
```

Antes de uso con empresas reales:

- Crear flujo seguro para generar invitaciones.
- Agregar rate limit o mitigacion anti abuso en `accept-invite`.
- Definir cleanup de `CompanyInvites` y `CompanySessions`.
- Definir siguiente endpoint privado `GET /api/companies/me` usando cookie server-side.

