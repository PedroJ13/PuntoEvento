# TASK-092: QA Azure panel empresa real

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-091` aprobo localmente `panel.html` conectado a auth/API real con mocks y responsive.

Product/Architect debe hacer commit/push antes de ejecutar esta tarea. Espera a que Azure Static Web Apps termine el deploy del commit que modifica:

- `panel.html`
- `panel.css`
- `panel.js`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-084-HANDOFF.md`
- `tasks/TASK-091-HANDOFF.md`
- `panel.html`
- `panel.css`
- `panel.js`
- `tools/test-company-invite-flow.ps1`

## Objetivo

Validar en Azure real que `panel.html` funciona como panel MVP de empresa autenticada:

- acepta invitacion;
- carga empresa autenticada;
- lista servicios reales;
- crea, edita y desactiva servicios;
- sube cover con SAS + confirm;
- cierra sesion;
- no expone secretos en UI.

## Ambiente

Base Azure:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Ruta:

```text
/panel.html
```

## Precondicion

Confirmar que el deploy nuevo esta activo:

- `panel.html` referencia `panel.css?v=3` y `panel.js?v=3` o superior.
- Sin sesion, `panel.html` muestra:

```text
Necesitas abrir el enlace de invitacion para entrar al panel.
```

## Datos QA

Puedes crear o reutilizar una empresa QA `pending/free` del flujo nuevo.

Si necesitas acceso:

1. Crear invitacion interna con credencial admin local segura.
2. Abrir el enlace de invitacion en navegador normal o in-app browser.
3. Confirmar que la URL limpia el token despues de aceptar.

No escribir token, cookie, invite URL completa, SAS ni credenciales en el handoff.

## Alcance de pruebas

### Sin sesion

Abrir:

```text
/panel.html
```

Validar:

- Muestra estado de no sesion.
- No lista servicios demo por defecto.
- No muestra secretos.

### Demo local explicito

Abrir:

```text
/panel.html?demo=local
```

Validar:

- Carga demo local.
- No llama APIs reales de empresa.

### Sesion real

Con invitacion aceptada:

- `GET /api/companies/me` responde `200`.
- `GET /api/companies/me/services` responde `200`.
- El panel muestra nombre/estado de empresa.
- Lista servicios reales o estado vacio real.

### CRUD servicios

Validar:

- Crear servicio real.
- Editar servicio real.
- Desactivar servicio real.
- Los endpoints usados son:

```text
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
```

### Upload cover

Subir una imagen QA pequena y valida.

Validar endpoints:

```text
POST /api/uploads/sign
PUT <SAS>
POST /api/uploads/confirm
```

Validar:

- La UI muestra mensaje claro.
- No renderiza `uploadUrl`, `sig=`, `sv=` ni SAS.
- Si queda pendiente de moderacion, el estado/copy lo explica.

### Logout

Validar:

- `POST /api/company-auth/logout`.
- Despues de logout, `GET /api/companies/me` no permite ver datos.
- UI vuelve a estado de no sesion.

### Responsive y seguridad

Validar:

```text
390 x 844
1366 x 768 o similar
```

Debe cumplirse:

- Sin overflow horizontal.
- Sin errores JS no controlados.
- No renderiza:
  - `pe_company_session`
  - `token`
  - `sessionHash`
  - `tokenHash`
  - `sig=`
  - `sv=`
  - `uploadUrl`
  - `AccountKey`
  - connection string

## Riesgo conocido

No existe endpoint explicito:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Validar si el copy actual es suficiente para que una empresa entienda que debe guardar el servicio y esperar revision.

## Fuera de alcance

- No probar admin/moderacion visual nuevo.
- No crear endpoint `submit-review`.
- No hacer commit/push.
- No borrar datos reales.

## Entregable

Crear:

```text
tasks/TASK-092-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- Commit/deploy validado si lo tienes visible.
- Datos QA creados: companySlug, serviceSlug/id, uploadId si aplica, sin secretos.
- Casos probados y endpoints observados.
- Evidencia de seguridad/no secretos.
- Responsive.
- Bugs o riesgos.
- Recomendacion:
  - listo para avanzar a admin UI;
  - o requiere ajuste Web Dev/Backend.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-092. Product/Architect debe leer tasks/TASK-092-HANDOFF.md.
```
