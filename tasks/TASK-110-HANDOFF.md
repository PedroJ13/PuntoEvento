# TASK-110: Registro exitoso y prevencion de doble submit

## Equipo

Web Dev.

## Estado

Completada.

## Objetivo

Mejorar el cierre del registro publico de empresa en `index.html#empresas` para que el envio tenga estado visible, no permita doble submit y deje una confirmacion clara despues del exito.

## Alcance

- Flujo de submit del formulario publico de empresas.
- Estado visual del boton y mensaje de envio.
- Confirmacion posterior al registro exitoso.
- Manejo de error sin perder datos capturados.

## Fuera de alcance

- No se cambio backend ni contrato de `POST /api/companies/register`.
- No se agregaron campos nuevos de contacto/sociales.
- No se cambio admin, panel empresa ni moderacion.
- No se reescribio la pagina publica.

## Cambios realizados

- Se agrego un estado `isSubmitting` en `bindCompanyRegistration()` para ignorar submits repetidos mientras hay request activa.
- El boton `Enviar registro gratis` queda deshabilitado y cambia a `Enviando registro...` durante el request.
- Se agrego mensaje accesible `Enviando registro. Espera un momento...` con `aria-live`.
- En exito, el formulario se limpia, se oculta y queda visible una confirmacion con accion `Registrar otra empresa`.
- La accion `Registrar otra empresa` vuelve a mostrar el formulario limpio y listo para un nuevo registro.
- En error, el formulario se mantiene visible, el boton se reactiva y los datos capturados permanecen para correccion.
- Se agregaron estilos para ocultar el formulario exitoso, reservar espacio del estado y mostrar botones deshabilitados.
- Se actualizaron cache busters de `styles.css` y `app.js` en `index.html`.

## Archivos modificados

- `index.html`
- `app.js`
- `styles.css`
- `tasks/TASK-110-HANDOFF.md`

## Comportamiento

### Durante envio

- El submit se bloquea con `isSubmitting`.
- El boton queda deshabilitado.
- Se muestra estado de envio claro debajo del boton.
- Clicks repetidos o doble click no generan requests duplicados desde UI.

### Exito

- El formulario se resetea y se oculta.
- Se muestra `Registro recibido`.
- Se muestra la accion `Registrar otra empresa`.
- Al usar esa accion, el formulario reaparece limpio.

### Error

- El formulario se mantiene visible.
- El boton vuelve a quedar habilitado.
- Los datos ingresados no se pierden.
- Se muestra error claro y accion `Volver al formulario`.

## Verificacion realizada

- `git diff --check -- index.html app.js styles.css`: sin errores de whitespace. Git aviso conversion futura LF -> CRLF en esos archivos.
- `node --check app.js` con Node del runtime bundled: sin errores de sintaxis.
- Prueba local con servidor mock para `/api/companies/register`:
  - exito con doble click: boton deshabilitado durante envio, estado visible, 1 solo request recibido, formulario oculto, confirmacion con `Registrar otra empresa`;
  - accion `Registrar otra empresa`: formulario vuelve visible y listo;
  - error 500 mock: boton se reactiva, datos se mantienen, error visible.
- Smoke visual basico con Edge headless:
  - desktop `1366x900`;
  - mobile `390x900`;
  - capturas generadas en `tasks/generated/TASK-110-desktop.png` y `tasks/generated/TASK-110-mobile.png`.

## Riesgos pendientes

- La prevencion de duplicados es de UI. Backend/API aun debe mantener idempotencia o control de duplicados si aplica.
- En mobile se observo que la cabecera/hero de `#empresas` puede quedar horizontalmente ajustada o cortada en viewport estrecho; parece preexistente y no se cambio por estar fuera del alcance de TASK-110.
- Falta validacion final contra Azure desplegado despues de publicar estos assets.

## Recomendacion para QA

- Reprobar `index.html#empresas` en Azure despues de deploy con Chrome normal y mobile viewport.
- Confirmar que un doble click en `Enviar registro gratis` no genera duplicados visibles ni deja el formulario en estado ambiguo.
- Probar un error real o simulado de API y verificar que los datos siguen presentes.

## Recomendacion para Product/Architect

Mover PO-001 a resuelto despues de QA Azure si el comportamiento desplegado coincide con esta validacion.

## Siguiente tarea sugerida

Continuar con las tareas P1 relacionadas con Panel empresa/Admin/API segun `docs/PRODUCT_DECISIONS_PO_FINDINGS_2026-05-29.md` y `TASK-111`.
