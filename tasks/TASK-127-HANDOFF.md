# TASK-127 Handoff

## Resultado general

Implementadas las reglas backend Round 2 para moderacion, uploads de servicio y busqueda publica.

La API ahora bloquea aprobaciones fuera de orden, valida limites de imagenes por servicio desde backend, y permite que `GET /api/public/services?q=...` encuentre servicios publicados por nombre o slug de empresa publicada.

## Endpoints modificados

- `POST /api/internal/services/{companyId}/{serviceId}/approve`
  - Ahora responde `409` si la empresa asociada no existe como publicada o su `status` no es `published`.
  - Mensaje: `Company must be published before approving services`.

- `POST /api/internal/uploads/{companyId}/{uploadId}/approve`
  - Ahora responde `409` si la empresa asociada no esta `published`.
  - Si `scope=service`, ahora responde `409` si el servicio asociado no esta `published`.
  - Si `scope=service`, valida maximo 10 imagenes activas o pendientes por servicio.
  - Si `scope=service` e `imageType=cover`, valida que no exista otro cover activo o pendiente.

- `POST /api/uploads/sign`
  - Para `scope=service`, valida maximo 10 uploads activos o pendientes antes de reservar una imagen nueva.
  - Para `scope=service` e `imageType=cover`, bloquea un segundo cover activo o pendiente.
  - Las reservas `reserved` vencidas no cuentan para el limite.

- `GET /api/public/services`
  - `q` ahora busca tambien por `company.name` y `company.slug`, ademas de nombre, descripcion, categoria y tipos de evento del servicio.

## Archivos modificados

- `api/shared/internalModeration.js`
- `api/shared/publicCatalog.js`
- `api/shared/serviceUploadRules.js`
- `api/uploads-sign/index.js`
- `tasks/TASK-127-HANDOFF.md`

## Casos verificados

Checks sintacticos:

- `node --check api/shared/internalModeration.js`
- `node --check api/uploads-sign/index.js`
- `node --check api/shared/publicCatalog.js`
- `node --check api/shared/serviceUploadRules.js`

Scripts locales con mocks:

- Aprobar servicio con empresa `pending` responde `409`.
- Aprobar servicio con empresa `rejected` responde `409`.
- Aprobar servicio con empresa `published` responde `200` y actualiza servicio a `published`.
- Aprobar upload de servicio con empresa `pending` responde `409`.
- Aprobar upload de servicio con servicio `draft` responde `409`.
- Reservar imagen de servicio numero 11 responde `409`.
- Reservar segundo cover de servicio responde `409`.
- `GET /api/public/services?q=Demo Owner Jardines del Sol` encuentra un servicio publicado de esa empresa publicada.

## Riesgos o decisiones pendientes

- No se ejecuto Azure Functions runtime real ni pruebas contra Azure Table Storage real.
- El bloqueo de segundo cover es estricto: si un servicio ya tiene cover publicado, no permite reservar otro cover pendiente. Esto sigue la regla de "maximo un cover activo o pendiente", pero Product/Architect debe definir luego un flujo explicito de reemplazo de cover si se quiere permitir cambiarlo sin retirar primero el anterior.
- La busqueda publica sigue usando escaneo MVP de servicios publicados y lookup de empresa por servicio; para volumen mayor conviene `ServiceIndex` o buscador dedicado.
- Los limites de imagenes se validan al reservar y aprobar, pero no hay cleanup implementado aqui para reservas vencidas antiguas; esas reservas vencidas no cuentan, pero siguen pudiendo existir en tabla hasta una tarea de limpieza.

## Recomendacion para QA

QA debe validar contra Functions local o entorno staging:

- Aprobar servicio con empresa `pending`, `rejected` y `published`.
- Aprobar upload `scope=company` con empresa no publicada.
- Aprobar upload `scope=service` con empresa publicada y servicio no publicado.
- Crear 10 uploads de servicio entre `reserved`, `pending` y `published`; confirmar que el upload 11 se bloquea.
- Crear un cover `pending` o `published`; confirmar que otro cover se bloquea.
- Buscar `Demo Owner Jardines del Sol` en `/api/public/services` y confirmar que aparecen servicios publicados de esa empresa si existen.
