# TASK-136: Infra Azure - desplegar fix admin UI v14

## Equipo asignado

Infra Azure.

## Superficie

```text
admin.html
admin.js
```

## Contexto

`TASK-135` corrigio localmente el P1 reportado por QA en `TASK-132`: el tab `Modelo nuevo` no cargaba pendientes reales porque `admin.js` iteraba `Object.values(state.internal)` e incluia `selectedCompanyId`, que es string.

La correccion:

- agrega `internalSections()`;
- normaliza respuestas internas con `internalItemsFromResponse()`;
- actualiza cache busting de `admin.js?v=13` a `admin.js?v=14`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `tasks/TASK-132-HANDOFF.md`
- `tasks/TASK-135-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`

## Objetivo

Desplegar a Azure Static Web Apps la correccion de admin UI y confirmar que Azure sirve `admin.js?v=14`.

## Alcance

1. Confirmar que los cambios de `admin.html` y `admin.js` de `TASK-135` estan listos para deploy.
2. Hacer commit/push/deploy del fix admin UI.
3. Confirmar en Azure:
   - `/admin.html` referencia `admin.js?v=14`;
   - `/admin.html` sigue referenciando `admin.css?v=8` salvo que haya cambiado;
   - login/admin no queda roto por carga de assets.
4. No tocar API ni reglas backend.
5. No hacer limpieza de datos QA.

## Fuera de alcance

- Repetir toda la prueba QA de admin.
- Cambiar diseno o flujo del expediente.
- Cambiar credenciales.

## Entregable

Crear:

```text
tasks/TASK-136-HANDOFF.md
```

Debe incluir:

- branch/commit desplegado;
- ambiente;
- versiones observadas en Azure;
- smoke minimo ejecutado;
- resultado;
- si QA puede reintentar admin UI post-fix.

## Aviso al terminar

```text
Termine TASK-136. Product/Architect debe leer tasks/TASK-136-HANDOFF.md.
```
