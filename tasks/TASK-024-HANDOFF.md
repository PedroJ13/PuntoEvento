# TASK-024: QA Azure auth por invitacion con token real

## Estado

Bloqueada para el flujo completo.

No se pudo completar la prueba end-to-end con token real porque el entorno actual no tiene Azure CLI disponible ni credenciales locales de Table Storage para crear la invitacion controlada en `CompanyInvites`.

Se verificaron los endpoints publicos que no requieren crear invitacion real.

## Resultado general

Resultado parcial:

- `POST /api/company-auth/accept-invite` sin token responde correctamente `400`.
- `POST /api/company-auth/logout` sin cookie responde correctamente `200` y limpia `pe_company_session`.
- No se creo la entidad `CompanyInvites` requerida para `invite_qa_task_024`.
- No se pudo ejecutar `accept-invite` con token real.
- No se pudo validar una nueva entidad en `CompanySessions`.
- No se pudo validar revocacion de una sesion real despues de logout con cookie.

No se modifico codigo.
No se guardaron tokens reales, hashes, storage keys, connection strings ni secretos.

## Alcance leido

Se revisaron los documentos y codigo requeridos para la tarea:

- `tasks/TASK-024-assignment.md`
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
- `api/shared/companyAuth.js`
- `api/company-auth-accept-invite/index.js`
- `api/company-auth-logout/index.js`

## Ambiente

Base URL validada:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Empresa QA objetivo:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

RowKey objetivo de invitacion QA:

```text
invite_qa_task_024
```

## Requests ejecutados

### 1. accept-invite sin token

Request:

```text
POST /api/company-auth/accept-invite
Content-Type: application/json

{}
```

Resultado:

```text
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
```

Body:

```json
{
  "error": "token is required"
}
```

Conclusion:

```text
Cumple el esperado de TASK-024 para token requerido.
```

### 2. logout sin cookie

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

Body:

```json
{
  "ok": true
}
```

Header relevante observado, sin valor sensible:

```text
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
```

Conclusion:

```text
Cumple logout idempotente sin cookie y limpia cookie con Path=/api, Secure, SameSite=Lax y HttpOnly.
```

## Pruebas no ejecutadas por bloqueo

No se pudieron ejecutar:

- Crear invitacion controlada en `CompanyInvites`.
- `POST /api/company-auth/accept-invite` con token real.
- Validar `Set-Cookie` de sesion activa emitida por accept-invite.
- Validar invitacion `status: used`.
- Validar `usedAt` en la invitacion.
- Validar nueva entidad en `CompanySessions`.
- Validar que `CompanySessions` guarda `sessionHash` y no token plano.
- Reutilizar token usado.
- Logout con cookie real de sesion.
- Validar sesion `status: revoked`.

## Bloqueo tecnico

Se intento ubicar Azure CLI:

```text
Get-Command az
where.exe az
az --version
```

Resultado:

```text
az no esta instalado o no esta disponible en PATH.
```

Tambien se reviso si habia credenciales locales seguras para usar Table Storage sin CLI:

```text
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME
AzureWebJobsStorage
```

Resultado:

```text
No hay valores disponibles en el entorno local.
```

El paquete `api/package.json` declara `@azure/data-tables`, pero `api/node_modules` no esta instalado en el workspace actual. Aunque se instalaran dependencias, seguiria faltando una credencial valida para escribir en Table Storage.

## Validaciones de Table Storage

No ejecutadas.

Motivo:

```text
No hay Azure CLI ni credenciales de Storage disponibles para crear o consultar entidades reales.
```

Tablas objetivo segun TASK-023:

```text
CompanyInvites
CompanySessions
```

## Headers relevantes

Confirmado para logout sin cookie:

```text
Cookie: pe_company_session
Max-Age: 0
Path: /api
Secure: true
SameSite: lax
HttpOnly: true
```

Pendiente para accept-invite con token real:

```text
Set-Cookie de sesion activa pe_company_session=<redacted>
```

## Identificador de sesion

No aplica.

No se creo sesion real porque no se pudo crear la invitacion controlada ni aceptar token real.

## Riesgos

- El criterio principal de TASK-024 sigue sin validar: accept-invite con token real en Azure.
- Falta confirmar que Azure persiste `CompanySessions` con `sessionHash` y sin token plano.
- Falta confirmar que logout con cookie revoca la sesion correcta.
- El proyecto todavia no tiene una herramienta/admin endpoint seguro para generar invitaciones QA sin depender de acceso manual a Storage.
- El entorno de QA no es reproducible para tareas Azure si no incluye Azure CLI o un mecanismo documentado de credenciales temporales.

## Pendientes

- Ejecutar esta misma tarea desde un entorno con Azure CLI autenticado o con un mecanismo seguro temporal para Table Storage.
- Crear o actualizar la entidad `CompanyInvites` con `RowKey=invite_qa_task_024`.
- Ejecutar el flujo completo con token real sin registrar token, hash ni sesion completa en docs.
- Registrar solo evidencias sanitizadas: status codes, flags de cookie, RowKey de invitacion y session RowKey si Product/Architect lo considera seguro.

## Recomendacion para Product/Architect

No marcar TASK-024 como aprobada todavia.

Recomendacion:

```text
Provisionar un mecanismo de QA controlado para crear invitaciones reales sin exponer secretos.
```

Opciones sugeridas:

- Instalar y autenticar Azure CLI en el entorno donde se ejecuta QA.
- Crear un script operativo fuera del repo con credenciales temporales para insertar `CompanyInvites`.
- Implementar un endpoint/admin tool protegido para generar invitaciones QA, auditado y deshabilitable.

Una vez disponible ese mecanismo, repetir TASK-024 completa y reemplazar este handoff parcial con evidencia end-to-end sanitizada.
