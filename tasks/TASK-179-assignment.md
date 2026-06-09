# TASK-179: QA Azure - reintento emails reales ACS post-deploy

## Equipo asignado

QA.

## Contexto

Depende de `TASK-178`.

`TASK-177` no aprobo porque el backend ACS no estaba desplegado. Infra debe completar deploy primero.

## Tarea

Reintentar validacion de emails reales en Azure usando Azure Communication Services Email despues del deploy backend ACS.

## Alcance

- Cotizacion publica genera email a empresa y responde exito.
- Registro de empresa genera email interno.
- Servicio enviado a revision genera email interno.
- Confirmar evidencia en mailbox/log observable.
- Confirmar responses sin secretos ni detalles ACS sensibles.
- Confirmar que no hay P0/P1 nuevos.

## No tocar

- Codigo.
- Secretos.
- Datos reales sin limpieza documentada.

## Verificacion

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Usar mailbox/log observable definido en `TASK-175`.
- Clasificar P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-179-HANDOFF.md` con:

- Ambiente probado.
- Casos ejecutados.
- Evidencia de recepcion/logs.
- Bugs/riesgos.
- Recomendacion go/no-go pre-lanzamiento.
