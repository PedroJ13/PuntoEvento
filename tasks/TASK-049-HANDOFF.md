# TASK-049: Backend PATCH company services

## Resultado general

Completada.

Se implemento:

```text
PATCH /api/companies/me/services/{serviceId}
```

El endpoint actualiza servicios propios usando exclusivamente el `companyId` derivado de la cookie `pe_company_session`. Si el servicio no existe bajo `PartitionKey=<companyId de sesion>`, responde `404`, incluyendo el caso de servicios de otra empresa.

## Archivos modificados

- `api/company-services-update/function.json`
- `api/company-services-update/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `tasks/TASK-049-HANDOFF.md`

## Contrato implementado

Request parcial:

```json
{
  "name": "Mesa dulce premium",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 150000",
  "description": "Mesa dulce premium para bodas.",
  "coverUrl": "",
  "gallery": []
}
```

Response `200`:

```json
{
  "id": "service_...",
  "companyId": "company_...",
  "slug": "mesa-dulce-premium",
  "name": "Mesa dulce premium",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 150000",
  "description": "Mesa dulce premium para bodas.",
  "coverUrl": "",
  "gallery": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

Errores:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
409 Slug already exists for this company
500 Unexpected server error
```

Persistencia:

```text
Tabla: Services
PartitionKey: companyId de la sesion
RowKey: serviceId de la ruta
eventTypes/gallery: JSON string persistido, arreglo en response
```

## Validaciones realizadas

Implementadas:

- `companyId` enviado por query/body/header se ignora.
- Solo se busca y actualiza con `PartitionKey=session.partitionKey`.
- Servicio inexistente o de otra empresa responde `404`.
- Campos editables: `name`, `category`, `eventTypes`, `priceFrom`, `description`, `coverUrl`, `gallery`.
- Campos no editables desde empresa se ignoran: `companyId`, `status`, `plan`, `sortBoost`, `isFeatured`, `featuredUntil` y campos admin/ranking.
- Si `name` viene presente, no puede quedar vacio y regenera `slug`.
- Si el nuevo slug existe en otro servicio de la misma empresa, responde `409`.
- `eventTypes` y `gallery` deben ser arreglos cuando vienen presentes.
- `updatedAt` cambia en cada update exitoso.
- `createdAt` se conserva.
- Response `200` no expone `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni campos de ranking/monetizacion.

Verificacion local/estructural realizada:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-update/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-list/index.js'
```

Resultado:

```text
node --check api/company-services-update/index.js -> OK
node --check api/company-services-list/index.js -> OK
api/company-services-update/function.json -> JSON valido, route companies/me/services/{serviceId}, method patch
PATCH sin cookie -> 401
PATCH sobre servicio inexistente -> 404
PATCH sobre servicio de otra empresa -> 404
PATCH con slug duplicado en otro servicio de la misma empresa -> 409
PATCH con sesion sobre servicio propio -> 200
PATCH con companyId/status/ranking inyectado -> no modifica esos campos
Cambio de name -> actualiza slug
eventTypes/gallery vuelven como arreglos
createdAt se conserva
updatedAt cambia
GET /api/companies/me/services refleja cambios
Response 200 no expone metadata interna ni ranking
```

## Riesgos restantes

- No se ejecuto prueba real contra Azure en esta tarea; debe validarse post-deploy con cookie real.
- La unicidad de slug se valida con lectura previa en Table Storage; en concurrencia extrema puede requerir una estrategia atomica o indice auxiliar.
- Product/Architect aun debe definir catalogos definitivos para `category` y `eventTypes`; por ahora se valida forma, no pertenencia a catalogo.
- Si un servicio `published` cambia contenido publico, el contrato menciona que podria volver a `pending`; esta tarea conserva `status` porque Product/Architect no pidio activar revision automatica.
- No se implementa upload de imagenes; `coverUrl` y `gallery` solo aceptan strings provistos.

## Siguiente tarea recomendada

QA local/estructural:

```text
Validar PATCH /api/companies/me/services/{serviceId} con mocks, incluyendo 401, 404, 409, sanitizacion e integracion con GET.
```

Backend API:

```text
Implementar DELETE /api/companies/me/services/{serviceId} como borrado logico con status inactive.
```
