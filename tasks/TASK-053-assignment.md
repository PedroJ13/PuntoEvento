# TASK-053: QA local/estructural de DELETE company services

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-052` con:

```text
DELETE /api/companies/me/services/{serviceId}
```

Este endpoint hace borrado logico de servicios propios: marca `status: inactive` y conserva la entidad en Table Storage.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-052-HANDOFF.md`
- `api/company-services-delete/function.json`
- `api/company-services-delete/index.js`
- `api/company-services-list/function.json`
- `api/company-services-list/index.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/azure.js`

## Objetivo

Validar local/estructuralmente que `DELETE /api/companies/me/services/{serviceId}` cumple el contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS nuevos o modificados.
- `api/company-services-delete/function.json` es JSON valido.
- La ruta es `companies/me/services/{serviceId}`.
- El metodo permitido es `DELETE`.
- Sin cookie/sesion valida responde `401`.
- Metodo distinto de `DELETE` responde `405`.
- Sin `serviceId` responde `400`.
- Servicio inexistente responde `404`.
- Servicio de otra empresa responde `404`.
- Con sesion valida desactiva solo servicio propio.
- No borra fisicamente la entidad.
- Persistencia queda con `status: inactive`.
- `updatedAt` cambia.
- `createdAt` se conserva.
- Response `200` no expone metadata interna:
  - `partitionKey`
  - `rowKey`
  - `etag`
  - `timestamp`
  - hashes
  - tokens
  - cookies
- Response `200` no expone campos de ranking o monetizacion:
  - `sortBoost`
  - `isFeatured`
  - `featuredUntil`
- `GET /api/companies/me/services` refleja el servicio con `status: inactive`.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No modificar UI.
- No implementar restauracion/reactivacion.
- No implementar upload de imagenes.

## Entregable

Crear:

```text
tasks/TASK-053-HANDOFF.md
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
Termine TASK-053. Product/Architect debe leer tasks/TASK-053-HANDOFF.md.
```
