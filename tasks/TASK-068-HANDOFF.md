# TASK-068 HANDOFF - QA local endpoints publicos por servicio

## Resultado general

Aprobado con observaciones.

La validacion local/estructural de los endpoints publicos MVP por servicio paso:

- `GET /api/public/services`
- `GET /api/public/companies/{slug}`

Los handlers cumplen el contrato esperado con mocks locales:

- devuelven solo servicios `published`;
- excluyen servicios `draft`, `pending`, `rejected` e `inactive`;
- excluyen servicios de empresas no publicadas;
- filtran por `q`, `category`, `eventType` y `province`;
- respetan `limit` default y maximo `50`;
- devuelven `nextCursor: ""`;
- incluyen imagenes publicadas (`coverUrl`, `gallery`);
- no exponen campos privados o metadata interna en los payloads probados;
- el perfil publico devuelve `404` para empresa inexistente o no publicada;
- `selectedServiceSlug` solo se llena si el servicio publicado coincide.

No se hizo deploy, commit ni push.

## Comandos ejecutados

Validacion de sintaxis:

```powershell
node --check api/shared/publicCatalog.js
node --check api/public-services/index.js
node --check api/public-company-profile/index.js
```

Nota:

```text
El comando `node` del PATH fallo con Access is denied en PowerShell. Se repitio exitosamente usando el Node.js embebido de Codex:
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
```

Validacion JSON:

```powershell
Get-Content -Raw -Path api/public-services/function.json | ConvertFrom-Json | Out-Null
Get-Content -Raw -Path api/public-company-profile/function.json | ConvertFrom-Json | Out-Null
```

Validacion comportamiento con mocks:

```powershell
node -e "<harness QA con mocks de Companies/Services>"
```

Resultado del harness:

```json
{
  "ok": true,
  "caseCount": 10
}
```

## Configuracion validada

`api/public-services/function.json`:

```text
authLevel: anonymous
methods: ["get"]
route: public/services
```

`api/public-company-profile/function.json`:

```text
authLevel: anonymous
methods: ["get"]
route: public/companies/{slug}
```

`function.json` parsea correctamente en ambos endpoints.

## Casos probados

### `GET /api/public/services`

Casos cubiertos con mocks:

- Metodo `POST` contra handler responde `405`.
- `GET` responde `200`.
- Forma de respuesta:

```json
{
  "items": [],
  "nextCursor": ""
}
```

- Default `limit` devuelve maximo `20` items.
- `limit=1` devuelve 1 item.
- `limit=999` queda limitado a `50`.
- `cursor` queda reservado y devuelve `nextCursor: ""`.
- Servicio `published` de empresa `published` aparece.
- Servicios `pending`, `rejected`, `draft` e `inactive` no aparecen.
- Servicio `published` de empresa no publicada no aparece.
- `q` filtra por:
  - `name` (`mesa dulce`);
  - `description` (`decorada`);
  - `category` (`reposteria`);
  - `eventTypes` (`baby shower`).
- `category` filtra por categoria normalizada.
- `eventType` filtra por tipo de evento normalizado.
- `province` filtra por provincia de empresa normalizada.
- Cada item incluye datos publicos de empresa.
- `coverUrl` y `gallery` publicados se devuelven cuando existen.
- No se detecto exposicion de:
  - `email`;
  - `phone`;
  - `sessionHash`;
  - `tokenHash`;
  - `partitionKey`;
  - `rowKey`;
  - `pendingBlobName`;
  - valores con `uploads-pending`;
  - connection strings/account keys.

### `GET /api/public/companies/{slug}`

Casos cubiertos con mocks:

- Metodo `POST` contra handler responde `405`.
- Empresa publicada responde `200`.
- Empresa inexistente responde `404`.
- Empresa no publicada responde `404`.
- Incluye solo servicios publicados de esa empresa.
- Excluye servicios `pending`, `rejected`, `draft` e `inactive`.
- `?service=mesa-dulce` devuelve `selectedServiceSlug: "mesa-dulce"`.
- `?service=no-existe` devuelve `selectedServiceSlug: ""`.
- `?service=pendiente` devuelve `selectedServiceSlug: ""` porque no esta publicado.
- No se detecto exposicion de campos privados o metadata interna en el perfil.

## Hallazgos

### Observacion - posible diferencia runtime para `405`

Archivos:

- `api/public-services/function.json:8`
- `api/public-company-profile/function.json:8`
- `api/shared/publicCatalog.js:186`
- `api/shared/publicCatalog.js:234`

Detalle:

Los handlers implementan `405` cuando el metodo no es `GET`. Sin embargo, ambos `function.json` declaran solo:

```json
"methods": ["get"]
```

En Azure Functions, esa restriccion puede impedir que un `POST` llegue al handler y el runtime podria responder `404`/no route antes de ejecutar la validacion interna. En QA local directa del handler, `POST` respondio `405`; queda como punto a confirmar en QA Azure post-deploy.

Severidad:

```text
P3 / observacion no bloqueante para commit local, pero conviene probarlo explicitamente en Azure.
```

## Riesgos restantes

- No se ejecuto contra Azure real ni contra Azure Functions runtime local; la prueba fue estructural y con mocks.
- El endpoint usa scan de `Services` publicados y lookup de empresa por `companyId`; es aceptable para MVP, pero no escala como busqueda/ranking final.
- `cursor` queda reservado y no implementa paginacion real.
- Orden/ranking avanzado, destacados y pagos quedan fuera de alcance.
- La respuesta `405` para metodos no GET debe confirmarse en runtime real por la observacion anterior.

## Archivos tocados

- `tasks/TASK-068-HANDOFF.md`

No se modifico codigo de la aplicacion.

## Recomendacion clara

Listo para commit/push desde QA local/estructural.

Antes de marcar QA Azure como cerrado, Product/Architect deberia pedir que se confirme post-deploy:

- `GET /api/public/services` con datos reales publicados;
- `GET /api/public/companies/{slug}` con datos reales publicados;
- comportamiento real de `POST`/metodos no permitidos, por la posible diferencia entre handler `405` y routing de Azure Functions.
