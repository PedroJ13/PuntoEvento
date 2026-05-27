# TASK-011: Crear panel empresa demo para servicios

## Equipo encargado

Web Dev.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-011-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-011-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/ADMIN_REGISTRATION_FLOW.md`
- `tasks/TASK-008-HANDOFF.md`
- `tasks/TASK-009-HANDOFF.md`

Importante:

- `tasks/TASK-010-CANCELLED.md`

## Objetivo

Crear una demo separada de panel empresa para que una empresa pueda crear/editar servicios, sin mezclar este flujo con el admin interno.

## Contexto

La pantalla `admin.html?demo=local` debe representar revision interna o una demo limitada, pero no debe ser el lugar donde la empresa agrega servicios.

Decision Product/Architect:

- `/admin/*` = revision interna.
- `/panel/*` = empresa gestiona perfil, servicios, fotos y planes.

Como el proyecto es estatico por ahora, crear una demo separada puede hacerse con:

```text
panel.html
panel.js
panel.css
```

o con la alternativa minima que Web Dev justifique, siempre que no mezcle creacion de servicios dentro del admin interno.

## Alcance

Se permite crear/tocar:

- `panel.html`
- `panel.js`
- `panel.css`
- `data/categories.json`
- `data/event-types.json`
- `tasks/TASK-011-HANDOFF.md`

Se permite tocar `admin.html/admin.js/admin.css` solo para:

- quitar o esconder el CTA de `Agregar servicio` en admin,
- cambiar copy para que `admin` sea revision interna,
- agregar link hacia el panel empresa demo si se considera util.

## Fuera de alcance

- No tocar pagina publica.
- No tocar `/api`.
- No implementar auth real.
- No subir fotos a Azure.
- No implementar pagos.
- No mover archivos existentes.

## Requerimientos funcionales panel empresa

- Mostrar encabezado claro:

```text
Panel empresa demo
```

- Mostrar empresa demo.
- Mostrar lista de servicios existentes.
- Agregar boton `Agregar servicio`.
- Crear/editar servicio con:
  - nombre,
  - categoria como select/lista controlada,
  - tipos de evento como opciones multiples,
  - precio desde,
  - estado,
  - descripcion,
  - fotos con preview local.
- Guardar en `localStorage`.
- Permitir enviar servicio a revision en modo demo:

```text
status = pending
```

- Mostrar mensaje claro:

```text
Esta demo no guarda en Azure todavia.
```

## Requerimientos admin interno

`admin.html` debe enfocarse en revision.

Si se mantiene una vista de servicios en admin, debe ser de revision, no de creacion.

No debe mostrarse `Agregar servicio` como accion principal del admin interno.

## Criterios de aceptacion

- Existe panel empresa demo separado.
- Empresa puede crear/editar servicios en la demo.
- Categoria viene de lista.
- Tipos de evento vienen de opciones.
- Fotos tienen preview local.
- Datos persisten en `localStorage`.
- Admin interno ya no sugiere que el admin agrega servicios por la empresa.
- Pagina publica no cambia.
- No hay errores de consola.

## Verificacion requerida

Manual:

1. Abrir panel empresa demo.
2. Crear servicio.
3. Seleccionar categoria.
4. Seleccionar varios tipos de evento.
5. Subir fotos y ver preview.
6. Guardar.
7. Refrescar y confirmar persistencia.
8. Enviar a revision.
9. Abrir admin demo y confirmar que se entiende como revision interna.
10. Revisar consola.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-011-HANDOFF.md
```

Debe incluir:

- Resumen.
- Archivos tocados.
- Cambios realizados.
- Verificacion.
- Riesgos.
- Pendientes.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-011. Product/Architect debe leer `tasks/TASK-011-HANDOFF.md`.
```

