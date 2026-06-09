# TASK-163: QA - validacion email de cotizacion

Equipo: QA

Tarea validada: cotizacion publica conectada a `POST /api/public/leads`.

Ambiente: local/estructural con mocks, segun `TASK-161` y `TASK-162`. No hubo SendGrid/mailbox observable ni Azure validado para esta tarea.

Resultado: aprobado local/estructuralmente con observaciones; no aprobado como validacion real de email.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| `node --check app.js` | PASS | Sintaxis OK. |
| `node --check api/public-leads/index.js` | PASS | Sintaxis OK. |
| `node --check api/shared/email.js` | PASS | Sintaxis OK. |
| Datos invalidos | PASS | Email invalido responde `400 { error: "Invalid email" }`. |
| Empresa/servicio publicados con email exitoso | PASS estructural | Responde `201 { ok: true, leadId }`; response no filtra email privado de empresa. |
| Empresa no publicada | PASS | Responde `404 { error: "Service not found" }`. |
| Servicio no publicado | PASS | Responde `404 { error: "Service not found" }`. |
| Empresa publicada sin email | PASS | Responde `409 { error: "Company cannot receive leads" }`. |
| Fallo proveedor email | PASS estructural | Lead creado `pending`, update `failed`, API responde `502` con `leadId`. |
| UI cotizacion desktop/mobile con servicio publicado mock | PASS | Boton con `companyId/serviceId` abre drawer y envia payload a `/api/public/leads`. |
| Doble submit | PASS parcial | UI deshabilita submit mientras envia; no se pudo comprobar duplicado real sin backend persistente. |
| Recepcion real de email | NOT RUN | Sin mailbox/log SendGrid observable. |

## Evidencia

Payload observado desde UI mock:

```json
{
  "companyId": "company_qa_quote",
  "serviceId": "service_qa_quote",
  "name": "Cliente QA",
  "email": "cliente@example.test",
  "phone": "8888-8888",
  "eventType": "Boda",
  "eventDate": "",
  "guests": "80",
  "message": "Necesito cotizar para QA."
}
```

Confirmacion visible:

```text
SOLICITUD ENVIADA
Solicitud lista para revisar
Recibimos tu solicitud y la enviaremos a la empresa correspondiente.
```

## Bugs y riesgos

### P0/P1

- P1 de release: no se puede aprobar email real de cotizacion sin Azure/SendGrid/mailbox observable.

### P2

- No hay rate limiting/CAPTCHA para endpoint publico, riesgo de spam ya documentado en `TASK-161`.
- Doble submit fue validado solo visualmente/estructuralmente, no contra persistencia real de `Leads`.

## Recomendacion de release

No liberar cotizacion real a empresas hasta validar en Azure con servicio publicado real y mailbox/log observable. Localmente el contrato, UI y errores principales quedan aprobados.
