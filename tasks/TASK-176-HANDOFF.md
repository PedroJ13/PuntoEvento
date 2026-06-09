# TASK-176: Backend/API - cambiar provider email MVP a Azure Communication Services Email

## Estado

Completada local/estructuralmente.

## Provider final usado

Provider default MVP:

```text
Azure Communication Services Email
```

La capa queda configurable con:

```text
EMAIL_PROVIDER=acs
```

SendGrid queda como fallback explicito solo si se configura:

```text
EMAIL_PROVIDER=sendgrid
```

## Variables requeridas

Para ACS Email:

```text
EMAIL_PROVIDER=acs
AZURE_COMMUNICATION_CONNECTION_STRING
AZURE_COMMUNICATION_EMAIL_FROM
NOTIFICATION_EMAIL_TO
NOTIFICATION_EMAIL_FROM_NAME
```

Compatibilidad:

```text
NOTIFICATION_EMAIL_FROM
```

`NOTIFICATION_EMAIL_FROM` puede actuar como fallback del sender ACS si `AZURE_COMMUNICATION_EMAIL_FROM` no existe.

Fallback legacy SendGrid:

```text
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY
NOTIFICATION_EMAIL_FROM
NOTIFICATION_EMAIL_TO
NOTIFICATION_EMAIL_FROM_NAME
```

## Archivos cambiados

- `api/shared/email.js`
- `api/shared/config.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASK-176-HANDOFF.md`

## Contrato/comportamiento

- `sendEmail` usa ACS Email por defecto.
- Cotizacion publica mantiene el contrato existente: si el email no se puede enviar, responde error claro y no expone detalles tecnicos ni secretos al frontend.
- Emails internos de registro y submit-review siguen siendo best effort: si falta config o falla el provider, el flujo principal no falla.
- No se cambiaron rutas ni payloads publicos.

## Verificacion ejecutada

Sintaxis:

```text
node --check api/shared/email.js
node --check api/shared/config.js
node --check api/public-leads/index.js
node --check api/companies-register/index.js
node --check api/company-services-submit-review/index.js
```

Resultado: OK.

Diff check:

```text
git diff --check -- api/shared/email.js api/shared/config.js docs/API_CONTRACTS_MVP.md docs/ARCHITECTURE.md
```

Resultado: OK; solo warnings de normalizacion LF/CRLF.

Prueba local/estructural sin red real:

```json
{
  "acsOk": true,
  "skippedWithoutConfig": true
}
```

Cobertura estructural:

- `sendEmail` arma request ACS a `/emails:send?api-version=2023-03-31`.
- Incluye firma `HMAC-SHA256` sin imprimir connection string ni access key.
- Usa `senderAddress` ACS configurado.
- Incluye destinatario de cotizacion.
- `notifyCompanyRegistration` no lanza excepcion cuando falta config ACS; registra skip controlado.

## Riesgos

- No se envio email real desde esta ronda; requiere re-deploy y QA Azure contra ACS configurado en `TASK-175`.
- La firma ACS se implemento por REST/HMAC sin SDK para evitar nueva dependencia npm.
- Si Microsoft cambia API version o esquema, habria que ajustar `ACS_EMAIL_API_VERSION` o payload.
- No hay rate limiting/CAPTCHA para `POST /api/public/leads`; riesgo de spam sigue vigente.

## Recomendacion para QA

Ejecutar `TASK-177` contra Azure:

```text
1. Cotizacion publica exitosa con mailbox observable.
2. Registro empresa dispara email interno.
3. Submit-review dispara email interno.
4. Quitar/romper temporalmente config en ambiente controlado o mock para confirmar best effort interno.
5. Confirmar que responses publicas no exponen connection strings, access keys, headers ACS ni email privado de empresa.
```
