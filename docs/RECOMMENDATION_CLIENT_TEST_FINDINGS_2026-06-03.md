# Recomendacion Pulso: Hallazgos prueba cliente 2026-06-03

## Contexto

Se realizo una prueba con un cliente sobre el flujo actual de Punto Evento. La prueba confirma que el flujo base funciona, pero detecta fricciones de pre-lanzamiento en cuatro superficies:

- Panel de empresas.
- Admin interno.
- Pagina publica.
- Emails/contacto.

Estos hallazgos no se deben tratar como rediseño general. Son ajustes de claridad operativa antes de invitar o atender mas empresas reales.

## Lectura Pulso

El problema principal no es visual. El cliente detecto confusion sobre:

- si la empresa esta cargando informacion o enviandola a revision;
- si el admin esta aprobando una empresa o solo servicios pendientes;
- que botones del admin son realmente operativos;
- si la cotizacion llega por email, a que correo y a quien;
- si la pagina publica debe orientar por categorias de servicios o tipos de evento.

La recomendacion es convertir esto en tareas pequenas por superficie y cerrar primero las decisiones de producto/contacto.

## Prioridades sugeridas

### P1: Definir y corregir flujo de contacto/cotizacion

Hallazgo:

- Se creo una cotizacion, pero no se recibieron correos.
- No esta claro si el correo llega a Punto Evento, a la empresa o a ambos.
- El cliente sugiere quitar `Pedir presupuesto` y agregar `Contactar` en botones visibles, levantando WhatsApp.

Decision requerida:

- Definir si el MVP usa:
  - cotizacion por email;
  - contacto directo por WhatsApp;
  - ambos.

Recomendacion Pulso:

- Para pre-lanzamiento, priorizar contacto directo por WhatsApp cuando la empresa tenga WhatsApp configurado.
- Mantener email transaccional como tarea P1 si se requiere trazabilidad de leads.
- Quitar o redefinir botones que prometen cotizacion si el envio de email aun no esta configurado.

Riesgo si no se hace:

- Se pierden leads o el usuario cree que contacto a la empresa cuando nadie recibio aviso.

### P1: Separar aprobacion de empresa vs aprobacion de servicios en admin

Hallazgo:

- En admin, una empresa ya aprobada seguia mostrando boton de aprobar empresa.
- El caso observado fue CandyCakes: empresa publicada, pero servicios pendientes.
- El admin deberia dejar claro si se aprueban servicios de una empresa aprobada o si se aprueba la empresa.

Recomendacion Pulso:

- Si `company.status` ya esta publicado/aprobado, no mostrar accion principal `Aprobar empresa`.
- Mostrar acciones enfocadas en servicios pendientes.
- Despues de aprobar, mostrar aviso especifico, por ejemplo: `Servicio aprobado` o `Empresa aprobada`.
- Esperar unos segundos y avanzar a la siguiente pendiente solo si eso no oculta feedback importante.

Riesgo si no se hace:

- Admin puede aprobar/revisar la entidad equivocada o desconfiar del estado real del expediente.

### P1: Simplificar lenguaje del panel empresa

Hallazgo:

- En crear servicios, el cliente pidio quitar `Guardar borrador` y `Enviar a revision`.
- Sugiere usar solo `Cargar`.
- Cambiar `cover` por `portada`.
- Eliminar textos que hablen de revision interna de datos, servicios o fotos; debe parecer que la empresa carga contenido y luego se muestra, no que entra a un proceso complejo.

Decision requerida:

- Definir si al proveedor se le comunica explicitamente que hay revision interna o si se usa lenguaje mas simple.

Recomendacion Pulso:

- Mantener revision interna como regla de backend/admin.
- En UI proveedor, usar lenguaje simple:
  - `Cargar servicio`.
  - `Portada`.
  - `Fotos del servicio`.
  - `Tu informacion fue recibida`.
- Evitar texto que parezca tramite o cola de revision salvo donde sea estrictamente necesario.

Riesgo si no se hace:

- La empresa puede sentir que el panel es burocratico o no entender si su informacion ya quedo cargada.

### P2: Limpiar navegacion admin

Hallazgo:

- En admin solo parece funcionar `Modelo nuevo`.
- Si `Revision`, `Empresa demo` o `Servicios` no hacen nada util en el flujo actual, eliminarlos u ocultarlos.

Recomendacion Pulso:

- Dejar admin enfocado en el flujo operativo real.
- Ocultar tabs legacy/demo si ya no aportan a moderacion MVP.

Riesgo si no se hace:

