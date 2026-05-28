# TASK-063: QA local/estructural de internal moderation

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-062` con endpoints internos para aprobar/rechazar:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

Estos endpoints usan autenticacion interna admin y no deben commitearse/pushearse hasta pasar QA local/estructural.

## Archivos que debes leer

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

## Objetivo

Validar local/estructuralmente que la moderacion interna cumple contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de `api/shared/internalModeration.js` y los seis `index.js` nuevos.
- Los seis `function.json` son JSON validos.
- Las rutas usan prefijo `internal/...` y no `admin/...`.
- Metodo distinto de `POST` responde `405`.
- Sin credencial admin responde `401`.
- Header `X-Punto-Admin-Credential` con Basic Auth valido pasa autenticacion.
- Entidad inexistente responde `404`.

Company:

- Approve cambia `Companies.status` a `published`.
- Reject cambia `Companies.status` a `rejected` y guarda `rejectionReason`.
- Response no expone metadata interna.

Service:

- Approve cambia `Services.status` a `published`.
- Reject cambia `Services.status` a `rejected` y guarda `rejectionReason`.
- Servicio inexistente responde `404`.
- Response no expone metadata interna.

Upload:

- Approve exige `status=pending`; otro estado responde `409`.
- Upload inexistente responde `404`.
- Upload con servicio destino inexistente responde `404` antes de publicar.
- Upload approve publica URL y guarda `publicBlobUrl`.
- Upload approve para `scope=service`, `imageType=cover`, actualiza `Services.coverUrl`.
- Upload approve para `scope=service`, `imageType=gallery`, agrega URL a `Services.gallery`.
- Upload approve para `scope=company`, `imageType=cover`, actualiza `Companies.coverUrl`.
- Upload approve para `scope=company`, `imageType=logo`, actualiza `Companies.logoUrl`.
- Upload reject cambia `Uploads.status` a `rejected` y guarda `rejectionReason`.
- Upload reject no publica URL.
- Response de upload approve/reject no expone `publicBlobName`, connection strings, account keys, hashes ni metadata interna.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No probar UI admin.
- No enviar emails.
- No implementar auditoria formal.

## Entregable

Crear:

```text
tasks/TASK-063-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Comandos ejecutados.
- Casos probados.
- Hallazgos con archivo y linea si aplica.
- Riesgos restantes.
- Recomendacion clara:
  - listo para commit/push, o
  - requiere ajuste antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-063. Product/Architect debe leer tasks/TASK-063-HANDOFF.md.
```
