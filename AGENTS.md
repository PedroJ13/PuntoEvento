# AGENTS.md

## Proyecto

Punto Evento es una plataforma para conectar personas que organizan eventos con empresas proveedoras.

El proyecto tiene dos superficies:

- Pagina publica para busqueda, comparacion y cotizacion.
- Zona administrativa para empresas proveedoras.

La pagina publica actual se considera una buena base y no debe reescribirse sin una razon clara.

## Objetivo de trabajo en Codex

Trabajar como un equipo de software coordinado:

- Documentacion compartida.
- Tareas pequenas.
- Cambios pequenos.
- PRs pequenos.
- Agentes/chats especializados por responsabilidad.

No tratar cada chat como un equipo aislado. El repositorio y los documentos son la fuente de verdad.

## Estructura actual

```text
/
  index.html              Pagina publica
  app.js                  Logica pagina publica
  styles.css              Estilos pagina publica
  admin.html              Admin demo
  admin.js                Logica admin demo
  admin.css               Estilos admin demo
  /api                    Azure Functions
  /assets                 Imagenes/assets
  /data                   Datos estaticos demo
  /docs                   Documentacion nueva del reinicio
  /Base                   Referencias de forma de trabajo
```

## Reglas globales

- No borrar ni mover codigo existente sin documentar impacto.
- No romper la pagina publica actual.
- Preferir cambios pequenos y verificables.
- Mantener docs actualizados cuando cambie arquitectura, modelo de datos o flujo.
- Separar decisiones de producto, frontend, backend, infra y QA.
- Para datos de negocio, pensar en modelo `Empresa -> Servicios`.
- La busqueda publica debe tender a resultados por servicio, con acceso al perfil completo de empresa.
- El registro de empresas es gratis inicialmente.
- Los pagos futuros son para posicionamiento destacado, top de categoria o portada.

## Stack actual

- Frontend publico: HTML, CSS, JavaScript estatico.
- Admin demo: HTML, CSS, JavaScript estatico.
- Backend/API: Azure Functions en `/api`.
- Hosting: Azure Static Web Apps.
- Datos demo: JSON en `/data`.
- Imagenes: assets locales y/o URLs externas.

## Modelo de dominio recomendado

```text
Company
  -> Service[]
  -> User[]
  -> Plan
```

Ejemplo:

```text
Aurisbel
  - Queques
  - Wedding Planner
  - Mesa dulce
```

## Flujo recomendado de busqueda

Listados y busqueda:

```text
Mostrar servicios que coinciden con la busqueda.
```

Detalle:

```text
Mostrar perfil de empresa con el servicio seleccionado destacado y los otros servicios visibles.
```

## Documentos principales

Antes de trabajar, leer segun rol:

- `docs/README.md`
- `docs/PROJECT_RESTART.md`
- `docs/BACKLOG.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/WORKFLOW_CODEX.md`
- `docs/DECISION_LOG.md`

Documentos existentes importantes:

- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`
- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `EQUIPO_QA_NUEVO_ENFOQUE.md`
- `COORDINACION_EQUIPOS_CHATS.md`
- `REGISTRO_EMPRESAS.md`
- `NEXT_STEPS.md`

## Convenciones de trabajo

- Una tarea = un cambio claro.
- Evitar refactors grandes mezclados con features.
- Si se cambia contrato API, actualizar docs.
- Si se cambia modelo de datos, actualizar docs.
- Si se cambia UI publica, validar desktop y mobile.
- Si se cambia admin, validar permisos, estados y errores.

