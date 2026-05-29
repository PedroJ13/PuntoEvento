# TASK-115: QA Azure de `submit-review`

## Equipo asignado

QA.

## Prerrequisito

Ejecutar solo despues de que Product / Architect / Release confirme commit/push y que Azure Static Web Apps haya terminado el deploy que incluye `TASK-111`.

## Contexto

`TASK-111` implemento:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

`TASK-113` aprobo la validacion local/estructural con mocks. Falta smoke contra Azure real.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-111-HANDOFF.md`
- `tasks/TASK-113-HANDOFF.md`
- `api/company-services-submit-review/function.json`
- `api/company-services-submit-review/index.js`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`

## Ambiente

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Endpoint:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

## Objetivo

Validar en Azure real que `submit-review` funciona con sesion de empresa y Azure Table Storage.

## Casos minimos

1. Crear o usar una sesion valida de empresa QA.
2. Crear servicio propio enviando `status: "published"` y confirmar que queda `draft`.
3. Completar campos minimos del servicio:
   - `name`;
   - `category`;
   - al menos un `eventType`;
   - `description`;
   - `priceFrom`.
4. Ejecutar `submit-review` sobre servicio `draft`.
5. Confirmar respuesta `200` con solo:
   - `id`;
   - `companyId`;
   - `status: "pending"`;
   - `updatedAt`.
6. Reintentar `submit-review` sobre el mismo servicio `pending` y confirmar `409`.
7. Intentar `submit-review` sobre servicio con campos minimos faltantes y confirmar `400`.
8. Intentar sin sesion y confirmar `401`.
9. Si es viable, confirmar que un servicio de otra empresa responde `404`.

## Fuera de alcance

- Cambiar codigo.
- Probar UI de panel.
- Aprobar servicios desde admin.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-115-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Base URL y commit/deploy observado si esta disponible.
- Casos ejecutados y resultado.
- Evidencia de status `draft -> pending`.
- Riesgos o limitaciones.
- Recomendacion para Panel/Web Dev.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-115. Product/Architect debe leer tasks/TASK-115-HANDOFF.md.
```
