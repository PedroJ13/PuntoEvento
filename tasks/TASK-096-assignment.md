# TASK-096: Corregir 405 en listados internos de moderacion

## Equipo asignado

Backend/API.

## Contexto

`TASK-095` valido en Azure real los endpoints internos de listado:

```text
GET /api/internal/companies/pending
GET /api/internal/services/pending
GET /api/internal/uploads/pending
```

Resultado: los `GET` funcionan con credencial admin valida, auth `401` funciona y no se exponen campos prohibidos.

El bloqueo es solo el metodo no permitido:

```text
POST /api/internal/companies/pending -> 404, esperado 405
POST /api/internal/services/pending -> 404, esperado 405
POST /api/internal/uploads/pending -> 404, esperado 405
```

`api/shared/internalPending.js` ya tiene logica para devolver `405`, pero Azure no invoca el handler porque cada `function.json` registra solo `"methods": ["get"]`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-095-HANDOFF.md`
- `api/shared/internalPending.js`
- `api/internal-companies-pending/function.json`
- `api/internal-services-pending/function.json`
- `api/internal-uploads-pending/function.json`

## Objetivo

Ajustar los endpoints internos de listado para que Azure enrute metodos no GET al handler y el handler responda `405`.

## Alcance

Modificar solo lo necesario, probablemente:

```text
api/internal-companies-pending/function.json
api/internal-services-pending/function.json
api/internal-uploads-pending/function.json
```

Opciones aceptables:

- incluir `post` en `methods` para cubrir el smoke de QA;
- o incluir los metodos HTTP que el equipo considere razonables para que el handler devuelva `405`.

Mantener el contrato principal:

- `GET` con auth valida responde `200`;
- sin auth responde `401`;
- auth invalida responde `401`;
- no exponer secretos.

## Fuera de alcance

- Cambiar payloads.
- Conectar `admin.html`.
- Crear preview de uploads.
- Crear endpoint `submit-review`.
- Tocar endpoints approve/reject.
- Hacer commit/push.

## Verificacion esperada

- `ConvertFrom-Json` en los tres `function.json`.
- `node --check api/shared/internalPending.js`.
- Smoke local/estructural o razonamiento verificable:
  - los tres `function.json` permiten que `POST` llegue al handler;
  - el handler responde `405` para `POST`;
  - `GET` sigue funcionando.
- `git diff --check` de los archivos tocados.

## Entregable

Crear:

```text
tasks/TASK-096-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Metodo elegido en `function.json`.
- Como se verifico.
- Riesgos pendientes.
- Recomendacion para repetir QA Azure de TASK-095.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-096. Product/Architect debe leer tasks/TASK-096-HANDOFF.md.
```
