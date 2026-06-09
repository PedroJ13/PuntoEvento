# TASK-133: QA pagina publica Round 2 post-deploy

## Equipo asignado

QA.

## Superficie

```text
index.html
app.js
styles.css
```

## Contexto

`TASK-128` no aprobo Azure porque el deploy anterior aun mostraba filtros viejos y la API no buscaba por empresa.

`TASK-131` desplego Round 2 a Azure y confirmo:

- `/index.html` sirve `app.js?v=22`;
- `/index.html` sirve `styles.css?v=17`;
- `GET /api/public/services?q=Demo Owner Jardines del Sol` responde `items: 1`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `tasks/TASK-124-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `tasks/TASK-128-HANDOFF.md`
- `tasks/TASK-131-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Validar en Azure desplegado que la pagina publica Round 2 busca por empresa y que los filtros confusos fueron ocultados.

## Casos minimos

1. Confirmar que `/index.html` sirve `app.js?v=22` y `styles.css?v=17`.
2. Buscar por nombre de empresa publicada.
3. Buscar `Demo Owner Jardines del Sol` si existe un servicio publicado de esa empresa.
4. Confirmar resultado tipo servicio con nombre/contexto de empresa.
5. Confirmar que `Invitados` y `Presupuesto` no aparecen o no afectan resultados.
6. Confirmar que checks `Servicios para boda` no aparecen o no aplican filtros.
7. Confirmar `Todos` estable en filtro servicio/categoria al cargar y al limpiar.
8. Validar desktop/mobile.

## Entregable

Crear:

```text
tasks/TASK-133-HANDOFF.md
```

Debe indicar:

- ambiente probado;
- resultado por caso;
- evidencia DOM o capturas si aplica;
- riesgos o pendientes.

## Aviso al terminar

```text
Termine TASK-133. Product/Architect debe leer tasks/TASK-133-HANDOFF.md.
```
