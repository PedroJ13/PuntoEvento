# Recomendacion QA Flujo MVP: pre-lanzamiento

## Contexto

Revision solicitada para validar que el flujo MVP tenga sentido de punta a punta antes de continuar con primeras empresas reales.

Alcance revisado:

- Registro/acceso de empresa.
- Carga de servicios e imagenes desde panel empresa.
- Aprobacion interna de empresa y servicios.
- Publicacion en pagina publica.
- Busqueda publica por servicio.
- Contacto/cotizacion por WhatsApp y formulario/email.

Ambiente:

- Revision documental y lectura de codigo local.
- No se ejecuto Azure.
- No se usaron credenciales reales.
- No se implemento codigo.

## Resultado general

Resultado QA: `aprobado con observaciones P2/P3`.

No se identifico un P1 nuevo confirmado en la logica MVP.

El flujo principal tiene sentido para pre-lanzamiento controlado:

```text
Empresa se registra
-> Punto Evento CR revisa empresa
-> Admin aprueba empresa
-> Sistema envia invitacion/activacion
-> Empresa activa acceso o inicia sesion
-> Empresa carga servicios e imagenes
-> Servicio queda recibido/pendiente
-> Admin aprueba servicio e imagenes asociadas
-> Servicio aparece en busqueda publica
-> Usuario abre ficha de empresa/servicio
-> Usuario contacta por WhatsApp o envia formulario/email
```

La decision vigente de usar WhatsApp como canal primario y email como respaldo/trazabilidad es coherente con el MVP.

## Hallazgos P1

Ninguno confirmado.

## Hallazgos P2

### P2: CTAs publicos sin servicio seleccionado

Flujo:

Usuario publico -> pagina publica -> contacto/cotizacion.

Problema:

Existen CTAs publicos que pueden abrir el drawer de contacto sin `companyId` ni `serviceId`, por ejemplo acciones tipo `Cotizacion multiple`, `Contactar proveedores` o botones `data-open-quote` fuera de una ficha de servicio publicada.

Impacto:

El usuario puede iniciar una accion de contacto que parece operativa, pero el sistema luego indica que debe abrir un servicio publicado para enviar una solicitud real. Esto no rompe el MVP si el flujo principal por servicio funciona, pero puede generar friccion y perdida de intencion de contacto.

Decision requerida:

Definir si el MVP soportara solicitud multi-proveedor o si todos los contactos deben partir de un servicio publicado.

Recomendacion:

Para el MVP, mantener la regla simple:

```text
Todo lead real debe estar asociado a companyId + serviceId.
```

Los CTAs sin servicio deberian dirigir a resultados/listado o seleccionar un servicio antes de abrir el formulario.

Equipo sugerido:

Product / Architect / Release para decision y Web Dev para ajuste.

Tarea sugerida:

`TASK-QA-FLUJO-001`: Ajustar CTAs publicos sin contexto de servicio.

### P2: Superficie legacy/demo visible en admin productivo

Flujo:

Admin interno -> moderacion de empresas y servicios.

Problema:

El admin conserva pestañas y controles visibles para `Legacy`, `Demo`, `Servicios demo` y `Ver modo demo local`.

Impacto:

No bloquea el flujo si el admin usa `Empresas y servicios`, pero puede confundir durante operacion real. Tambien puede hacer que el panel parezca una mezcla de produccion y demo.

Decision requerida:

Definir si esas superficies deben seguir visibles en Azure productivo o quedar solo disponibles en modo local/query param.

Recomendacion:

Ocultar legacy/demo en uso productivo y dejar el admin enfocado en el expediente nuevo:

```text
Empresas pendientes
Servicios revisables
Expediente por empresa
Acciones de aprobar/rechazar
```

Equipo sugerido:

Product / Architect / Release para alcance y Web Dev para ajuste.

Tarea sugerida:

`TASK-QA-FLUJO-002`: Ocultar flujo legacy/demo del admin productivo.

