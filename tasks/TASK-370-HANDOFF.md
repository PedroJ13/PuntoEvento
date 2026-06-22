Equipo: QA
Tarea validada: TASK-370 - QA local completo de password-flows
Ambiente: Local estructural en `C:\Work\Productos Digitales\PuntoEvento`, PowerShell, Node v22.23.0. Sin Azure, sin cuentas reales, sin envio de emails reales.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-365-HANDOFF.md`, `tasks/TASK-366-HANDOFF.md`, `tasks/TASK-367-HANDOFF.md`, `tasks/TASK-368-HANDOFF.md`, `tasks/TASK-369-HANDOFF.md` y `tasks/TASK-370-assignment.md`.
- Revision de diff local del paquete password-flows en `panel.html`, `panel.css`, `panel.js`, `admin.html`, `admin.js`, endpoints nuevos de `api/`, shared auth/reset/email/config y `docs/API_CONTRACTS_MVP.md`.
- Busqueda de tests disponibles con `rg --files`: no se encontraron archivos `test/`, `tests/` ni `*.test.js` para este repo.
- Confirmado que `api/node_modules` no existe; no se instalaron dependencias por alcance QA.
- `node --check panel.js`: OK.
- `node --check admin.js`: OK.
- `node --check api/shared/config.js`: OK.
- `node --check api/shared/azure.js`: OK.
- `node --check api/shared/companyAuth.js`: OK.
- `node --check api/shared/email.js`: OK.
- `node --check api/shared/companyPasswordResets.js`: OK.
- `node --check api/company-auth-password/index.js`: OK.
- `node --check api/company-password-resets-request/index.js`: OK.
- `node --check api/company-password-resets-validate/index.js`: OK.
- `node --check api/company-password-resets-complete/index.js`: OK.
- `node --check api/internal-company-password-reset/index.js`: OK.
- `git diff --check` sobre archivos del paquete: sin errores; solo warnings esperados LF/CRLF.
- Prueba estructural con mocks minimos de dependencias Azure: validadores de password, campos prohibidos, confirmacion, cambio sin modificar y hash/verify `scrypt` OK.
- Revision estatica de UI:
  - `panel.html` referencia `panel.css?v=17` y `panel.js?v=20`.
  - `panel.html` contiene `data-password-toggle`, `data-password-form`, `data-reset-request-form`, `data-reset-complete-form`, `data-show-reset-request`.
  - Inputs usan `type=password`, `autocomplete=current-password` o `autocomplete=new-password`, `minlength` y `maxlength` donde aplica.
  - `admin.html` referencia `admin.js?v=26`.
  - `admin.js` contiene `data-company-password-reset`, confirmacion previa y mensaje seguro `Correo de recuperación enviado.`
- Revision estatica de seguridad:
  - Admin no muestra reset link, token ni hash; solo llama `POST /api/internal/companies/{companyId}/password-reset`.
  - Request publico de reset devuelve mensaje generico.
  - Validate reset devuelve solo `valid/status`.
  - Complete reset devuelve `ok/revokedSessions` o codigos seguros.
  - Cambio autenticado de password deriva empresa/usuario desde cookie y rechaza `email`, `companyId`, `userId`.
  - No se detecta almacenamiento de password/token en `localStorage`/`sessionStorage` para los nuevos flujos.

Hallazgos:
- El paquete cubre los flujos requeridos: ojo de password, cambio autenticado, solicitud publica generica, validacion de token invalido/expirado/usado, completado de reset y accion admin reset sin exponer link/token en UI.
- Los endpoints nuevos no devuelven password, hash, token plano, cookie cruda, `partitionKey` ni `rowKey` en respuestas esperadas.
- El token plano se usa para construir el correo y se guarda como `tokenHash`; el link no vuelve al admin ni al endpoint publico.
- Las reglas de password local/backend estan alineadas para cambio/reset: 10 a 128 caracteres, letras y numeros, confirmacion coincidente.

P0/P1:
- Ninguno.

P2/P3:
- P3: No se ejecuto flujo funcional en navegador porque no hay herramienta de navegador disponible en esta sesion.
- P3: No se ejecutaron pruebas integradas con Azure Functions/Table Storage local porque `api/node_modules` no existe y no hay suite automatizada en el repo; la validacion fue estatica/estructural con mocks minimos.
- P3: `panel.js` conserva `console.warn(error)` en varios flujos, incluido cambio autenticado de password. No se confirmo exposicion de password/token porque las respuestas revisadas son sanitizadas, pero conviene remover o limitar esos logs antes de release publico amplio.

Evidencia:
- `node --check` OK en `panel.js`, `admin.js`, shared API y cinco endpoints nuevos.
- `git diff --check` sin errores.
- Prueba estructural: `companyAuth password validators/hash: OK`.
- `Select-String` confirmo cache busting `panel.css?v=17`, `panel.js?v=20`, `admin.js?v=26`.
- `rg` no encontro tests automatizados disponibles; `Test-Path api\node_modules` devolvio `False`.
- Revision estatica confirmo que admin solo muestra mensaje seguro y no renderiza enlaces ni tokens de reset.

Riesgos o pendientes:
- Antes de deploy, si se quiere mayor confianza funcional, restaurar dependencias de `api/package.json` y ejecutar pruebas integradas locales contra mocks/fixture controlado.
- QA visual/manual con navegador debe cubrir desktop/mobile, toggles de ojo, formulario de cambio autenticado, recuperar acceso y completar reset.
- No se uso Azure ni se tocaron datos reales.

Siguiente recomendado:
- Proyecto puede aceptar TASK-370 como QA local/estructural aprobado con observaciones P3.
- Continuar con TASK-371 deploy Azure solo si Proyecto acepta que la cobertura funcional real se completara post-deploy con credenciales/sesion QA controlada.
