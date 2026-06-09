# TASK-164: Backend/API + Infra Azure - emails internos de registro y revision

## Estado

Completada local/estructuralmente.

## Implementacion

Se agregaron notificaciones internas para:

- Empresa registrada en `POST /api/companies/register`.
- Servicio enviado a revision en `POST /api/companies/me/services/{serviceId}/submit-review`.

Ambas usan SendGrid desde `api/shared/email.js`.

## Comportamiento ante fallos

- Si falta configuracion de SendGrid, el flujo principal sigue funcionando.
- Si SendGrid falla o hace timeout, el flujo principal sigue funcionando.
- Se registra warning sin imprimir API key, connection strings ni secretos.

## Variables de entorno

Requeridas para envio real:

```text
SENDGRID_API_KEY
NOTIFICATION_EMAIL_FROM
NOTIFICATION_EMAIL_TO
NOTIFICATION_EMAIL_FROM_NAME
```

Opcionales relacionadas con tablas nuevas del bloque pre-lanzamiento:

```text
AZURE_TABLE_USERS
AZURE_TABLE_LEADS
```

## Archivos cambiados

- `api/companies-register/index.js`
- `api/company-services-submit-review/index.js`
- `api/shared/email.js`
- `api/shared/config.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`

## Docs actualizados

- `docs/API_CONTRACTS_MVP.md`: seccion de emails internos de operacion.
- `docs/ARCHITECTURE.md`: proveedor SendGrid, usos y variables.

## Verificacion ejecutada

```text
node --check api/companies-register/index.js
node --check api/company-services-submit-review/index.js
node --check api/shared/email.js
node --check api/shared/config.js
```

Resultado: OK.

## Riesgos para Infra/QA

- Requiere `SENDGRID_API_KEY` valido y remitente verificado en SendGrid.
- `NOTIFICATION_EMAIL_TO` debe apuntar a mailbox interno observable para QA.
- Los emails internos son best effort: si fallan, registro y submit-review responden exito igualmente.
- No se probo envio real en Azure en esta ronda.

## Siguiente recomendado

Infra Azure:

```text
Configurar variables SendGrid en Azure Static Web Apps / Functions sin exponer valores en repo.
```

QA:

```text
Validar recepcion de email interno al registrar empresa y al enviar servicio a revision; luego validar que flujo principal no falla con config ausente o proveedor fallando.
```
