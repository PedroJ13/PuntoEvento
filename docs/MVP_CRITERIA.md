# Criterios MVP Punto Evento

## Objetivo del MVP

Validar que empresas proveedoras pueden registrarse, administrar sus servicios y recibir oportunidades de clientes desde Punto Evento.

## Incluye

## Pagina publica

- Home actual conservada.
- Busqueda/listado por servicios.
- Perfil de empresa con todos sus servicios.
- Servicio seleccionado destacado al venir desde busqueda.
- Formulario de cotizacion asociado a servicio especifico.

## Empresa proveedora

- Registro gratis.
- Login administrativo.
- Perfil de empresa.
- Crear y editar varios servicios.
- Cargar fotos por empresa y por servicio.
- Enviar perfil/servicio a revision.
- Ver estado de publicacion.

## Administracion interna

- Ver empresas pendientes.
- Ver servicios pendientes.
- Aprobar.
- Rechazar con motivo.
- Publicar.

## Infra/API

- Hosting en Azure Static Web Apps.
- API con Azure Functions.
- Imagenes en Azure Blob Storage.
- Datos en Azure Table Storage o Cosmos DB serverless.
- Notificacion por email para registros/revision.

## No incluye en MVP

- Pagos reales.
- Panel avanzado de metricas.
- Ranking automatico complejo.
- Chat en tiempo real.
- App movil.
- CRM completo.
- Automatizacion de facturacion.

## Criterios de aceptacion MVP

- Una empresa puede registrarse gratis.
- Una empresa puede iniciar sesion.
- Una empresa puede crear al menos 3 servicios.
- Cada servicio puede tener descripcion, categoria, precio desde y fotos.
- Un administrador puede aprobar o rechazar.
- Solo servicios publicados aparecen en la pagina publica.
- La busqueda publica muestra servicios especificos.
- El usuario puede ver otros servicios de la misma empresa.
- El usuario puede enviar una solicitud de cotizacion para un servicio.
- La pagina publica actual no pierde su calidad visual base.

