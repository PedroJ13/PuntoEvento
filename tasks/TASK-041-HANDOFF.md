# TASK-041: Backend GET company services

## Resultado general

Completada.

Se implemento el primer endpoint privado de servicios de empresa:

```text
GET /api/companies/me/services
```

El endpoint lista servicios asociados a la empresa autenticada por cookie `pe_company_session`. La autoridad de `companyId` se deriva exclusivamente de `getCurrentCompanySession(req, config)` y no de query, body ni headers.

## Archivos modificados

- `api/shared/config.js`
- `api/shared/azure.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `tasks/TASK-041-HANDOFF.md`

## Contrato implementado

### GET `/api/companies/me/services`

Request:

```text
Cookie: pe_company_session=<session>
```

Response `200`:

```json
[
  {
    "id": "service_123",
    "companyId": "company_123",
    "slug": "mesa-dulce",
    "name": "Mesa dulce",
    "category": "Mesas de dulces",
    "status": "draft",
    "eventTypes": ["Bodas", "Cumpleanos"],
    "priceFrom": "CRC 120000",
    "description": "...",
    "coverUrl": "",
    "gallery": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

Errores:

```text
401 Unauthorized
405 Method not allowed
500 Unexpected server error
```

Persistencia:

```text
Tabla: Services
PartitionKey: companyId
RowKey: serviceId
Config: AZURE_TABLE_SERVICES=Services
```

Reglas implementadas:

- Usa `getCurrentCompanySession(req, config)`.
- Deriva `companyId` desde `session.partitionKey`.
- Lista solo entidades de `Services` con `PartitionKey = companyId`.
- Ordena por `updatedAt` descendente; si falta, usa `createdAt`.
- No devuelve `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni metadata interna.
- No devuelve campos de ranking/monetizacion como `sortBoost`, `isFeatured` o `featuredUntil`.
- No implementa POST/PATCH/DELETE.
- No cambia UI.

## Como probar local/estructuralmente

Verificacion realizada:

```text
node --check api/shared/config.js -> OK
node --check api/shared/azure.js -> OK
node --check api/company-services-list/index.js -> OK
api/company-services-list/function.json -> JSON valido, route companies/me/services, method get
GET /api/companies/me/services sin cookie con mocks -> 401 Unauthorized y no consulta Services
GET /api/companies/me/services con sesion mockeada -> filtra PartitionKey eq company_session
Response 200 mockeada -> no expone partitionKey, rowKey, etag, timestamp, sortBoost, isFeatured ni featuredUntil
Response 200 mockeada -> ordena updatedAt/createdAt descendente
```

Comandos de sintaxis:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/config.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/azure.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/company-services-list/index.js'
```

Validar `function.json`:

```powershell
Get-Content -Raw 'api/company-services-list/function.json' | ConvertFrom-Json
```

Pruebas con mocks requeridas:

```text
GET /api/companies/me/services sin cookie -> 401 Unauthorized
GET /api/companies/me/services con sesion -> lista solo servicios de esa empresa
Response 200 no expone metadata interna ni campos de ranking/monetizacion
```

Prueba real despues de deploy:

1. Crear o confirmar servicios en tabla `Services` con `PartitionKey=<companyId>`.
2. Generar una sesion real con el flujo `internal/company-invites -> accept-invite`.
3. Ejecutar `GET /api/companies/me/services` con la cookie `pe_company_session`.
4. Confirmar `200`, aislamiento por empresa y ausencia de metadata interna.

## Riesgos

- No existe todavia endpoint para crear servicios, por lo que QA Azure necesitara seed manual en la tabla `Services` o esperar `POST /api/companies/me/services`.
- `eventTypes` y `gallery` se normalizan desde arreglos, JSON string o texto separado por comas para tolerar datos iniciales; Product/Architect debe confirmar el formato definitivo de persistencia.
- La tabla `Services` se crea al vuelo con `ensureServicesTable`, siguiendo el patron actual del repo; depende de connection strings correctos en Azure.
- `getCurrentCompanySession` sigue buscando sesion por hash con scan de Table Storage; aceptable para MVP cerrado, pero no escala bien.
- El endpoint no valida que la empresa siga existiendo en `Companies`; confia en la sesion y lista por `companyId`.

## Siguiente tarea recomendada

Backend API:

```text
Implementar POST /api/companies/me/services para crear servicios propios con status draft y validacion de catalogos.
```

QA Azure:

```text
Despues del deploy, sembrar servicios controlados en Services y validar GET /api/companies/me/services con y sin cookie real.
```
