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

## Product / Architect

Responsable de:

- Roadmap.
- Modelo de dominio.
- Priorizacion.
- Decisiones transversales.
- Backlog.

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

