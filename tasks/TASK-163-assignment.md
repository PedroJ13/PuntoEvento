# TASK-163: QA - validacion email de cotizacion

## Equipo asignado

QA.

## Contexto

Depende de `TASK-161` y `TASK-162`.

## Tarea

Validar que la cotizacion publica envia email a la empresa correcta y no filtra datos privados.

## Alcance

- Servicio publicado.
- Empresa publicada.
- Servicio/empresa no publicados.
- Datos invalidos.
- Doble submit.
- Evidencia de recepcion de email si hay mailbox/log disponible.

## No tocar

- Implementacion de codigo.
- Datos reales sin limpieza documentada.

## Verificacion

- Azure si esta desplegado.
- Clasificar hallazgos P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-163-HANDOFF.md` con:

- Ambiente probado.
- Casos ejecutados.
- Evidencia de email o limitacion si no hay mailbox.
- Bugs y riesgos.
- Recomendacion de release.
