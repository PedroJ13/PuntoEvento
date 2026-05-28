# TASK-062 Handoff

## Resultado general

Implementados endpoints internos para aprobar y rechazar empresas, servicios y uploads pendientes dentro del modelo `Company -> Services`.

La moderacion usa la autenticacion interna existente con `requireAdminAuth`, por lo que acepta el header validado en tareas previas `X-Punto-Admin-Credential` con Basic Auth. No se uso el prefijo reservado `/api/admin/...`.

## Endpoints implementados

- `POST /api/internal/companies/{companyId}/approve`
- `POST /api/internal/companies/{companyId}/reject`
- `POST /api/internal/services/{companyId}/{serviceId}/approve`
- `POST /api/internal/services/{companyId}/{serviceId}/reject`
- `POST /api/internal/uploads/{companyId}/{uploadId}/approve`
- `POST /api/internal/uploads/{companyId}/{uploadId}/reject`

## Archivos modificados

- `api/shared/internalModeration.js`
- `api/internal-companies-approve/function.json`
- `api/internal-companies-approve/index.js`
- `api/internal-companies-reject/function.json`
- `api/internal-companies-reject/index.js`
- `api/internal-services-approve/function.json`
- `api/internal-services-approve/index.js`
- `api/internal-services-reject/function.json`
- `api/internal-services-reject/index.js`
- `api/internal-uploads-approve/function.json`
- `api/internal-uploads-approve/index.js`
- `api/internal-uploads-reject/function.json`
- `api/internal-uploads-reject/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `tasks/TASK-062-HANDOFF.md`

Nota: el repositorio ya tenia otros cambios sin commit antes de esta tarea; no se revirtieron.

## Contratos implementados

Approve/reject de company y service responden:

```json
{
  "ok": true,
  "status": "published"
}
```

o:

```json
{
  "ok": true,
  "status": "rejected"
}
```

Reject acepta body opcional:

```json
{
  "reason": "Imagen borrosa"
}
```

Approve de upload responde:

```json
{
  "ok": true,
  "status": "published",
  "publicBlobUrl": "https://..."
}
```

Upload approve:

- exige estado `pending`;
- copia el blob pendiente al contenedor publico con el mismo path `companies/...`;
- guarda `publicBlobName`, `publicBlobUrl`, `status: published` y `updatedAt` en `Uploads`;
- intenta borrar el blob pendiente despues de publicar;
- si `scope=service` e `imageType=cover`, actualiza `Services.coverUrl`;
- si `scope=service` e `imageType=gallery`, agrega la URL a `Services.gallery`;
- si `scope=company` e `imageType=cover`, actualiza `Companies.coverUrl`;
- si `scope=company` e `imageType=logo`, actualiza `Companies.logoUrl`;
- si `scope=company` e `imageType=gallery`, solo deja el upload publicado porque el MVP no define `Company.gallery`.

Upload reject:

- cambia `Uploads.status` a `rejected`;
- guarda `rejectionReason` si se envia;
- no copia ni publica el blob.

Errores cubiertos:

- `400` para parametros faltantes.
- `401` sin credencial admin.
- `404` para entidad inexistente.
- `405` con metodo distinto de `POST`.
- `409` para estado invalido.
- `500` para error inesperado.

## Validaciones realizadas

- `node --check api/shared/internalModeration.js`
- `node --check` en los seis `index.js` nuevos.
- Parse JSON de los seis `function.json` nuevos con `ConvertFrom-Json`.
- Prueba local con mocks cubrio:
  - sin credencial admin `401`
  - metodo incorrecto `405`
  - company inexistente `404`
  - company approve cambia a `published`
  - company reject cambia a `rejected` y guarda razon
  - service approve cambia a `published`
  - service reject cambia a `rejected` y guarda razon
  - upload inexistente `404`
  - upload no `pending` responde `409`
  - upload con servicio destino inexistente responde `404` antes de copiar a publico
  - upload approve publica URL, guarda `publicBlobUrl` y actualiza `Services.coverUrl`
  - upload approve agrega URL a `Services.gallery`
  - upload reject no publica URL
  - respuestas no exponen `publicBlobName`, connection strings, account keys, hashes ni metadata interna

## Riesgos restantes

- Falta QA local/estructural independiente y QA post-deploy en Azure real con credencial admin controlada.
- No hay auditoria formal de aprobaciones/rechazos; solo queda `status`, `rejectionReason` y `updatedAt`.
- Si el borrado del blob pendiente falla despues de publicar, la respuesta sigue siendo exitosa y queda limpieza pendiente.
- No se implemento UI admin.
- No se enviaron emails.
- `Company.gallery` no existe en el modelo MVP; uploads de empresa tipo `gallery` quedan publicados solo en `Uploads`.

## Siguiente tarea recomendada

QA debe validar local/estructuralmente los seis endpoints internos y luego QA/Infra debe validar post-deploy con datos controlados, blob real y credencial `X-Punto-Admin-Credential`.

Despues de esa validacion, Backend puede avanzar con endpoints publicos de servicios publicados o con auditoria basica de moderacion.
