# TASK-283: QA Azure - reproducir envio directo de servicio con portada a revision

## Equipo asignado

QA Azure.

## Contexto

En produccion, una empresa real presiono `Enviar servicio` desde el panel empresa y la UI mostro:

```text
No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.
```

Evidencia nueva:

- El servicio si queda creado como borrador.
- Desde ese borrador, el servicio si puede enviarse manualmente a revision.

Resultado esperado de producto:

```text
Al presionar Enviar servicio desde el formulario de creacion, el servicio debe pasar directo a revision sin que la empresa tenga que descubrir el workaround de borrador.
```

## Tarea

Reproducir en dominio propio el flujo:

```text
crear servicio nuevo con portada -> presionar Enviar servicio -> servicio queda en pending/revision
```

Ambiente principal:

```text
https://puntoeventocr.com/panel.html
```

Usar una empresa QA aprobada y autenticada, o una sesion controlada autorizada por Product. No usar datos sensibles en el handoff.

## Alcance

Validar y documentar:

1. Crear servicio nuevo con campos requeridos y una portada `jpg` o `png`.
2. Presionar `Enviar servicio` directamente desde el formulario.
3. Confirmar si el servicio queda en `pending`/revision o si queda como `draft`.
4. Si queda como `draft`, intentar enviar a revision desde el borrador y documentar si funciona.
5. Repetir el caso sin imagen para aislar si el corte esta en upload/portada.
6. Capturar en DevTools/Network la secuencia de requests y status HTTP.

Requests a observar:

```text
POST /api/companies/me/services
POST /api/uploads/sign
PUT <blob firmado> si aparece visible
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

## Clasificacion segun evidencia

- Si `POST /api/companies/me/services` crea el draft y luego el frontend no llama `submit-review`, derivar a `Web Dev`.
- Si todos los endpoints responden OK pero la UI muestra error o deja estado inconsistente, derivar a `Web Dev`.
- Si falla `POST /api/uploads/sign`, `PUT` a blob, `POST /api/uploads/confirm` o `submit-review` con `400`, `409`, `413`, `415` o `500`, derivar a `Backend/API`.
- Si aparece `403` en cualquier endpoint propio de `/api`, derivar a `Infra Azure`.
- Si el flujo sin imagen funciona pero con portada falla, marcar sospecha principal en upload/portada y clasificar segun la request fallida.
- Si el envio manual desde borrador funciona pero el envio directo falla, indicar explicitamente la diferencia de secuencia entre ambos caminos.

## No tocar

- No modificar codigo.
- No publicar servicios reales en catalogo publico.
- No exponer cookies, tokens, URLs firmadas completas, contrasenas ni datos personales.
- No hacer cleanup destructivo sin tarea de Infra Azure separada.

## Verificacion esperada

El handoff debe incluir:

- Dominio usado: apex o `www`.
- Navegador y viewport.
- Nombre anonimo o identificador QA de la empresa.
- Nombre del servicio QA creado.
- Resultado visual final: `draft`, `pending`, error UI o exito.
- Tabla de requests con metodo, ruta, status, resultado y observacion breve.
- Console errors relevantes, si existen.
- Capturas o descripcion suficiente del estado antes/despues.
- Recomendacion de siguiente tarea: `Web Dev`, `Backend/API`, `Infra Azure` o cierre sin fix.

## Handoff esperado

Actualizar:

```text
tasks/TASK-283-HANDOFF.md
```
