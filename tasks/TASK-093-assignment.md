# TASK-093: Endpoints internos de listado para moderacion nueva

## Equipo asignado

Backend/API.

## Contexto

`TASK-085` intento conectar `admin.html` al modelo nuevo, pero quedo bloqueado parcialmente: ya existen endpoints internos para aprobar/rechazar por ID, pero no existen endpoints para listar que Companies, Services y Uploads estan pendientes de revision.

Acciones existentes:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

El admin UI necesita listados reales para no depender de IDs manuales.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-085-HANDOFF.md`
- `api/shared/adminAuth.js`
- `api/shared/guard.js`
- `api/shared/http.js`
- `api/shared/azure.js`
- `api/shared/internalModeration.js`
- `api/internal-companies-approve/function.json`
- `api/internal-companies-approve/index.js`
- `api/internal-services-approve/function.json`
- `api/internal-services-approve/index.js`
- `api/internal-uploads-approve/function.json`
- `api/internal-uploads-approve/index.js`
- `api/companies-register/index.js`
- `api/company-services-create/index.js`
- `api/uploads-confirm/index.js`

## Objetivo

Crear endpoints internos GET para que `admin.html` pueda listar pendientes del modelo nuevo y luego accionar approve/reject con los endpoints existentes.

## Endpoints requeridos

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Implementacion sugerida:

- carpetas Function:
  - `api/internal-companies-pending`
  - `api/internal-services-pending`
  - `api/internal-uploads-pending`
- helper compartido opcional:
  - `api/shared/internalPending.js`

## Reglas de seguridad

- Usar `requireAdminAuth(req, config)` con el mismo header actual:
  - `X-Punto-Admin-Credential`
  - o equivalentes ya soportados por `adminAuth.js`.
- Mantener `enforceAllowedOrigin(req, config)`.
- No devolver ni loguear secretos.
- No devolver estos campos:
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
- Si hace falta devolver IDs, usar nombres seguros:
  - `companyId`
  - `serviceId`
  - `uploadId`

## Alcance funcional

### Companies pendientes

Debe listar entidades de `Companies` con:

```text
PartitionKey eq "company"
status eq "pending"
```

Payload sugerido:

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

Mientras no exista endpoint explicito `submit-review`, el MVP debe tratar servicios `draft` y `pending` como revisables por admin. Esto es consistente con `panel.html`: la empresa guarda el servicio y la UI explica que Punto Evento lo revisa.

Debe listar entidades de `Services` con status:

```text
draft OR pending
```

Payload sugerido:

```json
{
  "items": [
    {
      "companyId": "company_...",
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

Si es razonable sin costo alto, enriquecer cada servicio con `companyName` y `companySlug`; si no, dejarlo para Web Dev/otra tarea y documentarlo en el handoff.

### Uploads pendientes

Debe listar entidades de `Uploads` con:

```text
status eq "pending"
```

Payload sugerido:

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

No devolver `pendingBlobName` ni SAS. Si el equipo considera imprescindible preview visual para aprobacion, documentar propuesta segura separada, idealmente un endpoint autenticado que proxyee la imagen sin exponer SAS.

## Fuera de alcance

- Conectar `admin.html`.
- Cambiar endpoints approve/reject existentes salvo bug evidente.
- Crear endpoint `submit-review`.
- Enviar emails.
- Cambiar la pagina publica o `panel.html`.
- Borrar datos QA.

## Verificacion esperada

- `node --check` en archivos nuevos/modificados.
- Prueba estructural/local con mocks o harness de Table Storage:
  - auth faltante devuelve `401`;
  - metodo distinto de GET devuelve `405`;
  - lista companies pending sin campos prohibidos;
  - lista services draft/pending sin campos prohibidos;
  - lista uploads pending sin campos prohibidos;
  - no devuelve published/rejected/inactive/deleted cuando no corresponde.
- `rg` o test dedicado para confirmar que los payloads no incluyen:
  - `tokenHash`
  - `sessionHash`
  - `pendingBlobName`
  - `pendingBlobUrl`
  - `sig=`
  - `connectionString`
  - `accountKey`
- Actualizar `docs/API_CONTRACTS_MVP.md` con los tres endpoints nuevos.

## Entregable

Crear:

```text
tasks/TASK-093-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Endpoints creados y rutas exactas.
- Archivos modificados.
- Forma de autenticacion usada.
- Shape final de respuestas.
- Como se probo.
- Confirmacion explicita de campos prohibidos no expuestos.
- Riesgos pendientes.
- Si queda listo para QA local o si bloquea por algo.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-093. Product/Architect debe leer tasks/TASK-093-HANDOFF.md.
```
