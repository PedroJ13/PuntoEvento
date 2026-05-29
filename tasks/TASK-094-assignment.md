# TASK-094: QA local/estructural de listados internos de moderacion

## Equipo asignado

QA.

## Contexto

`TASK-093` implemento los endpoints internos GET que desbloquean la UI admin del modelo nuevo:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Estos endpoints deben permitir que `admin.html` liste Companies, Services y Uploads pendientes sin exponer secretos ni campos internos.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-093-HANDOFF.md`
- `api/shared/internalPending.js`
- `api/shared/adminAuth.js`
- `api/shared/guard.js`
- `api/internal-companies-pending/function.json`
- `api/internal-companies-pending/index.js`
- `api/internal-services-pending/function.json`
- `api/internal-services-pending/index.js`
- `api/internal-uploads-pending/function.json`
- `api/internal-uploads-pending/index.js`

## Objetivo

Validar local/estructuralmente que los tres endpoints internos de listado cumplen el contrato antes de commit/push/deploy.

## Alcance de QA

Validar:

1. `function.json` de cada endpoint:
   - metodo `GET`;
   - `authLevel` consistente con los endpoints internos existentes;
   - rutas exactas:
     - `internal/companies/pending`
     - `internal/services/pending`
     - `internal/uploads/pending`
2. Sintaxis:
   - `node --check api/shared/internalPending.js`
   - `node --check api/internal-companies-pending/index.js`
   - `node --check api/internal-services-pending/index.js`
   - `node --check api/internal-uploads-pending/index.js`
3. Autenticacion:
   - sin credencial admin debe responder `401`;
   - credencial invalida debe responder `401`;
   - credencial valida permite listar.
4. Metodo:
   - metodos distintos de `GET` deben responder `405`.
5. Companies:
   - lista solo empresas con `status=pending`;
   - no lista `published`, `rejected`, `suspended` ni otros estados;
   - payload usa `companyId`, no `partitionKey` ni `rowKey`.
6. Services:
   - lista solo servicios `draft` y `pending`;
   - no lista `published`, `rejected`, `inactive` ni otros estados;
   - parsea `eventTypes` y `gallery` como arrays;
   - enriquece con `companyName` y `companySlug` cuando exista empresa;
   - payload usa `companyId` y `serviceId`, no `partitionKey` ni `rowKey`.
7. Uploads:
   - lista solo uploads `pending`;
   - no lista `reserved`, `published`, `rejected` ni otros estados;
   - payload usa `companyId` y `uploadId`, no `partitionKey` ni `rowKey`.
8. Seguridad:
   - no devuelve ni renderiza campos prohibidos.

## Campos prohibidos

Confirmar con pruebas o inspeccion que las respuestas no incluyan:

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

## Datos y entorno

- Esta tarea es local/estructural. No requiere Azure real.
- Usar mocks/harness si el proyecto no tiene emulador de Table Storage configurado.
- No escribir secretos en handoff.
- No modificar implementacion salvo que sea estrictamente necesario para arreglar un bug de prueba; si modificas, documentarlo.

## Fuera de alcance

- Conectar `admin.html`.
- Probar Azure real.
- Aprobar/rechazar desde UI.
- Crear endpoint `submit-review`.
- Crear preview visual de uploads pendientes.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-094-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, bloqueado o requiere cambios.
- Casos ejecutados y resultados.
- Confirmacion de campos prohibidos.
- Archivos revisados/modificados.
- Comandos ejecutados.
- Riesgos pendientes.
- Recomendacion: listo para commit/push + QA Azure, o requiere Backend/API.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-094. Product/Architect debe leer tasks/TASK-094-HANDOFF.md.
```
