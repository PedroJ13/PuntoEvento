# Prioridades pre-lanzamiento

Contexto:

La prueba Product Owner fue positiva y sin issues. Punto Evento pasa de cierre MVP a pre-lanzamiento controlado.

Objetivo:

Preparar el producto para uso recurrente de primeras empresas reales sin redisenar la pagina publica ni abrir frentes grandes.

## Orden operativo

| Orden | Prioridad | Tema | Responsable principal | Motivo |
| --- | --- | --- | --- | --- |
| 1 | P1 | Login empresa con email/password | Backend/API + Web Dev | La invitacion sirve para activacion inicial, pero la empresa necesita acceso recurrente al panel. |
| 2 | P1 | Email de cotizacion a empresa | Backend/API + Web Dev | El marketplace necesita entregar leads a proveedores de forma operativa. |
| 3 | P1/P2 | Emails internos de registro y envio a revision | Backend/API / Infra Azure | Ayuda a operar moderacion sin revisar manualmente tablas o pantallas todo el tiempo. |
| 4 | P2 | Mejora UX/diseno enfocada | Web Dev + QA | Pulir experiencia antes de invitar empresas sin redisenar todo. |

## Tareas pequenas creadas

### TASK-158 - Backend/API: login empresa email/password

Prioridad: P1.

Objetivo:

Agregar autenticacion recurrente para empresas usando email/password, manteniendo invitacion como activacion inicial.

Docs a actualizar:

- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/ROUTE_MAP_MVP.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff si cambia estado de release.

Riesgos:

- Guardar passwords sin hash fuerte.
- Romper el flujo de invitacion existente.
- Permitir login a empresas rechazadas/suspendidas sin regla explicita.
- Exponer cookies, hashes o tokens en respuestas/logs.

### TASK-159 - Web Dev: UI de activacion/login recurrente en panel

Prioridad: P1.

Objetivo:

Actualizar `panel.html`/`panel.js` para que una empresa pueda activar acceso desde invitacion y luego iniciar sesion con email/password.

Docs a actualizar:

- `docs/ROUTE_MAP_MVP.md` si cambia alguna ruta.
- `docs/QA_TEST_PLAN.md` si cambia el flujo esperado de login.

Riesgos:

- Confundir activacion inicial con login normal.
- Dejar el panel inaccesible para empresas ya activadas.
- Mensajes de error que revelen si un email existe.

### TASK-160 - QA: validacion login recurrente empresa

Prioridad: P1.

Objetivo:

Validar activacion por invitacion, login recurrente, logout, sesion expirada, credenciales invalidas y permisos Empresa A vs Empresa B.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff si aprueba o bloquea pre-lanzamiento.

Riesgos:

- Falsos positivos si se prueba solo por API y no desde `panel.html`.
- No cubrir empresa rechazada/suspendida.
- No cubrir cookies/sesion entre navegadores.

### TASK-161 - Backend/API: email de cotizacion a empresa

Prioridad: P1.

Objetivo:

Crear el flujo backend minimo para recibir una solicitud de cotizacion desde pagina publica y enviar email a la empresa correspondiente.

Docs a actualizar:

- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md` si se persiste lead.
- `docs/ROUTE_MAP_MVP.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff.

Riesgos:

- Spam si no hay validacion/rate limit minimo.
- Enviar email a empresa no publicada o servicio no publicado.
- Exponer email privado en API publica.
- No guardar trazabilidad minima del lead.

### TASK-162 - Web Dev: formulario/CTA de cotizacion conectado

Prioridad: P1.

Objetivo:

Conectar el CTA de cotizacion/contacto de la pagina publica al flujo backend, manteniendo una experiencia simple y clara.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md` si cambia el caso de prueba.
- `docs/ROUTE_MAP_MVP.md` si cambia ruta/API consumida.

Riesgos:

- Redisenar de mas la pagina publica.
- Solicitudes duplicadas por doble submit.
- Mensajes de exito que prometan tiempos/respuestas no definidos.

### TASK-163 - QA: validacion email de cotizacion

Prioridad: P1.

Objetivo:

Validar que una solicitud publica envia email a la empresa correcta, no filtra email privado, maneja errores y evita doble submit.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff.

Riesgos:

- Probar con mailbox no observable.
- No validar servicio/empresa no publicados.
- No cubrir datos invalidos o incompletos.

### TASK-164 - Backend/API + Infra Azure: emails internos de registro y revision

Prioridad: P1/P2.

Objetivo:

Enviar notificacion interna cuando una empresa se registra y cuando envia un servicio a revision.

Docs a actualizar:

- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md` si se define proveedor de email o variables nuevas.
- `docs/MVP_RELEASE_STATUS.md` via handoff.

Riesgos:

- Bloquear registro o `submit-review` si falla el email.
- Falta de variables de entorno o remitente verificado.
- Duplicar notificaciones por reintentos.

### TASK-165 - QA: validacion emails internos

Prioridad: P1/P2.

Objetivo:

Validar notificacion interna de registro y envio a revision, incluyendo caso exitoso, fallo controlado del proveedor de email y no duplicados evidentes.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff.

Riesgos:

- Aprobar sin evidencia de recepcion.
- No cubrir que el flujo principal sigue funcionando si el email falla.

### TASK-166 - Web Dev: mejora UX/diseno enfocada

Prioridad: P2.

Objetivo:

Hacer un pulido acotado de UX/diseno en las superficies existentes sin redisenar completo.

Alcance sugerido:

- Claridad de CTAs principales.
- Estados de carga/exito/error.
- Legibilidad mobile.
- Consistencia visual en formularios de registro, panel y admin.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md` si agrega casos visuales.
- `docs/MVP_RELEASE_STATUS.md` via handoff si cambia readiness.

Riesgos:

- Convertirse en redisenio completo.
- Romper la pagina publica actual.
- Mezclar cambios visuales con auth/email.

### TASK-167 - QA: pasada visual/responsive pre-lanzamiento

Prioridad: P2.

Objetivo:

Validar desktop/mobile de pagina publica, registro, panel, admin, login recurrente y cotizacion despues de los P1.

Docs a actualizar:

- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md` via handoff.

Riesgos:

- Ejecutar antes de cerrar login y cotizacion, generando retrabajo.
- No separar hallazgos P1 bloqueantes de P2 aceptables.

## Reglas de secuencia

1. No empezar UX/diseno P2 hasta que login recurrente y cotizacion tengan contrato claro.
2. No desplegar UI de login sin backend listo o feature flag/estado claro.
3. No cerrar pre-lanzamiento sin QA de login recurrente y cotizacion.
4. Emails internos no deben bloquear registro ni envio a revision si el proveedor de email falla.
5. Cualquier cambio de contrato API debe actualizar `docs/API_CONTRACTS_MVP.md` en la misma tarea.
