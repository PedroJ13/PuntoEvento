# TASK-288: QA Azure - revalidar upload de portada y envio directo post-CORS

## Equipo asignado

QA Azure.

## Contexto

`TASK-285` confirmo que el P1 ocurre solo con portada: el `PUT` al blob firmado falla por CORS/preflight. `TASK-287` debe corregir CORS de Azure Blob Storage.

## Precondicion

No iniciar hasta que exista:

```text
tasks/TASK-287-HANDOFF.md
```

con evidencia de CORS aplicado.

## Tarea

Revalidar desde:

```text
https://puntoeventocr.com/panel.html
```

el flujo:

```text
crear servicio con portada -> Enviar servicio -> upload OK -> confirm OK -> submit-review OK -> pending
```

## Alcance

1. Iniciar sesion con empresa controlada.
2. Crear servicio QA nuevo con portada `.png` o `.jpg` menor a 5 MB.
3. Presionar `Enviar servicio` directamente desde el formulario.
4. Capturar que ocurren, en orden:

```text
POST /api/companies/me/services
POST /api/uploads/sign
PUT <blob firmado>
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

5. Confirmar estado final `pending`/revision sin workaround manual desde borrador.
6. Confirmar que no aparece el error generico `No se pudo guardar el servicio`.
7. Si Product/QA tiene credencial admin disponible, aprobar el servicio y confirmar que la portada queda visible en catalogo publico; si no, dejarlo como pendiente para validacion posterior.

## No tocar

- No modificar codigo.
- No exponer passwords, cookies, tokens, SAS completos ni URLs firmadas completas.
- No hacer cleanup destructivo.

## Handoff esperado

Actualizar:

```text
tasks/TASK-288-HANDOFF.md
```

Clasificar:

- Aprobado si el flujo con portada llega directo a revision.
- No aprobado si vuelve a fallar el `PUT`, `uploads/confirm` o `submit-review`.
- Si falla de nuevo, indicar equipo sugerido y request/status exacto.

