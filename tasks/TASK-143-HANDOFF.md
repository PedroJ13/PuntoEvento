# TASK-143 - QA Azure ajustes Product Owner post-deploy

## Resultado

No aprobado.

Los ajustes principales de flujo funcionan en Azure: registro con provincia/contactos, imagenes dentro del servicio en admin, aprobacion de servicio publicando cover + galeria, y catalogo publico sin email. Sin embargo queda un P1 de Web Dev: el expediente admin no muestra los contactos ampliados para revision, aunque el endpoint interno si los devuelve.

Revalidado nuevamente el 2026-05-30 contra Azure con las mismas versiones publicadas (`app.js?v=23`, `styles.css?v=17`, `admin.js?v=15`, `admin.css?v=9`). El P1 sigue vigente.

## Ambiente probado

- Azure: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha local: 2026-05-30
- Navegador: Chromium headless
- Admin auth: `local-secrets/qa-admin.ps1`, sin imprimir valores

## Versiones servidas

| Superficie | Esperado | Observado |
| --- | --- | --- |
| `/index.html` -> `app.js` | `v=23` | PASS |
| `/index.html` -> `styles.css` | `v=17` | PASS |
| `/admin.html` -> `admin.js` | `v=15` | PASS |
| `/admin.html` -> `admin.css` | `v=9` | PASS |

## Datos QA usados

Flujo principal:

- Company: `company_a6f296ec-509c-4a9e-8d6d-1a32e3ef2c1b`
- Slug: `qa-task-143-empresa-20260530183806`
- Service: `service_6226cf2c-da1f-4d91-887a-cead3a159a2f`
- Uploads:
  - `upload_43801dde-ee40-48af-accb-3d84d0cc1de4`
  - `upload_88da514b-70f3-4d3a-86cc-5c528ab0ea37`

Responsive mobile admin:

- Company: `company_31d24bc9-2f0c-4c20-bdbf-542e21a41c91`
- Service: `service_974dac5d-d5fa-4b45-8f08-f3976f55e485`
- Upload: `upload_305e41c5-6ae6-4128-b77c-865056e215f5`

Revalidacion enfocada de contactos admin:

- Company: `company_19ac08c5-9217-457f-823e-7adb77610ef3`
- Slug: `qa-task-143-recheck-20260530190030`

## Limpieza soft

Flujo principal:

- Servicio publicado fue rechazado: `200`
- Empresa publicada fue rechazada: `200`
- Catalogo publico despues del rechazo: `0` resultados para esa empresa
- Uploads ya publicados respondieron `409 Invalid state` al intentar rechazarlos, esperado por contrato actual; quedan como uploads publicados historicos, pero sin servicio/empresa publicada.

Responsive mobile:

- Upload pendiente rechazado: `200`
- Servicio pendiente rechazado: `200`
- Empresa pendiente rechazada: `200`

Revalidacion enfocada de contactos admin:

- Empresa pendiente rechazada: `200`

## Resultado por alcance

### 1. Versiones

PASS. Azure sirve las versiones esperadas.

### 2. Registro publico

PASS.

- Provincia es `<select>`.
- Opciones visibles:
  - `San Jose`
  - `Alajuela`
  - `Cartago`
  - `Heredia`
  - `Guanacaste`
  - `Puntarenas`
  - `Limon`
- Campos presentes:
  - WhatsApp
  - Telefono local
  - Instagram
  - Facebook
  - Sitio web
  - TikTok
- Registro por UI respondio `201`.
- Endpoint interno devolvio contactos persistidos: email, WhatsApp, telefono local, Instagram, Facebook, website y TikTok.

### 3. Admin interno

Parcial.

PASS:

- No aparece `.internal-grid`.
- No aparece `[data-internal-list="uploads"]`.
- No aparece columna separada `[data-case-uploads]`.
- El expediente muestra servicio asociado.
- Las imagenes aparecen dentro del servicio.
- Previews cargaron con object URLs `blob:https://...`.
- Boton del servicio: `Aprobar servicio e imagenes`.
- No hay botones primarios de aprobar uploads separados: `uploadActionButtons=0`.
- DOM no expone `sig=`, `tokenHash`, `sessionHash`, `pendingBlobName`, `uploadUrl`, cookies ni SAS.

FAIL P1:

- En el expediente admin solo fueron visibles `email`, `whatsapp` y zona.
- No fueron visibles los contactos ampliados:
  - `phone`
  - `instagram`
  - `facebook`
  - `website`
  - `tiktok`

