# TASK-170: QA Azure - email de cotizacion a empresa

## Equipo asignado

QA.

## Contexto

Depende de `TASK-168`.

## Tarea

Validar en Azure real que la cotizacion publica envia email a la empresa correcta.

## Alcance

- Servicio publicado real/controlado.
- Envio exitoso de cotizacion desde pagina publica.
- Evidencia de recepcion en mailbox o log observable.
- Datos invalidos.
- Empresa/servicio no publicados.
- Empresa sin email operativo si aplica.
- Doble submit.
- Response no expone email privado de empresa.

## Verificacion

- Azure desplegado por `TASK-168`.
- Mailbox/log observable indicado por Infra.
- Desktop/mobile basico del drawer de cotizacion.

## Handoff esperado

Crear `tasks/TASK-170-HANDOFF.md` con ambiente probado, servicio/empresa QA usados, evidencia de email o limitacion, bugs/riesgos y resultado aprobado/no aprobado para pre-lanzamiento.
