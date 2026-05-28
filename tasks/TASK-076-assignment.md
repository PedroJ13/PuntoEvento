# TASK-076: Publicar imagen real demo en servicio QA principal

## Equipo asignado

QA / Infra Azure.

## Contexto

La pagina publica ya funciona en Azure con servicios reales:

- Home consume servicios publicados.
- `#bodas` lista servicios.
- Perfil empresa destaca el servicio seleccionado.
- Filtros sin resultados muestran estado vacio correctamente.

El pendiente visual principal es que el servicio QA principal usa una imagen tecnica de prueba `1 x 1 / 67 bytes`, suficiente para validar plumbing, pero pobre para demo visual.

Servicio QA principal observado:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
companySlug: qa-company-register-test
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
serviceSlug: qa-moderacion-approve-20260528113350
serviceName: QA Moderacion Approve 20260528113350
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-061-HANDOFF.md`
- `tasks/TASK-064-HANDOFF.md`
- `tasks/TASK-072-HANDOFF.md`
- `tasks/TASK-075-HANDOFF.md`

## Objetivo

Publicar una imagen real o visualmente representativa para el cover del servicio QA principal, usando el flujo real de uploads y moderacion.

## Imagen a usar

Preferencia:

- Usar una imagen generica de evento/salon/mesa/catering que Product/Owner provea localmente.

Si Product/Owner no provee una imagen:

- Usar un asset visual de prueba generado o preparado localmente, mayor que `800 x 500`, que sirva para validar encuadre real.
- No usar material con marcas, rostros reconocibles o derechos dudosos.
- No commitear la imagen si es solo insumo de QA.

## Flujo esperado

1. Crear o reutilizar una sesion real de empresa para `qa-company-register-test`.
2. Reservar upload:

```text
POST /api/uploads/sign
scope=service
serviceId=service_57b80edc-9bb4-43f8-b957-7ffa8959b934
imageType=cover
```

3. Subir la imagen real al SAS del blob pendiente.
4. Confirmar upload:

```text
POST /api/uploads/confirm
```

5. Aprobar internamente el upload:

```text
POST /api/internal/uploads/{companyId}/{uploadId}/approve
```

6. Validar que `Services.coverUrl` cambio al nuevo `publicBlobUrl`.
7. Validar que el nuevo `publicBlobUrl` responde:

```text
HTTP 200
Content-Type: image/*
Dimensiones mayores que 1 x 1
Sin SAS ni query string
```

8. Validar en la pagina publica:

```text
/index.html#inicio
/index.html#bodas
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

La imagen debe renderizar en cards/perfil/carrusel segun aplique.

## Seguridad

- No pegar credenciales, cookies, SAS tokens ni connection strings en el handoff.
- Redactar `uploadUrl`, cookies y tokens.
- No hacer publico `uploads-pending`.
- No borrar datos QA existentes salvo que Product/Owner lo pida.

## Fuera de alcance

- No cambiar codigo.
- No hacer commit/push.
- No cambiar contratos API.
- No rotar credenciales admin en esta tarea.
- No limpiar todos los datos QA.

## Entregable

Crear:

```text
tasks/TASK-076-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Imagen usada, descrita sin incluir secretos ni rutas privadas sensibles.
- Endpoints ejecutados y status HTTP.
- `uploadId` y `publicBlobUrl` redactado si hace falta, pero suficiente para trazabilidad.
- Confirmacion de dimensiones/content-type.
- Confirmacion visual de home/listado/perfil.
- Hallazgos y riesgos restantes.
- Recomendacion:
  - listo para demo controlada, o
  - requiere ajuste adicional.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-076. Product/Architect debe leer tasks/TASK-076-HANDOFF.md.
```
