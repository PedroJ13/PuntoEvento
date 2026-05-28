# TASK-081 Handoff - Limpiar imagen vieja 1x1 de galeria QA

## Resultado general

Aprobado.

Se limpio la galeria del servicio QA principal en Azure usando el endpoint autenticado de empresa. El perfil publico ya no muestra la imagen vieja `1 x 1` al avanzar el carrusel.

No cambie codigo, no hice commit ni push, no subi imagenes nuevas y no cambie el `coverUrl` aprobado.

## Opcion elegida

Remocion logica desde datos:

```text
PATCH /api/companies/me/services/{serviceId}
Body: {"gallery":[]}
```

Motivo:

- El backend actual permite editar `gallery` como arreglo desde la sesion de empresa.
- No existe en los contratos un endpoint especifico para borrar fisicamente blobs publicados ni para revocar una sola imagen de galeria.
- Limpiar `Services.gallery` evita que la imagen `1 x 1` aparezca en UI publica sin tocar el cover real ni borrar datos de storage fuera de alcance.

## Servicio objetivo

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
companySlug: qa-company-register-test
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
serviceSlug: qa-moderacion-approve-20260528113350
```

## Endpoints/comandos usados

Base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Flujo ejecutado, con secretos redactados:

```text
POST /api/internal/company-invites
Header: X-Punto-Admin-Credential: <redacted>
Body: companyId=<companyId>, email=qa-task-081@example.test
Resultado: 201
```

```text
POST /api/company-auth/accept-invite
Body: token=<redacted>
Resultado: 200
Set-Cookie: <redacted>
```

```text
PATCH /api/companies/me/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934
Cookie: <redacted>
Body: {"gallery":[]}
Resultado: 200
```

```text
POST /api/company-auth/logout
Cookie: <redacted>
Resultado: 200
```

Validacion publica:

```text
GET /api/public/companies/qa-company-register-test?service=qa-moderacion-approve-20260528113350
Resultado: 200
selectedServiceSlug: qa-moderacion-approve-20260528113350
galleryCount: 0
coverPreserved: true
```

## URLs publicas finales relevantes

Cover real preservado:

```text
https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png
```

Imagen vieja removida de `Services.gallery`:

```text
https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png
```

Nota: la URL vieja puede seguir existiendo en Blob Storage, pero ya no se devuelve en el perfil/listado publico del servicio.

## Evidencia de datos

Respuesta del `PATCH`:

```text
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
status: published
coverPreserved: true
galleryCount: 0
```

Respuesta publica posterior:

```text
selectedServiceSlug: qa-moderacion-approve-20260528113350
publicGalleryCount: 0
publicCoverPreserved: true
```

`local-secrets/qa-admin.ps1` sigue ignorado por git:

```text
.gitignore:2:local-secrets/ local-secrets/qa-admin.ps1
```

## Validacion visual Azure

Navegador:

```text
Codex in-app browser
```

Ruta principal:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

### Perfil desktop

Resultado: PASS.

```text
Empresa visible: QA Company Register Test
Servicio visible: QA Moderacion Approve 20260528113350
Primer slide: upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png
Dimensiones naturales: 1200 x 800
Contador: 1 / 1
Miniaturas: 1
URLs unicas en miniaturas: 1
Imagenes rotas: 0
Overflow horizontal: false
Campos internos/secretos visibles: false
```

Click en boton siguiente:

```text
Resultado: PASS
Sigue en el cover real
Dimensiones naturales: 1200 x 800
Contador: 1 / 1
No aparece imagen 1 x 1
```

### Perfil mobile

Viewport:

```text
390 x 844
```

Resultado: PASS.

```text
Primer slide: cover real
Dimensiones naturales: 1200 x 800
Contador: 1 / 1
Miniaturas: 1
clientWidth: 375
scrollWidth: 375
Overflow horizontal: false
Imagenes rotas: 0
```

### Regresion `#inicio`

Resultado: PASS.

```text
Cards destacadas: 3
Cover QA carga en DOM: true
Dimensiones del cover QA: 1200 x 800
Imagen vieja 1 x 1 en DOM: false
Imagenes rotas: 0
Overflow horizontal: false
Campos internos/secretos visibles: false
```

### Regresion `#bodas`

Resultado: PASS.

```text
Resultados de servicios: 4
Paquetes demo: 6
Cover QA carga en DOM: true
Dimensiones del cover QA: 1200 x 800
Imagen vieja 1 x 1 en DOM: false
Imagenes rotas: 0
Overflow horizontal: false
Campos internos/secretos visibles: false
```

### Consola

Resultado: PASS.

```text
Errores JS capturados: []
```

## Archivos tocados

Versionados:

```text
tasks/TASK-081-HANDOFF.md
```

No versionados/ignorados usados:

```text
local-secrets/qa-admin.ps1
```

## Riesgos restantes

- La imagen vieja `1 x 1` probablemente sigue existiendo como blob publico; solo se removio su referencia desde `Services.gallery`.
- Durante un primer intento fallido con cliente HTTP se creo una invitacion QA que no se pudo consumir. No se imprimio su URL/token, pero puede quedar activa hasta expirar por TTL porque no hay endpoint documentado para revocar invitaciones individuales.
- Se creo y consumio una segunda invitacion QA para abrir sesion y ejecutar el `PATCH`; esa invitacion quedo usada.
- `local-secrets/qa-admin.ps1` esta ignorado, pero en esta copia local esta en una sola linea sin separador PowerShell entre variables; por eso se leyo de forma controlada sin imprimir valores.
- No se borro fisicamente ningun blob ni entidad `Uploads`, porque esta fuera de alcance y no hay endpoint seguro documentado para hacerlo.

## Recomendacion para Product/Architect

El perfil QA queda listo para demo visual controlada. Para una limpieza completa posterior, recomiendo crear una tarea tecnica pequena para:

- endpoint interno de revocacion/remocion de imagen publicada de galeria;
- endpoint interno para revocar invitaciones activas;
- auditoria explicita de cambios manuales sobre `Services.gallery`.
