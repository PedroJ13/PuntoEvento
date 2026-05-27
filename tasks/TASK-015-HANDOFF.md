# TASK-015: Implementar POST /api/companies/register

## Equipo

Backend API.

## Estado

Completada.

## Resumen

Se implemento el endpoint nuevo:

```text
POST /api/companies/register
```

El endpoint registra una empresa gratis bajo el modelo `Company -> Services`, guardando una entidad en Azure Table Storage con:

- `status: pending`
- `plan: free`
- slug generado desde el nombre
- `companyId` interno

No se modifico ni reemplazo el endpoint existente:

```text
POST /api/register-provider
```

## Archivos tocados

- `api/companies-register/function.json`
- `api/companies-register/index.js`
- `api/shared/config.js`
- `api/shared/azure.js`
- `api/shared/validation.js`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-015-HANDOFF.md`

## Endpoint creado

```text
POST /api/companies/register
```

Azure Function:

```text
api/companies-register
```

Ruta configurada:

```json
{
  "route": "companies/register",
  "methods": ["post"],
  "authLevel": "anonymous"
}
```

La funcion mantiene `authLevel: anonymous` igual que los endpoints publicos actuales, pero aplica validacion de origin con `enforceAllowedOrigin`.

## Contrato final

Request:

```json
{
  "companyName": "Aurisbel Eventos",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos."
}
```

Response success `201`:

```json
{
  "companyId": "company_...",
  "slug": "aurisbel-eventos",
  "status": "pending",
  "plan": "free"
}
```

Errores:

```text
400 Missing required fields
400 Invalid email
403 Forbidden si origin no esta permitido
405 Method not allowed si llega un metodo distinto a POST
500 Unexpected server error
```

Campos persistidos en `Companies`:

```json
{
  "PartitionKey": "company",
  "RowKey": "company_...",
  "id": "company_...",
  "slug": "aurisbel-eventos",
  "name": "Aurisbel Eventos",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos.",
  "status": "pending",
  "plan": "free",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Cambios realizados

- Se creo `api/companies-register/function.json` con ruta `companies/register` y metodo `POST`.
- Se creo `api/companies-register/index.js`.
- Se agrego `AZURE_TABLE_COMPANIES` como variable opcional en `api/shared/config.js`, con default `Companies`.
- Se agrego `ensureCompaniesTable` en `api/shared/azure.js` para crear la tabla al vuelo siguiendo el patron existente.
- Se agrego `validateCompanyRegistrationPayload` en `api/shared/validation.js`.
- Se actualizo `docs/API_CONTRACTS_MVP.md` para que el response de `POST /api/companies/register` incluya `plan: free`.
- No se agrego password ni auth propia.
- No se implemento CRUD de servicios.
- No se tocaron UI, admin ni pagina publica.

## Validacion realizada

Lectura/contexto:

```text
AGENTS.md
chat-start/BACKEND_API.md
docs/README.md
docs/BACKLOG.md
docs/DATA_MODEL.md
docs/API_CONTRACTS_MVP.md
docs/ARCHITECTURE.md
docs/DECISION_LOG.md
tasks/TASK-003-HANDOFF.md
```

Sintaxis JS:

```text
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/companies-register/index.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/config.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/azure.js
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check api/shared/validation.js
```

Resultado:

```text
OK, sin errores de sintaxis.
```

Validacion de payload:

```text
validateCompanyRegistrationPayload con payload valido devuelve company normalizada.
Payload incompleto devuelve Missing required fields.
Email invalido devuelve Invalid email.
```

Validacion de `function.json`:

```text
Route: companies/register
Methods: post
AuthLevel: anonymous
```

Git:

```text
git status --short
```

Resultado esperado de esta tarea:

```text
M  api/shared/azure.js
M  api/shared/config.js
M  api/shared/validation.js
M  docs/API_CONTRACTS_MVP.md
?? api/companies-register/
?? tasks/TASK-015-HANDOFF.md
```

Nota:

`tasks/TASK-015-assignment.md` ya estaba sin trackear antes de implementar esta tarea.

## Riesgos

- No se ejecuto prueba end-to-end real contra Azure Table Storage desde HTTP local.
- La unicidad de slug es basica: consulta slugs existentes en `Companies` y agrega sufijo aleatorio si hay colision, pero no usa una tabla atomica `CompanySlugs`.
- Si dos registros identicos llegan al mismo tiempo, todavia podria haber carrera de slug. El riesgo es bajo para MVP, pero debe cerrarse antes de escala real.
- No hay CAPTCHA ni rate limiting para registro publico.
- No hay autenticacion de empresa en esta tarea.
- No se envia email de notificacion para `companies/register`; el email existente sigue atado a `register-provider`.
- `Companies` se crea al vuelo, pero Infra debe confirmar si la tabla existe/configura en Azure.

## Pendientes

- Probar `POST /api/companies/register` contra Azure Functions desplegado.
- Confirmar variable opcional `AZURE_TABLE_COMPANIES` en Azure Static Web Apps si se quiere un nombre distinto a `Companies`.
- Decidir si se agrega tabla `CompanySlugs` para unicidad atomica.
- Decidir si registro crea solo empresa o tambien primer servicio.
- Implementar `GET /api/companies/me`.
- Implementar `PATCH /api/companies/me`.
- Implementar CRUD de servicios.
- Definir/auth de empresa antes de abrir panel real.
- Agregar notificacion por email para el nuevo flujo `companies/register`.
- Agregar pruebas automatizadas ligeras para validaciones.

## Recomendacion para Product/Architect

Validar esta decision antes de la siguiente implementacion:

```text
El registro nuevo crea solo Company en estado pending.
```

Recomendacion:

- Mantener `/api/register-provider` como compatibilidad temporal.
- Usar `/api/companies/register` para el flujo nuevo.
- Definir pronto autenticacion de empresa, porque bloquea `/companies/me` y CRUD de servicios.
- Crear una tarea separada para `CompanySlugs` si Product/Architect quiere garantizar slug unico de forma atomica desde el inicio.

## Siguiente tarea sugerida

Backend API:

```text
Implementar GET /api/companies/me con una estrategia temporal de autenticacion definida por Product/Architect.
```

Infra Azure:

```text
Confirmar tabla Companies y variable AZURE_TABLE_COMPANIES en Static Web Apps.
```

QA:

```text
Probar registro real contra Azure con payload valido, campos faltantes, email invalido y origin no permitido.
```

