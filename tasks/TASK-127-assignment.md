# TASK-127: Backend/API - reglas Round 2 de moderacion, imagenes y busqueda

## Equipo asignado

Backend/API.

## Superficie

```text
api/**
```

## Contexto

Round 2 requiere que las reglas no dependan solo de UI:

- servicio no puede publicarse si empresa no esta publicada;
- upload no puede publicarse si empresa/servicio no estan publicados;
- servicio soporta hasta 10 imagenes, una cover;
- busqueda publica debe encontrar servicios por nombre de empresa.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2.md`
- `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29_ROUND_2_TRIAGE.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- endpoints internos de approve/reject;
- endpoints `uploads/sign`, `uploads/confirm`;
- endpoint publico `public/services`.

## Objetivo

Implementar reglas backend necesarias para soportar Round 2.

## Alcance

1. `POST /api/internal/services/{companyId}/{serviceId}/approve`:
   - responder `409` si la empresa no esta `published`.
2. `POST /api/internal/uploads/{companyId}/{uploadId}/approve`:
   - responder `409` si la empresa no esta `published`;
   - si `scope=service`, responder `409` si el servicio no esta `published`.
3. Uploads de servicio:
   - no permitir mas de 10 imagenes activas o pendientes por servicio, cover incluido;
   - no permitir mas de un cover activo o pendiente por servicio.
4. Public services:
   - `q` debe buscar por `company.name` y `company.slug`, ademas de campos de servicio.
5. Respuestas de error claras para estados invalidos.

## Fuera de alcance

- Cambiar UI.
- Hard delete de datos.
- Hacer commit/push.

## Verificacion esperada

- Tests estructurales/mocks:
  - aprobar servicio con empresa `pending/rejected` -> `409`;
  - aprobar servicio con empresa `published` -> OK si servicio valido;
  - aprobar upload de servicio con servicio no publicado -> `409`;
  - limite de 10 imagenes;
  - cover duplicado bloqueado;
  - busqueda `q=Demo Owner Jardines del Sol` encuentra servicio publicado de esa empresa.

## Entregable

Crear:

```text
tasks/TASK-127-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Endpoints modificados.
- Casos verificados.
- Riesgos o decisiones pendientes.
- Recomendacion para QA.

## Aviso al terminar

```text
Termine TASK-127. Product/Architect debe leer tasks/TASK-127-HANDOFF.md.
```
