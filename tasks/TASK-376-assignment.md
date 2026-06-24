# TASK-376 - QA local de cierre del tooling minimo

## Equipo

QA

## Modo de ejecucion

No aplica

## Estado

Lista para ejecutar

## Prioridad

P2

## Depende de

- `tasks/TASK-373-HANDOFF.md`
- `tasks/TASK-374-HANDOFF.md`
- `tasks/TASK-375-HANDOFF.md`

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-376-assignment.md.
Revalida localmente el tooling minimo y al terminar crea o actualiza tasks/TASK-376-HANDOFF.md usando el formato QA indicado.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/CHAT_MODEL.md`
- `codex-project-templates/READY_DONE.md`
- `codex-project-templates/QA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/TOOLS.md`
- `tasks/TASK-373-HANDOFF.md`
- `tasks/TASK-374-HANDOFF.md`
- `tasks/TASK-375-HANDOFF.md`

Segun necesidad:

- `package.json`
- `playwright.config.js`
- `tests/smoke/public.spec.js`
- `tools/run-smoke.mjs`
- `tools/local-static-server.mjs`

## Objetivo

Confirmar que el bloque de tooling local minimo queda aprobado despues de la correccion de `TASK-375`.

## Contexto

`TASK-374` no aprobo porque `npm run test:smoke` fallaba en home publica bajo `file://`. `TASK-375` corrigio el smoke para servir la superficie estatica por HTTP local y reporto:

- `npm run check` -> OK.
- `npm run test:smoke` -> OK, 4 passed, desktop y mobile, cierre limpio.

QA debe re-ejecutar desde sesion limpia y confirmar si el bloque se puede cerrar.

## Alcance

- Ejecutar:

```powershell
npm run check
npm run test:smoke
```

- Confirmar que el proceso cierra limpio.
- Confirmar que la cobertura incluye home publica, panel/admin sin autenticacion, desktop/mobile y axe critical.
- Verificar que no se usen Azure, SQL, credenciales, cookies, tokens ni correos reales.

## Fuera de alcance

- No cambiar codigo.
- No modificar scripts.
- No instalar dependencias nuevas salvo `npm install` si falta `node_modules`.
- No tocar Azure.
- No validar login real, reset real, tokens, cookies, correos ni credenciales.
- No hacer QA Azure.
- No hacer triage profundo de secretos; solo reportar si aparece evidencia sensible nueva.

## Criterios de aceptacion

- `npm run check` aprobado.
- `npm run test:smoke` aprobado completo en desktop y mobile.
- Playwright cierra limpio.
- Sin P0/P1 de producto.
- Handoff recomienda cerrar o mantener en fix con causa concreta.

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
tasks/TASK-376-HANDOFF.md
```

Debe incluir formato QA:

- Ambiente.
- Resultado.
- Checks ejecutados.
- P0/P1.
- P2/P3.
- Evidencia.
- Limitaciones.
- Uso cloud/SQL: `No`.
- Siguiente recomendado.
- Movimiento de tablero sugerido.

## Al finalizar

Responder en el chat de la tarea:

```text
Termine TASK-376. Proyecto debe leer tasks/TASK-376-HANDOFF.md.
```
