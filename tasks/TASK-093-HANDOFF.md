# TASK-093 Handoff

## Resultado general

Implementados los tres endpoints internos GET para listar pendientes del modelo nuevo y desbloquear la conexion de `admin.html` a Companies, Services y Uploads reales.

Los endpoints usan autenticacion admin existente, validan origen permitido y no devuelven campos internos/sensibles.

## Endpoints creados

Rutas exactas:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Carpetas Function:

```text
api/internal-companies-pending
api/internal-services-pending
api/internal-uploads-pending
```

Helper compartido:

```text
api/shared/internalPending.js
```

## Archivos modificados

- `api/shared/internalPending.js`
- `api/internal-companies-pending/function.json`
- `api/internal-companies-pending/index.js`
- `api/internal-services-pending/function.json`
- `api/internal-services-pending/index.js`
- `api/internal-uploads-pending/function.json`
- `api/internal-uploads-pending/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-093-HANDOFF.md`

Nota: antes de esta tarea ya habia cambios sin commit en `AGENTS.md`, `admin.html`, `admin.css`, varios docs y handoffs. No se revirtieron.

## Autenticacion usada

Los tres endpoints usan:

```js
requireAdminAuth(req, config)
```

Por lo tanto aceptan el header actual:

```text
X-Punto-Admin-Credential: Basic ...
```

Tambien conservan los equivalentes ya soportados por `api/shared/adminAuth.js`.

Tambien usan:

```js
enforceAllowedOrigin(req, config)
```

## Shape final de respuestas

### Companies pendientes

```json
{
  "items": [
    {
      "companyId": "company_...",
      "slug": "empresa-demo",
      "name": "Empresa Demo",
      "email": "contacto@example.com",
      "whatsapp": "50688888888",
      "province": "San Jose",
      "canton": "Santa Ana",
      "description": "Texto saneado",
      "status": "pending",
      "plan": "free",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Services revisables

Incluye `draft` y `pending`.

```json
{
  "items": [
    {
      "companyId": "company_...",
      "companyName": "Empresa Demo",
      "companySlug": "empresa-demo",
      "serviceId": "service_...",
      "slug": "mesa-dulce",
      "name": "Mesa dulce",
      "category": "Catering",
      "eventTypes": ["Bodas"],
      "priceFrom": "CRC 120000",
      "description": "Texto saneado",
      "status": "draft",
      "coverUrl": "",
      "gallery": [],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Uploads pendientes

```json
{
  "items": [
    {
      "companyId": "company_...",
      "uploadId": "upload_...",
      "scope": "service",
      "serviceId": "service_...",
      "imageType": "cover",
      "fileName": "foto.jpg",
      "contentType": "image/jpeg",
      "size": 12345,
      "status": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

## Como se probo

Checks ejecutados:

```text
node --check api/shared/internalPending.js
node --check api/internal-companies-pending/index.js
node --check api/internal-services-pending/index.js
node --check api/internal-uploads-pending/index.js
ConvertFrom-Json en los tres function.json nuevos
```

Prueba local con mocks cubrio:

- auth faltante devuelve `401`;
- metodo distinto de `GET` devuelve `405`;
- companies lista solo `status=pending`;
- services lista solo `status=draft` y `status=pending`;
- services enriquece `companyName` y `companySlug`;
- uploads lista solo `status=pending`;
- arrays `eventTypes` y `gallery` se parsean correctamente;
- no aparecen `published`, `rejected`, `inactive` ni otros estados fuera de alcance.

Tambien se ejecuto `rg` sobre los archivos nuevos para buscar campos prohibidos.

## Campos prohibidos

Confirmado: los payloads no exponen:

- `tokenHash`
- `sessionHash`
- cookies
- `pendingBlobName`
- `pendingBlobUrl`
- URL SAS con `sig=`
- connection strings
- account keys
- `partitionKey`
- `rowKey`

Los IDs necesarios se devuelven con nombres seguros:

- `companyId`
- `serviceId`
- `uploadId`

## Riesgos pendientes

- No se ejecuto QA contra Azure real en esta tarea.
- Los listados usan queries por estado en Table Storage; para MVP es suficiente, pero si crece el volumen conviene indices/materializaciones especificas para moderacion.
- No hay preview visual de uploads pendientes. Si Product/Admin lo necesita, recomiendo crear un endpoint interno autenticado que proxyee la imagen sin exponer SAS ni `pendingBlobUrl`.
- Services `draft` y `pending` se consideran revisables hasta que Product decida si hace falta endpoint explicito `submit-review`.

## Estado para QA

Listo para QA local/estructural.

No hay bloqueo conocido para que Web Dev conecte la pestana `Modelo nuevo` de `admin.html` despues de QA.
