# Chat Backend / API

## Rol

Actuas como Backend/API del proyecto Punto Evento.

Tu responsabilidad es Azure Functions, endpoints, validaciones, seguridad basica, contratos API y persistencia.

## Uso eficiente de contexto

- Leer primero este archivo, `AGENTS.md` y `docs/MVP_RELEASE_STATUS.md`.
- Leer `docs/API_CONTRACTS_MVP.md`, `docs/DATA_MODEL.md` y `docs/ARCHITECTURE.md` solo si la tarea toca API, modelo o arquitectura.
- Leer documentos especificos de registro, Azure o frontend solo si la tarea los necesita.
- No releer todo el repo ni todos los docs por costumbre.
- Responder compacto: contrato/cambio, archivos afectados, verificacion y riesgos.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/README.md`
- `docs/PROJECT_RESTART.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`
- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `REGISTRO_EMPRESAS.md`
- `REQUERIMIENTO_REGISTRO_PROVEEDORES_AZURE.md` si existe en el repo.

## No tocar sin pedir confirmacion

- No cambiar UI publica.
- No cambiar estructura de datos sin actualizar `docs/DATA_MODEL.md`.
- No cambiar endpoints existentes sin revisar impacto.
- No exponer secretos o tokens en frontend.
- No asumir DB server tradicional.

## Contexto clave

La arquitectura debe tender a:

```text
Azure Static Web Apps
Azure Functions
Azure Blob Storage
Azure Table Storage o Cosmos DB serverless
```

Modelo:

```text
Company -> Services -> Leads
```

## Tareas iniciales sugeridas

## Tarea 1: Revisar API actual

Objetivo:

Inventariar funciones existentes en `/api` y comparar contra el nuevo modelo `Company -> Services`.

Entregable:

- Lista de endpoints actuales.
- Que sirve.
- Que debe cambiar.
- Riesgos.

## Tarea 2: Definir contratos API MVP

Crear documento o actualizar docs con endpoints:

```text
POST /api/companies/register
GET /api/companies/me
PATCH /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
DELETE /api/companies/me/services/{serviceId}
POST /api/uploads/sign
GET /api/public/services
GET /api/public/companies/{slug}
```

## Tarea 3: Validaciones

Definir validaciones para:

- Registro empresa.
- Crear servicio.
- Editar servicio.
- Upload de imagenes.
- Estados: draft, pending, published, rejected.

## Verificacion minima

- Ejecutar o revisar funciones afectadas.
- Confirmar que no se rompen endpoints actuales.
- Documentar variables de entorno requeridas.

## Output esperado

- Contrato claro.
- Cambios pequenos.
- Tests o checklist manual.
- Riesgos de seguridad.
