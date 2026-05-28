# TASK-060 HANDOFF - QA local POST /api/uploads/confirm

## Resultado general

Aprobado.

`POST /api/uploads/confirm` cumple el contrato local/estructural de TASK-060. No se encontraron bloqueantes.

Recomendacion: listo para commit/push.

## Objetivo

Validar local/estructuralmente que `POST /api/uploads/confirm` confirma uploads reservados de empresas autenticadas, valida propiedades reales del blob pendiente y cambia reservas `reserved` a `pending` antes de commit/push/deploy.

## Archivos revisados

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

## Archivos tocados

- `tasks/TASK-060-HANDOFF.md`

No se cambio codigo de aplicacion.

## Comandos ejecutados

### Sintaxis JS

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/uploads-confirm/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/uploads-sign/index.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/azure.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/config.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/companyAuth.js'
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/shared/validation.js'
```

Resultado: OK, sin errores de sintaxis.

### function.json

```powershell
Get-Content -Raw 'api/uploads-confirm/function.json' | ConvertFrom-Json | Out-Null
```

Resultado: OK.

Validacion estructural:

- Ruta: `uploads/confirm`
- Metodo permitido: `post`
- Trigger HTTP anonimo con autenticacion de empresa validada dentro del handler.

### Bateria local con mocks

Se ejecuto el handler `api/uploads-confirm/index.js` con mocks de:

- sesion de empresa
- Azure Table Storage `Uploads`
- Azure Blob Storage `getProperties`

Resultado:

```text
PASS uploads/confirm local QA cases: 16/16
```

## Casos probados

| Caso | Resultado |
| --- | --- |
| Sin cookie/sesion valida | `401` |
| Metodo distinto de `POST` | `405` |
| Sin `uploadId` | `400` |
| Upload inexistente | `404` |
| Upload de otra empresa | `404` |
| Upload expirado | `409` |
| Upload `published` no confirmable | `409` |
| Upload `rejected` no confirmable | `409` |
| Blob ausente | `404` |
| MIME real no permitido | `415` |
| MIME real diferente al reservado | `400` |
| Tamano real cero | `400` |
| Tamano real mayor a 5 MB | `413` |
| Confirmacion valida de `reserved` | `201` |
| Confirmacion repetida de upload `pending` | `200` |
| Respuesta sin secretos/metadatos internos | OK |

## Validaciones sobre confirmacion valida

Se confirmo que una reserva `reserved` valida:

- Cambia a `status: pending`.
- Actualiza `size` con el tamano real del blob.
- Conserva `createdAt`.
- Actualiza `updatedAt`.
- Limpia `expiresAt`.
- Usa `PartitionKey` derivado de la sesion, ignorando `companyId` inyectado por cliente.
- Responde solo con campos del contrato publico: `uploadId`, `status`, `scope`, `serviceId`, `imageType`, `pendingBlobUrl`.

## Seguridad de respuesta

Las respuestas revisadas no expusieron:

- connection strings
- account keys
- hashes
- cookies
- `partitionKey`
- `rowKey`
- `pendingBlobName`
- metadata interna de Storage/Table

## Hallazgos

No se encontraron hallazgos bloqueantes.

Observacion no bloqueante:

- La idempotencia para uploads ya `pending` valida nuevamente el blob contra la reserva y responde `200`, pero no refresca `updatedAt`. Esto coincide con el comportamiento implementado y no contradice el contrato actual.

## Riesgos restantes

- Falta QA contra Azure real con cookie `pe_company_session`, reserva real, SAS real y blob real en `uploads-pending`.
- No se valido subida de bytes reales en esta tarea porque esta fuera de alcance.
- No existe aun limpieza automatica de reservas/blobs pendientes expirados.
- `pending` todavia no actualiza `coverUrl`, `logoUrl` ni `gallery`; queda para flujo posterior de revision/publicacion.

## Recomendacion

Listo para commit/push. Despues del deploy, ejecutar QA/Infra Azure de `POST /api/uploads/confirm` con sesion real y blob real.
