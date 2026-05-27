# TASK-015: Implementar POST /api/companies/register

## Equipo encargado

Backend API.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-015-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-015-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-003-HANDOFF.md`

Opcionales utiles:

- `docs/ADMIN_REGISTRATION_FLOW.md`
- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`
- `CONFIGURACION_AZURE_REGISTRO_EMAIL.md`

## Objetivo

Implementar el endpoint nuevo:

```text
POST /api/companies/register
```

para registrar una empresa gratis bajo el modelo `Company -> Services`, sin romper el endpoint existente:

```text
POST /api/register-provider
```

## Contexto

La API actual esta centrada en `Provider`.

El producto nuevo requiere:

```text
Company -> Services -> Leads
```

Decision Product/Architect:

- No seguir ampliando `Provider` como modelo final.
- Mantener endpoints provider actuales por compatibilidad.
- Crear endpoints nuevos `companies/*`.
- Usar Azure Table Storage como persistencia MVP.
- Registro inicial es gratis.
- La empresa queda en revision, no publicada automaticamente.

## Alcance

Se permite tocar:

- `api/companies-register/` o nombre equivalente coherente con Azure Functions.
- `api/shared/*` si hace falta reutilizar validaciones/config.
- `docs/API_CONTRACTS_MVP.md` si el contrato cambia levemente.
- `tasks/TASK-015-HANDOFF.md`

Tambien se permite crear:

- nuevo `function.json`,
- nuevo `index.js`,
- helpers pequenos si son claramente compartidos.

## Fuera de alcance

- No tocar pagina publica.
- No tocar `panel.html`, `admin.html` ni frontend.
- No implementar login/auth completo.
- No implementar CRUD de servicios todavia.
- No implementar upload de fotos.
- No borrar ni reemplazar `/api/register-provider`.
- No migrar datos existentes.

## Contrato esperado

Endpoint:

```text
POST /api/companies/register
```

Request:

```json
{
  "companyName": "Aurisbel Eventos",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos."
}
```

Response success:

```json
{
  "companyId": "company_...",
  "slug": "aurisbel-eventos",
  "status": "pending",
  "plan": "free"
}
```

Reglas:

- `companyName` requerido.
- `email` requerido y valido.
- `whatsapp` requerido.
- `province` requerido.
- `description` requerido.
- `plan = free`.
- `status = pending`.
- Crear `slug` unico.
- No publicar automaticamente.
- No devolver secretos.
- No guardar password en esta tarea.

## Persistencia esperada

Usar Azure Table Storage.

Tabla recomendada:

```text
Companies
```

Si la tabla no existe, usar el patron existente del repo si ya crea tablas al vuelo.

Entidad minima:

```json
{
  "PartitionKey": "company",
  "RowKey": "company_...",
  "id": "company_...",
  "slug": "aurisbel-eventos",
  "name": "Aurisbel Eventos",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "province": "Heredia",
  "canton": "San Francisco",
  "description": "Servicios para eventos.",
  "status": "pending",
  "plan": "free",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Para unicidad de slug, si no se implementa una tabla `CompanySlugs` todavia, documentar la limitacion y evitar sobrecomplicar. Preferible implementar slug unico basico si el patron actual del repo lo permite.

## Validaciones y errores

Errores esperados:

- `400` para JSON invalido o campos requeridos faltantes.
- `400` para email invalido.
- `405` si metodo no es POST.
- `500` para error no controlado.

Formato de error debe seguir helpers existentes si los hay.

## CORS / seguridad

- Respetar validacion de origins existente.
- No exponer connection strings.
- No imprimir secretos en logs.
- Mantener `authLevel` coherente con endpoints publicos actuales, pero validar origen con helpers existentes.

## Verificacion requerida

Local/estructural:

- Revisar sintaxis JS.
- Validar que `function.json` expone POST.
- Si se puede ejecutar localmente, probar request success y missing fields.

Git:

```text
git status --short
```

Debe mostrar solo archivos permitidos y handoff.

## Handoff requerido

Crear:

```text
tasks/TASK-015-HANDOFF.md
```

Debe incluir:

- Resumen.
- Archivos tocados.
- Endpoint creado.
- Contrato final.
- Validacion realizada.
- Riesgos.
- Pendientes.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-015. Product/Architect debe leer `tasks/TASK-015-HANDOFF.md`.
```

