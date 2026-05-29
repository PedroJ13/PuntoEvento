# TASK-095: QA Azure de listados internos de moderacion

## Equipo asignado

QA / Infra Azure.

## Dependencia

Product/Architect debe hacer commit/push del bloque de TASK-093/TASK-094 antes de ejecutar esta tarea.

Esperar a que termine el deploy de Azure Static Web Apps para el commit que incluya:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

## Contexto

`TASK-093` implemento los endpoints internos de listado para desbloquear la moderacion nueva desde UI.

`TASK-094` aprobo QA local/estructural con mocks y verifico:

- auth admin;
- metodo `GET`;
- filtros por estado;
- payloads saneados;
- ausencia de campos prohibidos.

Ahora hace falta validar contra Azure real antes de que Web Dev conecte `admin.html`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-093-HANDOFF.md`
- `tasks/TASK-094-HANDOFF.md`
- `api/shared/internalPending.js`
- `api/internal-companies-pending/function.json`
- `api/internal-services-pending/function.json`
- `api/internal-uploads-pending/function.json`

## Base URL

Usar el ambiente Azure actual:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Objetivo

Validar en Azure real que los endpoints internos de listado funcionan, estan protegidos por credencial admin y no exponen secretos.

## Casos requeridos

Para cada endpoint:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Validar:

1. Sin credencial admin responde `401`.
2. Credencial admin invalida responde `401`.
3. Metodo no permitido, por ejemplo `POST`, responde `405`.
4. Con credencial admin valida responde `200`.
5. Respuesta tiene shape:
   - objeto con `items`;
   - `items` es array.
6. No aparecen campos prohibidos en el JSON.

## Validacion con datos reales

Si hay datos pendientes existentes en Azure, validar al menos un item por tipo cuando sea posible:

- Companies:
  - solo `status=pending`;
  - usa `companyId`.
- Services:
  - solo `status=draft` o `status=pending`;
  - usa `companyId` y `serviceId`;
  - `eventTypes` y `gallery` son arrays.
- Uploads:
  - solo `status=pending`;
  - usa `companyId` y `uploadId`.

Si no hay datos pendientes para algun tipo, crear datos QA controlados usando flujos existentes:

- Registrar empresa por `POST /api/companies/register` para Company pending.
- Crear invitacion y aceptar panel si se necesita crear Service draft.
- Crear upload real si se necesita Upload pending.

No pegar tokens, cookies, SAS ni credenciales en el handoff.

## Campos prohibidos

Confirmar que no aparecen:

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

## Fuera de alcance

- Conectar `admin.html`.
- Aprobar/rechazar desde UI.
- Crear endpoint `submit-review`.
- Crear preview visual de uploads pendientes.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-095-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Commit/deploy validado si lo puedes identificar.
- Casos ejecutados y status por endpoint.
- Datos QA creados, saneados.
- Confirmacion de campos prohibidos.
- Riesgos pendientes.
- Recomendacion: listo para Web Dev conectar `admin.html`, o requiere Backend/API.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-095. Product/Architect debe leer tasks/TASK-095-HANDOFF.md.
```
