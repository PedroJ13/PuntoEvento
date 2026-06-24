# TASK-375 - Corregir smoke local de home publica

## Equipo

Ejecucion Tecnica

## Modo de ejecucion

Web Dev

## Estado

Lista para ejecutar

## Prioridad

P2

## Depende de

- `tasks/TASK-373-HANDOFF.md`
- `tasks/TASK-374-HANDOFF.md`

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-375-assignment.md.
Corrige el smoke local de home publica y al terminar crea o actualiza tasks/TASK-375-HANDOFF.md usando el formato de handoff indicado.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/CHAT_MODEL.md`
- `codex-project-templates/READY_DONE.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/TOOLS.md`
- `tasks/TASK-373-HANDOFF.md`
- `tasks/TASK-374-HANDOFF.md`

Segun necesidad:

- `package.json`
- `playwright.config.js`
- `tests/smoke/public.spec.js`
- `tools/local-static-server.mjs`
- `index.html`
- `app.js`

## Objetivo

Hacer que `npm run test:smoke` pase completo en desktop y mobile, sin cambiar funcionalidad de producto.

## Contexto

`TASK-374` no aprobo el smoke minimo. `npm run check` paso, y `npm run test:smoke` cierra limpio, pero falla en home publica porque bajo el smoke local `file://` el locator `main` queda como `<main id="app"></main>` oculto/vacio.

El problema debe corregirse en la forma de ejecutar/probar el smoke o servir la home localmente, no con cambios funcionales innecesarios en la pagina publica.

## Alcance

- Revisar por que `index.html` no renderiza contenido base bajo el smoke actual.
- Ajustar `tests/smoke/public.spec.js`, `playwright.config.js` o `tools/local-static-server.mjs` segun corresponda.
- Si se requiere servidor local para que la home cargue scripts/datos correctamente, usar un enfoque que cierre limpio y no deje procesos residentes.
- Mantener cobertura de:
  - home publica;
  - panel/admin sin autenticacion;
  - desktop/mobile;
  - axe sin violaciones `critical` en `main`.
- Ejecutar:

```powershell
npm run check
npm run test:smoke
```

## Fuera de alcance

- No redisenar.
- No cambiar funcionalidad publica, panel, admin ni API salvo que sea estrictamente necesario para que el smoke represente el comportamiento real, y en ese caso documentarlo como riesgo.
- No tocar Azure.
- No validar login real, reset real, tokens, cookies, correos ni credenciales.
- No convertir Playwright en gate de deploy.
- No hacer reformat masivo.

## Criterios de aceptacion

- `npm run check` pasa.
- `npm run test:smoke` pasa completo en desktop y mobile.
- El proceso de Playwright cierra limpio.
- No hay cambios funcionales de producto, o cualquier excepcion queda justificada en el handoff.
- Handoff explica la causa del fallo y la correccion aplicada.

## Verificacion requerida

```powershell
npm run check
npm run test:smoke
```

## Uso de cloud / SQL / servicios externos

No. Esta tarea es local.

## Handoff requerido

Crear o actualizar:

```text
tasks/TASK-375-HANDOFF.md
```

Debe incluir:

- Resultado.
- Decision para Proyecto.
- P0/P1.
- Pendientes accionables.
- Evidencia resumida.
- Archivos / commits.
- Detalle tecnico.
- Comandos ejecutados y resultado.
- Uso cloud/SQL: `No`.
- Siguiente recomendado.
- Movimiento de tablero sugerido.

## Al finalizar

Responder en el chat de la tarea:

```text
Termine TASK-375. Proyecto debe leer tasks/TASK-375-HANDOFF.md.
```
