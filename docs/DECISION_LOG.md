# Decision Log

## 2026-05-27: Reinicio controlado

Decision:

Reiniciar la forma de trabajo del proyecto con docs, AGENTS.md, backlog y tareas pequenas, sin borrar el codigo actual.

Motivo:

La pagina publica actual es una buena base. El cambio grande esta en admin, registro de empresas y modelo Empresa -> Servicios.

## 2026-05-27: Modelo Empresa -> Servicios

Decision:

Una empresa puede tener N servicios.

Ejemplo:

```text
Aurisbel -> Queques, Wedding Planner, Mesa dulce
```

Motivo:

Permite que una empresa aparezca por servicios especificos y que el perfil completo muestre todas sus opciones.

## 2026-05-27: Busqueda por servicio

Decision:

Los resultados de busqueda/listados deben mostrar servicios, con contexto de empresa.

Motivo:

Si el usuario busca "mesa dulce", el resultado debe coincidir con "mesa dulce", no mostrar solo una pagina generica de empresa.

## 2026-05-27: No DB server tradicional por ahora

Decision:

No usar DB server administrado por nosotros en MVP.

Motivo:

Azure serverless/managed reduce costo y complejidad.

Alternativas:

- Table Storage para MVP barato.
- Cosmos DB serverless si se necesita mas flexibilidad.
- Blob Storage para imagenes.

## 2026-05-27: Publicacion con revision manual en MVP

Decision:

El registro de empresas es gratis, pero empresas y servicios deben pasar por revision manual antes de aparecer publicamente.

Motivo:

Evita spam, contenido de baja calidad, imagenes no autorizadas y perfiles incompletos durante la etapa inicial del marketplace.

## 2026-05-27: Pagos fuera del MVP inicial

Decision:

El MVP no incluye pagos reales.

Motivo:

Primero se valida registro, contenido, busqueda por servicio y recepcion de leads. Los pagos entran despues como planes de posicionamiento destacado.

## 2026-05-27: Persistencia MVP en Azure Table Storage

Decision:

Mantener Azure Table Storage como persistencia MVP.

Motivo:

La infraestructura ya tiene Storage Account, tablas y Azure Functions funcionando. Table Storage cubre el MVP con menor costo y menor complejidad que Cosmos DB serverless.

Condicion futura:

Evaluar Cosmos DB serverless si la busqueda por categoria, provincia, plan, estado y servicios requiere consultas mas flexibles o ranking mas avanzado.

## 2026-05-27: Imagenes publicadas en container publico para MVP cerrado

Decision:

Para MVP cerrado, usar `uploads-pending` privado y permitir lectura publica solo para imagenes aprobadas en el container `public`.

Motivo:

Es la opcion mas simple y barata para que las imagenes aprobadas rendericen en la pagina publica sin proxy ni SAS por imagen.

Riesgo:

Debe mantenerse `uploads-pending` privado y solo publicar imagenes revisadas/aprobadas.

## 2026-05-27: Separar Admin interno y Panel empresa

Decision:

Separar conceptualmente el admin interno de Punto Evento del panel de empresa.

Definicion:

- Admin interno: revision, aprobacion, rechazo, moderacion y control de calidad.
- Panel empresa: gestion de perfil, servicios, fotos y planes.

Implementacion temporal:

La implementacion temporal en `admin.html` sirvio para validar el modelo visual, pero no debe seguir creciendo como flujo de empresa.

Arquitectura objetivo:

Usar rutas separadas:

- `/admin/*` para administradores internos.
- `/panel/*` para empresas proveedoras.

Actualizacion:

La opcion `Agregar servicio` pertenece al panel empresa, no al admin interno. El admin interno debe revisar/aprobar/rechazar datos enviados por empresas.

## 2026-05-27: Modo demo local para panel empresa

Decision:

Agregar un modo demo local para que Product/QA puedan revisar `Empresa demo` y `Servicios` sin depender de API Azure ni credenciales reales.

