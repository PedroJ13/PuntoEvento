# TASK-208 - QA Handoff

Equipo: QA

Tarea validada: `TASK-208: QA - revalidar refresh visual panel empresa post-deploy`

## Ambiente

- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Azure real: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: 2026-06-04
- Datos QA controlados:
  - Run: `TASK208-20260604151750-3fd28db1`
  - Empresa: `QA TASK-208 Empresa 20260604151750`
  - Company ID: `company_2577b235-99f6-4f7d-bbd6-25fde8e865d3`
  - Servicio: `Catering QA TASK-208 20260604151750`
  - Service ID: `service_e4a7bdbb-9bbe-4774-bdd6-1b13644be868`

## Resultado

**Aprobado con observaciones P2/P3.**

No se detectaron P0/P1. El refresh visual ya esta desplegado en Azure y los flujos principales del panel empresa funcionan contra API real.

## Resultado por superficie

### Assets Azure

Resultado: **aprobado**.

- `/`: HTTP `200`, contiene `app.js?v=27`.
- `/panel.html`: HTTP `200`.
- `/panel.html` contiene `panel.css?v=9`: OK.
- `/panel.html` contiene `panel.js?v=8`: OK.
- `/panel.css?v=9`: HTTP `200`, `14271` bytes.
- `/panel.js?v=8`: HTTP `200`, `33370` bytes.
- `/admin.html`: HTTP `200`, contiene `admin.js?v=18`.
- `/api/public/services?limit=1`: HTTP `200`.

### Panel empresa - desktop

Resultado: **aprobado con observaciones**.

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
- `Mi empresa`: OK.
  - Empresa QA visible.
  - Plan `free`.
  - Estado `Publicado`.
  - Nota `Datos generales` visible.
- `Mis servicios`: OK.
- Crear servicio: OK.
  - `POST /api/companies/me/services`: `201`.
- Upload real y `Portada`: OK funcional.
  - Preview de foto visible.
  - Boton `Portada` visible.
  - `POST /api/uploads/sign`: `200`.
  - `POST /api/uploads/confirm`: `201`.
- `Guardar y enviar`: OK.
  - `POST /api/companies/me/services/{serviceId}/submit-review`: `200`.
  - Servicio queda en estado `pending` / `Recibido`.
- Editar servicio: OK.
  - `PATCH /api/companies/me/services/{serviceId}`: `200`.
  - Nuevo nombre visible.
  - Reenvio a revision: `200`.
- Desactivar servicio: OK.
  - `DELETE /api/companies/me/services/{serviceId}`: `200`.
  - Estado final API: `inactive`.
  - Texto `Inactivo` visible.
- Items futuros:
  - `Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes`.
  - Los 5 aparecen deshabilitados con `Proximamente`.
  - Click sobre item futuro no cambia la vista ni navega.
- `Volver a la pagina publica`: OK.
  - Navega a `index.html#inicio`.

### Panel empresa - mobile

Resultado: **aprobado**.

Viewport: `390x844`.

- Login recurrente: OK.
- Sin overflow horizontal.
  - `viewportWidth=390`.
  - `scrollWidth=390`.
- Navegacion/sidebar ocupa ancho mobile esperado: `390px`.
- 5 items futuros visibles/deshabilitados.
- 5 badges `Proximamente` visibles.
- `Volver a la pagina publica`: visible.
- `Cerrar sesion`: visible.

### Regresion minima publica

Resultado: **aprobado**.

- `index.html` carga.
- Titulo: `Punto Evento CR | Demo propuesta`.
- Busqueda presente.
- CTA `Contactar` presente.
- Sin overflow horizontal.
- Consola sin errores durante el smoke.

### Regresion minima admin

Resultado: **aprobado**.

- `admin.html` carga.
- Titulo: `Admin | Punto Evento`.
- Login/admin visible.
- Sin overflow horizontal.
- Consola sin errores durante el smoke.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

1. **La tarjeta del servicio muestra `Fotos 0 archivo(s)` despues de upload confirmado**
   - Evidencia: `uploads/sign=200`, `uploads/confirm=201`, preview y `Portada` visibles antes de guardar.
   - Luego la tarjeta del servicio muestra `Fotos 0 archivo(s)` porque parece contar solo `coverUrl/gallery` publicados, no uploads pendientes.
   - Impacto: el upload funciona, pero la empresa puede interpretar que la foto no quedo guardada mientras espera moderacion.
   - Recomendacion: aceptar para pre-lanzamiento si Product lo considera suficiente; abrir ajuste UX para mostrar fotos pendientes o un texto tipo `Foto enviada a revision`.

### P3

1. **401 esperados aparecen como errores de consola al cargar panel sin sesion**
   - Observado en desktop/mobile: llamadas iniciales a `/api/companies/me` y `/api/companies/me/services` devuelven `401` antes de activacion/login.
   - La UI maneja el estado correctamente y muestra login/activacion.
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
uploadSignStatus=200
uploadConfirmStatus=201
submitReviewStatus=200
editServiceStatus=200
deleteServiceStatus=200
finalServiceStatus=inactive
cleanupRejectCompanyStatus=200
```

### Desktop

```text
title=Carga tus servicios
sidebarWidth=280
overflowX=false
futureItems=5 disabled with Proximamente
Mi empresa visible
Mis servicios visible
photoPreviewCount=1
hasPortada=true
receivedVisible=true
inactiveVisible=true
publicNavOk=true
```

### Mobile

```text
viewportWidth=390
scrollWidth=390
overflowX=false
disabledFutureItems=5
soonBadges=5
publicVisible=true
logoutVisible=true
```

### Limpieza

- Empresa QA rechazada al final: `200`.
- Busqueda publica `TASK-208`: `200`, `0` resultados.
- No se imprimieron credenciales, cookies ni tokens.

## Riesgos aceptables

- UX de fotos pendientes puede generar confusion leve si la empresa espera ver conteo inmediato despues de subir portada.
- Los `401` iniciales en consola son esperados por carga sin sesion, pero conviene reducir ruido tecnico en ciclos posteriores.

## Recomendacion para Product / Architect / Release

**Aceptar `TASK-208` como aprobado con observaciones.**

El refresh visual del panel empresa queda validado en Azure con sesion real, activacion, login recurrente, desktop/mobile, navegacion, crear/editar/desactivar servicio, upload real, `Portada`, `Guardar y enviar`, regreso a pagina publica y regresion minima publica/admin.

Siguiente recomendado:

1. Registrar P2 de UX para fotos pendientes si Product quiere mayor claridad antes de invitar empresas reales.
2. Mantener monitoreo cercano durante primeras empresas reales, especialmente en upload/estado de revision.
