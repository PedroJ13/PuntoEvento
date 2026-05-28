# TASK-082 Handoff - QA Azure flujo completo MVP

## Resultado general

Listo parcialmente con pasos API/manuales.

Respuesta corta para Product Owner:

```text
Si, el flujo completo puede probarse hoy en Azure, pero no 100% desde navegador.
Registro, invitacion, servicios, upload, moderacion y publicacion funcionan por API/manual.
La parte publica se puede validar en navegador.
El panel empresa y el admin visual aun son demo/local o legacy para este flujo nuevo.
```

No cambie codigo, no hice commit ni push, no borre datos reales.

## Ambiente

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Datos QA creados

Empresa:

```text
companyName: QA TASK 082 Empresa 20260528222326
email: qa-task-082-20260528222326@example.test
companyId: company_68f23798-cf29-4320-ab4a-a60870c4be59
companySlug: qa-task-082-empresa-20260528222326
status final: published
plan: free
```

Servicio publicado:

```text
serviceName: QA TASK 082 Servicio 20260528222326 Editado
serviceId: service_bd6082b4-9998-4f76-9bec-aa330aad9fac
serviceSlug: qa-task-082-servicio-20260528222326-editado
status final: published
```

Servicio inactivo de control:

```text
serviceName: QA TASK 082 Inactive 20260528222326
serviceId: service_c4d223eb-d761-42b9-b229-2bc1bb3a04bf
serviceSlug: qa-task-082-inactive-20260528222326
status final: inactive
```

Upload publicado:

```text
uploadId: upload_0402c615-b3fe-443f-ba3d-4a8b211ce0e9
imageType: cover
scope: service
dimensiones generadas: 320 x 200
size: 15653 bytes
```

URL publica final:

```text
https://storagepuntoevento.blob.core.windows.net/public/companies/company_68f23798-cf29-4320-ab4a-a60870c4be59/services/service_bd6082b4-9998-4f76-9bec-aa330aad9fac/cover/upload_0402c615-b3fe-443f-ba3d-4a8b211ce0e9.png
```

## Tabla de casos

| Caso | Resultado | Via | Evidencia |
| --- | --- | --- | --- |
| Registro empresa nueva | PASS | API | `POST /api/companies/register` respondio `201`, empresa `pending/free`. |
| Registro desde UI publica `#empresas` para modelo nuevo | PARCIAL | Navegador + codigo | Hay formulario visible, pero el frontend actual usa flujo legacy `register-provider`, no `companies/register`. |
| Crear invitacion interna | PASS | API/admin | `POST /api/internal/company-invites` respondio `201`. Secretos e invite URL redactados. |
| Aceptar invitacion | PASS | API | `POST /api/company-auth/accept-invite` respondio `200` y emitio cookie. |
| Confirmar sesion empresa | PASS | API | `GET /api/companies/me` respondio `200` para la empresa nueva. |
| Panel empresa en Azure | PARCIAL | Navegador | `panel.html` carga, pero dice `Demo local` y `Esta demo no guarda en Azure todavia`; usa `localStorage`. |
| Crear servicio propio | PASS | API | `POST /api/companies/me/services` respondio `201`. |
| Editar servicio propio | PASS | API | `PATCH /api/companies/me/services/{serviceId}` respondio `200` y regenero slug editado. |
| Desactivar servicio de prueba | PASS | API | `DELETE /api/companies/me/services/{serviceId}` respondio `200`, status `inactive`. |
| Servicio draft no aparece publico | PASS | API | Busqueda publica antes de aprobacion devolvio `0` resultados para el servicio draft. |
| Servicio inactive no aparece publico | PASS | API | Busqueda publica del servicio inactive devolvio `0` resultados. |
| Firmar upload | PASS | API | `POST /api/uploads/sign` respondio `200`. SAS no documentado. |
| Subir imagen a Blob | PASS | API/Blob | `PUT` a SAS respondio `201`. |
| Confirmar upload | PASS | API | `POST /api/uploads/confirm` respondio `201`. |
| Aprobar empresa | PASS | API/admin | `POST /api/internal/companies/{companyId}/approve` respondio `200`. |
| Aprobar servicio | PASS | API/admin | `POST /api/internal/services/{companyId}/{serviceId}/approve` respondio `200`. |
| Aprobar imagen | PASS | API/admin | `POST /api/internal/uploads/{companyId}/{uploadId}/approve` respondio `200` y devolvio `publicBlobUrl`. |
| Servicio aparece en API publica | PASS | API | `GET /api/public/services?q=...` encontro el servicio y cover coincide. |
| Perfil publico abre | PASS | API/navegador | `GET /api/public/companies/{slug}?service={slug}` respondio `200`; navegador renderizo perfil. |
| Servicio aparece visualmente en `#bodas` | PASS | Navegador | `#bodas` mostro el servicio y empresa QA, cover `320 x 200`, sin overflow. |
| Mobile 390px | PASS | Navegador | Perfil visible, `clientWidth=375`, `scrollWidth=375`, sin overflow. |
| Logout / sesion cerrada | PASS | API | `POST /api/company-auth/logout` respondio `200`; luego `GET /api/companies/me` respondio `401`. |
| Admin UI para moderacion nueva | PARCIAL | Navegador + codigo | `admin.html` muestra login y revision legacy de proveedores; no expone UI para aprobar Companies/Services/Uploads nuevos. |
| Sin secretos en UI publica | PASS | Navegador | No se detectaron `sessionHash`, `tokenHash`, `partitionKey`, `rowKey`, `pendingBlobName`, `sig=`, `sv=`, `pe_company_session`. |
| Errores JS no controlados | PASS | Navegador | Logs de error capturados: `[]`. |

