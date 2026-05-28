# TASK-058 HANDOFF - QA/Infra Azure smoke POST /api/uploads/sign

## Objetivo

Validar en Azure real el endpoint:

```text
POST /api/uploads/sign
```

usando una sesion real de empresa, Storage real y cookie real.

## Resultado general

Aprobado.

El smoke completo paso contra Azure real.

## URL base probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-057-HANDOFF.md`
- `api/uploads-sign/index.js`
- `api/company-services-create/index.js`
- `api/company-services-list/index.js`
- `api/shared/adminAuth.js`

## Archivos tocados

- `tasks/TASK-058-HANDOFF.md`

No se cambio codigo de aplicacion.

## Credenciales

Se cargo el archivo local git-ignored:

```powershell
. .\local-secrets\qa-admin.ps1
$u = [bool]$env:ADMIN_USERNAME
$p = [bool]$env:ADMIN_PASSWORD
"ADMIN_USERNAME_SET=$u"
"ADMIN_PASSWORD_SET=$p"
```

Resultado:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se registraron valores reales de usuario, password, token de invitacion, cookie ni SAS.

## Status codes obtenidos

| Caso | Status |
| --- | --- |
| `POST /api/uploads/sign` sin cookie | `401` |
| Crear invitacion real con `POST /api/internal/company-invites` | `201` |
| Aceptar invitacion con `POST /api/company-auth/accept-invite` | `200` |
| Listar servicios con cookie | `200` |
| `POST /api/uploads/sign` con `scope=company` valido | `200` |
| PUT de blob pequeno usando `uploadUrl` | `201` |
| `POST /api/uploads/sign` con `scope=service` valido | `200` |
| `scope=service` con servicio inexistente | `404` |
| MIME no permitido | `415` |
| Archivo mayor a 5 MB | `413` |
| Logout | `200` |
| `POST /api/uploads/sign` despues de logout | `401` |

## IDs de upload creados

```text
scope=company: upload_2649baf2-269f-4f01-b688-84a37b8b7986
scope=service: upload_7a76df0b-3d5d-4488-b694-92368f437469
```

Servicio usado para `scope=service`:

```text
service_e10ac0b1-7751-4063-af66-cf3da2eacca1
```

## Confirmacion de upload real pequeno

Confirmado.

Se hizo un `PUT` real a Azure Blob Storage usando el `uploadUrl` firmado para `scope=company`, con `Content-Type: image/png` y header `x-ms-blob-type: BlockBlob`.

Resultado:

```text
201
```

El SAS completo y el `pendingBlobUrl` no se registraron en este handoff.

## Confirmacion de respuesta exitosa

Las respuestas exitosas de `POST /api/uploads/sign` incluyeron:

- `uploadId`
- `uploadUrl`
- `pendingBlobUrl`
- `expiresInMinutes`

Tambien se valido que las respuestas revisadas no expusieran:

- connection strings
- account keys
- cookie de sesion
- `sessionHash`
- `tokenHash`
- `partitionKey`
- `rowKey`
- `pendingBlobName`
- metadata interna de Storage/Table

## Observaciones

- El primer intento de creacion de invitacion con header `Authorization` devolvio `401`; el smoke aprobado uso el header esperado por pruebas previas y por `api/shared/adminAuth.js`: `X-Punto-Admin-Credential`.
- No fue necesario crear un servicio nuevo; se reutilizo un servicio existente de la empresa QA.
- El blob pequeno queda en contenedor pendiente porque no existe todavia flujo de confirmacion/publicacion para este nuevo endpoint.

## Riesgos restantes

- No se valido registro de upload completado, publicacion ni movimiento a contenedor publico; estan fuera de alcance de TASK-058.
- Las reservas `Uploads` y blobs pendientes creados por QA quedan persistidos hasta que exista limpieza automatica o proceso manual.
- El `uploadUrl` es un SAS temporal de escritura y debe seguir tratandose como secreto en logs de cliente, telemetria y soporte.
- Sigue pendiente cerrar la estrategia de expiracion/limpieza para reservas y blobs pendientes.

## Recomendacion

Seguir con la implementacion del flujo de confirmacion/registro de upload completado, incluyendo validacion real del blob subido, cambio de estado de reserva y estrategia de limpieza de reservas expiradas.
