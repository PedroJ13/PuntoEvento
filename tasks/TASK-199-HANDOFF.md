# TASK-199 HANDOFF: ACS Email y base URLs pre-lanzamiento

## Resumen

Infra Azure verifico la configuracion de email MVP y URLs publicas en Azure.

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Static Web App: `puntoevento`
- Resource group: `resource_group_main`
- Proveedor email activo: Azure Communication Services Email (`acs`)
- Resultado: aprobado tecnicamente para QA integrada.
- Secretos: no se imprimieron connection strings, keys, tokens, cookies ni password hashes.

## Settings verificados

Consulta: Azure Static Web Apps app settings, con valores sensibles redactados.

| Setting | Estado | Valor seguro |
|---|---|---|
| `EMAIL_PROVIDER` | Existe | `acs` |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | Existe | `[present redacted]` |
| `AZURE_COMMUNICATION_EMAIL_FROM` | Existe | `do***@c***.net` |
| `NOTIFICATION_EMAIL_FROM_NAME` | Existe | `Punto Evento` |
| `NOTIFICATION_EMAIL_TO` | Existe | `pj***@o***.com` |
| `APP_PUBLIC_URL` | Existe | `https://zealous-field-08fdd720f.7.azurestaticapps.net` |
| `NOTIFICATION_EMAIL_FROM` | Existe como fallback | `do***@c***.net` |
| `SENDGRID_API_KEY` | No existe | no configurado |

Confirmaciones:

- `APP_PUBLIC_URL` coincide con la URL publica esperada.
- `EMAIL_PROVIDER=acs`, por lo que SendGrid no es requerido para el flujo MVP.
- `SENDGRID_API_KEY` no esta configurado en Azure Static Web Apps.
- `NOTIFICATION_EMAIL_FROM` queda solo como compatibilidad/fallback del sender, no como proveedor SendGrid.

## Recursos ACS verificados

| Recurso | Estado |
|---|---|
| Azure Communication Services `puntoevento-communication` | `Succeeded` |
| Email Communication Service `puntoevento-email` | `Succeeded` |
| Dominio `AzureManagedDomain` | `Succeeded` |
| SPF | `Verified` |
| DKIM | `Verified` |
| DKIM2 | `Verified` |
| DMARC | `Verified` |
| Domain | `Verified` |
| User engagement tracking | `Disabled` |
| Sender username | `DoNotReply` |
| Sender display name | `Punto Evento` |

## Base URLs

| URL | Resultado |
|---|---|
| `https://zealous-field-08fdd720f.7.azurestaticapps.net/` | HTTP 200 |
| `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html` | HTTP 200 |

Static Web Apps environment:

- Environment: `default`
- Hostname: `zealous-field-08fdd720f.7.azurestaticapps.net`
- Status: `Ready`

## Smoke ACS Email

Se ejecuto un smoke directo de ACS Email usando la connection string existente en app settings como variable de entorno temporal local, sin imprimirla.

| Campo | Resultado |
|---|---|
| Fecha UTC | `2026-06-04T00:23:05.9374662Z` |
| Fecha Costa Rica | `2026-06-03` |
| Subject | `Punto Evento ACS smoke TASK-199 202606031822` |
| Status tecnico | `Succeeded` |
| Operation id | `[present redacted]` |
| Sender | `[redacted]` |
| Recipient | `[redacted]` |

No se valida lectura de mailbox desde Infra; queda para Product/QA confirmar recepcion si necesitan evidencia visual. A nivel ACS, el envio finalizo `Succeeded`.

## SendGrid

SendGrid no queda activo ni requerido para el MVP:

- `EMAIL_PROVIDER` esta en `acs`.
- `SENDGRID_API_KEY` no existe en app settings.
- El contrato backend conserva SendGrid solo como fallback explicito futuro si `EMAIL_PROVIDER=sendgrid` y existe `SENDGRID_API_KEY`.

## Riesgos

- ACS Email CLI esta en extension preview; el smoke funciono, pero el warning de preview es esperado del comando `az communication email`.
- El sender usa dominio administrado de Azure (`comm...azurecomm.net`), valido para MVP. Si Product decide un dominio propio, requerira tarea separada de dominio/remitente y verificacion DNS.
- La confirmacion de recepcion en mailbox no fue realizada por Infra; se recomienda que QA/Product confirme el asunto del smoke si necesitan evidencia externa.
- `NOTIFICATION_EMAIL_TO` apunta a un destinatario interno configurado; se documento redactado para no exponer emails completos.

## Recomendacion para QA

- Ejecutar TASK-200 sobre Azure con confianza en que ACS/base URLs estan listos.
- Validar desde flujo real que los emails de activacion/contacto contienen enlaces con `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Si se requiere evidencia visual de mailbox, buscar el asunto `Punto Evento ACS smoke TASK-199 202606031822` o ejecutar un flujo funcional controlado y adjuntar captura redactada.

## Comandos usados

Comandos representativos, con secretos y direcciones completas redactadas:

```powershell
git rev-parse --show-toplevel
Get-Content -Raw AGENTS.md
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw tasks/TASK-199-assignment.md
Get-Content -Raw docs/ARCHITECTURE.md
rg -n "ACS|Azure Communication|SendGrid|EMAIL|APP_PUBLIC_URL|PUBLIC_URL|NOTIFICATION|CONTACT|inviteUrl|base URL|baseUrl" docs api ...
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --output json
az communication show --name puntoevento-communication --resource-group resource_group_main
az communication email show --email-service-name puntoevento-email --resource-group resource_group_main
az communication email domain show --email-service-name puntoevento-email --resource-group resource_group_main --domain-name AzureManagedDomain
az communication email domain sender-username list --email-service-name puntoevento-email --resource-group resource_group_main --domain-name AzureManagedDomain
az communication email send --sender <redacted> --to <redacted> --subject "Punto Evento ACS smoke TASK-199 202606031822" --text <smoke-text> --wait-until completed
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

No se rotaron secretos, no se cambiaron app settings, no se limpiaron datos y no se tocaron dominios/remitentes.
