# TASK-056: Backend signed upload URL for company/service images

## Equipo asignado

Backend API.

## Contexto

Ya estan aprobados en Azure real los endpoints privados de servicios:

- `GET /api/companies/me/services`
- `POST /api/companies/me/services`
- `PATCH /api/companies/me/services/{serviceId}`
- `DELETE /api/companies/me/services/{serviceId}`

El siguiente bloque es habilitar carga de fotos para empresa/servicio. Esta tarea solo debe generar URL firmada y reserva de upload; no debe conectar UI ni publicar imagenes.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-048-HANDOFF.md`
- `tasks/TASK-051-HANDOFF.md`
- `tasks/TASK-054-HANDOFF.md`
- `api/create-upload-url/index.js`
- `api/register-upload/index.js`
- `api/company-services-list/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/shared/companyAuth.js`
- `api/shared/validation.js`

## Objetivo

Implementar:

```text
POST /api/uploads/sign
```

Debe generar una SAS temporal para subir una imagen a contenedor pendiente, asociada a la empresa autenticada por cookie `pe_company_session`.

## Contrato esperado

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

Errores esperados:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
413 File too large
415 Unsupported media type
500 Unexpected server error
```

## Reglas de producto

- Requiere sesion de empresa.
- `companyId` debe salir solo de la sesion. Ignorar cualquier `companyId` enviado por query, body o headers.
- `scope` permitido: `company` o `service`.
- Si `scope=service`, `serviceId` es requerido y debe pertenecer a la empresa autenticada.
- Si `scope=company`, no requiere `serviceId`.
- `imageType` permitido para MVP:
  - `cover`
  - `gallery`
  - `logo`
- Maximo 5 MB por imagen.
- Tipos permitidos:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
- Extensiones permitidas:
  - `.jpg`
  - `.jpeg`
  - `.png`
  - `.webp`
- SAS debe ser de escritura para un blob especifico y de corta duracion.
- Subida siempre al contenedor pendiente; publicar imagenes queda fuera de esta tarea.
- No exponer connection strings, account keys ni secretos.
- No modificar UI en esta tarea.

## Persistencia sugerida

Usar tabla `Uploads` si ya existe config/patron, o agregar config equivalente:

```text
Table: Uploads
PartitionKey: companyId
RowKey: uploadId
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
expiresAt
```

Si el repo ya tiene helpers para `uploads-pending`, SAS o reservas de imagenes en el flujo viejo de providers, reutilizarlos cuando aplique.

## Criterios de aceptacion

- Sin cookie responde `401`.
- Metodo distinto de `POST` responde `405`.
- Body invalido responde `400`.
- `scope` invalido responde `400`.
- `scope=service` sin `serviceId` responde `400`.
- `scope=service` con servicio inexistente o de otra empresa responde `404`.
- MIME no permitido responde `415`.
- Extension no permitida responde `415` o `400`.
- Archivo mayor a 5 MB responde `413`.
- Request valido responde `200` con `uploadId`, `uploadUrl`, `pendingBlobUrl`, `expiresInMinutes`.
- Reserva queda persistida con `status: reserved`.
- Response no expone secretos ni metadata interna.
- `node --check` pasa en archivos nuevos/modificados.

## Fuera de alcance

- No subir bytes desde backend.
- No registrar upload completado.
- No validar MIME real del blob subido.
- No mover a contenedor publico.
- No actualizar `coverUrl` ni `gallery` de servicios.
- No modificar UI.

## Entregable

Crear:

```text
tasks/TASK-056-HANDOFF.md
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
Termine TASK-056. Product/Architect debe leer tasks/TASK-056-HANDOFF.md.
```