### 4. Moderacion con imagenes reales

PASS.

- Empresa registrada por UI.
- Servicio creado desde panel empresa con cover + galeria.
- Servicio enviado a revision.
- Admin ve 2 imagenes dentro del servicio.
- `POST /api/internal/services/{companyId}/{serviceId}/approve` antes de aprobar empresa responde `409`.
- Admin aprobo empresa.
- Admin aprobo servicio con accion `Aprobar servicio e imagenes`.
- Resultado publico:
  - Servicio publicado visible.
  - `coverUrl` presente.
  - `galleryCount=1`.
  - Perfil publico muestra empresa y servicio.
  - Carrusel/perfil muestra imagenes.

### 5. Contactos en superficies

Parcial.

PASS:

- API interna tiene contactos ampliados para revision.
- API publica expone solo contactos publicos definidos:
  - `whatsapp`
  - `website`
  - `instagram`
  - `facebook`
  - `tiktok`
- API publica no expone `email`.
- DOM del perfil publico no mostro email.

FAIL P1:

- Admin UI no muestra contactos ampliados para revision, aunque estan en la respuesta interna.

### 6. Responsive minimo

PASS con observacion.

- Registro mobile: provincia select presente y 5 campos opcionales de contacto visibles.
- Admin mobile con expediente pendiente:
  - empresa seleccionable;
  - imagen dentro del servicio visible;
  - sin bloque global viejo;
  - boton `Aprobar servicio e imagenes`.
- Consola mostro un `404` no bloqueante, consistente con pruebas previas.

## Evidencia clave

Admin antes de aprobar:

```text
oldGlobalGridCount=0
oldGlobalUploadListCount=0
caseUploadsColumnCount=0
serviceCards=1
serviceImageCards=2
approveServiceLabel=Aprobar servicio e imagenes
uploadActionButtons=0
sensitiveInDom=false
preview responses=200,200
```

Publico despues de aprobar:

```text
servicesCountForCompany=1
coverUrlPresent=true
galleryCount=1
companyHasEmail=false
public profile hasCompany=1
public profile hasService=3
bodyHasEmail=false
```

Contactos en admin DOM:

```text
whatsapp=true
email=true
phone=false
instagram=false
facebook=false
website=false
tiktok=false
```

## Revalidacion adicional 2026-05-30

Se repitio una validacion enfocada despues de revisar que la correccion de Web Dev quedo registrada como tarea posterior y que Azure sigue sirviendo `admin.js?v=15`.

Versiones:

```text
app.js=v23
styles.css=v17
admin.js=v15
admin.css=v9
```

Registro:

```text
provinceIsSelect=true
postStatus=201
consoleErrors=0
```

API interna para la empresa de revalidacion:

```text
email=presente
whatsapp=presente
phone=presente
instagram=presente
facebook=presente
website=presente
tiktok=presente
```

Admin DOM para la misma empresa:

```text
selectable=1
oldGlobalGridCount=0
oldGlobalUploadListCount=0
caseUploadsColumnCount=0
email=true
whatsapp=true
phone=false
instagram=false
facebook=false
website=false
tiktok=false
sensitiveInDom=false
```

Conclusion: la API interna conserva todos los contactos, pero el expediente admin sigue renderizando solo email y WhatsApp. El P1 no esta resuelto en Azure.

## Bugs encontrados

### P1 - Web Dev - Admin no muestra contactos ampliados en expediente

Esperado:

- Admin debe poder revisar telefono local, Instagram, Facebook, sitio web y TikTok antes de aprobar una empresa.

Observado:

- `GET /api/internal/companies/pending` devuelve esos campos.
- `admin.js?v=15` no los renderiza en el detalle del expediente; solo muestra email, WhatsApp y zona.

Impacto:

- El admin no puede revisar todos los contactos enviados desde registro antes de publicar la empresa.

Recomendacion:

- Actualizar `caseCompanyDetail()` para mostrar `phone`, `website`, `instagram`, `facebook` y `tiktok` cuando existan.
- Repetir QA enfocada de admin contactos; no hace falta repetir todo el flujo de imagenes si no cambia backend.

## Recomendacion para Product / Architect / Release

No pasar aun a re-prueba Product Owner como aprobado completo. Abrir una tarea pequena Web Dev para renderizar contactos ampliados en el expediente admin y luego hacer una QA enfocada de esa superficie. El flujo critico de imagenes por servicio y publicacion conjunta si queda validado en Azure.
