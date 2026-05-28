# TASK-038: QA Azure GET companies me

## Estado

Completada.

## Resultado general

Resultado final:

- `GET /api/companies/me` sin cookie responde `401 Unauthorized`.
- `POST /api/internal/company-invites` sin auth responde `401 Unauthorized`, confirmando que la ruta interna sigue viva y protegida por Basic Auth.
- `POST /api/company-auth/logout` sin cookie responde `200 { "ok": true }` y limpia `pe_company_session`.
- `POST /api/internal/company-invites` con credencial admin controlada responde `201`.
- `POST /api/company-auth/accept-invite` con token real responde `200`.
- Reusar el token responde `400`.
- `GET /api/companies/me` con cookie real responde `200`.
- `POST /api/company-auth/logout` con cookie real responde `200`.
- `GET /api/companies/me` despues de logout responde `401`.

No se documentaron credenciales admin, inviteUrl completo, token real, cookie completa, hashes ni storage secrets.

## Resultado final con cookie real

Ejecucion controlada desde terminal local de Product/Owner:

```text
createInviteStatus=201
acceptInviteStatus=200
reuseTokenStatus=400
companiesMeStatus=200
logoutStatus=200
companiesMeAfterLogoutStatus=401
inviteId=invite_e842e21f-16c6-4d61-ab71-f5756dee9289
token=<redacted>
sessionCookie=<redacted>
```

Campos observados en `GET /api/companies/me`:

```text
id: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
slug: qa-company-register-test
name: QA Company Register Test
status: pending
plan: free
email: qa-company-register-test@example.com
forbiddenKeysPresent:
```

Conclusion:

```text
GET /api/companies/me queda validado en Azure con cookie real.
```

## Status codes

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

### 1. GET /api/companies/me sin cookie

Request:

```text
GET /api/companies/me
```

Resultado:

```text
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8
```

Body:

```json
{
  "error": "Unauthorized"
}
```

Conclusion:

```text
Aprobado. El endpoint esta desplegado y exige sesion.
```

### 2. POST /api/internal/company-invites sin auth

Request:

```text
POST /api/internal/company-invites
Content-Type: application/json

{}
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
Control aprobado. El endpoint interno sigue disponible y protegido.
```

### 3. POST /api/company-auth/logout sin cookie

Request:

```text
POST /api/company-auth/logout
Content-Type: application/json

{}
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

Header relevante sanitizado:

```text
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
Control aprobado. Logout sigue idempotente y limpia cookie.
```

## inviteId usado

```text
invite_e842e21f-16c6-4d61-ab71-f5756dee9289
```

## Campos presentes en response 200

Presentes:

- `id`
- `slug`
- `name`
- `status`
- `plan`
- `email`

## Confirmacion de ausencia de metadatos internos

Validada en Azure con cookie real.

El resultado reporto:

```text
forbiddenKeysPresent:
```

No se observaron:

- `partitionKey`
- `rowKey`
- `etag`
- `timestamp`
- `tokenHash`
- `sessionHash`
- cookies
- metadata interna

## Resultado despues de logout

Validado con cookie real:

```text
logoutStatus=200
companiesMeAfterLogoutStatus=401
```

## Riesgos

- Sigue pendiente rotar `ADMIN_PASSWORD` si el temporal fue expuesto en pruebas previas, como indica el backlog.
- Sigue pendiente remover el endpoint temporal `internal/auth-diagnostics`.

## Recomendacion para Product/Architect

Aprobar TASK-038.

Siguiente recomendacion:

```text
Rotar ADMIN_PASSWORD y remover el endpoint temporal /api/internal/auth-diagnostics.
```
