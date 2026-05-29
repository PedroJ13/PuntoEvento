# TASK-104: QA Azure de admin UI despues de `admin.js?v=11`

## Equipo asignado

QA / Infra Azure.

## Dependencia

Esperar a que Azure Static Web Apps despliegue el commit que incluye:

```text
admin.html -> admin.js?v=11
admin.js -> X-Punto-Admin-Credential
```

## Contexto

`TASK-102` quedo bloqueado porque la UI desplegada enviaba `Authorization`, aunque la credencial admin funcionaba por API con `X-Punto-Admin-Credential`.

`TASK-103` corrigio `admin.js` para usar:

```text
X-Punto-Admin-Credential: Basic <redacted>
```

y actualizo el cache busting en `admin.html` a:

```text
admin.js?v=11
```

Ahora hay que repetir la validacion Azure desde navegador real.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-102-HANDOFF.md`
- `tasks/TASK-103-HANDOFF.md`
- `tasks/TASK-100-assignment.md`
- `tasks/TASK-102-assignment.md`
- `admin.html`
- `admin.js`
- `admin.css`

## Base URL

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

## Objetivo

Validar que `admin.html` autentica en Azure y permite moderar Companies, Services y Uploads del modelo nuevo desde UI.

## Preparacion

1. Esperar deploy exitoso en Azure.
2. Cargar credencial local con:

```powershell
. .\local-secrets\qa-admin.ps1
```

3. No imprimir usuario, password, headers completos, cookies, tokens ni SAS.

## Casos requeridos

1. Deploy visible:
   - `GET /admin.html` responde `200`;
   - HTML contiene `admin.css?v=7`;
   - HTML contiene `admin.js?v=11`;
   - `admin.js?v=11` contiene `X-Punto-Admin-Credential`;
   - `admin.js?v=11` no contiene `Authorization:`.
2. Login admin:
   - login con credencial valida entra al panel;
   - login con credencial invalida queda bloqueado.
3. Legacy:
   - pestana `Revision` carga;
   - boton `Actualizar` funciona.
4. Pestana `Modelo nuevo`:
   - carga Companies pendientes;
   - carga Services revisables;
   - carga Uploads pendientes;
   - muestra contadores reales;
   - muestra tarjetas con datos permitidos.
5. Acciones reales:
   - aprobar o rechazar al menos una Company QA controlada;
   - aprobar o rechazar al menos un Service QA controlado;
   - aprobar o rechazar al menos un Upload QA controlado.
6. Refresh y feedback:
   - el item sale del listado o el listado se actualiza claramente;
   - hay feedback visible para admin.
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

`TASK-102` reporto datos QA pendientes disponibles:

- Company: `QA TASK 100 Empresa 20260529164030`.
- Service: `Servicio QA TASK 100 20260529164030`.
- Upload: `task-100-cover.png`.

Usar esos datos si siguen disponibles. Si ya no estan, crear datos QA controlados nuevos.

## Fuera de alcance

- Rotar credenciales.
- Cambiar codigo.
- Crear endpoint `submit-review`.
- Cambiar pagina publica o panel empresa.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-104-HANDOFF.md
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
Termine TASK-104. Product/Architect debe leer tasks/TASK-104-HANDOFF.md.
```
