# TASK-202 - QA Handoff

## Resumen

Revalidacion QA en Azure posterior al deploy de TASK-201.

Resultado: **aprobado con observaciones P2/P3**.

No se detectaron bloqueantes P0/P1 para los flujos MVP validados en esta tarea.

## Ambiente

- Workspace: `C:\Users\pj13e\Digital Products\Punto Evento`
- Repo root confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Ambiente probado: Azure Static Web Apps / API Azure
- Fecha QA: 2026-06-03
- Rol: QA

## Alcance Ejecutado

- Confirmacion de assets desplegados en Azure.
- Regression publica:
  - CTA `Contactar`.
  - WhatsApp cuando hay telefono.
  - Fallback de formulario/email via `POST /api/public/leads`.
  - Categorias y shortcuts de servicios.
  - Enfoque/scroll hacia resultados.
  - Responsive mobile basico.
- Panel empresa:
  - Lenguaje simplificado.
  - Creacion de servicio.
  - `Guardar y enviar`.
  - Estado posterior `Recibido`.
- Admin interno:
  - Empresa aprobada con servicios pendientes.
  - Acciones por estado.
  - Feedback especifico.
  - Navegacion legacy/demo no visible.
- Emails funcionales observables via API/metadatos:
  - Invitacion/activacion: `email_sent`.
  - Lead/contacto: `emailStatus=sent`.

## Pruebas Ejecutadas

### 1. Assets desplegados

Verificado en Azure:

- `index.html`
  - `app.js?v=27`: OK
  - `styles.css?v=20`: OK
- `panel.html`
  - `panel.js?v=7`: OK
  - `panel.css?v=8`: OK
  - `styles.css?v=20`: OK
- `admin.html`
  - `admin.js?v=18`: OK
  - `admin.css?v=13`: OK
  - `styles.css?v=20`: OK

Resultado: **OK**.

### 2. Flujo empresa + panel

Datos QA creados para la prueba:

- Empresa QA: `company_fd78e09b-5853-40c6-8d9f-9cdfb24e42c3`
- Servicio QA: `service_caa7eb18-5a7a-43e6-8edf-ae3491b353c2`

Flujo:

- Registro empresa: `201`
- Aprobacion empresa desde API/admin path: `200`
- Invitacion de aprobacion: `email_sent`
- Activacion: `200`
- Creacion de servicio desde panel: `201`
- Envio a revision desde panel: `200`
- Estado visible posterior: `Recibido`

Validaciones UI:

- Texto simplificado `Carga tus servicios`: OK
- Texto `Cargar servicio`: OK
- No se observo copy legacy visible `Guardar borrador` / `Enviar a revision`: OK
- `Guardar y enviar` ejecuta creacion y envio a pendiente/recibido: OK

Resultado: **OK con observacion P2 sobre evidencia visual de `Portada`**.

### 3. Admin interno

Flujo probado con empresa aprobada y servicio pendiente:

- Empresa ya aprobada no muestra accion de aprobar empresa: OK
- Servicio pendiente muestra accion de aprobar servicio: OK
- Aprobacion de servicio: `200`
- Feedback visible: `Servicio aprobado.`: OK
- Navegacion soporte/demo legacy visible: no visible: OK

Resultado: **OK con observacion P3 por un 404 no bloqueante en consola**.

### 4. Publico

Validaciones:

- CTA visible `Contactar`: OK
- Copy ambiguo `Cotizar` no observado como CTA principal: OK
- Categorias visibles:
  - `Salon y jardin`
  - `Catering`
  - `Fotografia`
  - `Musica y DJ`
  - `Decoracion`
  - `Mesa dulce`
- Shortcut `Catering` enfoca resultados: OK
- Servicio QA publicado visible en resultados despues de aprobacion: OK
- CTA con telefono abre WhatsApp: OK
- Formulario/contacto visible como fallback: OK
- Mobile basico:
  - Sin overflow horizontal detectado.
  - CTA `Contactar` visible.

Resultado: **OK**.

### 5. API publica y emails

Validaciones:

- `GET /api/public/services?limit=100`: `200`
- Email de empresa no expuesto en catalogo publico: OK
- `POST /api/public/leads`: `201`
- Lead creado: `lead_640610f4-d401-432a-8ed4-d293b1556f0b`
- Lead persistido con:
  - `status=received`
  - `emailStatus=sent`
  - `emailSentAt` presente

Resultado: **OK**.

## Hallazgos

### P0

Ninguno.

### P1

Ninguno.

### P2

1. **Evidencia incompleta de `Portada` en panel empresa**
   - En el flujo automatizado sin carga real de imagen no se observo el texto `Portada`.
   - Los cambios de version correctos estan desplegados y el flujo principal de creacion/envio funciona.
   - Riesgo: si el selector de portada depende solo de fotos cargadas, queda pendiente una validacion con upload real.
   - Recomendacion: hacer una pasada puntual con imagen real antes de cerrar totalmente esta expectativa visual.

2. **Mensaje exacto `Tu informacion fue recibida.` no quedo capturado como texto persistente**
   - La transicion funcional si ocurrio: API `submit-review=200` y estado `Recibido` visible.
   - Riesgo: bajo/medio de copy transitorio o reemplazado por estado, no de bloqueo funcional.
   - Recomendacion: Producto/Release puede aceptar si `Recibido` es suficiente; si el copy exacto es criterio, pedir ajuste o prueba manual puntual.

### P3

1. **404 no bloqueante en consola admin**
   - Se observo un `Failed to load resource: 404` durante la sesion admin.
   - No impidio login, acciones de estado ni feedback.
   - Recomendacion: revisar en ciclo de limpieza, no bloquea MVP.

2. **Emails internos no verificados en mailbox**
   - Activacion/aprobacion reporto `email_sent`.
   - Lead/contacto quedo persistido con `emailStatus=sent`.
   - No se verifico contenido visual final en bandeja de entrada desde QA.
   - Recomendacion: si Release requiere evidencia de copia exacta, completar con acceso a mailbox o captura de proveedor.

## Riesgos

- Riesgo bajo de copy/UX pendiente en panel por `Portada` y mensaje exacto posterior a envio.
- Riesgo bajo de asset faltante o ruta residual por 404 en admin.
- Riesgo operacional bajo en emails: el envio reporta exito, pero QA no valido render final de correos en mailbox.

## Limpieza

- La empresa QA utilizada para la validacion fue rechazada al final de la prueba para evitar exposicion publica permanente.
- No se modifico codigo de producto.

## Recomendacion

**Release recomendado con P2/P3 aceptados**, siempre que Product / Architect / Release acepte:

- Validar `Portada` con upload real en una pasada puntual posterior o antes del go final.
- Aceptar `Recibido` como confirmacion suficiente, o pedir ajuste si el copy exacto es obligatorio.
- No bloquear por el 404 admin no funcional ni por ausencia de evidencia visual de mailbox.

Desde QA, los flujos MVP principales desplegados en Azure quedan funcionales para publico, panel empresa, admin interno y envio de contacto.
