# TASK-287: Infra Azure - corregir CORS de Blob Storage para uploads de portada

## Equipo asignado

Infra Azure.

## Contexto

`TASK-285` reprodujo el P1 del panel empresa.

El flujo directo sin imagen funciona y deja el servicio en revision. El flujo directo con portada falla porque el navegador bloquea el `PUT` al blob firmado por CORS/preflight contra Azure Blob Storage.

Evidencia principal:

```text
Origin: https://puntoeventocr.com
PUT https://storagepuntoevento.blob.core.windows.net/uploads-pending/...png?<SAS>
Resultado: CORS blocked / net::ERR_FAILED
Error: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Esto impide:

```text
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

## Tarea

Configurar CORS de Azure Blob Storage para permitir uploads firmados desde el dominio productivo.

## Alcance

Revisar/configurar CORS en la cuenta/contenedor de Storage usada por uploads pendientes:

```text
storagepuntoevento
uploads-pending
```

Permitir como minimo:

```text
Origins:
- https://puntoeventocr.com
- https://www.puntoeventocr.com
- https://zealous-field-08fdd720f.7.azurestaticapps.net

Methods:
- OPTIONS
- PUT

Headers:
- Los headers reales enviados por el navegador durante el upload firmado.
- Incluir `x-ms-blob-type` si aplica.
- Incluir `content-type` si aplica.

Exposed headers:
- Minimos necesarios para completar el upload.
```

Mantener la configuracion lo mas restrictiva posible para MVP. No usar wildcard si Azure permite lista explicita.

## No tocar

- No cambiar codigo.
- No rotar credenciales ni SAS policy salvo que sea necesario y documentado.
- No borrar blobs ni datos.
- No exponer SAS completos, tokens, connection strings ni secretos.

## Verificacion

Hacer smoke tecnico controlado, sin secretos en el handoff:

1. Confirmar CORS aplicado en Storage.
2. Confirmar que preflight desde `https://puntoeventocr.com` queda permitido.
3. Si se ejecuta upload smoke, usar archivo QA minimo y no publicar contenido real.
4. Confirmar que no se abrio CORS a origenes innecesarios.

## Handoff esperado

Actualizar:

```text
tasks/TASK-287-HANDOFF.md
```

Incluir:

- Regla CORS aplicada, sin secretos.
- Origenes/metodos/headers permitidos.
- Evidencia de smoke o verificacion.
- Riesgos o configuracion pendiente.

