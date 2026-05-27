# TASK-034: Sesion controlada para probar invitacion real

## Equipo encargado

Infra Azure con apoyo de Product/Owner.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-034-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-034-HANDOFF.md`.
```

## Objetivo

Ejecutar el flujo real de invitacion usando credenciales admin disponibles de forma segura, sin pegarlas en chat, docs, handoffs ni commits.

## Contexto

TASK-032 y TASK-033 quedaron bloqueadas porque los entornos de QA/Infra no tienen:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Azure CLI
- Credenciales de Table Storage

Los endpoints ya estan vivos:

```text
POST /api/internal/company-invites -> 401 sin auth
POST /api/company-auth/accept-invite -> 400 sin token
POST /api/company-auth/logout -> 200 sin cookie
```

## Requisito principal

No escribir secretos en ningun archivo ni mensaje.

No pegar:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Authorization header completo.
- `inviteUrl` completo.
- Token real.
- Cookie completa.
- Storage keys.
- Connection strings.

## Opcion A recomendada: variables de entorno temporales

En una terminal local controlada, Product/Owner o Infra carga credenciales solo como variables de entorno.

PowerShell:

```powershell
$env:ADMIN_USERNAME = "<valor-real>"
$env:ADMIN_PASSWORD = "<valor-real>"
```

Despues ejecutar el flujo con un script temporal fuera del repo, o comandos manuales que no impriman secretos.

Al terminar:

```powershell
Remove-Item Env:\ADMIN_USERNAME
Remove-Item Env:\ADMIN_PASSWORD
```

## Opcion B: sesion pareada

Product/Owner comparte pantalla o ejecuta localmente los comandos bajo guia de Infra/QA.

Regla:

```text
Los secretos se escriben solo en la terminal local del owner, nunca en el chat.
```

## Flujo a ejecutar

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Empresa QA:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
```

### 1. Generar invitacion

```text
POST /api/internal/company-invites
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

Guardar para handoff solo:

- `inviteId`
- `companyId`
- `email`
- `role`
- `expiresAt`

No guardar `inviteUrl` completo.

### 2. Aceptar invitacion

Extraer el token de `inviteUrl` solo en memoria.

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

### 4. Logout con cookie

Esperado:

```text
200 { "ok": true }
Set-Cookie: pe_company_session=; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Path=/api
```

## Validacion opcional de Table Storage

Solo si Infra tiene acceso seguro:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe sesion en `CompanySessions`.
- Sesion queda `revoked` despues de logout.
- No hay token plano ni session token plano.

## Handoff requerido

Crear:

```text
tasks/TASK-034-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Opcion usada: variables temporales o sesion pareada.
- Status codes.
- `inviteId` creado.
- Flags de cookie observados, sin valor completo.
- Resultado de reuso de token.
- Resultado de logout.
- Validacion de Table Storage si aplica.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-034. Product/Architect debe leer `tasks/TASK-034-HANDOFF.md`.
```
