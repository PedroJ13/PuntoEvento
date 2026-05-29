# TASK-115 Handoff

## Resultado general

Aprobado.

`submit-review` funciona en Azure real con sesion de empresa y Azure Table Storage. El smoke cubrio creacion de servicio, `draft -> pending`, reintento `pending -> 409`, campos faltantes `400`, sin sesion `401` y servicio de otra empresa `404`.

## Base URL y deploy observado

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Endpoint:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Commit/deploy observado: no disponible desde la respuesta HTTP consultada. Evidencia indirecta del deploy:

- `index.html` publicado referencia `app.js?v=21` y `styles.css?v=16`.
- `POST /api/companies/me/services/qa-nonexistent/submit-review` sin sesion responde `401`, confirmando que la ruta esta activa en Azure.

## Casos ejecutados y resultado

1. Crear sesion valida de empresa QA mediante invitacion interna: aprobado.
2. Crear servicio propio enviando `status: "published"`: aprobado, la API devolvio `status: "draft"`.
3. Completar campos minimos:
   - `name`;
   - `category`;
   - `eventTypes`;
   - `description`;
   - `priceFrom`.
4. Ejecutar `submit-review` sobre servicio `draft`: aprobado, `200`.
5. Confirmar response minimo: aprobado, llaves exactas `id,companyId,status,updatedAt`.
6. Reintentar `submit-review` sobre el mismo servicio ya `pending`: aprobado, `409`.
7. Intentar `submit-review` sobre servicio con campos minimos faltantes: aprobado, `400`.
8. Intentar sin sesion: aprobado, `401`.
9. Intentar con sesion de otra empresa sobre el servicio original: aprobado, `404`.

## Evidencia de status `draft -> pending`

Servicio QA creado:

```json
{
  "CompanyA": "company_e04c0711-14ae-42b0-8607-acbea4cdb252",
  "CreateStatus": "draft",
  "CreateId": "service_edb4e73e-dd26-4aa2-9601-5b614b26e465",
  "SubmitStatusCode": 200,
  "SubmitBody": {
    "id": "service_edb4e73e-dd26-4aa2-9601-5b614b26e465",
    "companyId": "company_e04c0711-14ae-42b0-8607-acbea4cdb252",
    "status": "pending",
    "updatedAtPresent": true
  }
}
```

Response exitoso:

```json
{
  "SubmitKeys": "id,companyId,status,updatedAt"
}
```

Negativos:

```json
{
  "ResubmitStatusCode": 409,
  "MissingCreateStatus": "draft",
  "MissingSubmitStatusCode": 400,
  "MissingFields": "eventTypes,description,priceFrom",
  "NoSessionStatusCode": 401,
  "OtherCompanyStatusCode": 404
}
```

Empresa usada para 404:

```json
{
  "CompanyB": "company_7c99f62b-ddcb-4c42-b2ac-3240d6399f82",
  "OtherCompanyStatusCode": 404
}
```

## Riesgos o limitaciones

- Se crearon datos QA reales en Azure para completar el smoke. Quedan como empresas/servicios pendientes de limpieza si Product / Release decide limpiar datos QA antes de demo.
- No se probo UI de panel empresa; esta tarea solo valida API real.
- No se aprobaron servicios desde admin, por estar fuera de alcance.
- La creacion de sesion uso invitaciones internas con credencial QA local; no se expusieron tokens ni cookies en el handoff.

## Recomendacion para Panel/Web Dev

El panel empresa ya puede integrar la accion explicita `Enviar a revision` contra:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Antes de llamar el endpoint, conviene validar/mostrar claramente los campos requeridos: `name`, `category`, al menos un `eventType`, `description` y `priceFrom`. Si el endpoint responde `409`, mostrar que el servicio ya esta en revision o no puede enviarse desde su estado actual.
