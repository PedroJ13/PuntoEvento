# TASK-162: Web Dev - formulario/CTA de cotizacion conectado

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Flujo implementado

- Los CTAs de servicios publicados de la pagina publica adjuntan `companyId` y `serviceId`.
- El drawer de cotizacion agrega email del cliente y envia `POST /api/public/leads`.
- El submit previene doble envio mientras la solicitud esta en curso.
- El exito muestra confirmacion sobria sin prometer tiempos de respuesta.
- Errores `400`, `404`, `409` y `502` muestran mensajes claros sin exponer email privado de empresa.
- CTAs genericos o demo sin servicio publicado muestran que se debe abrir un servicio publicado para enviar cotizacion real.

## Archivos cambiados

- `index.html`
- `app.js`
- `styles.css`

## Cache busting

- `index.html` ahora carga `app.js?v=24`.
- `index.html` ahora carga `styles.css?v=18`.

## Verificacion realizada

- `node --check app.js`: OK.
- Playwright local en `http://127.0.0.1:59999/index.html#bodas` con mocks:
  - `GET /api/public/services` devolvio un servicio publicado.
  - CTA `Cotizar servicio` abrio el formulario con contexto.
  - Submit envio `POST /api/public/leads` con `companyId`, `serviceId`, `name`, `email`, `phone`, `eventType`, `eventDate`, `guests` y `message`.
  - Respuesta `201` mostro confirmacion.

Payload observado:

```json
{
  "companyId": "company_qa_quote",
  "serviceId": "service_qa_quote",
  "name": "Cliente QA",
  "email": "cliente@example.test",
  "phone": "8888-8888",
  "eventType": "Boda",
  "eventDate": "",
  "guests": "80",
  "message": "Necesito cotizar para una boda."
}
```

## Riesgos

- No se envio email real porque la verificacion fue local con mocks.
- CTAs demo/genericos no tienen `companyId/serviceId`; se bloquean con mensaje hasta que el usuario abra un servicio publicado real.
- Falta rate limiting/CAPTCHA en backend para el endpoint publico.

## Recomendacion para QA

Validar en Azure con un servicio publicado real: envio exitoso con mailbox observable, doble submit, datos invalidos, servicio/empresa no publicado, fallo controlado de SendGrid y mobile basico.

## Siguiente tarea sugerida

`TASK-163`: QA enfocada del flujo de cotizacion publica despues de deploy de `app.js?v=24` y `styles.css?v=18`.
