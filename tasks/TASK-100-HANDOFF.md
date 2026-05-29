# TASK-100 Handoff - QA Azure admin UI modelo nuevo

## Resultado general

Bloqueado.

El deploy de `admin.html` conectado al modelo nuevo esta visible en Azure, pero no fue posible completar la validacion autenticada porque la credencial admin local disponible en `local-secrets/qa-admin.ps1` no autentica contra Azure.

Resultado observado el 2026-05-29:

- `admin.html` carga correctamente.
- `admin.css?v=7` esta presente.
- `admin.js?v=10` esta presente.
- `admin.js?v=10` desplegado contiene los endpoints internos de moderacion nueva.
- Login con credencial invalida queda bloqueado.
- Login con la credencial admin local disponible queda bloqueado con `Unauthorized`.
- Los endpoints internos responden `401` sin credencial y tambien con la credencial local disponible.

No se aprobaron ni rechazaron Companies, Services ni Uploads reales.

## Ambiente

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Fecha de ejecucion:

```text
2026-05-29
```

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Deploy visible | PASS | `GET /admin.html` respondio `200`. |
| Cache busting CSS | PASS | HTML desplegado contiene `admin.css?v=7`; asset responde `200`. |
| Cache busting JS | PASS | HTML desplegado contiene `admin.js?v=10`; asset responde `200`. |
| JS nuevo desplegado | PASS | `admin.js?v=10` contiene `/internal/companies/pending`. |
| Login con credencial invalida | PASS | UI permanece en login y muestra `Unauthorized`; panel oculto. |
| Login con credencial admin local disponible | BLOCKED | UI permanece en login y muestra `Unauthorized`. |
| Legacy `Revision` autenticado | BLOCKED | No se pudo entrar al panel. |
| Boton `Actualizar` en `Revision` | BLOCKED | No se pudo entrar al panel. |
| Pestana `Modelo nuevo` autenticada | BLOCKED | No se pudo entrar al panel. |
| Listar Companies/Services/Uploads reales desde UI | BLOCKED | No se pudo entrar al panel. |
| Aprobar/rechazar Company QA | BLOCKED | Requiere login admin real valido. |
| Aprobar/rechazar Service QA | BLOCKED | Requiere login admin real valido. |
| Aprobar/rechazar Upload QA | BLOCKED | Requiere login admin real valido. |
| Console errors en pruebas ejecutadas | PASS parcial | Sin `console.error` durante carga/login fallido. |
| Responsive login mobile/desktop | PASS parcial | Sin overflow horizontal en pantalla de login. |

## Validacion API directa

Se cargo `local-secrets/qa-admin.ps1` de forma controlada, sin imprimir valores. El archivo local contiene valores para `ADMIN_USERNAME` y `ADMIN_PASSWORD`, pero esta en una sola linea con sintaxis PowerShell invalida para dot-source normal; por eso se parseo solo en memoria.

Prueba con la credencial local disponible:

| Endpoint | Resultado |
| --- | --- |
| `GET /api/internal/companies/pending` | `401` |
| `GET /api/internal/services/pending` | `401` |
| `GET /api/internal/uploads/pending` | `401` |
| `GET /api/providers?admin=pending-providers` | `401` |

Prueba sin credencial:

| Endpoint | Resultado |
| --- | --- |
| `GET /api/internal/companies/pending` | `401` |
| `GET /api/internal/services/pending` | `401` |
| `GET /api/internal/uploads/pending` | `401` |
| `GET /api/providers?admin=pending-providers` | `401` |

Nota adicional:

- `GET /api/admin/pending-providers` respondio `404`; la UI tiene fallback a `/api/providers?admin=pending-providers`, que si llega al handler y responde `401` cuando la credencial no autentica.

## Datos QA usados o creados

No se crearon datos QA nuevos.

No se modificaron datos existentes.

No se aprobaron ni rechazaron registros reales.

No se pegaron credenciales, tokens, cookies, invitaciones completas ni SAS.

## Campos prohibidos

PASS parcial.

Se verifico en assets publicos desplegados (`admin.html` y `admin.js?v=10`) y en el DOM visible de la pantalla de login que no aparecen:

```text
tokenHash
sessionHash
pendingBlobName
pendingBlobUrl
uploadUrl
sig=
AccountKey
connectionString
partitionKey
rowKey
cookie
pe_company_session
```

No se pudo confirmar contra tarjetas reales de Companies/Services/Uploads porque el login admin real quedo bloqueado.

## Evidencia responsive

Validacion en navegador sobre la pantalla de login:

| Viewport | Resultado | Medicion |
| --- | --- | --- |
| 390x844 | PASS parcial | `clientWidth=375`, `scrollWidth=375`, sin overflow horizontal. |
| 1366x768 | PASS parcial | `clientWidth=1351`, `scrollWidth=1351`, sin overflow horizontal. |

No se pudo validar responsive de la pestana `Modelo nuevo` autenticada por bloqueo de credencial.

## Riesgos pendientes

- La credencial admin local disponible esta desalineada con Azure o fue rotada sin actualizar `local-secrets/qa-admin.ps1`.
- Mientras el login admin no autentique, no se puede validar moderacion real desde UI.
- TASK-100 no puede aprobar el flujo de Product Owner completo hasta ejecutar acciones reales sobre al menos una Company, un Service y un Upload QA controlados.
- El endpoint legacy directo `/api/admin/pending-providers` devuelve `404`; no bloquea si el fallback `/api/providers?admin=pending-providers` funciona con credencial valida, pero conviene revisarlo si Product espera que `/api/admin/*` responda directamente.

## Recomendacion

Requiere Infra/Product antes de Web Dev:

1. Confirmar o rotar `ADMIN_PASSWORD` en Azure.
2. Actualizar `local-secrets/qa-admin.ps1` por canal seguro y corregir su formato PowerShell local.
3. Repetir TASK-100 desde el login real.

Cuando la credencial autentique, QA debe repetir:

- login valido;
- `Revision` legacy y boton `Actualizar`;
- `Modelo nuevo` con counts reales;
- approve/reject real de una Company QA, un Service QA y un Upload QA;
- DOM/HTML renderizado con datos reales sin campos prohibidos;
- responsive mobile/desktop de la pestana autenticada.

## Aviso

Termine TASK-100. Product/Architect debe leer tasks/TASK-100-HANDOFF.md.
