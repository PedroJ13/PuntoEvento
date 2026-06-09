# TASK-170: QA Azure - email de cotizacion a empresa

Equipo: QA

Ambiente probado: Azure real `https://zealous-field-08fdd720f.7.azurestaticapps.net`

Resultado: no aprobado para pre-lanzamiento como email real; aprobado solo en validaciones de endpoint/error y UI basica.

## Servicio / empresa QA usados

Se uso un servicio publicado existente desde `GET /api/public/services`.

- Company ID: `company_010e60dd-132c-4eb0-baa5-070c8f5d9867`
- Service ID: `service_c2d84149-2773-4320-9ebf-5c8190ac4af2`
- Servicio: `Servicio Intertect 2`
- Empresa visible: `INTERTEC | Costa Rica`
- API publica no expuso email privado de empresa en el item usado.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Listar servicios publicados | PASS | `GET /api/public/services -> 200`, `13` items. |
| Cotizacion a servicio publicado | FAIL esperado por config | `POST /api/public/leads -> 502`, body `{ error: "Lead email could not be sent", leadId }`. |
| Datos invalidos | PASS | Email invalido responde `400 { error: "Invalid email" }`. |
| Empresa/servicio inexistente | PASS | Responde `404 { error: "Service not found" }`. |
| Drawer desktop/mobile | PASS | Cubierto en `TASK-172`: drawer abre con servicio publicado, email y mensaje visibles. |
| Evidencia de recepcion email | NOT RUN | No hay SendGrid listo ni mailbox/log observable. |
| Doble submit real | NOT RUN | No se ejecuto para evitar duplicar leads fallidos en Azure sin email operativo. |

## Evidencia de limitacion

`TASK-168` documenta que faltan:

- `SENDGRID_API_KEY`
- `NOTIFICATION_EMAIL_FROM`
- mailbox/log observable confirmado

Por eso el flujo real de entrega por email no puede aprobarse. El endpoint persiste el lead y responde `502` cuando no puede enviar email.

## Bugs / riesgos

### P0/P1

- P1: cotizacion por email no esta lista para pre-lanzamiento porque SendGrid no esta configurado completamente.

### P2

- Endpoint publico no tiene rate limiting/CAPTCHA.
- Hay al menos un lead QA fallido creado por esta prueba: `lead_0196386a-5314-42da-97e6-150ab4257244`.

## Recomendacion de release

No aprobar `TASK-170` para pre-lanzamiento hasta que Infra/Product configure SendGrid y confirme mailbox/log observable. Reintentar solo cotizacion exitosa, recepcion real, doble submit y fallo controlado despues de esa configuracion.
