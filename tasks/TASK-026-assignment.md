# TASK-026: QA local/estructural endpoint admin invitaciones

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-026-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-026-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-024-HANDOFF.md`
- `tasks/TASK-025-HANDOFF.md`

Codigo a revisar:

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Validar local/estructuralmente el endpoint admin que genera invitaciones de empresa antes de commit/push/deploy.

## Endpoint

```text
POST /api/admin/company-invites
```

Function:

```text
api/admin-company-invites
```

## Alcance

Revisar:

- Sintaxis JS.
- `function.json` expone solo `POST`.
- Endpoint usa Basic Auth admin.
- Endpoint aplica `enforceAllowedOrigin`.
- `companyId` es requerido.
- Empresa inexistente devuelve `404`.
- Empresa existente crea invitacion `active`.
- Se guarda solo `tokenHash`.
- No se guarda token plano.
- Response incluye `inviteUrl`.
- Response no incluye `tokenHash`, connection strings ni secrets.
- No toca `accept-invite`, `logout`, pagina publica ni `panel.html`.

## Pruebas sugeridas

Checks de sintaxis:

```text
node --check api/admin-company-invites/index.js
node --check api/shared/companyAuth.js
node --check api/shared/azure.js
node --check api/shared/config.js
```

Validar `function.json`:

```text
route: admin/company-invites
methods: ["post"]
authLevel: anonymous
```

Nota:

`authLevel: anonymous` es aceptable porque la seguridad real se aplica con Basic Auth admin dentro del handler, igual que otros endpoints admin existentes.

## Si es posible usar mocks

Validar casos:

- Sin auth: `401`.
- Sin `companyId`: `400`.
- Company inexistente: `404`.
- Company existente: `201`.
- Response `201` trae `inviteUrl`.
- Entidad persistida tiene `tokenHash`.
- Entidad persistida no tiene token plano.
- Response no trae `tokenHash`.

## Fuera de alcance

- No llamar Azure real.
- No crear invitaciones reales.
- No hacer commit.
- No modificar codigo.
- No probar `accept-invite` con token real; eso vuelve a TASK-024 despues de deploy.

## Criterios de aceptacion

- Sin errores de sintaxis.
- Contrato coincide con docs.
- Endpoint protegido por admin Basic Auth.
- No hay exposicion de secretos ni tokenHash.
- Riesgos documentados.
- Recomendacion clara: aprobar para commit/deploy o devolver a Backend.

## Handoff requerido

Crear:

```text
tasks/TASK-026-HANDOFF.md
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
Termine TASK-026. Product/Architect debe leer `tasks/TASK-026-HANDOFF.md`.
```
