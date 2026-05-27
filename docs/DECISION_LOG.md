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
