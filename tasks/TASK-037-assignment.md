# TASK-037: QA local/estructural GET companies me

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-037-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-037-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-036-HANDOFF.md`

Codigo a revisar:

- `api/companies-me/function.json`
- `api/companies-me/index.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Validar local/estructuralmente:

```text
GET /api/companies/me
```

antes de commit/push/deploy.

## Endpoint

```text
GET /api/companies/me
```

Function:

```text
api/companies-me
```

## Alcance

Revisar:

- Sintaxis JS.
- `function.json` expone solo `GET`.
- Route final es `companies/me`.
- Sin cookie/sesion devuelve `401`.
- Con sesion valida lee `Companies` usando el `companyId` derivado de la sesion.
- No acepta `companyId` desde query/body/header como autoridad.
- Response no incluye `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni metadata interna.
- No toca UI, servicios ni `PATCH /companies/me`.

## Pruebas sugeridas

Checks de sintaxis:

```text
node --check api/companies-me/index.js
node --check api/shared/companyAuth.js
node --check api/shared/azure.js
node --check api/shared/config.js
```

Validar `function.json`:

```text
route: companies/me
methods: ["get"]
authLevel: anonymous
```

Si es posible usar mocks:

- Sin cookie: `401`.
- Con sesion valida y empresa existente: `200`.
- Con sesion valida y empresa faltante: `404`.
- Response `200` no expone metadatos internos.

## Fuera de alcance

- No llamar Azure real.
- No crear sesiones reales.
- No modificar codigo.
- No hacer commit.
- No probar UI.

## Criterios de aceptacion

- Sin errores de sintaxis.
- Contrato coincide con docs.
- Company se deriva solo desde cookie/sesion.
- Sin sesion responde `401`.
- Payload `200` seguro.
- Riesgos documentados.
- Recomendacion clara: aprobar para commit/deploy o devolver a Backend.

## Handoff requerido

Crear:

```text
tasks/TASK-037-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Checks ejecutados.
- Hallazgos por severidad si existen.
- Bloqueos.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-037. Product/Architect debe leer `tasks/TASK-037-HANDOFF.md`.
```
