# Revision UX de flujos web - Punto Evento CR

Fecha: 2026-06-08  
Rol: Diseno UX  
Documento revisado: `docs/WEB_PAGE_FLOWS.md`

## Resumen UX

Los flujos principales estan bien definidos para MVP y respetan el modelo recomendado `Empresa -> Servicios`. La mayor oportunidad no es cambiar arquitectura, sino reducir ambiguedad en los puntos donde usuarios externos, empresas y admin deben tomar decisiones.

La friccion principal aparece cuando la logica interna del sistema queda visible para el usuario: estados tecnicos, multiples canales de contacto, aprobaciones, servicios vs empresas y catalogo vacio. Para primeras empresas reales, conviene priorizar mejoras pequenas de copy, jerarquia visual y microinteracciones.

## Hallazgos por severidad

### P1 - Riesgo de confusion en cotizacion/contacto

El flujo define WhatsApp como canal primario cuando exista y email como respaldo/trazabilidad. Es una decision correcta para MVP, pero en UI puede confundirse si los botones prometen acciones distintas o si el usuario no entiende si esta abriendo WhatsApp, enviando una solicitud o ambas cosas.

Tipo: mejora recomendable antes de aumentar trafico publico.  
Riesgo: abandono o expectativas incorrectas despues de tocar `Solicitar cotizacion`.

Recomendacion:

- Usar un CTA principal unico en ficha: `Solicitar cotizacion`.
- Cuando haya WhatsApp, aclarar con microcopy cercano: `Te abriremos WhatsApp con el servicio seleccionado.`
- Cuando se use formulario/email: `Enviaremos tu solicitud a la empresa y quedara registrada por Punto Evento CR.`
- La confirmacion debe decir que ocurrio: `WhatsApp abierto` o `Solicitud enviada`.

### P1 - Resultados por servicio pueden confundirse con resultados por empresa

El flujo correcto es mostrar servicios que coinciden con la busqueda, con contexto de empresa. La UI debe reforzar esto en tarjetas y ficha para evitar que el usuario piense que esta comparando solo empresas.

Tipo: mejora recomendable MVP.  
Riesgo: menor conversion porque el usuario no entiende que cotiza un servicio especifico.

Recomendacion:

- En tarjetas publicas, jerarquia: titulo principal = servicio; subtitulo = empresa.
- En ficha publica, mostrar arriba: servicio seleccionado + empresa + categoria/ubicacion + CTA.
- Copy sugerido: `Estas cotizando este servicio de {empresa}.`

### P1 - Registro de empresa puede sentirse discontinuo

El flujo separa correctamente registro, invitacion y activacion. La friccion aparece si la empresa no entiende que no crea password inmediatamente y que el acceso llegara por correo en un paso posterior.

Tipo: mejora recomendable antes de invitar primeras empresas.  
Riesgo: empresas creen que el registro fallo o preguntan manualmente por acceso.

Copy sugerido post-registro:

```text
Recibimos tu solicitud.
Te enviaremos las instrucciones de acceso por correo cuando tu cuenta este lista.
```

### P2 - Estados de servicio necesitan lenguaje de negocio

Los estados `draft`, `pending`, `published`, `rejected`, `inactive` son claros para el sistema, pero deben verse como acciones o situaciones entendibles para empresas.

Tipo: mejora recomendable.  
Riesgo: empresas no saben si deben esperar, editar o reenviar.

Mapping sugerido:

```text
draft -> Borrador
pending -> En revision
published -> Publicado
rejected -> Necesita cambios
inactive -> Inactivo
```

Microcopy sugerido:

- `Borrador`: `Solo tu empresa puede verlo.`
- `En revision`: `Punto Evento CR esta revisando este servicio.`
- `Publicado`: `Este servicio puede aparecer en busquedas publicas.`
- `Necesita cambios`: `Edita la informacion y vuelve a enviarlo a revision.`
- `Inactivo`: `No aparece en la pagina publica.`

### P2 - Admin concentra demasiadas decisiones en una sola vista

El admin debe revisar empresa, servicios e imagenes. Si no hay una jerarquia clara, aumenta la carga cognitiva.

Tipo: mejora recomendable.  
Riesgo: aprobaciones incompletas, errores de moderacion o dudas operativas.

Recomendacion:

- Cada expediente deberia iniciar con una linea de prioridad.
- Copy sugerido: `Empresa pendiente + 2 servicios por revisar + 5 fotos pendientes`.
- Despues de aprobar/rechazar, mostrar feedback: que se publico, que quedo pendiente y si se envio invitacion/email.

### P2 - Catalogo vacio es una experiencia critica

El documento lo trata correctamente como flujo propio. Para pre-lanzamiento, el catalogo vacio debe sentirse controlado y premium, no como ausencia de producto.

Tipo: mejora recomendable.  
Riesgo: usuarios publicos o empresas perciben sitio incompleto.

Recomendacion:

