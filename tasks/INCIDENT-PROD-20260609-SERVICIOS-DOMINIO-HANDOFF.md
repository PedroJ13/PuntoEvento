# INCIDENT PROD 2026-06-09: servicio queda en borrador aunque la accion esperaba enviarlo a revision

## Resumen

Empresa real reporta que, al crear/enviar un servicio en produccion desde el panel empresa, la UI muestra:

```text
No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.
```

Evidencia adicional del usuario: el servicio si queda creado como borrador, y desde la lista de borradores luego si se puede enviar a revision.

Lectura actual: no parece un bloqueo total de creacion de servicio. El fallo esta en la cadena automatica esperada `crear servicio -> subir/confirmar imagenes si aplica -> enviar a revision`. El resultado esperado de producto es que el servicio se envie directo a revision, sin que la empresa tenga que pasar manualmente por borrador.

Evidencia posterior del mismo caso: en la pagina publica los servicios publicados de la misma empresa aparecen con placeholders graficos en lugar de sus imagenes. Esto refuerza la sospecha de fallo en el tramo de upload/confirmacion/publicacion de imagenes, o de aprobacion de servicio sin imagen publica asociada.

## Clasificacion inicial

- Severidad sugerida: `P1` si afecta a empresa real y bloquea o confunde el primer envio de servicio.
- Tipo probable actualizado: `Bug frontend` o `Bug backend/API` en la secuencia automatica de envio.
- Tipo alternativo: `Upload/imagenes` si el fallo ocurre entre crear borrador, confirmar portada/foto o publicar la imagen aprobada.
- Tipo menos probable con la evidencia nueva: `Infra/deploy/config`, porque la creacion del borrador y el envio manual posterior si funcionan.
- Tipo secundario: `UX/copy`, porque la UI dice que no se pudo guardar aunque el servicio si queda guardado como borrador.
- Superficie: panel privado de empresa.
- Flujo afectado: crear/editar servicio, subir portada/fotos y enviar servicio a revision.

## Evidencia disponible

- Ambiente: produccion.
- Usuario: empresa real, dato especifico no documentado en este handoff.
- Captura visible del panel empresa al presionar `Enviar servicio`.
- Video local recibido como evidencia: `C:\Users\pj13e\Downloads\WhatsApp Video 2026-06-09 at 16.23.57.mp4`.
- Imagen seleccionada en el formulario: `sencillo snoopy.png`.
- Nueva captura del catalogo publico muestra servicios publicados de la misma empresa con placeholders visuales en lugar de imagen real.
- Empresa visible en captura publica: `Aurisbel Pasteleria`.
- Servicios visibles con placeholder: `Pastel de bodas`, `Mesa dulce`, `Queque basico de cumpleanos`.
- Mensaje visible:

```text
No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.
```
- Nueva evidencia verbal: el servicio queda en borrador y desde ese estado si se envia a revision.
- Nueva evidencia visual: los servicios publicados aparecen sin portada real en la pagina publica.

## Relacion con TASK-279 / TASK-280

`TASK-279` corrigio el incidente anterior de registro desde dominio propio ajustando app settings:

```text
ALLOWED_ORIGINS=https://puntoeventocr.com,https://www.puntoeventocr.com,https://zealous-field-08fdd720f.7.azurestaticapps.net
APP_PUBLIC_URL=https://puntoeventocr.com
```

`TASK-280` aprobo el registro publico desde:

```text
https://puntoeventocr.com/#empresas
https://www.puntoeventocr.com/#empresas
```

Pero esos handoffs no evidencian una revalidacion completa del panel empresa desde dominio propio para:

