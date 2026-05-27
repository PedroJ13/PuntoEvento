# TASK-017: Infra post-deploy Companies register

## Equipo encargado

Infra Azure.

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-017-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-017-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/README.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-016-HANDOFF.md`

Opcionales utiles:

- `CONFIGURACION_AZURE_REGISTRO_EMAIL.md`
- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`

## Objetivo

Despues de que Product/Architect haga commit/push del endpoint `companies/register`, confirmar en Azure que la infraestructura esta lista para el endpoint nuevo.

## Contexto

QA valido local/estructuralmente `POST /api/companies/register`, pero en Azure el endpoint devolvio `404` antes del deploy.

Backend implemento:

```text
api/companies-register
```

Ruta esperada:

```text
/api/companies/register
```

## Alcance

Infra debe revisar:

- GitHub Actions/deploy completado.
- Static Web Apps API actualizada.
- Tabla `Companies`.
- Variable `AZURE_TABLE_COMPANIES` si se requiere.
- Que el endpoint ya no devuelva `404` despues del deploy.

## Fuera de alcance

- No modificar codigo.
- No cambiar contrato API.
- No hacer pruebas destructivas masivas.
- No abrir registro a usuarios reales.

## Verificacion requerida

Despues del push/deploy:

- Confirmar workflow exitoso.
- Confirmar endpoint existe.
- Confirmar tabla `Companies` existe o puede ser creada por la funcion.
- Confirmar app setting `AZURE_TABLE_COMPANIES`:
  - si existe, valor esperado `Companies`;
  - si no existe, confirmar que default del codigo es `Companies`.

Smoke recomendado:

```text
GET /api/companies/register
```

Puede devolver `405`, `404` ya no deberia ser esperado si la ruta esta desplegada.

No ejecutar `POST` real si QA lo va a ejecutar, salvo que Product/Architect lo autorice.

## Handoff requerido

Crear:

```text
tasks/TASK-017-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Estado deploy.
- Estado tabla `Companies`.
- Estado variable `AZURE_TABLE_COMPANIES`.
- Resultado smoke endpoint.
- Riesgos.
- Recomendacion para Product/Architect.

## Al finalizar

Responder:

```text
Termine TASK-017. Product/Architect debe leer `tasks/TASK-017-HANDOFF.md`.
```

