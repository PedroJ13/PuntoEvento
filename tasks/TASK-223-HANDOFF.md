# TASK-223 - QA Handoff

Equipo: QA

Tarea validada: `TASK-223: QA - revalidar localmente P1 logout icon button`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: local/estructural
- URL local: `http://127.0.0.1:60223/panel.html`
- Fecha QA: 2026-06-04

## Resultado

**Aprobado.**

El P1 detectado en `TASK-214` queda cerrado localmente: `Cerrar sesion` ejecuta logout cuando el click real cae sobre el centro del boton, sobre el SVG y sobre un `path` interno del icono. El fix visual final del panel se mantiene correcto en desktop y mobile.

## Checks ejecutados

- Lectura de contexto:
  - `chat-start/QA.md`
  - `AGENTS.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/MVP_CRITERIA.md`
  - `tasks/TASK-214-HANDOFF.md`
  - `tasks/TASK-222-HANDOFF.md`
- Verificacion estatica:
  - `panel.html` referencia `panel.css?v=11`.
  - `panel.html` referencia `panel.js?v=10`.
  - `panel.js` usa `event.target.closest("[data-logout]")`.
  - `node --check panel.js`: OK.
  - `git diff --check -- panel.html panel.css panel.js`: OK, solo warnings esperados de LF/CRLF.
- Playwright local con API mockeada, sin credenciales reales:
  - Desktop `1440x900`.
  - Desktop estrecho `1024x900`.
  - Mobile `390x844`.

## Resultado por punto

1. Revisar `TASK-214` y `TASK-222`: OK.
2. Logout con click real sobre centro del boton: OK, llama `POST /api/company-auth/logout` 1 vez y vuelve a auth.
3. Logout con click sobre SVG interno: OK, llama `POST /api/company-auth/logout` 1 vez y vuelve a auth.
4. Logout con click sobre `path` interno: OK, llama `POST /api/company-auth/logout` 1 vez y vuelve a auth.
5. Evento `click` despachado desde `path`: OK, llama `POST /api/company-auth/logout` 1 vez y vuelve a auth.
6. `Volver a la pagina publica`: OK, navega a `index.html#inicio`.
7. Sidebar sin overflow:
   - `1440x900`: `scrollWidth=1440`, `overflowX=false`, sidebar `280px`.
   - `1024x900`: `scrollWidth=1024`, `overflowX=false`, sidebar `240px`.
   - `390x844`: `scrollWidth=390`, `overflowX=false`, sidebar `390px`.
8. Badges `Proximamente`: OK, `5/5` presentes y contenidos.
9. `Contactanos`: OK, visible y contenido dentro de `.sidebar-help` en estado autenticado.
10. Logo integrado: OK, `brand-logo` usa imagen de referencia, render `164x164` desktop y `188x188` mobile, `border-radius: 50%`, `object-fit: contain`.
11. Icon buttons accesibles: OK, ambos `46x46`, con SVG, `aria-label` y `title`.
12. Mobile `390x844`: OK, sin overflow horizontal.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

El P1 de `TASK-214` queda cerrado local/estructuralmente.

### P2

Ninguno nuevo.

### P3

Ninguno nuevo.

## Evidencia resumida

```text
panelCssV11=true
panelJsV10=true
logoutCenter.called=1
logoutCenter.authVisible=true
logoutSvg.called=1
logoutSvg.authVisible=true
logoutPath.called=1
logoutPath.authVisible=true
logoutDispatchPath.called=1
logoutDispatchPath.authVisible=true
backLink.ok=true
backLink.url=http://127.0.0.1:60223/index.html#inicio
desktop1440.overflowX=false
desktop1440.sidebarWidth=280
desktop1440.soonCount=5
desktop1440.soonContained=true
desktop1440.logo=164x164
narrow1024.overflowX=false
narrow1024.sidebarWidth=240
narrow1024.soonCount=5
mobile390.overflowX=false
mobile390.sidebarWidth=390
mobile390.logo=188x188
iconButtons=2
iconButtonsAccessible=true
contactanos.visible=true
contactanos.contained=true
```

## Riesgos o pendientes

- Esta aprobacion es local/estructural. No equivale a aprobacion Azure.
- El deploy de `panel.css?v=11` y `panel.js?v=10` sigue pendiente.
- La validacion uso API mockeada para evitar credenciales y datos reales; el alcance de esta tarea era el handler local del icon button y el visual final.

## Recomendacion para Infra Azure TASK-224

**Proceder con `TASK-224`.**

QA aprueba localmente el cierre del P1 de logout y recomienda que Infra Azure despliegue el fix visual final del panel con `panel.css?v=11` y `panel.js?v=10`. Despues del deploy, ejecutar `TASK-225` para revalidacion Azure real antes de cerrar el bloque.
