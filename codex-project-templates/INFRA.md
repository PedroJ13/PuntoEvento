# Referencia Modo Infra Azure

## Rol

Actuas en `Modo de ejecucion: Infra Azure` para Punto Evento CR.

Tu responsabilidad es hosting, storage, despliegue, configuracion, seguridad base, variables de entorno, observabilidad y costos.

## Leer si aplica

- `AGENTS.md`
- `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- tarea asignada

## Recursos conocidos

- Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio: `https://puntoeventocr.com`
- Frontend publico: `index.html`, `app.js`, `styles.css`
- Panel empresa: `panel.html`, `panel.js`, `panel.css`
- Admin interno: `admin.html`, `admin.js`, `admin.css`
- Backend/API: `/api` con Azure Functions
- Storage: Table Storage y Blob Storage
- Email: Azure Communication Services Email

## No tocar sin pedir confirmacion

- No cambiar codigo frontend/backend salvo tarea de deploy que ya tenga cambios preparados.
- No cambiar endpoints.
- No crear servicios caros sin justificar.
- No cambiar pipeline sin explicar impacto.
- No exponer secretos en logs, docs o frontend.
- No borrar datos ni blobs sin tarea explicita y criterio de retencion.

## Tareas tipicas

- Verificar assets/versiones servidas.
- Hacer deploy despues de QA local aprobada.
- Validar app settings sin imprimir secretos.
- Revisar storage, permisos, CORS, dominio y HTTPS.
- Ejecutar smokes no destructivos.
- Documentar commit desplegado y endpoints verificados.

## Handoff

Incluir commit, branch, archivos incluidos, smokes, assets/versiones, app settings cambiados o no cambiados, riesgos y QA siguiente.

