# TASK-091: QA local panel empresa real

## Equipo asignado

QA.

## Contexto

`TASK-084` convirtio `panel.html` de demo local por defecto a panel real MVP para empresa autenticada por cookie de invitacion.

Antes de commit/push y QA Azure necesitamos validar localmente en navegador que:

- sin sesion muestra el estado correcto;
- `panel.html?demo=local` conserva modo demo;
- con sesion/mock API lista servicios reales;
- puede crear, editar, desactivar y subir cover usando los endpoints correctos;
- no expone cookies, SAS, tokens ni secretos.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `tasks/TASK-084-HANDOFF.md`
- `panel.html`
- `panel.css`
- `panel.js`
- `api/companies-me/index.js`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`
- `api/company-services-delete/index.js`
- `api/uploads-sign/index.js`
- `api/uploads-confirm/index.js`

## Objetivo

Validar localmente `panel.html` como panel real MVP antes de commit/push.

## Alcance de pruebas

### Sintaxis

Ejecutar:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check panel.js
```

### Sin sesion

Abrir:

```text
panel.html
```

Validar:

- Muestra `Necesitas abrir el enlace de invitacion para entrar al panel.`
- No lista servicios demo por defecto.
- No muestra datos sensibles.
- No hay errores JS no controlados.

### Demo local explicito

Abrir:

```text
panel.html?demo=local
```

Validar:

- Carga demo local.
- No llama APIs reales de empresa.
- Mantiene utilidad para demo/offline sin afectar modo real.

### Sesion/API mock

Usar mock/interception local para simular sesion valida y endpoints:

```text
GET /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
POST /api/uploads/sign
PUT <SAS>
POST /api/uploads/confirm
POST /api/company-auth/logout
```

Validar:

- Carga empresa autenticada.
- Lista servicios reales.
- Crea servicio y actualiza lista/estado.
- Edita servicio.
- Desactiva servicio.
- Sube cover usando sign + PUT SAS + confirm.
- Si upload falla despues de crear servicio, muestra error usable.
- Logout llama endpoint correcto y deja estado de no sesion.
- Link publico solo aparece para servicio `published`.

### Seguridad

Validar que la UI no renderiza:

```text
pe_company_session
token
sessionHash
tokenHash
sig=
sv=
uploadUrl
SAS
connection string
```

### Responsive

Validar:

```text
390 x 844
1366 x 768 o similar
```

Debe cumplirse:

- Sin overflow horizontal.
- Campos, botones y cards no se salen del contenedor.
- Textos de botones no se cortan.

## Riesgo conocido a observar

`TASK-084` indica que no existe endpoint explicito para enviar servicio a revision:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

QA debe reportar si la UI actual queda confusa para el usuario al guardar un servicio como `draft` o si el estado visible es suficientemente claro para MVP temporal.

## Fuera de alcance

- No probar Azure real.
- No hacer commit/push.
- No modificar codigo salvo que QA encuentre un bloqueo y Product/Architect lo reasigne.
- No validar admin/moderacion real.
- No crear endpoint `submit-review`.

## Entregable

Crear:

```text
tasks/TASK-091-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- URLs/locales usadas.
- Casos probados.
- Endpoints observados.
- Evidencia de seguridad/no secretos.
- Responsive.
- Bugs o riesgos.
- Recomendacion:
  - listo para commit/push y QA Azure;
  - o requiere ajuste Web Dev/Backend.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-091. Product/Architect debe leer tasks/TASK-091-HANDOFF.md.
```