## Que se probo por navegador

### `#empresas`

URL:

```text
/index.html#empresas
```

Resultado:

```text
Formulario visible: true
Overflow horizontal: false
Secretos visibles: false
```

Observacion:

```text
El formulario publico existe, pero no esta conectado al flujo nuevo Company -> Services.
El codigo actual de app.js usa endpoints legacy register-provider/create-upload-url/register-upload.
```

### `panel.html`

URL:

```text
/panel.html
```

Resultado:

```text
Carga visual: true
Texto demo/local visible: true
Servicios demo en localStorage: true
Overflow horizontal: false
Secretos visibles: false
```

Observacion:

```text
No usa API real ni sesion de empresa. No permite a Product Owner crear servicios reales desde navegador.
```

### `admin.html`

URL:

```text
/admin.html
```

Resultado:

```text
Login visible: true
Overflow horizontal: false
Secretos visibles: false
```

Observacion:

```text
El admin visual sigue enfocado en revision legacy de proveedores. La moderacion del flujo nuevo se hizo por endpoints internos.
```

### `#bodas`

URL:

```text
/index.html#bodas
```

Resultado:

```text
Servicio QA nuevo visible: true
Empresa QA nueva visible: true
Resultados visibles: 5
Cover del servicio QA nuevo: 320 x 200
Imagenes rotas: 0
Overflow horizontal: false
Secretos visibles: false
```

### Perfil publico nuevo

URL:

```text
/index.html#proveedor/qa-task-082-empresa-20260528222326/qa-task-082-servicio-20260528222326-editado
```

Desktop:

```text
Empresa visible: QA TASK 082 Empresa 20260528222326
Servicio destacado: QA TASK 082 Servicio 20260528222326 Editado
Imagen carrusel: publicBlobUrl del upload TASK-082
Dimensiones naturales: 320 x 200
Contador: 1 / 1
Miniaturas: 1
Imagenes rotas: 0
Overflow horizontal: false
Secretos visibles: false
```

Mobile 390 x 844:

```text
Perfil visible: true
Dimensiones naturales: 320 x 200
Contador: 1 / 1
clientWidth: 375
scrollWidth: 375
Overflow horizontal: false
```

## Que se probo por API/script

Flujo real ejecutado:

