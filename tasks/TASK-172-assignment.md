# TASK-172: QA Azure - visual/responsive pre-lanzamiento final

## Equipo asignado

QA.

## Contexto

Depende de `TASK-168` y conviene ejecutarla despues de `TASK-169`, `TASK-170` y `TASK-171` si esos flujos cambian estado de release.

## Tarea

Hacer pasada visual/responsive final en Azure para pre-lanzamiento.

## Alcance

- Pagina publica.
- Registro empresa.
- Perfil publico/servicio.
- Cotizacion.
- Panel empresa con activacion/login recurrente.
- Admin interno.
- Mobile y desktop.

## Verificacion

- Azure sirve assets finales: `app.js?v=25`, `styles.css?v=19`, `panel.js?v=6`, `panel.css?v=7`, `admin.css?v=11`.
- Sin overflow horizontal critico.
- Sin errores de consola criticos no esperados.
- Clasificar hallazgos P1 bloqueante, P2 aceptable o post-MVP.

## Handoff esperado

Crear `tasks/TASK-172-HANDOFF.md` con ambientes/viewports, resultado por superficie, bugs/riesgos y recomendacion go/no-go pre-lanzamiento.
