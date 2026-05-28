# TASK-039: Backend remover endpoint temporal auth diagnostics

## Resultado general

Completada.

Se removio la Azure Function temporal:

```text
POST /api/internal/auth-diagnostics
```

El endpoint habia sido usado solo para depurar Basic Auth y ya no forma parte del flujo MVP validado.

## Archivos eliminados

- `api/internal-auth-diagnostics/function.json`
- `api/internal-auth-diagnostics/index.js`

## Archivos modificados

- `docs/BACKLOG.md`
- `tasks/TASK-039-HANDOFF.md`

## Verificacion realizada

Se confirmo que:

```text
api/internal-auth-diagnostics/function.json ya no existe.
api/internal-auth-diagnostics/index.js ya no existe.
```

Busqueda de referencias:

```text
rg "internal/auth-diagnostics|internal-auth-diagnostics|auth-diagnostics" .
```

Resultado:

```text
No quedan referencias en codigo productivo.
Solo quedan menciones documentales en handoffs/asignaciones historicas y backlog.
```

Tambien se actualizo `docs/BACKLOG.md` para marcar como completada la remocion del endpoint temporal y recomendar QA de ausencia despues del deploy.

## Riesgos

- Hasta que se despliegue el cambio, el endpoint puede seguir disponible en Azure.
- Si algun script externo no versionado dependia del diagnostico, dejara de funcionar. No se encontro dependencia productiva en el repositorio.
- La carpeta `api/internal-auth-diagnostics` puede quedar vacia en el filesystem local, pero sin `function.json` Azure Functions no debe exponer esa Function.

## Siguiente tarea recomendada

QA Azure:

```text
Despues del deploy, confirmar que POST /api/internal/auth-diagnostics devuelve 404 o no esta listado como Function disponible.
```

Backend API:

```text
Continuar con el siguiente endpoint privado del panel empresa, probablemente PATCH /api/companies/me o GET /api/companies/me/services segun prioridad de Product/Architect.
```
