# TASK-185: QA Azure - reintento invite automatico post-deploy

Equipo: QA

Tarea validada: aprobacion de empresa genera invitacion automatica/email de activacion post-deploy y feedback admin.

Ambiente probado:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Dependencia revisada: `TASK-184-HANDOFF.md` indica deploy completado en `main/b83b066`.

Resultado: aprobado parcialmente; no aprobado como cierre total del flujo porque QA no pudo abrir el mailbox para usar el enlace de activacion.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-184-HANDOFF.md`, `TASK-182-HANDOFF.md` y `TASK-185-assignment.md`. |
| Confirmar assets admin en Azure | PASS | `/admin.html?qa=20260601114332 -> 200`; sirve `admin.js?v=17=true`, `admin.css?v=12=true`; no sirve assets anteriores `admin.js?v=16/admin.css?v=11`. |
| Registrar empresa QA con mailbox observable | PASS | `POST /api/companies/register -> 201`, empresa `company_cb256b6b-9ccb-49d4-9ee4-71d8643569e5`, slug `qa-task-185-invite-20260601114332`. Mailbox no impreso. |
| Aprobar empresa desde API interna | PASS | `POST /api/internal/companies/{companyId}/approve -> 200`, status `published`, `invite.status=email_sent`, `emailSent=true`, `inviteId` y `expiresAt` presentes. |
| Response sin enlace/token/secretos | PASS | Response de approve no expone `inviteUrl`, `panel.html?invite=`, token completo, `tokenHash`, cookies, connection strings ni secretos. |
| Reintento/no duplicado | PASS | Segundo approve sobre la misma empresa -> `invite.status=active_exists`, `emailSent=false`, warning claro, mismo `inviteId`; no se reenvia token ni se crea duplicado visible. |
| Mensaje admin visible | PASS | Flujo UI real con empresa `company_c7d602fa-e8fd-407f-8ec2-83cc96eb075f`: approve desde admin respondio `200` y la barra mostro `Empresa aprobada e invitacion enviada.` con `data-tone=success`. |
| DOM sin token/secretos | PASS | Playwright confirmo que el DOM visible no contiene `inviteUrl`, `panel.html?invite=`, `tokenHash`, `passwordHash`, `sessionToken`, connection strings ni secretos. |
| Confirmar email recibido con enlace de activacion | NO APROBADO | El backend reporto `emailSent=true`, pero QA no tiene acceso directo al mailbox observable para confirmar recepcion ni extraer el enlace. |
| Activar password desde enlace | NO EJECUTABLE | El enlace completo solo existe en el email; no se devuelve por API ni se guarda en claro, lo cual es correcto por seguridad. |
| Login recurrente con email/password | NO EJECUTABLE | Depende de activar password desde el enlace recibido por correo. |
| Limpieza QA | PASS | Empresas QA creadas para API y UI fueron rechazadas con soft cleanup: `QA cleanup TASK-185` y `QA cleanup TASK-185 UI`. |

Hallazgos:

- El P1 de `TASK-182` por deploy pendiente queda corregido: Azure ya sirve `admin.js?v=17/admin.css?v=12`.
- El backend desplegado ya implementa el contrato de `TASK-180`: approve devuelve objeto `invite`, `invite.status=email_sent` y `emailSent=true`.
- El comportamiento de no duplicado funciona: reaprobar con invite activo vigente devuelve `active_exists`, no reenvia token y muestra warning seguro.
- La UI admin de `TASK-181` funciona en Azure: muestra mensaje de invitacion enviada con tono `success`.
- El tramo final email -> enlace -> activar password -> login recurrente no pudo validarse desde este chat por falta de acceso al mailbox observable.

P0/P1:

- Sin P0/P1 detectados en API/UI para generacion automatica de invite.
- P1 pendiente de release gate del flujo completo: falta validar recepcion real del email y activacion/login usando el enlace recibido.

P2/P3:

- P2: Playwright reporto un `404` no bloqueante durante carga de admin; no afecto login, moderacion ni mensaje de invitacion.
- P2: La validacion de activacion depende de un actor con acceso al mailbox. Si QA debe cerrarlo autonomamente, necesita un mailbox de prueba accesible o que Product/Infra comparta temporalmente el enlace completo por canal seguro.

Evidencia:

```text
Deploy base:
main/b83b066 Deploy company approval auto invite

GET /admin.html?qa=20260601114332 -> 200
admin.js?v=17=true
admin.css?v=12=true
admin.js?v=16=false
admin.css?v=11=false

Empresa API:
companyId=company_cb256b6b-9ccb-49d4-9ee4-71d8643569e5
slug=qa-task-185-invite-20260601114332

POST /api/internal/companies/{companyId}/approve -> 200
{
  "ok": true,
  "status": "published",
  "invite": {
    "status": "email_sent",
    "inviteId": "invite_5d4cda33-207c-4ce7-ab79-d1908be99049",
    "expiresAt": "2026-06-02T17:43:43.897Z",
    "emailSent": true
  }
}

POST /api/internal/companies/{companyId}/approve reintento -> 200
invite.status=active_exists
emailSent=false
warning=Company approved, but activation email was not sent because an active invite already exists.

Empresa UI:
companyId=company_c7d602fa-e8fd-407f-8ec2-83cc96eb075f
approveStatus=200
statusText=Empresa aprobada e invitacion enviada.
statusTone=success
domLeaksForbidden=false

Soft cleanup:
company_cb256b6b-9ccb-49d4-9ee4-71d8643569e5 -> rejected
company_c7d602fa-e8fd-407f-8ec2-83cc96eb075f -> rejected
```

Riesgos o pendientes:

- Las empresas QA fueron rechazadas despues de la prueba; los enlaces de activacion enviados para esas empresas ya no deben considerarse utiles para activar panel, porque la empresa queda fuera de estados permitidos.
- Para cerrar el flujo completo, ejecutar una prueba final coordinada: aprobar una empresa QA, no limpiarla hasta que Product/Infra confirme recepcion del email, abra el enlace, defina password e inicie sesion recurrente.
- No publicar ni pegar el token completo en handoffs. Si se comparte el enlace para QA, hacerlo por canal seguro y redactarlo en evidencia.

Recomendacion go/no-go para invitar primeras empresas reales:

- Go tecnico para backend/UI de auto-invite: aprobado.
- No-go final para el flujo completo hasta confirmar recepcion del email de activacion y completar password/login recurrente desde el enlace.
- Siguiente recomendado: Product/Infra confirma correo `Activa tu acceso a Punto Evento` o habilita a QA un mailbox observable accesible; luego QA ejecuta el ultimo paso sin limpiar la empresa hasta terminar activacion/login.
