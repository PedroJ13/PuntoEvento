# TASK-069 HANDOFF - QA/Infra Azure endpoints publicos por servicio

## Resultado general

Aprobado con observaciones.

Los endpoints publicos por servicio funcionan en Azure real:

- `GET /api/public/services`
- `GET /api/public/companies/{slug}`

Se validaron con datos QA publicados reales en Azure Table Storage. No se detecto exposicion de campos privados ni URLs de `uploads-pending` en los payloads probados.

Observacion principal:

```text
POST contra ambos endpoints responde 404 en Azure, no 405.
```

Esto coincide con la observacion de TASK-068: los `function.json` declaran solo `methods: ["get"]`, por lo que Azure Functions corta el routing antes de entrar al handler que devolveria `405`. No lo considero bloqueante porque los `GET` funcionan y no hay exposicion de datos.

No se cambio codigo. No se hizo commit, push ni deploy desde esta tarea.

## URL base Azure usada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Commit/deploy validado

Commit local visible:

```text
b7f078a Add public service endpoints
```

No tuve visibilidad directa del workflow de GitHub/Azure Static Web Apps desde esta tarea, pero el deploy se valido de forma practica porque las rutas nuevas respondieron `200` en Azure:

```text
/api/public/services
/api/public/companies/qa-company-register-test
```

## Datos QA usados

Empresa publicada existente:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
slug: qa-company-register-test
status publico observado: published
```

Servicio publicado usado como referencia:

```text
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
slug: qa-moderacion-approve-20260528113350
name: QA Moderacion Approve 20260528113350
category: QA Moderacion
eventTypes: QA
company province: Heredia
```

Empresa pendiente creada para validar que empresas no publicadas no aparecen publicamente:

```text
companyId: company_474b834f-f379-4e37-8771-0759cd14ac65
slug: qa-public-hidden-20260528192830
status: pending
public profile status: 404
```

No se registraron credenciales, cookies, SAS tokens ni secretos.

## Endpoints probados y status HTTP

### Servicios publicos

| Caso | Endpoint | Status | Resultado |
| --- | --- | ---: | --- |
| Listado default | `GET /api/public/services` | `200` | `items: 4`, `nextCursor: ""` |
| Limit bajo | `GET /api/public/services?limit=1` | `200` | `items: 1` |
| Limit alto | `GET /api/public/services?limit=999` | `200` | `items: 4`, no supera datos disponibles |
| Cursor reservado | `GET /api/public/services?cursor=reserved` | `200` | `nextCursor: ""` |
| Busqueda por nombre | `GET /api/public/services?q=QA%20Moderacion%20Approve` | `200` | `items: 4` |
| Busqueda por descripcion | `GET /api/public/services?q=temporal` | `200` | `items: 4` |
| Busqueda por categoria | `GET /api/public/services?q=moderacion` | `200` | `items: 4` |
| Busqueda por tipo evento | `GET /api/public/services?q=QA` | `200` | `items: 4` |
| Filtro categoria | `GET /api/public/services?category=QA%20Moderacion` | `200` | `items: 4` |
| Filtro eventType | `GET /api/public/services?eventType=QA` | `200` | `items: 4` |
| Filtro provincia hit | `GET /api/public/services?province=Heredia` | `200` | `items: 4` |
| Filtro provincia miss | `GET /api/public/services?province=Cartago` | `200` | `items: 0` |
| Metodo no permitido | `POST /api/public/services` | `404` | Azure routing no entra al handler |

Payload resumido del primer item:

```json
{
  "id": "service_57b80edc-9bb4-43f8-b957-7ffa8959b934",
  "slug": "qa-moderacion-approve-20260528113350",
  "name": "QA Moderacion Approve 20260528113350",
  "category": "QA Moderacion",
  "eventTypes": ["QA"],
  "company": {
    "slug": "qa-company-register-test",
    "province": "Heredia",
    "plan": "free"
  },
  "coverUrl": "https://storagepuntoevento.blob.core.windows.net/public/...",
  "galleryCount": 1
}
```

### Perfil publico de empresa

| Caso | Endpoint | Status | Resultado |
| --- | --- | ---: | --- |
| Empresa publicada | `GET /api/public/companies/qa-company-register-test` | `200` | `services: 4`, todos `published` |
| Servicio seleccionado existe | `GET /api/public/companies/qa-company-register-test?service=qa-moderacion-approve-20260528113350` | `200` | `selectedServiceSlug` correcto |
| Servicio seleccionado no existe | `GET /api/public/companies/qa-company-register-test?service=no-existe` | `200` | `selectedServiceSlug: ""` |
| Empresa inexistente | `GET /api/public/companies/no-existe-task-069` | `404` | Correcto |
| Empresa pendiente QA | `GET /api/public/companies/qa-public-hidden-20260528192830` | `404` | Correcto |
| Metodo no permitido | `POST /api/public/companies/qa-company-register-test` | `404` | Azure routing no entra al handler |

Servicios del perfil publicado:

```text
count: 4
statuses unicos: published
```

El servicio rechazado conocido de TASK-064 no aparecio:

```text
service_8089b37c-1b61-4209-9e9b-3a5eda4cf729 present: false
```

## Imagen publica

`coverUrl` del primer servicio:

```text
https://storagepuntoevento.blob.core.windows.net/public/...
```

Validacion anonima:

```text
HTTP 200
Content-Type: image/png
Content-Length: 67
URL sin query/SAS: true
```

La galeria tambien se devuelve con URL en container `public`.

## Seguridad de respuesta

Se revisaron los payloads de:

- `GET /api/public/services`
- `GET /api/public/companies/qa-company-register-test`
- filtros y variantes consultadas

No se detectaron:

- `email`
- `phone`
- cookies
- `sessionHash`
- `tokenHash`
- `partitionKey`
- `rowKey`
- `pendingBlobName`
- `uploads-pending`
- connection strings
- account keys
- SAS tokens (`sig=`, `sv=`)

## Hallazgos

### Observacion P3 - Metodos no GET devuelven 404 en Azure

Resultado:

```text
POST /api/public/services -> 404
POST /api/public/companies/qa-company-register-test -> 404
```

Evaluacion:

No bloquea avanzar porque:

- `GET` funciona correctamente.
- Los endpoints son anonimos de lectura.
- No se expone informacion privada.
- El comportamiento era esperado por la configuracion `methods: ["get"]` en Azure Functions.

Si Product/Architect quiere contrato estricto `405`, Backend deberia permitir que el trigger reciba otros metodos y dejar que el handler responda `405`.

## Riesgos restantes

- La prueba uso datos QA reales existentes; no se probaron datos productivos de proveedores reales.
- El dataset publico actual tiene 4 servicios publicados; `limit=999` no pudo demostrar el corte exacto en `50`, solo que no rompe y devuelve los datos disponibles.
- No se probo ranking, planes destacados ni paginacion real porque estan fuera de alcance.
- Quedan datos QA persistidos, incluida la empresa pendiente creada para esta prueba.
- Sigue pendiente la QA visual complementaria de imagen publica en navegador normal mencionada en TASK-066.

## Recomendacion

Listo para Frontend/Web Dev conectar la pagina publica a los endpoints publicos por servicio.

Recomendacion adicional para Product/Architect:

```text
Aceptar el 404 para POST como comportamiento de routing Azure o abrir tarea pequena de Backend si se quiere forzar 405 contractual.
```
