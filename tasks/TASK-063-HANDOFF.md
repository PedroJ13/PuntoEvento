# TASK-063 HANDOFF - QA local internal moderation

## Resultado general

Aprobado.

Los seis endpoints internos de moderacion cumplen el contrato local/estructural de TASK-063. No se encontraron bloqueantes.

Recomendacion: listo para commit/push.

## Objetivo

Validar local/estructuralmente los endpoints internos para aprobar/rechazar empresas, servicios y uploads antes de commit/push/deploy.

## Archivos revisados

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-062-HANDOFF.md`
- `api/shared/internalModeration.js`
- `api/shared/adminAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`
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

## Archivos tocados

- `tasks/TASK-063-HANDOFF.md`

No se cambio codigo de aplicacion.

## Comandos ejecutados

### Sintaxis JS

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/internalModeration.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-companies-approve/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-companies-reject/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-services-approve/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-services-reject/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-uploads-approve/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/internal-uploads-reject/index.js'
```

Resultado: OK, sin errores de sintaxis.

### function.json

Se parsearon los seis `function.json` con `ConvertFrom-Json` y se valido:

- JSON valido.
- Metodo permitido `post`.
- Ruta con prefijo `internal/...`.
- Ninguna ruta usa prefijo `admin/...`.

Rutas verificadas:

```text
internal/companies/{companyId}/approve
internal/companies/{companyId}/reject
internal/services/{companyId}/{serviceId}/approve
internal/services/{companyId}/{serviceId}/reject
internal/uploads/{companyId}/{uploadId}/approve
internal/uploads/{companyId}/{uploadId}/reject
```

### Bateria local con mocks

Se ejecuto una bateria local sobre los seis handlers con mocks de:

- Azure Table Storage para `Companies`, `Services` y `Uploads`.
- Azure Blob Storage pendiente/publico.
- Credencial admin via `X-Punto-Admin-Credential`.

Resultado:

```text
PASS internal moderation local QA cases: 18/18
```

## Casos probados

| Caso | Resultado |
| --- | --- |
| Metodo distinto de `POST` | `405` |
| Sin credencial admin | `401` |
| `X-Punto-Admin-Credential` con Basic Auth valido | pasa auth |
| Company inexistente | `404` |
| Company approve | `Companies.status=published` |
| Company reject | `Companies.status=rejected`, guarda `rejectionReason` |
| Service approve | `Services.status=published` |
| Service reject | `Services.status=rejected`, guarda `rejectionReason` |
| Service inexistente | `404` |
| Upload inexistente | `404` |
| Upload approve con estado no `pending` | `409` |
| Upload approve con servicio destino inexistente | `404` antes de publicar |
| Upload approve `scope=service`, `imageType=cover` | publica URL y actualiza `Services.coverUrl` |
| Upload approve `scope=service`, `imageType=gallery` | publica URL y agrega a `Services.gallery` |
| Upload approve `scope=company`, `imageType=cover` | publica URL y actualiza `Companies.coverUrl` |
| Upload approve `scope=company`, `imageType=logo` | publica URL y actualiza `Companies.logoUrl` |
| Upload reject | `Uploads.status=rejected`, guarda `rejectionReason` |
| Upload reject | no publica URL |

## Seguridad de respuesta

Se valido que las respuestas revisadas no expusieran:

- `publicBlobName`
- connection strings
- account keys
- hashes
- cookies
- `partitionKey`
- `rowKey`
- metadata interna

## Hallazgos

No se encontraron hallazgos bloqueantes.

Observaciones no bloqueantes:

- Upload approve copia el blob pendiente a publico y luego intenta borrar el pendiente; si el borrado falla, la publicacion sigue siendo exitosa. Esto ya esta documentado como riesgo esperado en TASK-062.
- No hay auditoria formal de moderacion; solo queda `status`, `rejectionReason` y `updatedAt`.
- `scope=company` con `imageType=gallery` queda publicado solo en `Uploads` porque el modelo MVP no define `Company.gallery`.

## Riesgos restantes

- Falta QA post-deploy contra Azure real con credencial admin controlada y blob real.
- No se probo UI admin, emails ni auditoria formal porque estan fuera de alcance.
- Falta confirmar en Azure real que los permisos de Storage permitan copiar de pendiente a publico y borrar pendiente.
- La rotacion de `ADMIN_PASSWORD` sigue pendiente segun backlog cuando cierre la ventana de pruebas controladas.

## Recomendacion

Listo para commit/push. Despues del deploy, ejecutar QA/Infra Azure de moderacion interna con datos controlados, credencial `X-Punto-Admin-Credential` y al menos un upload real pendiente.