- Estado vacio con mensaje claro y CTA a registro/contacto.
- Evitar datos demo o referencias como si fueran reales.
- Copy sugerido: `Estamos preparando el catalogo de proveedores verificados. Si tienes una empresa de eventos, puedes solicitar acceso gratis.`

## Leyes UX relevantes

### Ley de Hick

Riesgo en busqueda, filtros y contacto: demasiadas opciones equivalentes aumentan el tiempo de decision.

Accion recomendada:

- Una accion primaria por pantalla.
- Reducir CTAs competidores en ficha publica.
- Mantener filtros publicos enfocados en servicio, categoria, evento y ubicacion.

### Ley de Fitts

Los CTAs importantes deben ser faciles de alcanzar, especialmente en mobile.

Accion recomendada:

- En ficha mobile, mostrar `Solicitar cotizacion` antes de una galeria larga.
- En panel mobile, mantener `Guardar borrador` y `Enviar a revision` con tamanos tactiles claros.

### Efecto de posicion serial

Lo primero y lo ultimo se recuerda mas.

Accion recomendada:

- Primer bloque de ficha: identidad + servicio + CTA.
- Ultimo paso de cada flujo: confirmacion clara con siguiente accion.

### Ley de Jakob

Los usuarios esperan patrones conocidos de marketplace: buscar, comparar, abrir ficha y contactar.

Accion recomendada:

- No introducir navegacion compleja para MVP.
- Mantener resultados como tarjetas simples y ficha con CTA evidente.

## Flujo optimizado propuesto

### Usuario publico busca y cotiza

1. Entra a la home.
2. Entiende que puede encontrar proveedores para eventos en Costa Rica.
3. Busca por servicio, categoria, tipo de evento o texto libre.
4. Ve resultados por servicio con contexto de empresa.
5. Abre ficha del servicio/proveedor.
6. Ve arriba servicio seleccionado, empresa, ubicacion/precio si aplica y CTA.
7. Toca `Solicitar cotizacion`.
8. Si hay WhatsApp, se abre mensaje prellenado con el servicio.
9. Si hay formulario/email, se registra lead y se muestra confirmacion.
10. Usuario entiende que paso y que sigue.

### Empresa se registra y carga servicios

1. Entra a seccion para empresas.
2. Completa registro.
3. Recibe confirmacion con el siguiente paso.
4. Admin aprueba.
5. Empresa recibe email de activacion.
6. Activa acceso y entra al panel.
7. Ve resumen de empresa y estado de servicios.
8. Crea servicio.
9. Guarda borrador o envia a revision.
10. Ve estado claro y proxima accion.

### Admin revisa expediente

1. Entra al admin.
2. Ve cola de expedientes con prioridad.
3. Abre expediente.
4. Revisa empresa, servicios e imagenes pendientes.
5. Aprueba o rechaza con feedback claro.
6. El sistema indica si se envio invitacion/email y que queda pendiente.

## Quick wins recomendados

1. Ajustar labels de estados a lenguaje de negocio.
2. Reforzar jerarquia en tarjeta publica: servicio primero, empresa segundo.
3. Agregar microcopy contextual al CTA de cotizacion segun canal.
4. Mejorar confirmacion post-registro de empresa.
5. En ficha publica mobile, mantener identidad y CTA antes de galeria extensa.
6. En admin, agregar linea resumen por expediente con pendientes reales.
7. En catalogo vacio, usar mensaje premium controlado y CTA a empresas.

## Que debe hacer Web Dev si Product crea tareas

- Cambios pequenos de copy en pagina publica, ficha y panel.
- Ajustes de jerarquia visual en tarjetas de resultados.
- Microcopy/confirmaciones diferenciadas para contacto por WhatsApp vs formulario/email.
- Labels legibles para estados de servicio y empresa.
- Resumen visual de pendientes en admin si los datos ya estan disponibles.

## Que debe decidir Product / Architect / Release

- Si estos hallazgos se convierten en tareas antes del test con primera empresa real o quedan como seguimiento post-test.
- Si el copy de cotizacion debe coordinarse con Copy / Gramatica antes de Web Dev.
- Si `Necesita cambios` reemplaza oficialmente a `Rechazado` en la interfaz de empresa.
- Si el estado vacio publico debe orientar principalmente a registro de empresas o a contacto directo con Punto Evento CR.

## Riesgos si no se corrige

- Menor conversion por ambiguedad entre servicio, empresa y cotizacion.
- Mas soporte manual a empresas por dudas de registro, activacion y estados.
- Moderacion admin mas lenta o propensa a errores.
- Percepcion de producto incompleto si catalogo vacio no se siente intencional.

## Siguiente tarea sugerida

Product / Architect / Release deberia revisar este documento y, si lo considera necesario, crear tareas acotadas para:

1. Copy de cotizacion/contacto y confirmaciones.
2. Labels/microcopy de estados de empresa y servicios.
3. Jerarquia visual de resultados por servicio.
4. Resumen de pendientes en admin.
