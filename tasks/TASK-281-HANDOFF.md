# TASK-281 HANDOFF

Equipo: QA

Tarea validada: `TASK-281` - QA Azure del panel empresa desde dominio propio por incidente de guardar/enviar servicio.

## Resultado final

Resultado: **no aprobado como cierre funcional completo / inconcluso para flujo autenticado**.

QA no pudo ejecutar el flujo completo autenticado porque no habia acceso controlado a una empresa QA, sesion activa, invite ni credenciales de empresa. Sin esa sesion no se puede validar:

- crear servicio;
- guardar;
- editar;
- subir portada;
- confirmar upload;
- enviar servicio a revision.

Lo que si se pudo comprobar:

- El panel carga en apex y `www`.
- Sin sesion, los endpoints privados principales responden `401 Unauthorized`, no `403`.
- No hay evidencia actual de que `ALLOWED_ORIGINS` este bloqueando los endpoints privados desde dominio propio.
- El usuario afectado reporto despues que **si logro completar/aprobar** el flujo. Esto reduce la probabilidad de un fallo permanente de origen/configuracion, pero no reemplaza evidencia QA con red/cookie controlada.

Recomendacion: **no abrir fix directo a Infra Azure con la evidencia actual**. Abrir/continuar como seguimiento QA/Product para obtener sesion controlada o HAR/redactado del usuario afectado. Si vuelve a fallar con status capturado, asignar segun la matriz de la tarea.

## Ambiente

- Apex: `https://puntoeventocr.com/panel.html`
- WWW: `https://www.puntoeventocr.com/panel.html`
- Hostname anterior comparativo: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Navegador: Chromium/Playwright headless y requests HTTP controlados.
- Fecha QA: `2026-06-09`.
- No se usaron credenciales, cookies reales, tokens, correos privados ni datos reales sensibles.
- No se crearon servicios ni uploads porque no habia sesion autenticada.

## Contexto revisado

- `TASK-281-assignment.md`.
- `docs/MVP_RELEASE_STATUS.md`.
- `tasks/TASK-280-HANDOFF.md`.
- `tasks/TASK-191-HANDOFF.md`.
- `tasks/TASK-208-HANDOFF.md`.
- `docs/API_CONTRACTS_MVP.md`.
- `chat-start/QA.md`.

`TASK-280` habia aprobado registro desde apex y `www`, pero no panel autenticado.

## Evidencia visible del panel sin sesion

### Apex

URL:

```text
https://puntoeventocr.com/panel.html
```

Resultado visible:

- `title`: `Panel empresa | Punto Evento CR`.
- `h1`: `Carga tus servicios`.
- Login visible: `Iniciar sesión`.
- Mensaje visible: `Ingresa con el correo y la contraseña activados para tu empresa.`
- `scrollWidth=1366`, `clientWidth=1366`.
- No habia cookie `pe_company_session`.

### WWW

URL:

```text
https://www.puntoeventocr.com/panel.html
```

Resultado visible:

- `title`: `Panel empresa | Punto Evento CR`.
- `h1`: `Carga tus servicios`.
- Login visible: `Iniciar sesión`.
- Mensaje visible: `Ingresa con el correo y la contraseña activados para tu empresa.`
- `scrollWidth=1366`, `clientWidth=1366`.
- No habia cookie `pe_company_session`.

## Tabla de endpoints observados

### Carga inicial sin sesion en navegador

| Dominio | Metodo | Endpoint | Status | Origin | Referer | Cookie `pe_company_session` | Response body |
|---|---:|---|---:|---|---|---|---|
| apex | GET | `/api/companies/me` | `401` | no aplica en GET navegador | `https://puntoeventocr.com/panel.html` | no enviada | `{"error":"Unauthorized"}` |
| apex | GET | `/api/companies/me/services` | `401` | no aplica en GET navegador | `https://puntoeventocr.com/panel.html` | no enviada | `{"error":"Unauthorized"}` |
| www | GET | `/api/companies/me` | `401` | no aplica en GET navegador | `https://www.puntoeventocr.com/panel.html` | no enviada | `{"error":"Unauthorized"}` |
| www | GET | `/api/companies/me/services` | `401` | no aplica en GET navegador | `https://www.puntoeventocr.com/panel.html` | no enviada | `{"error":"Unauthorized"}` |

### Requests privados sin cookie con `Origin` explicito

Estos requests se ejecutaron sin sesion para distinguir bloqueo de origen (`403`) vs autenticacion (`401`). No mutaron datos.

| Origin | Metodo | Endpoint | Status | Response body |
|---|---:|---|---:|---|
| `https://puntoeventocr.com` | POST | `/api/companies/me/services` | `401` | `{"error":"Unauthorized"}` |
| `https://puntoeventocr.com` | PATCH | `/api/companies/me/services/service_fake_task281` | `401` | `{"error":"Unauthorized"}` |
| `https://puntoeventocr.com` | POST | `/api/uploads/sign` | `401` | `{"error":"Unauthorized"}` |
| `https://puntoeventocr.com` | POST | `/api/uploads/confirm` | `401` | `{"error":"Unauthorized"}` |
| `https://puntoeventocr.com` | POST | `/api/companies/me/services/service_fake_task281/submit-review` | `401` | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | POST | `/api/companies/me/services` | `401` | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | PATCH | `/api/companies/me/services/service_fake_task281` | `401` en repeticion confirmatoria | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | POST | `/api/uploads/sign` | `401` | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | POST | `/api/uploads/confirm` | `401` | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | POST | `/api/companies/me/services/service_fake_task281/submit-review` | `401` | `{"error":"Unauthorized"}` |

