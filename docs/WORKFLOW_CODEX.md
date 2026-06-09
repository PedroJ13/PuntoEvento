# Workflow Codex

## Forma de trabajo

Punto Evento debe trabajarse como:

```text
Repositorio central + docs + tareas pequenas + agentes especializados
```

No como:

```text
Chats aislados que no comparten contexto
```

## Roles sugeridos

## Product / Architect / Release

Responsable de:

- Roadmap.
- Modelo de dominio.
- Priorizacion.
- Decisiones transversales.
- Backlog.
- Alcance congelado del MVP.
- Estado de release en `docs/MVP_RELEASE_STATUS.md`.
- Tablero operativo `Ahora / Siguiente / Bloqueado / Hecho`.
- Lectura de handoffs de Web, Backend/API, Infra Azure y QA.
- Proximas 3-5 tareas recomendadas.

Este rol funciona como centro de coordinacion del MVP. No reemplaza a los chats especializados: ordena prioridades, mantiene la fuente de verdad y convierte handoffs en tareas pequenas.

## Web Dev

Responsable de:

- Pagina publica.
- Admin UI.
- Formularios.
- Integracion con API.
- Responsive.

## Backend / API

Responsable de:

- Azure Functions.
- Validaciones.
- Contratos API.
- Persistencia.
- Permisos.

## Infra Azure

Responsable de:

- Static Web Apps.
- Blob Storage.
- Table Storage o Cosmos serverless.
- Variables de entorno.
- CI/CD.
- Seguridad base.

## QA

Responsable de:

- Casos de prueba.
- Regresion.
- Responsive.
- Flujos admin.
- Pruebas de permisos.

## Como abrir una tarea a Codex

Formato recomendado:

```text
Rol: Web Dev
Contexto: leer docs/PROJECT_RESTART.md y docs/DATA_MODEL.md
Tarea: crear pantalla admin de servicios en modo demo
Alcance: solo admin.html/admin.js/admin.css
No tocar: pagina publica
Verificacion: abrir /admin.html y probar crear servicio demo
```

## Como cerrar una tarea

Cada chat especializado debe dejar un handoff corto al terminar.

Formato recomendado:

```text
Equipo: Backend/API
Tarea completada:
Archivos cambiados:
Verificacion ejecutada:
Resultado:
Riesgos o pendientes:
Siguiente recomendado:
```

Si se usa la automatizacion de coordinacion, el handoff debe quedar en:

```text
tasks/TASK-###-HANDOFF.md
```

El chat `Product / Architect / Release` lee esos handoffs y actualiza:

- `docs/MVP_RELEASE_STATUS.md` si cambia el estado del MVP, bloqueadores, deploy o readiness.
- El tablero operativo dentro de `docs/MVP_RELEASE_STATUS.md` si una tarea pasa a `Ahora`, `Siguiente`, `Bloqueado` o `Hecho`.
- `docs/BACKLOG.md` si una tarea cambia de estado o aparece una tarea nueva.
- `docs/DECISION_LOG.md` si hubo una decision relevante.
- `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md` o `docs/API_CONTRACTS_MVP.md` solo si cambio arquitectura, modelo o contrato.

## Tablero operativo

El tablero corto vive dentro de `docs/MVP_RELEASE_STATUS.md`.

Uso:

- `Ahora`: lo que se trabaja hoy o en la ronda actual. Maximo 3 items.
- `Siguiente`: candidatos inmediatos cuando se libere capacidad. Maximo 5 items.
- `Bloqueado`: pendientes que necesitan decision, credencial, deploy, QA o informacion externa.
- `Hecho`: logros recientes utiles para contexto, no historial completo.

Regla:

```text
El tablero operativo decide que se trabaja hoy.
El backlog registra todo lo pendiente del proyecto.
```

El chat `Product / Architect / Release` debe actualizar este tablero despues de leer handoffs y antes de crear nuevas tareas.

## Lecturas por momento

Inicio del chat `Product / Architect / Release`:

```text
AGENTS.md
docs/MVP_RELEASE_STATUS.md
docs/BACKLOG.md
docs/DECISION_LOG.md
tasks/generated/manager-board.md si existe
```

Para decidir prioridad:

```text
docs/MVP_RELEASE_STATUS.md
docs/BACKLOG.md
docs/QA_TEST_PLAN.md
```

Primero revisar el tablero operativo en `docs/MVP_RELEASE_STATUS.md`. Luego usar `docs/BACKLOG.md` para detalle o contexto historico.

Para crear tarea Web:

```text
docs/ARCHITECTURE.md
docs/DATA_MODEL.md
docs/API_CONTRACTS_MVP.md
docs/MVP_RELEASE_STATUS.md
```

Para crear tarea Backend/API:

```text
docs/API_CONTRACTS_MVP.md
docs/DATA_MODEL.md
docs/ARCHITECTURE.md
docs/MVP_RELEASE_STATUS.md
```

Para crear tarea Infra Azure:

```text
docs/ARCHITECTURE.md
docs/API_CONTRACTS_MVP.md
docs/MVP_RELEASE_STATUS.md
```

Para crear tarea QA:

```text
docs/QA_TEST_PLAN.md
docs/BACKLOG.md
docs/MVP_RELEASE_STATUS.md
```

Al cerrar una ronda de coordinacion:

```text
docs/MVP_RELEASE_STATUS.md
docs/BACKLOG.md
docs/DECISION_LOG.md
```

## Regla de oro

Si una tarea requiere tocar muchas areas, dividirla.

Ejemplo incorrecto:

```text
Haz todo el admin con login, DB, pagos y QA.
```

Ejemplo correcto:

```text
Crea el formulario visual para crear un servicio dentro del admin, sin backend real.
```

## Branches sugeridas

```text
codex/docs-restart
codex/admin-services-ui
codex/api-company-model
codex/qa-admin-flow
codex/infra-blob-upload
```

## Checklist antes de terminar una tarea

- Codigo acotado.
- Documentos actualizados si aplica.
- Verificacion ejecutada.
- Riesgos conocidos documentados.
- Siguiente paso claro.
