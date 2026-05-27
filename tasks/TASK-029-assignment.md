# TASK-029: Backend renombrar endpoint invitaciones a internal

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-029-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-029-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-025-HANDOFF.md`
- `tasks/TASK-026-HANDOFF.md`
- `tasks/TASK-027-HANDOFF.md`
- `tasks/TASK-028-HANDOFF.md`

Codigo relevante:

- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`

## Objetivo

Renombrar el endpoint de generacion de invitaciones para evitar el prefijo reservado `admin`, manteniendo la misma seguridad y comportamiento.

## Cambio requerido

Cambiar de:

```text
Function folder: api/admin-company-invites
Route: admin/company-invites
URL: /api/admin/company-invites
```

A:

```text
Function folder: api/internal-company-invites
Route: internal/company-invites
URL: /api/internal/company-invites
```

## Reglas

- Mantener Basic Auth admin con `requireAdminAuth`.
- Mantener `enforceAllowedOrigin`.
- Mantener contrato de request/response.
- Mantener persistencia en `CompanyInvites`.
- No devolver `tokenHash`.
- No guardar token plano.
- No tocar `accept-invite` ni `logout`.
- No tocar UI.

## Limpieza

Eliminar o dejar fuera de uso:

```text
api/admin-company-invites
```

Preferencia:

Renombrar/remover la Function vieja para que no siga apareciendo en builds futuros.

## Documentacion

Actualizar si hace falta:

- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`

Product/Architect ya actualizo la decision general, pero Backend puede corregir detalles si el codigo requiere otro nombre final.

## Verificacion esperada

Ejecutar:

```text
node --check api/internal-company-invites/index.js
```

Validar `function.json`:

```text
route: internal/company-invites
methods: ["post"]
authLevel: anonymous
```

## Fuera de alcance

- No hacer deploy.
- No crear invitaciones reales.
- No cambiar endpoints legacy admin en esta tarea.
- No implementar `GET /api/companies/me`.

## Criterios de aceptacion

- Existe `api/internal-company-invites`.
- Ya no existe Function activa `api/admin-company-invites`, o queda claramente removida del build.
- Ruta nueva es `/api/internal/company-invites`.
- Seguridad y contrato se mantienen.
- Sintaxis OK.

## Handoff requerido

Crear:

```text
tasks/TASK-029-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados/eliminados.
- Ruta final.
- Verificacion ejecutada.
- Riesgos.
- Siguiente tarea recomendada.

## Al finalizar

Responder:

```text
Termine TASK-029. Product/Architect debe leer `tasks/TASK-029-HANDOFF.md`.
```
