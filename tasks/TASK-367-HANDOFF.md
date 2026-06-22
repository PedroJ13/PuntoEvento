Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: TASK-367 - Backend/API reset de password por correo.
Archivos cambiados:
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/shared/email.js`
- `api/shared/companyPasswordResets.js`
- `api/company-password-resets-request/function.json`
- `api/company-password-resets-request/index.js`
- `api/company-password-resets-validate/function.json`
- `api/company-password-resets-validate/index.js`
- `api/company-password-resets-complete/function.json`
- `api/company-password-resets-complete/index.js`
- `api/internal-company-password-reset/function.json`
- `api/internal-company-password-reset/index.js`
- `docs/API_CONTRACTS_MVP.md`
Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/BACKEND_API.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS_MVP.md`, `docs/DATA_MODEL.md`, `tasks/TASK-364-HANDOFF.md`, `tasks/TASK-365-HANDOFF.md` y `tasks/TASK-367-assignment.md`.
- `git status --short --branch` antes de trabajar: habia cambios previos de TASK-365/TASK-366, `docs/DECISION_LOG.md` modificado y archivos de coordinacion sin trackear; no se revirtieron cambios ajenos.
- `node --check api/shared/config.js`: OK.
- `node --check api/shared/companyAuth.js`: OK.
- `node --check api/shared/companyPasswordResets.js`: OK.
- `node --check api/company-password-resets-request/index.js`: OK.
- `node --check api/company-password-resets-validate/index.js`: OK.
- `node --check api/company-password-resets-complete/index.js`: OK.
- `node --check api/internal-company-password-reset/index.js`: OK.
- Prueba estructural con `node -e` y mocks locales de `@azure/data-tables` / `@azure/storage-blob`: respuesta generica y validadores de password OK.
- `git diff --check`: sin errores; solo warnings esperados LF/CRLF.
- Revision estatica con `rg`: no se agrego `console.log`, no se devuelve `resetUrl` desde endpoints, y el token plano solo se usa para construir el correo antes de guardar `tokenHash`.
Resultado:
- Agregado `POST /api/company-password-resets` para solicitar reset con respuesta publica generica.
- Agregado `GET /api/company-password-resets/validate?token=...` con estados seguros `valid`, `invalid`, `expired` y `used`, sin exponer empresa/usuario/email.
- Agregado `POST /api/company-password-resets/complete` para definir nueva contrasena, marcar reset como usado y revocar sesiones activas de la misma empresa/email.
- Agregada tabla configurable `CompanyPasswordResets` via `AZURE_TABLE_COMPANY_PASSWORD_RESETS`.
- Agregado TTL configurable compatible con `COMPANY_PASSWORD_RESET_EXPIRES_MINUTES` y `COMPANY_PASSWORD_RESET_TTL_MINUTES`.
- El reset guarda solo `tokenHash`; no guarda token plano.
- Se revocan resets pendientes anteriores del mismo usuario/email antes de crear uno nuevo.
- Se reutiliza email transaccional existente para enviar el link a `APP_PUBLIC_URL/panel.html?reset=...`.
- Se agrego soporte API interno `POST /api/internal/companies/{companyId}/password-reset` para que TASK-369 pueda consumirlo sin crear backend en modo Web Dev.
- `docs/API_CONTRACTS_MVP.md` actualizado con contratos, errores y reglas.
Uso DB/storage cloud: No, motivo: implementacion y verificacion local/estructural sin ejecutar contra Azure Table Storage ni enviar correos reales; alcance: codigo y contratos.
Riesgos o pendientes:
- No se ejecuto prueba funcional contra Table Storage real ni proveedor de email real.
- `api/node_modules` no esta instalado en el workspace; las pruebas integradas completas requieren restaurar dependencias de `api/package.json`.
- La busqueda por `tokenHash` usa filtro de Table Storage; revisar latencia/costo si el volumen de resets crece.
- El link de reset depende de `APP_PUBLIC_URL`; si no esta configurado, usa fallback `https://puntoeventocr.com`.
Siguiente recomendado:
- Ejecutar TASK-368 Web Dev para consumir solicitud/validacion/completado de reset desde el panel publico.
- Ejecutar TASK-369 Web Dev para exponer la accion admin segura usando `POST /api/internal/companies/{companyId}/password-reset`.