```text
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
POST /api/uploads/sign
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

Estas rutas tambien usan `enforceAllowedOrigin`, por lo que inicialmente se considero un posible `403`. Sin embargo, la evidencia nueva reduce esa probabilidad: si el borrador se crea y luego el envio manual funciona desde la misma sesion/dominio, el problema parece estar mas cerca de la secuencia automatica del panel o del tramo de upload.

## Hipotesis

No se puede confirmar la causa sin capturar el status HTTP de la request fallida.

Hipotesis principales:

- El `POST /api/companies/me/services` crea correctamente el borrador, pero falla despues en `POST /api/uploads/sign`, subida a blob, `POST /api/uploads/confirm` o `POST /api/companies/me/services/{serviceId}/submit-review`.
- Si falla upload, el borrador queda creado pero la UI muestra error general y no llega al envio automatico.
- Si falla el `submit-review` automatico por timing, estado local, payload o validacion, el borrador queda listo y el envio manual posterior puede pasar.
- Si el envio manual posterior funciona, `submit-review` como endpoint probablemente esta operativo; el problema seria la orquestacion del primer submit o el paso previo de imagen.
- Si el servicio fue aprobado/publicado sin `coverUrl`, el catalogo publico muestra el fallback grafico. Esto explicaria la segunda captura.
- Si existian uploads pendientes pero no pasaron a `published`, revisar aprobacion admin de servicio e imagenes y la copia de blob pendiente a contenedor publico.
- El mensaje actual es incorrecto/confuso porque dice que no se pudo guardar cuando si se guardo como borrador.

## Reproduccion recomendada

QA debe reproducir en dominio propio con una empresa controlada o la empresa afectada, evitando imprimir datos sensibles.

Capturar en DevTools/Network cual request falla y su status en el primer intento:

```text
/api/companies/me/services
/api/uploads/sign
/api/uploads/confirm
/api/companies/me/services/{serviceId}/submit-review
```

Checks minimos:

1. Crear/enviar servicio nuevo con portada.
2. Confirmar si queda como borrador despues del error.
3. Desde el borrador, presionar enviar y confirmar que pasa a revision.
4. Repetir creando servicio sin imagen para aislar upload.
5. Aprobar el servicio desde admin y confirmar si admin muestra imagen pendiente asociada.
6. Confirmar en pagina publica si el servicio recibe `coverUrl` o cae al placeholder.
7. Capturar status HTTP, response body y si la cookie `pe_company_session` se envia a `/api`.

## Equipo sugerido

- Primero: `QA`, para reproduccion y evidencia de request/status.
- Si falla solo la orquestacion despues de crear borrador: `Web Dev`.
- Si falla upload/sign/confirm, publicacion de imagen o copia de blob: `Backend/API`.
- Si admin permite aprobar servicio sin imagen cuando se esperaba imagen obligatoria: `Backend/API` y `Product / Architect / Release` para confirmar regla MVP.
- Si aparece `403`: `Infra Azure`.
- Si el flujo funciona pero el mensaje confunde: `Web Dev` y `Copy / Gramatica`.

## Siguiente paso recomendado

Crear una tarea corta de QA:

```text
QA Azure - reproducir servicio creado como borrador aunque se esperaba envio directo
```

Objetivo:

Validar que una empresa aprobada y autenticada puede, desde `https://puntoeventocr.com/panel.html`, crear servicio con portada y enviarlo directamente a revision en una sola accion. Si falla, identificar si el corte ocurre en creacion, upload, confirmacion o submit-review. Despues, aprobar el servicio y confirmar que la portada queda visible en el catalogo publico.

## Riesgo si no se atiende

Aunque el registro publico ya funciona desde el dominio propio, una empresa real queda obligada a descubrir un workaround: aceptar que el servicio quedo en borrador y enviarlo manualmente desde alli. Ademas, los servicios publicados pueden quedar sin imagen real, reduciendo confianza del catalogo publico.

## Recomendacion para Product / Architect / Release

- Tema: P1 produccion en panel empresa; servicio queda como borrador aunque se esperaba envio directo a revision, y servicios publicados aparecen sin imagen real.
- Motivo: flujo principal confuso o parcialmente roto para empresa real despues de registro/aprobacion; posible fallo de upload/publicacion de imagenes.
- Prioridad sugerida: inmediata.
- Equipo sugerido: QA primero; Web Dev o Backend/API segun request fallida; Infra Azure solo si aparece `403`.
- Documento/tarea sugerida: crear tarea QA enfocada del flujo `crear servicio con portada -> envio directo a revision -> aprobacion admin -> portada visible en catalogo publico`.
- Riesgo si no se hace: primera empresa real puede creer que el servicio no se guardo, duplicarlo, abandonar el proceso o aparecer publicada con catalogo visual incompleto.
