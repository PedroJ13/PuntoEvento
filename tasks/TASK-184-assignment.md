# TASK-184: Infra Azure - deploy auto-invite al aprobar empresa

## Equipo asignado

Infra Azure.

## Contexto

`TASK-180` completo Backend/API local/estructuralmente: `POST /api/internal/companies/{companyId}/approve` debe crear invite y enviar email de activacion cuando Admin aprueba una empresa.

`TASK-181` completo Web Dev local/estructuralmente: `admin.html` debe servir `admin.js?v=17` y `admin.css?v=12`, y mostrar feedback segun `invite.status`.

`TASK-182` no aprobo porque Azure seguia con versiones anteriores:

- `/admin.html` servia `admin.js?v=16` y `admin.css?v=11`.
- El approve endpoint respondia `{ "ok": true, "status": "published" }` sin objeto `invite`.

## Tarea

Desplegar a Azure los cambios de `TASK-180` y `TASK-181` para habilitar invite automatico al aprobar empresa.

## Alcance

- Revisar que los cambios locales de `TASK-180` y `TASK-181` esten incluidos.
- Ejecutar checks razonables antes de deploy.
- Hacer commit/push/deploy acotado a backend auto-invite, admin UI feedback y docs estrictamente necesarias.
- Confirmar que Azure sirve `admin.js?v=17` y `admin.css?v=12`.
- Hacer smoke controlado de approve en Azure para confirmar que la respuesta incluye `invite.status` o warning claro.

## No tocar

- No cambiar reglas de negocio del invite fuera de lo definido en `TASK-180`.
- No imprimir tokens completos, `inviteUrl`, `tokenHash`, cookies, connection strings ni secretos.
- No hard delete ni limpieza de datos.
- No redisenar admin ni pagina publica.

## Verificacion

- Azure Static Web Apps queda en estado listo.
- `GET /admin.html` referencia `admin.js?v=17` y `admin.css?v=12`.
- `POST /api/internal/companies/{companyId}/approve` devuelve `invite.status` en ambiente Azure para una empresa QA/pending.
- Si se envia email real durante smoke, documentar asunto/fecha y redaccion de token/link.
- Si el email falla, la empresa debe quedar aprobada y la respuesta debe incluir warning sin secretos.

## Handoff esperado

Crear `tasks/TASK-184-HANDOFF.md` con:

- Commit desplegado.
- Archivos incluidos.
- Checks ejecutados.
- Smokes Azure.
- Evidencia de versiones servidas.
- Resultado de `invite.status`.
- Riesgos.
- Recomendacion para QA `TASK-185`.
