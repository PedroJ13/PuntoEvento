# TASK-067: Backend API endpoints publicos por servicio

## Equipo asignado

Backend API.

## Contexto

Ya estan funcionales en Azure:

- Registro de empresa.
- Auth por invitacion y sesion de empresa.
- CRUD privado de servicios.
- Upload firmado y confirmacion de upload.
- Moderacion interna de empresas, servicios y uploads.
- Acceso HTTP anonimo a blobs aprobados en container `public`.

`TASK-066` valido que `publicBlobUrl` responde `200`, tiene `Content-Type: image/png`, no usa SAS y entrega un PNG decodificable. La validacion visual en navegador normal queda pendiente como complemento no bloqueante.

Ahora necesitamos exponer datos publicos por servicio para que la pagina principal pueda buscar "mesa dulce" y mostrar el servicio, no solo la empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-062-HANDOFF.md`
- `tasks/TASK-064-HANDOFF.md`
- `tasks/TASK-066-HANDOFF.md`
- `api/company-services-list/index.js`
- `api/providers/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Implementar endpoints publicos MVP:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Estos endpoints deben leer `Companies` y `Services` desde Azure Table Storage y devolver solo contenido publicado.

## Contrato esperado

Basarse en `docs/API_CONTRACTS_MVP.md`.

### `GET /api/public/services`

Query params soportados para MVP:

```text
q
category
eventType
province
limit
cursor
```

Reglas:

- Devolver solo servicios con `Services.status=published`.
- Devolver solo servicios cuya empresa tenga `Companies.status=published`.
- Incluir datos publicos de empresa dentro de cada item.
- No devolver `email`, `sessionHash`, `tokenHash`, `partitionKey`, `rowKey`, metadata interna ni campos privados.
- No devolver imagenes pendientes ni `pendingBlobName`.
- Usar `coverUrl` y `gallery` publicados cuando existan.
- Limitar `limit` a un maximo razonable, por ejemplo 50.
- Si `cursor` no queda implementado en esta tarea, devolver `nextCursor: ""` y documentarlo.

### `GET /api/public/companies/{slug}`

Reglas:

- Buscar empresa por `slug`.
- Si no existe o no esta `published`, responder `404`.
- Incluir solo servicios `published` de esa empresa.
- Soportar query opcional `?service=<serviceSlug>` solo como dato de respuesta si es simple; si no, documentar que frontend puede destacar por slug usando la lista devuelta.
- No exponer datos privados.

## Consideraciones de implementacion

- Evitar prefijo reservado `admin`.
- Usar `authLevel: anonymous`, porque son endpoints publicos.
- Mantener validaciones defensivas de query params.
- Reusar helpers existentes si aplica, pero no romper endpoints legacy `providers`.
- Si Table Storage obliga a escanear para este MVP, documentarlo como aceptable temporalmente y dejar pendiente `ServiceIndex`/ranking para futuro.
- Mantener cambios pequenos y enfocados.

## Criterios de aceptacion

- `node --check` pasa para archivos nuevos/modificados.
- `function.json` validos.
- `GET /api/public/services` responde `200` con `items`.
- `GET /api/public/services?q=...` filtra por nombre/descripcion/categoria/eventTypes de forma basica.
- `GET /api/public/services?category=...` filtra por categoria.
- `GET /api/public/services?eventType=...` filtra por tipo de evento.
- `GET /api/public/services?province=...` filtra por provincia de empresa.
- Servicios de empresas no publicadas no aparecen.
- Servicios no publicados no aparecen.
- `GET /api/public/companies/{slug}` responde `200` solo para empresa publicada.
- Empresa no publicada o inexistente responde `404`.
- Respuestas no exponen secretos ni metadata interna.

## Fuera de alcance

- No conectar frontend todavia.
- No implementar ranking pago.
- No implementar leads/cotizaciones.
- No limpiar datos QA.
- No implementar cache/CDN.
- No cambiar auth de empresa.

## Entregable

Crear:

```text
tasks/TASK-067-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Endpoints implementados.
- Archivos modificados.
- Contratos finales.
- Validaciones ejecutadas.
- Riesgos/limitaciones, especialmente si hay scan de tablas.
- Siguiente tarea recomendada:
  - QA local/estructural de endpoints publicos, o
  - ajuste requerido antes de QA.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-067. Product/Architect debe leer tasks/TASK-067-HANDOFF.md.
```
