# Docs Punto Evento

Esta carpeta es la nueva base de trabajo del proyecto.

La idea es reiniciar la forma de trabajar sin perder el codigo actual.

## Documentos

- `PROJECT_RESTART.md`: estrategia para reiniciar el proyecto sin perder la pagina principal.
- `WORKFLOW_CODEX.md`: forma de trabajar con Codex, agentes y tareas pequenas.
- `ARCHITECTURE.md`: arquitectura actual y objetivo.
- `DATA_MODEL.md`: modelo Empresa -> Servicios.
- `API_CONTRACTS_MVP.md`: inventario API actual y contratos objetivo MVP.
- `QA_TEST_PLAN.md`: matriz de pruebas MVP y checklist de release.
- `BACKLOG.md`: tareas priorizadas.
- `DECISION_LOG.md`: decisiones importantes del proyecto.

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
