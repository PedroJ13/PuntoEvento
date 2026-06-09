# TASK-130: QA admin/API Round 2

## Estado

No aprobado en Azure. Aprobado solo como evidencia local del repo.

## Ambiente validado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`
- API Azure con credencial admin desde `local-secrets/qa-admin.ps1`, sin imprimir valores.
- Local repo con checks sintacticos y verificacion estructural.

## Resultado general

El codigo local contiene la vista por expediente y las reglas backend esperadas por `TASK-126` y `TASK-127`, pero Azure aun sirve la version anterior del admin/API.

En Azure:

- `admin.html` referencia `admin.js?v=12`.
- Antes de login no existe markup `data-company-case`.
- Con login admin valido aparece `Modelo nuevo`, pero no hay expediente por empresa.
- La vista autenticada mostro 24 acciones internas y 0 aprobaciones bloqueadas visualmente.
- La API permitio aprobar un servicio de una empresa pendiente: respuesta `200` con `status: "published"` en vez de `409`.

## Casos ejecutados

| Caso | Resultado |
| --- | --- |
| Admin selecciona empresa y ve servicios/uploads relacionados | FAIL Azure: no hay expediente `data-company-case`; PASS local estructural. |
| UI previene aprobar servicio de empresa no publicada | FAIL Azure: 0 acciones approve deshabilitadas en la vista autenticada. PASS local estructural. |
| API devuelve `409` al aprobar servicio de empresa no publicada | FAIL Azure: devolvio `200` y publico el servicio QA. PASS local por presencia de regla en `internalModeration.js`. |
| Upload de empresa no publicada no puede aprobarse | No ejecutado en Azure: la API desplegada ya fallo el bloqueo P0 anterior; PASS local estructural por regla. |
| Upload de servicio no publicado no puede aprobarse | No ejecutado en Azure: bloqueado por deploy viejo; PASS local estructural por regla. |
| Aprobar empresa no autoaprueba servicios/uploads | No ejecutado completo en Azure. |
| Aprobar servicio no autoaprueba uploads | No ejecutado completo en Azure. |
| Rechazos no cascaden silenciosamente | Parcial: se rechazo manualmente el servicio y empresa QA creados; no se observo cascada automatica en esa limpieza. |
| Mensajes UI claros | FAIL Azure para Round 2: no hay mensajes/bloqueos contextuales nuevos. PASS local estructural por textos de bloqueo. |
| Desktop/mobile basico | FAIL Azure por admin viejo; login funciona en desktop/mobile. PASS local estructural. |

## Datos QA creados y limpieza

Se creo una entidad minima para probar el bloqueo de API:

- Company: `company_45885a7d-d8c6-4842-82e7-80fff715ddae`
- Service: `service_a3163247-54e9-4ee0-8e2e-85b87819c805`

Resultado observado:

- Empresa inicial: `pending`
- Servicio inicial: `draft`
- `POST /api/internal/services/{companyId}/{serviceId}/approve`: `200`, `status: "published"`

Mitigacion ejecutada:

- `POST /api/internal/services/{companyId}/{serviceId}/reject`: `200`
- `POST /api/internal/companies/{companyId}/reject`: `200`

## Evidencia local

Checks sintacticos:

- `node --check admin.js`: OK.
- `node --check api/shared/internalModeration.js`: OK.
- `node --check api/uploads-sign/index.js`: OK.
- `node --check api/shared/publicCatalog.js`: OK.
- `node --check api/shared/serviceUploadRules.js`: OK.

Verificacion estructural local:

- `admin.html` contiene `data-company-case` y `data-case-company-list`.
- `admin.js` contiene bloqueo `Publica la empresa antes de aprobar servicios.`
- `admin.js` contiene bloqueo `Publica el servicio antes de aprobar imagenes de servicio.`
- `internalModeration.js` contiene respuestas `409` para empresa/servicio no publicados antes de aprobar.
- `uploads-sign/index.js` usa `validateServiceUploadCapacity`.

## Hallazgos

1. `P0` API Azure permite aprobacion fuera de orden de servicio con empresa pendiente.
2. `P1` Admin Azure no muestra expediente por empresa ni bloqueos visuales de Round 2.
3. `P1` Las reglas de uploads no pudieron validarse en Azure porque el deploy/API no corresponde al codigo local esperado.

## Recomendacion

No aprobar `TASK-130` para release en Azure. Primero desplegar el codigo local actual de admin/API, confirmar version servida, y repetir las pruebas de:

- `409` para servicio con empresa no publicada;
- `409` para upload con empresa no publicada;
- `409` para upload de servicio no publicado;
- expediente admin desktop/mobile con acciones bloqueadas y mensajes claros.

