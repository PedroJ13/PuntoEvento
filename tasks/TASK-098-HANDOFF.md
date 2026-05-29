# TASK-098 Handoff

## Resultado general

Completado.

La pestana `Modelo nuevo` de `admin.html` ya consume los listados internos reales para moderar:

- Companies pendientes.
- Services revisables.
- Uploads pendientes.

Tambien permite aprobar o rechazar cada item desde la UI interna usando los endpoints `POST` existentes.

## Archivos modificados

- `admin.html`
- `admin.css`
- `admin.js`

No se modifico la pagina publica.

## Como funciona la UI

En `admin.html`, despues de login admin real:

1. El admin abre la pestana `Modelo nuevo`.
2. La UI carga tres secciones:
   - `Empresas pendientes`
   - `Servicios revisables`
   - `Imagenes pendientes`
3. Cada seccion muestra:
   - estado de carga;
   - estado vacio;
   - error aislado si falla solo ese listado;
   - contador;
   - tarjetas con datos permitidos;
   - botones `Aprobar` y `Rechazar`.
4. Rechazar usa `window.prompt` para motivo MVP.
5. Tras aprobar/rechazar, se refresca solo el listado afectado y se muestra feedback en la barra superior.
6. El boton `Actualizar` refresca el modelo nuevo cuando esa pestana esta activa.

El flujo legacy de proveedores sigue usando `admin/pending-providers` y no fue reemplazado.

## Endpoints consumidos

Listados:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Acciones:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

## Campos renderizados

Companies:

- `companyId`
- `name`
- `email`
- `whatsapp`
- `province`
- `canton`
- `description`
- `status`
- `plan`
- `createdAt`

Services:

- `companyId`
- `companyName`
- `serviceId`
- `name`
- `category`
- `eventTypes`
- `priceFrom`
- `description`
- `status`
- conteo de imagenes por `coverUrl`/`gallery`, sin mostrar URLs.

Uploads:

- `companyId`
- `uploadId`
- `scope`
- `serviceId`
- `imageType`
- `fileName`
- `contentType`
- `size`
- `status`

## Confirmacion de no secretos

No se renderizan ni se guardan en DOM visible estos campos prohibidos:

```text
tokenHash
sessionHash
pendingBlobName
pendingBlobUrl
uploadUrl
sig=
AccountKey
connectionString
partitionKey
rowKey
cookie
pe_company_session
```

Verificacion:

- `rg` sobre `admin.html`, `admin.css`, `admin.js` no encontro esos nombres.
- Harness con mocks incluyo campos prohibidos en respuestas falsas y confirmo que no aparecen en HTML renderizado.

## Como se probo

- `node --check admin.js`: OK.
- `git diff --check -- admin.html admin.css admin.js`: OK.
- Mocks de `fetch` en Node VM:
  - carga companies/services/uploads desde endpoints internos;
  - renderiza datos permitidos;
  - muestra vacio por tipo cuando `items=[]`;
  - maneja error de un listado sin romper los otros;
  - `approve` llama endpoint correcto;
  - `reject` llama endpoint correcto con razon;
  - no renderiza campos prohibidos aunque vengan en el payload falso.
- Revision estatica de cache busting:
  - `admin.css?v=7`
  - `admin.js?v=10`

## Verificacion pendiente

- Smoke visual en navegador local desktop/mobile.
- QA Azure con credenciales reales para confirmar que:
  - la pestana carga los counts observados por TASK-097;
  - aprobar/rechazar refresca listas;
  - no aparecen secretos en DOM ni consola.

## Riesgos pendientes

- Uploads pendientes no tienen preview visual por alcance de TASK-098; la decision debe esperar un endpoint interno seguro de preview si Product lo necesita.
- Rechazo usa `window.prompt`, suficiente para MVP interno pero no ideal para operacion larga.
- Si una accion `POST` cambia estado correctamente pero el refresh posterior falla, el feedback puede quedar ambiguo hasta presionar `Actualizar`.

## Recomendacion para QA local

Validar `admin.html` con mocks o ambiente local API:

1. Login admin legacy sigue cargando `Revision`.
2. Abrir `Modelo nuevo` carga tres listados.
3. Probar vacio en cada tipo.
4. Probar error en un tipo y confirmar que los otros se mantienen.
5. Aprobar/rechazar una empresa, un servicio y un upload.
6. Revisar DOM/consola por campos prohibidos.
7. Revisar mobile basico para que las tarjetas no tengan overflow horizontal.
