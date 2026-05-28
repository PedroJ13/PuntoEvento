# TASK-059 Handoff

## Resultado general

Implementado `POST /api/uploads/confirm` para confirmar uploads firmados de empresas autenticadas.

El endpoint deriva `companyId` desde la sesion `pe_company_session`, busca la reserva en `Uploads` por `PartitionKey=companyId` y `RowKey=uploadId`, valida el blob real en el contenedor pendiente y cambia reservas `reserved` a `pending`.

Decision de modelo: al confirmar se limpia `expiresAt` porque el upload deja de ser una reserva vencible. Se conserva `createdAt` y se actualiza `updatedAt`.

## Archivos modificados

- `api/uploads-confirm/function.json`
- `api/uploads-confirm/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `tasks/TASK-059-HANDOFF.md`

Nota: el repositorio ya tenia otros cambios sin commit antes de esta tarea; no se revirtieron.

## Contrato implementado

`POST /api/uploads/confirm`

Request:

```json
{
  "uploadId": "upload_..."
}
```

Response `201` en confirmacion valida:

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

Response `200` idempotente cuando el upload ya esta `pending` y el blob sigue coincidiendo con la reserva.

Errores cubiertos:

- `400` si falta `uploadId`, MIME real no coincide con la reserva o el tamano real es cero.
- `401` si no hay sesion de empresa.
- `404` si la reserva no existe para la empresa autenticada, pertenece a otra empresa o el blob no existe.
- `405` si el metodo no es `POST`.
- `409` si el upload expiro o no esta en estado confirmable.
- `413` si el blob supera 5 MB.
- `415` si el MIME real del blob no esta permitido.
- `500` para errores inesperados.

## Validaciones realizadas

- `node --check api/uploads-confirm/index.js` paso usando Node del runtime local de Codex (`v24.14.0`). El `node` del sistema devolvio `Access is denied`.
- `api/uploads-confirm/function.json` parsea correctamente con `ConvertFrom-Json`.
- Prueba local con mocks cubrio:
  - sin cookie `401`
  - metodo incorrecto `405`
  - sin `uploadId` `400`
  - upload inexistente `404`
  - upload de otra empresa `404`
  - upload expirado `409`
  - estado `published` no confirmable `409`
  - blob ausente `404`
  - MIME real no permitido `415`
  - MIME real diferente al reservado `400`
  - tamano cero `400`
  - tamano mayor a 5 MB `413`
  - confirmacion valida `201`
  - confirmacion repetida en estado `pending` `200`
  - respuesta sin campos internos fuera del contrato publico

## Riesgos restantes

- Falta QA contra Azure real con cookie `pe_company_session`, SAS real y blob real en `uploads-pending`.
- No hay cleanup automatico para reservas vencidas ni blobs pendientes no confirmados.
- `pending` aun no se asocia a `coverUrl` ni `gallery`; eso queda para el flujo de revision/publicacion.
- El endpoint depende de que Azure Blob devuelva `contentType` correctamente; QA debe confirmar el PUT real usa el `uploadUrl` firmado sin alterar headers.

## Siguiente tarea recomendada

QA debe validar `POST /api/uploads/confirm` local/estructuralmente y luego QA/Infra debe ejecutarlo post-deploy en Azure con una sesion real y un blob real.

Despues, Backend API puede avanzar con el endpoint de aprobar/rechazar empresa o servicio para publicar imagenes y cambios revisados.
