# TASK-096 Handoff

## Resultado general

Corregido el enrutamiento de Azure Functions para los listados internos de moderacion.

Los tres endpoints ahora declaran `get` y `post` en `function.json`, de modo que `POST` llega al handler existente en `api/shared/internalPending.js` y responde `405 Method not allowed` en vez de quedarse en `404` antes de ejecutar codigo.

## Archivos modificados

- `api/internal-companies-pending/function.json`
- `api/internal-services-pending/function.json`
- `api/internal-uploads-pending/function.json`
- `tasks/TASK-096-HANDOFF.md`

No se modificaron payloads, handlers, endpoints approve/reject, frontend ni docs de contrato.

## Metodo elegido en function.json

Se eligio el cambio minimo:

```json
"methods": ["get", "post"]
```

Motivo:

- `GET` sigue siendo el contrato funcional.
- `POST` cubre el smoke fallido de QA Azure de `TASK-095`.
- El handler ya rechaza cualquier metodo distinto de `GET` con `405`.

## Como se verifico

Checks ejecutados:

```text
ConvertFrom-Json en los tres function.json
node --check api/shared/internalPending.js
git diff --check -- api/internal-companies-pending/function.json api/internal-services-pending/function.json api/internal-uploads-pending/function.json
```

Smoke local/estructural con mocks:

- `POST` a companies pending responde `405`.
- `POST` a services pending responde `405`.
- `POST` a uploads pending responde `405`.
- `GET` a companies pending sigue respondiendo `200` con `items`.
- `GET` a services pending sigue respondiendo `200` con `items`.
- `GET` a uploads pending sigue respondiendo `200` con `items`.

## Riesgos pendientes

- Falta deploy y QA Azure para confirmar que Static Web Apps/Azure Functions ya enruta `POST` hacia los handlers.
- Otros metodos no listados en `function.json` podrian seguir devolviendo `404`; esta tarea cubrio el smoke requerido de `POST`.
- Los listados siguen sin preview visual de uploads pendientes, fuera de alcance.

## Recomendacion para QA Azure

Repetir el smoke puntual de `TASK-095` despues del deploy:

```text
POST /api/internal/companies/pending -> 405
POST /api/internal/services/pending -> 405
POST /api/internal/uploads/pending -> 405
```

Tambien conviene confirmar rapidamente que:

```text
GET con credencial admin valida -> 200
GET sin credencial -> 401
```
