# TASK-032: QA Azure auth con invitacion generada por internal endpoint

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-032-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-032-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-024-HANDOFF.md`
- `tasks/TASK-031-HANDOFF.md`

Codigo relevante:

- `api/internal-company-invites/index.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`

## Objetivo

Repetir y completar la validacion Azure de auth por invitacion, ahora usando el endpoint interno desplegado:

```text
POST /api/internal/company-invites
```

Flujo:

```text
generar invitacion controlada
-> aceptar invitacion con token real
-> recibir cookie de sesion
-> confirmar sesion/invitacion en Table Storage si el entorno lo permite
-> reutilizar token usado y esperar fallo
-> logout con cookie
```

## Ambiente

URL base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Empresa QA existente:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Pruebas requeridas

### 1. Generar invitacion con endpoint interno

Request:

```text
POST /api/internal/company-invites
Authorization: Basic <admin>
Content-Type: application/json
```

Body:

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com"
}
```

Esperado:

```text
201
```

Body esperado:

```json
{
  "inviteId": "invite_...",
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner",
  "expiresAt": "...",
  "inviteUrl": "https://.../panel.html?invite=..."
}
```

Importante:

- No pegar `inviteUrl` completo en handoff.
- No pegar token real.
- Si se reporta header/body, sanitizar token.

### 2. accept-invite con token real

Extraer el token desde `inviteUrl` solo para la prueba.

Request:

```text
POST /api/company-auth/accept-invite
Content-Type: application/json
```

Body:

```json
{
  "token": "<token-real>"
}
```

Esperado:

```text
200
```

Body:

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner"
}
```

Header:

```text
Set-Cookie: pe_company_session=<redacted>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

### 3. Reusar token

Volver a llamar `accept-invite` con el mismo token.

Esperado:

```text
400
```

Mensajes aceptables:

```text
Invitation is not active
Invitation was already used
```

### 4. Logout con cookie

Usar la cookie recibida por `accept-invite`.

Request:

```text
POST /api/company-auth/logout
```

Esperado:

```text
200 { "ok": true }
```

Header:

```text
Set-Cookie: pe_company_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/api
```

### 5. Logout sin cookie

Esperado:

```text
200 { "ok": true }
```

## Validaciones de Table Storage

Si QA tiene acceso seguro:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe entidad nueva en `CompanySessions`.
- Sesion queda `status: active` antes de logout.
- Sesion queda `status: revoked` despues de logout.
- No se guarda token plano ni session token plano.

Si QA no tiene acceso a Table Storage:

- Documentar bloqueo parcial.
- La prueba HTTP sigue siendo valiosa si `accept-invite` y `logout` pasan.

## Fuera de alcance

- No probar `GET /api/companies/me`; todavia no existe.
- No probar CRUD de servicios.
- No probar UI del panel.
- No borrar empresas QA.
- No publicar empresas.
- No documentar tokens reales.

## Criterios de aceptacion

- `internal/company-invites` crea invitacion con `201`.
- `accept-invite` con token real devuelve `200`.
- `Set-Cookie` de sesion se observa.
- Reuso de token falla.
- Logout con cookie devuelve `200` y limpia cookie.
- No se exponen token, hashes ni secretos en handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-032-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Requests ejecutados.
- Status codes.
- Headers relevantes sanitizados.
- `inviteId` creado.
- Validaciones de cookie.
- Validaciones de Table Storage si se pudieron hacer.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-032. Product/Architect debe leer `tasks/TASK-032-HANDOFF.md`.
```
