# TASK-010: Catalogos y fotos en formulario demo de servicio

## Equipo encargado

Web Dev.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-010-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-010-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-008-HANDOFF.md`
- `tasks/TASK-009-HANDOFF.md`

Opcionales utiles:

- `docs/ADMIN_REGISTRATION_FLOW.md`
- `docs/MVP_CRITERIA.md`
- `docs/QA_TEST_PLAN.md`

## Objetivo

Mejorar el formulario demo de servicios para que:

- `Categoria` sea una lista controlada.
- `Tipos de evento` use opciones controladas.
- El servicio permita cargar fotos con preview local.

## Contexto

Product/Architect detecto en la revision visual que:

- `Categoria` aparece como texto libre.
- Deberia usar la misma lista/categorias de la pagina principal.
- `Tipos de evento` tambien deberia ser controlado.
- El formulario muestra `Cantidad de fotos`, pero no permite agregar fotos.

Decision Product/Architect:

- Categorias y tipos de evento son catalogos compartidos.
- En demo local pueden venir de JSON o constantes reutilizables.
- En MVP inicial pueden seguir como JSON estatico versionado.
- Fotos pertenecen tambien al servicio, no solo a la empresa.

## Alcance

Se permite tocar:

- `admin.html`
- `admin.js`
- `admin.css`
- `data/categories.json` si conviene reutilizarlo.
- `data/event-types.json` si se crea.
- `tasks/TASK-010-HANDOFF.md`

## Fuera de alcance

- No tocar pagina publica salvo leer `data/categories.json`.
- No tocar `/api`.
- No subir fotos reales a Azure.
- No crear endpoints.
- No implementar Blob Storage.
- No mover panel a `/panel/*`.

## Requerimientos funcionales

## Categoria

- Cambiar campo `Categoria` de texto libre a `select`.
- Opciones deben venir de catalogo controlado.
- Debe incluir categorias relevantes de la pagina principal o del archivo `data/categories.json`.
- Si `data/categories.json` ya existe, preferir usarlo o alinear nombres.

## Tipos de evento

- Cambiar campo `Tipos de evento` a control de opciones multiples.
- Puede ser checkboxes, chips seleccionables o multi-select simple.
- Opciones minimas:
  - Bodas
  - Cumpleanos
  - Eventos corporativos
  - Baby Shower
  - Graduaciones
  - Fiestas infantiles

## Fotos

- Agregar input para fotos del servicio.
- Permitir seleccionar multiples imagenes.
- Mostrar preview local.
- Actualizar `Cantidad de fotos` automaticamente segun fotos seleccionadas/guardadas.
- Guardar metadata demo en `localStorage`.
- No guardar base64 grande si se puede evitar; para demo puede guardar nombre/cantidad y preview temporal durante sesion.
- Debe quedar claro que no sube a Azure todavia.

## Criterios de aceptacion

- `Categoria` ya no es texto libre.
- `Tipos de evento` ya no depende de escribir texto libre.
- Se pueden seleccionar varias opciones de tipos de evento.
- Se pueden seleccionar fotos y ver preview local.
- `Cantidad de fotos` se actualiza.
- Crear/editar servicio sigue funcionando.
- Persistencia demo sigue funcionando.
- No hay errores de consola.
- No se toca pagina publica ni API.

## Verificacion requerida

Manual:

1. Abrir `admin.html?demo=local`.
2. Ir a `Servicios`.
3. Agregar servicio.
4. Seleccionar categoria desde lista.
5. Seleccionar multiples tipos de evento.
6. Seleccionar fotos.
7. Confirmar preview y cantidad de fotos.
8. Guardar.
9. Editar servicio.
10. Confirmar datos.
11. Revisar consola.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-010-HANDOFF.md
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
Termine TASK-010. Product/Architect debe leer `tasks/TASK-010-HANDOFF.md`.
```

