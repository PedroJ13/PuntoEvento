# TASK-374 - QA local del smoke minimo de tooling

## Equipo

QA

## Modo de ejecucion

No aplica

## Estado

Lista para ejecutar

## Prioridad

P2

## Depende de

`tasks/TASK-373-HANDOFF.md`

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-374-assignment.md.
Valida localmente el smoke minimo de tooling y al terminar crea o actualiza tasks/TASK-374-HANDOFF.md usando el formato QA indicado.
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

Segun necesidad:

- `package.json`
- `playwright.config.js`
- `tests/smoke/public.spec.js`
- `eslint.config.mjs`

## Objetivo

Confirmar desde una sesion local limpia que el smoke minimo de tooling corre y cierra correctamente.

## Contexto

`TASK-373` dejo adoptado el tooling local minimo, pero el handoff reporta que Playwright quedo colgado/timeout en esa sesion. QA debe revalidar los comandos como consumidor del tooling, sin cambiar codigo.

## Alcance

- Ejecutar `npm run check`.
- Ejecutar `npm run test:smoke`.
- Confirmar si ambos comandos cierran limpio.
- Revisar que el smoke cubra home publica, panel/admin no autenticados, responsive desktop/mobile y axe critical.
- Ejecutar o documentar la rutina basica de secretos disponible:

```powershell
gitleaks detect --source . --no-git
rg ".env|connectionString|sig=|password|token|SAS|local.settings.json"
```

- Si `gitleaks` no esta disponible, documentar el resultado y usar `rg` como respaldo.

## Fuera de alcance

- No cambiar codigo.
- No modificar scripts.
- No instalar dependencias nuevas salvo `npm install` si falta `node_modules`.
- No tocar Azure.
- No validar login real, reset real, tokens, cookies, correos ni credenciales.
- No hacer QA Azure.

## Criterios de aceptacion

- `npm run check` aprobado o hallazgos clasificados.
- `npm run test:smoke` aprobado y con cierre limpio, o bloqueo reproducible documentado.
- Sin P0/P1 de producto.
- Si hay fallo de tooling, clasificarlo como pendiente accionable para Ejecucion Tecnica.
- Handoff con evidencia resumida y sin secretos.

## Verificacion requerida

```powershell
npm run check
npm run test:smoke
```

Opcional si falta `node_modules`:

```powershell
npm install
```

## Uso de cloud / SQL / servicios externos

No. Esta tarea es local.

## Handoff requerido

Crear o actualizar:

```text
tasks/TASK-374-HANDOFF.md
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
Termine TASK-374. Proyecto debe leer tasks/TASK-374-HANDOFF.md.
```
