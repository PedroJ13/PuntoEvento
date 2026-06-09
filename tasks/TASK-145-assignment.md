# TASK-145 - Infra Azure deploy fix admin contactos

Equipo: Infra Azure

## Contexto

Web Dev completo `TASK-144` para cerrar el P1 detectado por QA en `TASK-143`.

El cambio es frontend-only:

- `admin.js`
- `admin.html`
- `admin.css`

Cache busting esperado:

- `admin.js?v=16`
- `admin.css?v=10`

## Leer antes de trabajar

- `tasks/TASK-144-HANDOFF.md`
- `tasks/TASK-143-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Desplegar en Azure Static Web Apps el fix de admin contactos y confirmar que Azure sirve las versiones nuevas.

## Alcance

1. Preparar commit/deploy solo con los archivos necesarios del fix:
   - `admin.html`
   - `admin.js`
   - `admin.css`

2. Confirmar que Azure sirve:
   - `/admin.html` con `admin.js?v=16`
   - `/admin.html` con `admin.css?v=10`

3. Confirmar smoke basico:
   - `admin.html` responde `200`.
   - `admin.js?v=16` responde `200`.
   - `admin.css?v=10` responde `200`.

No repetir QA funcional completa en esta tarea. Eso queda para QA despues del deploy.

## Entregable

Actualizar `tasks/TASK-145-HANDOFF.md` con:

- Resultado del deploy.
- Branch/commit desplegado.
- URL Azure.
- Versiones observadas.
- Smokes ejecutados.
- Riesgos o notas para QA.
