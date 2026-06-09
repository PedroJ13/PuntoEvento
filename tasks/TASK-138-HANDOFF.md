# TASK-138 Handoff

## Resultado general

Implementado el flujo backend para que la aprobacion interna de un servicio publique tambien las imagenes pendientes asociadas a ese mismo servicio.

El flujo principal queda:

```text
Admin aprueba empresa -> Admin aprueba servicio -> API publica servicio + uploads pendientes del servicio
```

Las imagenes de servicio ya pueden consumirse dentro del expediente del servicio mediante metadata segura y un endpoint interno de preview autenticado, sin exponer SAS ni nombres internos de blob.

## Endpoints y archivos modificados

Endpoints:

- `POST /api/internal/services/{companyId}/{serviceId}/approve`
- `GET /api/internal/services/pending`
- `GET /api/internal/uploads/pending`
- Nuevo: `GET /api/internal/uploads/{companyId}/{uploadId}/preview`

Archivos:

- `api/shared/internalModeration.js`
- `api/shared/internalPending.js`
- `api/internal-uploads-preview/function.json`
- `api/internal-uploads-preview/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-138-HANDOFF.md`

## Comportamiento final de aprobacion de servicio

`POST /api/internal/services/{companyId}/{serviceId}/approve` ahora:

- mantiene la validacion de empresa `published`;
- lista uploads `pending` con `scope=service` y `serviceId` asociado;
- valida que las imagenes resultantes no excedan 10;
- valida que no existan multiples covers pendientes;
- exige cover si el servicio va a quedar con imagenes;
- copia los blobs pendientes al contenedor publico;
- marca esos uploads como `published`;
- aplica `coverUrl` y `gallery` al servicio;
- publica el servicio con `status: "published"`;
- elimina los blobs pendientes al final como limpieza best-effort.

Si falla una regla de imagen antes de copiar/publicar, responde `409` y no actualiza `Services` ni `Uploads`.

## Preview interno para Web

Los listados internos devuelven imagenes con esta forma segura:

```json
{
  "uploadId": "upload_123",
  "serviceId": "service_123",
  "imageType": "cover",
  "fileName": "foto.jpg",
  "contentType": "image/jpeg",
  "size": 12345,
  "status": "pending",
  "previewUrl": "/api/internal/uploads/company_123/upload_123/preview"
}
```

Web debe usar `previewUrl` con la misma credencial interna admin. El endpoint sirve bytes desde el blob pendiente y no devuelve `pendingBlobName`, SAS, connection strings, `partitionKey`, `rowKey`, hashes ni cookies.

## Verificacion ejecutada

- `node --check api/shared/internalModeration.js`
- `node --check api/shared/internalPending.js`
- `node --check api/internal-uploads-preview/index.js`
- `ConvertFrom-Json` sobre `api/internal-uploads-preview/function.json`
- Script local con mocks para:
  - aprobar servicio de empresa no publicada -> `409`;
  - aprobar servicio de empresa publicada con 1 cover + 2 gallery pending -> servicio `published`, 3 uploads `published`, `coverUrl` aplicado y `gallery` con 2 URLs;
  - error por dos covers pendientes -> `409` sin updates en servicio ni uploads;
  - `GET /api/internal/services/pending` devuelve `images[]` con `previewUrl` y sin `pendingBlobName`;
  - preview interno devuelve bytes con `Content-Type` y sin exponer campos internos.

## Riesgos o pendientes

- No se ejecuto Azure Functions runtime real ni Blob/Table Storage real.
- Azure Table Storage no ofrece transaccion atomica entre copia de blobs, tabla `Uploads` y tabla `Services`; la implementacion evita updates de tabla si falla la validacion o copia previa, pero un fallo de almacenamiento durante updates posteriores podria requerir conciliacion manual.
- `POST /api/internal/uploads/{companyId}/{uploadId}/approve` se mantiene como soporte tecnico, pero el flujo visual principal debe pasar por aprobacion de servicio.

## Deploy

Requiere deploy antes de QA porque agrega un endpoint nuevo y cambia el comportamiento runtime de aprobacion de servicios.
