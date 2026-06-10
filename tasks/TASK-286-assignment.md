# TASK-286: QA Azure - ejecutar reproduccion con credencial entregada en el chat QA

## Equipo asignado

QA Azure.

## Contexto

`TASK-285` no pudo aprobar ni descartar el P1 candidato porque la credencial/sesion de empresa no estuvo disponible dentro del chat QA.

Empresa objetivo para prueba controlada:

```text
Aurisbel Pasteleria
```

Product debe entregar la credencial temporal directamente en el chat QA o abrir una sesion controlada. No escribir password en archivos del repo.

El incidente sigue abierto:

```text
crear servicio con portada -> presionar Enviar servicio -> servicio queda directo en revision
```

Tambien existe evidencia de servicios publicados con placeholders en lugar de imagen real, por lo que si el flujo llega a aprobacion debe verificarse la portada publica.

## Precondicion

Antes de empezar, confirmar en el chat QA:

- Product entrego la credencial temporal, o
- Product entrego una sesion ya abierta, o
- Product entrego HAR redactado suficiente.

No continuar si no hay acceso autenticado usable.

## Tarea

Desde:

```text
https://puntoeventocr.com/panel.html
```

Ejecutar:

1. Iniciar sesion con la empresa controlada.
2. Crear un servicio QA nuevo con campos requeridos y portada `.jpg` o `.png` menor a 5 MB.
3. Presionar `Enviar servicio` directamente desde el formulario.
4. Confirmar si queda `pending`/revision o `draft`.
5. Si queda `draft`, enviar a revision desde el borrador y documentar si funciona.
6. Repetir un caso sin imagen para aislar upload/portada.
7. Si llega a revision y hay credencial admin disponible, aprobar el servicio y confirmar si la portada aparece en catalogo publico o si cae al placeholder.

Requests a capturar:

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
- Si el servicio se publica pero no tiene `coverUrl`/imagen publica asociada, o el admin aprueba servicio con imagen pendiente sin publicarla: recomendar tarea `Backend/API`.
- Si aparece `403` en `/api`: recomendar tarea `Infra Azure`.
- Si solo falla con portada: marcar sospecha principal en upload/portada y clasificar segun request fallida.

## No tocar

- No modificar codigo.
- No exponer passwords, cookies, tokens, invites completos ni URLs firmadas completas.
- No hacer cleanup destructivo.
- No publicar contenido real sensible en catalogo publico; usar nombres QA claramente identificables.

## Handoff esperado

Actualizar:

```text
tasks/TASK-286-HANDOFF.md
```

