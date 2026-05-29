# TASK-122 Handoff - Soft cleanup de datos QA Azure

## Resultado general

Aprobado.

Product / Architect / Release aprobo explicitamente ejecutar soft cleanup en el mensaje de asignacion. Se rechazaron las entidades QA/pre-demo objetivo mediante endpoints internos, sin hard delete.

No se hizo commit ni push.

## Aprobacion recibida

Confirmada por usuario:

```text
Apruebo ejecutar soft cleanup de datos QA Azure segun TASK-122.
```

## Inventario antes

Consulta previa contra endpoints internos:

```text
Fecha UTC: 2026-05-29T22:36:51Z
Base URL: https://zealous-field-08fdd720f.7.azurestaticapps.net
Auth: X-Punto-Admin-Credential <redacted>
```

Totales antes:

| Cola | Total pendiente | Objetivo cleanup |
| --- | ---: | ---: |
| Companies | 7 | 4 |
| Services | 9 | 7 |
| Uploads | 5 | 0 |

Empresas objetivo:

| Company ID | Nombre | Estado antes |
| --- | --- | --- |
| `company_96f18439-db71-4621-92a4-c476368a666d` | `Pre Demo Owner Smoke 1780093358` | `pending` |
| `company_e09fd79d-078f-4ee6-83df-b04bd9a9f6b0` | `QA TASK-114 Estado Envio 1780089144348` | `pending` |
| `company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82` | `QA TASK-114 Otra Empresa 20260529210924` | `pending` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `QA TASK-114 Doble Submit 20260529210616` | `pending` |

Servicios objetivo:

| Company ID | Service ID | Nombre | Estado antes |
| --- | --- | --- | --- |
| `company_96f18439-db71-4621-92a4-c476368a666d` | `service_955e814c-baa3-4a7f-83c7-66abf3a8f72d` | `Pre Demo Servicio Smoke 1780093358` | `pending` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_6e4c6e2b-9d2a-4d34-8198-46f1eb38b72d` | `QA TASK-117 1780090739740 Mesa dulce UI` | `pending` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_c51d78b1-69bd-490a-a9be-51721f508c4a` | `QA TASK-117 1780090739740 Incompleto` | `draft` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_58c898fa-225f-40d2-a710-1e2addba0a92` | `QA TASK-117 1780090671429 Mesa dulce UI` | `pending` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_9691671e-4611-46df-b53c-f87c281e7637` | `QA TASK-117 1780090671429 Incompleto` | `draft` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_c0543bb2-df73-47a0-bc24-db64f1f74741` | `QA TASK-115 Incompleto 1780089046` | `draft` |
| `company_e04c0711-14ae-42b0-8607-acbea4cdb252` | `service_edb4e73e-dd26-4aa2-9601-5b614b26e465` | `QA TASK-115 Mesa Dulce 1780089046` | `pending` |

Uploads objetivo:

```text
0
```

## Acciones ejecutadas

Se ejecuto soft cleanup usando:

```text
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/companies/{companyId}/reject
```

Body saneado:

```json
{ "reason": "Limpieza QA pre-demo TASK-122" }
```

Servicios rechazados:

```text
7/7 -> HTTP 200, status rejected
```

Empresas rechazadas:

```text
4/4 -> HTTP 200, status rejected
```

No ejecutado:

```text
Hard delete: no
Uploads reject: no, no habia uploads objetivo
Invitaciones delete: no
Sesiones delete: no
Blob delete: no
Codigo/UI: sin cambios
```

No se imprimieron credenciales, headers completos, cookies, tokens ni secretos.

## Inventario despues

Totales despues:

| Cola | Total pendiente despues | Objetivo restante |
| --- | ---: | ---: |
| Companies | 3 | 0 |
| Services | 2 | 0 |
| Uploads | 5 | 0 |

Validacion de remanentes objetivo:

```text
remainingTargetCompanyCount: 0
remainingTargetServiceCount: 0
remainingTargetUploadCount: 0
```

Validacion publica:

| Query publica | Status | Resultados |
| --- | ---: | ---: |
| `QA TASK-114` | 200 | 0 |
| `QA TASK-115` | 200 | 0 |
| `QA TASK-117` | 200 | 0 |
| `Pre Demo Owner Smoke` | 200 | 0 |

## Datos no limpiados

Se conservaron por alcance:

- Invitaciones relacionadas.
- Sesiones relacionadas.
- Evidencia historica en tablas con estado `rejected`.
- 3 empresas pendientes no objetivo.
- 2 servicios pendientes no objetivo.
- 5 uploads pendientes no objetivo.

No se borraron blobs porque no habia blobs/uploads objetivo y la tarea prohibe hard delete.

## Riesgos

- Los datos QA/pre-demo siguen existiendo en Storage con estado `rejected`; esto es intencional para no perder evidencia.
- Si Product/Release quiere limpieza total, se requiere tarea separada de hard cleanup con respaldo previo y aprobacion explicita.
- Quedan pendientes globales no objetivo; QA debe verificar si corresponden a la empresa demo limpia o a otros datos recientes.
- Las invitaciones/sesiones viejas no se borraron. No deberian aparecer en UI, pero siguen en storage.

## Recomendacion para QA/pre-demo

Repetir verificacion pre-demo enfocada:

- Admin global ya no deberia mostrar `QA TASK-114`, `QA TASK-115`, `QA TASK-117` ni `Pre Demo Owner Smoke`.
- Pagina publica ya confirmo 0 resultados para esos prefijos.
- Si los 3 Companies / 2 Services / 5 Uploads restantes no pertenecen al guion demo, abrir inventario adicional antes de una demo admin totalmente limpia.
- Para Product Owner, usar solo la empresa definida en `docs/PRODUCT_OWNER_TEST_SCRIPT.md`: `Demo Owner Jardines del Sol`.
