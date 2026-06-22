Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea completada: TASK-369 - Admin UI accion segura para enviar reset de acceso.
Archivos cambiados:
- `admin.html`
- `admin.js`
Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/WEB_DEV.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS_MVP.md`, `tasks/TASK-367-HANDOFF.md` y `tasks/TASK-369-assignment.md`.
- `node --check admin.js`: OK.
- `git diff --check`: sin errores; solo warnings esperados LF/CRLF.
- Revision estatica con `rg`: no se agrego `console.log`.
- Revision estatica con `rg`: la UI admin no muestra link, token, hash ni password; solo llama el endpoint interno de TASK-367.
- `admin.html` actualizado con cache busting `admin.js?v=26`.
Resultado:
- Agregada accion `Enviar reset de acceso` en el expediente de empresa del admin interno.
- La accion queda deshabilitada si la empresa no tiene correo visible registrado.
- Antes de enviar, pide confirmacion con `window.confirm`.
- Reutiliza auth admin existente mediante `adminFetch`.
- Consume `POST /api/internal/companies/{companyId}/password-reset`.
- Muestra exito seguro: `Correo de recuperación enviado.`
- No muestra ni registra token, link completo, hash, cookie ni password.
Uso DB/storage cloud: No, motivo: implementacion frontend y verificacion local/estructural sin llamadas a Azure ni datos reales; alcance: `admin.html` y `admin.js`.
Riesgos o pendientes:
- No se ejecuto validacion visual en navegador porque la herramienta de navegador no estuvo disponible en esta sesion.
- Requiere QA funcional con credencial admin real o entorno local controlado.
- La accion depende del endpoint backend de TASK-367 y de proveedor de email configurado.
Siguiente recomendado:
- Ejecutar TASK-370 QA local completo del paquete password-flows antes de TASK-371 deploy Azure.
