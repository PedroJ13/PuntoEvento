# TASK-123 Handoff - Producto/Data Round 2

## Estado

Completado por documentacion y coordinacion.

## Decisiones cerradas

- Imagenes por servicio:
  - maximo 10 imagenes en total por servicio;
  - el cover cuenta dentro de las 10;
  - un servicio puede tener maximo una imagen cover activa o pendiente.
- Moderacion:
  - no aprobar servicio si la empresa no esta `published`;
  - no aprobar upload si la empresa no esta `published`;
  - no aprobar upload de servicio si el servicio no esta `published`;
  - no hacer cascadas silenciosas al aprobar o rechazar empresa/servicio.
- Busqueda publica:
  - resultados centrados en servicios publicados;
  - busqueda libre incluye nombre/slug de empresa;
  - empresas sin servicios publicados no aparecen en resultados generales MVP.
- Filtros publicos:
  - ocultar temporalmente filtros sin logica real: `Invitados`, `Presupuesto` y checks laterales `Servicios para boda`;
  - mantener `Todos` como estado estable del filtro de servicio/categoria.

## Archivos modificados

La decision quedo documentada y luego implementada/validada en tareas posteriores:

- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DECISION_LOG.md`

## Tareas siguientes creadas

- `TASK-124`: pagina publica, busqueda por empresa y limpieza de filtros.
- `TASK-125`: panel empresa, multiples imagenes por servicio y cover.
- `TASK-126`: admin interno, moderacion por expediente.
- `TASK-127`: Backend/API, reglas de aprobacion, limites de imagenes y busqueda por empresa.
- `TASK-128`, `TASK-129`, `TASK-130`: QA por superficie.

## Resultado posterior

Las tareas derivadas se ejecutaron, desplegaron y validaron en Azure mediante `TASK-131` a `TASK-146`. No quedan P0/P1 abiertos del bloque Round 2 ni de los ajustes Product Owner posteriores.

## Riesgos pendientes

- Re-prueba Product Owner sigue pendiente antes de invitar empresas reales.
- Riesgos P2 deben aceptarse explicitamente antes de cerrar release.
- Catalogos finales de categorias/tipos de evento pueden requerir una tarea futura si cambian despues del MVP cerrado.

## Recomendacion para Product / Architect / Release

Dar `TASK-123` por cerrada y usar `docs/MVP_RELEASE_STATUS.md` como fuente de verdad operativa. No crear nuevas tareas de implementacion hasta recibir hallazgos nuevos de la re-prueba Product Owner.
