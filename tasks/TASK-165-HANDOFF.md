# TASK-165: QA - validacion emails internos

Equipo: QA

Tarea validada: emails internos de registro de empresa y envio de servicio a revision.

Ambiente: local/estructural, segun handoff de `TASK-164`. Revalidado en la ronda conjunta de `TASK-160/163/165/167`. No hubo ambiente Azure con SendGrid configurado ni mailbox observable para QA.

Resultado: no aprobado para validacion real de email; aprobado solo local/estructuralmente con observaciones.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Lectura de dependencia `TASK-164` | PASS | `TASK-164` indica implementacion local/estructural, sin envio real Azure probado. |
| Syntax check `api/companies-register/index.js` | PASS | `node --check` OK. |
| Syntax check `api/company-services-submit-review/index.js` | PASS | `node --check` OK. |
| Syntax check `api/shared/email.js` | PASS | `node --check` OK. |
| Syntax check `api/shared/config.js` | PASS | `node --check` OK. |
| Registro de empresa con configuracion SendGrid ausente | PASS local | `notifyCompanyRegistration` no lanza error y registra warning controlado. |
| Servicio enviado a revision con configuracion SendGrid ausente | PASS local | `notifyServiceSubmittedForReview` no lanza error y registra warning controlado. |
| Payload SendGrid simulado para registro | PASS local | Destinatario interno `ops@example.test`, remitente `from@example.test`, asunto generado y HTML escapado. |
| Payload SendGrid simulado para servicio a revision | PASS local | Destinatario interno `ops@example.test`, remitente `from@example.test`, asunto generado y HTML escapado. |
| Fallo SendGrid simulado `500` | PASS parcial | La funcion de email rechaza con `SendGrid returned 500: forced qa failure` y no incluye API key fake en el error. |
| Flujo principal no depende del email | PASS estructural | Los handlers envuelven la notificacion en `try/catch` y responden `201`/`200` despues del bloque de warning. |
| Recepcion real de email interno | NOT RUN | No hubo `SENDGRID_API_KEY`, remitente verificado, `NOTIFICATION_EMAIL_TO` ni mailbox observable asignados a QA. |
| Log verificable en Azure | NOT RUN | No hubo ambiente indicado con logs Azure accesibles para esta tarea. |
| Revalidacion en ronda conjunta | PASS limitado | Se mantiene la misma conclusion: comportamiento local/estructural OK, sin aprobacion de entrega real. |

## Evidencia

Configuracion ausente:

```json
{
  "ok": true,
  "warningCount": 2,
  "warnings": [
    "Internal notification skipped: missing SendGrid configuration.",
    "Internal notification skipped: missing SendGrid configuration."
  ]
}
```

SendGrid simulado:

```json
{
  "ok": true,
  "capturedCount": 2,
  "summary": [
    {
      "to": "ops@example.test",
      "subject": "Nueva empresa registrada: QA <Empresa>",
      "from": "from@example.test",
      "hasRawHtmlInjection": false,
      "escapedSnippetPresent": true
    },
    {
      "to": "ops@example.test",
      "subject": "Servicio enviado a revision: Mesa <dulce> QA",
      "from": "from@example.test",
      "hasRawHtmlInjection": false,
      "escapedSnippetPresent": true
    }
  ]
}
```

Fallo simulado:

```json
{
  "ok": true,
  "errorMessage": "SendGrid returned 500: forced qa failure",
  "containsApiKey": false
}
```

Evidencia estructural:

- `api/companies-register/index.js` llama `notifyCompanyRegistration` dentro de `try/catch` y luego responde `201`.
- `api/company-services-submit-review/index.js` llama `notifyServiceSubmittedForReview` dentro de `try/catch` y luego responde `200`.
- `api/shared/email.js` omite envio con warning si falta `SENDGRID_API_KEY`, `NOTIFICATION_EMAIL_FROM` o `NOTIFICATION_EMAIL_TO`.
- `api/shared/email.js` escapa contenido HTML con `escapeText`.

## Bugs / hallazgos

### P0/P1

- P1: No se puede aprobar la validacion real de emails internos porque no hay evidencia de recepcion ni log Azure observable. `TASK-164` dejo la implementacion como local/estructural y explicito que no se probo envio real en Azure.

### P2/P3

- P2: Si SendGrid devuelve un cuerpo de error, el warning de los handlers incluiria `error.message`, que puede contener el body devuelto por SendGrid. La prueba confirma que no incluye la API key, pero Product/Backend deberian aceptar si ese nivel de detalle en logs es adecuado.
- P2: El fallback por configuracion ausente funciona, pero los flujos principales no fueron ejecutados end-to-end contra Azure en esta tarea.

## Riesgos

- Sin `NOTIFICATION_EMAIL_TO` observable, QA no puede confirmar que registro y revision lleguen al mailbox interno correcto.
- Sin logs Azure accesibles, QA no puede confirmar warnings reales de proveedor fallando en ambiente desplegado.
- La validacion de no bloqueo del flujo principal queda estructural; no sustituye una prueba HTTP real contra Azure.

## Recomendacion para Product / Architect / Release

No mover `TASK-165` a aprobado completo todavia. Crear o pedir a Infra una tarea corta para configurar SendGrid en Azure con mailbox interno observable para QA, y luego reintentar:

- Registro de empresa nuevo -> email interno recibido o log de envio confirmado.
- Servicio enviado a revision -> email interno recibido o log de envio confirmado.
- Proveedor fallando/configuracion ausente -> registro y submit-review siguen respondiendo exito, con warning sin secretos.

Siguiente recomendado: Infra Azure debe confirmar variables `SENDGRID_API_KEY`, `NOTIFICATION_EMAIL_FROM`, `NOTIFICATION_EMAIL_TO`, `NOTIFICATION_EMAIL_FROM_NAME` y acceso QA a mailbox/logs antes de repetir QA real.
