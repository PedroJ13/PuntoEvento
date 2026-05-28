# TASK-076 HANDOFF - Publicar imagen real demo en servicio QA principal

## Resultado general

Aprobado con observaciones.

Se publico una imagen demo real para el `cover` del servicio QA principal usando el flujo real de uploads y moderacion en Azure:

```text
POST /api/uploads/sign
PUT al SAS de blob pendiente
POST /api/uploads/confirm
POST /api/internal/uploads/{companyId}/{uploadId}/approve
```

El `Services.coverUrl` cambio al nuevo `publicBlobUrl`, la URL publica responde `200`, no tiene query string/SAS y la imagen mide `1200 x 800`.

Observacion principal: el perfil publico/carrusel sigue mostrando la galeria previa de `1 x 1`, porque el frontend del perfil usa `gallery` cuando existe. El nuevo cover si renderiza en home y listado.

No se modifico codigo y no se commiteo la imagen usada como insumo de QA.

## Servicio objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
companySlug: qa-company-register-test
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
serviceSlug: qa-moderacion-approve-20260528113350
serviceName: QA Moderacion Approve 20260528113350
```

## Imagen usada

Imagen generada localmente para QA, sin marcas, sin rostros y sin material externo:

```text
Tipo: PNG
Dimensiones locales: 1200 x 800
Peso local: 20099 bytes
Descripcion: ilustracion simple de salon/mesa de evento para validar encuadre real.
Destino: archivo temporal local, no commiteado.
```

## Endpoints ejecutados

URL base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Status HTTP:

| Paso | Endpoint | Status |
| --- | --- | --- |
| Crear invitacion QA | `POST /api/internal/company-invites` | `201` |
| Aceptar invitacion | `POST /api/company-auth/accept-invite` | `200` |
| Reservar upload cover | `POST /api/uploads/sign` | `200` |
| Subir blob pendiente | `PUT` a SAS temporal | `201` |
| Confirmar upload | `POST /api/uploads/confirm` | `201` |
| Aprobar upload | `POST /api/internal/uploads/{companyId}/{uploadId}/approve` | `200` |
| Verificar servicios publicos | `GET /api/public/services` | `200` |
| Verificar perfil publico | `GET /api/public/companies/qa-company-register-test?service=qa-moderacion-approve-20260528113350` | `200` |
| Logout sesion empresa | `POST /api/company-auth/logout` | `200` |

Credenciales, token de invitacion, cookie y SAS no se registraron en este handoff.

## Upload publicado

```text
uploadId: upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19
```

Public URL:

```text
https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png
```

Validacion:

```text
Public URL tiene query string/SAS: false
HTTP status: 200
Content-Type: image/png
Content-Length: 20099
Dimensiones remotas: 1200 x 800
```

## Confirmacion de datos publicos

`GET /api/public/services`:

```text
Status: 200
Servicio encontrado: true
coverUrl coincide con publicBlobUrl nuevo: true
```

`GET /api/public/companies/qa-company-register-test?service=qa-moderacion-approve-20260528113350`:

```text
Status: 200
selectedServiceSlug: qa-moderacion-approve-20260528113350
Servicio encontrado: true
coverUrl coincide con publicBlobUrl nuevo: true
```

## Validacion visual publica

Navegador:

```text
Codex in-app browser
```

Rutas validadas:

```text
/index.html#inicio
/index.html#bodas
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

### Home `#inicio`

Resultado:

```text
Servicio QA principal visible en destacados: true
Imagen nueva presente en DOM: true
Imagen completa: true
Dimensiones naturales reportadas: 1200 x 800
Cards destacadas: 3
Fallback demo visible: no
Imagenes rotas: 0
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

### Listado `#bodas`

Resultado:

```text
Servicio QA principal visible en resultados: true
Imagen nueva presente en DOM: true
Imagen completa: true
Dimensiones naturales reportadas: 1200 x 800
Cards de resultado: 4
Fallback demo visible: no
Imagenes rotas: 0
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

### Perfil publico con servicio seleccionado

Ruta:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

Resultado:

```text
Perfil carga: true
Servicio seleccionado destacado: QA Moderacion Approve 20260528113350
coverUrl nuevo confirmado por API: true
Carousel visible: true
Carousel count: 1 / 1
Imagenes rotas: 0
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

Observacion:

```text
El carrusel del perfil sigue usando la galeria existente:
.../gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png

Esa imagen de galeria sigue reportando 1 x 1.
El nuevo cover no aparece en el carrusel porque el perfil prioriza gallery cuando existe.
```

## Seguridad

No se pegaron en el handoff:

```text
- ADMIN_USERNAME
- ADMIN_PASSWORD
- token de invitacion
- cookie pe_company_session
- uploadUrl/SAS
- connection strings
```

Escaneo UI en rutas publicas:

```text
No se detecto:
- sessionHash
- tokenHash
- partitionKey
- rowKey
- pendingBlobName
- uploads-pending
- sig=
- sv=
- secret
```

## Hallazgos

### Observacion P2 - El perfil/carrusel no usa el cover nuevo si el servicio ya tiene gallery

Impacto:

```text
Home y listado ya muestran el cover real 1200 x 800.
El perfil seleccionado sigue mostrando la galeria QA previa de 1 x 1.
```

Interpretacion:

```text
El flujo de upload cover funciona y actualiza Services.coverUrl.
La limitacion esta en datos/frontend del perfil: cuando gallery existe, el carrusel toma gallery en vez de usar cover como primer elemento visual.
```

Riesgo para demo:

```text
Si la demo incluye abrir el perfil de empresa, aun se vera una imagen pobre en el carrusel.
```

## Riesgos restantes

- Queda un nuevo upload publicado en Storage y Table Storage como dato QA.
- No hay limpieza automatica de uploads QA publicados.
- El servicio conserva una galeria antigua de `1 x 1`; esto reduce la calidad visual del perfil.
- No se roto `ADMIN_PASSWORD`; sigue pendiente segun backlog al cerrar la ventana de pruebas controladas.
- Screenshot del perfil no se pudo capturar por timeout CDP del browser embebido; la evidencia visual queda por inspeccion DOM y dimensiones naturales.

## Recomendacion

Listo para demo controlada de home y listado.

Para demo controlada incluyendo perfil/carrusel, recomiendo un ajuste adicional antes de mostrarlo:

```text
1. Publicar/reemplazar una imagen real en gallery para el servicio QA principal; o
2. Ajustar frontend para que el cover sea el primer slide del carrusel cuando exista, aunque tambien haya gallery.
```
