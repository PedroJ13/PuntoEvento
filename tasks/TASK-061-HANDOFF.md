# TASK-061 HANDOFF - QA/Infra Azure smoke POST /api/uploads/confirm

## Resultado general

Aprobado.

El smoke completo de `POST /api/uploads/confirm` paso contra Azure real con cookie real, reserva real en `Uploads`, SAS real y blob real en `uploads-pending`.

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
- `tasks/TASK-058-HANDOFF.md`
- `tasks/TASK-060-HANDOFF.md`
- `api/uploads-sign/index.js`
- `api/uploads-confirm/index.js`

## Archivos tocados

- `tasks/TASK-061-HANDOFF.md`

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
| `POST /api/uploads/confirm` sin cookie | `401` |
| Crear invitacion real con `POST /api/internal/company-invites` | `201` |
| Aceptar invitacion con `POST /api/company-auth/accept-invite` | `200` |
| Crear reserva valida con `POST /api/uploads/sign` | `200` |
| PUT de blob pequeno valido usando `uploadUrl` | `201` |
| Confirmacion valida con `POST /api/uploads/confirm` | `201` |
| Confirmacion repetida del mismo upload | `200` |
| Upload inexistente | `404` |
| Crear reserva para blob ausente con `POST /api/uploads/sign` | `200` |
| Confirmar reserva sin blob subido | `404` |
| Crear reserva para MIME mismatch con `POST /api/uploads/sign` | `200` |
| PUT de blob con MIME diferente al reservado | `201` |
| Confirmar MIME real diferente al reservado | `400` |
| Logout | `200` |
| Confirmar despues de logout | `401` |

## Upload confirmado

```text
upload_bcacdadb-3515-49e1-a8c4-b4050da97fd1
```

Uploads adicionales creados para negativos:

```text
blob ausente: upload_f029d120-4092-4a65-a054-b3da69b61119
mime mismatch: upload_d7ce355a-c109-4a2c-b73e-93872a78a6af
```

## Confirmacion de blob real subido

Confirmado.

Se hizo un `PUT` real a Azure Blob Storage usando el `uploadUrl` firmado para la reserva valida, con:

```text
Content-Type: image/png
x-ms-blob-type: BlockBlob
```

Resultado:

```text
201
```

Luego `POST /api/uploads/confirm` sobre ese `uploadId` respondio `201` y la confirmacion repetida respondio `200`.

## Confirmacion de respuesta

La respuesta exitosa de confirmacion incluyo:

- `uploadId`
- `status: pending`
- `scope`
- `serviceId`
- `imageType`
- `pendingBlobUrl`

Se valido que las respuestas revisadas no expusieran:

- connection strings
- account keys
- cookies
- hashes
- `partitionKey`
- `rowKey`
- `pendingBlobName`
- metadata interna de Storage/Table

## Observaciones

- El caso de MIME real diferente al reservado respondio `400`, que esta dentro del contrato esperado.
- El endpoint confirma y deja el upload en `pending`; no publica ni asocia la imagen a `coverUrl`, `logoUrl` o `gallery`, conforme al alcance.
- Las reservas y blobs pendientes generados por QA quedan persistidos hasta que exista limpieza automatica o proceso manual.

## Riesgos restantes

- No hay limpieza automatica de reservas/blobs pendientes usados en QA.
- Falta implementar el flujo de aprobacion/rechazo que publique o rechace uploads `pending`.
- `pendingBlobUrl` sigue apuntando a contenedor pendiente; no debe usarse como URL publica final.
- La rotacion de credenciales admin sigue pendiente segun backlog cuando cierre la ventana de pruebas controladas.

## Recomendacion

Seguir con el endpoint/flujo de aprobar o rechazar empresa/servicio e imagenes pendientes. No se requiere correccion previa para `POST /api/uploads/confirm`.
