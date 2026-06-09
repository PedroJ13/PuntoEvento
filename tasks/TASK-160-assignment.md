# TASK-160: QA - validacion login recurrente empresa

## Equipo asignado

QA.

## Contexto

Depende de `TASK-158` y `TASK-159`.

## Tarea

Validar activacion por invitacion y login recurrente de empresa con email/password.

## Alcance

- Activacion inicial desde invite.
- Login recurrente con email/password.
- Logout.
- Sesion expirada o ausente.
- Credenciales invalidas.
- Empresa rechazada/suspendida si el contrato lo define.
- Permisos Empresa A vs Empresa B.

## No tocar

- Implementacion de codigo.
- Cambios de datos productivos no documentados.

## Verificacion

- Azure si ya esta desplegado; local/mock solo si el handoff anterior lo indica.
- Registrar resultado como aprobado, no aprobado o aprobado con observaciones.

## Handoff esperado

Crear `tasks/TASK-160-HANDOFF.md` con:

- Ambiente probado.
- Casos ejecutados.
- Bugs P0/P1/P2.
- Evidencia de no exposicion de datos sensibles.
- Recomendacion para Product / Architect / Release.
