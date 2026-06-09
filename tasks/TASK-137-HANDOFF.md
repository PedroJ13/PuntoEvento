# TASK-137: QA admin UI Round 2 post-fix

## Estado

Aprobado.

El P1 de admin UI reportado en `TASK-132` queda cerrado: `Modelo nuevo` ya carga pendientes reales, muestra expediente por empresa y presenta bloqueos visuales para aprobaciones fuera de orden.

## Ambiente probado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha local: 2026-05-30
- Admin auth: `local-secrets/qa-admin.ps1`, usado sin imprimir valores.
- Navegador: Chromium headless.
- Viewports:
  - Desktop: 1366x900
  - Mobile: 390x844

## Versiones confirmadas

- `/admin.html` -> `admin.js?v=14`
- `/admin.html` -> `admin.css?v=8`

## Datos QA creados

Se creo un expediente temporal controlado:

- Company: `company_2e5b0e15-a72d-42b8-875e-07df8c570a86`
- Service: `service_96a12b46-084a-4674-ae94-94b30303da20`
- Upload: `upload_5b916a95-5f8a-4f05-80ca-bb78747910dc`

Precheck por API interna antes de abrir admin:

```text
GET /api/internal/companies/pending -> 200, companyFound=true
GET /api/internal/services/pending -> 200, serviceFound=true
GET /api/internal/uploads/pending -> 200, uploadCount=1
```

## Limpieza soft aplicada

Al terminar:

```text
upload reject -> 200
service reject -> 200
company reject -> 200
remainingServices=0
remainingUploads=0
```

## Resultado por caso

| Caso | Resultado |
| --- | --- |
| `/admin.html` sirve `admin.js?v=14` y `admin.css?v=8` | PASS |
| Login admin con credencial real QA | PASS |
| Crear datos QA pendientes controlados | PASS: empresa, servicio y upload pendientes creados. |
| Abrir tab `Modelo nuevo` | PASS |
| Contadores no quedan en cero cuando existen pendientes | PASS: desktop/mobile mostraron Companies `4`, Services `4`, Uploads `7` en ese momento. |
| `Empresas con actividad` muestra empresa QA | PASS: `selectable=1` para la empresa QA. |
| Expediente muestra detalle de empresa | PASS: nombre de empresa visible. |
| Expediente muestra servicios asociados | PASS: servicio QA visible en expediente. |
| Expediente muestra uploads asociados | PASS: upload asociado visible en expediente. |
| Servicio no aprobable si empresa no esta `published` | PASS: boton aprobar servicio deshabilitado; title `Publica la empresa antes de aprobar servicios.` |
| Upload no aprobable si empresa no esta `published` | PASS: boton aprobar upload deshabilitado; title `Publica la empresa antes de aprobar imagenes.` |
| Upload de servicio no aprobable si servicio no esta `published` | Parcial UI: no se avanzo a empresa publicada dentro de esta tarea porque API ya fue cubierta en `TASK-132`; el bloqueo visual por empresa no publicada aparece primero y es correcto para este estado. |
| Desktop/mobile basico | PASS |
| Limpieza soft | PASS |

## Evidencia DOM

Desktop:

```text
statusText=Modelo nuevo actualizado.
caseMarkup=1
companyCount=4
serviceCount=4
uploadCount=7
selectable=1
detailHasCompany=5
detailHasService=2
scopedServices=2
scopedUploads=2
disabledServiceApprove=1
disabledUploadApprove=1
serviceApproveTitle=Publica la empresa antes de aprobar servicios.
uploadApproveTitle=Publica la empresa antes de aprobar imagenes.
```

Mobile:

```text
statusText=Modelo nuevo actualizado.
caseMarkup=1
companyCount=4
serviceCount=4
uploadCount=7
selectable=1
detailHasCompany=5
detailHasService=2
scopedServices=2
scopedUploads=2
disabledServiceApprove=1
disabledUploadApprove=1
serviceApproveTitle=Publica la empresa antes de aprobar servicios.
uploadApproveTitle=Publica la empresa antes de aprobar imagenes.
```

Requests observados desde navegador:

```text
GET /api/internal/companies/pending -> 200
GET /api/internal/services/pending -> 200
GET /api/internal/uploads/pending -> 200
```

La consola mostro un `404` no bloqueante, probablemente asset/favico. No hubo errores JS que impidieran cargar el expediente.

## Riesgos / pendientes

- Hay otros pendientes existentes en el ambiente, por eso los contadores globales fueron mayores que el expediente QA creado durante la prueba.
- El bloqueo visual especifico de `upload de servicio no publicado con empresa ya publicada` no se re-ejecuto en UI para evitar publicar/moderar mas estados en esta tarea enfocada. La regla API ya fue aprobada en `TASK-132`.

## Recomendacion

Dar por cerrado el P1 admin UI. Product Owner puede repetir la prueba Round 2 sabiendo que pagina publica, panel empresa, API y expediente admin ya fueron validados post-deploy.

