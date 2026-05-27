# Equipo Web Dev: nuevo enfoque Punto Evento

## Contexto

La pagina publica actual queda bien por ahora.

El cambio principal esta en:

- Registro de empresas.
- Login de empresas.
- Panel administrativo.
- Manejo de multiples servicios/eventos por empresa.
- Busqueda publica por servicio, con acceso al perfil completo de empresa.

## Referencia funcional

La pagina de alta de InEventos pide:

- Nombre de empresa.
- Seccion principal.
- Otras secciones.
- Descripcion.
- Servicios ofrecidos.
- Tipos de eventos.
- Localizacion.
- Informacion de contacto.
- Usuario/password para panel de control.

Punto Evento puede simplificar esto, pero debe conservar la idea clave:

```text
Empresa -> usuario admin -> perfil -> varios servicios -> fotos/paquetes
```

## Modelo recomendado

## Empresa

Representa la marca o proveedor.

Ejemplo:

```text
Aurisbel
```

Contiene:

- Nombre comercial.
- Descripcion general.
- Ubicacion.
- Contacto.
- Logo.
- Portada.
- Redes.
- Estado.
- Plan.

## Servicio

Representa lo que la empresa ofrece en una categoria especifica.

Ejemplo:

```text
Aurisbel -> Queques
Aurisbel -> Wedding Planner
Aurisbel -> Mesa dulce
```

Cada servicio tiene:

- Categoria.
- Tipos de evento donde aplica.
- Descripcion propia.
- Precio desde.
- Fotos propias.
- Paquetes.
- Estado.
- Posicionamiento.

## Recomendacion para resultados de busqueda

Si el usuario busca "mesa dulce", recomendamos mostrar resultado por servicio, no solo por empresa.

## Opcion A: resultado por servicio

Card:

```text
Mesa dulce
Aurisbel
Foto de mesa dulce
Descripcion corta de mesa dulce
Precio desde
Boton: Cotizar mesa dulce
Link: Ver otros servicios de Aurisbel
```

Ventajas:

- El resultado coincide exactamente con lo que el usuario busco.
- Permite posicionar/pagar por servicio.
- Evita confundir con otros servicios de la misma empresa.
- Mejora conversion.

Desventajas:

- Puede aparecer la misma empresa varias veces si coincide con varias busquedas.

## Opcion B: resultado por empresa con servicios agrupados

Card:

```text
Aurisbel
Servicios: Queques, Wedding Planner, Mesa dulce
Descripcion general
Boton: Ver perfil
```

Ventajas:

- Menos repeticion.
- Mas simple de explicar.

Desventajas:

- El usuario que busco "mesa dulce" puede sentir que el resultado no es especifico.
- Dificulta vender posicion destacada por categoria.

## Opcion C: hibrida recomendada

Mostrar resultado por servicio, con contexto de empresa.

Ejemplo:

```text
Mesa dulce para eventos
por Aurisbel
Tambien ofrece: Queques, Wedding Planner
[Cotizar mesa dulce] [Ver perfil completo]
```

Al abrir:

- La pagina puede entrar directo al servicio buscado.
- En la misma pagina se muestran los otros servicios de la empresa.

Recomendacion final:

```text
Busqueda/listados = servicio
Perfil detalle = empresa + todos sus servicios
Cotizacion = servicio especifico
```

## Rutas sugeridas

Pagina publica:

```text
/
/servicios/:categoria
/empresa/:companySlug
/empresa/:companySlug/:serviceSlug
```

Admin:

```text
/admin/login
/admin/registro
/admin/dashboard
/admin/empresa
/admin/servicios
/admin/servicios/nuevo
/admin/servicios/:serviceId
/admin/fotos
/admin/planes
```

## Registro de empresa

Flujo:

1. Crear cuenta.
2. Confirmar email.
3. Crear perfil de empresa.
4. Crear primer servicio.
5. Cargar fotos.
6. Enviar a revision.
7. Publicar.

Pantallas:

- Registro.
- Login.
- Recuperar password.
- Perfil de empresa.
- Lista de servicios.
- Editor de servicio.
- Carga de fotos.
- Estado de publicacion.

## Admin de empresa

Dashboard debe mostrar:

- Estado del perfil.
- Servicios publicados.
- Servicios pendientes.
- Solicitudes recibidas.
- Boton para crear nuevo servicio.
- Sugerencia para destacar/plan pago.

Editor de servicio:

- Nombre del servicio.
- Categoria.
- Tipos de evento.
- Descripcion.
- Precio desde.
- Paquetes.
- Fotos.
- Estado: borrador, pendiente, publicado.

## Cambios necesarios en frontend actual

1. Separar datos mock en estructura company/service.
2. Cambiar `providers.json` por:

```text
data/companies.json
data/services.json
data/categories.json
data/event-types.json
```

3. Actualizar listados para renderizar servicios.
4. Actualizar ficha para abrir empresa y destacar servicio seleccionado.
5. Crear prototipo de admin.
6. Crear formulario de registro estilo InEventos, pero mas limpio.
7. Simular login si aun no existe backend.

## MVP sin backend completo

Mientras Infra prepara API:

- Mantener JSON local para mock.
- Crear pantallas admin con datos demo.
- Simular guardado con `localStorage`.
- Simular upload con preview local.
- Definir contratos JSON para backend.

## Entregables de Web Dev

1. Wireframe de admin.
2. Modelo visual Empresa/Servicio.
3. Registro de empresa.
4. Login demo.
5. Dashboard demo.
6. CRUD demo de servicios.
7. Busqueda publica por servicio.
8. Perfil empresa con todos los servicios.
9. Boton "Ver otros servicios de esta empresa".
10. Integracion posterior con Azure Functions.

