# TASK-111 Handoff

## Resultado general

Implementado el endpoint explicito para enviar servicios propios a revision:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

El flujo queda alineado con la decision de producto: la empresa no edita `status` manualmente, los servicios se crean como `draft`, y solo una accion explicita de `submit-review` cambia servicios `draft` o `rejected` a `pending`.

## Archivos modificados

- `api/company-services-submit-review/function.json`
- `api/company-services-submit-review/index.js`
- `api/company-services-update/index.js`
- `tasks/TASK-111-HANDOFF.md`

## Endpoint implementado

`POST /api/companies/me/services/{serviceId}/submit-review`

- Requiere sesion de empresa.
- Busca el servicio usando `companyId` de la sesion como partition key.
- Devuelve `404` si el servicio no existe para esa empresa.
- Permite pasar a `pending` solo desde `draft` o `rejected`.
- Devuelve `409` para estados no revisables, incluyendo `published`, `pending` e `inactive`.
- Valida campos minimos antes de enviar a revision:
  - `name`;
  - `category`;
  - al menos un `eventType`;
  - `description`;
  - `priceFrom`.
- Devuelve solo contrato publico minimo:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "status": "pending",
  "updatedAt": "2026-05-29T00:00:00.000Z"
}
```

## Reglas de status aplicadas

- `POST /api/companies/me/services` ya crea servicios con `status: "draft"` y no usa `status` enviado por cliente.
- `PATCH /api/companies/me/services/{serviceId}` no acepta `status` como campo editable.
- Si el cliente manda solo `status` en PATCH, responde `400` por no incluir campos editables.
- Si el cliente manda `status` junto con campos editables, el `status` se ignora.
- Si un servicio en `pending`, `published` o `rejected` recibe cambios de contenido publico por PATCH, vuelve a `draft` y limpia `rejectionReason`.
- `submit-review` no publica servicios, no aprueba imagenes y no devuelve campos internos.

## Verificacion ejecutada

- `node --check api/company-services-submit-review/index.js`
- `node --check api/company-services-update/index.js`
- `node --check api/company-services-create/index.js`
- `ConvertFrom-Json` sobre `api/company-services-submit-review/function.json`
- Script local con mocks para:
  - `draft -> pending` OK;
  - `rejected -> pending` OK;
  - `published -> submit-review` responde `409`;
  - `inactive -> submit-review` responde `409`;
  - servicio de otra empresa responde `404`;
  - falta de campos minimos responde `400`;
  - create fuerza `draft` aunque el cliente envie `status`;
  - PATCH solo con `status` responde `400`;
  - PATCH con `status` y campos editables ignora `status`;
  - PATCH de servicio `published` con contenido publico vuelve a `draft`.

Nota: el `node` del PATH fallo por bloqueo de WindowsApps, por lo que la verificacion se ejecuto con el runtime local de Codex:

```text
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
```

## Riesgos pendientes

- No se ejecuto Azure Functions runtime real ni pruebas contra Azure Table Storage real.
- El cambio en PATCH tambien devuelve a `draft` servicios `pending` y `rejected` cuando se edita contenido publico, para respetar la regla de producto "crear o editar servicio guarda draft". QA debe confirmar que este comportamiento coincide con el flujo esperado del panel empresa.
- Si existen servicios antiguos con arrays no JSON en `eventTypes`, `submit-review` los tratara como datos faltantes.

## Recomendacion para QA local/estructural

QA debe validar con mocks o entorno local de Functions:

- Crear servicio enviando `status: "published"` y confirmar que queda `draft`.
- Editar servicio `published` y confirmar que queda `draft`.
- Intentar enviar a revision servicios `draft`, `rejected`, `published`, `pending` e `inactive`.
- Confirmar que el response de `submit-review` no incluye campos internos ni contenido completo del servicio.
- Confirmar que un servicio de otra empresa no se puede inferir y responde `404`.
