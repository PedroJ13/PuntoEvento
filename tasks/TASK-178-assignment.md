# TASK-178: Infra Azure - deploy backend ACS Email

## Equipo asignado

Infra Azure.

## Contexto

`TASK-175` configuro Azure Communication Services Email correctamente y el smoke directo `az communication email send` paso.

`TASK-176` cambio el provider backend a ACS Email local/estructuralmente.

`TASK-177` no aprobo porque Azure seguia sirviendo un backend que devuelve `502` en `POST /api/public/leads`; el handoff indica que `origin/main` seguia en commit `7437baf` y que los cambios de `api/shared/email.js` / `api/shared/config.js` estaban solo en working tree.

## Tarea

Desplegar a Azure los cambios backend de `TASK-176` para que Functions usen ACS Email.

## Alcance

- Revisar cambios runtime necesarios de `TASK-176`.
- Ejecutar checks de sintaxis.
- Commit/push acotado al provider ACS y docs estrictamente necesarios.
- Confirmar Azure Static Web Apps environment `Ready`.
- Smoke controlado de `/api/public/leads` o endpoint relacionado, sin exponer secretos.

## No tocar

- UI publica/panel/admin salvo que el deploy lo requiera por cache bust ya existente.
- Secretos, connection strings o app settings en texto.
- Refactors no relacionados.

## Verificacion

- Azure sirve backend con provider ACS.
- `EMAIL_PROVIDER=acs` esta presente.
- `POST /api/public/leads` deja de fallar por provider legacy si se usa servicio publicado y mailbox operativo.
- Si el smoke crea datos, documentar IDs y limpieza/estado.

## Handoff esperado

Crear `tasks/TASK-178-HANDOFF.md` con:

- Commit desplegado.
- Archivos incluidos.
- Checks ejecutados.
- Smokes Azure.
- Riesgos.
- Recomendacion para QA.
