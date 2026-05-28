# TASK-055: Product/Architect commit y push de DELETE company services

## Equipo asignado

Product/Architect.

## Contexto

`TASK-054` quedo bloqueada porque QA/Infra Azure detecto que el endpoint:

```text
DELETE /api/companies/me/services/{serviceId}
```

todavia no esta commiteado ni pusheado.

Evidencia reportada:

```text
HEAD: 8885e6e Add company services update endpoint
git ls-files api/company-services-delete -> sin salida
git status api/company-services-delete -> ?? api/company-services-delete/
```

Esto significa que Azure no puede tener el endpoint DELETE desplegado desde este repo.

## Archivos que deben entrar al commit

Incluir el bloque relacionado con DELETE y trazabilidad:

- `api/company-services-delete/function.json`
- `api/company-services-delete/index.js`
- `docs/API_CONTRACTS_MVP.md`
- `docs/BACKLOG.md`
- `tasks/PRODUCT_ARCHITECT_PROCESSED_HANDOFFS.md`
- `tasks/TASK-051-HANDOFF.md`
- `tasks/TASK-052-assignment.md`
- `tasks/TASK-052-HANDOFF.md`
- `tasks/TASK-053-assignment.md`
- `tasks/TASK-053-HANDOFF.md`
- `tasks/TASK-054-assignment.md`
- `tasks/TASK-054-HANDOFF.md`

## Archivos que NO deben entrar salvo decision aparte

No incluir cambios paralelos de automatizacion/coordinacion:

- `docs/README.md`
- `tasks/README.md`
- `docs/CODEX_COORDINATION_AUTOMATION.md`
- `tools/codex-coordination.ps1`

## Objetivo

Crear commit y push para activar deploy de Azure Static Web Apps.

Commit sugerido:

```text
Add company services delete endpoint
```

## Validacion antes de commit

Revisar:

```powershell
git diff --cached --name-status
```

Debe contener solo archivos relacionados con DELETE/handoffs/tareas de este bloque.

## Siguiente paso despues del push

Cuando GitHub/Azure termine deploy, pedir a QA/Infra Azure repetir el smoke:

```text
Lee este archivo de asignacion: tasks/TASK-054-assignment.md.
Sigue las instrucciones y al terminar actualiza `tasks/TASK-054-HANDOFF.md`.
```

## Nota para coordinacion

Al terminar commit/push, avisar en el chat de Product/Architect:

```text
Termine TASK-055. Product/Architect puede pedir repetir TASK-054 a QA/Infra Azure.
```
