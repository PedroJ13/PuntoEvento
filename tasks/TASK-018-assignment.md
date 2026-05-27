# TASK-018: QA post-deploy de POST /api/companies/register

## Equipo encargado

QA.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-018-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-018-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-017-HANDOFF.md`

Opcionales utiles:

- `tasks/TASK-015-HANDOFF.md`

## Objetivo

Validar el endpoint desplegado en Azure:

```text
POST /api/companies/register
```

## Contexto

Infra TASK-017 hizo smoke con:

```text
GET /api/companies/register
```

y recibio:

```text
404 Not Found
```

Esto no confirma que el endpoint POST no exista, porque la Function esta configurada solo para `POST`.

Product/Architect autoriza una prueba controlada de `POST` real.

## URL objetivo

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

## Orden de prueba

## 1. POST invalido no mutante

Enviar payload incompleto:

```json
{
  "companyName": "QA Route Check"
}
```

Resultado esperado:

```text
400 Missing required fields
```

Si devuelve `400`, la ruta existe.

Si devuelve `404`, detener la prueba y reportar bloqueo de routing/deploy.

## 2. POST email invalido

Solo si paso la prueba anterior.

```json
{
  "companyName": "QA Invalid Email",
  "email": "bad-email",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "description": "Prueba QA."
}
```

Resultado esperado:

```text
400 Invalid email
```

## 3. POST valido controlado

Solo si Product/Architect ya autorizo esta tarea y las pruebas no mutantes pasaron.

Usar datos claramente QA:

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

Resultado esperado:

```text
201
```

Response debe incluir:

- `companyId`
- `slug`
- `status: pending`
- `plan: free`

## Fuera de alcance

- No probar carga de fotos.
- No probar login.
- No probar CRUD de servicios.
- No borrar datos en Azure.
- No hacer pruebas masivas.

## Criterios de aceptacion

- POST invalido no devuelve `404`.
- Validaciones devuelven `400`.
- Payload valido devuelve `201`.
- Response no expone secretos.
- Si el endpoint sigue en `404`, reportar bloqueo para Backend/Infra.

## Handoff requerido

Crear:

```text
tasks/TASK-018-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Requests ejecutados.
- Status codes.
- Responses relevantes.
- Si se creo una empresa QA, incluir `companyId` y `slug`.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-018. Product/Architect debe leer `tasks/TASK-018-HANDOFF.md`.
```

