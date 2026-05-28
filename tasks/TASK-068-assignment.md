# TASK-068: QA local endpoints publicos por servicio

## Equipo asignado

QA.

## Contexto

Backend completo `TASK-067` con dos endpoints publicos MVP:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Estos endpoints deben permitir que la pagina publica busque por servicio, por ejemplo "mesa dulce", y muestre servicios publicados con contexto de empresa.

No se debe hacer commit/push/deploy de este bloque hasta pasar QA local/estructural.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-067-HANDOFF.md`
- `api/shared/publicCatalog.js`
- `api/public-services/function.json`
- `api/public-services/index.js`
- `api/public-company-profile/function.json`
- `api/public-company-profile/index.js`
- `api/shared/azure.js`
- `api/shared/config.js`

## Objetivo

Validar local/estructuralmente que los endpoints publicos por servicio cumplen contrato antes de commit/push/deploy.

## Alcance de pruebas

Validar sintaxis y configuracion:

- `node --check` de:
  - `api/shared/publicCatalog.js`
  - `api/public-services/index.js`
  - `api/public-company-profile/index.js`
- `function.json` validos.
- Rutas esperadas:
  - `public/services`
  - `public/companies/{slug}`
- Metodo permitido `GET`.
- Metodo distinto de `GET` responde `405`.
- No requieren autenticacion.

Validar `GET /api/public/services`:

- Responde `200` con forma:

```json
{
  "items": [],
  "nextCursor": ""
}
```

- Solo incluye servicios `published`.
- Excluye servicios `draft`, `pending`, `rejected` o `inactive`.
- Excluye servicios cuya empresa no esta `published`.
- Incluye datos publicos de empresa dentro de cada servicio.
- `q` filtra por `name`, `description`, `category` y `eventTypes`.
- `category` filtra por categoria normalizada.
- `eventType` filtra por tipo de evento normalizado.
- `province` filtra por provincia de empresa normalizada.
- `limit` respeta default y maximo razonable de `50`.
- `cursor` queda reservado y responde `nextCursor: ""`.
- `coverUrl` y `gallery` publicados se devuelven cuando existen.

Validar `GET /api/public/companies/{slug}`:

- Empresa publicada responde `200`.
- Empresa inexistente responde `404`.
- Empresa no publicada responde `404`.
- Incluye solo servicios publicados de esa empresa.
- `?service=<serviceSlug>` devuelve `selectedServiceSlug` cuando coincide con un servicio publicado.
- Si `service` no coincide o no esta publicado, `selectedServiceSlug` debe ser `""`.

Validar seguridad de respuesta:

- No exponer:
  - `email`
  - `phone` si se considera privado segun contrato actual
  - cookies
  - `sessionHash`
  - `tokenHash`
  - `partitionKey`
  - `rowKey`
  - `pendingBlobName`
  - connection strings
  - account keys
  - metadata interna de Table/Blob
- No devolver imagenes pendientes.

## Datos sugeridos para mocks

Usa mocks locales de `Companies` y `Services` con al menos:

- Empresa publicada A con dos servicios publicados.
- Empresa publicada A con un servicio pendiente/rechazado.
- Empresa no publicada B con un servicio publicado.
- Servicio con `coverUrl` y `gallery`.
- Servicio con categoria/tipos de evento buscables.
- Empresa con provincia distinta para filtro.

## Fuera de alcance

- No hacer deploy.
- No probar Azure real todavia.
- No conectar frontend.
- No probar ranking pago.
- No implementar cambios de codigo salvo que encuentres un bug y lo reportes como bloqueante.

## Entregable

Crear:

```text
tasks/TASK-068-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Comandos ejecutados.
- Casos probados.
- Hallazgos con archivo y linea si aplica.
- Riesgos restantes.
- Recomendacion clara:
  - listo para commit/push, o
  - requiere ajuste Backend antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-068. Product/Architect debe leer tasks/TASK-068-HANDOFF.md.
```
