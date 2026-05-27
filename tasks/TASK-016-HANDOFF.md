# TASK-016: QA de POST /api/companies/register

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado con observaciones.

La validacion local/estructural del endpoint `POST /api/companies/register` cumple el contrato esperado: `function.json` define la ruta `companies/register`, metodo `post` y `authLevel: anonymous`; el payload valido devuelve `201` en ejecucion controlada del handler; los errores de validacion devuelven `400`; metodo no permitido devuelve `405`; origin no permitido devuelve `403`; la respuesta publica no expone secretos.

Observacion: la prueba real contra Azure queda pendiente de post-deploy. En el hostname documentado `https://zealous-field-08fdd720f.7.azurestaticapps.net`, una consulta `GET /api/companies/register` respondio `404 Not Found`, por lo que no ejecute `POST` real para evitar crear datos contra un endpoint que aparenta no estar desplegado todavia.

## Casos probados

- Se leyeron los documentos obligatorios:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/BACKLOG.md`
  - `docs/API_CONTRACTS_MVP.md`
  - `docs/DATA_MODEL.md`
  - `docs/DECISION_LOG.md`
  - `tasks/TASK-015-HANDOFF.md`
- Se reviso `api/companies-register/function.json`:
  - route: `companies/register`,
  - methods: `["post"]`,
  - authLevel: `anonymous`.
- Se confirmo que `/api/register-provider` sigue existiendo estructuralmente:
  - `api/register-provider/function.json`,
  - route: `register-provider`,
  - methods: `["post"]`.
- Se valido sintaxis con Node:
  - `api/companies-register/index.js`,
  - `api/shared/validation.js`,
  - `api/shared/config.js`,
  - `api/shared/azure.js`.
- Se ejecuto el handler `api/companies-register/index.js` con mocks de Table Storage para:
  - payload valido,
  - campos requeridos faltantes,
  - email invalido,
  - metodo no permitido,
  - origin no permitido,
  - origin permitido.
- Se reviso que la respuesta publica no incluya campos tipo `password`, `token`, `secret`, `key` o connection string.
- Se intento verificacion no mutante contra Azure con `GET` al endpoint documentado.

## Bugs encontrados con severidad

No se encontraron bugs P0, P1 ni P2 en la validacion local/estructural.

### P3 - Verificacion Azure pendiente por endpoint no visible en hostname documentado

`GET https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register` respondio `404 Not Found`. Como el endpoint no aparece disponible en Azure, no se ejecuto `POST` real.

Impacto:

- No bloquea la aceptacion local de TASK-015.
- Bloquea confirmar el criterio end-to-end real `201` contra Azure hasta que haya deploy.

Recomendacion:

- Repetir QA post-deploy con payload valido, campos faltantes, email invalido y metodo no permitido.

## Evidencia de responses

Payload valido usado:

```json
{
  "companyName": "Aurisbel Eventos QA",
  "email": "QA-Empresa@Example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos."
}
```

Response simulada con handler local:

```json
{
  "status": 201,
  "body": {
    "companyId": "company_<uuid>",
    "slug": "aurisbel-eventos-qa",
    "status": "pending",
    "plan": "free"
  }
}
```

Entidad persistida simulada:

```json
{
  "partitionKey": "company",
  "rowKey": "company_<uuid>",
  "id": "company_<uuid>",
  "slug": "aurisbel-eventos-qa",
  "name": "Aurisbel Eventos QA",
  "email": "qa-empresa@example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos.",
  "status": "pending",
  "plan": "free",
  "createdAt": "<iso>",
  "updatedAt": "<iso>"
}
```

Campos requeridos faltantes:

```json
{
  "status": 400,
  "body": {
    "error": "Missing required fields",
    "details": {
      "missing": ["name", "whatsapp"]
    }
  }
}
```

Email invalido:

```json
{
  "status": 400,
  "body": {
    "error": "Invalid email"
  }
}
```

Metodo no permitido:

```json
{
  "status": 405,
  "body": {
    "error": "Method not allowed"
  }
}
```

Origin no permitido:

```json
{
  "status": 403,
  "body": {
    "error": "Forbidden"
  }
}
```

Azure smoke no mutante:

```text
GET https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
Status=404 Not Found
```

Secretos en response:

```text
Campos sensibles detectados en response: ninguno.
```

Git:

```text
git status --short
```

El repo ya tenia cambios previos en `api/shared/*`, `docs/*`, `api/companies-register/` y `tasks/`. QA no modifico codigo; solo agrego `tasks/TASK-016-HANDOFF.md`.

## Riesgos

- Falta prueba HTTP real contra Azure Table Storage despues del deploy.
- La unicidad de slug sigue siendo no atomica; puede haber carrera si entran registros simultaneos con el mismo nombre.
- No hay CAPTCHA/rate limiting para registro publico.
- `authLevel: anonymous` es correcto para registro publico, pero depende de `ALLOWED_ORIGINS` y no reemplaza controles anti-abuso.
- `canton` se persiste si viene en payload, pero no es requerido por la validacion actual.
- No hay email de notificacion para este endpoint.

## Pendientes

- Ejecutar QA post-deploy contra Azure:
  - payload valido debe devolver `201`,
  - campos faltantes deben devolver `400`,
  - email invalido debe devolver `400`,
  - metodo no POST debe devolver `405` o equivalente si la plataforma enruta la funcion,
  - confirmar persistencia en tabla `Companies`.
- Confirmar en Infra que existe/configura tabla `Companies` o variable `AZURE_TABLE_COMPANIES`.
- Decidir si se agrega tabla `CompanySlugs` para unicidad atomica.
- Definir estrategia de autenticacion de empresa para `/api/companies/me`.

## Recomendacion para Product/Architect

Aceptar TASK-016 como aprobada en validacion local/estructural y dejar la validacion real Azure como pendiente post-deploy.

Antes de abrir el registro nuevo a usuarios reales, recomiendo priorizar:

- verificacion post-deploy en Azure,
- proteccion anti-abuso para endpoint anonimo,
- decision de unicidad atomica de slug,
- autenticacion de empresa para el siguiente bloque `/companies/me`.
