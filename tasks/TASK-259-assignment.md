# TASK-259: QA - revalidacion pre-lanzamiento copy, flujo y responsive

## Equipo asignado

QA.

## Contexto

Esta tarea debe ejecutarse despues de que esten completadas las tareas aplicables del bloque:

- `TASK-249`
- `TASK-250`
- `TASK-251`
- `TASK-252`
- `TASK-253`
- `TASK-256`
- `TASK-257`
- `TASK-258`

Si `TASK-254`/`TASK-255` tambien se completan antes, incluirlos en la revalidacion.

## Tarea

Revalidar el pre-lanzamiento en local/estructural o Azure, segun indique Product / Architect / Release al momento de ejecutar, enfocandose en copy, flujo publico, admin productivo y responsive mobile.

## Alcance

- Pagina publica home/resultados/ficha.
- Drawer/contacto.
- Registro empresa.
- Panel empresa login/activacion/servicios.
- Admin login/expedientes.
- Emails si hay evidencia o smoke seguro.

## No tocar

- No modificar datos reales sin aprobacion.
- No ejecutar hard delete.
- No cambiar codigo.
- No usar credenciales reales en handoff.

## Verificacion

- No aparece `demo` en superficies publicas normales.
- No aparece `Cotizacion multiple` si no existe flujo real.
- CTA global sin servicio no intenta enviar lead real.
- Admin productivo no muestra legacy/demo normal.
- API publica fallida no muestra datos demo en productivo.
- Drawer mobile muestra CTA principal visible/usable.
- Panel empresa no usa `password` visible ni lenguaje de revision manual.
- Emails a empresa no usan `aprobada`, `revision`, `moderacion` ni `pendiente`.
- Sin P0/P1 visual/responsive.

## Handoff esperado

Crear `tasks/TASK-259-HANDOFF.md` con:

- Resultado general: aprobado/no aprobado.
- P0/P1/P2/P3.
- Superficies validadas.
- Ambiente usado.
- Evidencia resumida.
- Recomendacion go/no-go para siguiente test con empresa real.
