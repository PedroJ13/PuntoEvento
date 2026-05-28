# TASK-052: Backend DELETE company services logical delete

## Resultado general

Completada.

Se implemento:

```text
DELETE /api/companies/me/services/{serviceId}
```

El endpoint hace borrado logico de servicios propios: no elimina la entidad en Table Storage, solo actualiza `status: inactive` y `updatedAt`. La empresa se deriva exclusivamente de la cookie `pe_company_session`.

## Archivos modificados

- `api/company-services-delete/function.json`
- `api/company-services-delete/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `tasks/TASK-052-HANDOFF.md`

## Contrato implementado

Response `200`:

```json
{
  "id": "service_...",
  "companyId": "company_...",
  "status": "inactive",
  "updatedAt": "..."
}
```

Errores:

```text
400 Validation error
401 Unauthorized
404 Service not found
405 Method not allowed
500 Unexpected server error
```

Persistencia:

```text
Tabla: Services
PartitionKey: companyId de la sesion
RowKey: serviceId de la ruta
Cambio: status=inactive, updatedAt=<now>
```

## Validaciones realizadas

Implementadas:

- `companyId` enviado por query/body/header se ignora.
- Solo se busca y desactiva con `PartitionKey=session.partitionKey`.
- Servicio inexistente o de otra empresa responde `404`.
- No se borra fisicamente la entidad.
- `updatedAt` cambia en cada desactivacion exitosa.
- `createdAt` se conserva porque se usa merge parcial.
- Response `200` no expone `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni campos de ranking/monetizacion.
- `GET /api/companies/me/services` mantiene visible el servicio con `status: inactive` para el panel empresa.

Verificacion local/estructural realizada:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-delete/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-list/index.js'
```

Resultado:

```text
node --check api/company-services-delete/index.js -> OK
node --check api/company-services-list/index.js -> OK
api/company-services-delete/function.json -> JSON valido, route companies/me/services/{serviceId}, method delete
DELETE sin cookie -> 401
Metodo distinto de DELETE -> 405
DELETE sin serviceId -> 400
DELETE sobre servicio inexistente -> 404
DELETE sobre servicio de otra empresa -> 404
DELETE con sesion sobre servicio propio -> 200
Persistencia queda status inactive
Entidad sigue existiendo en memoria mock, no se borra fisicamente
createdAt se conserva
updatedAt cambia
Campos ranking mockeados se conservan en persistencia pero no salen en response
GET /api/companies/me/services refleja status inactive
Response 200 no expone metadata interna ni ranking
```

## Riesgos restantes

- No se ejecuto prueba real contra Azure en esta tarea; debe validarse post-deploy con cookie real.
- El endpoint es idempotente solo en la practica de dejar `status: inactive`; una segunda llamada al mismo servicio volvera a responder `200` y actualizara `updatedAt`.
- El servicio inactivo sigue visible en el listado privado porque Product/Architect no pidio excluirlo. Si el panel requiere filtro, debe definirse en otra tarea.
- No hay endpoint de restauracion/reactivacion de servicios.
- La autenticacion de empresa sigue dependiendo de busqueda de sesion por hash en Table Storage, suficiente para MVP cerrado pero no ideal para escala.

## Siguiente tarea recomendada

QA local/estructural:

```text
Validar DELETE /api/companies/me/services/{serviceId} con mocks, incluyendo 401, 405, 400, 404, borrado logico y reflejo en GET.
```

Backend API:

```text
Implementar POST /api/uploads/sign para imagenes de empresa/servicio autenticadas.
```
