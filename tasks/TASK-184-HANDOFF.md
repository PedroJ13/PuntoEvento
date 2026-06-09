# TASK-184: Infra Azure - deploy auto-invite al aprobar empresa

## Equipo

Infra Azure.

## Estado

Completada.

## Objetivo

Desplegar a Azure los cambios de `TASK-180` y `TASK-181` para que al aprobar una empresa se cree una invitacion automatica, se envie email de activacion y la UI admin muestre feedback segun `invite.status`.

## Commit desplegado

- Branch: `main`
- Commit: `b83b066`
- Mensaje: `Deploy company approval auto invite`
- Push a `origin/main`: completado.
- Azure Static Web Apps: `puntoevento`
- Environment: `Ready`
- `LastUpdatedOn` observado: `2026-06-01T00:46:01.324152+00:00`
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`

## Archivos incluidos

- `admin.html`
- `admin.js`
- `admin.css`
- `api/internal-company-invites/index.js`
- `api/shared/companyInvites.js`
- `api/shared/email.js`
- `api/shared/internalModeration.js`
- `docs/API_CONTRACTS_MVP.md`

El commit fue acotado a backend auto-invite, feedback admin y contrato API relacionado.

## Checks ejecutados

Sintaxis:

```text
node --check api/shared/companyInvites.js
node --check api/shared/internalModeration.js
node --check api/internal-company-invites/index.js
node --check api/shared/email.js
node --check admin.js
```

Resultado: OK.

Diff check:

```text
git diff --check -- admin.html admin.js admin.css api/internal-company-invites/index.js api/shared/email.js api/shared/internalModeration.js api/shared/companyInvites.js docs/API_CONTRACTS_MVP.md
```

Resultado: OK; solo warnings esperados de normalizacion LF/CRLF en Windows.

## Evidencia de versiones servidas

Despues del deploy, `GET /admin.html` con cache busting confirmo:

```text
admin.js?v=17: true
admin.css?v=12: true
```

Assets directos:

```text
GET /admin.js?v=17 -> 200
GET /admin.css?v=12 -> 200
```

Nota: una primera lectura de `/admin.html` sin cache busting aun devolvio referencias viejas (`admin.js?v=16`, `admin.css?v=11`); al reintentar con cache busting despues de propagacion sirvio las versiones correctas.

## Smoke Azure

### Registro QA

Se creo una empresa QA nueva usando el mailbox observable configurado en Azure, sin imprimir el email:

```text
companyId: company_186f6f73-244e-4a10-808a-29407b96021c
slug: qa-task-184-invite-20260601112925
registerStatus: pending
```

### Aprobacion con auto-invite

Endpoint:

```text
POST /api/internal/companies/company_186f6f73-244e-4a10-808a-29407b96021c/approve
```

Resultado observado:

```text
approveStatus: published
invitePresent: true
inviteStatus: email_sent
emailSent: true
warningPresent: false
inviteIdPresent: true
expiresAtPresent: true
```

Lectura:

- El backend desplegado ya devuelve objeto `invite`.
- `invite.status=email_sent` confirma que el flujo intento y completo envio de email de activacion.
- La respuesta no imprimio `inviteUrl`, token completo, `tokenHash`, cookies, connection strings ni secretos.

Email real:

- Asunto esperado por codigo: `Activa tu acceso a Punto Evento`.
- Destinatario: mailbox observable configurado en Azure, no impreso.
- Fecha/hora local aproximada del smoke: `2026-06-01 11:29 America/Costa_Rica`.

## Datos creados

Empresa QA creada y aprobada:

```text
company_186f6f73-244e-4a10-808a-29407b96021c
qa-task-184-invite-20260601112925
```

No se hizo limpieza porque la asignacion dice no hacer hard delete ni limpieza de datos. Queda trazable para QA/Product.

## Comandos usados con secretos redactados

No se imprimieron credenciales admin, tokens, `inviteUrl`, `tokenHash`, cookies, connection strings, SAS ni app setting values.

Comandos principales:

```powershell
node --check api/shared/companyInvites.js
node --check api/shared/internalModeration.js
node --check api/internal-company-invites/index.js
node --check api/shared/email.js
node --check admin.js
git diff --check -- <archivos TASK-184>
git add <archivos TASK-184>
git commit -m "Deploy company approval auto invite"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.js?v=17
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.css?v=12
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main
POST /api/companies/register
POST /api/internal/companies/{companyId}/approve
```

Credenciales admin se cargaron desde `local-secrets/qa-admin.ps1` y solo se usaron en memoria para `X-Punto-Admin-Credential`.

## Riesgos

- QA debe confirmar recepcion real del email en mailbox observable.
- El smoke dejo una empresa QA publicada sin servicios; no deberia aparecer en busqueda publica por no tener servicios publicados, pero queda en `Companies`.
- Si se re-aprueba una empresa con invite activo, el contrato esperado es `invite.status=active_exists`; no se valido en esta tarea para evitar acciones duplicadas innecesarias.
- La primera lectura sin cache busting mostro HTML viejo; QA debe usar refresh fuerte/cache busting si ve assets anteriores.

## Recomendacion para QA TASK-185

Ejecutar QA Azure enfocada:

- Confirmar `/admin.html` sirve `admin.js?v=17` y `admin.css?v=12`.
- Registrar una empresa pending nueva.
- Aprobar desde UI admin o API.
- Confirmar `invite.status=email_sent` o warning claro si hay fallo.
- Confirmar recepcion de email con asunto `Activa tu acceso a Punto Evento`.
- Confirmar que el email permite activar password y luego login recurrente.
- Confirmar que DOM/responses no exponen `inviteUrl`, token completo, `tokenHash`, cookies ni secretos.
