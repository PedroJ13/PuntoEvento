# TASK-033: Infra habilitar prueba real de invitacion con credenciales admin

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-033-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-033-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-031-HANDOFF.md`
- `tasks/TASK-032-HANDOFF.md`

Codigo relevante:

- `api/internal-company-invites/index.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`

## Objetivo

Desbloquear la prueba real de autenticacion por invitacion en Azure sin exponer credenciales admin, tokens, cookies ni storage secrets.

TASK-032 quedo bloqueada porque QA no tenia:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Azure CLI
- credenciales Table Storage

## Opcion recomendada

Infra ejecuta el flujo completo controlado y deja evidencia sanitizada en handoff.

Flujo:

```text
POST /api/internal/company-invites con Basic Auth admin
-> extraer token del inviteUrl solo en memoria
-> POST /api/company-auth/accept-invite con token real
-> capturar cookie en cookie jar local
-> reusar token y confirmar fallo
-> POST /api/company-auth/logout con cookie
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

### 1. Generar invitacion real

```text
POST /api/internal/company-invites
Authorization: Basic <admin>
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

Handoff puede reportar:

- `inviteId`
- `companyId`
- `email`
- `role`
- `expiresAt`

Handoff no debe reportar:

- `inviteUrl` completo
- token
- Authorization header
- credenciales admin

### 2. Aceptar invitacion

Usar el token del `inviteUrl` solo durante la prueba.

```text
POST /api/company-auth/accept-invite
```

Esperado:

```text
200
Set-Cookie: pe_company_session=<redacted>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

### 3. Reusar token

Esperado:

```text
400
```

Mensaje aceptable:

```text
Invitation is not active
```

o:

```text
Invitation was already used
```

### 4. Logout con cookie

Usar cookie jar local, sin pegar la cookie en handoff.

Esperado:

```text
200 { "ok": true }
Set-Cookie: pe_company_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/api
```

### 5. Validacion Table Storage si es posible

Si Infra tiene acceso seguro:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe sesion en `CompanySessions`.
- Sesion queda `revoked` despues de logout.
- No hay token plano ni session token plano.

## Alternativa aceptable

Si Infra prefiere no ejecutar QA funcional:

Provisionar a QA un mecanismo seguro temporal para ejecutar TASK-032 completa, por ejemplo:

- Variables de entorno efimeras en un entorno controlado.
- Sesion pareada sin escribir credenciales en handoffs.
- Script operacional fuera del repo.

No guardar secretos en Git ni documentos.

## Fuera de alcance

- No cambiar codigo.
- No imprimir credenciales, tokens ni cookies completas.
- No borrar empresas QA.
- No publicar empresas.
- No implementar `GET /api/companies/me`.

## Criterios de aceptacion

- Se ejecuta el flujo completo o se habilita a QA para ejecutarlo.
- No se exponen secretos en handoff.
- Si Infra ejecuta el flujo, queda evidencia sanitizada de status codes y flags de cookie.
- Si se valida Storage, queda evidencia sanitizada de estados.

## Handoff requerido

Crear:

```text
tasks/TASK-033-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Opcion usada: Infra ejecuto flujo o habilito QA.
- Requests ejecutados, con datos sensibles sanitizados.
- Status codes.
- `inviteId` creado.
- Validacion de cookie sin valor completo.
- Validacion de Table Storage si aplica.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-033. Product/Architect debe leer `tasks/TASK-033-HANDOFF.md`.
```
