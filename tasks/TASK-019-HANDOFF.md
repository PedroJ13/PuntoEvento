# TASK-019: Infra verificacion Table Storage Companies

## Equipo

Infra Azure.

## Estado

Completada.

## Resultado general

La persistencia del registro exitoso de TASK-018 quedo confirmada en Azure Table Storage.

Se confirmo:

- La tabla `Companies` existe.
- La entidad QA existe.
- Los campos principales esperados estan persistidos.
- No se detectaron secretos en la entidad.
- `AZURE_TABLE_COMPANIES` no esta configurada, pero el codigo usa default `Companies`, por lo que no es obligatorio para operar.

## Lectura requerida

Se leyeron:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-017-HANDOFF.md`
- `tasks/TASK-018-HANDOFF.md`
- `tasks/TASK-015-HANDOFF.md`
- `api/shared/config.js`

## Comandos/acciones ejecutadas

Consulta de tablas:

```text
az storage table list --account-name storagepuntoevento --auth-mode login --query "[].name" --output json
```

Consulta de app settings por nombre, sin valores:

```text
az staticwebapp appsettings list --name puntoevento --resource-group resource_group_main --query "keys(properties)" --output json
```

Consulta de entidad QA:

```text
az storage entity show --account-name storagepuntoevento --auth-mode key --table-name Companies --partition-key company --row-key company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2 --output json
```

Nota:

```text
La lectura de entidad con --auth-mode login fallo por falta de rol Table Data Reader/Contributor.
Se uso --auth-mode key mediante Azure CLI para leer solo la entidad QA. No se imprimieron storage keys ni connection strings en este handoff.
```

## Existencia de tabla Companies

Tablas encontradas:

```text
Companies
Providers
ProvidersImages
```

Resultado:

```text
Companies existe.
```

Esto confirma que el primer `POST` valido creo la tabla al vuelo, como esperaba el codigo.

## Existencia de entidad QA

Entidad buscada:

```text
PartitionKey = company
RowKey = company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
```

Resultado:

```text
Entidad QA encontrada.
```

## Campos verificados

Entidad persistida:

```json
{
  "PartitionKey": "company",
  "RowKey": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "id": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "name": "QA Company Register Test",
  "email": "qa-company-register-test@example.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Registro creado por QA para validar el endpoint companies/register.",
  "slug": "qa-company-register-test",
  "status": "pending",
  "plan": "free",
  "createdAt": "2026-05-27T17:14:48.389Z",
  "updatedAt": "2026-05-27T17:14:48.389Z"
}
```

Campos requeridos:

- Nombre: presente como `name`.
- Email: presente.
- WhatsApp: presente.
- Province: presente.
- Canton: presente.
- Description: presente.
- Slug: presente.
- Status: `pending`.
- Plan: `free`.
- CreatedAt: presente.
- UpdatedAt: presente.

## Revision de datos sensibles

No se detectaron campos sensibles en la entidad:

- No hay password plano.
- No hay tokens.
- No hay connection strings.
- No hay storage keys.

Resultado:

```text
Sin hallazgos P1 por secretos persistidos.
```

## Estado variable AZURE_TABLE_COMPANIES

App settings actuales por nombre:

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

Codigo revisado en `api/shared/config.js`:

```js
const DEFAULT_COMPANIES_TABLE = "Companies";
...
companiesTable:
  process.env.AZURE_TABLE_COMPANIES || DEFAULT_COMPANIES_TABLE,
```

Conclusion:

```text
No es necesario configurar AZURE_TABLE_COMPANIES para que el endpoint funcione con la tabla Companies.
```

Recomendacion:

```text
Configurar AZURE_TABLE_COMPANIES=Companies es opcional, pero recomendable para hacer explicito el contrato infra y evitar dudas operativas.
```

No se cambio la configuracion en esta tarea.

## Riesgos

- La cuenta/usuario Azure actual puede listar tablas con login, pero no leer entidades con RBAC. Para operar sin account key, asignar rol `Storage Table Data Reader` o `Storage Table Data Contributor` segun necesidad.
- La entidad QA queda en estado `pending`; si no se limpia luego, puede aparecer en vistas admin futuras.
- La unicidad de slug no es atomica todavia; riesgo ya documentado por Backend/QA.
- El endpoint sigue siendo anonimo; antes de abrirlo mas ampliamente faltan controles anti-abuso.

## Pendientes

- Product/Architect debe decidir si se conserva o limpia el registro QA:
  - `company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2`
- Si se desea operar con RBAC en vez de account key, asignar permisos Table Data al usuario/admin correspondiente.
- Opcional: agregar app setting `AZURE_TABLE_COMPANIES=Companies`.
- Definir si se implementara tabla `CompanySlugs` para unicidad atomica.

## Recomendacion sobre limpieza futura del registro QA

No borrar en esta tarea.

Recomendacion:

```text
Crear una tarea posterior de limpieza QA o marcar registros QA con un campo/convencion que permita excluirlos de vistas productivas.
```

Si se decide borrar, hacerlo de forma controlada desde una tarea especifica y documentar el impacto.

## Recomendacion para Product/Architect

Marcar la verificacion de persistencia de TASK-019 como aprobada.

Siguiente decision recomendada:

```text
Definir autenticacion de empresa para desbloquear GET /api/companies/me y CRUD de servicios.
```

Tambien recomiendo hacer explicito:

```text
AZURE_TABLE_COMPANIES=Companies
```

en Azure Static Web Apps, aunque el default actual ya funciona.