Condicion:

Este modo demo no debe desbloquear acciones de revision interna ni simular permisos productivos.

Motivo:

TASK-007 aprobo la demo de servicios con observaciones, pero QA no pudo completar login real en local porque el flujo actual depende de API/credenciales Azure.

## 2026-05-27: Categorias y tipos de evento como catalogos

Decision:

Categorias y tipos de evento deben ser listas controladas compartidas por pagina publica, panel empresa, API y QA.

Motivo:

Evita texto libre inconsistente y permite busqueda, filtros, validacion, ranking y planes destacados por categoria.

Implementacion MVP:

Usar JSON estatico versionado para catalogos al inicio. Evaluar tabla `Catalogs` en Azure cuando se necesite editar categorias desde un panel admin.

## 2026-05-27: Fotos pertenecen a empresa y servicio

Decision:

Habra fotos a nivel empresa y fotos a nivel servicio.

Definicion:

- Empresa: logo, portada general.
- Servicio: portada del servicio y galeria del servicio.

Motivo:

Un proveedor puede ofrecer servicios distintos que necesitan imagenes especificas. Ejemplo: queques, wedding planner y mesa dulce no deberian compartir necesariamente la misma galeria.

## 2026-05-27: Catalogos JSON como fuente MVP inicial

Decision:

Usar `data/categories.json` y `data/event-types.json` como fuente versionada inicial de catalogos para la demo y el MVP temprano.

Motivo:

Son simples, baratos, faciles de revisar en Git y suficientes mientras las categorias no sean editables desde UI.

Condicion futura:

Mover a una tabla `Catalogs` cuando se requiera que administradores gestionen categorias/tipos de evento desde el panel.

## 2026-05-27: Registro nuevo crea solo Company

Decision:

El endpoint nuevo `POST /api/companies/register` crea solo una entidad `Company` en estado `pending` y plan `free`.

Motivo:

Separar registro de empresa de creacion de servicios mantiene el modelo claro y evita mezclar datos de empresa con ofertas especificas.

Pendiente:

Definir autenticacion de empresa para endpoints `companies/me` y CRUD de servicios.

## 2026-05-27: Registro de empresa verificado en Azure

Decision:

Marcar `POST /api/companies/register` como funcional en Azure.

Motivo:

QA confirmo que el endpoint responde `400` para validaciones y `201` para un registro valido. Infra confirmo que la tabla `Companies` fue creada y que la entidad QA quedo persistida sin secretos.

Notas:

- El `GET` a la misma ruta puede devolver `404` porque la Function esta configurada solo para `POST`.
- `AZURE_TABLE_COMPANIES=Companies` no es obligatorio porque el codigo tiene default, pero conviene configurarlo para claridad operativa.
- Queda pendiente decidir autenticacion de empresa antes de exponer endpoints privados como `/api/companies/me`.

## 2026-05-27: Autenticacion MVP de empresas por invitacion

Decision:

Para el MVP cerrado, usar invitacion/token con sesion propia server-side para empresas.

Flujo:

1. Empresa se registra con `POST /api/companies/register`.
2. Empresa queda `pending`.
3. Punto Evento revisa o decide invitar.
4. Backend genera una invitacion asociada a `companyId`.
5. Empresa abre el link de invitacion.
6. Backend valida token hasheado y crea sesion.
7. Endpoints privados derivan `companyId` desde cookie de sesion, no desde el cliente.

Motivo:

Desbloquea rapido el panel empresa sin implementar passwords ni obligar a proveedores a usar una cuenta externa. Es adecuado para primeras empresas controladas.

Alternativa futura:

Azure Static Web Apps Auth, usando `x-ms-client-principal` y tabla `Users` para mapear identidad externa a `companyId`.

Regla de seguridad:

El frontend nunca decide `companyId` para operaciones privadas. El backend siempre lo obtiene desde la sesion.
