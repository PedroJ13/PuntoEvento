# TASK-285: QA Azure - reintentar envio directo de servicio con portada usando empresa controlada

## Equipo asignado

QA Azure.

## Contexto

`TASK-283` quedo no aprobada porque QA no tenia una sesion autenticada controlada. `TASK-284` debe preparar la empresa QA y entregar acceso por canal seguro.

El objetivo sigue siendo clasificar el P1 candidato del panel empresa:

```text
crear servicio con portada -> presionar Enviar servicio -> servicio queda directo en revision
```

Evidencia adicional del incidente: servicios publicados de `Aurisbel Pasteleria` aparecen en pagina publica con placeholders graficos en lugar de imagen real. Esto puede estar relacionado con upload/confirmacion/publicacion de portada.

## Precondicion

No iniciar hasta que `TASK-284-HANDOFF.md` confirme que existe una empresa QA aprobada con login recurrente valido.

## Tarea

Repetir la validacion de `TASK-283` con sesion real/controlada desde:

```text
https://puntoeventocr.com/panel.html
```

## Alcance

1. Iniciar sesion con la empresa QA controlada.
2. Crear servicio nuevo con campos requeridos y portada `jpg` o `png` menor a 5 MB.
3. Presionar `Enviar servicio` directamente desde el formulario.
4. Confirmar si el servicio queda en `pending`/revision o en `draft`.
5. Si queda en `draft`, enviar a revision desde el borrador y documentar si funciona.
6. Repetir un caso sin imagen para aislar upload/portada.
7. Si el servicio llega a revision y Product/QA tiene credencial admin disponible, aprobarlo desde admin y confirmar si la portada aparece en pagina publica o si cae al placeholder.
8. Capturar la secuencia Network sin exponer secretos.

Requests a observar:

```text
POST /api/companies/me/services
POST /api/uploads/sign
PUT <blob firmado> si aparece visible
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
GET /api/public/services
GET /api/public/companies/{slug}
```

## Clasificacion requerida

- Si crea draft y el frontend no llama `submit-review`: recomendar tarea `Web Dev`.
- Si todos los endpoints responden OK pero la UI muestra error o estado inconsistente: recomendar tarea `Web Dev`.
- Si falla `uploads/sign`, `PUT blob`, `uploads/confirm` o `submit-review` con `400`, `409`, `413`, `415` o `500`: recomendar tarea `Backend/API`.
- Si el servicio se publica pero no tiene `coverUrl`/imagen publica asociada, o el admin aprueba servicio con imagen pendiente sin publicarla, recomendar tarea `Backend/API`.
- Si aparece `403` en `/api`: recomendar tarea `Infra Azure`.
- Si solo falla con portada: marcar sospecha principal en upload/portada y clasificar segun request fallida.

## No tocar

- No modificar codigo.
- No exponer cookies, passwords, tokens ni URLs firmadas completas.
- No publicar contenido real sensible en catalogo publico. Usar servicio QA claramente identificable y remover/rechazar luego por tarea separada si corresponde.
- No hacer cleanup destructivo.

## Handoff esperado

Actualizar:

```text
tasks/TASK-285-HANDOFF.md
```
