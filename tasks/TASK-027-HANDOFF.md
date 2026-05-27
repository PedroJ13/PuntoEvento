# TASK-027: Infra deploy/smoke endpoint admin invitaciones

## Equipo

Infra Azure.

## Estado

Bloqueada por smoke Azure.

## Resultado general

Se confirmo que `origin/main` contiene el commit con `api/admin-company-invites`, y Azure Static Web Apps reporta el environment `Ready`.

Sin embargo, el endpoint esperado no responde como desplegado:

```text
POST /api/admin/company-invites
```

Resultado observado:

```text
404 Not Found
```

Resultado esperado:

```text
401 Unauthorized
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Conclusion:

```text
El commit existe en Git y Azure esta Ready, pero la Function nueva no esta expuesta en produccion o no quedo incluida correctamente en el despliegue/API runtime.
```

No se usaron credenciales admin.
No se crearon invitaciones reales.
No se imprimieron secretos ni tokens.
No se modifico codigo.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-025-HANDOFF.md`
- `tasks/TASK-026-HANDOFF.md`
- `api/admin-company-invites/function.json`
- `api/admin-company-invites/index.js`
- `api/shared/adminAuth.js`
- `api/shared/companyAuth.js`
- `api/shared/config.js`
- `staticwebapp.config.json`

## Commit verificado

Commit local actual:

```text
205ed30 Add admin company invite endpoint
```

Confirmacion contra GitHub:

```text
origin/main = 205ed305fd1460da6e92481071584412b58cdbde
```

Contenido confirmado en `origin/main`:

```text
api/admin-company-invites
```

Archivos incluidos por el commit:

```text
api/admin-company-invites/function.json
api/admin-company-invites/index.js
docs/API_CONTRACTS_MVP.md
docs/BACKLOG.md
tasks/TASK-025-HANDOFF.md
tasks/TASK-026-HANDOFF.md
tasks/TASK-027-assignment.md
```

## Azure Static Web Apps

Recurso:

```text
Name: puntoevento
Resource group: resource_group_main
SKU: Free
Branch: main
Repository: https://github.com/PedroJ13/PuntoEvento
Default hostname: zealous-field-08fdd720f.7.azurestaticapps.net
```

Environment:

```text
Name: default
Status: Ready
Hostname: zealous-field-08fdd720f.7.azurestaticapps.net
Last updated: 2026-05-27T18:53:42Z
Source branch: main
```

Nota:

```text
GitHub connector/Azure CLI no devolvieron workflow runs asociados al SHA, por lo que la confirmacion de deploy se basa en environment Ready y smokes HTTP.
```

## Config local revisada

`api/admin-company-invites/function.json` define:

```json
{
  "authLevel": "anonymous",
  "methods": ["post"],
  "route": "admin/company-invites"
}
```

La ruta esperada en Azure es:

```text
/api/admin/company-invites
```

El handler usa:

```text
requireAdminAuth
enforceAllowedOrigin
ensureCompaniesTable
ensureCompanyAuthTables
CompanyInvites
Companies
```

## Smoke tests ejecutados

### POST /api/admin/company-invites sin auth

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin/company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-middleware-request-id: cd4ff9e1-f8f0-4f97-a4b1-ea92dfca7a8b
```

Body:

```text
vacio
```

Header esperado no presente:

```text
WWW-Authenticate
```

Conclusion:

```text
No cumple criterio de aceptacion. Si la Function estuviera expuesta, deberia llegar al handler y devolver 401.
```

### POST /api/admin/company-invites sin auth y con Origin permitido

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin/company-invites" -H "Content-Type: application/json" -H "Origin: https://zealous-field-08fdd720f.7.azurestaticapps.net" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
```

Conclusion:

```text
El problema no parece ser CORS/Origin. La ruta sigue sin ser reconocida.
```

### POST /api/admin-company-invites sin auth

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/admin-company-invites" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 404 Not Found
Content-Length: 0
```

Conclusion:

```text
Tampoco esta expuesto por nombre plano de Function.
```

### Control: POST /api/company-auth/logout

Comando:

```text
curl -i -s -X POST "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/company-auth/logout" -H "Content-Type: application/json" --data "{}"
```

Resultado:

```text
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
```

Body:

```json
{
  "ok": true
}
```

Conclusion:

```text
La API integrada de Static Web Apps funciona para endpoints ya desplegados. El fallo parece especifico del endpoint nuevo o del artefacto desplegado.
```

## Prueba autenticada opcional

No ejecutada.

Motivo:

```text
La prueba sin credenciales ya falla con 404 y no llega al handler. Ademas la tarea solo permite prueba autenticada si Infra tiene credenciales y Product/Architect lo permite.
```

## Riesgos

- Azure puede estar sirviendo un artefacto/API runtime que no incluye `api/admin-company-invites`.
- GitHub Actions puede haber marcado deploy exitoso aunque la Function nueva no haya sido detectada o empaquetada.
- No se pudo confirmar con workflow run asociado al SHA desde las herramientas disponibles.
- Mientras el endpoint devuelve `404`, QA no puede generar invitaciones controladas desde Azure.
- El flujo completo `admin invite -> accept-invite -> session cookie -> logout` queda bloqueado en ambiente Azure.
- No conviene probar con credenciales reales hasta que el endpoint responda primero `401` sin auth.

## Recomendacion para Product/Architect

No aprobar TASK-027 todavia.

Siguiente paso recomendado:

```text
Revisar el workflow de GitHub Actions del commit 205ed30 y confirmar que el deploy incluyo el directorio api/admin-company-invites en el artefacto de Azure Functions.
```

Acciones sugeridas:

- Abrir el ultimo workflow run de GitHub Actions para `205ed30`.
- Revisar logs de Oryx/Azure Static Web Apps deploy en la seccion API.
- Confirmar que no haya advertencias de empaquetado o deteccion de Functions.
- Si el run no corresponde al commit, relanzar deploy desde GitHub Actions.
- Despues de redeploy, repetir smoke sin auth:

```text
POST /api/admin/company-invites
Esperado: 401 Unauthorized + WWW-Authenticate
```

Cuando eso pase, QA Azure puede continuar con una invitacion controlada sin documentar tokens reales.
