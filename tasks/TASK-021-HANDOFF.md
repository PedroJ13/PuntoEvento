# TASK-021: Backend auth empresa por invitacion

## Equipo

Backend API.

## Estado

Completada.

## Resultado general

Se implemento la base MVP de autenticacion de empresas por invitacion/token y sesion server-side.

Endpoints nuevos:

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/logout
```

Helper reutilizable nuevo:

```text
api/shared/companyAuth.js
```

La implementacion:

- Guarda solo hash del token de invitacion.
- Guarda solo hash de la sesion.
- Crea cookie `HttpOnly; Secure; SameSite=Lax; Path=/api`.
- Permite derivar `companyId` desde cookie para futuros endpoints como `GET /api/companies/me`.
- No modifica `POST /api/companies/register`.
- No toca `panel.html` ni pagina publica.

## Archivos modificados

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/function.json`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/function.json`
- `api/company-auth-logout/index.js`
- `tasks/TASK-021-HANDOFF.md`

## Contratos implementados

### POST `/api/company-auth/accept-invite`

Azure Function:

```text
api/company-auth-accept-invite
```

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

Header:

```text
Set-Cookie: pe_company_session=<session>; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=<ttl>
```

Errores:

```text
400 token is required
400 Invitation not found
400 Invitation is not active
400 Invitation was already used
400 Invitation expired
400 Invitation is invalid
403 Forbidden si origin no esta permitido
405 Method not allowed
500 Unexpected server error
```

Reglas implementadas:

- Busca invitacion por `tokenHash`.
- Valida `status: active`.
- Valida `usedAt` vacio.
- Valida `expiresAt` futuro.
- Crea sesion en `CompanySessions`.
- Marca invitacion como `used`.
- No devuelve token, hash ni datos internos.

### POST `/api/company-auth/logout`

Azure Function:

```text
api/company-auth-logout
```

Response `200`:

```json
{
  "ok": true
}
```

Header:

```text
Set-Cookie: pe_company_session=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0
```

Reglas implementadas:

- Lee cookie de sesion si existe.
- Busca sesion activa por hash.
- Marca sesion como `revoked`.
- Limpia cookie.
- Es idempotente: si no hay sesion, responde `200`.

## Config defaults agregados

En `api/shared/config.js`:

```text
AZURE_TABLE_COMPANY_INVITES=CompanyInvites
AZURE_TABLE_COMPANY_SESSIONS=CompanySessions
COMPANY_SESSION_COOKIE_NAME=pe_company_session
COMPANY_INVITE_TOKEN_TTL_MINUTES=1440
COMPANY_SESSION_TTL_DAYS=14
```

Todos tienen defaults, por lo que el deploy puede funcionar sin app settings nuevos, aunque Infra deberia configurarlos para claridad operativa.

## Tablas usadas

```text
CompanyInvites
CompanySessions
```

`api/shared/azure.js` ahora expone:

```js
ensureCompanyAuthTables(config)
```

Esto crea ambas tablas al vuelo siguiendo el patron existente del repo.

## Helper creado

`api/shared/companyAuth.js` expone:

```js
clearSessionCookie
cleanToken
createCompanySession
createSecureToken
findInviteByToken
getCurrentCompanySession
hashSecret
parseCookies
publicSessionPayload
revokeSession
sessionCookie
validateActiveInvite
markInviteUsed
```

Uso futuro esperado:

- `GET /api/companies/me` puede llamar `getCurrentCompanySession(req, config)`.
- Si no hay sesion, responder `401`.
- Si hay sesion, usar `session.partitionKey` como `companyId`.

## Como crear una invitacion de prueba

No se crearon invitaciones reales en Azure desde esta tarea.

Para crear una invitacion manual de prueba:

1. Generar un token largo y su hash localmente:

```powershell
@'
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("base64url");
const tokenHash = crypto.createHash("sha256").update(token, "utf8").digest("hex");
console.log(JSON.stringify({ token, tokenHash }, null, 2));
'@ | node
```

Si `node` del sistema esta bloqueado, usar el runtime bundled:

```powershell
@'
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("base64url");
const tokenHash = crypto.createHash("sha256").update(token, "utf8").digest("hex");
console.log(JSON.stringify({ token, tokenHash }, null, 2));
'@ | & 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
```

2. Crear entidad en `CompanyInvites`:

```json
{
  "PartitionKey": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "RowKey": "invite_manual_001",
  "tokenHash": "<hash-generado>",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner",
  "status": "active",
  "expiresAt": "2026-05-28T00:00:00Z",
  "usedAt": "",
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

3. Compartir solo el `token`, nunca el `tokenHash`.

Importante:

```text
No guardar tokens reales en Git, docs ni handoffs.
```

## Como probar accept-invite localmente

Precondiciones:

- `api/node_modules` instalado con dependencias de `api/package.json`, o ejecutar en Azure.
- Variables de Storage/Table disponibles:

```text
AZURE_STORAGE_CONNECTION_STRING
AZURE_TABLE_CONNECTION_STRING
```

Request:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:7071/api/company-auth/accept-invite' `
  -ContentType 'application/json' `
  -Body '{"token":"<token-real-de-prueba>"}' `
  -SessionVariable session
```

Validar:

- Response contiene `companyId`, `email`, `role`.
- Header `Set-Cookie` contiene `pe_company_session`.
- Entidad en `CompanyInvites` cambia a `status: used`.
- Entidad nueva en `CompanySessions` queda `status: active`.
- No hay token ni hash en response.

Logout:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:7071/api/company-auth/logout' `
  -WebSession $session
```

Validar:

- Response `{ "ok": true }`.
- Header limpia cookie.
- Sesion queda `revoked` si existia.

## Verificacion realizada

Sintaxis JS:

```text
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/companyAuth.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/company-auth-accept-invite/index.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/company-auth-logout/index.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/config.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/azure.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

Validacion estructural de `function.json`:

```text
api/company-auth-accept-invite/function.json
Route: company-auth/accept-invite
Methods: post
AuthLevel: anonymous

api/company-auth-logout/function.json
Route: company-auth/logout
Methods: post
AuthLevel: anonymous
```

Prueba directa del helper:

```text
Se intento cargar companyAuth.js con Node local para validar funciones puras.
La carga fallo porque el workspace no tiene api/node_modules instalado y falta @azure/data-tables localmente.
```

Detalle:

```text
Error: Cannot find module '@azure/data-tables'
```

Esto no es un error de sintaxis ni necesariamente de deploy, porque `api/package.json` declara `@azure/data-tables` y Azure Static Web Apps instala dependencias del API durante build/deploy.

## Riesgos

- No se probo end-to-end contra Azure en esta tarea porque no se crearon invitaciones reales.
- `accept-invite` marca la invitacion como `used` despues de crear la sesion. En concurrencia extrema, dos requests simultaneos con el mismo token podrian pasar la validacion antes del update. Para MVP cerrado el riesgo es bajo, pero debe endurecerse con operacion condicional/ETag o tabla de claims atomica.
- Buscar invitacion/sesion por hash sin `PartitionKey` puede ser suficiente para MVP pequeno, pero no escala bien en Table Storage. Mas adelante conviene agregar indice auxiliar o incluir identificador no secreto en el token/cookie.
- No hay rate limiting para intentos de token.
- La cookie usa `Secure`; en local HTTP el navegador podria no persistirla. La prueba real debe hacerse en Azure/HTTPS o ajustar estrategia local solo para desarrollo.
- No hay endpoint admin para generar invitaciones; por ahora la creacion de invitacion es manual.
- No hay cleanup automatico de sesiones/invitaciones vencidas.

## Pendientes

- Crear QA real con una invitacion controlada en Azure.
- Implementar `GET /api/companies/me` usando `getCurrentCompanySession`.
- Implementar endpoint admin o herramienta controlada para generar invitaciones.
- Agregar rate limiting o mitigacion anti-fuerza bruta en `accept-invite`.
- Definir si se usara `CompanyInvites` manual, email real o ambos.
- Evaluar indice auxiliar para tokens/sesiones si el volumen crece.
- Agregar pruebas automatizadas con mocks para `companyAuth.js`.

## Siguiente tarea recomendada

Backend API:

```text
Implementar GET /api/companies/me usando api/shared/companyAuth.js para derivar companyId desde la cookie pe_company_session.
```

QA:

```text
Crear una invitacion controlada en Azure, probar accept-invite, validar Set-Cookie, logout y que no se devuelven secretos.
```

Infra Azure:

```text
Configurar de forma explicita AZURE_TABLE_COMPANY_INVITES, AZURE_TABLE_COMPANY_SESSIONS, COMPANY_SESSION_COOKIE_NAME, COMPANY_INVITE_TOKEN_TTL_MINUTES y COMPANY_SESSION_TTL_DAYS.
```

