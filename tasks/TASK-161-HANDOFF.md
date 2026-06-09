# TASK-161: Backend/API - email de cotizacion a empresa

## Estado

Completada local/estructuralmente.

## Endpoint creado

```text
POST /api/public/leads
```

Recibe una solicitud publica de cotizacion, valida que empresa y servicio esten publicados, persiste el lead en `Leads` y envia email a `Company.email` usando SendGrid.

## Contrato

Request:

```json
{
  "companyId": "company_123",
  "serviceId": "service_123",
  "name": "Cliente",
  "email": "cliente@email.com",
  "phone": "8888-8888",
  "eventType": "Boda",
  "eventDate": "2026-08-15",
  "guests": "80",
  "message": "Necesito cotizar..."
}
```

Response `201`:

```json
{
  "ok": true,
  "leadId": "lead_123"
}
```

Errores principales:

```text
400 datos invalidos
404 empresa/servicio no publicado o inexistente
409 empresa sin email operativo
502 email no pudo enviarse
```

## Proveedor de email

SendGrid via HTTPS desde Azure Functions.

Variables necesarias para envio real:

```text
SENDGRID_API_KEY
NOTIFICATION_EMAIL_FROM
NOTIFICATION_EMAIL_FROM_NAME
```

## Archivos cambiados

- `api/public-leads/function.json`
- `api/public-leads/index.js`
- `api/shared/email.js`
- `api/shared/azure.js`
- `api/shared/config.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/ROUTE_MAP_MVP.md`
- `docs/ARCHITECTURE.md`

## Verificacion ejecutada

```text
node --check api/public-leads/index.js
node --check api/shared/email.js
node --check api/shared/azure.js
node --check api/shared/config.js
```

Resultado: OK.

Validacion estructural:

```json
{
  "route": "public/leads",
  "methods": "post",
  "authLevel": "anonymous"
}
```

## Riesgos operativos

- No se envio email real en local porque requiere `SENDGRID_API_KEY` y remitente verificado.
- No hay rate limiting/CAPTCHA; riesgo de spam en endpoint publico.
- Si SendGrid falla, el lead queda persistido con `emailStatus=failed` y la API responde `502`.
- El frontend debe evitar doble submit para reducir duplicados.

## Siguiente recomendado

Web Dev:

```text
Conectar formulario/CTA de cotizacion a POST /api/public/leads usando companyId/serviceId del servicio publicado.
```

QA:

```text
Validar caso exitoso con mailbox observable, empresa/servicio no publicados, datos invalidos, respuesta sin email privado de empresa y fallo controlado de SendGrid.
```
