# TASK-059: Backend confirm uploaded image

## Equipo asignado

Backend API.

## Contexto

Ya estan aprobados en Azure real:

- `POST /api/uploads/sign`
- PUT real de blob pequeno usando el `uploadUrl` firmado

`TASK-058` confirmo que el endpoint firma upload, crea reservas y permite subir al contenedor pendiente. Falta confirmar/registrar que el blob fue subido y dejar la reserva en estado `pending`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-056-HANDOFF.md`
- `tasks/TASK-057-HANDOFF.md`
- `tasks/TASK-058-HANDOFF.md`
- `api/uploads-sign/index.js`
- `api/register-upload/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/shared/companyAuth.js`
- `api/shared/validation.js`

## Objetivo

Implementar:

```text
POST /api/uploads/confirm
```

Debe confirmar que un upload reservado por la empresa autenticada fue subido al blob pendiente, validar propiedades reales del blob y cambiar la reserva de `reserved` a `pending`.

## Contrato esperado

Request:

```json
{
  "uploadId": "upload_..."
}
```

Response `201`:

```json
{
  "uploadId": "upload_...",
  "status": "pending",
  "scope": "service",
  "serviceId": "service_...",
  "imageType": "cover",
  "pendingBlobUrl": "https://..."
}
```

Errores esperados:

```text
400 Validation error
401 Unauthorized
404 Upload or blob not found
405 Method not allowed
409 Upload is not confirmable
415 Uploaded blob contentType is not allowed
500 Unexpected server error
```

## Reglas de producto

- Requiere sesion de empresa.
- `companyId` debe salir solo de la sesion.
- Buscar reserva en `Uploads` con `PartitionKey=companyId` y `RowKey=uploadId`.
- Si la reserva no existe o pertenece a otra empresa, responder `404`.
- Solo reservas `reserved` pueden confirmarse.
- Si ya esta `pending`, responder idempotentemente `201` o `200` con estado `pending`, siempre que el blob coincida.
- Si esta `published`, `rejected` u otro estado no confirmable, responder `409`.
- Si `expiresAt` vencio, responder `409` o `400` indicando expirado.
- Validar que el blob pendiente existe usando `pendingBlobName`.
- Validar MIME real del blob contra `contentType` reservado.
- Validar tamano real del blob y maximo 5 MB.
- Actualizar reserva:
  - `status: pending`
  - `size` con tamano real
  - `updatedAt`
  - conservar `createdAt`
  - limpiar `expiresAt` o dejarlo como auditoria, pero documentar decision.
- No mover a contenedor publico.
- No actualizar aun `coverUrl` ni `gallery` del servicio.
- No modificar UI.

## Criterios de aceptacion

- Sin cookie responde `401`.
- Metodo distinto de `POST` responde `405`.
- Sin `uploadId` responde `400`.
- Upload inexistente responde `404`.
- Upload de otra empresa responde `404`.
- Upload expirado responde error controlado.
- Upload en estado no confirmable responde `409`.
- Blob ausente responde `404`.
- MIME real no permitido responde `415` o `400`.
- MIME real diferente al reservado responde `400`.
- Tamano real vacio o mayor a 5 MB responde `400` o `413`.
- Request valido confirma reserva y responde `201`.
- Confirmacion repetida de upload ya `pending` es idempotente.
- Response no expone connection strings, account keys, hashes, cookies ni metadata interna.
- `node --check` pasa en archivos nuevos/modificados.

## Fuera de alcance

- No publicar imagen.
- No mover/copiar a contenedor publico.
- No asociar imagen a `coverUrl` o `gallery`.
- No hacer cleanup automatico.
- No modificar UI.

## Entregable

Crear:

```text
tasks/TASK-059-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Contrato implementado.
- Validaciones realizadas.
- Riesgos restantes.
- Siguiente tarea recomendada.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-059. Product/Architect debe leer tasks/TASK-059-HANDOFF.md.
```
