# TASK-362: Deploy Azure del ajuste visual de imagenes completas

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Infra Azure

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-362-assignment.md.
Despliega el ajuste visual aprobado por TASK-361 y al terminar crea `tasks/TASK-362-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/INFRA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASK-361-HANDOFF.md`

## Objetivo

Publicar en Azure el ajuste visual para que las imagenes de servicios se vean completas en panel empresa y admin.

## Contexto

El fix visual debe pasar QA local antes de desplegar. El deploy debe mantener el flujo existente de GitHub Actions/Azure Static Web Apps y no cambiar backend ni recursos cloud.

## Alcance

- Confirmar precondicion `TASK-361` aprobado o aprobado con observaciones no bloqueantes.
- Commit/push de cambios aprobados si corresponde.
- Verificar que Azure sirva `panel.css?v=15` y `admin.css?v=17`.
- Smoke HTTP basico de `/panel.html`, `/admin.html`, CSS versionados y pagina publica.

## Fuera de alcance

- No cambiar API/backend.
- No cambiar app settings.
- No tocar Blob Storage, Table Storage, CORS ni ACS Email.
- No ejecutar pruebas con credenciales o datos reales.

## Criterios de aceptacion

- GitHub Actions termina exitoso.
- `https://puntoeventocr.com/panel.html` referencia `panel.css?v=15`.
- `https://puntoeventocr.com/admin.html` referencia `admin.css?v=17`.
- Los assets CSS versionados responden `200`.

## Verificacion requerida

- `git status`
- `git diff --check`
- `git push` solo si hay aprobacion local previa.
- `gh run list` o verificacion equivalente del workflow.
- `Invoke-WebRequest` sobre rutas publicas no destructivas.

## Handoff requerido

Crear:

```text
tasks/TASK-362-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica:

```text
Modo de ejecucion:
Uso DB/storage cloud: No / Si, motivo: <motivo>, alcance: <consulta/migracion/smoke>
```