```text
POST /api/companies/register
POST /api/internal/company-invites
POST /api/company-auth/accept-invite
GET /api/companies/me
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
POST /api/uploads/sign
PUT <uploadUrl SAS redacted>
POST /api/uploads/confirm
POST /api/internal/companies/{companyId}/approve
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/approve
GET /api/public/services
GET /api/public/companies/{slug}?service={serviceSlug}
POST /api/company-auth/logout
GET /api/companies/me
```

Todos los secretos, cookies, tokens, SAS e invite URLs se omitieron del handoff.

## Flujos para Product Owner

### Puede probar en navegador hoy

- Ver pagina publica:
  - `/index.html#inicio`
  - `/index.html#bodas`
- Ver el servicio QA publicado:
  - `/index.html#bodas`
- Abrir perfil publicado:
  - `/index.html#proveedor/qa-task-082-empresa-20260528222326/qa-task-082-servicio-20260528222326-editado`
- Ver formulario publico de empresas en:
  - `/index.html#empresas`

### Requiere API/PowerShell/admin manual hoy

- Crear empresa real del modelo `Company`.
- Crear invitacion y aceptar sesion.
- Crear/editar/desactivar servicios reales.
- Firmar, subir y confirmar uploads reales.
- Aprobar empresa, servicio e imagen.

### Bloqueado/incompleto para Product Owner directo

- Usar `panel.html` como panel real de empresa conectado a Azure.
- Usar `admin.html` para aprobar empresas/servicios/uploads del modelo nuevo.
- Completar todo el flujo end-to-end solo con navegador sin ayuda de QA/Infra.

## Bugs / gaps encontrados

### P2 - Panel empresa no esta conectado a API real

Impacto:

```text
Product Owner no puede crear/editar/desactivar servicios reales desde panel.html.
```

Evidencia:

```text
panel.html muestra "Demo local" y "Esta demo no guarda en Azure todavia".
panel.js usa localStorage y datos demo.
```

### P2 - Admin visual no cubre moderacion del modelo nuevo

Impacto:

```text
Product Owner/Admin no puede aprobar Companies/Services/Uploads nuevos desde admin.html.
```

Evidencia:

```text
admin.html/admin.js conservan flujo legacy de proveedores y endpoints admin/pending-providers.
La moderacion nueva usa /api/internal/companies, /api/internal/services y /api/internal/uploads.
```

### P2 - Registro publico visible no alimenta el flujo nuevo completo

Impacto:

```text
El formulario #empresas existe, pero no crea Company + acceso + servicios en el flujo MVP nuevo.
```

Evidencia:

```text
app.js usa register-provider/create-upload-url/register-upload para esa UI.
El flujo nuevo probado usa POST /api/companies/register.
```

## Riesgos aceptables

- Quedaron datos QA nuevos publicados en Azure para trazabilidad de la prueba.
- El upload QA es una imagen generada simple de `320 x 200`; sirve para validar flujo, no para demo comercial final.
- La credencial admin sigue siendo compartida via secreto local ignorado, aunque ya fue rotada en TASK-080.
- `local-secrets/qa-admin.ps1` sigue ignorado por git:

```text
.gitignore:2:local-secrets/ local-secrets/qa-admin.ps1
```

## Recomendacion exacta

Estado recomendado:

```text
Listo parcialmente con pasos API/manuales.
```

Product Owner puede probar la parte publica en navegador con:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#bodas
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#proveedor/qa-task-082-empresa-20260528222326/qa-task-082-servicio-20260528222326-editado
```

Para que Pedro/Product Owner pueda probar el flujo completo sin apoyo tecnico, recomiendo crear tareas Web Dev/Backend antes:

1. Conectar `#empresas` a `POST /api/companies/register` o aclarar producto si se mantiene legacy temporal.
2. Conectar `panel.html` a auth por invitacion, `GET /api/companies/me`, CRUD de servicios y upload real.
3. Crear UI admin interna para moderar Companies, Services y Uploads del modelo nuevo.
4. Definir un guion Product Owner con dos caminos: "sin API" y "con asistencia QA/Infra".
