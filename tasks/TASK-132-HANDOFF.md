# TASK-132: QA admin/API Round 2 post-deploy

## Estado

Aprobado parcialmente.

El P0 de `TASK-130` queda cerrado a nivel API: Azure ya responde `409` al intentar aprobar un servicio de una empresa no publicada. Queda abierto un P1 de UI admin: el tab `Modelo nuevo` muestra el expediente en DOM, pero no cargo los pendientes creados durante QA y dejo contadores en `0`.

## Ambiente probado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha local: 2026-05-30
- Admin auth: `local-secrets/qa-admin.ps1`, usado sin imprimir valores.
- Versiones confirmadas:
  - `/admin.html` -> `admin.js?v=13`
  - `/admin.html` -> `admin.css?v=8`

## Datos QA creados

Caso principal panel/API:

- Company: `company_46f2d1ab-e08a-43bb-8943-303f31764291`
- Service: `service_ad0839d5-9471-496b-96fe-dd2495a5d597`
- Uploads:
  - `upload_e4691e43-3cc8-42e3-b6d1-9d91ca0beb07`
  - `upload_508bc79d-78f1-4c69-9d48-e6f9100ee3ef`
  - `upload_fd8eb070-cb91-4284-871a-0c8706780df4`

Caso no-cascada:

- Company: `company_7b080e84-266d-4933-8112-00f68ced6296`
- Service: `service_97ae5e90-522c-4479-acb5-b89a73ad22d4`

Casos UI admin temporales:

- `company_3a4e89ba-3e5d-462e-8732-a85b18322b37`
- `company_433f6903-944c-425e-b683-406d4700ba4e`

## Limpieza soft aplicada

Todos los uploads/servicios/empresas QA anteriores fueron rechazados por endpoints internos.

Validacion final del caso principal:

- `remainingPrimaryServices=0`
- `remainingPrimaryUploads=0`
- `remainingCascadeServices=0`

## Resultado por caso

| Caso | Resultado |
| --- | --- |
| `/admin.html` sirve `admin.js?v=13` y `admin.css?v=8` | PASS |
| Login admin con credencial real QA | PASS |
| Admin permite seleccionar empresa y ver servicios/uploads en expediente | FAIL UI: `data-company-case` existe, pero con pendientes creados por QA los contadores quedaron en `0` y `data-select-company` no incluyo la empresa QA. |
| Servicio de empresa no publicada no puede aprobarse desde UI | No validable por UI por el fallo anterior. |
| Servicio de empresa no publicada responde `409` desde API | PASS: `409`, `Company must be published before approving services`. |
| Upload de empresa no publicada no puede aprobarse | PASS: `409`, `Company must be published before approving uploads`. |
| Upload de servicio no publicado no puede aprobarse | PASS: despues de aprobar empresa y antes de aprobar servicio, `409`, `Service must be published before approving service uploads`. |
| Aprobar empresa no aprueba servicios/uploads automaticamente | PASS: servicio siguio `pending`; 3 uploads siguieron `pending`. |
| Aprobar servicio no aprueba uploads automaticamente | PASS: despues de aprobar servicio, 3 uploads siguieron `pending`. |
| Rechazos no hacen cascadas silenciosas | PASS API: al rechazar solo empresa del caso cascada, el servicio asociado siguio `pending` hasta rechazo explicito. |
| Mensajes UI claros | FAIL UI: no se pudo observar bloqueo contextual porque el expediente no cargo datos. |
| Desktop/mobile admin basico | Parcial: login y tab existen; expediente sin datos en desktop/mobile. |

## Evidencia API

Caso principal antes de moderar:

- Servicio: `pending`
- Uploads: 3 pendientes
- Tipos: `cover`, `gallery`, `gallery`

Secuencia validada:

```text
approve service before company -> 409
approve upload before company -> 409
approve company -> 200 published
service still pending after company approve -> true
uploads still pending after company approve -> 3
approve upload before service -> 409
approve service after company -> 200 published
uploads still pending after service approve -> 3
```

## Evidencia UI

En Azure autenticado, con `Modelo nuevo` activo:

```text
caseMarkup=1
companyCount=0
serviceCount=0
uploadCount=0
selectable=0
scopedServices=0
scopedUploads=0
```

Esto se observo aun creando empresa, servicio pendiente y uploads pendientes justo antes de abrir admin. La consola solo mostro un `404` no bloqueante, probablemente asset/favico.

## Riesgos / pendientes

- `P0` backend cerrado.
- `P1` admin UI no muestra pendientes reales en el expediente post-deploy; requiere revision de carga del tab `Modelo nuevo` o de los endpoints que consume la UI desde navegador.
- Las reglas de upload/API estan correctas por contrato, pero QA de bloqueo visual queda pendiente hasta corregir la UI.

## Recomendacion

Crear tarea Web/Admin para corregir la carga del expediente en `admin.js?v=13` y repetir solo la parte UI de `TASK-132`. No bloquear por API el cierre del P0 original de aprobacion fuera de orden.

