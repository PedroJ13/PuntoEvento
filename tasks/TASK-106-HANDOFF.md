# TASK-106 Handoff - QA Azure admin UI sin sig en DOM

## Resultado general

Aprobado.

`admin.html` desplegado en Azure con `admin.js?v=12` funciona correctamente y ya no renderiza `sig=` ni URLs sensibles en el DOM autenticado.

Se valido:

- deploy visible de `admin.js?v=12`;
- login admin valido e invalido;
- legacy `Revision` con placeholders seguros;
- checkbox legacy `data-image-id` conservado;
- `Modelo nuevo` con Companies, Services y Uploads reales;
- acciones reales de approve para una Company, un Service y un Upload QA;
- ausencia de campos prohibidos en `Revision`, `Modelo nuevo`, mobile y desktop;
- responsive mobile/desktop sin overflow horizontal;
- sin `console.error` ni excepciones runtime.

## Ambiente

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

Fecha de ejecucion:

```text
2026-05-29
```

## Preparacion

Credencial local cargada con dot-source normal:

```powershell
. .\local-secrets\qa-admin.ps1
```

Confirmacion saneada:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se imprimieron usuario, password, headers completos, cookies, tokens, invitaciones completas ni SAS.

## Deploy visible

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| `GET /admin.html` | PASS | Responde `200`. |
| HTML contiene `admin.css?v=7` | PASS | Confirmado en asset desplegado. |
| HTML contiene `admin.js?v=12` | PASS | Confirmado en asset desplegado. |
| `admin.js?v=12` contiene `X-Punto-Admin-Credential` | PASS | Confirmado. |
| `admin.js?v=12` no contiene `Authorization:` | PASS | Confirmado. |
| `admin.js?v=12` no renderiza `image.previewUrl` legacy | PASS | `image.previewUrl=False`; placeholder legacy presente. |

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Login con credencial invalida | PASS | UI queda en login, muestra `Unauthorized`, panel oculto. |
| Login con credencial valida | PASS | UI entra al panel; `Revision` activa. |
| Legacy `Revision` carga | PASS | Mostro `1 pendiente(s)` y 1 proveedor legacy. |
| Placeholder legacy seguro | PASS | 3 placeholders `.admin-image-placeholder`; 0 `<img>` en lista legacy. |
| Checkbox `data-image-id` legacy | PASS | 3 checkboxes presentes. |
| Boton `Actualizar` en `Revision` | PASS | Refresca y mantiene `Lista actualizada.` |
| Seguridad DOM en `Revision` | PASS | No aparece ningun campo prohibido, incluido `sig=`. |
| Abrir `Modelo nuevo` | PASS | Carga Companies, Services y Uploads. |
| Contadores iniciales modelo nuevo | PASS | Companies `4`, Services `3`, Uploads `6`, total `13`. |
| Tarjetas modelo nuevo | PASS | Renderizan datos permitidos y no exponen campos prohibidos. |
| Aprobar Company QA controlada | PASS | Feedback `Item aprobado.`; Companies baja de `4` a `3`; item sale de lista. |
| Aprobar Service QA controlado | PASS | Feedback `Item aprobado.`; Services baja de `3` a `2`; item sale de lista. |
| Aprobar Upload QA controlado | PASS | Feedback `Item aprobado.`; Uploads baja de `6` a `5`; item sale de lista. |
| Seguridad DOM post-acciones | PASS | No aparece ningun campo prohibido, incluido `sig=`. |
| Console errors | PASS | `0` errores de consola. |
| Responsive mobile 390x844 | PASS | Sin overflow horizontal. |
| Responsive desktop 1366x768 | PASS | Sin overflow horizontal. |

## Datos QA usados

No se crearon datos QA nuevos.

Se usaron datos QA controlados existentes:

| Tipo | Dato saneado | Accion |
| --- | --- | --- |
| Company | `QA TASK 092 Empresa 20260529132722` | Aprobada desde UI. |
| Service | `QA Patch Duplicate 20260528-20260528-090858` | Aprobado desde UI. |
| Upload | `task-092-cover.png` | Aprobado desde UI. |

IDs saneados para trazabilidad:

```text
company_72bca9dd-08d9-4824-974d-ac0d4ee8a05d
service_1f8d9895-5006-480a-9ef2-c480db2caedc
upload_5933778d-14d9-4618-bab2-2a432b3c015a
```

Counts despues de acciones:

```text
Companies: 3
Services: 2
Uploads: 5
Total modelo nuevo: 10
```

## Campos prohibidos

PASS.

Se verifico en DOM renderizado autenticado de `Revision`, `Modelo nuevo`, mobile y desktop:

| Campo | Resultado |
| --- | --- |
| `tokenHash` | No aparece. |
| `sessionHash` | No aparece. |
| `pendingBlobName` | No aparece. |
| `pendingBlobUrl` | No aparece. |
| `uploadUrl` | No aparece. |
| `sig=` | No aparece. |
| `AccountKey` | No aparece. |
| `connectionString` | No aparece. |
| `partitionKey` | No aparece. |
| `rowKey` | No aparece. |
| `cookie` | No aparece. |
| `pe_company_session` | No aparece. |

Notas:

- `Revision` legacy renderizo 3 placeholders seguros y 0 `<img>` dentro de `data-provider-list`.
- `Modelo nuevo` no expone URLs de upload ni SAS.

## Evidencia responsive

Validacion autenticada en pestana `Modelo nuevo` despues de las acciones:

| Viewport | Resultado | Medicion |
| --- | --- | --- |
| 390x844 | PASS | `clientWidth=375`, `scrollWidth=375`, sin overflow horizontal; panel visible; counts `3/2/5`; sin campos prohibidos. |
| 1366x768 | PASS | `clientWidth=1351`, `scrollWidth=1351`, sin overflow horizontal; panel visible; counts `3/2/5`; sin campos prohibidos. |

## Riesgos pendientes

- Uploads del modelo nuevo siguen sin preview visual, por alcance definido; no bloquea TASK-106.
- La autenticacion admin sigue siendo Basic Auth compartido para MVP controlado; deberia endurecerse antes de operacion amplia.
- Quedan datos QA pendientes en Azure; conviene definir politica de limpieza cuando Product/Architect lo considere.

## Recomendacion

Listo para prueba Product Owner completa del flujo admin interno conectado al modelo nuevo, condicionado a que Product/Architect acepte los riesgos MVP ya documentados fuera de TASK-106.

## Aviso

Termine TASK-106. Product/Architect debe leer tasks/TASK-106-HANDOFF.md.
