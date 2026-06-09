# TASK-131: Release/Infra - desplegar Round 2 y confirmar versiones Azure

## Equipo asignado

Release / Infra Azure.

## Contexto

`TASK-124`, `TASK-125`, `TASK-126` y `TASK-127` terminaron con evidencia local positiva.

QA ejecuto `TASK-128`, `TASK-129` y `TASK-130`, pero no aprobo Azure porque el ambiente desplegado sigue sirviendo versiones anteriores:

- pagina publica sin busqueda libre ni limpieza de filtros;
- panel empresa sin input multiple de imagenes;
- admin sin expediente por empresa;
- API permitiendo aprobar un servicio de empresa pendiente.

## Archivos que debes leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `tasks/TASK-124-HANDOFF.md`
- `tasks/TASK-125-HANDOFF.md`
- `tasks/TASK-126-HANDOFF.md`
- `tasks/TASK-127-HANDOFF.md`
- `tasks/TASK-128-HANDOFF.md`
- `tasks/TASK-129-HANDOFF.md`
- `tasks/TASK-130-HANDOFF.md`

## Objetivo

Desplegar a Azure Static Web Apps / Azure Functions la version local que contiene Round 2 y confirmar que Azure sirve los assets/API nuevos antes de devolver a QA.

## Alcance

1. Confirmar branch/commit o paquete que se va a desplegar.
2. Desplegar cambios de pagina publica, panel, admin y API.
3. Confirmar en Azure:
   - `index.html` referencia el cache busting nuevo de `app.js`/`styles.css` si aplica;
   - `panel.html` referencia el cache busting nuevo de `panel.js`/`panel.css` si aplica;
   - `admin.html` referencia el cache busting nuevo de `admin.js`/`admin.css` si aplica;
   - `GET /api/public/services?q=Demo Owner Jardines del Sol` puede buscar por empresa si existe servicio publicado;
   - aprobar servicio de empresa no publicada responde `409`.
4. No ejecutar hard delete ni limpieza de datos salvo tarea separada.

## Fuera de alcance

- Cambiar UI o API salvo ajuste minimo de version/cache busting requerido para que Azure sirva el build correcto.
- Repetir toda la matriz QA.
- Crear datos demo nuevos innecesarios.

## Entregable

Crear:

```text
tasks/TASK-131-HANDOFF.md
```

Debe incluir:

- commit/branch desplegado;
- fecha y ambiente;
- versiones de assets observadas;
- smoke API ejecutado;
- resultado;
- riesgos o pendientes;
- si QA puede repetir `TASK-128`, `TASK-129` y `TASK-130`.

## Aviso al terminar

```text
Termine TASK-131. Product/Architect debe leer tasks/TASK-131-HANDOFF.md.
```
