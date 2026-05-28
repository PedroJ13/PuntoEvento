# TASK-060: QA local/estructural de POST uploads confirm

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-059` con:

```text
POST /api/uploads/confirm
```

Este endpoint confirma que un upload reservado fue subido al blob pendiente, valida propiedades reales del blob y cambia la reserva de `reserved` a `pending`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-059-HANDOFF.md`
- `api/uploads-confirm/function.json`
- `api/uploads-confirm/index.js`
- `api/uploads-sign/function.json`
- `api/uploads-sign/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `api/shared/companyAuth.js`
- `api/shared/validation.js`

## Objetivo

Validar local/estructuralmente que `POST /api/uploads/confirm` cumple el contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar:

- `node --check` de archivos JS nuevos o modificados.
- `api/uploads-confirm/function.json` es JSON valido.
- La ruta es `uploads/confirm`.
- El metodo permitido es `POST`.
- Sin cookie/sesion valida responde `401`.
- Metodo distinto de `POST` responde `405`.
- Sin `uploadId` responde `400`.
- Upload inexistente responde `404`.
- Upload de otra empresa responde `404`.
- Upload expirado responde `409`.
- Upload en estado no confirmable, por ejemplo `published` o `rejected`, responde `409`.
- Blob ausente responde `404`.
- MIME real no permitido responde `415`.
- MIME real diferente al reservado responde `400`.
- Tamano real cero responde `400`.
- Tamano real mayor a 5 MB responde `413`.
- Confirmacion valida cambia reserva de `reserved` a `pending` y responde `201`.
- Confirmacion repetida de upload ya `pending` es idempotente y responde `200`.
- Se conserva `createdAt`.
- Se actualiza `updatedAt`.
- Se limpia `expiresAt` al confirmar, segun decision de TASK-059.
- Response no expone connection strings, account keys, hashes, cookies, `partitionKey`, `rowKey` ni metadata interna.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No subir bytes reales.
- No publicar imagenes.
- No mover blobs a contenedor publico.
- No asociar imagen a `coverUrl` ni `gallery`.
- No modificar UI.

## Entregable

Crear:

```text
tasks/TASK-060-HANDOFF.md
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
Termine TASK-060. Product/Architect debe leer tasks/TASK-060-HANDOFF.md.
```
