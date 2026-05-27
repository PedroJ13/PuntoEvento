# TASK-025: Backend endpoint admin para generar invitaciones

## Estado

Completada.

## Resultado general

Se implemento un endpoint admin protegido para generar invitaciones reales de empresa sin depender de Azure CLI manual ni secretos locales.

Endpoint nuevo:

```text
POST /api/admin/company-invites
```

Azure Function agregada:

```text
api/admin-company-invites
```

El endpoint:

- Usa Basic Auth admin existente.
- Aplica validacion de origin con `enforceAllowedOrigin`.
- Valida `companyId` requerido.
- Verifica que la empresa exista en `Companies`.
- Usa email enviado o, si falta, el email de la empresa.
- Crea invitacion `active` en `CompanyInvites`.
- Guarda solo `tokenHash`.
- Devuelve `inviteUrl` con el token solo en la response autenticada.
- No devuelve `tokenHash`, connection strings ni secretos.

No se toco pagina publica, `panel.html`, UI admin ni `accept-invite`.

## Archivos modificados

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `tasks/TASK-025-HANDOFF.md`

## Contrato implementado

### Request

```text
POST /api/admin/company-invites
Authorization: Basic <admin>
Content-Type: application/json
```

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com"
}
```

Reglas:

- `companyId` es requerido.
- `email` es opcional si la empresa tiene email en `Companies`.
- `role` queda fijo como `company_owner`.

### Response 201

```json
{
  "inviteId": "invite_<uuid>",
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner",
  "expiresAt": "2026-05-28T00:00:00.000Z",
  "inviteUrl": "https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html?invite=<token>"
}
```

Persistencia en `CompanyInvites`:

```text
partitionKey: companyId
rowKey: invite_<uuid>
id: invite_<uuid>
tokenHash: <sha256>
email: <email>
role: company_owner
status: active
expiresAt: <ISO futuro>
usedAt: ""
createdAt: <ISO actual>
updatedAt: <ISO actual>
```

El token plano no se persiste.

### Errores esperados

```text
401 Unauthorized
```

Sin Basic Auth admin o con credenciales invalidas.

```text
400 companyId is required
```

Si falta `companyId`.

```text
404 Company not found
```

Si no existe entidad en `Companies` con:

```text
PartitionKey: company
RowKey: <companyId>
```

```text
400 email is required
```

Si no viene email en request y la empresa tampoco tiene email.

```text
403 Forbidden
```

Si `Origin` o `Referer` no esta permitido por `ALLOWED_ORIGINS`.

## Config usada

El endpoint usa:

```text
APP_PUBLIC_URL
COMPANY_INVITE_TOKEN_TTL_MINUTES
AZURE_TABLE_COMPANY_INVITES
AZURE_TABLE_COMPANIES
ADMIN_USERNAME
ADMIN_PASSWORD
ALLOWED_ORIGINS
AZURE_STORAGE_CONNECTION_STRING
AZURE_TABLE_CONNECTION_STRING
```

Fallback de `APP_PUBLIC_URL`:

```text
/panel.html?invite=<token>
```

Si `APP_PUBLIC_URL` esta configurado, se usa URL absoluta:

```text
<APP_PUBLIC_URL>/panel.html?invite=<token>
```

## Verificacion

### Sintaxis JS

Comando:

```text
node --check api/admin-company-invites/index.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

### Validacion estructural con mocks

Se ejecuto el handler con mocks de Azure Table Storage para evitar depender de credenciales locales.

Resultado:

```json
{
  "noAuth": {
    "status": 401,
    "hasWwwAuthenticate": true
  },
  "missingCompany": {
    "status": 404,
    "body": {
      "error": "Company not found"
    }
  },
  "ok": {
    "status": 201,
    "bodyKeys": [
      "companyId",
      "email",
      "expiresAt",
      "inviteId",
      "inviteUrl",
      "role"
    ],
    "hasInviteUrl": true,
    "responseHasTokenHash": false,
    "persistedInviteCount": 1,
    "persistedHasTokenHash": true,
    "persistedHasPlainToken": false,
    "persistedStatus": "active",
    "persistedRole": "company_owner"
  }
}
```

## Como probar local o estructuralmente

Prerequisitos para prueba local real:

- `api/node_modules` instalado.
- Variables de Storage/Table configuradas.
- `ADMIN_USERNAME` y `ADMIN_PASSWORD` configurados.

Ejemplo local:

```powershell
$pair = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$env:ADMIN_USERNAME`:$env:ADMIN_PASSWORD"))

Invoke-RestMethod `
  -Method Post `
  -Uri 'http://localhost:7071/api/admin/company-invites' `
  -Headers @{ Authorization = "Basic $pair" } `
  -ContentType 'application/json' `
  -Body '{"companyId":"company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2","email":"qa-company-register-test@example.com"}'
```

Validar:

- Response `201`.
- Body incluye `inviteUrl`.
- Body no incluye `tokenHash`.
- `CompanyInvites` tiene entidad `active`.
- Entidad tiene `tokenHash`.
- Entidad no tiene token plano.

## Como QA debe usarlo para repetir TASK-024

Despues de deploy:

1. Llamar `POST /api/admin/company-invites` con Basic Auth admin.
2. Usar el `inviteUrl` devuelto o extraer el token del query param `invite`.
3. Ejecutar `POST /api/company-auth/accept-invite` con:

```json
{
  "token": "<token-recibido-del-inviteUrl>"
}
```

4. Validar:

- Response `200`.
- `Set-Cookie` contiene `pe_company_session` con `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/api`.
- Invitacion cambia a `status: used`.
- Invitacion tiene `usedAt`.
- Existe sesion nueva en `CompanySessions`.
- Sesion queda `status: active`.
- Sesion guarda `sessionHash` y no token plano.

5. Reusar el mismo token y esperar `400`.
6. Ejecutar logout con cookie y validar `status: revoked`.
7. Ejecutar logout sin cookie y esperar `200 { "ok": true }`.

Importante:

```text
No guardar el inviteUrl real ni el token real en docs, handoffs ni commits.
```

## Riesgos

- El endpoint genera tokens reales y devuelve `inviteUrl`; debe usarse solo con Basic Auth admin y HTTPS.
- Basic Auth admin sigue siendo una solucion MVP interna, no un sistema admin definitivo.
- No hay rate limiting para este endpoint admin ni para `accept-invite`.
- La generacion de invitaciones no registra auditoria de quien la creo.
- Si `APP_PUBLIC_URL` falta, la response devuelve URL relativa. Esto sirve como fallback, pero QA en Azure deberia confirmar que el setting existe.
- La busqueda de invitaciones por `tokenHash` en `accept-invite` sigue sin indice auxiliar; aceptable para MVP cerrado, pero no escala bien.

## Siguiente tarea recomendada

Infra:

```text
Deploy de TASK-025 y smoke de POST /api/admin/company-invites sin exponer credenciales ni tokens reales.
```

QA:

```text
Repetir TASK-024 usando el endpoint admin para generar la invitacion controlada.
```

Backend:

```text
Implementar GET /api/companies/me usando la cookie pe_company_session y getCurrentCompanySession().
```
