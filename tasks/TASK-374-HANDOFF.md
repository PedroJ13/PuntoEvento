# TASK-374 - Handoff QA

Equipo: QA
Tarea validada: TASK-374 - QA local del smoke minimo de tooling
Ambiente: Local en `C:\Work\Productos Digitales\PuntoEvento`, PowerShell, Node `v22.23.0`, npm `10.9.8`, Playwright instalado en `node_modules`. Sin Azure, SQL, credenciales, cookies, tokens ni correos reales.
Resultado: no aprobado

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/READY_DONE.md`, `codex-project-templates/QA.md`, `docs/ESTADO_OPERATIVO.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/QA_TEST_PLAN.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/TOOLS.md`, `tasks/TASK-373-HANDOFF.md` y `tasks/TASK-374-assignment.md`.
- Revision de `package.json`, `playwright.config.js`, `tests/smoke/public.spec.js` y `eslint.config.mjs`.
- Verificacion de tooling local:
  - `node --version` -> `v22.23.0`.
  - `npm --version` -> `10.9.8`.
  - `Test-Path node_modules` -> `True`.
  - `Test-Path node_modules\.bin\playwright.cmd` -> `True`.
- `npm run check` -> aprobado.
- `npm run test:smoke` -> falla de forma reproducible, pero cierra limpio sin timeout/colgado.
- Revision basica de secretos:
  - `gitleaks` no disponible en PATH.
  - `rg` de respaldo ejecutado con ruta explicita `.` y sin imprimir valores sensibles; devuelve muchos archivos con menciones esperadas a `password`, `token`, `sig`, `SAS`, etc. por codigo, docs y handoffs existentes. No se hizo triage profundo de secretos por estar fuera del smoke minimo y para evitar exponer valores.

P0/P1:
- Ninguno confirmado en producto.
- No se aprueba la tarea porque el criterio `npm run test:smoke` no queda verde.

P2/P3:
- P2 tooling: `npm run test:smoke` falla en home publica para desktop y mobile porque `main#app` permanece oculto/vacio bajo el smoke local con `file://`.
- P3: `gitleaks` no esta disponible en PATH; la revision quedo cubierta solo con `rg` de respaldo, sin reporte dedicado de gitleaks.

Evidencia:
- `npm run check`:
  - `eslint app.js admin.js panel.js playwright.config.js tests/**/*.js tools/**/*.mjs` OK.
  - `prettier --check package.json playwright.config.js eslint.config.mjs tests/**/*.js tools/**/*.mjs docs/TOOLS.md` OK.
- `npm run test:smoke`:
  - Ejecuta 4 pruebas en 2 workers.
  - `panel y admin cargan sin autenticacion ni secretos` pasa en `desktop`.
  - `panel y admin cargan sin autenticacion ni secretos` pasa en `mobile`.
  - `home publica carga contenido base y no tiene overflow horizontal critico` falla en `desktop`.
  - `home publica carga contenido base y no tiene overflow horizontal critico` falla en `mobile`.
  - Error comun: `expect(locator).toBeVisible() failed`; locator `main`; recibido `<main id="app"></main>` oculto.
  - Playwright genero evidencia local en `test-results\tests-smoke-public-smoke-l-596d9-overflow-horizontal-critico-desktop\` y `test-results\tests-smoke-public-smoke-l-596d9-overflow-horizontal-critico-mobile\`.
- Cobertura observada del smoke:
  - Proyectos configurados: `desktop` y `mobile`.
  - Smoke contiene home publica, panel sin autenticacion, admin sin autenticacion y axe sin violaciones `critical` en `main`.
  - Por el fallo temprano de home no se confirma axe/overflow en home.

Limitaciones:
- QA no cambio codigo ni scripts.
- No se ejecuto `npm install` porque `node_modules` y Playwright ya estaban presentes.
- No se uso navegador manual ni se inspeccionaron traces con `show-trace`; se uso la salida de Playwright y `error-context.md`.
- La revision de secretos con `rg` fue basica y ruidosa por coincidencias esperadas en codigo/docs/handoffs; no sustituye un escaneo dedicado con `gitleaks`.

Uso cloud/SQL: No. No se uso Azure, SQL, Table Storage, Blob Storage, ACS Email ni endpoints publicados.

Siguiente recomendado:
- Ejecucion Tecnica debe ajustar el smoke local o su forma de servir la home para que `index.html` renderice `main#app` correctamente en desktop/mobile.
- Re-ejecutar despues:
  - `npm run check`
  - `npm run test:smoke`
- Si se quiere exigir rutina de secretos como gate, agregar `gitleaks` al PATH documentado o convertirlo en script npm con salida redactada.

Movimiento de tablero sugerido: Mantener TASK-373/TASK-374 en pendiente de correccion o `Needs Fix`; no mover a Done hasta que `npm run test:smoke` pase completo.
