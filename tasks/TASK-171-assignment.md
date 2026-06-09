# TASK-171: QA Azure - emails internos de registro y revision

## Equipo asignado

QA.

## Contexto

Depende de `TASK-168`.

## Tarea

Validar en Azure real emails internos cuando una empresa se registra y cuando envia un servicio a revision.

## Alcance

- Registro de empresa nueva genera email interno.
- Servicio enviado a revision genera email interno.
- Evidencia de recepcion en mailbox interno o log observable.
- Confirmar que el flujo principal sigue funcionando aunque email falle, si Infra deja forma segura de probarlo.
- Confirmar que logs/errores no imprimen secretos.

## Verificacion

- Azure desplegado por `TASK-168`.
- Mailbox interno indicado por Infra.
- Clasificar hallazgos P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-171-HANDOFF.md` con ambiente probado, casos ejecutados, evidencia de emails/logs, bugs/riesgos y resultado aprobado/no aprobado para pre-lanzamiento.
