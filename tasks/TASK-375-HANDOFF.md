# TASK-375 - Handoff

## Resultado

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea: TASK-375 - Corregir smoke local de home publica
Resultado: completado

## Decision para Proyecto

El smoke local minimo queda corregido y verde. `npm run test:smoke` ahora sirve la superficie estatica por HTTP local, reproduce mejor la carga real de `index.html` y cierra limpio al finalizar.

Proyecto puede enviar el tooling local a QA local de revalidacion o aceptar TASK-375 como correccion tecnica completada segun la evidencia.

## P0/P1

Ninguno detectado. No se cambio funcionalidad de producto, panel, admin ni API.

## Pendientes accionables

Ninguno para TASK-375.

## Evidencia resumida

- Causa del fallo: el smoke anterior abria `index.html` con `file://`; la home publica usa `<base href="/">` y `app.js` carga `data/*.json`, por lo que `main#app` quedaba vacio/oculto en ese entorno.
- Correccion aplicada: `npm run test:smoke` ahora ejecuta `tools/run-smoke.mjs`, que levanta `tools/local-static-server.mjs`, espera `http://127.0.0.1:4174`, corre Playwright contra ese `baseURL` y apaga el servidor al terminar.
- Se mantuvo cobertura desktop/mobile, home publica, panel/admin sin autenticacion y axe sin violaciones `critical` en `main`.
- Se agregaron `test-results/` y `playwright-report/` a `.gitignore` como artefactos locales de Playwright.

## Archivos / commits

Commits: No se creo commit ni push.

Archivos cambiados:
- `.gitignore`
- `package.json`
- `playwright.config.js`
- `tests/smoke/public.spec.js`
- `tools/local-static-server.mjs`
- `tools/run-smoke.mjs`
- `docs/TOOLS.md`
- `tasks/TASK-375-HANDOFF.md`

## Detalle tecnico

Cambios principales:
- `playwright.config.js` mantiene `baseURL` configurable con `PLAYWRIGHT_BASE_URL` y sin `webServer`, para evitar cuelgues de ciclo de vida en Windows.
- `tools/run-smoke.mjs` controla el servidor local como proceso hijo directo, ejecuta Playwright y cierra el servidor con `SIGTERM`, con respaldo `SIGKILL`.
- `tools/local-static-server.mjs` reduce tiempos de keep-alive y cierra conexiones activas al recibir senal de apagado.
- `tests/smoke/public.spec.js` navega por rutas HTTP (`/`, `/panel.html`, `/admin.html`) en lugar de `file://`.
- `docs/TOOLS.md` documenta el nuevo runner local.

Verificacion ejecutada:
- `npm run check` -> OK.
- `npm run test:smoke` -> OK, 4 passed, desktop y mobile, cierre limpio en 29.8s.

Uso cloud/SQL: No. No se uso Azure, SQL, Table Storage, Blob Storage, ACS Email ni endpoints publicados.

Riesgos o pendientes:
- `gitleaks` sigue fuera del alcance de TASK-375; esta tarea solo corrige el smoke local.
- Hay cambios/untracked previos de coordinacion en el workspace no relacionados con esta tarea.

Siguiente recomendado:
- QA local puede re-ejecutar `npm run check` y `npm run test:smoke` para cerrar TASK-374/TASK-375.

Movimiento de tablero sugerido:

Mover TASK-375 a `Needs Review` o `QA local`. Si QA confirma los mismos comandos en verde, mover el bloque de tooling local minimo a `Done`.
