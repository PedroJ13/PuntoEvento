# TASK-102 Handoff - Reintento QA Azure admin UI con credencial corregida

## Resultado general

Bloqueado.

La credencial corregida de `TASK-101` funciona contra Azure cuando se envia con:

```text
X-Punto-Admin-Credential: Basic <redacted>
```

Pero `admin.js?v=10` desplegado sigue enviando:

```text
Authorization: Basic <redacted>
```

Con la credencial vigente:

- `X-Punto-Admin-Credential` responde `200`.
- `Authorization` responde `401`.
- La UI de `admin.html` queda en login con `Unauthorized`.

Por eso no fue posible validar desde navegador real la pestana `Modelo nuevo` ni ejecutar approve/reject desde la UI.

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

Se cargo la credencial local con dot-source normal:

```powershell
. .\local-secrets\qa-admin.ps1
```

Resultado saneado:

```text
ADMIN_USERNAME_SET=True
ADMIN_PASSWORD_SET=True
```

No se imprimieron usuario, password, headers completos, cookies, tokens ni SAS.

## Casos ejecutados

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Deploy visible | PASS | `GET /admin.html` respondio `200`. |
| `admin.css?v=7` presente | PASS | HTML desplegado contiene `admin.css?v=7`. |
| `admin.js?v=10` presente | PASS | HTML desplegado contiene `admin.js?v=10`. |
| Credencial valida por API directa con `X-Punto-Admin-Credential` | PASS | `GET /api/internal/companies/pending` respondio `200`. |
| Credencial invalida por API directa | PASS heredado de `TASK-101`; no se reimprimio secreto. |
| Login UI con credencial invalida | PASS | UI queda en login y muestra `Unauthorized`; panel oculto. |
| Login UI con credencial admin valida | FAIL/BLOCKED | UI queda en login y muestra `Unauthorized`. |
| Legacy `Revision` carga autenticada | BLOCKED | Requiere login UI exitoso. |
| Boton `Actualizar` en `Revision` | BLOCKED | Requiere login UI exitoso. |
| Pestana `Modelo nuevo` carga Companies | BLOCKED por UI | API directa con header correcto lista Companies, pero UI no puede autenticarse. |
| Pestana `Modelo nuevo` carga Services | BLOCKED por UI | API directa con header correcto lista Services, pero UI no puede autenticarse. |
| Pestana `Modelo nuevo` carga Uploads | BLOCKED por UI | API directa con header correcto lista Uploads, pero UI no puede autenticarse. |
| Contadores reales en UI | BLOCKED | Requiere login UI exitoso. |
| Tarjetas con datos permitidos en UI | BLOCKED | Requiere login UI exitoso. |
| Aprobar/rechazar Company QA desde UI | BLOCKED | No se ejecuto por bloqueo de login. |
| Aprobar/rechazar Service QA desde UI | BLOCKED | No se ejecuto por bloqueo de login. |
| Aprobar/rechazar Upload QA desde UI | BLOCKED | No se ejecuto por bloqueo de login. |
| Refresh post accion | BLOCKED | No se ejecutaron acciones UI. |
| Feedback visible post accion | BLOCKED | No se ejecutaron acciones UI. |
| Console errors | PASS parcial | Sin `console.error` durante carga/login fallido/responsive de login. |
| Responsive login mobile/desktop | PASS parcial | Sin overflow horizontal en pantalla de login. |

## Diagnostico del bloqueo

Prueba API directa con la misma credencial vigente:

| Header usado | Endpoint | Resultado |
| --- | --- | --- |
| `Authorization: Basic <redacted>` | `GET /api/internal/companies/pending` | `401` |
| `X-Punto-Admin-Credential: Basic <redacted>` | `GET /api/internal/companies/pending` | `200` |

Revision de asset desplegado:

```text
admin.js?v=10 usa Authorization: true
admin.js?v=10 usa X-Punto-Admin-Credential: false
```

Conclusion QA:

La credencial ya esta corregida, pero la UI desplegada no usa el header que Azure/API acepta actualmente.

## Datos QA observados

No se crearon datos QA nuevos.

No se modificaron datos existentes.

No se aprobaron ni rechazaron registros reales.

Con API directa y header correcto se observaron pendientes saneados:

| Tipo | Count |
| --- | ---: |
| Companies pending | 5 |
| Services revisables | 4 |
| Uploads pending | 7 |

Ejemplos QA controlados disponibles para repetir despues del fix:

- Company: `QA TASK 100 Empresa 20260529164030`.
- Service: `Servicio QA TASK 100 20260529164030`.
- Upload: `task-100-cover.png`.

No se pegaron credenciales, tokens, cookies, invitaciones completas ni SAS.

## Campos prohibidos

PASS parcial.

Se verifico que los assets desplegados `admin.html`, `admin.js?v=10`, `admin.css?v=7` y el DOM visible de la pantalla de login no contienen:

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

Tambien se verificaron las respuestas API directas de:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Resultado: no contienen campos prohibidos.

No se pudo confirmar el HTML renderizado de tarjetas reales porque la UI no entra al panel.

## Evidencia responsive

Validacion en navegador sobre la pantalla de login:

| Viewport | Resultado | Medicion |
| --- | --- | --- |
| 390x844 | PASS parcial | `clientWidth=375`, `scrollWidth=375`, sin overflow horizontal. |
| 1366x768 | PASS parcial | `clientWidth=1351`, `scrollWidth=1351`, sin overflow horizontal. |

No se pudo validar responsive de `Revision` ni `Modelo nuevo` autenticados por bloqueo de login UI.

## Riesgos pendientes

- P1: `admin.html` no puede autenticarse en Azure mientras envie `Authorization` si Azure/API solo acepta `X-Punto-Admin-Credential`.
- Product Owner sigue bloqueado para prueba completa desde navegador.
- No se validaron acciones reales de moderacion desde UI.
- Los datos QA pendientes existen y son suficientes para reintento, pero no deben tocarse por API directa si la tarea es validar UI.

## Recomendacion

Requiere Web Dev/Backend/Infra antes de repetir QA:

1. Alinear `admin.js` para enviar la credencial admin con `X-Punto-Admin-Credential`, o configurar Azure/API para aceptar `Authorization` en la ruta desplegada.
2. Desplegar el cambio.
3. Repetir `TASK-102` desde navegador.

No esta listo para prueba Product Owner completa.

## Aviso

Termine TASK-102. Product/Architect debe leer tasks/TASK-102-HANDOFF.md.
