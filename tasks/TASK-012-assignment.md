# TASK-012: QA de panel empresa demo separado

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-012-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-012-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-011-HANDOFF.md`

Opcionales utiles:

- `docs/ADMIN_REGISTRATION_FLOW.md`
- `tasks/TASK-010-CANCELLED.md`
- `tasks/TASK-009-HANDOFF.md`

## Objetivo

Validar manualmente el panel empresa demo separado (`panel.html`) y confirmar que `admin.html` queda enfocado en revision interna.

## Contexto

TASK-011 creo:

- `panel.html`
- `panel.js`
- `panel.css`
- `data/event-types.json`

Tambien ajusto `admin.html` para que no sea el lugar donde la empresa agrega servicios.

## Alcance

QA debe validar:

- `panel.html`
- `panel.js`
- `panel.css`
- `data/categories.json`
- `data/event-types.json`
- `admin.html?demo=local` solo como regresion/separacion.

## Fuera de alcance

- No modificar codigo.
- No validar API real.
- No validar upload real a Azure.
- No validar pagos.
- No validar auth real de empresa.

## Criterios de aceptacion

Panel empresa:

- `panel.html` carga.
- Muestra `Panel empresa demo`.
- Muestra empresa demo.
- Muestra servicios existentes.
- Permite agregar servicio.
- Permite editar servicio.
- Categoria es `select` o lista controlada.
- Tipos de evento son opciones multiples.
- Permite seleccionar fotos.
- Muestra preview local de fotos.
- Actualiza cantidad de fotos.
- Guarda en `localStorage`.
- Refrescar conserva datos.
- `Enviar a revision` cambia estado a `pending`.
- Muestra mensaje claro de que no guarda en Azure.
- No hay errores de consola.

Admin:

- `admin.html?demo=local` ya no se presenta como lugar para agregar servicios.
- Admin comunica revision interna.
- Existe link o camino hacia panel empresa demo si fue implementado.
- Revision interna sigue bloqueada en modo demo.

Responsive:

- Probar al menos mobile, tablet y desktop.
- Sin overflow horizontal.

## Verificacion requerida

Manual:

1. Abrir `panel.html`.
2. Crear servicio.
3. Seleccionar categoria.
4. Seleccionar varios tipos de evento.
5. Seleccionar fotos y revisar preview.
6. Guardar.
7. Refrescar y confirmar persistencia.
8. Editar servicio.
9. Enviar a revision.
10. Abrir `admin.html?demo=local`.
11. Confirmar que admin es revision interna y no creacion de servicios.
12. Revisar consola.

Git:

```text
git status --short
```

QA no debe agregar cambios salvo `tasks/TASK-012-HANDOFF.md`.

## Handoff requerido

Crear:

```text
tasks/TASK-012-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Casos probados.
- Bugs encontrados con severidad.
- Evidencia o notas de consola.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-012. Product/Architect debe leer `tasks/TASK-012-HANDOFF.md`.
```

