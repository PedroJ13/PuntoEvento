# TASK-065: Infra Azure public image access

## Equipo

Infra Azure.

## Estado

Aprobado con cambios aplicados.

## Resultado general

Se resolvio el acceso publico de imagenes aprobadas en Azure Blob Storage usando la opcion A:

```text
Habilitar public blob access en la cuenta y permitir lectura anonima tipo blob solo en el container public.
```

Se mantuvo:

```text
uploads-pending privado
public legible por URL directa solo a nivel blob
```

La URL real reportada en TASK-064 ahora responde:

```text
HTTP/1.1 200 OK
Content-Type: image/png
```

No se imprimieron connection strings, account keys, SAS tokens ni credenciales.
No se borraron blobs QA.
No se cambiaron secretos.
No se modifico codigo.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-002-HANDOFF.md`
- `tasks/TASK-064-HANDOFF.md`

## Estado inicial encontrado

Storage Account:

```text
name: storagepuntoevento
sku: Standard_LRS
accessTier: Hot
httpsOnly: true
publicNetworkAccess: Enabled
allowBlobPublicAccess: false
```

Containers:

```text
public: publicAccess = null
uploads-pending: publicAccess = null
```

Prueba inicial con URL real de TASK-064:

```text
GET https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_e750b341-74f0-4db0-921e-83557cb9d1d4.png
```

Resultado inicial:

```text
HTTP/1.1 409 Public access is not permitted on this storage account.
ErrorCode: PublicAccessNotPermitted
```

Conclusion:

```text
El backend ya publicaba/copiana el blob y devolvia publicBlobUrl sin SAS, pero la cuenta bloqueaba lectura anonima.
```

## Decision aplicada

Se aplico opcion A.

Motivo:

- Es la decision ya documentada para MVP cerrado.
- Es la opcion mas simple y barata.
- No requiere proxy/API para servir imagenes.
- No requiere SAS de lectura para cada render publico.
- Permite que el frontend renderice `publicBlobUrl` directamente.

Impacto:

```text
Los blobs aprobados en el container public son legibles anonimamente por URL directa.
El container uploads-pending sigue privado.
El listado anonimo del container public no queda habilitado porque se uso public-access blob, no container.
```

## Cambios aplicados

Cuenta Storage:

```text
storagepuntoevento allowBlobPublicAccess=true
```

Container publico:

```text
public publicAccess=blob
```

Container pendiente:

```text
uploads-pending publicAccess=null
```

Nota operativa:

```text
El cambio a nivel cuenta fue autorizado explicitamente por Product/Owner en el chat.
```

## Estado final confirmado

Storage Account:

```text
allowBlobPublicAccess: true
httpsOnly: true
publicNetworkAccess: Enabled
```

Containers:

```text
public: publicAccess = blob
uploads-pending: publicAccess = null
```

## Prueba GET publicBlobUrl

URL probada:

```text
https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_e750b341-74f0-4db0-921e-83557cb9d1d4.png
```

Resultado final:

```text
HTTP/1.1 200 OK
Content-Type: image/png
Content-Length: 67
x-ms-blob-type: BlockBlob
```

Conclusion:

```text
La imagen aprobada ya es consumible por URL directa sin SAS.
```

## Validacion de listado anonimo

Prueba:

```text
GET https://storagepuntoevento.blob.core.windows.net/public?restype=container&comp=list
```

Resultado:

```text
HTTP/1.1 404 The specified resource does not exist.
```

Conclusion:

```text
No se obtuvo listado anonimo de blobs. El modo publicAccess=blob permite lectura directa de blobs conocidos, no listado de container.
```

Prueba adicional:

```text
GET https://storagepuntoevento.blob.core.windows.net/uploads-pending?restype=container&comp=list
```

Resultado:

```text
HTTP/1.1 404 The specified resource does not exist.
```

Conclusion:

```text
uploads-pending no permite listado anonimo y queda privado.
```

## CORS y cache

CORS actual del Blob service:

```text
Allowed origins: https://zealous-field-08fdd720f.7.azurestaticapps.net
Allowed methods: PUT, OPTIONS
Allowed headers: *
Exposed headers: *
Max age: 3600
```

Evaluacion:

```text
Para renderizar imagenes en etiquetas img, no hace falta CORS GET.
Para hacer fetch/canvas/lectura programatica de imagenes desde frontend, podria requerirse agregar GET/HEAD a CORS.
```

Cache actual del blob probado:

```text
cacheControl: null
contentType: image/png
```

Recomendacion:

```text
No bloquear MVP por cache headers. En una tarea posterior se puede definir Cache-Control para blobs publicados, por ejemplo public, max-age=604800, si las URLs son inmutables por uploadId.
```

## Riesgos restantes

- La cuenta ahora permite public blob access, aunque solo `public` tiene acceso anonimo tipo blob. Si en el futuro alguien configura otro container como publico por error, podria exponer contenido.
- `uploads-pending` debe permanecer privado y debe revisarse despues de cualquier cambio manual en Azure Portal.
- Los blobs publicados son publicos por URL directa; no deben publicarse imagenes sin revision.
- No hay cache-control definido en blobs publicados; puede afectar performance o revalidaciones, pero no bloquea render.
- Si el frontend usa `fetch` o canvas sobre imagenes publicas, puede requerir ampliar CORS con `GET, HEAD`.
- Quedan datos/blobs QA de TASK-064 persistidos en Azure.

## Siguiente tarea recomendada

QA Azure:

```text
Validar render real de imagen publica en la pagina o en una prueba HTML usando publicBlobUrl sin SAS.
```

Luego Backend/Frontend:

```text
Continuar endpoints publicos por servicio y asegurar que solo usen Services/Companies publicados e imagenes publicadas.
```

Infra futura:

```text
Evaluar Cache-Control para blobs publicados y monitorear que uploads-pending siga privado.
```
