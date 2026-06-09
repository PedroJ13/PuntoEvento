# TASK-263: QA Azure - revalidacion post-deploy bloque copy/flujo/mobile

## Equipo asignado

QA.

## Contexto

Depende de `TASK-262`.

`TASK-259` no aprobo el bloque porque:

- habia P1 local en fallback publico con datos de referencia;
- Azure todavia servia assets anteriores.

`TASK-260` y `TASK-261` deben cerrar el P1 local antes del deploy.

## Tarea

Revalidar en Azure el bloque `TASK-249` a `TASK-258` mas `TASK-260` despues del deploy.

## Alcance

- Pagina publica home/resultados/ficha.
- Drawer/contacto mobile.
- Registro empresa.
- Panel empresa mobile/desktop.
- Admin productivo sin demo/legacy visible.
- API publica limpia despues de `TASK-248`.
- Emails: validacion estructural o smoke real solo si Product lo pide y hay medio seguro.

## No tocar

- No crear datos reales sin aprobacion.
- No usar credenciales reales en handoff.
- No hacer hard delete ni limpieza.
- No cambiar codigo.

## Verificacion

- Azure sirve assets esperados del bloque.
- `/api/public/services?limit=50` devuelve 0 items en ambiente limpio.
- No aparecen `demo`, `Cotizacion multiple`, `Planes demo` en superficies publicas normales.
- CTAs sin servicio no abren lead real.
- Admin productivo no muestra legacy/demo normal.
- Panel empresa usa copy corregido.
- Mobile drawer CTA visible.
- Mobile panel/ficha con mejoras de `TASK-255`.
- Clasificar P0/P1/P2/P3 y recomendar go/no-go.

## Handoff esperado

Crear `tasks/TASK-263-HANDOFF.md` con:

- Resultado general.
- P0/P1/P2/P3.
- Assets Azure observados.
- Superficies validadas.
- Recomendacion go/no-go para test con primera empresa real.
