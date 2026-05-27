# TASK-036: Backend GET companies me

## Resultado general

Completada.

Se implemento el endpoint privado:

```text
GET /api/companies/me
```

La Function deriva la empresa autenticada exclusivamente desde la cookie `pe_company_session` usando `getCurrentCompanySession(req, config)`. No acepta `companyId` por query, body ni headers como autoridad.

## Archivos modificados

- `api/companies-me/function.json`
- `api/companies-me/index.js`
- `docs/BACKLOG.md`
- `tasks/TASK-036-HANDOFF.md`

## Contrato implementado

### GET `/api/companies/me`

Request:

```text
Cookie: pe_company_session=<session>
```

Response `200`:

```json
{
  "id": "company_123",
  "slug": "qa-company-register-test",
  "name": "QA Company Register Test",
  "status": "pending",
  "plan": "free",
  "email": "qa-company-register-test@example.com",
  "whatsapp": "50688888888",
  "phone": "",
  "website": "",
  "instagram": "",
  "province": "Heredia",
  "canton": "San Francisco",
  "district": "",
  "address": "",
  "description": "...",
  "logoUrl": "",
  "coverUrl": "",
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

Errores:

```text
401 Unauthorized
404 Company not found
405 Method not allowed
500 Unexpected server error
```

Reglas implementadas:

- Usa `getCurrentCompanySession(req, config)` desde `api/shared/companyAuth.js`.
- Deriva `companyId` desde `session.partitionKey`.
- Lee `Companies` con `PartitionKey=company`, `RowKey=companyId`.
- No devuelve `partitionKey`, `rowKey`, `etag`, `timestamp`, hashes, tokens, cookies ni datos internos de Table Storage.
- Mantiene `internal/auth-diagnostics` sin cambios.
- No implementa `PATCH /api/companies/me`.
- No implementa CRUD de servicios.
- No toca panel UI ni pagina publica.

## Como probar local/estructuralmente

Verificacion realizada:

```text
node --check api/companies-me/index.js -> OK
api/companies-me/function.json -> JSON valido, route companies/me, method get
GET /api/companies/me sin cookie con mocks -> 401 Unauthorized
GET /api/companies/me con sesion mockeada -> lee Companies company/company_123 y devuelve 200 sin metadatos internos
```

Sintaxis:

```powershell
& 'C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check 'api/companies-me/index.js'
```

Validacion estructural de `function.json`:

```powershell
Get-Content -Raw 'api/companies-me/function.json' | ConvertFrom-Json
```

Prueba mockeada sin cookie:

```text
GET /api/companies/me sin cookie devuelve 401 Unauthorized.
```

Prueba real despues de deploy:

1. Generar una invitacion real con `POST /api/internal/company-invites`.
2. Aceptarla con `POST /api/company-auth/accept-invite`.
3. Conservar la cookie `pe_company_session` en la sesion HTTP.
4. Ejecutar:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri 'https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/me' `
  -WebSession $session
```

Resultado esperado:

```text
200 con los datos seguros de la empresa asociada a la sesion.
```

Sin cookie:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri 'https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/me'
```

Resultado esperado:

```text
401 Unauthorized
```

## Riesgos

- No se ejecuto una prueba end-to-end real contra Azure porque depende de una cookie activa generada por el flujo de invitacion.
- Los handoffs anteriores indican que el flujo real de invitacion estuvo bloqueado por credenciales admin hasta tareas posteriores; QA debe validar el endpoint con una sesion real en Azure.
- `getCurrentCompanySession` busca sesiones por hash con scan de Table Storage. Es aceptable para MVP cerrado, pero puede no escalar.
- Si la cookie `Secure` se prueba en local HTTP, el navegador puede no persistirla. La prueba confiable debe hacerse por HTTPS en Azure o con cliente HTTP que conserve manualmente la cookie.
- El endpoint llama `ensureCompanyAuthTables` y `ensureCompaniesTable`; esto sigue el patron actual, pero depende de que la Function tenga permisos/connection string correctos.

## Siguiente tarea recomendada

QA Azure:

```text
Validar GET /api/companies/me con una cookie real pe_company_session, confirmar 200, confirmar 401 sin cookie y confirmar que no se exponen metadatos internos.
```

Backend API:

```text
Implementar PATCH /api/companies/me o GET /api/companies/me/services, segun prioridad de Product/Architect.
```

Product/Architect:

```text
Decidir si el payload de empresa propia debe incluir todos los campos editables del modelo Company o solo el subconjunto minimo mostrado en el contrato MVP.
```
