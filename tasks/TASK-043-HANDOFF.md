# TASK-043: Backend POST company services

## Estado

Completada.

## Resultado general

El endpoint ya existe en el repo y cumple el alcance asignado:

```text
POST /api/companies/me/services
```

No se modifico codigo en esta ronda. Se hizo validacion local/estructural contra el assignment para confirmar que la implementacion actual:

- Crea servicios propios para la empresa autenticada por cookie `pe_company_session`.
- Deriva `companyId` exclusivamente desde la sesion.
- Persiste en `Services` con `PartitionKey=companyId` y `RowKey=serviceId`.
- Inicializa servicios nuevos con `status: draft`.
- Genera `slug` desde `name`.
- Valida `name`, `category`, `eventTypes` y `gallery`.
- Responde `201` sin exponer metadata interna de Table Storage, hashes, tokens, cookies ni campos de ranking.

## Archivos revisados

- `api/company-services-create/function.json`
- `api/company-services-create/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Contrato implementado

### POST `/api/companies/me/services`

Request esperado:

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

Errores cubiertos por la implementacion:

```text
400 Missing required fields / eventTypes must be an array / gallery must be an array
401 Unauthorized
405 Method not allowed
409 Slug already exists for this company
500 Unexpected server error
```

## Validaciones realizadas

Comandos ejecutados:

```text
git rev-parse --show-toplevel
node --check api/company-services-create/index.js
node --check api/company-services-list/index.js
node --check api/shared/companyAuth.js
node --check api/shared/config.js
node --check api/shared/azure.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

Validacion estructural de `api/company-services-create/function.json`:

```json
{
  "route": "companies/me/services",
  "methods": "post",
  "authLevel": "anonymous"
}
```

Revision manual de seguridad/aislamiento:

- Sin sesion valida, el handler responde `401` antes de acceder a `Services`.
- `companyId` sale de `session.partitionKey`; no se lee de query, body ni headers.
- La entidad creada usa `partitionKey: companyId`.
- El `body.companyId`, si se enviara, queda ignorado porque `validateServicePayload` no lo copia.
- `eventTypes` y `gallery` se persisten como JSON string y se devuelven como arreglos.
- La respuesta publica se arma manualmente y no incluye `partitionKey`, `rowKey`, `etag`, `timestamp`, `sortBoost`, `isFeatured` ni `featuredUntil`.

## Riesgos restantes

- No se ejecuto prueba contra Azure real ni con Table Storage real en esta ronda.
- No se ejecuto mock automatizado end-to-end de crear y luego listar; la revision estructural indica que el servicio creado deberia aparecer en `GET /api/companies/me/services` porque ambos usan la misma tabla y el mismo `PartitionKey`.
- La validacion de catalogos permitidos queda pendiente; por ahora solo se valida que `category` sea texto requerido y `eventTypes` sea arreglo.
- El limite de `gallery` en create permite hasta 20 URLs por limpieza generica, aunque el modelo MVP de imagenes de servicio define maximo 10. En el flujo objetivo, las imagenes deben manejarse por `POST /api/uploads/sign` y aprobacion, no por URLs manuales en esta tarea.

## Siguiente tarea recomendada

QA local/estructural:

```text
Validar POST /api/companies/me/services con mocks: 401 sin cookie, 201 con sesion valida, 409 por slug duplicado y que luego aparezca en GET /api/companies/me/services.
```

Product/Architect:

```text
Confirmar si el backlog generado antiguo de TASK-043 debe considerarse cerrado porque el repo actual ya incluye implementacion posterior del endpoint.
```
