# TASK-028: Infra investigar 404 endpoint admin invitaciones

## Equipo

Infra Azure.

## Estado

Completada con causa probable identificada.

## Resultado general

Se investigo por que:

```text
POST /api/admin/company-invites
```

responde `404` en Azure aunque `origin/main` contiene:

```text
205ed30 Add admin company invite endpoint
```

Hallazgo principal:

```text
El workflow de GitHub Actions si corrio contra 205ed30 y Azure Static Web Apps si empaqueto/desplego la API.
Azure Resource Manager lista la Function admin-company-invites dentro del build default.
Pero todas las Functions cuyo nombre/ruta empieza con admin responden 404 en Azure.
```

Causa probable:

```text
Conflicto con la palabra reservada admin en Azure Functions runtime.
```

Evidencia externa consultada:

- Microsoft Learn confirma que las HTTP Functions son accesibles por `/api/<FUNCTION_NAME>` o por la propiedad `route` del trigger.
- Referencias de comunidad documentan que nombres o rutas que empiezan con `admin` pueden devolver 404/conflictar porque `admin` esta reservado por el host runtime de Azure Functions.

No se usaron credenciales admin.
No se crearon invitaciones reales.
No se imprimieron secrets ni tokens.
No se modifico codigo.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-027-HANDOFF.md`
- `.github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml`
- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/company-auth-logout/function.json`
- `api/company-auth-logout/index.js`
- `staticwebapp.config.json`
- `api/package.json`

## Workflow revisado

Workflow:

```text
Azure Static Web Apps CI/CD
Path: .github/workflows/azure-static-web-apps-zealous-field-08fdd720f.yml
Workflow ID: 283038076
```

Run revisado:

```text
Run ID: 26531921984
Run number: 17
Title: Add admin company invite endpoint
Event: push
Branch: main
Commit: 205ed305fd1460da6e92481071584412b58cdbde
Status: completed
Conclusion: success
Created: 2026-05-27T18:52:38Z
Updated: 2026-05-27T18:53:54Z
URL: https://github.com/PedroJ13/PuntoEvento/actions/runs/26531921984
```

Job principal:

```text
Job ID: 78150545871
Name: Build and Deploy Job
Conclusion: success
Started: 2026-05-27T18:52:41Z
Completed: 2026-05-27T18:53:53Z
```

El checkout del workflow confirmo:

```text
git log -1 = 205ed305fd1460da6e92481071584412b58cdbde
```

## Hallazgos de logs

El log de GitHub Actions confirma:

```text
api_location: api
skip_app_build: true
api_build_command: npm install
DeploymentId: 15dfb74a-83fd-4537-9eac-a6195871f8cc
Api Directory Location: 'api' was found.
Starting to build function app with Oryx
Oryx will build function app with the following custom override command: npm install
Source directory: /github/workspace/api
Destination directory: /bin/staticsites/15dfb74a-83fd-4537-9eac-a6195871f8cc-swa-oryx/api
Finished building function app with Oryx
Zipping Api Artifacts
Done Zipping Api Artifacts
Uploading build artifacts.
Status: Succeeded.
Deployment Complete :)
```

Oryx no imprimio un listado funcion-por-funcion, pero el deploy de API termino exitoso.

## Azure Resource Manager

Consulta ejecutada contra ARM:

```text
GET /subscriptions/.../resourceGroups/resource_group_main/providers/Microsoft.Web/staticSites/puntoevento/builds/default/functions?api-version=2023-01-01
```

Azure lista `admin-company-invites` como Function del build actual:

```text
name: admin-company-invites
functionName: admin-company-invites
triggerType: HttpTrigger
```

Tambien lista otras Functions admin:

```text
admin-approve-provider
admin-approve-provider-flat
admin-pending-providers
admin-pending-providers-flat
admin-reject-provider
admin-reject-provider-flat
```

Y lista Functions que si responden:

```text
companies-register
company-auth-accept-invite
company-auth-logout
create-upload-url
providers
register-provider
register-upload
```

