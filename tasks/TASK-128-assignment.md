# TASK-128: QA pagina publica Round 2

## Equipo asignado

QA.

## Superficie

```text
index.html
```

## Prerrequisito

Ejecutar despues de `TASK-124` y cualquier ajuste API necesario de `TASK-127`.

## Objetivo

Validar hallazgos publicos Round 2:

- busqueda por nombre de empresa;
- filtro `Todos` estable;
- filtros confusos ocultos.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-124-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md` si aplica.
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`

## Casos minimos

1. Buscar por nombre de empresa publicada.
2. Buscar `Demo Owner Jardines del Sol` si existe un servicio publicado de esa empresa.
3. Confirmar resultado tipo `Servicio por Empresa`.
4. Confirmar que `Invitados` y `Presupuesto` no aparecen o no afectan resultados.
5. Confirmar que checks `Servicios para boda` no aparecen o no aplican filtros.
6. Confirmar `Todos` estable en filtro servicio/categoria al cargar y al limpiar.
7. Validar desktop/mobile.

## Entregable

Crear:

```text
tasks/TASK-128-HANDOFF.md
```

## Aviso al terminar

```text
Termine TASK-128. Product/Architect debe leer tasks/TASK-128-HANDOFF.md.
```
