# TASK-064 HANDOFF - QA/Infra Azure moderacion interna

## Resultado general

Aprobado con observaciones.

Los endpoints internos de moderacion estan desplegados, protegidos por credencial admin y funcionan contra Azure real para aprobar/rechazar empresas, servicios y uploads pendientes. La observacion importante es que el blob copiado al contenedor `public` no fue accesible por GET directo: Azure respondio `409`.

## URL base Azure usada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Deploy validado

No tuve un commit SHA visible desde esta tarea.

Validacion practica de deploy:

- `POST /api/internal/companies/{companyId}/approve` sin credencial admin respondio `401`.
- Eso confirma que el endpoint interno existe en Azure y esta protegido por el handler.
- `GET` al mismo endpoint respondio `404`; en Azure Functions puede ocurrir porque el trigger declara solo `POST`, aunque localmente el handler devuelve `405`.

## Empresa QA usada

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
slug: qa-company-register-test
```

## Credenciales

Se cargo `local-secrets/qa-admin.ps1` y se verifico:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se registraron valores reales de credenciales, cookies, tokens ni SAS.

## Endpoints probados y status HTTP

| Caso | Status |
| --- | --- |
| `GET /api/internal/companies/{companyId}/approve` | `404` |
| `POST /api/internal/companies/{companyId}/approve` sin auth | `401` |
| Company inexistente | `404` |
| Crear invitacion real | `201` |
| Aceptar invitacion | `200` |
| Company approve | `200` |
| `GET /api/companies/me` despues de approve | `200` |
| Company reject | `200` |
| `GET /api/companies/me` despues de reject | `200` |
| Company approve final/restauracion | `200` |
| Crear servicio QA approve | `201` |
| Crear servicio QA reject | `201` |
| Service approve | `200` |
| Service reject | `200` |
| Service inexistente | `404` |
| Crear/sign/PUT/confirm upload cover | `200` / `201` / `201` |
| Crear/sign/PUT/confirm upload gallery | `200` / `201` / `201` |
| Upload inexistente | `404` |
| Upload cover approve | `200` |
| GET directo al `publicBlobUrl` del cover | `409` |
| Aprobar upload ya publicado | `409` |
| Upload gallery approve | `200` |
| Verificar servicio despues de uploads | `200` |
| Upload reject | `200` |
| Aprobar upload rechazado | `409` |

## IDs QA usados

```text
serviceApproved: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
serviceRejected: service_8089b37c-1b61-4209-9e9b-3a5eda4cf729
uploadCoverPublished: upload_e750b341-74f0-4db0-921e-83557cb9d1d4
uploadGalleryPublished: upload_470f509b-5929-41d1-a1d2-c37efff9ee9b
uploadRejected: upload_57035a46-8975-429e-bf8f-f10df37f1ee3
```

## Evidencia de cambios

Company:

```text
status despues de approve: published
status despues de reject: rejected
status final restaurado: published
```

Service:

```text
servicio aprobado: published
servicio rechazado: rejected
Services.coverUrl actualizado: true
Services.gallery contiene publicBlobUrl: true
```

Upload:

```text
upload cover aprobado: 200
upload gallery aprobado: 200
upload rechazado: 200
approve de upload publicado: 409
approve de upload rechazado: 409
reject no devolvio publicBlobUrl: true
```

Blob:

```text
publicBlobUrl sin query string/SAS: true
GET directo al publicBlobUrl: 409
```

URLs publicas generadas, sin SAS:

```text
cover: https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_e750b341-74f0-4db0-921e-83557cb9d1d4.png
gallery: https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png
```

## Seguridad

Las respuestas revisadas no expusieron:

- connection strings
- account keys
- hashes
- cookies
- SAS tokens
- `partitionKey`
- `rowKey`
- `pendingBlobName`
- metadata interna

## Hallazgos

No hay hallazgos bloqueantes en los handlers de moderacion: las acciones actualizan estado y relaciones esperadas.

Hallazgo de Infra/Storage:

- El endpoint copia el blob al contenedor `public` y devuelve `publicBlobUrl`, pero el `GET` directo al URL publico respondio `409`.
- Esto sugiere que el contenedor o la cuenta Storage no permiten acceso publico anonimo, o que falta una estrategia de entrega publica alternativa.
- Si el frontend va a renderizar estas URLs directamente, esto requiere ajuste antes de usar imagenes publicadas en produccion.

## Riesgos restantes

- Quedan datos QA persistidos en Azure: servicios, uploads publicados/rechazados y blobs.
- No hay limpieza automatica de datos QA ni blobs pendientes/publicados.
- No hay auditoria formal de moderacion.
- No se probo UI admin ni emails.
- Sigue pendiente rotar `ADMIN_PASSWORD` cuando cierre la ventana de pruebas controladas.

## Recomendacion

Backend puede seguir al siguiente bloque funcional de moderacion/publicacion. Infra/Product debe decidir antes de uso publico si el contenedor `public` debe permitir lectura anonima, si se serviran imagenes mediante SAS de lectura, o si se usara otra ruta/CDN para imagenes publicadas.
