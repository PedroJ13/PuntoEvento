# TASK-289: QA Azure - validar portada publica despues de aprobacion admin

## Equipo asignado

QA Azure.

## Contexto

`TASK-288` aprobo el objetivo principal post-CORS:

```text
crear servicio con portada -> upload OK -> confirm OK -> submit-review OK -> pending
```

El P1 de upload/envio directo queda cerrado funcionalmente. Queda un pendiente P2: confirmar que, despues de aprobar el servicio desde admin, la portada aparece en el catalogo publico y no cae al placeholder.

Servicio QA creado en `TASK-288`:

```text
Service ID: service_4ca95c42-b4f8-408f-88a8-4a818f5e3c6f
Nombre: QA TASK-288 portada 20260610010017
Empresa: Aurisbel Pasteleria
Estado: pending
```

## Precondicion

Product/QA debe contar con credencial admin o autorizacion para aprobar/rechazar el servicio QA. No documentar credenciales en repo.

## Tarea

Validar el tramo admin/publico de portada:

1. Entrar a `https://puntoeventocr.com/admin.html`.
2. Aprobar el servicio QA pendiente de `TASK-288`.
3. Confirmar que la aprobacion publica la imagen/portada asociada.
4. Revisar `https://puntoeventocr.com/` o la ficha publica correspondiente.
5. Confirmar que el servicio aparece con portada visible y no con placeholder.

## Verificacion API/UI

Capturar sin secretos:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Confirmar si el servicio publicado expone imagen publica (`coverUrl`, `publicBlobUrl` o equivalente segun contrato actual).

## No tocar

- No modificar codigo.
- No exponer credencial admin, cookies, tokens ni URLs firmadas completas.
- No hacer cleanup destructivo sin tarea separada.

## Handoff esperado

Actualizar:

```text
tasks/TASK-289-HANDOFF.md
```

Clasificar:

- Aprobado si la portada aparece visible publicamente.
- No aprobado si el servicio se publica pero cae al placeholder.
- Bloqueado si no hay credencial admin disponible.