Conclusion:

```text
El artefacto no parece faltar. Azure reconoce la Function, pero la invocacion HTTP no llega al handler cuando el nombre/ruta empieza con admin.
```

## Smoke tests

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

### Endpoint objetivo

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin/company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
```

Esperado:

```text
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

### Ruta por nombre plano nuevo

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin-company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
```

### Rutas admin existentes

Tambien devuelven `404`:

```text
GET  /api/admin/pending-providers
GET  /api/admin-pending-providers
POST /api/admin/approve-provider
POST /api/admin-approve-provider
```

Conclusion:

```text
El problema no es exclusivo de admin-company-invites; afecta el patron de Functions con nombre/ruta admin.
```

### Controles que siguen vivos

`GET /api/providers`:

```text
HTTP/1.1 200 OK
Body: []
```

`POST /api/companies/register` con `{}`:

```text
HTTP/1.1 400 Bad Request
error: Missing required fields
```

`POST /api/company-auth/accept-invite` con `{}`:

```text
HTTP/1.1 400 Bad Request
error: token is required
```

`POST /api/company-auth/logout` con `{}`:

```text
HTTP/1.1 200 OK
Body: { "ok": true }
Set-Cookie: pe_company_session=; max-age=0; ...; path=/api; secure; samesite=lax; httponly
```

`POST /api/create-upload-url` con `{}`:

```text
HTTP/1.1 400 Bad Request
error: providerId, fileName and contentType are required
```

Conclusion:

```text
La API integrada de Static Web Apps funciona. El 404 esta acotado a Functions admin.
```

## Re-run deploy

No se ejecuto re-run.

Motivos:

- El run revisado si corresponde a `205ed30`.
- El run termino `success`.
- Azure ARM ya lista `admin-company-invites` en el build actual.
- El patron de fallo afecta tambien otras Functions admin ya existentes.
- Repetir el mismo deploy probablemente no corrige una restriccion de nombre/ruta reservada.

## Causa probable

Azure Functions reserva rutas administrativas del host bajo `admin`, y hay evidencia historica de que Functions cuyo nombre o route empieza con `admin` pueden compilar/desplegar sin error pero responder `404`.

En este proyecto:

```text
Function directory/name: admin-company-invites
Route: admin/company-invites
URL: /api/admin/company-invites
```

Los tres usan `admin` al inicio.

Por eso la recomendacion no es relanzar deploy, sino cambiar el patron de nombre/ruta.

## Recomendacion para Product/Architect

Crear una tarea Backend/Infra pequena para renombrar las Functions admin y evitar `admin` al inicio del nombre o route.

Opcion recomendada para MVP:

```text
api/internal-company-invites/
route: internal/company-invites
URL: /api/internal/company-invites
```

Tambien renombrar gradualmente endpoints admin legacy:

```text
/api/internal/pending-providers
/api/internal/approve-provider
/api/internal/reject-provider
```

Alternativas aceptables:

```text
/api/backoffice/company-invites
/api/management/company-invites
/api/ops/company-invites
```

Evitar:

```text
/api/admin/...
/api/admin-...
Function folders que empiezan con admin
```

Despues del cambio, repetir smoke:

```text
POST /api/internal/company-invites
Esperado: 401 Unauthorized
Header: WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Luego QA Azure puede generar una invitacion controlada y continuar con:

```text
accept-invite -> Set-Cookie -> logout
```

## Riesgos

- Cambiar URL implica actualizar contrato/documentacion y cualquier frontend/admin que apunte al endpoint.
- Si se decide mantener `/api/admin/...`, puede requerir un proxy/rewrite soportado por Static Web Apps o una API separada, lo cual agrega complejidad innecesaria para MVP.
- Las rutas admin legacy probablemente tampoco estan operativas hoy en Azure, aunque las rutas publicas y de auth si funcionan.
- Basic Auth admin sigue siendo mecanismo temporal MVP; el renombre solo resuelve routing, no endurece seguridad.
