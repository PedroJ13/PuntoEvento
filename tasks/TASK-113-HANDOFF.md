# TASK-113 Handoff

## Resultado general

Aprobado local/estructural.

El endpoint `submit-review` y las reglas de estado de servicios cumplen el contrato revisado con mocks locales. No se hicieron cambios de codigo.

## Archivos/endpoints revisados

- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-111-HANDOFF.md`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`
- `api/company-services-submit-review/index.js`
- `api/company-services-submit-review/function.json`
- `api/shared/azure.js`
- `api/shared/companyAuth.js`
- `api/shared/guard.js`
- `api/shared/http.js`
- `api/shared/validation.js`

Endpoint validado:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

## Validaciones estructurales

Pasaron:

```text
node --check api/company-services-create/index.js
node --check api/company-services-update/index.js
node --check api/company-services-submit-review/index.js
ConvertFrom-Json api/company-services-submit-review/function.json
```

Evidencia de ruta/metodo desde `function.json`:

```json
{
  "route": "companies/me/services/{serviceId}/submit-review",
  "methods": "post"
}
```

## Casos ejecutados y resultado

Todos pasaron con tabla en memoria, sesion simulada y handlers reales:

1. `POST /api/companies/me/services` con `status: "published"` crea `draft`.
2. `PATCH /api/companies/me/services/{serviceId}` solo con `status` responde `400`.
3. `PATCH` con `status` y campos editables ignora `status`.
4. `PATCH` de servicio `published` con cambio de contenido publico lo devuelve a `draft`.
5. `PATCH` de servicio `pending` y `rejected` con cambio de contenido publico los devuelve a `draft` y limpia `rejectionReason`.
6. `submit-review` desde `draft` con campos minimos completos responde `200` y deja `pending`.
7. `submit-review` desde `rejected` con campos minimos completos responde `200` y deja `pending`.
8. `submit-review` desde `published`, `pending` e `inactive` responde `409`.
9. `submit-review` sin campos minimos responde `400` e indica faltantes: `name`, `category`, `eventTypes`, `description`, `priceFrom`.
10. Servicio de otra empresa responde `404`.
11. Sin sesion responde `401`.
12. Response exitoso de `submit-review` contiene solo `id`, `companyId`, `status`, `updatedAt`; no incluye campos internos ni payload completo del servicio.

Resumen del script local:

```json
{
  "ok": true,
  "passed": 12,
  "failed": 0
}
```

## Riesgos pendientes

- No se ejecuto Azure Functions runtime real.
- No se probo contra Azure Table Storage real.
- La prueba local usa mocks para sesion, tablas y CORS; valida logica de handlers, no integracion de infraestructura.
- El contrato actual permite crear servicio con `eventTypes: []`, pero `submit-review` exige al menos un `eventType`; esto esta alineado con la tarea, aunque el panel debe comunicarlo claramente.

## Recomendacion para siguiente tarea

Continuar con una tarea de Panel empresa para exponer la accion `Enviar a revision`, quitar el control editable de `Estado` si sigue visible y mostrar validaciones de campos minimos antes de llamar `submit-review`.
