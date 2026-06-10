# TASK-287 HANDOFF: corregir CORS de Blob Storage para uploads de portada

## Resumen

Infra Azure completo la correccion de CORS en Azure Blob Storage para permitir uploads firmados desde el dominio propio.

- Ambiente: Azure Storage account `storagepuntoevento`.
- Servicio afectado: Blob service.
- Contenedor usado por uploads pendientes: `uploads-pending`.
- Codigo frontend/backend: no modificado.
- SAS policies, credenciales, datos y blobs: no modificados.
- Hard delete: no ejecutado.
- Secretos/tokens/cookies/SAS/connection strings/passwords/password hashes/emails reales: no impresos ni documentados.

## Configuracion anterior

La regla CORS del Blob service solo permitia el hostname anterior de Azure Static Web Apps:

```text
AllowedOrigins=https://zealous-field-08fdd720f.7.azurestaticapps.net
AllowedMethods=PUT, OPTIONS
AllowedHeaders=*
ExposedHeaders=*
MaxAgeInSeconds=3600
```

Esto explicaba el bloqueo de preflight desde `https://puntoeventocr.com`.

## Regla CORS aplicada

Se reemplazo la regla anterior por una regla unica y restrictiva:

```text
AllowedOrigins=https://puntoeventocr.com, https://www.puntoeventocr.com, https://zealous-field-08fdd720f.7.azurestaticapps.net
AllowedMethods=OPTIONS, PUT
AllowedHeaders=content-type, x-ms-blob-type
ExposedHeaders=etag, x-ms-request-id, x-ms-version, x-ms-request-server-encrypted
MaxAgeInSeconds=3600
```

No se uso wildcard para origins, allowed headers ni exposed headers.

Headers confirmados en el frontend para el `PUT` firmado:

```text
x-ms-blob-type: BlockBlob
Content-Type: <image mime type>
```

## Verificacion tecnica

Preflight `OPTIONS` contra Blob Storage:

```text
URL: https://storagepuntoevento.blob.core.windows.net/uploads-pending/task-287-cors-smoke.png
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: x-ms-blob-type,content-type
```

Resultados:

| Origin | Resultado | Access-Control-Allow-Origin | Access-Control-Allow-Methods | Access-Control-Allow-Headers |
|---|---:|---|---|---|
| `https://puntoeventocr.com` | `200` | `https://puntoeventocr.com` | `PUT` | `x-ms-blob-type,content-type` |
| `https://www.puntoeventocr.com` | `200` | `https://www.puntoeventocr.com` | `PUT` | `x-ms-blob-type,content-type` |
| `https://zealous-field-08fdd720f.7.azurestaticapps.net` | `200` | `https://zealous-field-08fdd720f.7.azurestaticapps.net` | `PUT` | `x-ms-blob-type,content-type` |

Prueba negativa:

| Origin | Resultado |
|---|---:|
| `https://example.com` | `403` |

Esto confirma que CORS no quedo abierto a origenes innecesarios.

## Upload smoke

No se ejecuto un `PUT` real con SAS para evitar imprimir o documentar SAS completos. La verificacion tecnica cubrio el bloqueo reportado por QA: el preflight del navegador para `PUT` con `x-ms-blob-type` y `content-type`.

QA `TASK-288` debe revalidar el flujo funcional completo desde el panel con sesion real:

1. Crear/editar servicio con portada.
2. Ejecutar upload firmado desde `https://puntoeventocr.com`.
3. Confirmar que el `PUT` ya no falla por CORS.
4. Confirmar que se ejecutan `POST /api/uploads/confirm` y `POST /api/companies/me/services/{serviceId}/submit-review`.
5. Confirmar que el servicio queda en revision y que la portada se conserva/publica correctamente tras moderacion.

## Riesgos / notas

- La configuracion CORS se aplica a nivel de Blob service, no solo al contenedor `uploads-pending`.
- La regla sigue permitiendo el hostname anterior de Azure Static Web Apps para compatibilidad QA/rollback.
- No se tocaron SAS, permisos de contenedor, lifecycle, blobs, tablas ni codigo.
- Si QA observa nuevos errores, separar entre CORS resuelto y posibles problemas posteriores de SAS, permisos, tamano/MIME o confirmacion de upload.

## Comandos usados con secretos redactados

No se imprimieron secrets ni SAS. Los comandos representativos fueron:

```powershell
git rev-parse --show-toplevel
Get-Content -Raw chat-start/INFRA_AZURE.md
Get-Content -Raw AGENTS.md
Get-Content -Raw docs/MVP_RELEASE_STATUS.md
Get-Content -Raw tasks/TASK-287-assignment.md
az storage cors list --account-name storagepuntoevento --services b -o json
rg -n "x-ms-blob-type|uploads/sign|uploadUrl|fetch\(|PUT|Content-Type|content-type" panel.js app.js api -g "*.js"
az storage cors clear --account-name storagepuntoevento --services b -o none
az storage cors add --account-name storagepuntoevento --services b --origins <redacted-public-origin-list> --methods OPTIONS PUT --allowed-headers content-type x-ms-blob-type --exposed-headers etag x-ms-request-id x-ms-version x-ms-request-server-encrypted --max-age 3600 -o none
az storage cors list --account-name storagepuntoevento --services b -o json
Invoke-WebRequest -Method Options -Uri https://storagepuntoevento.blob.core.windows.net/uploads-pending/task-287-cors-smoke.png -Headers <redacted-preflight-headers>
```

`az storage cors` mostro advertencias de Azure CLI sobre obtencion de credenciales de la cuenta, pero no imprimio account keys, connection strings, SAS ni tokens.
