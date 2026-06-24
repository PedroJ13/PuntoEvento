# TASK-371: Infra Azure deploy de password-flows

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Infra Azure

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-371-assignment.md.
Despliega el paquete aprobado de password-flows y al terminar crea `tasks/TASK-371-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/INFRA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-370-HANDOFF.md`

## Objetivo

Publicar en Azure el paquete de password-flows aprobado localmente, con settings y recursos necesarios sin exponer secretos.

## Contexto

El paquete puede requerir nuevas app settings no sensibles, tabla de Table Storage para resets y deploy coordinado API/Web. No publicar UI antes de API funcional.

## Alcance

- Confirmar precondicion `TASK-370` aprobado.
- Crear/configurar tabla o settings requeridos si fueron definidos.
- Publicar backend/API y web en orden seguro.
- Validar endpoints publicados no destructivos.
- Validar assets/rutas publicados por marcadores, no solo `200` SPA.

## Fuera de alcance

- No imprimir secrets, connection strings, cookies, tokens ni links completos.
- No ejecutar reset real salvo cuenta/destinatario autorizado.
- No cambiar dominio/DNS.
- No modificar codigo salvo ajustes estrictos de deploy/versionado.

## Criterios de aceptacion

- GitHub Actions exitoso.
- Endpoints nuevos no responden `404`.
- Rutas/markers web nuevos estan publicados.
- Settings requeridos existen sin exponer valores.
- No se rompe login recurrente actual.

## Verificacion requerida

- `git status`, `git diff --check`.
- `gh run list` o equivalente.
- Azure CLI solo para consultas/configuracion necesarias, sin imprimir secretos.
- Smokes no destructivos de endpoints/rutas.

## Handoff requerido

Crear:

```text
tasks/TASK-371-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica:

```text
Modo de ejecucion:
Uso DB/storage cloud: No / Si, motivo: <motivo>, alcance: <consulta/migracion/smoke>
```

