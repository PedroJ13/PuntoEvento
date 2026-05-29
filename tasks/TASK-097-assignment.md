# TASK-097: Re-smoke Azure de listados internos de moderacion

## Equipo asignado

QA / Infra Azure.

## Dependencia

Product/Architect debe hacer commit/push de `TASK-096` antes de ejecutar esta tarea.

Esperar a que termine el deploy de Azure Static Web Apps para el commit que cambia los `function.json` de:

```text
api/internal-companies-pending/function.json
api/internal-services-pending/function.json
api/internal-uploads-pending/function.json
```

## Contexto

`TASK-095` valido en Azure real que los listados internos funcionan por `GET`, estan protegidos por admin auth y no exponen campos prohibidos.

El unico fallo fue:

```text
POST /api/internal/companies/pending -> 404, esperado 405
POST /api/internal/services/pending -> 404, esperado 405
POST /api/internal/uploads/pending -> 404, esperado 405
```

`TASK-096` ajusto los `function.json` para declarar `methods: ["get", "post"]`, permitiendo que `POST` llegue al handler y responda `405`.

## Base URL

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Objetivo

Validar en Azure real que el fallo de `TASK-095` quedo corregido, sin reabrir todo el alcance.

## Casos requeridos

Validar:

```text
POST /api/internal/companies/pending -> 405
POST /api/internal/services/pending -> 405
POST /api/internal/uploads/pending -> 405
```

Tambien confirmar smoke minimo:

```text
GET /api/internal/companies/pending sin credencial -> 401
GET /api/internal/services/pending sin credencial -> 401
GET /api/internal/uploads/pending sin credencial -> 401

GET /api/internal/companies/pending con credencial admin valida -> 200
GET /api/internal/services/pending con credencial admin valida -> 200
GET /api/internal/uploads/pending con credencial admin valida -> 200
```

Para los `GET 200`, basta validar:

- respuesta con objeto `{ items }`;
- `items` es array;
- no aparecen campos prohibidos.

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

## Fuera de alcance

- Conectar `admin.html`.
- Crear datos QA nuevos, salvo que todos los listados vengan vacios y lo consideres necesario.
- Aprobar/rechazar desde UI.
- Crear endpoint `submit-review`.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-097-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Casos ejecutados y status.
- Confirmacion de campos prohibidos.
- Datos QA saneados si se observaron.
- Recomendacion: listo para Web Dev conectar `admin.html`, o requiere Backend/API.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-097. Product/Architect debe leer tasks/TASK-097-HANDOFF.md.
```
