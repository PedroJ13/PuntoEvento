# Next steps para Punto Evento

## Estado actual

La app ya funciona como prototipo navegable con una primera API serverless para registro de empresas:

- Home comercial con buscador.
- Landing de bodas con filtros demo.
- Ficha de proveedor con carrusel de imagenes.
- Pagina para empresas/proveedores.
- Formulario lateral de cotizacion.
- Datos de proveedores cargados desde `data/providers.json`.
- Paquetes cargados desde `data/packages.json`.
- Categorias cargadas desde `data/categories.json`.
- Fichas por proveedor con rutas tipo `#proveedor/casa-arboleda`.
- Fallback de imagen en `assets/images/fallback-provider.svg`.
- Configuracion base para Azure Static Web Apps.
- Carpeta `api/` creada con endpoints minimos de registro, subida de imagenes y lectura de proveedores publicados.
- Workflow de Azure Static Web Apps configurado con `api_location: "api"`.
- CSP preparada para llamadas a `/api` y subida con SAS a Azure Blob Storage, sin `data:` en imagenes.

Validacion actual:

- Las rutas principales cargan correctamente.
- No hay errores de JavaScript en consola.
- La demo funciona desde un servidor estatico local, por ejemplo `http://127.0.0.1:4173/index.html`.
- El formulario de cotizacion valida campos minimos, pero no envia datos reales.
- Al enviar una cotizacion demo se muestra una confirmacion dentro del drawer.
- El boton de WhatsApp muestra una accion demo; no abre conversaciones reales todavia.
- El registro de empresas intenta usar Azure Functions; en local cae a confirmacion demo si la API no esta disponible.
- El formulario de empresas pide nombre, categoria, zona, WhatsApp, email, descripcion, consentimiento y fotos.
- Las imagenes del registro se validan como JPG/PNG/WEBP, maximo 6 y maximo 5 MB cada una.
- Los datos dinamicos de proveedores, paquetes y categorias se escapan antes de pintarse en HTML.
- En produccion, si la API de registro falla, se muestra error real en vez de confirmacion demo.
- La API reserva uploads antes de emitir SAS con slots atomicos por proveedor y valida reserva, `contentType`, tamano real y blob antes de registrar una imagen.
- El SAS de subida vence en 10 minutos; la reserva vence en 15 minutos para dar margen al registro posterior.
- El limite de 6 imagenes se protege con filas `slot-1` a `slot-6`; las imagenes legacy sin `slotNumber` se tratan como cupos ocupados antes de reservar nuevos slots.
- El cleanup no libera un slot vencido si ya existe una imagen activa asociada; los flujos admin futuros deben liberar slots al rechazar o eliminar imagenes.
- Las reservas de imagen vencidas se pueden limpiar por proveedor o de forma global; el cleanup borra metadata y blob pendiente para no bloquear cupo ni acumular archivos huerfanos.
- Las imagenes dinamicas ya no aceptan URLs `data:`.

Nota de alcance:

- Esta version sigue siendo una demo estatica.
- Hay aviso por correo para nuevos registros si SendGrid esta configurado.
- No hay integracion real con WhatsApp ni publicacion automatica de empresas.
- La API de registro ya esta en el repo, pero requiere variables de entorno en Azure para operar.
- Los leads reales deben definirse en una fase posterior o enviarse primero a un formulario externo.
- Existe una primera version de panel admin en `/admin`; falta endurecer roles, auditoria e historial.

## API actual

Implementada en `api/`:

```text
POST /api/register-provider
POST /api/create-upload-url
POST /api/register-upload
GET /api/providers
```

Uso esperado:

- `register-provider`: guarda empresa en `Providers` con `status: pending`.
- `register-provider`: intenta enviar aviso por correo al administrador si SendGrid esta configurado.
- `create-upload-url`: genera SAS temporal para subir a `uploads-pending`.
- `register-upload`: registra imagen en `ProviderImages` con `status: pending`.
- `providers`: devuelve solo proveedores publicados y solo imagenes del container `public`.

Variables pendientes de configurar en Azure Static Web Apps:

