# TASK-067 Handoff

## Resultado general

Implementados los endpoints publicos MVP por servicio:

- `GET /api/public/services`
- `GET /api/public/companies/{slug}`

Ambos leen `Companies` y `Services` desde Azure Table Storage, devuelven solo contenido `published` y no requieren autenticacion.

No se modifico frontend ni endpoints legacy `providers`.

## Endpoints implementados

### `GET /api/public/services`

Query params soportados:

- `q`
- `category`
- `eventType`
- `province`
- `limit`
- `cursor`

Reglas implementadas:

- Lista solo servicios con `Services.status=published`.
- Incluye solo servicios cuya empresa tambien tiene `Companies.status=published`.
- `q` filtra por `name`, `description`, `category` y `eventTypes`.
- `category`, `eventType` y `province` filtran por match exacto normalizado.
- `limit` tiene maximo `50`; default `20`.
- `cursor` queda reservado; por ahora siempre responde `nextCursor: ""`.
- Incluye `coverUrl` y `gallery` publicados cuando existen.
- No devuelve `email`, hashes, cookies, `partitionKey`, `rowKey`, `pendingBlobName` ni metadata interna.

### `GET /api/public/companies/{slug}`

Reglas implementadas:

- Busca empresa por `slug`.
- Responde `404` si no existe o no esta `published`.
- Incluye solo servicios publicados de esa empresa.
- Soporta `?service=<serviceSlug>` devolviendo `selectedServiceSlug` si coincide con un servicio publicado devuelto; si no coincide, devuelve `selectedServiceSlug: ""`.
- No devuelve datos privados ni imagenes pendientes.

## Archivos modificados

- `api/shared/publicCatalog.js`
- `api/public-services/function.json`
- `api/public-services/index.js`
- `api/public-company-profile/function.json`
- `api/public-company-profile/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `tasks/TASK-067-HANDOFF.md`

Nota: el repo ya tenia cambios sin commit en `docs/README.md`, `tasks/README.md`, `docs/CODEX_COORDINATION_AUTOMATION.md` y `tools/codex-coordination.ps1`; no se tocaron ni revirtieron.

## Contratos finales

`GET /api/public/services` responde:

```json
{
  "items": [
    {
      "id": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "category": "Mesas de dulces",
      "eventTypes": ["Bodas"],
      "description": "...",
      "priceFrom": "CRC 120000",
      "coverUrl": "https://...",
      "gallery": ["https://..."],
      "company": {
        "id": "company_123",
        "slug": "aurisbel",
        "name": "Aurisbel",
        "province": "Heredia",
        "canton": "San Francisco",
        "plan": "free",
        "logoUrl": "https://..."
      }
    }
  ],
  "nextCursor": ""
}
```

`GET /api/public/companies/{slug}` responde:

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "status": "published",
  "description": "...",
  "logoUrl": "https://...",
  "coverUrl": "https://...",
  "whatsapp": "50688888888",
  "website": "https://...",
  "instagram": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "district": "Heredia",
  "plan": "free",
  "selectedServiceSlug": "mesa-dulce",
  "services": [
    {
      "id": "service_123",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "category": "Mesas de dulces",
      "status": "published",
      "eventTypes": ["Bodas"],
      "description": "...",
      "priceFrom": "CRC 120000",
      "coverUrl": "https://...",
      "gallery": ["https://..."]
    }
  ]
}
```

Errores:

- `404` para empresa inexistente/no publicada en perfil publico.
- `405` si el metodo no es `GET`.
- `500` para error inesperado.

## Validaciones ejecutadas

- `node --check api/shared/publicCatalog.js`
- `node --check api/public-services/index.js`
- `node --check api/public-company-profile/index.js`
- `ConvertFrom-Json` para:
  - `api/public-services/function.json`
  - `api/public-company-profile/function.json`
- Prueba local con mocks cubrio:
  - metodo incorrecto responde `405`
  - `GET /api/public/services` responde `200` con `items`
  - servicios no publicados no aparecen
  - servicios de empresas no publicadas no aparecen
  - `q` filtra por nombre y descripcion
  - `category` filtra por categoria
  - `eventType` filtra por tipo de evento
  - `province` filtra por provincia de empresa
  - perfil publicado responde `200`
  - perfil incluye solo servicios publicados
  - `selectedServiceSlug` se setea cuando coincide
  - empresa no publicada responde `404`
  - empresa inexistente responde `404`
  - respuestas no exponen `email`, `phone`, hashes, `partitionKey`, `rowKey`, `pendingBlobName` ni metadata interna

## Riesgos y limitaciones

- Implementacion MVP usa scan de servicios publicados y lookup de empresas por `companyId`. Es aceptable temporalmente, pero se debe migrar a `ServiceIndex` o a una estrategia de busqueda/ranking cuando crezca el volumen.
- `cursor` no esta implementado aun; se responde `nextCursor: ""`.
- Orden actual es por `updatedAt/createdAt`, no por ranking, pago, featured ni relevancia avanzada.
- No se ejecuto QA contra Azure real en esta tarea.
- No se conecto frontend.

## Siguiente tarea recomendada

QA debe validar local/estructuralmente ambos endpoints publicos y luego QA/Infra debe validarlos post-deploy con datos publicados reales.

Cuando QA cierre la API publica, Frontend/Web Dev puede conectar la pagina publica para renderizar resultados por servicio.