### P2: Fallback demo publico si falla API

Flujo:

Pagina publica -> busqueda/listado -> servicios publicados.

Problema:

La pagina publica puede caer a datos demo si la API publica no responde.

Impacto:

En una demo temprana puede ser util, pero en pre-lanzamiento con empresas reales puede mostrar un catalogo no operativo o generar contactos que no corresponden al estado real de Azure.

Decision requerida:

Definir politica de fallback productivo:

- mostrar demo si API falla;
- mostrar estado vacio/error controlado;
- o mostrar demo solo en local.

Recomendacion:

Para pre-lanzamiento real, preferir un estado controlado cuando la API falle:

```text
No pudimos cargar los servicios publicados. Intenta de nuevo en unos minutos.
```

Mantener demo solo en local o detras de una bandera clara.

Equipo sugerido:

Product / Architect / Release para decision y Web Dev para ajuste.

Tarea sugerida:

`TASK-QA-FLUJO-003`: Definir y ajustar fallback publico ante falla API.

## Hallazgos P3

### P3: Lenguaje de revision aun visible para empresas

Flujo:

Registro empresa -> acceso al panel -> carga de servicios.

Observacion:

El lenguaje de revision/moderacion sigue visible en varias piezas del registro publico. Esto es correcto desde la logica operativa, pero puede sentirse mas burocratico que comercial.

Recomendacion:

Aceptar como P3 si Product quiere transparencia. Ajustar copy luego si se busca una experiencia mas simple:

```text
Tu informacion fue recibida.
Te enviaremos acceso para completar tu perfil.
```

Equipo sugerido:

Product Copy / Web Dev.

### P3: Modulos proximos visibles en panel empresa

Flujo:

Empresa -> panel privado.

Observacion:

El panel muestra secciones deshabilitadas como mensajes, metricas, planes y reportes con `Proximamente`.

Impacto:

No bloquea el MVP, pero puede abrir expectativas y preguntas de soporte con primeras empresas.

Recomendacion:

Mantener solo si Product acepta el valor comercial de mostrar roadmap. Si se quiere reducir friccion, ocultar hasta despues del primer lote real.

Equipo sugerido:

Product / Architect / Release.

## Recomendacion para Product / Architect / Release

### Estado de release sugerido

Mantener:

```text
GO pre-lanzamiento controlado; P2/P3 aceptables.
```

Condicion recomendada:

Antes de invitar varias empresas, ejecutar un test real con una primera empresa en Azure limpio y monitoreo cercano.

### Ahora sugerido

Maximo 3 items:

1. QA/Product: registrar primera empresa real desde cero en Azure limpio.
2. Product: decidir comportamiento de CTAs publicos sin servicio seleccionado.
3. Product: decidir si admin legacy/demo queda visible en ambiente productivo.

### Siguiente sugerido

1. Web Dev: ajustar CTAs publicos segun decision.
2. Web Dev: ocultar admin legacy/demo si Product lo aprueba.
3. Web Dev: ajustar fallback publico de API si Product lo aprueba.
4. QA: revalidar flujo completo post-ajustes o aceptar P2/P3 formalmente.

## Riesgos si no se corrige

- Usuarios pueden intentar enviar una solicitud desde CTAs sin servicio y abandonar al ver que falta contexto.
- Admin interno puede entrar en pestañas demo/legacy y dudar cual flujo es productivo.
- Si la API publica falla, la pagina podria mostrar datos demo en una etapa donde ya se espera catalogo real.
- Primeras empresas pueden pedir soporte por secciones `Proximamente` o por lenguaje de revision.

## Cierre QA

QA no recomienda bloquear el pre-lanzamiento por estos hallazgos.

Si Product / Architect / Release acepta los P2/P3, el siguiente paso operativo sigue siendo:

```text
Registrar la primera empresa real desde cero y confirmar el flujo manual con ambiente limpio.
```
