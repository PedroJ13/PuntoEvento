Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Tarea completada: TASK-366 - Web Dev ojo password y cambio de password en panel empresa.
Archivos cambiados:
- `panel.html`
- `panel.css`
- `panel.js`
Verificacion ejecutada:
- Lectura de `AGENTS.md`, `codex-project-templates/EJECUCION_TECNICA.md`, `codex-project-templates/WEB_DEV.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS_MVP.md`, `tasks/TASK-365-HANDOFF.md` y `tasks/TASK-366-assignment.md`.
- `node --check panel.js`: OK.
- `git diff --check`: sin errores; solo warnings esperados LF/CRLF.
- `Select-String` confirmo `panel.css?v=16`, `panel.js?v=19`, `data-password-toggle` y `data-password-form` en `panel.html`.
- Revision estatica con `rg` sobre `panel.js`, `panel.html`, `panel.css`, `api/company-auth-password` y `api/shared/companyAuth.js`: sin `localStorage`, `sessionStorage`, `console.log` ni patrones de password/token en URLs o logs.
- Validacion local/estructural de integracion: el formulario autenticado llama `POST /api/company-auth/password` con `currentPassword`, `newPassword` y `passwordConfirmation`; no envia `email`, `companyId` ni `userId`.
Resultado:
- Agregado ojo Ver/Ocultar en login de empresa.
- Agregado ojo Ver/Ocultar en activacion inicial.
- Agregada seccion `Cambiar contrasena` en vista autenticada `Mi empresa`.
- El formulario valida localmente campos requeridos, minimo 10 caracteres, maximo 128, letras y numeros, confirmacion coincidente y nueva contrasena distinta de la actual.
- El formulario consume el endpoint de TASK-365 y muestra mensajes seguros para errores conocidos.
- Despues de exito, limpia campos y devuelve inputs a `type=password`.
- No se guardan passwords en storage ni se imprimen en consola.
- Cache busting actualizado a `panel.css?v=16` y `panel.js?v=19`.
Uso DB/storage cloud: No, motivo: implementacion frontend y verificacion local/estructural sin llamadas a Azure ni datos reales; alcance: HTML/CSS/JS del panel empresa.
Riesgos o pendientes:
- No se ejecuto validacion visual en navegador porque la herramienta de navegador no estuvo disponible en esta sesion.
- Requiere QA local/funcional posterior con navegador para desktop/mobile y flujo real o mockeado contra el endpoint.
- El endpoint backend de TASK-365 aun no esta desplegado en Azure; no desplegar UI antes de QA/deploy coordinado del bloque.
Siguiente recomendado:
- Ejecutar TASK-370 QA local completo del paquete password-flows antes de TASK-371 deploy Azure.
