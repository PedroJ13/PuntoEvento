# TASK-032: QA Azure auth con invitacion generada por internal endpoint

## Estado

Bloqueada para el flujo completo.

No se pudo generar una invitacion real porque el entorno actual no tiene credenciales admin disponibles (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). Tampoco hay Azure CLI ni credenciales locales de Table Storage para validar tablas.

Se ejecutaron y aprobaron los smokes Azure que no requieren secretos.

## Resultado general

Resultado parcial:

- `POST /api/internal/company-invites` sin auth responde `401 Unauthorized`.
- `POST /api/company-auth/accept-invite` sin token responde `400 token is required`.
- `POST /api/company-auth/logout` sin cookie responde `200 { "ok": true }` y limpia `pe_company_session`.
- No se creo invitacion real.
- No se ejecuto `accept-invite` con token real.
- No se observo `Set-Cookie` de sesion activa.
- No se probo reutilizacion de token usado.
- No se ejecuto logout con cookie real de sesion.
- No se validaron entidades en Table Storage.

No se documentaron tokens reales, hashes, cookies de sesion completas, storage keys, connection strings ni secretos.

## Requests ejecutados

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

### 1. POST /api/internal/company-invites sin auth

Request:

```text
POST /api/internal/company-invites
Content-Type: application/json

{}
```

Status:

```text
401 Unauthorized
```

Headers relevantes:

```text
Content-Type: application/json; charset=utf-8
WWW-Authenticate: Basic realm="Punto Evento Admin"
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Body:

```json
{
  "error": "Unauthorized"
}
```

Conclusion:

```text
La ruta interna desplegada llega al handler y Basic Auth bloquea correctamente sin credenciales.
```

### 2. POST /api/company-auth/accept-invite sin token

Request:

```text
POST /api/company-auth/accept-invite
Content-Type: application/json

{}
```

Status:

```text
400 Bad Request
```

Headers relevantes:

```text
Content-Type: application/json; charset=utf-8
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Body:

```json
{
  "error": "token is required"
}
```

Conclusion:

```text
El endpoint de accept-invite sigue desplegado y valida token requerido.
```

### 3. POST /api/company-auth/logout sin cookie

Request:

```text
POST /api/company-auth/logout
Content-Type: application/json

{}
```

Status:

```text
200 OK
```

Headers relevantes sanitizados:

```text
Content-Type: application/json; charset=utf-8
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Body:

```json
{
  "ok": true
}
```

Conclusion:

```text
Logout sigue operativo e idempotente sin cookie.
```

## Pruebas no ejecutadas por bloqueo

No se pudieron ejecutar:

- `POST /api/internal/company-invites` con Basic Auth admin.
- Creacion real de invitacion.
- Extraccion de token desde `inviteUrl`.
- `POST /api/company-auth/accept-invite` con token real.
- Validacion de `Set-Cookie` de sesion activa.
- Reutilizacion del token usado.
- Logout con cookie real.
- Validaciones de `CompanyInvites` y `CompanySessions` en Table Storage.

## inviteId creado

No aplica.

No se creo invitacion real porque no habia credenciales admin disponibles en el entorno.

## Validaciones de cookie

Validado:

```text
Logout sin cookie devuelve Set-Cookie de limpieza para pe_company_session.
```

Flags observados:

```text
max-age=0
domain=zealous-field-08fdd720f.7.azurestaticapps.net
path=/api
secure
samesite=lax
httponly
```

Pendiente:

```text
Set-Cookie de sesion activa emitida por accept-invite con token real.
```

## Validaciones de Table Storage

No ejecutadas.

Motivo:

```text
No hay Azure CLI en PATH ni variables locales de Azure Storage/Table disponibles.
```

Checks del entorno:

```text
where.exe az -> az no disponible
ADMIN_USERNAME / ADMIN_PASSWORD -> no disponibles
AZURE_STORAGE_CONNECTION_STRING / AZURE_TABLE_CONNECTION_STRING / AZURE_STORAGE_ACCOUNT_NAME / AzureWebJobsStorage -> no disponibles
```

Pendiente validar cuando haya acceso seguro:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe entidad nueva en `CompanySessions`.
- Sesion queda `status: active` antes de logout.
- Sesion queda `status: revoked` despues de logout.
- No se guarda token plano ni session token plano.

## Riesgos

- El criterio principal de TASK-032 sigue sin validarse: flujo real `internal/company-invites -> accept-invite -> cookie -> logout`.
- El endpoint interno esta vivo, pero aun falta probarlo con credenciales admin reales.
- Sin acceso a Table Storage, QA no puede confirmar persistencia ni ausencia de token plano en Azure.
- Basic Auth admin sigue siendo mecanismo temporal MVP.
- No hay rate limiting para generar ni aceptar invitaciones.
- El `inviteUrl` de una prueba real contiene token sensible y no debe pegarse en handoffs, chats, logs ni commits.

## Recomendacion para Product/Architect

No marcar TASK-032 como aprobada completa todavia.

Recomendacion:

```text
Ejecutar esta misma tarea desde un entorno QA con credenciales admin disponibles como variables de entorno seguras, o coordinar una sesion controlada donde QA pueda llamar POST /api/internal/company-invites sin revelar secretos.
```

Cuando existan credenciales admin:

1. Generar invitacion real con `POST /api/internal/company-invites`.
2. Guardar solo el `inviteId` en el handoff.
3. Usar el token del `inviteUrl` solo durante la prueba.
4. Validar `accept-invite`, cookie, reuso de token y logout.
5. Si hay acceso seguro a Table Storage, validar `CompanyInvites` y `CompanySessions`.
