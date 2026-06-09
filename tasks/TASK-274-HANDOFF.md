# TASK-274 HANDOFF

Equipo: QA

Tarea validada: `TASK-274` - QA Azure de ajustes UX flujos web 2026-06-08 (`TASK-267` a `TASK-271`) post-deploy `TASK-273`.

Ambiente:

- Azure: `https://zealous-field-08fdd720f.7.azurestaticapps.net`.
- Navegador: Playwright Chromium headless contra Azure.
- Viewports: mobile `390x844` y desktop `1366x768`.
- Datos: no se crearon empresas reales, no se enviaron leads reales, no se usaron credenciales reales y no se modificaron datos productivos. Para flujos que requieren datos se usaron intercepts/mocks en navegador.

Resultado final: **aprobado con observaciones**.

Resumen:

- Azure sirve las versiones esperadas del bloque UX.
- Home, catalogo vacio, CTA de empresas, contacto/cotizacion, registro, panel y admin pasan sin P0/P1.
- WhatsApp y formulario/email quedan diferenciados por copy y comportamiento.
- La jerarquia `servicio primero, empresa como contexto` se observa en resultados y ficha publica.
- Registro post-submit explica el acceso posterior por correo.
- Panel empresa muestra estados visibles entendibles.
- Admin muestra resumen de pendientes y acciones approve/reject siguen funcionando con endpoints mockeados.
- Queda un P2 visual: ficha publica desktop con servicio mock presenta overflow horizontal a `1366px`.

Versiones/commit observados:

- Deploy segun `TASK-273`: `main / 7286682ba6719eec16c92164dc68955b089b17eb`.
- `/` -> `app.js?v=33`, `styles.css?v=26`.
- `/panel.html` -> `panel.js?v=14`, `panel.css?v=13`.
- `/admin.html` -> `admin.js?v=21`, `admin.css?v=14`.
- Assets directos `app.js?v=33`, `styles.css?v=26`, `panel.js?v=14`, `panel.css?v=13`, `admin.js?v=21`, `admin.css?v=14` -> `200`.
- `/api/public/services?limit=50` -> `200`, `items.length = 0`.

Evidencia por superficie:

## Pagina publica

- Home carga en Azure con marca `Punto Evento CR`.
- `/#bodas` con catalogo real vacio muestra:
  - `Catálogo en preparación`.
  - `No hay servicios publicados todavía`.
  - CTA `Solicitar acceso gratis`.
- `/#bodas` no muestra datos demo/referencia:
  - Sin `Paquetes de boda`.
  - Sin `Comparación rápida de precios`.
  - Sin `Casa Arboleda`, `Bocados y Copas`, `Luz Viva Producciones`, `Flor de Abril`, `Captura Dorada`, `Nexo Corporativo`.
- CTA global/listado sin servicio no dispara `POST /api/public/leads`.

## Contacto/cotizacion

- Con servicios mock:
  - Servicio con WhatsApp muestra CTA `Solicitar cotización`.
  - Microcopy WhatsApp: `Te abriremos WhatsApp con Catering premium WhatsApp de Empresa WhatsApp QA.`
  - Link `wa.me` incluye el nombre del servicio en el mensaje prellenado.
  - Servicio sin WhatsApp muestra camino por formulario/email.
  - Microcopy formulario: `Enviaremos tu solicitud a Empresa Email QA y quedará registrada por Punto Evento CR.`
- Envio de formulario mock:
  - Payload conserva `companyId + serviceId` (`co-email` / `svc-email`).
  - Confirmacion visible: `Solicitud enviada por formulario`.

## Resultados y ficha

- Resultados:
  - Tarjetas muestran el servicio como titulo principal (`Catering premium WhatsApp`, `Decoración por formulario`).
  - Empresa aparece como contexto (`Servicio de Empresa WhatsApp QA`, `Servicio de Empresa Email QA`).
- Ficha publica:
  - Hero muestra servicio como titulo.
  - Empresa queda como contexto (`De Empresa WhatsApp QA · Central, San José`).
  - Microcopy visible: `Estás cotizando este servicio de Empresa WhatsApp QA.`
  - Mobile: resumen/CTA aparece antes de galeria y no hay overflow horizontal.
- Desktop: se detecta overflow horizontal en ficha con servicio mock; ver P2.

## Registro empresa

- Registro mock con `POST /api/companies/register` interceptado:
  - No crea datos reales.
  - Confirmacion visible:
    - `Recibimos tu solicitud`.
    - `Te enviaremos las instrucciones de acceso por correo cuando tu cuenta esté lista.`
    - `No necesitas crear contraseña ahora. El acceso al panel llega en un paso posterior.`

## Panel empresa

- `/panel.html?demo=local` carga en Azure.
- Estados visibles validados:
  - `Publicado`.
  - `Borrador`.
  - `Recibido` tras crear servicio demo con tipo de evento requerido.
- Microcopy validado:
  - `Tu información fue recibida. Te avisaremos cuando esté lista para publicarse.`
- No se observo regresion de login/activacion en el alcance visual/copy; no se usaron credenciales reales.

## Admin

- `/admin.html` carga login sin prompt nativo y sin demo/legacy visible en modo productivo normal.
- Con endpoints internos mockeados:
  - Resumen visible: `Empresa pendiente + 1 servicio por revisar + 2 fotos pendientes`.
  - Rechazar servicio abre prompt `Motivo de rechazo` y muestra feedback `Servicio rechazado. Revisa el resumen del expediente para pendientes restantes.`
  - Aprobar empresa muestra feedback `Empresa aprobada e invitación enviada.`

Hallazgos:

## P0

- Ninguno.

## P1

- Ninguno.

## P2

- **P2 - Ficha publica desktop tiene overflow horizontal a 1366px.**
  - Evidencia: con ficha mock `#proveedor/empresa-whatsapp/catering-whatsapp`, viewport desktop `1366x768`, `documentElement.scrollWidth = 1762` y `clientWidth = 1366`.
  - Elementos que exceden el viewport:
    - `.contact-note.full-note` con texto `También puedes enviar una solicitud registrada por Punto Evento CR.`
    - enlace/boton `Ver más servicios`.
  - Impacto: la ficha sigue usable y mobile pasa, pero desktop queda con scroll horizontal visible. Recomendado corregir antes de usar una ficha publicada con usuarios externos.
  - Responsable sugerido: Web Dev.

## P3

- **P3 - Flujos autenticados se validaron con mocks/demo, no con credenciales reales.**
  - Motivo: la tarea prohibe publicar credenciales/secretos y no pidio mutacion de datos reales.

Riesgos aceptables:

- La validacion de primer servicio real publicado debe repetirse cuando exista una empresa real aprobada, porque esta QA uso servicios mock para no crear datos.
- El P2 de overflow desktop puede afectar la percepcion visual de la ficha publica si se muestra a usuarios externos antes de corregirlo.

Recomendacion go/no-go:

- **Go tecnico para continuar test con primera empresa real**, especialmente registro/panel/admin.
- **Go condicionado para mostrar ficha publica real a usuarios externos**: aceptar temporalmente el P2 o abrir tarea Web Dev corta para corregir overflow desktop de la ficha antes de exposicion externa amplia.
