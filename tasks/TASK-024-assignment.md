# TASK-024: QA Azure auth por invitacion con token real

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-024-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-024-HANDOFF.md`.
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
- `tasks/TASK-021-HANDOFF.md`
- `tasks/TASK-022-HANDOFF.md`
- `tasks/TASK-023-HANDOFF.md`

Codigo relevante:

- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`

## Objetivo

Validar en Azure el flujo real de autenticacion por invitacion:

```text
Crear invitacion controlada
-> aceptar invitacion con token real
-> recibir cookie de sesion
-> confirmar sesion persistida
-> logout con cookie
-> confirmar sesion revocada
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

Tablas:

```text
CompanyInvites
CompanySessions
```

## Preparacion de invitacion controlada

Generar token y hash localmente. No guardar el token real en Git, docs ni handoff.

Ejemplo:

```powershell
@'
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("base64url");
const tokenHash = crypto.createHash("sha256").update(token, "utf8").digest("hex");
console.log(JSON.stringify({ token, tokenHash }, null, 2));
'@ | node
```

Crear entidad en `CompanyInvites` con:

```json
{
  "PartitionKey": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "RowKey": "invite_qa_task_024",
  "tokenHash": "<hash-generado>",
  "email": "qa-company-register-test@example.com",
  "role": "company_owner",
  "status": "active",
  "expiresAt": "<fecha futura ISO>",
  "usedAt": "",
  "createdAt": "<fecha actual ISO>",
  "updatedAt": "<fecha actual ISO>"
}
```

Importante:

- El handoff puede incluir el `RowKey`.
- El handoff no debe incluir el token real.
- El handoff no debe incluir storage keys, connection strings ni secretos.

## Pruebas requeridas

### 1. accept-invite sin token

```text
POST /api/company-auth/accept-invite
{}
```

Esperado:

```text
400 token is required
```

### 2. accept-invite con token real

```text
POST /api/company-auth/accept-invite
{ "token": "<token-real>" }
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

Header esperado:

```text
Set-Cookie: pe_company_session=<session>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

Validar en Azure Table Storage:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe entidad nueva en `CompanySessions`.
- Sesion queda `status: active`.
- Tabla no guarda session token plano, solo `sessionHash`.

### 3. reutilizar token usado

Volver a llamar `accept-invite` con el mismo token.

Esperado:

```text
400
```

Puede responder:

```text
Invitation is not active
```

o:

```text
Invitation was already used
```

Ambos son aceptables por ahora, segun observacion P3 de TASK-022.

### 4. logout con cookie

Llamar:

```text
POST /api/company-auth/logout
```

usando la cookie recibida.

Esperado:

```text
200 { "ok": true }
```

Header esperado:

```text
Set-Cookie: pe_company_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/api
```

Validar en Table Storage:

- Sesion queda `status: revoked`.

### 5. logout sin cookie

Esperado:

```text
200 { "ok": true }
```

## Fuera de alcance

- No probar `GET /api/companies/me`; todavia no existe.
- No probar CRUD de servicios.
- No probar UI del panel.
- No borrar empresas QA.
- No publicar empresas.

## Criterios de aceptacion

- `accept-invite` con token real devuelve `200`.
- `Set-Cookie` de sesion se observa en Azure.
- Invitacion queda usada.
- Sesion queda activa.
- Reuso del token falla.
- Logout revoca sesion y limpia cookie.
- No se exponen token, hashes ni secretos en responses/handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-024-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Requests ejecutados.
- Status codes.
- Headers relevantes sin incluir token/session completo.
- RowKey de invitacion QA.
- Identificador de sesion si es seguro reportarlo; si no, describirlo sin secreto.
- Validaciones de Table Storage.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-024. Product/Architect debe leer `tasks/TASK-024-HANDOFF.md`.
```
