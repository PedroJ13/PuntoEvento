# TASK-169: QA Azure - login recurrente empresa

## Equipo asignado

QA.

## Contexto

Depende de `TASK-168`.

## Tarea

Validar en Azure real activacion por invitacion y login recurrente empresa con email/password.

## Alcance

- Activacion inicial con invite y password.
- Login recurrente con email/password.
- Logout.
- Refresh con sesion vigente.
- Sesion ausente/expirada.
- Credenciales invalidas con mensaje generico.
- Empresa rechazada/suspendida si existe dato controlado.
- No exposicion de `passwordHash`, tokens, cookies crudas ni metadata interna.

## Verificacion

- Azure desplegado por `TASK-168`.
- Desktop y mobile basico para `panel.html`.
- Clasificar P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-169-HANDOFF.md` con ambiente probado, empresa/invitacion QA usada sin token completo, casos ejecutados, bugs/riesgos y resultado aprobado/no aprobado para pre-lanzamiento.
