# TASK-212 - QA Handoff

Equipo: QA

Tarea validada: `TASK-212: QA - revalidar ajustes finales panel empresa en Azure`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: Azure real
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04
- Datos QA controlados:
  - Run: `TASK212-20260604164154-dcbbe9f7`
  - Empresa: `QA TASK-212 Empresa 20260604164154`
  - Company ID: `company_238c0b44-195e-4ef3-b4d6-192b574ffcef`
  - Servicio: `Catering QA TASK-212 20260604164154`
  - Service ID: `service_4ea51318-ca75-44ae-bc93-9e3c0f42f2f1`

## Resultado

**Aprobado con observaciones P3.**

No se detectaron P0/P1. Los ajustes finales del panel empresa estan desplegados en Azure y los flujos MVP del panel siguen funcionando contra API real.

## Resultado por superficie

### Assets Azure

Resultado: **aprobado**.

- `/`: HTTP `200`, contiene `app.js?v=27`.
- `/panel.html`: HTTP `200`.
- `/panel.html` contiene `panel.css?v=10`: OK.
- `/panel.html` contiene `panel.js?v=9`: OK.
- `/panel.html` contiene ruta del logo JPEG: OK.
- `/panel.css?v=10`: HTTP `200`, `14228` bytes.
- `/panel.js?v=9`: HTTP `200`, `33246` bytes.
- `/Reference Images/Propeusta logo e imagen de pagina.jpeg`: HTTP `200`, `58003` bytes, `image/jpeg`.
- `/admin.html`: HTTP `200`, contiene `admin.js?v=18`.
- `/api/public/services?limit=1`: HTTP `200`.

### Panel empresa - desktop

Resultado: **aprobado**.

Viewport: `1440x900`.

Checks:

- Activacion por invite controlado: OK.
  - UI mostro `Activa tu acceso`.
  - `POST /api/company-auth/activate`: `200`.
- Login recurrente: OK.
  - `POST /api/company-auth/login`: `200`.
- Logout: OK.
  - `POST /api/company-auth/logout`: `200`.
  - Login vuelve a quedar visible.
- Layout desktop con sidebar: OK.
  - Sidebar observado: `280px`.
  - Sin overflow horizontal.
- Logo/marca:
  - Logo carga completo.
  - Natural: `1024x1024`.
  - Render desktop: `180x180`.
- Iconos:
  - `7` iconos SVG.
  - Stroke observado: blanco (`rgb(255, 255, 255)`).
- Items futuros:
  - `Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes`.
  - Los 5 aparecen deshabilitados con `Proximamente`.
  - Click sobre item futuro no cambia vista ni navega.
- `Mi empresa`: OK.
  - Empresa QA visible.
  - Plan `free`.
  - Estado `Publicado`.
  - Nota `Datos generales` visible.
- `Mis servicios`: OK.

### Formulario de servicio en Azure

Resultado: **aprobado**.

- `Categoria` es `SELECT` de seleccion unica:
  - `categoryMultiple=false`.
- `Tipos de evento` es `SELECT multiple`:
  - `eventMultiple=true`.
  - Helper visible: `Selecciona uno o varios tipos de evento.`
- Opciones observadas:
  - `Bodas`
  - `Cumpleanos`
  - `Eventos corporativos`
  - `Baby Shower`
  - `Graduaciones`
  - `Fiestas infantiles`
- Validacion sin tipo seleccionado: OK.
  - Mensaje: `Selecciona al menos un tipo de evento.`
  - No se creo servicio sin eventos.
- Crear servicio con multiples tipos: OK.
  - Seleccionados: `Bodas`, `Cumpleanos`.
  - `POST /api/companies/me/services`: `201`.
  - `POST /api/companies/me/services/{serviceId}/submit-review`: `200`.
  - Estado API despues de crear/enviar: `pending`.
  - API conserva `eventTypes=["Bodas","Cumpleanos"]`.
  - Tarjeta muestra `Eventos Bodas, Cumpleanos`.
- Editar servicio: OK.
  - Formulario entra en modo `Editar servicio`.
  - Preselecciona `Bodas` y `Cumpleanos`.
  - `PATCH /api/companies/me/services/{serviceId}`: `200`.
  - Reenvio a revision: `200`.
  - API conserva `eventTypes=["Bodas","Cumpleanos"]`.
- Upload real y `Portada`: OK.
  - Preview de foto visible.
  - Boton `Portada` visible.
  - `POST /api/uploads/sign`: `200`.
  - `POST /api/uploads/confirm`: `201`.
- Desactivar servicio: OK.
  - `DELETE /api/companies/me/services/{serviceId}`: `200`.
  - Estado final API: `inactive`.
  - Texto `Inactivo` visible.
