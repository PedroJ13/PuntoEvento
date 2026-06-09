# TASK-168: Infra Azure - deploy pre-lanzamiento y configuracion SendGrid

## Equipo

Infra Azure

## Estado

Completada con bloqueo parcial de SendGrid.

## Objetivo

Desplegar a Azure el bloque pre-lanzamiento y preparar configuracion necesaria para validacion real de login recurrente, cotizacion por email y emails internos.

## Ambiente

- Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Storage account: `storagepuntoevento`
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha de verificacion: `2026-05-31`

## Commit/deploy

- Branch: `main`
- Commit desplegado: `7437baf`
- Mensaje: `Deploy prelaunch runtime changes`
- Push a `origin/main`: completado.
- Azure Static Web Apps environment: `Ready`.
- `LastUpdatedOn` observado: `2026-05-31T16:12:07.634256+00:00`.

## Archivos incluidos en el commit runtime

- `index.html`
- `app.js`
- `styles.css`
- `panel.html`
- `panel.js`
- `panel.css`
- `admin.html`
- `admin.css`
- `api/company-auth-activate/function.json`
- `api/company-auth-activate/index.js`
- `api/company-auth-login/function.json`
- `api/company-auth-login/index.js`
- `api/public-leads/function.json`
- `api/public-leads/index.js`
- `api/companies-register/index.js`
- `api/company-services-submit-review/index.js`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `api/shared/email.js`

## Assets observados en Azure

Smokes HTTP:

| Ruta | Metodo | Estado |
| --- | --- | --- |
| `/index.html` | GET | `200` |
| `/app.js?v=25` | GET | `200` |
| `/styles.css?v=19` | GET | `200` |
| `/panel.html` | GET | `200` |
| `/panel.js?v=6` | GET | `200` |
| `/panel.css?v=7` | GET | `200` |
| `/admin.html` | GET | `200` |
| `/admin.js?v=16` | GET | `200` |
| `/admin.css?v=11` | GET | `200` |

Referencias observadas dentro de HTML servido por Azure:

| HTML | Asset esperado | Resultado |
| --- | --- | --- |
| `/index.html` | `app.js?v=25` | presente |
| `/index.html` | `styles.css?v=19` | presente |
| `/panel.html` | `panel.js?v=6` | presente |
| `/panel.html` | `panel.css?v=7` | presente |
| `/admin.html` | `admin.js?v=16` | presente |
| `/admin.html` | `admin.css?v=11` | presente |

## Endpoints observados

Smokes con `POST {}` controlado, sin credenciales ni datos reales:

| Endpoint | Metodo | Estado observado | Lectura |
| --- | --- | --- | --- |
| `/api/company-auth/activate` | POST | `400` | Ruta desplegada, valida payload. |
| `/api/company-auth/login` | POST | `400` | Ruta desplegada, valida payload. |
| `/api/public/leads` | POST | `400` | Ruta desplegada, valida payload. |

## Variables configuradas

Verificacion por presencia de app settings, sin imprimir valores:

| Variable | Estado |
| --- | --- |
| `SENDGRID_API_KEY` | no configurada |
| `NOTIFICATION_EMAIL_FROM` | no configurada |
| `NOTIFICATION_EMAIL_TO` | configurada |
| `NOTIFICATION_EMAIL_FROM_NAME` | configurada en esta tarea |
| `AZURE_TABLE_USERS` | configurada en esta tarea |
| `AZURE_TABLE_LEADS` | configurada en esta tarea |

Valores no secretos configurados:

- `AZURE_TABLE_USERS=Users`
- `AZURE_TABLE_LEADS=Leads`
- `NOTIFICATION_EMAIL_FROM_NAME=Punto Evento`

No se imprimieron valores existentes de app settings.

## Table Storage

Tablas observadas despues de configuracion:

- `Companies`
- `CompanyInvites`
- `CompanySessions`
- `Leads`
- `Providers`
- `ProvidersImages`
- `Services`
- `Uploads`
- `Users`

Se crearon explicitamente `Users` y `Leads` para evitar que QA sea la primera corrida que las cree. La operacion es idempotente y no modifica entidades existentes.

## Mailbox/logs disponibles para QA

- Mailbox interno observable: no confirmado por Infra en esta tarea.
- `NOTIFICATION_EMAIL_TO` existe como app setting, pero no se imprimio su valor.
- SendGrid real no queda listo porque faltan `SENDGRID_API_KEY` y `NOTIFICATION_EMAIL_FROM`.
- Sin `SENDGRID_API_KEY` y remitente verificado, QA puede validar que `/api/public/leads` esta desplegado y valida payload, pero no puede aprobar email real de cotizacion ni emails internos.

## Verificacion local previa

- `node --check app.js`: OK.
- `node --check panel.js`: OK.
- `node --check admin.js`: OK.
- `node --check api/company-auth-activate/index.js`: OK.
- `node --check api/company-auth-login/index.js`: OK.
- `node --check api/public-leads/index.js`: OK.
- `git diff --check` del alcance runtime: OK, solo warnings CRLF esperados de Git en Windows.

## Comandos usados con secretos redactados

No se imprimieron secretos, tokens, cookies, SAS, connection strings ni API keys.

Comandos principales:

```powershell
git status --short
node --check app.js
node --check panel.js
node --check admin.js
node --check api/company-auth-activate/index.js
node --check api/company-auth-login/index.js
node --check api/public-leads/index.js
git diff --check -- <archivos-runtime-task-168>
git add <archivos-runtime-task-168>
git commit -m "Deploy prelaunch runtime changes"
git push origin main
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main
az staticwebapp appsettings set --name puntoevento --resource-group resource_group_main --setting-names AZURE_TABLE_USERS=Users AZURE_TABLE_LEADS=Leads NOTIFICATION_EMAIL_FROM_NAME="Punto Evento"
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
az storage table list --account-name storagepuntoevento --auth-mode login
az storage table create --account-name storagepuntoevento --auth-mode login --name Users
az storage table create --account-name storagepuntoevento --auth-mode login --name Leads
Invoke-WebRequest <Azure URL assets/endpoints>
```

## Riesgos o bloqueos

- Bloqueo para QA de email real: faltan `SENDGRID_API_KEY` y `NOTIFICATION_EMAIL_FROM`.
- No se ejecuto smoke de SendGrid para no simular una configuracion que no existe.
- No se valido flujo funcional completo con empresa real; queda para `TASK-169` a `TASK-172`.
- El workspace conserva muchos cambios/untracked no relacionados ya existentes; el commit de deploy fue acotado al runtime de `TASK-168`.

## Recomendacion para QA

QA puede empezar validacion Azure de:

- Assets finales y responsive.
- Login recurrente si usa datos/invitaciones validas.
- Validaciones de `/api/public/leads` a nivel endpoint.

QA no deberia aprobar cotizacion por email ni emails internos hasta que Product/Infra configure:

- `SENDGRID_API_KEY`.
- `NOTIFICATION_EMAIL_FROM` con remitente verificado en SendGrid.
- Mailbox observable para revisar recepcion real.

## Recomendacion para Product/Architect

Crear una microtarea Infra/Product para cargar el secreto real de SendGrid y confirmar el remitente verificado/mailbox QA. Despues de eso, reintentar solo los smokes de email y habilitar `TASK-170`/`TASK-171`.
