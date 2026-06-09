# TASK-174: QA Azure - reintento emails reales SendGrid

## Equipo asignado

QA.

## Contexto

Depende de `TASK-173`.

`TASK-170` y `TASK-171` no aprobaron email real porque SendGrid no estaba completamente configurado.

## Tarea

Reintentar solo las validaciones de email real en Azure:

- cotizacion publica a empresa;
- email interno por registro de empresa;
- email interno por servicio enviado a revision.

## Alcance

- Usar Azure real `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Usar mailbox/log observable indicado en `TASK-173-HANDOFF.md`.
- Validar que la cotizacion real llega al destino esperado.
- Validar que registro y envio a revision generan email interno.
- Confirmar que responses no exponen email privado de empresa ni secretos.
- Confirmar que no hay P0/P1 nuevos.

## No tocar

- Codigo.
- Secretos.
- Datos reales sin limpieza documentada.

## Verificacion

- `POST /api/public/leads` con servicio publicado debe responder exito y tener evidencia de email.
- `POST /api/companies/register` debe responder `201` y generar email interno.
- `POST /api/companies/me/services/{serviceId}/submit-review` debe responder `200` y generar email interno.
- Clasificar hallazgos P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-174-HANDOFF.md` con:

- Ambiente probado.
- Casos ejecutados.
- Evidencia de recepcion o logs.
- Bugs/riesgos.
- Recomendacion go/no-go de pre-lanzamiento.
