# TASK-182: QA Azure - aprobar empresa envia email de activacion

## Equipo asignado

QA.

## Contexto

Depende de `TASK-180`, `TASK-181` y deploy correspondiente si los cambios no estan aun en Azure.

## Tarea

Validar en Azure que al aprobar una empresa se envia email de activacion y la empresa puede activar password/login.

## Alcance

- Registrar empresa QA con mailbox observable.
- Aprobar empresa desde admin interno.
- Confirmar mensaje admin de invitacion enviada.
- Confirmar email recibido con enlace de activacion.
- Activar password desde enlace.
- Login recurrente con email/password.
- Confirmar que no se exponen tokens/hashes/cookies/secretos.
- Validar comportamiento de reintento/no duplicado si el backend lo soporta.

## No tocar

- Codigo.
- Secretos.
- Datos reales sin limpieza documentada.

## Verificacion

- Azure real.
- Mailbox observable.
- Clasificar P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-182-HANDOFF.md` con ambiente probado, empresa QA usada, casos ejecutados, evidencia de email sin token completo, bugs/riesgos y recomendacion go/no-go para invites.
