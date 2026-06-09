# TASK-123: Producto/Data - cerrar alcance Round 2 por superficie

## Equipo asignado

Product / Architect / Release.

## Contexto

Product Owner documento hallazgos Round 2 en:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md
```

Se hizo triage por superficie en:

```text
docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md
```

## Archivos que debes leer

- `AGENTS.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `data/categories.json`
- `data/event-types.json`

## Objetivo

Cerrar decisiones de producto/datos para que las tareas de pagina publica, panel, admin y API implementen la misma regla.

## Alcance

1. Confirmar maximo de imagenes por servicio:
   - maximo 10 imagenes total;
   - cover cuenta dentro de las 10;
   - una sola imagen cover.
2. Confirmar reglas de aprobacion:
   - servicio no publicable si empresa no esta `published`;
   - upload no publicable si empresa no esta `published`;
   - upload de servicio no publicable si servicio no esta `published`.
3. Confirmar busqueda publica:
   - resultados por servicio;
   - texto libre incluye nombre/slug de empresa;
   - empresas sin servicios publicados no aparecen.
4. Confirmar filtros publicos que se ocultan temporalmente:
   - `Invitados`;
   - `Presupuesto`;
   - checks laterales `Servicios para boda`.
5. Actualizar docs si falta algo:
   - `docs/DATA_MODEL.md`;
   - `docs/API_CONTRACTS_MVP.md`;
   - `docs/BACKLOG.md`;
   - `docs/MVP_RELEASE_STATUS.md`;
   - `docs/DECISION_LOG.md`.

## Fuera de alcance

- Cambiar UI.
- Cambiar API.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-123-HANDOFF.md
```

Debe incluir:

- Decisiones cerradas.
- Archivos modificados.
- Tareas siguientes por superficie.
- Riesgos pendientes.

## Aviso al terminar

Cuando termines, avisa:

```text
Termine TASK-123. Product/Architect debe leer tasks/TASK-123-HANDOFF.md.
```
