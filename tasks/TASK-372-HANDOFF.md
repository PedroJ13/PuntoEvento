Equipo: QA
Tarea validada: TASK-372 - QA Azure de password-flows con cuenta autorizada
Ambiente: Azure produccion `https://puntoeventocr.com` y `https://www.puntoeventocr.com`, PowerShell local, `Invoke-WebRequest`/`curl.exe` con red elevada. Sin credenciales de empresa QA, sin destino de correo autorizado y sin credencial admin autorizada en este hilo.
Resultado: bloqueado funcionalmente por falta de cuenta autorizada; smokes Azure aprobados

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `codex-project-templates/CHAT_MODEL.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-372-assignment.md` y `tasks/TASK-371-HANDOFF.md`.
- Smoke HTTPS no destructivo:
  - `https://puntoeventocr.com/` -> `200`
  - `https://puntoeventocr.com/panel.html` -> `200`
  - `https://puntoeventocr.com/admin.html` -> `200`
  - `https://www.puntoeventocr.com/` -> `200`
  - `https://www.puntoeventocr.com/panel.html` -> `200`
- Revision de HTML/JS publicado:
  - `panel.html` -> `200`, contiene `panel.js?v=20`.
  - `panel.html` contiene `data-password-toggle`, `data-reset-request-form`, `data-reset-complete-form` y `data-password-form`.
  - `admin.html` -> `200`, contiene `admin.js?v=26`.
  - `admin.js?v=26` -> `200`, contiene ruta `/password-reset` y `data-company-password-reset`.
  - `panel.js?v=20` -> `200`, contiene `data-reset-complete-form` y `data-password-toggle`.
- Endpoints negativos/no destructivos:
  - `GET /api/company-password-resets/validate?token=invalid-task372` -> `200`, `valid=false`, `status=invalid`.
  - `POST /api/company-password-resets` con correo inexistente `.invalid` -> `200`, respuesta generica `ok=true`.
  - `POST /api/company-password-resets/complete` con token falso y payload sintetico -> `400`, `code=RESET_INVALID`.
  - `POST /api/company-auth/password` sin sesion y con payload estructural correcto -> `401`, `code=UNAUTHORIZED`.
  - `POST /api/company-auth/login` con credenciales sinteticas invalidas -> `401`, mensaje generico `Invalid email or password`.
  - `POST /api/internal/companies/company_task372/password-reset` sin credencial admin -> `401`, `Credenciales invalidas`.
  - `GET /api/public/services?limit=1&cb=task372` -> `200`.

Hallazgos:
- El despliegue reportado por TASK-371 esta visible en Azure para panel y admin: los HTML cargan los cache busters esperados y los marcadores principales de password-flows estan publicados.
- Los endpoints nuevos responden en Azure y las rutas negativas revisadas no exponen password, token, cookie, hash ni link de recuperacion.
- La solicitud publica de reset mantiene respuesta generica para evitar enumeracion de correos.
- El cambio autenticado de password rechaza correctamente la llamada sin sesion cuando el payload usa `passwordConfirmation`.
- El endpoint admin de reset rechaza correctamente llamadas sin credencial admin.
- El catalogo publico sigue respondiendo despues del despliegue.

P0/P1:
- Ninguno confirmado por smokes publicos/no destructivos.
- Bloqueo funcional de alcance: no se pudo validar cambio real de password, recepcion de correo real, reset real con link autorizado ni reset admin real porque no se recibieron cuenta de empresa QA, destino de correo autorizado ni credencial admin autorizada en este hilo.

P2/P3:
- P3: validacion browser desktop/mobile queda pendiente porque no hay herramienta de navegador disponible en esta sesion.
- P3: `admin.html` no contiene directamente `data-company-password-reset`; el marcador esta en `admin.js?v=26`. No bloquea el smoke porque la ruta y handler estan publicados en el bundle.
- P3: La primera prueba de `POST /api/company-auth/password` con `confirmPassword` devolvio `400 MISSING_PASSWORD_FIELDS`; con el campo publicado `passwordConfirmation` devolvio `401 UNAUTHORIZED`, que es el resultado esperado sin sesion.

Evidencia:
- Headers publicados incluyen `200 OK` para home, panel y admin en `puntoeventocr.com`; `Last-Modified: Mon, 22 Jun 2026 22:37:32 GMT`.
- `panel.html`: `panel.js?v=20=True`, `data-password-toggle=True`, `data-reset-request-form=True`, `data-reset-complete-form=True`, `data-password-form=True`.
- `admin.html`: `admin.js?v=26=True`.
- `admin.js?v=26`: `/password-reset=True`, `data-company-password-reset=True`.
- API negativa:
  - Validate token falso: `valid=false`, `status=invalid`.
  - Request publico con correo inexistente: `ok=true`, mensaje generico.
  - Complete token falso: `400 RESET_INVALID`.
  - Password change sin sesion: `401 UNAUTHORIZED`.
  - Login invalido: `401 Invalid email or password`.
  - Admin reset sin credencial: `401 Credenciales invalidas`.
  - Catalogo publico: `200`.
- No se imprimieron credenciales reales, cookies, tokens reales, links completos de reset, passwords reales ni headers sensibles.

Riesgos o pendientes:
- La aceptacion completa de TASK-372 requiere cuenta de empresa QA autorizada, destino de correo autorizado y credencial/sesion admin autorizada.
- Queda pendiente confirmar en navegador: ojo de password, mensajes seguros de login invalido, cambio autenticado real, solicitud de reset real, validacion de link real, completado real y reset admin real.
- Sin destino autorizado no se puede verificar entrega de email ni que el enlace real funcione sin exponerlo.

Siguiente recomendado:
- Proyecto/QA debe proveer una cuenta de empresa QA autorizada, mailbox/destino controlado y credencial admin autorizada para una segunda pasada.
- En la segunda pasada, registrar solo evidencia redactada: estados HTTP, presencia de estados UI y resultado funcional, sin passwords, cookies, tokens ni links completos.
