# TASK-373 - Adoptar smoke local minimo de tooling

## Equipo

Ejecucion Tecnica

## Modo de ejecucion

Web Dev

## Estado

Lista para ejecutar

## Prioridad

P2

## Depende de

`docs/PROYECTO_TOOLING_ADOPTION.md`.

Proyecto debe confirmar si se ejecuta antes de cerrar `TASK-372` o si queda como siguiente frente despues del cierre del bloque password-flows.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-373-assignment.md.
Sigue las instrucciones y al terminar crea o actualiza tasks/TASK-373-HANDOFF.md usando el formato de handoff indicado.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/CHAT_MODEL.md`
- `codex-project-templates/READY_DONE.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/PROYECTO_TOOLING_ADOPTION.md`

Segun necesidad:

- `package.json`
- `api/package.json`
- `docs/TOOLS.md`
- `README.md`
- `docs/README.md`

## Objetivo

Dejar un smoke local minimo y reproducible para regresion basica sin tocar funcionalidad del producto.

## Contexto

Proyecto recibio `docs/PROYECTO_TOOLING_ADOPTION.md`, que propone adoptar tooling local de forma pequena: Playwright, axe, scripts npm de check/test y rutina basica de secretos.

Esta tarea es de preparacion local. No reemplaza QA Azure ni valida flujos con credenciales reales.

## Alcance

- Revisar si existe `package.json` en raiz y como esta organizado.
- Revisar `api/package.json` sin imponer estructura nueva si no corresponde.
- Agregar dependencias dev donde corresponda:
  - `@playwright/test`
  - `@axe-core/playwright`
  - `eslint`
  - `prettier`
- Crear 1 o 2 specs smoke locales para:
  - home publica;
  - una ruta critica sin secretos, como panel/admin en modo no autenticado si aplica;
  - endpoint publico no destructivo si puede validarse localmente;
  - accesibilidad basica con axe;
  - responsive desktop/mobile.
- Agregar scripts npm razonables, incluyendo `check` si existe `package.json` raiz.
- Crear o actualizar `docs/TOOLS.md` con comandos para:
  - correr smoke local;
  - correr check;
  - ejecutar revision basica de secretos.

## Fuera de alcance

- No redisenar.
- No cambiar funcionalidad de pagina publica, panel, admin ni API.
- No reemplazar QA Azure.
- No hacer Playwright obligatorio en deploy.
- No hacer reformat masivo.
- No probar flujos con login, tokens, cookies, datos reales o secretos.
- No instalar herramientas globales.
- No tocar Azure, SQL, Table Storage, Blob Storage ni ACS Email.

## Criterios de aceptacion

- Existe un smoke local reproducible.
- Existe un comando documentado para correrlo.
- Existe check basico de accesibilidad con axe o preparacion clara documentada si el repo requiere paso previo.
- Existe rutina documentada de secretos.
- No hay cambios funcionales de producto.
- El handoff declara si `git status --short --branch` queda limpio o que archivos quedan modificados.

## Verificacion requerida

- Ejecutar los scripts agregados o documentar por que alguno queda pendiente.
- Ejecutar al menos un smoke local si el entorno lo permite.
- Ejecutar o documentar rutina de secretos:

```powershell
gitleaks detect --source . --no-git
rg ".env|connectionString|sig=|password|token|SAS|local.settings.json"
```

## Uso de cloud / SQL / servicios externos

No. Esta tarea es local. Si una herramienta intenta acceder a Azure, detenerse y documentarlo en el handoff.

## Handoff requerido

Crear o actualizar:

```text
tasks/TASK-373-HANDOFF.md
```

Debe incluir:

- Resultado.
- Decision para Proyecto.
- P0/P1.
- Pendientes accionables.
- Evidencia resumida.
- Archivos / commits.
- Detalle tecnico.
- Scripts agregados.
- Comandos ejecutados y resultado.
- Uso cloud/SQL: debe ser `No`.
- Siguiente recomendado: QA local de smoke si corresponde.

## Al finalizar

Responder en el chat de la tarea:

```text
Termine TASK-373. Proyecto debe leer tasks/TASK-373-HANDOFF.md.
```
