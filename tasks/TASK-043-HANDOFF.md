# TASK-043: Backend POST company services

## Resultado general

Completada.

Se implemento:

```text
POST /api/companies/me/services
```

El endpoint crea servicios propios en estado `draft`, asociados exclusivamente al `companyId` derivado de la cookie `pe_company_session` mediante `getCurrentCompanySession(req, config)`.

## Archivos modificados

- `api/company-services-create/function.json`
- `api/company-services-create/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `tasks/TASK-043-HANDOFF.md`

## Contrato implementado

Request:

```json
{
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Servicio de mesa dulce para eventos.",
  "coverUrl": "",
  "gallery": []
}
```

Response `201`:

```json
{
  "id": "service_...",
  "companyId": "company_...",
  "slug": "mesa-dulce",
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "status": "draft",
  "eventTypes": ["Bodas", "Cumpleanos"],
  "priceFrom": "CRC 120000",
  "description": "Servicio de mesa dulce para eventos.",
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
405 Method not allowed
409 Slug already exists for this company
500 Unexpected server error
```

Persistencia:

```text
Tabla: Services
PartitionKey: companyId de la sesion
RowKey: serviceId generado
status inicial: draft
eventTypes/gallery: JSON string persistido, arreglo en response
```

## Validaciones realizadas

Implementadas:

- `name` requerido.
- `category` requerido.
- `eventTypes` debe ser arreglo; puede estar vacio.
- `gallery` debe ser arreglo; puede estar vacio.
- `description`, `priceFrom` y `coverUrl` pueden venir vacios.
- `companyId` enviado por query/body/header se ignora.
- Slug generado desde `name`.
- Slug duplicado dentro de la misma empresa responde `409`.
- Response `201` no expone `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni campos de ranking/monetizacion.

Verificacion local/estructural realizada:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-create/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-list/index.js'
```

Resultado:

```text
node --check api/company-services-create/index.js -> OK
node --check api/company-services-list/index.js -> OK
api/company-services-create/function.json -> JSON valido, route companies/me/services, method post
POST sin cookie -> 401
POST con body invalido y sesion -> 400
POST con sesion -> 201 y crea entidad en Services con PartitionKey=session.partitionKey
POST con companyId inyectado -> ignora valor inyectado
POST duplicando slug para misma empresa -> 409
GET /api/companies/me/services lista el servicio creado
Response 201 no expone metadata interna ni ranking
eventTypes/gallery se guardan como JSON string y se devuelven como arreglos
```

## Riesgos restantes

- No se ejecuto prueba real contra Azure en esta tarea; debe validarse post-deploy con cookie real.
- La unicidad de slug se valida con lectura previa en Table Storage. En concurrencia extrema, dos requests simultaneos con el mismo nombre podrian pasar la lectura antes de crear. Para MVP cerrado el riesgo es bajo.
- Product/Architect aun debe definir catalogos definitivos para `category` y `eventTypes`; por ahora se valida forma, no pertenencia a catalogo.
- `eventTypes` y `gallery` se guardan como JSON string para compatibilidad con Table Storage y el GET ya normaliza a arreglos.
- El endpoint no implementa upload de imagenes; `coverUrl` y `gallery` solo aceptan strings provistos.

## Siguiente tarea recomendada

QA local/estructural:

```text
Validar POST /api/companies/me/services con mocks, incluyendo 401, 400, 409, creacion correcta y visibilidad desde GET.
```

Backend API:

```text
Implementar PATCH /api/companies/me/services/{id} para editar servicios propios sin permitir cambios de companyId, status admin ni campos de ranking.
```
