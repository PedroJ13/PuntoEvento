# TASK-177: QA Azure - validar emails reales con ACS Email

Equipo: QA

Tarea validada: emails reales en Azure usando Azure Communication Services Email.

Ambiente probado:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-05-31`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Assets publicos observados: `index.html` sirve `app.js?v=25` y `styles.css?v=19`.

Resultado: no aprobado.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-177-assignment.md`, `TASK-175-HANDOFF.md` y `TASK-176-HANDOFF.md`. |
| Confirmar servicios publicados disponibles | PASS | `GET /api/public/services -> 200`, `items=13`. Servicio usado: `Servicio Intertect 2`, empresa `INTERTEC | Costa Rica`. |
| Confirmar que listado publico no expone email privado | PASS | Item publico revisado no contiene email visible. |
| Cotizacion publica genera email a empresa | FAIL | `POST /api/public/leads -> 502`, body seguro: `{ "error": "Lead email could not be sent", "leadId": "lead_65350ac2-b545-4804-98ae-00293920b80f" }`. |
| Registro empresa genera email interno | NO APROBADO | `POST /api/companies/register -> 201`, empresa QA `company_628bf41b-612a-4541-b2d0-920544b87af4`; no hubo evidencia de recepcion/log observable del email interno. |
| Servicio enviado a revision genera email interno | NO APROBADO | Invite/activate `201/200`, create service `201`, `POST /api/companies/me/services/{serviceId}/submit-review -> 200`, servicio `pending`; no hubo evidencia de recepcion/log observable del email interno. |
| Fallo de email no rompe registro | PASS parcial | Registro respondio `201` aun cuando la ruta de email real no esta aprobada. |
| Fallo de email no rompe submit-review | PASS parcial | Submit-review respondio `200` y dejo servicio `pending` aun cuando email interno no quedo verificable. |
| Responses no exponen secretos | PASS | Responses revisadas sin connection strings, access keys, firmas, headers ACS, token hashes, session tokens ni emails privados de empresa. |
| App settings ACS presentes en Azure | PASS | Confirmada presencia por nombre, sin imprimir valores: `EMAIL_PROVIDER`, `AZURE_COMMUNICATION_CONNECTION_STRING`, `AZURE_COMMUNICATION_EMAIL_FROM`, `NOTIFICATION_EMAIL_FROM`, `NOTIFICATION_EMAIL_FROM_NAME`, `NOTIFICATION_EMAIL_TO`. |
| Smoke directo ACS Email | PASS infraestructura | `az communication email send` usando app settings internamente termino `exit_0`; asunto: `Punto Evento ACS smoke TASK-177 20260531175353`. |
| Limpieza de datos QA | PASS | Empresa QA creada para submit-review fue rechazada por admin interno con razon `QA cleanup TASK-177`. |

Hallazgos:

- La infraestructura ACS Email responde correctamente en smoke directo, pero el backend desplegado de `POST /api/public/leads` sigue sin enviar email y responde `502`.
- `TASK-176` quedo documentado como completado local/estructuralmente, pero `origin/main` sigue en commit `7437baf` y los cambios locales de `api/shared/email.js` / `api/shared/config.js` aparecen modificados en working tree, por lo que Azure probablemente aun no sirve el provider ACS actualizado o hay un fallo backend pendiente de diagnostico post-deploy.
- Los emails internos de registro y submit-review son best effort y las respuestas API no prueban recepcion. Sin mailbox/log observable accesible para QA, no se pueden aprobar como emails reales.

P0/P1:

- P1: Cotizacion publica por email real no funciona en Azure. El endpoint `POST /api/public/leads` devuelve `502 Lead email could not be sent`.
- P1: No hay evidencia de recepcion/log observable para emails internos de registro y submit-review, por lo que el requisito de emails reales ACS no queda aprobado.

P2/P3:

- P2: No se pudo ejecutar una prueba controlada de fallo de email modificando configuracion, porque implicaria tocar app settings del ambiente Azure. Se valido el comportamiento best effort por resultado de registro/submit-review, pero falta una prueba controlada dedicada en ambiente seguro o con toggle.
- P2: El flujo publico de leads sigue sin rate limiting/CAPTCHA documentado en `TASK-176`; riesgo de spam post-MVP o durante invitaciones reales.

Evidencia:

```text
GET /api/public/services -> 200
items=13
selectedCompanyId=company_010e60dd-132c-4eb0-baa5-070c8f5d9867
selectedServiceId=service_c2d84149-2773-4320-9ebf-5c8190ac4af2
selectedServiceName=Servicio Intertect 2
publicServiceContainsEmail=false

POST /api/public/leads -> 502
{
  "error": "Lead email could not be sent",
  "leadId": "lead_65350ac2-b545-4804-98ae-00293920b80f"
}

POST /api/companies/register -> 201
companyId=company_628bf41b-612a-4541-b2d0-920544b87af4
slug=qa-task-177-acs-20260531175120

POST /api/internal/company-invites -> 201
POST /api/company-auth/activate -> 200
POST /api/companies/me/services -> 201
serviceId=service_05ccf819-df36-47d7-ba63-11631ad0ec0c
POST /api/companies/me/services/{serviceId}/submit-review -> 200
status=pending

az communication email send -> exit_0
subject=Punto Evento ACS smoke TASK-177 20260531175353
```

Riesgos o pendientes:

- No hay go de pre-lanzamiento mientras la cotizacion real por email siga devolviendo `502`.
- Falta deploy o diagnostico Backend/API del provider ACS en Azure.
- Falta confirmacion de recepcion en mailbox/log observable para los tres tipos de email: cotizacion a empresa, registro interno y submit-review interno.
- El smoke directo ACS confirma infraestructura, pero no sustituye la validacion end-to-end del backend.

Siguiente recomendado:

1. Backend/API o Infra Azure debe desplegar los cambios de `TASK-176` si aun no estan en Azure, o revisar logs de Functions para el `leadId` `lead_65350ac2-b545-4804-98ae-00293920b80f`.
2. Reintentar `TASK-177` despues del deploy/diagnostico, con acceso a mailbox o log observable.
3. Mantener recomendacion QA: no-go pre-lanzamiento hasta que `POST /api/public/leads` responda `201` y haya evidencia de recepcion real de emails.
