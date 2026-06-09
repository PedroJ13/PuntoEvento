# TASK-179: QA Azure - reintento emails reales ACS post-deploy

Equipo: QA

Tarea validada: reintento de emails reales en Azure usando Azure Communication Services Email despues del deploy backend ACS.

Ambiente probado:

- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Dependencia revisada: `TASK-178-HANDOFF.md` indica deploy backend ACS completado en `main/dbb3f75`.
- Assets publicos observados: `index.html` sirve `app.js?v=25` y `styles.css?v=19`.

Resultado: aprobado tecnicamente con observacion; falta confirmacion externa de recepcion en mailbox para cerrar go final.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-177-HANDOFF.md`, `TASK-178-HANDOFF.md` y `TASK-179-assignment.md`. |
| Confirmar deploy backend ACS previo | PASS | `TASK-178` desplego commit `dbb3f75` y smoke de `/api/public/leads` paso con `201`. |
| Crear empresa QA con mailbox observable como email privado | PASS | `POST /api/companies/register -> 201`, empresa `company_35a2b2f7-87e4-47d3-a835-26bdd01bd350`. El valor del mailbox no fue impreso. |
| Registro empresa genera email interno | PASS tecnico | Registro respondio `201`; subject esperado: `Nueva empresa registrada: QA TASK-179 ACS 20260601075055`. Falta confirmacion visual/externa en mailbox. |
| Aprobar empresa QA | PASS | `POST /api/internal/companies/{companyId}/approve -> 200`, status `published`. |
| Activar sesion empresa | PASS con observacion | Invite `201`, activate `200`, cookie de sesion recibida. La respuesta de activacion incluye el email del usuario autenticado, esperado para el panel empresa; no se imprimio el valor. |
| Crear servicio QA | PASS | `POST /api/companies/me/services -> 201`, servicio `service_1412cc0b-b84f-46d7-8c1d-3963fd0a74da`. |
| Servicio enviado a revision genera email interno | PASS tecnico | `POST /api/companies/me/services/{serviceId}/submit-review -> 200`, status `pending`; subject esperado: `Servicio enviado a revision: Servicio QA TASK-179 20260601075055`. Falta confirmacion visual/externa en mailbox. |
| Aprobar servicio QA | PASS | `POST /api/internal/services/{companyId}/{serviceId}/approve -> 200`, status `published`. |
| Servicio aprobado aparece publico sin email privado | PASS | `GET /api/public/services -> 200`; servicio QA visible; response publico no contiene mailbox privado. |
| Cotizacion publica genera email a empresa y responde exito | PASS | `POST /api/public/leads -> 201`, body `{ ok: true, leadId: "lead_f3e9bee7-9acb-4c8b-8e78-846901deda55" }`; subject esperado: `Nueva cotizacion para Servicio QA TASK-179 20260601075055`. |
| Lead queda marcado como enviado | PASS | Lectura puntual en Table Storage: `status=received`, `emailStatus=sent`, `emailSentAt` presente. No se imprimieron connection strings ni emails. |
| Responses sin secretos ni detalles ACS sensibles | PASS | Responses revisadas sin connection strings, access keys, firmas HMAC, headers ACS, token hashes, session tokens ni `azurecomm.net`. |
| Limpieza de empresa QA | PASS | `POST /api/internal/companies/{companyId}/reject -> 200`, status `rejected`, razon `QA cleanup TASK-179`. |

Hallazgos:

- El P1 de `TASK-177` sobre `/api/public/leads -> 502` queda corregido a nivel backend/API: el mismo flujo ahora responde `201`.
- La cotizacion publica queda registrada con `emailStatus=sent`, lo que confirma que el backend no solo acepto el request, sino que ejecuto la ruta de envio y actualizo el lead como enviado.
- Los emails internos de registro y submit-review no tienen tabla de estado equivalente; la validacion tecnica confirma que los flujos principales no fallan y que no exponen secretos, pero QA no tiene lectura directa del mailbox desde este chat.
- Se generaron tres asuntos unicos para confirmacion externa en mailbox:
  - `Nueva empresa registrada: QA TASK-179 ACS 20260601075055`
  - `Servicio enviado a revision: Servicio QA TASK-179 20260601075055`
  - `Nueva cotizacion para Servicio QA TASK-179 20260601075055`

P0/P1:

- Sin P0/P1 funcionales detectados en backend/API post-deploy.
- Pendiente de release gate: confirmacion externa de recepcion en mailbox/log observable para los tres asuntos anteriores. Si Product/Infra no confirma recepcion, la aprobacion de emails reales queda incompleta.

P2/P3:

- P2: No hay log persistente por email interno de registro o submit-review comparable a `Leads.emailStatus`; QA depende del mailbox o de logs externos para evidenciar recepcion.
- P2: La respuesta autenticada de `activate` incluye el email del usuario de empresa. Es esperable para el panel, pero no debe registrarse en evidencia cuando el email usado sea mailbox interno.
- P2: El flujo publico de leads sigue sin rate limiting/CAPTCHA documentado previamente; riesgo operativo aceptable solo para pre-lanzamiento controlado.

Evidencia:

```text
TASK-178 deploy backend ACS:
main/dbb3f75 Deploy ACS email provider

POST /api/companies/register -> 201
companyId=company_35a2b2f7-87e4-47d3-a835-26bdd01bd350

POST /api/internal/companies/{companyId}/approve -> 200
status=published

POST /api/internal/company-invites -> 201
POST /api/company-auth/activate -> 200
session cookie presente

POST /api/companies/me/services -> 201
serviceId=service_1412cc0b-b84f-46d7-8c1d-3963fd0a74da

POST /api/companies/me/services/{serviceId}/submit-review -> 200
status=pending

POST /api/internal/services/{companyId}/{serviceId}/approve -> 200
status=published

GET /api/public/services -> 200
serviceVisible=true
containsMailbox=false

POST /api/public/leads -> 201
{
  "ok": true,
  "leadId": "lead_f3e9bee7-9acb-4c8b-8e78-846901deda55"
}

Azure Table Storage Leads:
leadId=lead_f3e9bee7-9acb-4c8b-8e78-846901deda55
status=received
emailStatus=sent
emailSentAt=present

POST /api/internal/companies/{companyId}/reject -> 200
status=rejected
```

Riesgos o pendientes:

- Falta que Product Owner, Infra o quien tenga acceso al mailbox observable confirme recepcion de los tres correos con los asuntos unicos indicados.
- Si no aparecen en mailbox, revisar logs de Azure Functions/ACS Email para los timestamps de `2026-06-01 07:50:55 America/Costa_Rica`.
- La empresa QA fue rechazada despues del test para no dejarla publica; el lead y entidades quedan como evidencia trazable, sin hard delete.

Recomendacion go/no-go pre-lanzamiento:

- Go tecnico de backend/API para el flujo de cotizacion: aprobado, `201` y `emailStatus=sent`.
- Go final de emails reales: condicionado a confirmacion externa de recepcion en mailbox de los tres asuntos.
- Si se confirma recepcion, QA recomienda cerrar el no-go de email y pasar a decision Product / Architect / Release para aceptar P2 restantes.
