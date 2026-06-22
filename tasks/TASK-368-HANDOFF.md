Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea completada: TASK-368 - Web Dev recuperar acceso y pantalla publica de reset.
Archivos cambiados:
- `panel.html`
- `panel.css`
- `panel.js`
Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/WEB_DEV.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS_MVP.md`, `tasks/TASK-367-HANDOFF.md` y `tasks/TASK-368-assignment.md`.
- `node --check panel.js`: OK.
- `git diff --check`: sin errores; solo warnings esperados LF/CRLF.
- Revision estatica con `rg`: el flujo nuevo no agrega `localStorage`, `sessionStorage` ni `console.log`.
- Revision estatica con `rg`: el token de reset se mantiene en memoria y solo via query string para validar/completar; no se guarda en storage.
- `panel.html` actualizado con cache busting `panel.css?v=17` y `panel.js?v=20`.
Resultado:
- Agregado boton `Recuperar acceso` en login de empresa.
- Agregado formulario publico para solicitar instrucciones por correo usando `POST /api/company-password-resets`.
- Agregado modo publico de reset en `panel.html?reset=...`.
- El modo de reset valida el enlace con `GET /api/company-password-resets/validate?token=...`.
- Agregado formulario de nueva contrasena con ojo Ver/Ocultar y validacion local de minimo 10, maximo 128, letras/numeros y confirmacion coincidente.
- El completado consume `POST /api/company-password-resets/complete`.
- Despues de exito, limpia el token de la URL, limpia campos, vuelve inputs a `type=password` y muestra login.
- Mensajes de error seguros para enlaces invalidos, vencidos o usados.
- Se evita conflicto con invitaciones: el correo de reset usa parametro `reset`; `token` solo se acepta para reset si viene con `mode=reset`.
Uso DB/storage cloud: No, motivo: implementacion frontend y verificacion local/estructural sin llamadas a Azure ni datos reales; alcance: HTML/CSS/JS del panel empresa.
Riesgos o pendientes:
- No se ejecuto validacion visual en navegador porque la herramienta de navegador no estuvo disponible en esta sesion.
- Requiere QA local funcional con API mockeada o entorno local antes de deploy.
- La UI depende de los endpoints de TASK-367 desplegados.
Siguiente recomendado:
- Ejecutar TASK-370 QA local completo del paquete password-flows antes de TASK-371 deploy Azure.
