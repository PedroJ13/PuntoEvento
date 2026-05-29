# TASK-102: Reintento QA Azure de admin UI con credencial corregida

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-100` confirmo que el deploy de `admin.html` conectado al modelo nuevo esta visible en Azure, pero quedo bloqueado porque la credencial admin local no autenticaba.

`TASK-101` resolvio ese bloqueo:

- `ADMIN_PASSWORD` fue rotado en Azure Static Web Apps.
- `local-secrets/qa-admin.ps1` quedo actualizado, ignorado por git y con formato PowerShell valido.
- `GET /api/internal/companies/pending` responde `200` con credencial valida.
- El mismo endpoint responde `401` con credencial invalida.

Ahora hay que repetir la validacion completa de `TASK-100` desde navegador contra Azure real.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-100-HANDOFF.md`
- `tasks/TASK-101-HANDOFF.md`
- `tasks/TASK-100-assignment.md`
- `admin.html`
- `admin.js`
- `admin.css`

## Base URL

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

## Objetivo

Validar en Azure real que el admin interno puede moderar Companies, Services y Uploads del modelo nuevo desde UI usando la credencial corregida.

## Preparacion

1. Cargar la credencial local con dot-source normal:

```powershell
. .\local-secrets\qa-admin.ps1
```

2. No imprimir usuario, password, headers completos, cookies, tokens ni SAS.
3. Si se necesita validar API directa, usar `X-Punto-Admin-Credential` igual que en `TASK-101`.

## Casos requeridos

Repetir los casos de `TASK-100`, con enfasis en lo que antes quedo bloqueado:

1. Deploy visible:
   - `admin.css?v=7` presente;
   - `admin.js?v=10` presente.
2. Login admin:
   - login con credencial admin valida;
   - credencial invalida no debe entrar.
3. Legacy:
   - pestana `Revision` sigue cargando sin romperse;
   - boton `Actualizar` sigue funcionando en `Revision`.
4. Pestana `Modelo nuevo`:
   - carga Companies pendientes desde Azure;
   - carga Services revisables desde Azure;
   - carga Uploads pendientes desde Azure;
   - muestra contadores reales;
   - muestra tarjetas con datos permitidos.
5. Acciones reales:
   - aprobar o rechazar al menos una Company QA controlada;
   - aprobar o rechazar al menos un Service QA controlado;
   - aprobar o rechazar al menos un Upload QA controlado.
6. Refresh:
   - despues de aprobar/rechazar, el item sale del listado o el listado se actualiza claramente;
   - feedback visible para admin.
7. Seguridad:
   - no aparecen campos prohibidos en DOM visible;
   - no aparecen campos prohibidos en HTML renderizado;
   - no hay `console.error` ni excepciones runtime.
8. Responsive:
   - mobile 390x844 sin overflow horizontal;
   - desktop 1366x768 sin overflow horizontal.

## Campos prohibidos

Confirmar que no aparecen:

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

## Datos QA

Usar datos QA controlados existentes cuando sea seguro.

Si necesitas crear datos nuevos:

- registrar una empresa QA para Company pending;
- usar invitacion/panel para crear Service draft/pending;
- subir/confirmar upload para Upload pending.

No pegar credenciales, tokens, cookies, invitaciones completas ni SAS en el handoff.

## Fuera de alcance

- Rotar nuevamente credenciales salvo que la credencial vuelva a fallar.
- Crear endpoint preview para uploads.
- Crear endpoint `submit-review`.
- Cambiar UX de rechazo de `window.prompt`.
- Cambiar pagina publica o panel empresa.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-102-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, requiere cambios o bloqueado.
- Casos ejecutados.
- Datos QA usados o creados, saneados.
- Confirmacion de campos prohibidos.
- Evidencia/resumen responsive.
- Riesgos pendientes.
- Recomendacion: listo para prueba Product Owner completa, o requiere Web Dev/Backend/Infra.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-102. Product/Architect debe leer tasks/TASK-102-HANDOFF.md.
```
