# TASK-159: Web Dev - UI de activacion/login recurrente en panel

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Flujo UI implementado

- `panel.html?invite=...` muestra un bloque de activacion inicial para definir password.
- `panel.html` sin sesion muestra login recurrente con email/password.
- Sesion vigente sigue cargando el panel via `GET /api/companies/me` y `GET /api/companies/me/services`.
- Logout llama `POST /api/company-auth/logout`, limpia parametros de invitacion y vuelve al login.
- Los mensajes de error de login son genericos y no revelan si un email existe.

## Archivos cambiados

- `panel.html`
- `panel.js`
- `panel.css`

## Cache busting

- `panel.html` ahora carga `panel.js?v=6`.
- `panel.html` ahora carga `panel.css?v=6`.

## Verificacion realizada

- `node --check panel.js`: OK.
- Playwright local en `http://127.0.0.1:59999/panel.html?invite=token_qa` con viewport mobile `390x844`: mostro `Activa tu acceso`.
- Playwright local en `http://127.0.0.1:59999/panel.html` con `GET /api/companies/me -> 401`: mostro `Iniciar sesion` y oculto `Cerrar sesion`.

## Riesgos

- No se probo contra Azure real ni con Table Storage real.
- La activacion depende de que `POST /api/company-auth/activate` ya este desplegado.
- No hay lockout/rate limiting visible desde frontend; queda en riesgo Backend/API.

## Recomendacion para QA

Validar en Azure: activacion por invitacion, login recurrente valido, credenciales invalidas con mensaje generico, refresh con sesion vigente, logout y sesion expirada en desktop/mobile.

## Siguiente tarea sugerida

`TASK-160`: QA enfocada de login recurrente empresa despues de deploy de `panel.js?v=6` y `panel.css?v=6`.
