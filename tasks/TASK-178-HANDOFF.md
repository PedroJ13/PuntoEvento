# TASK-178: Infra Azure - deploy backend ACS Email

## Equipo

Infra Azure

## Estado

Completada.

## Objetivo

Desplegar a Azure los cambios backend de `TASK-176` para que Azure Functions use Azure Communication Services Email como provider MVP y deje de fallar por provider legacy en `/api/public/leads`.

## Commit desplegado

- Branch: `main`
- Commit: `dbb3f75`
- Mensaje: `Deploy ACS email provider`
- Push: `origin/main` completado.
- Azure Static Web Apps: `puntoevento`
- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Environment: `Ready`

## Archivos incluidos

- `api/shared/config.js`
- `api/shared/email.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`

El commit fue acotado al provider ACS y documentacion tecnica directamente relacionada. No se incluyeron UI publica, panel, admin ni cambios de otras tareas.

## Checks ejecutados

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

Resultado: OK; solo warnings esperados de normalizacion LF/CRLF en Windows.

## App settings verificadas

Presencia confirmada en Azure Static Web Apps, sin imprimir valores:

| Variable | Estado |
| --- | --- |
| `EMAIL_PROVIDER` | configurada |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | configurada |
| `AZURE_COMMUNICATION_EMAIL_FROM` | configurada |
| `NOTIFICATION_EMAIL_TO` | configurada |
| `NOTIFICATION_EMAIL_FROM_NAME` | configurada |

No se imprimieron connection strings, secretos ni mailbox.

## Smokes Azure

### Servicio publicado usado

Se consulto `GET /api/public/services?limit=1` para obtener un servicio publicado real:

```text
companyId: company_010e60dd-132c-4eb0-baa5-070c8f5d9867
companySlug: intertec-costa-rica
serviceId: service_c2d84149-2773-4320-9ebf-5c8190ac4af2
serviceSlug: servicio-intertect-2
companyName: INTERTEC | Costa Rica
```

### Lead smoke controlado

Request:

```text
POST /api/public/leads
```

Payload controlado:

```text
name: QA TASK 178 Smoke
email: qa-task-178@example.test
phone: 50688881780
eventType: Smoke ACS
eventDate: 2026-06-15
guests: 12
message: Smoke controlado TASK-178 para validar backend ACS Email desplegado.
```

Resultado:

```text
status: 201
ok: true
leadId: lead_141990b6-9044-4755-a30f-7c11a8f05f27
```

Lectura:

- Azure ya no devuelve `502` en `/api/public/leads`.
- El endpoint acepto un lead valido y completo el flujo de envio con el provider desplegado.
- El backend ACS esta disponible para reintento QA real.

## Datos creados y limpieza

Se creo un lead de smoke:

```text
PartitionKey: company_010e60dd-132c-4eb0-baa5-070c8f5d9867
RowKey: lead_141990b6-9044-4755-a30f-7c11a8f05f27
```

No se hizo hard delete. Se deja como evidencia trazable del smoke TASK-178. Si Product/Infra prefiere limpiar datos smoke de leads, abrir una microtarea de cleanup explicita.

## Comandos usados con secretos redactados

No se imprimieron secretos, tokens, cookies, SAS, connection strings ni app setting values.

Comandos principales:

```powershell
node --check api/shared/email.js
node --check api/shared/config.js
node --check api/public-leads/index.js
node --check api/companies-register/index.js
node --check api/company-services-submit-review/index.js
git diff --check -- api/shared/email.js api/shared/config.js docs/API_CONTRACTS_MVP.md docs/ARCHITECTURE.md
git add api/shared/email.js api/shared/config.js docs/API_CONTRACTS_MVP.md docs/ARCHITECTURE.md
git commit -m "Deploy ACS email provider"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main
Invoke-RestMethod https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/services?limit=1
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/api/public/leads
```

## Riesgos

- El smoke confirma que el endpoint responde `201`; QA debe confirmar recepcion del email en mailbox real.
- El lead smoke queda en `Leads` como dato de prueba.
- La validacion fue enfocada; no reemplaza `TASK-179` de QA completa para registro, submit-review y cotizacion.
- El workspace conserva muchos cambios/untracked no relacionados previos; no fueron tocados en el commit TASK-178.

## Recomendacion para QA

Ejecutar `TASK-179` contra Azure:

- Reintentar cotizacion publica con servicio publicado y mailbox observable.
- Validar recepcion real del email enviado por backend ACS.
- Validar emails internos de registro y `submit-review`.
- Confirmar que responses publicas no exponen connection strings, access keys, headers ACS ni detalles tecnicos.

## Recomendacion para Product/Architect

Marcar `TASK-178` como deploy completado y mover el bloqueo de email real a QA `TASK-179`. Si QA aprueba recepcion real, actualizar `docs/MVP_RELEASE_STATUS.md` para cerrar el no-go por email.
