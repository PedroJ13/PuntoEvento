# TASK-124: Pagina publica - busqueda por empresa y limpieza de filtros

## Equipo asignado

Web Dev - Pagina publica.

## Superficie

```text
index.html
app.js
styles.css
```

## Contexto

Hallazgos Round 2:

- `PO2-004`: busqueda publica no permite encontrar claramente una empresa especifica.
- `PO2-005`: filtro `Servicio: Todos` inconsistente.
- `PO2-006`: checks `Servicios para boda` confunden.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/API_CONTRACTS_MVP.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Hacer que la pagina publica permita encontrar servicios por nombre de empresa y eliminar controles de filtro que hoy confunden.

## Alcance

1. Texto libre debe buscar por:
   - nombre de servicio;
   - categoria;
   - tipo de evento;
   - descripcion;
   - nombre de empresa;
   - slug de empresa si esta disponible.
2. Si existe un servicio publicado de `Demo Owner Jardines del Sol`, buscar ese texto debe mostrarlo.
3. Mantener resultados centrados en servicios, mostrando claramente `Servicio por Empresa`.
4. Ocultar temporalmente o remover:
   - filtro `Invitados`;
   - filtro `Presupuesto`;
   - checks laterales `Servicios para boda`.
5. Asegurar que el filtro de servicio/categoria tenga `Todos` estable:
   - al cargar;
   - despues de refrescar datos;
   - despues de aplicar/quitar filtros.
6. Validar mobile y desktop basico.

## Fuera de alcance

- Cambiar panel empresa.
- Cambiar admin.
- Cambiar backend si la API ya devuelve `company.name`.
- Hacer commit/push.

## Nota API

Si la API publica no permite buscar por empresa porque no expone o filtra `company.name`, coordinar con `TASK-127`.

## Entregable

Crear:

```text
tasks/TASK-124-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Cambios UI.
- Como se busca por empresa.
- Verificacion desktop/mobile.
- Riesgos o dependencia con API.

## Aviso al terminar

```text
Termine TASK-124. Product/Architect debe leer tasks/TASK-124-HANDOFF.md.
```
