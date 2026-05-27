# TASK-017: Infra post-deploy Companies register

## Equipo

Infra Azure.

## Estado

Completada con bloqueo de verificacion endpoint.

## Resultado general

La infraestructura base sigue lista, pero el endpoint nuevo:

```text
/api/companies/register
```

todavia devuelve:

```text
404 Not Found
```

en el smoke no mutante `GET`, aun despues de confirmar que `main` remoto contiene el commit:

```text
2c0cf3e Add company registration API
```

No se ejecuto `POST` real porque la asignacion indica no hacerlo salvo autorizacion de Product/Architect.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-016-HANDOFF.md`
- `CONFIGURACION_AZURE_REGISTRO_EMAIL.md`
- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`

## Estado deploy

Repositorio remoto:

```text
origin/main = 2c0cf3e2ea684fde09b3ddc4c5e8f1bd70a889fc
```

Ultimo commit local:

```text
2c0cf3e Add company registration API
```

Static Web App:

```text
Nombre: puntoevento
Resource group: resource_group_main
Environment: default
Status: Ready
Hostname: zealous-field-08fdd720f.7.azurestaticapps.net
Last updated: 2026-05-27T17:03:56Z
```

El workflow local mantiene:

```yaml
app_location: "/"
api_location: "api"
output_location: "/"
api_build_command: "npm install"
skip_app_build: true
```

Nota:

```text
No se pudo confirmar el run de GitHub Actions por `gh` porque GitHub CLI no esta instalado.
El conector GitHub no devolvio workflow runs para el SHA, pero Azure Static Web Apps reporta environment Ready actualizado.
```

## Estado endpoint

Funcion local:

```text
api/companies-register/function.json
```

Config local:

```json
{
  "methods": ["post"],
  "route": "companies/register",
  "authLevel": "anonymous"
}
```

Smoke ejecutado:

```text
GET https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Resultado:

```text
HTTP/1.1 404 Not Found
```

Interpretacion:

```text
El criterio de TASK-017 no queda aprobado.
La ruta sigue sin aparecer disponible para el smoke GET.
```

Posibles causas:

- Azure Static Web Apps puede estar devolviendo `404` para metodos no permitidos en funciones `POST`-only, en vez de `405`.
- La funcion nueva puede no estar incluida en el bundle de API desplegado aunque el environment este `Ready`.
- Puede existir limitacion o comportamiento con rutas anidadas; el proyecto ya agrego rutas planas fallback para endpoints admin por problemas similares.

No se ejecuto `POST` invalido/no mutante para distinguir estas causas porque la asignacion pidio no ejecutar POST real sin autorizacion.

## Estado tabla Companies

Tablas actuales en `storagepuntoevento`:

```text
Providers
ProvidersImages
```

No existe:

```text
Companies
```

Estado:

```text
La tabla Companies no existe todavia.
```

El codigo incluye creacion al vuelo:

```text
ensureCompaniesTable(config)
```

por lo que el endpoint deberia poder crear la tabla automaticamente en el primer `POST` valido si la API esta desplegada y las credenciales tienen permisos.

## Estado variable AZURE_TABLE_COMPANIES

App settings actuales, por nombre:

```text
ADMIN_PASSWORD
ADMIN_USERNAME
ALLOWED_ORIGINS
APP_PUBLIC_URL
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_PENDING_CONTAINER
AZURE_STORAGE_PUBLIC_CONTAINER
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDER_IMAGES
AZURE_TABLE_PROVIDERS
NOTIFICATION_EMAIL_TO
```

No existe:

```text
AZURE_TABLE_COMPANIES
```

El codigo define default:

```text
DEFAULT_COMPANIES_TABLE = "Companies"
```

Conclusion:

```text
No es obligatorio configurar AZURE_TABLE_COMPANIES si se acepta el default `Companies`.
```

## Verificacion realizada

Comandos/acciones:

```text
git log --oneline -5
git ls-remote origin refs/heads/main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
az storage table list --account-name storagepuntoevento --auth-mode login
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --query "keys(properties)"
curl -i https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Resultado relevante:

```text
Deploy environment Ready.
main remoto contiene 2c0cf3e.
Companies no existe.
AZURE_TABLE_COMPANIES no existe.
GET /api/companies/register devuelve 404.
```

## Riesgos

- El endpoint puede no estar realmente desplegado aunque Azure environment este `Ready`.
- Si Azure devuelve `404` para metodo no permitido, el smoke recomendado no distingue entre ruta ausente y metodo no permitido.
- Como `Companies` no existe, la primera prueba real dependera de creacion automatica de tabla por la Function.
- No hay `AZURE_TABLE_COMPANIES`; se depende del default del codigo.
- No hay CAPTCHA/rate limiting para el endpoint anonimo.
- No hay tabla `CompanySlugs`; unicidad de slug no es atomica.

## Pendientes

- Product/Architect debe autorizar uno de estos caminos:
  - QA ejecuta `POST /api/companies/register` real con payload controlado.
  - Infra ejecuta un `POST` no mutante/invalid payload para confirmar si la ruta existe sin crear entidad.
  - Backend agrega ruta plana fallback, por ejemplo `/api/companies-register`, si se confirma problema de rutas anidadas.
- Confirmar en GitHub Actions que el workflow del commit `2c0cf3e` termino exitosamente.
- Si Product/Architect quiere evitar dependencia de creacion al vuelo, crear tabla `Companies` explicitamente en Azure.
- Opcional: configurar `AZURE_TABLE_COMPANIES=Companies` para hacer explicito el contrato infra.

## Recomendacion para Product/Architect

No pasar TASK-017 como verde todavia.

Recomendacion inmediata:

```text
Autorizar a QA o Infra a ejecutar POST controlado contra /api/companies/register.
```

Si el POST controlado tambien devuelve `404`, pedir a Backend revisar despliegue/routing y considerar fallback plano, como se hizo con endpoints admin.

Si el POST devuelve `400` con payload invalido o `201` con payload valido, entonces el endpoint existe y el smoke GET no era suficiente por comportamiento de Azure Static Web Apps con metodos no permitidos.

