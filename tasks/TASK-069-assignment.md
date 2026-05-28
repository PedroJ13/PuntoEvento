# TASK-069: QA/Infra Azure endpoints publicos por servicio

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-068` aprobo local/estructuralmente los endpoints publicos MVP:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Product/Architect debe hacer commit/push del bloque antes de que ejecutes esta tarea. Espera a que el deploy de Azure Static Web Apps termine para el commit que agrega estos endpoints.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-067-HANDOFF.md`
- `tasks/TASK-068-HANDOFF.md`

## Objetivo

Validar en Azure real que los endpoints publicos por servicio funcionan con datos publicados reales y no exponen informacion privada.

## Precondicion

Antes de probar, confirmar que el workflow/deploy de Azure termino para el commit que incluye:

- `api/public-services`
- `api/public-company-profile`
- `api/shared/publicCatalog.js`

## Datos sugeridos

Puedes usar la empresa QA ya publicada si sigue disponible:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
slug: qa-company-register-test
```

Tambien puedes crear datos QA controlados usando el flujo ya validado:

1. Crear/usar invitacion de empresa.
2. Crear servicio.
3. Subir/confirmar imagen.
4. Aprobar empresa, servicio e imagen.
5. Consultar endpoints publicos.

No escribas credenciales, cookies, SAS tokens ni secretos en el handoff.

## Alcance de pruebas

Validar `GET /api/public/services`:

- Responde `200` con:

```json
{
  "items": [],
  "nextCursor": ""
}
```

- Incluye al menos un servicio publicado real si existen datos QA publicados.
- No incluye servicios no publicados.
- No incluye servicios de empresas no publicadas.
- `q` filtra por nombre/descripcion/categoria/tipos de evento.
- `category` filtra por categoria.
- `eventType` filtra por tipo de evento.
- `province` filtra por provincia de empresa.
- `limit` respeta maximo `50`.
- `cursor` responde `nextCursor: ""`.
- Incluye `coverUrl`/`gallery` publicos cuando existan.
- Si hay imagen publicada, confirmar que `coverUrl` responde `200` y es imagen.

Validar `GET /api/public/companies/{slug}`:

- Empresa publicada responde `200`.
- Empresa inexistente responde `404`.
- Empresa no publicada responde `404` si tienes dato controlado.
- Incluye solo servicios publicados.
- `?service=<serviceSlug>` setea `selectedServiceSlug` solo si el servicio publicado existe.
- `?service=no-existe` devuelve `selectedServiceSlug: ""`.

Validar seguridad:

- Las respuestas no deben exponer:
  - `email`
  - `phone` si sigue fuera del contrato publico
  - cookies
  - `sessionHash`
  - `tokenHash`
  - `partitionKey`
  - `rowKey`
  - `pendingBlobName`
  - `uploads-pending`
  - connection strings
  - account keys
  - SAS tokens

Validar metodos no permitidos:

- Probar `POST` contra ambos endpoints.
- Documentar si Azure responde `404`, `405` u otro status.
- No bloquear si Azure responde `404` por routing de Functions, siempre que `GET` funcione y no exponga datos.

## Fuera de alcance

- No conectar frontend.
- No cambiar codigo.
- No limpiar datos QA.
- No probar ranking pago.
- No rotar credenciales admin en esta tarea.

## Entregable

Crear:

```text
tasks/TASK-069-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL base Azure usada.
- Commit/deploy validado si lo tienes visible.
- Endpoints probados y status HTTP.
- Datos QA usados, sin secretos.
- Payloads resumidos o redactados.
- Confirmacion de que no hay campos privados.
- Hallazgos y riesgos restantes.
- Recomendacion:
  - listo para Frontend/Web Dev conectar pagina publica, o
  - requiere fix Backend/Infra antes de avanzar.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-069. Product/Architect debe leer tasks/TASK-069-HANDOFF.md.
```
