# TASK-056: Backend signed upload URL for company/service images

## Resultado general

Completada.

Se implemento:

```text
POST /api/uploads/sign
```

El endpoint genera una URL SAS temporal para subir una imagen a `uploads-pending`, asociada exclusivamente a la empresa autenticada por cookie `pe_company_session`. Tambien crea una reserva en la tabla `Uploads`.

## Archivos modificados

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/uploads-sign/function.json`
- `api/uploads-sign/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-056-HANDOFF.md`

## Contrato implementado

Request:

```json
{
  "scope": "service",
  "serviceId": "service_123",
  "imageType": "cover",
  "fileName": "mesa.jpg",
  "contentType": "image/jpeg",
  "size": 320000
}
```

Response `200`:

```json
{
  "uploadId": "upload_...",
  "uploadUrl": "https://...",
  "pendingBlobUrl": "https://...",
  "expiresInMinutes": 10
}
```

Errores:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
413 File too large
415 Unsupported media type
500 Unexpected server error
```

Persistencia:

```text
Tabla: Uploads
PartitionKey: companyId de la sesion
RowKey: uploadId generado
status: reserved
scope
serviceId
imageType
fileName
contentType
size
pendingBlobName
pendingBlobUrl
createdAt
updatedAt
expiresAt
```

Config agregada:

```text
AZURE_TABLE_UPLOADS=Uploads
```

## Validaciones realizadas

Implementadas:

- Requiere sesion de empresa.
- `companyId` enviado por query/body/header se ignora.
- `scope` permitido: `company` o `service`.
- `scope=service` requiere `serviceId`.
- `scope=service` valida que el servicio exista con `PartitionKey=session.partitionKey`.
- Servicio inexistente o de otra empresa responde `404`.
- `imageType` permitido: `cover`, `gallery`, `logo`.
- MIME permitido: `image/jpeg`, `image/png`, `image/webp`.
- Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Extension debe corresponder al `contentType`.
- Maximo 5 MB.
- SAS de escritura para un blob especifico durante 10 minutos.
- Response no expone connection strings, account keys, hashes, cookies ni metadata interna.
- No modifica UI.
- No publica imagenes ni actualiza `coverUrl`/`gallery`.

Verificacion local/estructural realizada:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/uploads-sign/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/config.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/azure.js'
```

Resultado:

```text
node --check api/uploads-sign/index.js -> OK
node --check api/shared/config.js -> OK
node --check api/shared/azure.js -> OK
api/uploads-sign/function.json -> JSON valido, route uploads/sign, method post
POST sin cookie -> 401
Metodo distinto de POST -> 405
Body invalido -> 400
scope invalido -> 400
scope=service sin serviceId -> 400
scope=service con servicio inexistente/de otra empresa -> 404
MIME no permitido -> 415
Extension no permitida -> 415
Archivo > 5 MB -> 413
Request valido scope=company -> 200 y reserva Uploads
Request valido scope=service -> 200 y reserva Uploads
Reserva persistida con PartitionKey=session.partitionKey y status reserved
companyId inyectado por query/body/header se ignora
Response no expone secretos ni metadata interna
```

## Riesgos restantes

- No se ejecuto prueba real contra Azure en esta tarea; debe validarse post-deploy con cookie real.
- La tarea solo reserva upload y firma URL; no valida bytes subidos, MIME real ni tamano real del blob.
- No existe todavia endpoint de confirmacion para pasar una reserva de `reserved` a `pending`.
- No hay cleanup automatico de reservas vencidas en `Uploads`.
- `logo` se permite para `scope=service` por simplicidad MVP, aunque Product podria decidir restringirlo a `scope=company`.
- El cliente debe subir el blob directamente usando el `uploadUrl` y el `contentType` reservado.

## Siguiente tarea recomendada

QA local/estructural:

```text
Validar POST /api/uploads/sign con mocks, incluyendo 401, 400, 404, 413, 415 y reserva correcta en Uploads.
```

Backend API:

```text
Implementar endpoint para registrar/confirmar upload completado, validar blob real y actualizar company/service despues de revision.
```
