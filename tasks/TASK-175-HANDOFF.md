# TASK-175: Infra Azure - configurar Azure Communication Services Email MVP

## Equipo

Infra Azure

## Estado

Completada.

## Objetivo

Configurar Azure Communication Services Email para el ambiente MVP/pre-lanzamiento, dejando listo el recurso de email, dominio, sender, app settings y smoke controlado para que Backend/API implemente el provider ACS Email.

## Ambiente

- Resource group: `resource_group_main`
- Azure Static Web Apps: `puntoevento`
- URL app: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha de verificacion: `2026-05-31`

## Recursos ACS Email

Recurso ACS Email creado/configurado: si.

| Recurso | Nombre | Estado |
| --- | --- | --- |
| Azure Communication Services | `puntoevento-communication` | `Succeeded` |
| Email Communication Service | `puntoevento-email` | `Succeeded` |
| Dominio Email | `AzureManagedDomain` | `Succeeded` |
| Sender username | `donotreply` | `Succeeded` |

## Dominio MVP

Tipo de dominio usado: Azure Managed Domain.

Motivo:

- Es la ruta mas rapida para validar emails reales MVP sin esperar DNS de dominio propio.
- El dominio quedo verificado automaticamente por Azure.
- User engagement tracking quedo `Disabled`.

Dominio administrado observado:

```text
cb39923c-655e-40af-ba89-a91a70722791.azurecomm.net
```

## Sender/remitente

Sender/remitente listo: si.

Sender validado para envio:

```text
donotreply@cb39923c-655e-40af-ba89-a91a70722791.azurecomm.net
```

Nota: el primer intento con `DoNotReply@...` fallo validando `senderAddress`; el smoke aprobado uso el sender en minusculas `donotreply@...`. Las app settings quedaron normalizadas al formato aprobado.

## Variables configuradas

Variables configuradas en Azure Static Web Apps, sin imprimir valores:

| Variable | Estado |
| --- | --- |
| `EMAIL_PROVIDER` | configurada |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | configurada |
| `AZURE_COMMUNICATION_EMAIL_FROM` | configurada |
| `NOTIFICATION_EMAIL_FROM` | configurada |
| `NOTIFICATION_EMAIL_FROM_NAME` | configurada |
| `NOTIFICATION_EMAIL_TO` | configurada previamente |

Valores no secretos relevantes:

- `EMAIL_PROVIDER=acs`
- `NOTIFICATION_EMAIL_FROM_NAME=Punto Evento`

No se imprimio `AZURE_COMMUNICATION_CONNECTION_STRING` ni el valor de mailbox interno.

## Smoke de envio

Smoke de envio ACS Email: aprobado.

Detalles:

- Comando: `az communication email send`.
- Sender: app setting `AZURE_COMMUNICATION_EMAIL_FROM`, sin imprimir valor durante el smoke.
- Destinatario: app setting `NOTIFICATION_EMAIL_TO`, sin imprimir valor.
- Asunto: `Punto Evento ACS smoke TASK-175`.
- Resultado final: comando termino con `ACS_EMAIL_SMOKE_EXIT_0`.

Observacion:

- Hubo un primer intento fallido con `DoNotReply@...`; se corrigio a `donotreply@...`, se repitio el smoke y paso.

## Mailbox/log observable para QA

- Mailbox QA/interno: existe via app setting `NOTIFICATION_EMAIL_TO`, pero no se imprimio el valor.
- QA debe revisar ese mailbox para confirmar recepcion del correo con asunto `Punto Evento ACS smoke TASK-175`.
- Para pruebas funcionales, QA debe esperar a que Backend/API complete `TASK-176`, porque el codigo actual aun debe cambiar el provider de email a ACS.

## Docs actualizados

- `docs/ARCHITECTURE.md`

Cambio:

- Se reemplazo la arquitectura email MVP de SendGrid a Azure Communication Services Email.
- Se documentaron recursos ACS, dominio administrado, sender MVP y variables requeridas.

## Verificacion ejecutada

- `az provider register --namespace Microsoft.Communication --wait`: OK.
- `az extension add --name communication --yes`: OK.
- `az communication email create --email-service-name puntoevento-email ...`: `Succeeded`.
- `az communication email domain create --domain-name AzureManagedDomain ...`: `Succeeded`.
- `az communication email domain sender-username create ...`: `Succeeded`.
- `az communication create --name puntoevento-communication ... --linked-domains <domain-id>`: `Succeeded`.
- `az staticwebapp appsettings set ...`: app settings cargadas, salida redactada por Azure CLI.
- `az staticwebapp appsettings list ...`: presencia de variables confirmada sin valores.
- `az communication email send ...`: smoke aprobado con salida suprimida.

## Comandos usados con secretos redactados

No se imprimieron secretos, tokens, cookies, SAS ni connection strings.

Comandos principales:

```powershell
az extension list --output table
az resource list --resource-group resource_group_main --output table
az extension add --name communication --yes
az provider register --namespace Microsoft.Communication --wait
az communication email create --email-service-name puntoevento-email --resource-group resource_group_main --location global --data-location unitedstates
az communication email domain create --domain-name AzureManagedDomain --email-service-name puntoevento-email --resource-group resource_group_main --location global --domain-management AzureManaged --user-engmnt-tracking Disabled
az communication email domain sender-username create --domain-name AzureManagedDomain --email-service-name puntoevento-email --resource-group resource_group_main --sender-username DoNotReply --username DoNotReply --display-name "Punto Evento"
az communication create --name puntoevento-communication --resource-group resource_group_main --location global --data-location unitedstates --linked-domains <domain-resource-id>
az communication list-key --name puntoevento-communication --resource-group resource_group_main
az staticwebapp appsettings set --name puntoevento --resource-group resource_group_main --setting-names <ACS app settings redactadas>
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main
az communication email send --connection-string <redacted> --sender <from-app-setting> --to <mailbox-app-setting> --subject "Punto Evento ACS smoke TASK-175" --text <smoke-text> --wait-until completed --only-show-errors --output none
```

## Riesgos o bloqueos

- El backend aun no usa ACS Email; queda para `TASK-176`.
- El dominio es Azure Managed Domain, suficiente para MVP rapido, pero menos pulido que un dominio propio.
- Deliverability debe validarse por QA con mailbox real; el CLI confirmo envio aceptado, no lectura del inbox.
- La extension `communication` de Azure CLI esta marcada como preview por Microsoft.

## Costo

ACS Email queda como modelo pay-as-you-go. No se configuro plan mensual fijo de SendGrid.

## Referencias oficiales usadas

- Microsoft Learn: `az communication email` CLI reference.
- Microsoft Learn: `Connect a verified email domain to send email`.

## Recomendacion para Backend/API

Implementar `TASK-176` usando:

- Provider default MVP: `acs`.
- Connection string: `AZURE_COMMUNICATION_CONNECTION_STRING`.
- Sender: `AZURE_COMMUNICATION_EMAIL_FROM`.
- Mantener `NOTIFICATION_EMAIL_FROM` como compatibilidad si simplifica transicion.
- Mantener `NOTIFICATION_EMAIL_TO` y `NOTIFICATION_EMAIL_FROM_NAME`.

Backend/API debe evitar imprimir connection strings o errores con secretos, y mantener emails internos best effort.

## Recomendacion para QA

Despues de `TASK-176`, ejecutar `TASK-177` contra Azure:

- Registro empresa genera email interno.
- Servicio enviado a revision genera email interno.
- Cotizacion publica genera email a empresa.
- Confirmar recepcion en mailbox observable.
- Confirmar que fallos de email no exponen detalles tecnicos ni secretos.
