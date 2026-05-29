# TASK-085 Handoff

## Resultado general

Bloqueado parcialmente por falta de endpoints de listado para el modelo nuevo.

Se actualizo `admin.html` para mostrar una pestana interna `Modelo nuevo` que explica el bloqueo de forma visible y lista los endpoints minimos que Backend/API debe crear antes de conectar moderacion real de Companies, Services y Uploads desde UI.

No se inventaron mocks ni datos falsos que parezcan reales.

## Endpoints de listado encontrados

No se encontraron endpoints de listado para pendientes del modelo nuevo.

Rutas internas existentes hoy:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

Estas acciones requieren IDs concretos. Sin endpoints de listado, la UI no puede saber que Companies, Services o Uploads estan pendientes.

## Endpoints minimos recomendados

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Requisitos:

- Requieren Basic Auth admin actual.
- No deben devolver `tokenHash`, `sessionHash`, cookies, SAS, connection strings, `pendingBlobName`, `partitionKey`, `rowKey` ni secretos.
- Deben devolver IDs publicables para accionar:
  - `companyId`
  - `serviceId`
  - `uploadId`
- Para uploads, deben devolver solo una URL de preview segura si backend decide habilitarla.

## Cambios realizados

- `admin.html`
  - Header actualizado de `Revision de proveedores` a `Revision interna`.
  - Agregada pestana `Modelo nuevo`.
  - Agregado estado visible: `Bloqueado por falta de endpoint de listado.`
  - Documentados endpoints minimos recomendados dentro de la UI.
  - Documentadas acciones internas ya disponibles cuando haya IDs.
  - Actualizado cache busting a `admin.css?v=6` y `admin.js?v=9`.
- `admin.css`
  - Agregados estilos para callout de bloqueo.
  - Agregadas tarjetas de endpoints responsivas.

`admin.js` no fue modificado en logica. El flujo legacy de login/listado/aprobacion de proveedores se conserva.

## Como se probo

- `node --check admin.js`: OK.
- `git diff --check -- admin.html admin.css admin.js`: OK.
- Revision estatica de rutas con `rg`:
  - existen acciones `POST /api/internal/.../approve|reject`;
  - no existen rutas `GET` para listar pendientes de Companies, Services o Uploads.
- Revision de compatibilidad:
  - `admin.js` conserva `loadProviders()` y el flujo legacy `admin/pending-providers`;
  - la nueva pestana no requiere datos falsos ni llamadas a APIs inexistentes.

## Riesgos pendientes

- Product Owner todavia no puede aprobar/rechazar Companies, Services ni Uploads del modelo nuevo desde UI.
- La moderacion nueva sigue dependiendo de llamadas API/manuales con IDs conocidos.
- Cuando Backend/API agregue listados, Web Dev debe conectar la UI real y probar aprobar/rechazar con mocks o Azure QA.
- No se ejecuto smoke visual en navegador en esta pasada; el cambio CSS usa grid responsive y no toca pagina publica.

## Siguiente tarea recomendada Backend/API

Crear endpoints de listado internos:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Despues de eso, crear una tarea Web Dev pequena para:

1. Consumir esos endpoints desde `admin.js`.
2. Renderizar listas reales por tipo.
3. Habilitar botones aprobar/rechazar usando los endpoints `POST` ya existentes.
4. Validar que no se rendericen secretos.

## Recomendacion para Product/Architect

Reasignar el siguiente paso a Backend/API. La UI ya deja claro el bloqueo y evita confundir a QA/Product Owner con datos demo.
