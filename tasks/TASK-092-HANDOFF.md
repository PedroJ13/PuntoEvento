# TASK-092 Handoff - QA Azure panel empresa real

## Objetivo

Validar en Azure el panel real de empresa autenticada en:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html
```

Alcance cubierto:

- Sin sesion.
- Demo local explicito.
- Aceptacion de invitacion real.
- Carga de empresa autenticada.
- Listado real de servicios.
- Crear, editar y desactivar servicio.
- Upload de cover con SAS + confirmacion.
- Logout.
- Seguridad visual sin secretos.
- Responsive 390x844 y 1366x768.

## Resultado general

PASS.

`panel.html` desplegado en Azure queda aprobado para el alcance QA de TASK-092.

No se encontraron bugs P0/P1.

## Deploy visible

- `GET /panel.html`: 200.
- `panel.css?v=3`: visible en HTML desplegado.
- `panel.js?v=3`: visible en HTML desplegado.

No se valido commit SHA desde Azure porque la pagina desplegada no expone metadato de build/commit.

## Datos QA creados

Datos saneados para trazabilidad:

- `companyId`: `company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d`
- `companySlug`: `qa-task-092-empresa-20260529132722`
- `serviceId`: `service_a14948f8-e889-46b5-865c-4ffbbb786999`
- `serviceSlug`: `servicio-qa-task-092-20260529132722-editado`
- `uploadId`: `upload_5933778d-14d9-4618-bab2-2a432b3c015a`

No se documentan ni se pegan:

- URL completa de invitacion.
- Token de invitacion.
- Cookie de sesion.
- URL SAS.
- Credenciales admin.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Sin sesion | PASS | Muestra `Necesitas abrir el enlace de invitacion para entrar al panel.` |
| Sin sesion sin demo default | PASS | No muestra `Queques personalizados` ni `Mesa dulce`. |
| Demo local explicito | PASS | `panel.html?demo=local` carga demo y no llama APIs reales de empresa. |
| Crear invitacion interna controlada | PASS | `POST /api/internal/company-invites` respondio 201. |
| Aceptar invitacion | PASS | URL limpia token despues de aceptar; sesion queda activa. |
| Cargar empresa autenticada | PASS | `GET /api/companies/me` respondio 200 con la empresa QA. |
| Listar servicios reales | PASS | `GET /api/companies/me/services` respondio 200; estado vacio visible al inicio. |
| Crear servicio con cover | PASS | Servicio creado desde UI real. |
| Upload cover | PASS | `sign` 200, `PUT <SAS>` 201, `confirm` 201. |
| Editar servicio | PASS | Servicio renombrado y slug actualizado. |
| Desactivar servicio | PASS | Servicio queda `inactive`. |
| Logout | PASS | `POST /api/company-auth/logout` 200; luego `GET /api/companies/me` respondio 401. |

## Endpoints observados

| Endpoint | Metodo | Status observado |
| --- | --- | --- |
| `/api/company-auth/accept-invite` | POST | 200 |
| `/api/companies/me` | GET | 401 sin sesion, 200 con sesion, 401 despues de logout |
| `/api/companies/me/services` | GET | 401 sin sesion, 200 con sesion |
| `/api/companies/me/services` | POST | 201 |
| `/api/companies/me/services/{serviceId}` | PATCH | 200 |
| `/api/companies/me/services/{serviceId}` | DELETE | 200 |
| `/api/uploads/sign` | POST | 200 |
| `<SAS redacted>` | PUT | 201 |
| `/api/uploads/confirm` | POST | 201 |
| `/api/company-auth/logout` | POST | 200 |

## Seguridad / no secretos

PASS.

No se renderizaron en UI:

- `pe_company_session`
- `token`
- `sessionHash`
- `tokenHash`
- `sig=`
- `sv=`
- `uploadUrl`
- `AccountKey`
- connection string

Notas:

- La URL SAS existio en Network como parte esperada del upload, pero no se renderizo en UI ni se documenta.
- No hubo `console.error`.
- No hubo `Runtime.exceptionThrown`.

## Responsive

PASS en mobile:

- Viewport: 390x844.
- `clientWidth`: 390.
- `scrollWidth`: 390.
- Sin overflow horizontal.
- Sin secretos visibles.

PASS en desktop:

- Viewport: 1366x768.
- `clientWidth`: 1351.
- `scrollWidth`: 1351.
- Sin overflow horizontal.
- Sin secretos visibles.

## Riesgos

- El panel no tiene endpoint explicito `POST /api/companies/me/services/{serviceId}/submit-review`. La UI actual explica que al guardar el servicio el equipo lo revisa desde admin interno; suficiente para MVP controlado, pero sigue siendo decision de Product/Architect.
- El upload confirmado queda pendiente de moderacion. La imagen no sera publica hasta que exista/aplique el flujo admin de aprobacion.
- La empresa/servicio QA quedan en Azure como datos de prueba; el servicio validado quedo `inactive`.
- La prueba no cubrio visual publico post-aprobacion de la imagen, porque la aprobacion admin queda fuera del alcance de TASK-092.

## Pendientes

- Crear UI admin interna para moderar Companies, Services y Uploads del modelo nuevo.
- Decidir si MVP requiere endpoint explicito para enviar servicio a revision.
- Ejecutar prueba visual publica de imagen despues de aprobar un upload real.
- Definir politica de limpieza o lifecycle para datos QA/invitaciones/uploads de prueba.

## Recomendacion para Product/Architect

Avanzar con la UI admin interna de moderacion.

Mantener como decision abierta si el MVP acepta el flujo temporal `draft + copy de revision` o si se crea una tarea para endpoint/estado explicito de envio a revision.
