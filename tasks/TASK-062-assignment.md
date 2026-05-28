# TASK-062: Backend internal approve/reject company service uploads

## Equipo asignado

Backend API.

## Contexto

Ya estan aprobados en Azure real:

- CRUD privado de servicios de empresa.
- `POST /api/uploads/sign`.
- `POST /api/uploads/confirm`.

Con esto una empresa puede crear/editar/desactivar servicios y subir imagenes pendientes. Falta el flujo interno para aprobar o rechazar contenido pendiente antes de publicarlo.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-058-HANDOFF.md`
- `tasks/TASK-061-HANDOFF.md`
- `api/admin-approve-provider/index.js`
- `api/admin-reject-provider/index.js`
- `api/internal-company-invites/index.js`
- `api/uploads-confirm/index.js`
- `api/company-services-list/index.js`
- `api/shared/adminAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Implementar endpoints internos para moderacion MVP:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

Si prefieres menos endpoints, puedes implementar una ruta generica interna, pero documenta el contrato claramente en el handoff.

## Reglas de autenticacion

- Usar autenticacion interna admin existente.
- Preferir `X-Punto-Admin-Credential`, compatible con lo validado en tareas previas.
- No usar prefijo Azure reservado `admin` para nuevas rutas.
- No exponer endpoints internos sin credencial.

## Reglas de producto

### Company

- Approve:
  - `Companies` pasa a `published`.
  - `updatedAt` cambia.
- Reject:
  - `Companies` pasa a `rejected`.
  - Guardar `rejectionReason` si se envia.

### Service

- Approve:
  - `Services` pasa a `published`.
  - `updatedAt` cambia.
- Reject:
  - `Services` pasa a `rejected`.
  - Guardar `rejectionReason` si se envia.
- No permitir aprobar/desaprobar servicio inexistente.

### Upload

- Approve:
  - Solo uploads `pending` pueden aprobarse.
  - Copiar o mover blob desde contenedor pendiente hacia contenedor publico reutilizando helpers existentes si aplican.
  - Cambiar upload a `published`.
  - Guardar `publicBlobUrl`.
  - Para MVP, si `scope=service`:
    - `imageType=cover` debe actualizar `Services.coverUrl`.
    - `imageType=gallery` debe agregar URL a `Services.gallery`.
  - Si `scope=company`, documentar si actualiza campo de empresa o solo deja upload publicado.
- Reject:
  - Upload pasa a `rejected`.
  - Guardar `rejectionReason` si se envia.
  - No publicar blob.

## Contratos minimos esperados

Request reject opcional:

```json
{
  "reason": "Imagen borrosa"
}
```

Response success:

```json
{
  "ok": true,
  "status": "published"
}
```

Errores:

```text
400 Validation error
401 Unauthorized
404 Not found
405 Method not allowed
409 Invalid state
500 Unexpected server error
```

## Criterios de aceptacion

- Sin credencial admin responde `401`.
- Metodo incorrecto responde `405`.
- Entidad inexistente responde `404`.
- Approve/reject cambia estado correcto.
- Upload approve publica URL y no expone secretos.
- Upload reject no publica URL.
- Response no expone metadata interna de Table/Blob.
- `node --check` pasa en archivos nuevos/modificados.

## Fuera de alcance

- No crear UI admin.
- No enviar emails.
- No implementar auditoria completa si no existe helper aun.
- No implementar pagos/ranking.

## Entregable

Crear:

```text
tasks/TASK-062-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Endpoints implementados.
- Archivos modificados.
- Contratos implementados.
- Validaciones realizadas.
- Riesgos restantes.
- Siguiente tarea recomendada.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-062. Product/Architect debe leer tasks/TASK-062-HANDOFF.md.
```