```text
AZURE_STORAGE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME
AZURE_STORAGE_PENDING_CONTAINER=uploads-pending
AZURE_STORAGE_PUBLIC_CONTAINER=public
AZURE_TABLE_CONNECTION_STRING
AZURE_TABLE_PROVIDERS=Providers
AZURE_TABLE_PROVIDER_IMAGES=ProviderImages
ALLOWED_ORIGINS=https://<tu-static-web-app>.azurestaticapps.net,https://puntoevento.cr
SENDGRID_API_KEY=<api-key>
NOTIFICATION_EMAIL_TO=pj13eros_business@outlook.com
NOTIFICATION_EMAIL_FROM=<sender-verificado-en-sendgrid>
NOTIFICATION_EMAIL_FROM_NAME=Punto Evento
APP_PUBLIC_URL=https://<tu-static-web-app>.azurestaticapps.net
ADMIN_USERNAME=<usuario-admin>
ADMIN_PASSWORD=<password-admin-largo>
```

## Prioridad 1: Pulir la demo comercial

Objetivo: que la demo sea suficientemente clara para presentarla a un cliente, socio o proveedor.

Tareas:

- Ajustar textos finales de la home para vender mejor la propuesta.
- Reemplazar imagenes genericas por imagenes mas consistentes entre si.
- Crear 2 o 3 proveedores demo adicionales con perfiles completos.
- Mejorar los paquetes para que parezcan ofertas reales.
- Agregar testimonios en home y landing de bodas.
- Agregar una seccion de "Cotiza con varios proveedores a la vez".
- Revisar que todos los textos digan claramente "demo" cuando una accion no sea real.

Entregable:

- Demo presentable para validar concepto.

## Prioridad 2: Mejorar datos y estructura

Objetivo: que el contenido sea facil de mantener sin tocar tanto codigo.

Tareas:

- Agregar filtros reales sobre los datos cargados desde JSON.
- Permitir que cada categoria lleve a un listado filtrado.
- Hacer que la ficha muestre datos clave mas especificos por proveedor.
- Crear estados vacios para cuando no haya resultados.
- Crear estados de error mas amigables si falla la carga de datos.

Entregable:

- Demo mas cercana a un MVP real.

## Prioridad 3: Conversion y negocio

Objetivo: convertir visitantes en leads medibles.

Tareas:

- Definir el flujo de cotizacion multiple:
  - evento,
  - fecha,
  - invitados,
  - presupuesto,
  - servicios requeridos,
  - contacto.
- Crear una pantalla o modal de confirmacion despues de enviar solicitud.
- Definir como se enviarian los leads en MVP:
  - formulario externo,
  - email,
  - WhatsApp,
  - archivo,
  - servicio tipo Formspree,
  - Azure Function.
- Agregar eventos de medicion:
  - busqueda,
  - ver proveedor,
  - abrir WhatsApp,
  - enviar cotizacion,
  - publicar empresa.

Entregable:

- Demo preparada para medir interes real.

## Prioridad 4: Responsive y accesibilidad

Objetivo: que se vea bien en celular y sea mas usable.

Tareas:

- Revisar mobile en home, bodas, proveedor y empresas.
- Afinar tamanos de botones y tarjetas.
- Mejorar navegacion mobile.
- Agregar foco visible consistente.
- Revisar contraste de textos y badges.
- Revisar navegacion con teclado en carrusel y modal.

Entregable:

- Demo usable en desktop y mobile.

## Prioridad 5: Preparar MVP en Azure

Objetivo: publicar una version barata, rapida y mantenible.

Tareas:

- Configurar variables de entorno de la API en Azure Static Web Apps.
- Probar registro real con Table Storage y Blob Storage.
- Subir imagenes definitivas a Azure Blob Storage.
- Cambiar URLs de Unsplash por URLs propias.
- Definir dominio, por ejemplo `puntoevento.cr`.
- Revisar headers de seguridad y cache.

Entregable:

- Demo publica para compartir.

## Prioridad 6: Futuro producto

Objetivo: pasar de demo estatica a plataforma.

Tareas:

- Backend para solicitudes de cotizacion.
- Panel basico para proveedores.
- Login de proveedores.
- Administracion de perfiles, fotos y paquetes.
- Moderacion/verificacion de proveedores.
- Busqueda real por categoria, ubicacion, precio y disponibilidad.
- Planes pagados para proveedores destacados.

