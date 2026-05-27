# TASK-002: Inventario Infra Azure

## Equipo

Infra Azure.

## Estado

Completado.

## Objetivo

Hacer inventario de la infraestructura Azure actual del proyecto Punto Evento y entregar:

- Servicios Azure actuales.
- Variables/config existentes o faltantes.
- Estado de Static Web Apps, API y Storage.
- Recomendacion Table Storage vs Cosmos DB serverless.
- Riesgos antes de implementar registro/admin real.

## Cambios realizados

- Se leyo `chat-start/INFRA_AZURE.md`.
- Se verifico la infraestructura real con Azure CLI usando la sesion Azure del usuario.
- Se contrasto Azure real contra la configuracion del repo:
  - `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`
  - `staticwebapp.config.json`
  - `api/shared/config.js`
- No se hicieron cambios de codigo de aplicacion.
- No se modifico pipeline.
- No se modificaron endpoints.

## Inventario Azure actual

Subscription:

```text
as_main
```

Resource group:

```text
resource_group_main
```

Servicios encontrados:

```text
puntoevento         Microsoft.Web/staticSites          East US 2
storagepuntoevento  Microsoft.Storage/storageAccounts  eastus2
```

## Static Web App

```text
Nombre: puntoevento
Plan: Free
Region: East US 2
Provider: GitHub
Repositorio: https://github.com/PedroJ13/PuntoEvento
Branch: main
Default hostname: zealous-field-08fdd720f.7.azurestaticapps.net
Custom domains: ninguno
Environment: default
Environment status: Ready
```

El workflow de GitHub Actions tiene:

```yaml
app_location: "/"
api_location: "api"
output_location: "/"
skip_app_build: true
```

Conclusion:

```text
Static Web Apps esta listo.
API integrada bajo /api esta desplegada desde la carpeta api.
No hay dominio propio configurado.
```

## Storage Account

```text
Nombre: storagepuntoevento
Tipo: StorageV2
Region: eastus2
SKU: Standard_LRS
Access tier: Hot
HTTPS only: activo
Public network access: Enabled
Shared key access: Enabled
allowBlobPublicAccess: false
```

Containers encontrados:

```text
uploads-pending
public
```

Tablas encontradas:

```text
Providers
ProvidersImages
```

CORS Blob service:

```text
Allowed origins: https://zealous-field-08fdd720f.7.azurestaticapps.net
Allowed methods: PUT, OPTIONS
Allowed headers: *
Exposed headers: *
Max age: 3600
```

Conclusion:

```text
Storage esta listo para registros pendientes y subida con SAS.
El container public existe, pero la cuenta no permite public blob access actualmente.
```

## Variables/config

Variables existentes en Static Web App:

```text
ADMIN_PASSWORD
ADMIN_USERNAME
ALLOWED_ORIGINS
APP_PUBLIC_URL
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_PENDING_CONTAINER
AZURE_STORAGE_PUBLIC_CONTAINER
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDER_IMAGES
AZURE_TABLE_PROVIDERS
NOTIFICATION_EMAIL_TO
```

Variables opcionales faltantes para email:

```text
SENDGRID_API_KEY
NOTIFICATION_EMAIL_FROM
NOTIFICATION_EMAIL_FROM_NAME
```

Observacion:

```text
SendGrid queda opcional por ahora. Si no se configura, el registro debe guardarse igual, pero no se envia correo.
```

## Verificacion realizada

Comandos Azure CLI ejecutados:

```text
az account show
az resource list
az staticwebapp list
az storage account list
az storage container list --account-name storagepuntoevento
az storage table list --account-name storagepuntoevento
az storage cors list --account-name storagepuntoevento --services b
az staticwebapp hostname list --name puntoevento --resource-group resource_group_main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --query "keys(properties)"
```

No se imprimieron valores secretos en el handoff.

Validaciones previas conocidas del flujo:

- `/api/providers` responde JSON.
- Registro de proveedor llego a mostrar confirmacion.
- Subida de imagenes funciono despues de corregir CORS.
- Se confirmo visualmente existencia de datos en Storage Browser.

## Table Storage vs Cosmos DB serverless

Recomendacion para MVP:

```text
Mantener Azure Table Storage.
```

Razones:

- Ya esta configurado y funcionando.
- Menor costo para MVP.
- Suficiente para `Providers`, `ProvidersImages`, estados y publicacion manual/admin.
- Compatible con el flujo actual de Azure Functions.
- Evita complejidad prematura.

Cuando evaluar Cosmos DB serverless:

- Cuando se implemente formalmente el modelo `Company -> Services -> Users -> Leads`.
- Si se necesitan consultas flexibles por categoria, provincia, plan, estado, servicios y busqueda.
- Si hay edicion concurrente mas compleja.
- Si el admin requiere vistas y filtros avanzados.

No se recomienda base de datos server tradicional para este MVP.

## Riesgos

- `allowBlobPublicAccess` esta en `false`; las imagenes copiadas a `public` no seran legibles por URL directa si se mantiene esta configuracion.
- El panel admin usa `ADMIN_USERNAME` y `ADMIN_PASSWORD`; aceptable para MVP privado, no suficiente para produccion abierta.
- Falta rate limit, lockout o CAPTCHA para registro y admin.
- Falta limpieza automatica de `uploads-pending`.
- Falta auditoria de aprobaciones/rechazos.
- SendGrid no esta completo; no habra notificaciones por correo hasta configurar API key y remitente verificado.
- No hay dominio propio.
- La documentacion y el codigo aun mezclan nombres historicos `ProviderImages` con Azure real `ProvidersImages`; la variable resuelve esto, pero Product/Architect debe estandarizar nombre.
- El modelo actual sigue centrado en `Providers`; el nuevo enfoque pide evolucionar a `Company -> Services`.

## Pendientes

- Confirmar acceso/estrategia para imagenes publicadas:
  - O habilitar public access solo para blobs del container `public`.
  - O servir imagenes con SAS/proxy/CDN mas adelante.
- Probar flujo admin completo:
  - Login `/admin`.
  - Listar pendientes.
  - Aprobar proveedor.
  - Copiar/mover imagenes a `public`.
  - Cambiar estados a `published`.
  - Confirmar `/api/providers`.
- Configurar SendGrid solo cuando se quiera email real.
- Agregar limpieza de `uploads-pending` con lifecycle rule o Timer Function.
- Definir dominio cuando se lance publicamente.
- Endurecer admin antes de abrir a usuarios reales.

## Recomendacion para Product/Architect

Mantener la arquitectura MVP actual:

```text
Azure Static Web Apps Free
Azure Functions integradas bajo /api
Azure Blob Storage Standard_LRS Hot
Azure Table Storage
```

Decision clave para Product/Architect:

```text
Definir si las imagenes publicadas se serviran con container public o con proxy/SAS/CDN.
```

Recomendacion de bajo costo:

```text
Para MVP cerrado: habilitar lectura publica solo del container public y mantener uploads-pending privado.
```

Recomendacion de producto:

```text
Antes de seguir creciendo admin/registro, formalizar el modelo `Company -> Services` y decidir si el flujo actual `Providers` sera una capa temporal o se migrara pronto.
```

Siguiente tarea sugerida:

```text
Validar flujo admin end-to-end y documentar si publica correctamente desde uploads-pending hacia public.
```
