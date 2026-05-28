# TASK-065: Infra Azure public image access

## Equipo asignado

Infra Azure.

## Contexto

`TASK-064` aprobo en Azure real los endpoints internos de moderacion:

- Empresas: approve/reject.
- Servicios: approve/reject.
- Uploads: approve/reject.

La observacion importante fue de infraestructura/storage: el endpoint aprobo uploads y devolvio `publicBlobUrl` sin SAS, pero el `GET` directo a esa URL respondio `409`.

Esto significa que las imagenes aprobadas no van a renderizar en la pagina publica si el frontend consume `publicBlobUrl` directamente.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-002-HANDOFF.md`
- `tasks/TASK-064-HANDOFF.md`

## Objetivo

Resolver o dejar listo para resolver el acceso publico de imagenes aprobadas en Azure Blob Storage.

## Decision de producto actual

Para el MVP cerrado, la decision documentada es:

- `uploads-pending`: privado.
- `public`: lectura publica solo para imagenes aprobadas.

Si Infra recomienda otra estrategia, debe explicarla claramente con impacto en costo, seguridad, complejidad y cambios necesarios en backend/frontend.

## Alcance

1. Confirmar el estado actual del Storage Account:
   - `allowBlobPublicAccess`.
   - Nivel de acceso anonimo del container `public`.
   - Nivel de acceso del container `uploads-pending`.
2. Recomendar una de estas opciones:
   - Opcion A: habilitar public blob access en la cuenta y acceso anonimo tipo blob/container solo para `public`.
   - Opcion B: mantener storage privado y servir imagenes por proxy/API.
   - Opcion C: mantener storage privado y generar URLs de lectura firmadas para imagenes publicadas.
   - Opcion D: usar CDN/front door u otra capa, si realmente aporta para MVP.
3. Si eliges Opcion A y tienes permisos, aplicar el cambio de forma limitada:
   - No hacer publico `uploads-pending`.
   - Solo permitir lectura anonima del container `public`.
4. Validar con una URL real de `TASK-064` o con un blob QA controlado:
   - `GET publicBlobUrl` debe devolver `200`.
   - No debe requerir SAS.
   - No debe exponer listado de blobs si se configura solo acceso blob.
5. Revisar si hace falta ajustar CORS o cache headers para render web.

## Reglas de seguridad

- No incluir connection strings, account keys, SAS tokens ni credenciales en el handoff.
- No cambiar secretos.
- No borrar blobs QA.
- No hacer cambios amplios de storage sin justificar.
- Si no tienes permisos para aplicar cambios, documenta exactamente que debe cambiar el Product/Owner en Azure Portal.

## Fuera de alcance

- No cambiar codigo de backend salvo que concluyas que la estrategia elegida requiere una tarea Backend separada.
- No cambiar frontend.
- No implementar CDN si no es necesario para MVP.
- No limpiar datos QA.

## Entregable

Crear:

```text
tasks/TASK-065-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con cambios aplicados / bloqueado.
- Estado actual encontrado en Storage Account y containers.
- Decision/recomendacion elegida.
- Cambios aplicados o pasos exactos pendientes en Azure Portal.
- Resultado de prueba `GET publicBlobUrl`, incluyendo status HTTP.
- Riesgos restantes.
- Siguiente tarea recomendada:
  - QA Azure de render de imagen publica, o
  - Backend task para proxy/SAS, o
  - Product/Owner task si requiere decision manual.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-065. Product/Architect debe leer tasks/TASK-065-HANDOFF.md.
```
