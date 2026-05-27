# TASK-031: Infra deploy/smoke endpoint internal invitaciones

## Equipo

Infra Azure.

## Estado

Completada.

## Resultado general

Se confirmo el deploy en Azure del endpoint interno para generar invitaciones de empresa sin usar el prefijo reservado `admin`.

Endpoint validado:

```text
POST /api/internal/company-invites
```

Resultado del smoke sin credenciales:

```text
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Tambien se confirmo:

- `origin/main` contiene el commit de renombre `2731bf5 Rename company invite endpoint to internal`.
- Azure Static Web Apps environment esta `Ready`.
- Azure Resource Manager lista `internal-company-invites` en el build actual.
- `api/admin-company-invites/function.json` e `index.js` no existen en el workspace actual.
- El endpoint viejo `/api/admin/company-invites` devuelve `404`, aceptable y esperado para QA.
- El control `/api/company-auth/logout` sigue vivo con `200 { "ok": true }`.

No se usaron credenciales admin.
No se crearon invitaciones reales.
No se imprimieron secrets ni tokens.
No se modifico codigo.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-029-HANDOFF.md`
- `tasks/TASK-030-HANDOFF.md`
- `api/internal-company-invites/function.json`
- `api/internal-company-invites/index.js`
- `api/shared/adminAuth.js`
- `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`
- `staticwebapp.config.json`

## Commit confirmado

Commit local actual:

```text
2731bf5 Rename company invite endpoint to internal
```

Confirmacion contra GitHub:

```text
origin/main = 2731bf58b694646f70cc0e25b286b2c362e2bd44
```

Archivos esperados en workspace:

```text
api/internal-company-invites/function.json
api/internal-company-invites/index.js
```

Archivos eliminados del build activo local:

```text
api/admin-company-invites/function.json
api/admin-company-invites/index.js
```

## Azure Static Web Apps

Recurso:

```text
Name: puntoevento
Resource group: resource_group_main
Hostname: zealous-field-08fdd720f.7.azurestaticapps.net
Source branch: main
Environment: default
Status: Ready
Last updated: 2026-05-27T19:38:49Z
```

Functions listadas por Azure Resource Manager incluyen:

```text
internal-company-invites
companies-register
company-auth-accept-invite
company-auth-logout
create-upload-url
providers
register-provider
register-upload
```

Nota:

```text
Azure aun lista endpoints admin legacy como admin-approve-provider, admin-pending-providers y admin-reject-provider. Esos endpoints quedan fuera del alcance de TASK-031 y TASK-028 ya documento que pueden responder 404 por el prefijo reservado admin.
```

## Config revisada

`api/internal-company-invites/function.json`:

```json
{
  "authLevel": "anonymous",
  "methods": ["post"],
  "route": "internal/company-invites"
}
```

Ruta final:

```text
/api/internal/company-invites
```

Proteccion real:

```text
requireAdminAuth(req, config)
```

Header esperado sin credenciales:

```text
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

## Smoke tests

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

### POST /api/internal/company-invites sin auth

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Body:

```json
{
  "error": "Unauthorized"
}
```

Conclusion:

```text
Cumple criterio de aceptacion. La ruta nueva llega al handler y Basic Auth bloquea correctamente sin credenciales.
```

### POST /api/admin/company-invites viejo

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin/company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
```

Conclusion:

```text
Aceptable. QA no debe usar el endpoint viejo.
```

### Control: POST /api/company-auth/logout

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/company-auth/logout" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
```

Body:

```json
{
  "ok": true
}
```

Conclusion:

```text
El endpoint de logout sigue operativo.
```

## Riesgos

- El endpoint ya responde correctamente, pero no se probo flujo autenticado porque esta tarea prohibe usar credenciales admin y crear invitaciones reales.
- QA debe evitar `/api/admin/company-invites`; la ruta correcta es `/api/internal/company-invites`.
- El `inviteUrl` de una prueba real contiene token sensible y no debe pegarse en handoffs, chats, logs ni commits.
- Basic Auth admin sigue siendo mecanismo temporal MVP; no reemplaza auth admin formal.
- No hay rate limiting para generar ni aceptar invitaciones.
- Los endpoints admin legacy siguen apareciendo en Azure y probablemente sigan afectados por el prefijo reservado `admin`.

## Recomendacion para Product/Architect

Aprobar TASK-031.

Siguiente paso recomendado:

```text
QA Azure debe generar una invitacion controlada usando POST /api/internal/company-invites con credenciales admin, sin documentar el inviteUrl/token real.
```

Luego validar:

```text
accept-invite -> Set-Cookie pe_company_session -> reutilizacion de token falla -> logout revoca sesion
```

Mantener en backlog el renombre gradual de endpoints admin legacy a `internal`, `backoffice` u otro prefijo no reservado.
