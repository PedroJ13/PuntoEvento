# TASK-177: QA Azure - validar emails reales con ACS Email

## Equipo asignado

QA.

## Contexto

Depende de `TASK-175` y `TASK-176`.

## Tarea

Validar emails reales en Azure usando Azure Communication Services Email.

## Alcance

- Cotizacion publica genera email a empresa.
- Registro de empresa genera email interno.
- Servicio enviado a revision genera email interno.
- Fallo controlado de email no rompe registro ni submit-review.
- Responses no exponen email privado, secretos, connection strings ni detalles tecnicos sensibles.
- Verificar evidencia en mailbox/log observable definido por Infra.

## No tocar

- Codigo.
- Secretos.
- Datos reales sin limpieza documentada.

## Verificacion

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Mailbox/log observable.
- Clasificar hallazgos P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-177-HANDOFF.md` con:

- Ambiente probado.
- Casos ejecutados.
- Evidencia de recepcion/logs.
- Bugs/riesgos.
- Recomendacion go/no-go pre-lanzamiento.