- El admin se percibe como incompleto o confuso durante operacion real.

### P2: Unificar categorias en pagina publica y panel empresa

Hallazgo:

- La pagina publica muestra tipos de evento.
- El cliente sugiere usar la lista de categorias del formulario de crear servicios.
- Los atajos de la pagina tambien deberian ser categorias de servicios, no eventos.

Recomendacion Pulso:

- Usar una misma fuente/lista de categorias para:
  - panel empresa;
  - filtros publicos;
  - atajos publicos;
  - busqueda/listado.

Riesgo si no se hace:

- Empresas cargan servicios con categorias que no coinciden con la forma en que usuarios buscan.

### P2: Mantener al usuario en resultados al filtrar

Hallazgo:

- Al buscar con filtros, la pagina refresca o vuelve al header.
- Deberia quedar a nivel de resultados.

Recomendacion Pulso:

- Despues de aplicar filtros, hacer scroll/foco a resultados.
- Evitar que la interaccion parezca recarga completa.

Riesgo si no se hace:

- El usuario puede creer que no paso nada o perder continuidad en la busqueda.

### P2: Mejorar textos de emails

Hallazgo:

- Mejorar textos de emails hacia clientes/proveedores.
- Agregar bienvenida cuando la empresa fue aprobada.

Recomendacion Pulso:

- Primero confirmar proveedor y envio real de emails.
- Luego crear copy transaccional elegante para:
  - empresa registrada;
  - empresa aprobada/bienvenida;
  - servicio cargado/publicado si aplica;
  - cotizacion/contacto recibido.

Riesgo si no se hace:

- Aunque el email funcione, la experiencia puede sentirse poco profesional.

## Tareas sugeridas para Product / Architect / Release

### TASK A: Decision contacto/cotizacion MVP

Rol: Product / Architect / Release

Tarea:
Definir si el MVP usara cotizacion por email, contacto directo por WhatsApp o ambos.

Salida esperada:

- Decision en `docs/DECISION_LOG.md`.
- Backlog actualizado con tareas Web/Backend/QA.

### TASK B: Ajuste panel empresa lenguaje simple

Rol: Web Dev

Tarea:
Simplificar la pantalla de crear servicios:

- Reemplazar `Guardar borrador` / `Enviar a revision` por una accion principal simple, por ejemplo `Cargar`.
- Cambiar `cover` por `portada`.
- Quitar comentarios/textos que hablen de revision interna si Product lo aprueba.

Salida esperada:

- UI mas simple para empresa.
- QA responsive basico.

### TASK C: Ajuste admin aprobacion por estado

Rol: Web Dev + Backend/API si aplica

Tarea:
Ajustar admin para que las acciones dependan del estado real:

- Empresa pendiente: accion de aprobar/rechazar empresa.
- Empresa publicada con servicios pendientes: acciones de aprobar/rechazar servicios.
- Mostrar feedback especifico al aprobar.
- Evaluar ocultar tabs legacy/demo que no operan.

Salida esperada:

- Admin no muestra acciones ambiguas.
- QA valida empresa aprobada con servicio pendiente.

### TASK D: Ajuste pagina publica categorias y contacto

Rol: Web Dev

Tarea:
Unificar filtros/atajos publicos con categorias de servicios y ajustar botones publicos segun decision de contacto/cotizacion.

Incluye:

- Reemplazar tipos de evento por categorias de servicios si Product lo aprueba.
- Al filtrar, mantener foco/scroll en resultados.
- Quitar o redefinir `Pedir presupuesto`.
- Agregar `Contactar` con WhatsApp si corresponde.

Salida esperada:

- Pagina publica orientada a categorias reales de servicios.
- Flujo de contacto claro.

### TASK E: Emails transaccionales copy y envio

Rol: Backend/API + Infra Azure + Product copy + QA

Tarea:
Confirmar configuracion de email y mejorar textos.

Casos:

- Aviso interno por registro.
- Aviso interno por servicio cargado/pendiente si aplica.
- Bienvenida a empresa aprobada.
- Cotizacion/contacto a empresa o confirmacion al cliente, segun decision.

Salida esperada:

- Emails configurados, probados y con copy aceptado.

## Recomendacion final

Antes de pasar tareas a Web Dev, Product / Architect / Release debe cerrar la decision de contacto/cotizacion:

```text
Email, WhatsApp o ambos.
```

Luego dividir en tareas pequenas por superficie:

1. Panel empresa.
2. Admin.
3. Pagina publica/contacto.
4. Emails.

No mezclar todo en una sola tarea.
