# TASK-111: Endpoint `submit-review` y reglas de status de servicio

## Equipo asignado

Backend/API.

## Contexto

Product Owner detecto que el campo `Estado` en panel empresa confunde y que hace falta un flujo claro para enviar servicios a revision.

`TASK-109` cerro la decision:

- La empresa no edita `status` manualmente.
- Crear o editar servicio guarda como `draft`.
- Un boton/accion explicita `Enviar a revision` cambia el servicio a `pending`.
- Si un servicio `published` cambia contenido publico, vuelve a `draft`.

Contrato actualizado:

```text
docs/API_CONTRACTS_MVP.md
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `api/companies-me-services/index.js`
- `api/companies-me-services-service/index.js`
- cualquier shared helper usado para servicios propios.

## Objetivo

Implementar el endpoint explicito:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

y alinear reglas de status de servicios propios.

## Alcance

1. Crear endpoint `submit-review`.
2. Requiere sesion de empresa.
3. `serviceId` debe pertenecer a la empresa autenticada.
4. Solo servicios `draft` o `rejected` pueden pasar a `pending`.
5. Servicios `inactive` no pueden enviarse a revision.
6. Validar campos minimos antes de pasar a `pending`:
   - `name`;
   - `category`;
   - al menos un `eventType`;
   - `description`;
   - `priceFrom`.
7. `POST /api/companies/me/services` debe crear `draft` y no aceptar `status` del cliente.
8. `PATCH /api/companies/me/services/{serviceId}` no debe aceptar `status` del cliente.
9. Si un servicio `published` cambia campos publicos, debe volver a `draft`.
10. No publicar servicio ni aprobar imagenes desde `submit-review`.
11. No devolver campos internos.

## Respuesta esperada

`200`:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "status": "pending",
  "updatedAt": "2026-05-29T00:00:00Z"
}
```

Errores esperados:

- `401` sin sesion.
- `404` si el servicio no existe o no pertenece a la empresa.
- `409` si el estado no permite enviar a revision.
- `400` si faltan campos minimos.

## Fuera de alcance

- Cambiar UI de `panel.html`.
- Implementar galeria visual en panel.
- Cambiar admin UI.
- Implementar moderacion por expediente.
- Hacer commit/push.

## Verificacion esperada

- Test local/estructural o script con mocks si el repo no tiene framework formal.
- Casos:
  - `draft -> pending` OK.
  - `rejected -> pending` OK si campos minimos existen.
  - `published -> submit-review` responde `409` si no fue editado a `draft`.
  - `inactive -> submit-review` responde `409`.
  - servicio de otra empresa responde `404`.
  - falta de campos minimos responde `400`.
  - create/patch ignoran o rechazan `status` enviado por cliente.
  - patch de servicio `published` que cambia contenido publico lo devuelve a `draft`.

## Entregable

Crear:

```text
tasks/TASK-111-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Endpoint implementado.
- Reglas de status aplicadas.
- Verificacion ejecutada.
- Riesgos pendientes.
- Recomendacion para QA local/estructural.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-111. Product/Architect debe leer tasks/TASK-111-HANDOFF.md.
```