- `Volver a la pagina publica`: OK.
  - Navega a `index.html#inicio`.

### Panel empresa - mobile

Resultado: **aprobado**.

Viewport: `390x844`.

- Login recurrente: OK.
- Sin overflow horizontal.
  - `viewportWidth=390`.
  - `scrollWidth=390`.
- Logo carga completo.
  - Natural: `1024x1024`.
  - Render mobile: `210x210`.
- Iconos SVG: `7`.
- Items futuros deshabilitados: `5`.
- Badges `Proximamente`: `5`.
- `Tipos de evento` sigue siendo multiple.
- `Volver a la pagina publica`: visible.
- `Cerrar sesion`: visible.

### Regresion minima publica

Resultado: **aprobado**.

- `index.html` carga.
- Titulo: `Punto Evento CR | Demo propuesta`.
- Busqueda presente.
- CTA `Contactar` presente.
- Sin overflow horizontal.
- Consola sin errores durante smoke.

### Regresion minima admin

Resultado: **aprobado**.

- `admin.html` carga.
- Titulo: `Admin | Punto Evento`.
- Login/admin visible.
- Sin overflow horizontal.
- Consola sin errores durante smoke.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

Ninguno nuevo.

Nota: persiste el comportamiento ya observado/aceptado en `TASK-208`: la tarjeta puede mostrar `Fotos 0 archivo(s)` mientras la foto esta pendiente de moderacion, aunque `uploads/sign` y `uploads/confirm` funcionen. No se reclasifica como bloqueo de `TASK-212`.

### P3

1. **Logo sigue siendo JPEG de referencia**
   - Carga correctamente y se ve proporcionado en desktop/mobile.
   - Riesgo menor: no es asset final vectorial/optimizado.
   - Recomendacion: reemplazar por logo final cuando exista.

2. **401 esperados aparecen como errores de consola al cargar panel sin sesion**
   - Observado en desktop/mobile: llamadas iniciales a `/api/companies/me` y `/api/companies/me/services` devuelven `401` antes de activacion/login.
   - La UI maneja correctamente el estado y muestra login/activacion.
   - Impacto: ruido tecnico en consola, no bloquea usuario.

## Evidencia resumida

### API / estados

```text
registerStatus=201
approveCompanyStatus=200
approveInviteStatus=email_sent
createInviteStatus=201
activateStatus=200
loginStatus=200
createServiceStatus=201
createdServiceStatus=pending
createdServiceEventTypes=Bodas,Cumpleanos
uploadSignStatus=200
uploadConfirmStatus=201
submitReviewStatus=200
editServiceStatus=200
editedServiceEventTypes=Bodas,Cumpleanos
deleteServiceStatus=200
finalServiceStatus=inactive
cleanupRejectCompanyStatus=200
```

### Desktop

```text
panelCssV10=true
panelJsV9=true
logoStatus=200
desktopLogo=180x180
sidebarWidth=280
overflowX=false
iconCount=7
futureItems=5 disabled with Proximamente
categoryMultiple=false
eventMultiple=true
noEventsValidation=Selecciona al menos un tipo de evento.
editPreselect=Bodas,Cumpleanos
receivedVisible=true
inactiveVisible=true
publicNavOk=true
```

### Mobile

```text
viewportWidth=390
scrollWidth=390
overflowX=false
mobileLogo=210x210
iconCount=7
disabledFutureItems=5
soonBadges=5
eventMultiple=true
publicVisible=true
logoutVisible=true
```

### Limpieza

- Empresa QA rechazada al final: `200`.
- Busqueda publica `TASK-212`: `200`, `0` resultados.
- No se imprimieron credenciales, cookies ni tokens.

## Riesgos aceptables

- El selector multiple nativo puede variar visualmente entre navegadores, pero en Chrome desktop/mobile funciona y el helper reduce ambiguedad.
- El logo JPEG es aceptable para esta etapa, pero debe reemplazarse por asset final cuando Product/Diseno lo tenga.
- El ruido 401 inicial en consola es esperado por carga sin sesion.

## Recomendacion para Product / Architect / Release

**Aceptar `TASK-212` como aprobado con observaciones P3.**

Los ajustes finales del panel empresa quedan validados en Azure real: assets nuevos servidos, selector multiple funcional, multiples tipos preservados al crear/editar/enviar, logo e iconos visibles, desktop/mobile sin overflow, y flujos MVP del panel/regresion publica/admin sin P0/P1.

No declaro go comercial nuevo; desde QA, este bloque tecnico queda listo para que Product / Architect / Release decida el siguiente paso operativo.
