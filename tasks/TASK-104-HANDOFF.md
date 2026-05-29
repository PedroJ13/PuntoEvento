# TASK-104 Handoff - QA Azure admin UI despues de admin.js v11

## Resultado general

Requiere cambios.

`admin.html` ya autentica en Azure con `admin.js?v=11` y permite moderar Companies, Services y Uploads del modelo nuevo desde UI. Se aprobaron correctamente una Company, un Service y un Upload QA controlados.

El unico criterio requerido que falla es seguridad: el HTML renderizado del admin autenticado contiene `sig=` en `img src` del flujo legacy `Revision`. No aparece en las tarjetas del modelo nuevo, pero si queda en el DOM renderizado del admin, por lo que incumple la lista de campos prohibidos de la tarea.

No esta listo para prueba Product Owner completa hasta corregir o aceptar formalmente ese riesgo.

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

No se imprimieron usuario, password, headers completos, cookies, tokens ni SAS.

## Deploy visible

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| `GET /admin.html` | PASS | Responde `200`. |
| HTML contiene `admin.css?v=7` | PASS | Confirmado en asset desplegado. |
| HTML contiene `admin.js?v=11` | PASS | Confirmado en asset desplegado. |
| `admin.js?v=11` contiene `X-Punto-Admin-Credential` | PASS | Confirmado. |
| `admin.js?v=11` no contiene `Authorization:` | PASS | Confirmado. |

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Login con credencial invalida | PASS | UI queda en login, muestra `Unauthorized`, panel oculto. |
| Login con credencial valida | PASS | UI entra al panel; `Revision` queda activa. |
| Legacy `Revision` carga | PASS | Mostro `1 pendiente(s)` y 1 proveedor legacy. |
| Boton `Actualizar` en `Revision` | PASS | Refresca y mantiene `Lista actualizada.` |
| Abrir `Modelo nuevo` | PASS | Carga Companies, Services y Uploads. |
| Contadores iniciales modelo nuevo | PASS | Companies `5`, Services `4`, Uploads `7`, total `16`. |
| Tarjetas con datos permitidos | PASS parcial | Las tarjetas del modelo nuevo renderizan datos operativos permitidos. Seguridad global falla por `sig=` legacy. |
| Aprobar Company QA controlada | PASS | Feedback `Item aprobado.`; Companies baja de `5` a `4`; item sale de lista Companies. |
| Aprobar Service QA controlado | PASS | Feedback `Item aprobado.`; Services baja de `4` a `3`; item sale de lista Services. |
| Aprobar Upload QA controlado | PASS | Feedback `Item aprobado.`; Uploads baja de `7` a `6`; item sale de lista Uploads. |
| Refresh/listado post accion | PASS | Total baja de `16` a `13`; listas quedan actualizadas. |
| Console errors | PASS | Sin `console.error` ni excepciones runtime durante login, carga, acciones y responsive. |
| Responsive mobile 390x844 | PASS | Sin overflow horizontal en `Modelo nuevo`. |
| Responsive desktop 1366x768 | PASS | Sin overflow horizontal en `Modelo nuevo`. |
| Campos prohibidos | FAIL | `sig=` aparece en `img src` del DOM renderizado legacy. |

## Datos QA usados

Se usaron datos QA controlados existentes reportados por `TASK-102`:

| Tipo | Dato saneado | Accion |
| --- | --- | --- |
| Company | `QA TASK 100 Empresa 20260529164030` | Aprobada desde UI. |
| Service | `Servicio QA TASK 100 20260529164030` | Aprobado desde UI. |
| Upload | `task-100-cover.png` | Aprobado desde UI. |

IDs observados para trazabilidad interna saneada:

```text
company_a2bca3bb-b947-40f4-928c-9a2f5671de0d
service_d58de3ea-9f9c-46f9-937b-3f4cecc61ebf
upload_dce715cf-7e60-49f5-8b84-d77ce55c8ee2
```

No se crearon datos QA nuevos.

No se pegaron credenciales, cookies, tokens, invitaciones completas ni SAS.

## Campos prohibidos

Resultado: FAIL por `sig=`.

Verificacion:

| Campo | Resultado |
| --- | --- |
| `tokenHash` | No aparece. |
| `sessionHash` | No aparece. |
| `pendingBlobName` | No aparece. |
| `pendingBlobUrl` | No aparece. |
| `uploadUrl` | No aparece. |
| `sig=` | Aparece en HTML renderizado. |
| `AccountKey` | No aparece. |
| `connectionString` | No aparece. |
| `partitionKey` | No aparece. |
| `rowKey` | No aparece. |
| `cookie` | No aparece. |
| `pe_company_session` | No aparece. |

Origen saneado del `sig=`:

- Tres elementos `IMG`.
- Atributo afectado: `src`.
- Se originan en preview de imagenes legacy de `Revision`.
- El valor contiene una URL Blob con SAS de lectura; no se copia aqui por seguridad.
- Las tarjetas de `Modelo nuevo` no muestran `pendingBlobUrl`, `uploadUrl` ni SAS.

## Evidencia responsive

Validacion autenticada en pestana `Modelo nuevo` despues de las acciones:

| Viewport | Resultado | Medicion |
| --- | --- | --- |
| 390x844 | PASS | `clientWidth=375`, `scrollWidth=375`, sin overflow horizontal; panel visible; counts `4/3/6`. |
| 1366x768 | PASS | `clientWidth=1351`, `scrollWidth=1351`, sin overflow horizontal; panel visible; counts `4/3/6`. |

## Riesgos pendientes

- P1/P2 seguridad segun criterio de release: el admin autenticado renderiza SAS (`sig=`) en imagenes legacy. Aunque es interno y temporal, la tarea lo prohibe explicitamente.
- Uploads del modelo nuevo siguen sin preview visual, por alcance definido; no bloquea esta prueba.
- La autenticacion admin sigue siendo Basic Auth compartido para MVP controlado.

## Recomendacion

Requiere Web Dev/Backend/Infra para corregir el render legacy de imagenes con SAS en `Revision`, o Product/Architect debe aceptar formalmente el riesgo si se considera tolerable para MVP interno.

Una vez corregido o aceptado el riesgo, el flujo admin del modelo nuevo queda funcional desde navegador:

- login real;
- listados reales;
- approve real de Company, Service y Upload;
- refresh y feedback visibles;
- responsive mobile/desktop sin overflow.

## Aviso

Termine TASK-104. Product/Architect debe leer tasks/TASK-104-HANDOFF.md.
