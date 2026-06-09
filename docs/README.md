# Docs Punto Evento

Esta carpeta es la nueva base de trabajo del proyecto.

La idea es reiniciar la forma de trabajar sin perder el codigo actual.

## Documentos

- `PROJECT_RESTART.md`: estrategia para reiniciar el proyecto sin perder la pagina principal.
- `WORKFLOW_CODEX.md`: forma de trabajar con Codex, agentes y tareas pequenas.
- `ARCHITECTURE.md`: arquitectura actual y objetivo.
- `DATA_MODEL.md`: modelo Empresa -> Servicios.
- `API_CONTRACTS_MVP.md`: inventario API actual y contratos objetivo MVP.
- `ROUTE_MAP_MVP.md`: mapa operativo de rutas publicas, panel empresa, admin interno y API.
- `QA_TEST_PLAN.md`: matriz de pruebas MVP y checklist de release.
- `MVP_RELEASE_STATUS.md`: estado operativo del MVP, bloqueadores, alcance congelado y checklist para invitar primeras empresas.
- `PRELAUNCH_PRIORITIES.md`: prioridades y tareas pequenas para pasar de MVP validado a pre-lanzamiento controlado.
- `BACKLOG.md`: tareas priorizadas.
- `DECISION_LOG.md`: decisiones importantes del proyecto.
- `CODEX_COORDINATION_AUTOMATION.md`: automatizacion para tablero, estado y prompts entre chats Codex.

## Codigo que se conserva

La pagina publica actual se conserva como base:

- `index.html`
- `app.js`
- `styles.css`
- `data/*`
- `assets/*`

La zona admin y API actuales tambien se conservan, pero deben revisarse contra el nuevo modelo antes de seguir creciendo.

## Regla principal

No reescribir por impulso.

Primero documentar, luego dividir tareas, luego implementar cambios pequenos.

## Coordinacion MVP

El chat `Product / Architect / Release` es el responsable de mantener la vision operativa del MVP:

- Lee handoffs de los chats especializados.
- Actualiza `docs/MVP_RELEASE_STATUS.md`.
- Mantiene el tablero operativo `Ahora / Siguiente / Bloqueado / Hecho`.
- Decide las proximas tareas pequenas.
- Mantiene `docs/BACKLOG.md` y `docs/DECISION_LOG.md` alineados cuando corresponde.

Antes de abrir nuevas features, revisar `docs/MVP_RELEASE_STATUS.md` para confirmar bloqueadores y alcance.

Regla practica:

- `docs/MVP_RELEASE_STATUS.md` decide que se trabaja hoy.
- `docs/BACKLOG.md` conserva el inventario largo del proyecto.
