# TASK-185: QA Azure - reintento invite automatico post-deploy

## Equipo asignado

QA.

## Contexto

`TASK-182` no aprobo porque Azure no tenia desplegados `TASK-180` ni `TASK-181`.

`TASK-185` debe ejecutarse despues de `TASK-184`.

## Tarea

Validar en Azure real que al aprobar una empresa se envia email de activacion y la empresa puede definir password e iniciar sesion recurrente.

## Alcance

- Confirmar que Azure sirve `admin.js?v=17` y `admin.css?v=12`.
- Registrar empresa QA con mailbox observable.
- Aprobar empresa desde admin interno/API.
- Confirmar que la respuesta incluye `invite.status=email_sent` o warning esperado.
- Confirmar mensaje admin visible segun `invite.status`.
- Confirmar email recibido con enlace de activacion, sin publicar token completo en el handoff.
- Activar password desde el enlace.
- Iniciar sesion recurrente con email/password.
- Validar que no se exponen `inviteUrl`, token completo, `tokenHash`, cookies ni secretos en DOM/responses/logs visibles.
- Validar reintento/no duplicado si el flujo lo permite sin riesgo.
- Limpiar datos QA creados usando soft cleanup/reject documentado.

## No tocar

- Codigo.
- App settings o secretos.
- Datos reales.
- Limpieza destructiva.

## Verificacion

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Mailbox observable.
- Evidencia redactada.
- Clasificacion P0/P1/P2.

## Handoff esperado

Crear `tasks/TASK-185-HANDOFF.md` con ambiente probado, empresa QA usada, casos ejecutados, resultado del email de activacion, resultado de login recurrente, evidencia redactada, bugs/riesgos y recomendacion go/no-go para invitar primeras empresas reales.
