# TASK-190: Infra Azure - deploy fix login recurrente emails duplicados

## Equipo asignado

Infra Azure.

## Contexto

`TASK-188` completo Backend/API local/estructuralmente el fix para login recurrente cuando existen multiples usuarios con el mismo email.

`TASK-189` no aprobo porque Azure seguia en `main/b83b066 Deploy company approval auto invite`, sin el fix de `TASK-188`.

## Tarea

Desplegar a Azure los cambios de `TASK-188`.

## Alcance

- Revisar cambios de:
  - `api/shared/companyAuth.js`
  - `api/company-auth-login/index.js`
  - `docs/API_CONTRACTS_MVP.md`
- Ejecutar checks razonables.
- Commit/push/deploy acotado al fix de login recurrente y docs relacionadas.
- Confirmar Azure Static Web Apps en estado `Ready`.
- Hacer smoke seguro de `/api/company-auth/login` si es viable sin imprimir password, cookies ni hashes.

## No tocar

- UI publica/panel/admin.
- App settings.
- Email provider.
- Datos reales.
- Hard delete o limpieza de datos.
- Secretos, hashes, tokens o cookies.

## Verificacion

- Commit desplegado a `main`.
- Azure listo.
- El fix de `TASK-188` esta presente en el commit desplegado.
- Si se ejecuta smoke, documentar solo status/resultado redactado.

## Handoff esperado

Crear `tasks/TASK-190-HANDOFF.md` con commit, archivos incluidos, checks, estado Azure, smokes si aplica, riesgos y recomendacion para QA `TASK-191`.
