# TASK-030: QA local/estructural endpoint internal invitaciones

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-030-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-030-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-029-HANDOFF.md`

Codigo a revisar:

- `api/internal-company-invites/function.json`
- `api/internal-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Validar local/estructuralmente que el endpoint de invitaciones fue renombrado correctamente para evitar el prefijo reservado `admin`.

## Endpoint final esperado

```text
POST /api/internal/company-invites
```

Function:

```text
api/internal-company-invites
```

## Alcance

Revisar:

- Sintaxis JS.
- `function.json` expone solo `POST`.
- Route final es `internal/company-invites`.
- Ya no existe una Function activa en `api/admin-company-invites` con archivos `function.json`/`index.js`.
- Handler mantiene Basic Auth admin.
- Handler mantiene `enforceAllowedOrigin`.
- Contrato de request/response se mantiene.
- Response `201` incluye `inviteUrl`.
- Response `201` no incluye `tokenHash`, connection strings ni secrets.
- Entidad persistida guarda `tokenHash` y no token plano.
- No se tocaron `accept-invite`, `logout`, pagina publica ni `panel.html`.

## Pruebas sugeridas

Checks de sintaxis:

```text
node --check api/internal-company-invites/index.js
node --check api/shared/companyAuth.js
node --check api/shared/azure.js
node --check api/shared/config.js
```

Validar `function.json`:

```text
route: internal/company-invites
methods: ["post"]
authLevel: anonymous
```

Si es posible usar mocks, repetir los casos de TASK-026:

- Sin auth: `401`.
- Auth incorrecto: `401`.
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
- No probar `accept-invite` con token real.

## Criterios de aceptacion

- Sin errores de sintaxis.
- Ruta final evita prefijo `admin`.
- Contrato y seguridad se mantienen.
- Function vieja no queda activa en el build.
- Riesgos documentados.
- Recomendacion clara: aprobar para commit/deploy o devolver a Backend.

## Handoff requerido

Crear:

```text
tasks/TASK-030-HANDOFF.md
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
Termine TASK-030. Product/Architect debe leer `tasks/TASK-030-HANDOFF.md`.
```
