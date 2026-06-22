Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: TASK-365 - Backend/API cambio autenticado de password de empresa.
Archivos cambiados:
- `api/shared/companyAuth.js`
- `api/company-auth-password/function.json`
- `api/company-auth-password/index.js`
- `docs/API_CONTRACTS_MVP.md`
Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/BACKEND_API.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS_MVP.md`, `docs/DATA_MODEL.md`, `tasks/TASK-364-HANDOFF.md` y `tasks/TASK-365-assignment.md`.
- `git status --short --branch` antes de trabajar: habia cambios ajenos en `docs/DECISION_LOG.md` y archivos de coordinacion sin trackear; no se tocaron para esta tarea.
- `node --check api/shared/companyAuth.js`: OK.
- `node --check api/company-auth-password/index.js`: OK.
- Prueba estructural con `node -e` y mocks locales de `@azure/data-tables` / `@azure/storage-blob`: validadores de password, campos prohibidos, confirmacion distinta y hash/verify `scrypt` OK.
- Intento inicial de prueba estructural con `require()` real fallo porque `api/node_modules` no existe en este workspace (`Cannot find module '@azure/data-tables'`); no se instalaron dependencias por alcance.
Resultado:
- Agregado endpoint `POST /api/company-auth/password`.
- El endpoint requiere sesion activa de empresa por cookie `pe_company_session`.
- El backend deriva empresa/usuario desde sesion y rechaza `email`, `companyId` y `userId` enviados por frontend.
- Verifica password actual con hash `scrypt`.
- Valida `newPassword` entre 10 y 128 caracteres, con letras y numeros, distinto del actual y con confirmacion coincidente.
- Guarda solo nuevo `passwordHash` fuerte con salt aleatorio en `Users`.
- Mantiene la sesion actual y revoca otras sesiones activas de la misma empresa/email cuando existen.
- Respuestas no exponen password, hash, token, cookie cruda, partition keys ni row keys.
- `docs/API_CONTRACTS_MVP.md` actualizado con contrato, errores y reglas.
Uso DB/storage cloud: No, motivo: implementacion y verificacion local/estructural sin ejecutar contra Azure Table Storage; alcance: codigo, contrato y validadores.
Riesgos o pendientes:
- No se ejecuto prueba funcional contra Table Storage real porque esta tarea no autoriza uso cloud ni datos reales.
- `api/node_modules` no esta instalado en el workspace; para pruebas integradas locales completas se requiere restaurar dependencias de `api/package.json`.
- Web Dev debe consumir el contrato `POST /api/company-auth/password` en TASK-366.
Siguiente recomendado:
- Ejecutar TASK-366 Web Dev para agregar ojo de password y formulario autenticado en panel empresa.
