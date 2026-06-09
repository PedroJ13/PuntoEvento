# TASK-142: Infra Azure - desplegar ajustes Product Owner

## Equipo asignado

Infra Azure.

## Contexto

Backend API y Web Dev completaron los ajustes pedidos por Product Owner:

- `TASK-138`: aprobar servicio publica imagenes pendientes asociadas y agrega preview interno autenticado.
- `TASK-140`: registro persiste contactos ampliados y endpoints los exponen segun contrato.
- `TASK-139`: admin muestra imagenes dentro del servicio, elimina listas globales viejas y usa `admin.js?v=15` / `admin.css?v=9`.
- `TASK-141`: registro usa provincia como select, contactos ampliados y usa `app.js?v=23`.

Todos requieren deploy antes de QA Azure.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `tasks/TASK-138-HANDOFF.md`
- `tasks/TASK-139-HANDOFF.md`
- `tasks/TASK-140-HANDOFF.md`
- `tasks/TASK-141-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Desplegar a Azure Static Web Apps / Azure Functions el bloque de ajustes Product Owner y confirmar versiones/endpoints basicos.

## Alcance

1. Confirmar cambios runtime que deben entrar:
   - `api/shared/internalModeration.js`
   - `api/shared/internalPending.js`
   - `api/internal-uploads-preview/function.json`
   - `api/internal-uploads-preview/index.js`
   - `api/shared/validation.js`
   - `api/companies-register/index.js`
   - `api/companies-me/index.js`
   - `api/shared/publicCatalog.js`
   - `admin.html`
   - `admin.js`
   - `admin.css`
   - `index.html`
   - `app.js`
2. Hacer commit/push/deploy del bloque runtime.
3. Confirmar en Azure:
   - `/index.html` referencia `app.js?v=23` y `styles.css?v=17`;
   - `/admin.html` referencia `admin.js?v=15` y `admin.css?v=9`;
   - endpoint nuevo `GET /api/internal/uploads/{companyId}/{uploadId}/preview` existe o responde con codigo esperado con credencial valida/dato QA;
   - `POST /api/companies/register` acepta campos nuevos sin romper registro basico.
4. No cambiar credenciales.
5. No hacer hard delete ni limpieza de datos QA.

## Fuera de alcance

- Repetir toda la matriz QA.
- Cambiar UI/API adicional.
- Crear nuevos requisitos.

## Entregable

Crear:

```text
tasks/TASK-142-HANDOFF.md
```

Debe incluir:

- branch/commit desplegado;
- ambiente;
- versiones observadas en Azure;
- smoke minimo ejecutado;
- resultado;
- si QA puede validar ajustes Product Owner.

## Aviso al terminar

```text
Termine TASK-142. Product/Architect debe leer tasks/TASK-142-HANDOFF.md.
```