Entregable:

- Roadmap de plataforma completa.

## Estado actualizado: publicada en Azure con API en repo

Como la pagina ya esta en Azure y el repo ya incluye API, el foco deja de ser construir la base y pasa a configurar, validar, medir y convertir.

Objetivos inmediatos:

- Validar que la version publica funcione bien.
- Validar que `/api/register-provider`, `/api/create-upload-url`, `/api/register-upload` y `/api/providers` respondan en Azure.
- Medir visitas e interes real.
- Capturar solicitudes de cotizacion.
- Preparar contenido mas creible.
- Decidir que se construye como MVP y que se deja para despues.

## Recomendacion inmediata post Azure

El siguiente paso recomendado es convertir la pagina publicada en una demo comercial medible:

1. Revisar la URL publica en desktop y mobile.
2. Configurar dominio propio, por ejemplo `puntoevento.cr`.
3. Activar analitica para medir visitas, clicks y formularios.
4. Conectar el formulario de cotizacion a un destino real.
5. Reemplazar imagenes demo por imagenes propias o autorizadas.
6. Completar 8 a 12 proveedores demo con datos mas reales.
7. Preparar una presentacion corta para mostrar la propuesta.

Con eso se puede validar la propuesta antes de invertir en backend, panel de administracion o pagos.

## Checklist post despliegue Azure

## 1. Validacion tecnica

- Confirmar que la URL publica carga sin errores.
- Probar rutas:
  - inicio,
  - bodas,
  - proveedor,
  - empresas.
- Probar que `data/providers.json` carga en produccion.
- Probar que las imagenes externas cargan correctamente.
- Revisar consola del navegador en produccion.
- Revisar mobile real, no solo desktop.

## 2. Dominio y confianza

- Conectar dominio propio.
- Verificar HTTPS.
- Crear favicon.
- Agregar imagen social para compartir por WhatsApp, Facebook y LinkedIn.
- Agregar nombre, descripcion y metadata SEO basica.

## 3. Captura de leads

- Definir a donde llega una solicitud de cotizacion:
  - email,
  - WhatsApp,
  - Google Sheet,
  - Airtable,
  - Azure Function.
- Guardar campos minimos:
  - tipo de evento,
  - fecha,
  - invitados,
  - presupuesto,
  - nombre,
  - telefono,
  - mensaje.
- Crear mensaje de confirmacion claro.
- Medir cuantos usuarios abren y envian el formulario.

## 4. Medicion

- Instalar analitica.
- Medir:
  - visitas,
  - busquedas,
  - clicks en proveedor,
  - clicks en WhatsApp,
  - envios de cotizacion,
  - clicks en "Publicar empresa".
- Crear eventos separados para cliente final y proveedor.

## 5. Contenido para validacion

- Crear proveedores demo por categoria:
  - salones,
  - catering,
  - musica,
  - decoracion,
  - fotografia,
  - organizacion.
- Usar precios consistentes.
- Agregar fotos coherentes.
- Agregar paquetes mas comerciales.
- Agregar testimonios demo o reales si existen.

## 6. Decision de MVP

Despues de medir la demo publicada, decidir entre:

- Mantener MVP estatico con JSON y formulario conectado.
- Agregar Azure Function para recibir leads.
- Agregar base de datos.
- Crear panel de proveedores.
- Crear planes pagados y destacados.

## Sprint corto sugerido

Para el proximo bloque de trabajo, el orden mas conveniente es:

1. Configurar variables de entorno de la API en Azure Static Web Apps.
2. Probar registro real con `uploads-pending`, `Providers` y `ProviderImages`.
3. Configurar `ALLOWED_ORIGINS` antes de produccion y definir CAPTCHA/rate limit antes de abrir el registro al publico.
4. Agregar limpieza programada de `uploads-pending`: Timer Function usando `cleanupExpiredReservations(null, config)` o lifecycle rule del container para borrar blobs abandonados.
5. Endurecer seguridad admin con Azure Static Web Apps Auth/roles, rate limit o gateway antes de produccion.
6. Revisar la URL publica en produccion.
7. Probar responsive en 375px, 768px y desktop.

Este sprint mantiene el proyecto barato y estatico, pero ya lo acerca a una validacion comercial real.
