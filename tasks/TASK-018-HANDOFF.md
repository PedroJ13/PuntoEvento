# TASK-018: QA post-deploy de POST /api/companies/register

## Equipo

QA.

## Estado

Completada.

## Resultado general

Aprobado.

El endpoint desplegado en Azure:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

esta disponible y cumple los criterios de aceptacion de TASK-018:

- POST invalido no devuelve `404`.
- Campos faltantes devuelven `400`.
- Email invalido devuelve `400`.
- Payload valido controlado devuelve `201`.
- Response de exito incluye `companyId`, `slug`, `status: pending`, `plan: free`.
- No se observaron campos sensibles en las responses.

Se creo una empresa QA controlada en Azure:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
slug: qa-company-register-test
status: pending
plan: free
```

## Requests ejecutados

### 1. POST invalido no mutante

URL:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Payload:

```json
{
  "companyName": "QA Route Check"
}
```

Resultado:

```text
HTTP 400 Bad Request
```

Response:

```json
{
  "error": "Missing required fields",
  "details": {
    "missing": [
      "email",
      "whatsapp",
      "province",
      "description"
    ]
  }
}
```

Conclusion:

```text
La ruta existe. No esta bloqueada por el 404 observado con GET.
```

### 2. POST email invalido

URL:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Payload:

```json
{
  "companyName": "QA Invalid Email",
  "email": "bad-email",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "description": "Prueba QA."
}
```

Resultado:

```text
HTTP 400 Bad Request
```

Response:

```json
{
  "error": "Invalid email"
}
```

### 3. POST valido controlado

URL:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Payload:

```json
{
  "companyName": "QA Company Register Test",
  "email": "qa-company-register-test@example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Registro creado por QA para validar el endpoint companies/register."
}
```

Resultado:

```text
HTTP 201 Created
```

Response:

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "slug": "qa-company-register-test",
  "status": "pending",
  "plan": "free"
}
```

## Status codes

| Caso | Status |
| --- | --- |
| Payload incompleto | `400` |
| Email invalido | `400` |
| Payload valido controlado | `201` |

## Responses relevantes

- Las responses usan `Content-Type: application/json; charset=utf-8`.
- La response de exito no incluye `password`, `token`, `secret`, connection string, storage key ni datos internos de Azure.
- El `GET` smoke de TASK-017 no era suficiente para determinar disponibilidad porque la Function esta configurada solo para `POST`; el POST invalido confirmo que la ruta existe.

## Bugs encontrados con severidad

No se encontraron bugs P0, P1, P2 ni P3 en el alcance de TASK-018.

## Riesgos

- Se creo una entidad real QA en Azure. La asignacion indica no borrar datos, asi que queda pendiente para revision/limpieza futura si Product/Infra lo requiere.
- El endpoint es anonimo por diseno; antes de abrirlo mas ampliamente sigue pendiente anti-abuso como CAPTCHA/rate limiting.
- La unicidad de slug no es atomica segun TASK-015/TASK-016; sigue existiendo riesgo de carrera con registros simultaneos.
- No se verifico directamente la tabla `Companies` en Azure desde esta tarea; se valido por respuesta HTTP `201`.

## Recomendacion para Product/Architect

Marcar la verificacion post-deploy de `/api/companies/register` como aprobada.

Siguiente recomendacion:

- Infra puede confirmar visualmente la entidad `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2` en tabla `Companies`.
- Product/Architect debe decidir politica de limpieza de registros QA.
- Antes de uso publico real, priorizar anti-abuso y decision sobre unicidad atomica de slug.