Nota: un primer intento aislado de `PATCH` en `www` devolvio `500 Backend call failure`, pero la repeticion inmediata en `www`, apex y hostname viejo devolvio `401`. No se considera reproducido como fallo consistente.

### Comparativo PATCH sin cookie

| Host | Metodo | Endpoint | Status | Response body |
|---|---:|---|---:|---|
| `https://puntoeventocr.com` | PATCH | `/api/companies/me/services/service_fake_task281_repeat` | `401` | `{"error":"Unauthorized"}` |
| `https://www.puntoeventocr.com` | PATCH | `/api/companies/me/services/service_fake_task281_repeat` | `401` | `{"error":"Unauthorized"}` |
| `https://zealous-field-08fdd720f.7.azurestaticapps.net` | PATCH | `/api/companies/me/services/service_fake_task281_repeat` | `401` | `{"error":"Unauthorized"}` |

## Archivo probado

No se probo archivo real porque no se pudo iniciar sesion de empresa ni crear un servicio asociado.

Pendiente para la siguiente pasada autenticada:

- Extension: `.png` o `.jpg`.
- MIME: `image/png` o `image/jpeg`.
- Tamano: menor a 5 MB.

## Reporte externo del usuario afectado

Durante esta tarea, Product/usuario informo:

```text
El usuario reporto que si logro aprobar/completar.
```

Interpretacion QA:

- Es una senal operativa positiva.
- Sugiere que el incidente pudo ser transitorio, de sesion, de datos del formulario o de un paso puntual ya superado.
- No reemplaza evidencia de red con status, response body y cookie para cerrar formalmente el flujo completo.

## Hallazgos por severidad

### P0

- Ninguno.

### P1

- No reproducido por QA.
- El P1 candidato sigue **sin cierre funcional QA** porque no se pudo ejecutar el flujo autenticado completo.

### P2

- Falta acceso QA/controlado a empresa autenticada para validar panel real desde dominio propio.
- Sin HAR/redactado del usuario afectado no se puede clasificar el fallo original por status HTTP real.

### P3

- Los `401` iniciales al cargar panel sin sesion siguen apareciendo como ruido tecnico esperado; la UI muestra login correctamente.

## Clasificacion para siguientes equipos

Con evidencia actual:

- **Infra Azure**: no se recomienda tarea directa. Los endpoints privados no estan devolviendo `403` por origen; apex y `www` llegan a autenticacion.
- **Backend/API**: no se recomienda fix directo sin reproduccion autenticada. Si aparece `400`, `409`, `413`, `415` o `500` con sesion real, abrir tarea Backend/API con payload/response redactado.
- **Web Dev**: si el usuario ve error generico pese a response accionable, abrir tarea para mostrar detalle util sin exponer informacion tecnica.
- **QA/Product**: siguiente responsable inmediato para proveer sesion controlada, acceso de empresa afectada o HAR redactado.

## Recomendacion concreta

No cerrar como aprobado aun. Siguiente paso recomendado:

1. Product/QA provee una empresa QA autenticada o acceso controlado de la empresa afectada sin exponer secretos.
2. QA reintenta desde:
   - `https://puntoeventocr.com/panel.html`;
   - `https://www.puntoeventocr.com/panel.html`.
3. Capturar para cada accion:
   - endpoint;
   - metodo;
   - status;
   - response body;
   - `Origin`;
   - `Referer`;
   - si se envio cookie `pe_company_session` a `/api`.
4. Si el usuario afectado ya completo el flujo, solicitar captura/HAR redactado o confirmar monitoreo, y mantener NO-GO solo si vuelve a fallar.

## Checks ejecutados

```powershell
git rev-parse --show-toplevel
Get-Content -Path tasks/TASK-281-assignment.md -Raw
Get-Content -Path docs/MVP_RELEASE_STATUS.md -Raw
Get-Content -Path tasks/TASK-280-HANDOFF.md -Raw
Get-Content -Path chat-start/QA.md -Raw
Get-Content -Path docs/API_CONTRACTS_MVP.md -Raw
Get-Content -Path tasks/TASK-191-HANDOFF.md -Raw
Get-Content -Path tasks/TASK-208-HANDOFF.md -Raw
rg -n "company-auth/login|accept-invite|activate|password|panel empresa|owner|QA TASK" tasks docs -g "*.md"
Playwright Chromium sin sesion contra apex y www
Invoke-WebRequest sin cookie con Origin apex/www a endpoints privados
Invoke-WebRequest repetido de PATCH sin cookie en apex, www y hostname viejo
```
