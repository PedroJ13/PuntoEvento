# TASK-064: QA/Infra Azure de moderacion interna

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-063` aprobo local/estructuralmente los endpoints internos de moderacion. Product/Architect debe hacer commit/push del bloque antes de que ejecutes esta tarea.

Endpoints a validar en Azure real:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-061-HANDOFF.md`
- `tasks/TASK-062-HANDOFF.md`
- `tasks/TASK-063-HANDOFF.md`
- `local-secrets/qa-admin.ps1` si existe en tu entorno local

## Precondicion

Antes de probar, confirma que el deploy de Azure Static Web Apps termino para el commit que agrega los endpoints internos de moderacion.

No pongas secretos, cookies, SAS tokens ni credenciales en el handoff.

## Objetivo

Validar en Azure real que la moderacion interna puede aprobar/rechazar empresas, servicios y uploads pendientes usando datos controlados.

## Setup recomendado

1. Cargar credenciales admin desde `local-secrets/qa-admin.ps1` o variables de ambiente locales.
2. Construir header Basic y enviarlo como `X-Punto-Admin-Credential`.
3. Crear o reutilizar una empresa QA controlada.
4. Crear sesion de empresa mediante invite/accept si necesitas generar servicios y uploads reales.
5. Usar nombres/emails claramente QA para no mezclar datos reales.

## Alcance de pruebas

Autenticacion:

- Sin credencial admin debe responder `401`.
- Credencial admin valida por `X-Punto-Admin-Credential` debe permitir la accion.
- Metodo incorrecto debe responder `405` si es facil de probar.

Company:

- Aprobar una empresa QA pendiente o rechazada debe devolver `200` y dejar `Companies.status=published`.
- Rechazar una empresa QA debe devolver `200`, dejar `Companies.status=rejected` y guardar `rejectionReason` si se envio.
- Empresa inexistente debe responder `404`.

Service:

- Crear o reutilizar un servicio QA controlado.
- Aprobar servicio debe devolver `200` y dejar `Services.status=published`.
- Rechazar servicio debe devolver `200`, dejar `Services.status=rejected` y guardar `rejectionReason` si se envio.
- Servicio inexistente debe responder `404`.

Upload:

- Crear un upload real:
  - `POST /api/uploads/sign`
  - `PUT` al SAS del blob pendiente
  - `POST /api/uploads/confirm`
- Aprobar upload pendiente debe devolver `200`, dejar `Uploads.status=published` y guardar `publicBlobUrl`.
- Confirmar que el blob queda accesible/publicado segun el contenedor publico configurado.
- Para `scope=service`, `imageType=cover`, confirmar que actualiza `Services.coverUrl`.
- Para `scope=service`, `imageType=gallery`, confirmar que agrega URL a `Services.gallery`.
- Rechazar otro upload pendiente debe devolver `200`, dejar `Uploads.status=rejected` y no publicar URL.
- Upload inexistente debe responder `404`.
- Upload ya publicado/rechazado debe responder `409` si se intenta aprobar otra vez.

Seguridad:

- Las respuestas no deben exponer connection strings, account keys, hashes, cookies, SAS tokens, `partitionKey`, `rowKey`, `pendingBlobName` ni metadata interna.
- Redactar cualquier token/cookie/SAS en el handoff.

## Fuera de alcance

- No probar UI admin.
- No probar email.
- No implementar cambios de codigo.
- No rotar credenciales dentro de esta tarea, solo recordar si sigue pendiente.

## Entregable

Crear:

```text
tasks/TASK-064-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base Azure usada.
- Commit/deploy validado si lo tienes visible.
- Endpoints probados y estados HTTP.
- IDs QA usados, sin secretos.
- Evidencia de cambios en tablas/blob, redactando valores sensibles.
- Hallazgos y riesgos restantes.
- Recomendacion clara:
  - listo para seguir al siguiente bloque, o
  - requiere fix Backend/Infra antes de avanzar.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-064. Product/Architect debe leer tasks/TASK-064-HANDOFF.md.
```
