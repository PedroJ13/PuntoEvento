# TASK-061: QA/Infra Azure smoke de POST uploads confirm

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya paso QA local/estructural:

```text
POST /api/uploads/confirm
```

Despues del commit/push/deploy, falta validar el endpoint contra Azure real con cookie real, SAS real, blob real y reserva real en `Uploads`.

## Precondicion

Product/Architect/User debe haber commiteado y pusheado el bloque `POST /api/uploads/confirm` antes de ejecutar este smoke.

Cargar credenciales admin desde archivo local git-ignored:

```powershell
. .\local-secrets\qa-admin.ps1
$u = [bool]$env:ADMIN_USERNAME
$p = [bool]$env:ADMIN_PASSWORD
"ADMIN_USERNAME_SET=$u"
"ADMIN_PASSWORD_SET=$p"
```

Debe dar:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No escribir valores reales en el handoff.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-058-HANDOFF.md`
- `tasks/TASK-060-HANDOFF.md`
- `api/uploads-sign/index.js`
- `api/uploads-confirm/index.js`

## Objetivo

Validar en Azure real:

```text
POST /api/uploads/confirm
```

usando una sesion real de empresa y un blob real subido a `uploads-pending`.

## URL base

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Empresa QA objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Alcance de pruebas

Validar:

- Crear invitacion real y aceptar invitacion para obtener cookie.
- Crear una reserva con `POST /api/uploads/sign`.
- Subir un blob pequeno real con el `uploadUrl`.
- Confirmar con `POST /api/uploads/confirm`.
- Confirmacion valida responde `201`.
- Confirmacion repetida responde `200`.
- Response contiene `uploadId`, `status: pending`, `scope`, `serviceId`, `imageType`, `pendingBlobUrl`.
- Response no expone connection strings, account keys, cookies, hashes, `partitionKey`, `rowKey`, `pendingBlobName` ni metadata interna.
- `POST /api/uploads/confirm` sin cookie responde `401`.
- Upload inexistente responde `404`.
- Blob ausente o no subido responde `404`.
- MIME real diferente al reservado responde `400` o error controlado segun contrato.
- Logout invalida la cookie.
- Luego del logout, `POST /api/uploads/confirm` responde `401`.

## Fuera de alcance

- No publicar imagen.
- No mover a contenedor publico.
- No asociar imagen a `coverUrl`, `logoUrl` o `gallery`.
- No limpiar reservas/blobs pendientes.
- No guardar secretos, cookies ni SAS completos en el handoff.

## Entregable

Crear:

```text
tasks/TASK-061-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base probada.
- Status codes obtenidos.
- `uploadId` confirmado.
- Confirmacion de blob real subido.
- Confirmacion de no fuga de secretos/metadata.
- Riesgos restantes.
- Recomendacion:
  - seguir con aprobar/rechazar empresa o servicio, o
  - corregir antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-061. Product/Architect debe leer tasks/TASK-061-HANDOFF.md.
```
