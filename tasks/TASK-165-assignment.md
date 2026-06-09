# TASK-165: QA - validacion emails internos

## Equipo asignado

QA.

## Contexto

Depende de `TASK-164`.

## Tarea

Validar emails internos de registro y envio de servicio a revision.

## Alcance

- Registro de empresa.
- Envio de servicio a revision.
- Evidencia de recepcion o log verificable.
- Fallo controlado del email si el equipo Backend/Infra deja mecanismo de prueba.
- Confirmar que los flujos principales siguen funcionando aunque email falle.

## No tocar

- Codigo.
- Datos reales sin limpieza documentada.

## Verificacion

- Azure o ambiente indicado por handoff.
- Clasificar hallazgos P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-165-HANDOFF.md` con:

- Casos ejecutados.
- Evidencia.
- Bugs/riesgos.
- Recomendacion para Product / Architect / Release.
