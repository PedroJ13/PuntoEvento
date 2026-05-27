# TASK-033: Infra habilitar prueba real de invitacion con credenciales admin

## Estado

Bloqueada para ejecucion completa.

## Resultado general

No se pudo ejecutar el flujo real de invitacion porque este entorno no tiene disponibles:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Azure CLI
- Credenciales locales de Azure Storage/Table Storage

Se ejecutaron smokes Azure sin secretos para confirmar que los endpoints necesarios siguen vivos:

- `POST /api/internal/company-invites` sin auth responde `401`.
- `POST /api/company-auth/accept-invite` sin token responde `400`.
- `POST /api/company-auth/logout` sin cookie responde `200` y limpia cookie.

No se crearon invitaciones reales.
No se usaron credenciales admin.
No se capturaron tokens reales.
No se imprimieron cookies de sesion completas.
No se validaron tablas.

## Opcion usada

Opcion intentada:

```text
Infra ejecuta flujo completo controlado.
```

Resultado:

```text
No ejecutable desde este entorno por falta de credenciales admin y herramientas Azure.
```

Opcion recomendada para desbloquear:

```text
Habilitar una sesion controlada o entorno temporal donde ADMIN_USERNAME y ADMIN_PASSWORD existan como variables de entorno seguras, sin pegarlas en chat ni escribirlas en archivos.
```

## Entorno revisado

Checks ejecutados:

```text
ADMIN_USERNAME / ADMIN_PASSWORD
AZURE_STORAGE_CONNECTION_STRING
AZURE_TABLE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME
AzureWebJobsStorage
where.exe az
az --version
```

Resultado:

```text
No hay credenciales admin ni Storage disponibles.
Azure CLI no esta instalada o no esta en PATH, incluso fuera del sandbox.
```

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
La ruta interna esta desplegada y Basic Auth bloquea correctamente sin credenciales.
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
El endpoint accept-invite esta desplegado y valida token requerido.
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
Logout esta desplegado, es idempotente sin cookie y emite cookie de limpieza.
```

## Requests no ejecutados

No se ejecutaron por falta de credenciales admin:

- `POST /api/internal/company-invites` con Basic Auth admin.
- `POST /api/company-auth/accept-invite` con token real.
- Reuso del token real.
- `POST /api/company-auth/logout` con cookie real.

## inviteId creado

No aplica.

No se creo invitacion real.

## Validacion de cookie

Validado:

```text
Logout sin cookie limpia pe_company_session.
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

## Validacion de Table Storage

No ejecutada.

Motivo:

```text
No hay Azure CLI ni credenciales locales de Table Storage disponibles.
```

Pendiente validar cuando haya acceso seguro:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe sesion en `CompanySessions`.
- Sesion queda `revoked` despues de logout.
- No hay token plano ni session token plano.

## Riesgos

- El flujo real `internal/company-invites -> accept-invite -> logout` sigue sin validarse end-to-end.
- QA sigue bloqueado si no recibe un mecanismo seguro para usar credenciales admin.
- Sin acceso a Table Storage, no se puede confirmar persistencia ni ausencia de tokens planos.
- Basic Auth admin es mecanismo temporal MVP.
- No hay rate limiting para generar o aceptar invitaciones.
- El `inviteUrl` real contiene token sensible y no debe aparecer en handoffs, logs, chats ni commits.

## Recomendacion para Product/Architect

No marcar TASK-033 como completada funcionalmente.

Recomendacion concreta:

```text
Ejecutar una sesion controlada con credenciales admin cargadas como variables de entorno temporales, o crear un entorno QA efimero donde Infra/QA pueda correr el flujo sin escribir secretos en el repo ni en el chat.
```

Script operativo recomendado, fuera del repo:

```text
1. Leer ADMIN_USERNAME y ADMIN_PASSWORD desde variables de entorno.
2. Llamar POST /api/internal/company-invites.
3. Mantener inviteUrl/token solo en memoria.
4. Llamar POST /api/company-auth/accept-invite.
5. Guardar cookie en cookie jar temporal.
6. Reusar token y confirmar 400.
7. Llamar POST /api/company-auth/logout con cookie.
8. Borrar cookie jar temporal.
9. Reportar solo status codes, inviteId y flags de cookie sanitizados.
```

Cuando exista esa ejecucion, repetir TASK-032 o reemplazar este handoff con evidencia completa sanitizada.
