# TASK-131 Handoff - Deploy Round 2 Azure

## Resultado general

Aprobado.

Se hizo commit y push de los cambios runtime Round 2 a `main`. Azure Static Web Apps ya sirve las versiones nuevas de pagina publica, panel empresa y admin, y la API desplegada ya bloquea aprobar servicios de empresas no publicadas con `409`.

QA puede repetir `TASK-128`, `TASK-129` y `TASK-130`.

## Commit / branch desplegado

Branch:

```text
main
```

Commit previo local:

```text
61828fd
```

Commit desplegado:

```text
49bb02b975adc12eca7b57c4395a3cd12b31a1f1
```

Mensaje:

```text
Deploy Round 2 runtime changes
```

Archivos runtime incluidos en el commit:

```text
index.html
app.js
styles.css
panel.html
panel.js
panel.css
admin.html
admin.js
admin.css
api/shared/internalModeration.js
api/shared/publicCatalog.js
api/shared/serviceUploadRules.js
api/uploads-sign/index.js
```

No se incluyeron docs/tareas no relacionadas en el commit de deploy.

## Ambiente

```text
Azure Static Web Apps: https://zealous-field-08fdd720f.7.azurestaticapps.net
Fecha UTC de verificacion: 2026-05-30T13:35Z aprox.
```

## Versiones observadas en Azure

Consulta directa a HTML publicado:

| Archivo | Version esperada | Resultado |
| --- | --- | --- |
| `/index.html` | `app.js?v=22` | OK |
| `/index.html` | `styles.css?v=17` | OK |
| `/panel.html` | `panel.js?v=5` | OK |
| `/panel.html` | `panel.css?v=5` | OK |
| `/admin.html` | `admin.js?v=13` | OK |
| `/admin.html` | `admin.css?v=8` | OK |

## Checks locales antes de deploy

Se usó el Node bundled porque el `node` del entorno WindowsApps devolvió `Access is denied`.

Checks OK:

```text
node --check app.js
node --check panel.js
node --check admin.js
node --check api/shared/internalModeration.js
node --check api/uploads-sign/index.js
node --check api/shared/publicCatalog.js
node --check api/shared/serviceUploadRules.js
```

## Smoke API Azure

### Busqueda publica por empresa

Endpoint:

```text
GET /api/public/services?q=Demo%20Owner%20Jardines%20del%20Sol
```

Resultado:

```text
HTTP 200
items: 1
Primer resultado: Servicio 1
```

Esto confirma que la API desplegada ya busca por empresa cuando existe servicio publicado.

### Bloqueo de aprobacion fuera de orden

Como no habia un candidato existente de servicio pendiente ligado a empresa pendiente, se creo un dato temporal minimo para smoke y se limpio con soft reject.

Entidad temporal:

```text
Company: company_d51455d9-7465-4a70-bca5-062f64303105
Service: service_74b767b7-ba59-483c-a681-7a5746baeb66
```

Flujo:

```text
POST /api/companies/register -> 201
POST /api/internal/company-invites -> 201
POST /api/company-auth/accept-invite -> 200
POST /api/companies/me/services -> 201
POST /api/companies/me/services/{serviceId}/submit-review -> 200
POST /api/internal/services/{companyId}/{serviceId}/approve -> 409
POST /api/internal/services/{companyId}/{serviceId}/reject -> 200
POST /api/internal/companies/{companyId}/reject -> 200
```

Validacion post-limpieza:

```text
remainingTask131Companies: 0
remainingTask131Services: 0
```

No se imprimieron credenciales, tokens, cookies ni invite URLs.

## Deploy

Acciones ejecutadas:

```text
git add <archivos runtime Round 2>
git commit -m "Deploy Round 2 runtime changes"
git push origin main
```

El push a `main` disparo el flujo de Azure Static Web Apps. La confirmacion final se hizo contra la URL publicada de Azure por versiones de assets y smokes HTTP.

## Riesgos / pendientes

- No se repitio toda la matriz QA; solo se confirmaron versiones y smokes minimos de release.
- Se creo un dato temporal de smoke para validar el `409`; ya fue rechazado por soft cleanup.
- Quedan cambios locales de docs/tareas no incluidos en el commit de deploy.
- `gh` no esta instalado en la terminal, por eso no se consulto el run con GitHub CLI. La evidencia principal es que Azure ya sirve assets y API nuevos.

## Recomendacion

QA debe repetir:

```text
TASK-128
TASK-129
TASK-130
```

Prioridad recomendada:

1. `TASK-130`, para confirmar de nuevo el P0 `approve service with pending company -> 409`.
2. `TASK-128`, para busqueda publica y filtros limpios.
3. `TASK-129`, para imagenes multiples del panel empresa.
