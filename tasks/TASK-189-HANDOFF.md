# TASK-189: QA Azure - revalidar activacion y login recurrente

Equipo: QA

Tarea validada: revalidacion post-fix del flujo `email recibido -> activar password -> logout -> login recurrente -> panel correcto`.

Ambiente:

- Azure real esperado: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Fecha QA: `2026-06-01`
- Repo local confirmado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Branch local: `main`
- `origin/main` observado: `b83b066 Deploy company approval auto invite`

Resultado: no aprobado; bloqueado por deploy pendiente de `TASK-188`.

Checks ejecutados:

| Caso | Resultado | Evidencia |
| --- | --- | --- |
| Confirmar contexto QA | PASS | Leidos `chat-start/QA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `TASK-187-HANDOFF.md`, `TASK-188-HANDOFF.md` y `TASK-189-assignment.md`. |
| Confirmar dependencia `TASK-188` | FAIL deploy pendiente | `TASK-188` esta completada local/estructuralmente, pero no hay deploy a Azure documentado. |
| Confirmar estado Git del fix | FAIL deploy pendiente | `api/shared/companyAuth.js`, `api/company-auth-login/index.js` y `docs/API_CONTRACTS_MVP.md` estan modificados localmente; `tasks/TASK-188-HANDOFF.md` esta untracked. |
| Confirmar commit Azure actual | FAIL deploy pendiente | `git log` muestra `HEAD -> main, origin/main` en `b83b066 Deploy company approval auto invite`, anterior al fix de `TASK-188`. |
| Revalidar activacion desde email | NO EJECUTADO | No se creo nueva empresa QA porque el fix requerido no esta desplegado. Crear mas invites/usuarios duplicados antes del deploy agregaria ruido sin poder validar el criterio principal. |
| Logout + login recurrente | NO EJECUTADO | Depende de que Azure sirva la nueva regla de login de `TASK-188`. |
| Caso email duplicado | NO EJECUTADO | La correccion existe en working tree local, pero Azure aun no la sirve. |
| Cleanup QA | NO APLICA | No se crearon datos QA nuevos en esta tarea. |

Hallazgos:

- `TASK-189` no puede validar el flujo post-fix porque el fix de login recurrente con emails duplicados no esta desplegado en Azure.
- La regla esperada de `TASK-188` existe localmente: login lista usuarios por email, verifica password contra candidatos activos, filtra empresas permitidas y elige el candidato mas reciente.
- El ultimo deploy de Azure sigue siendo `TASK-184` (`b83b066`), que resolvio auto-invite pero no contiene el fix de login recurrente.

P0/P1:

- P1: Login recurrente post-activacion sigue sin poder aprobarse en Azure porque el fix de `TASK-188` esta pendiente de deploy.
- P1: Invitar primeras empresas reales debe seguir en no-go hasta desplegar `TASK-188` y revalidar `TASK-189`.

P2/P3:

- P2: El ambiente QA ya acumula usuarios duplicados por mailbox observable; esto es justamente el caso que debe probarse post-deploy, pero conviene no seguir creando duplicados hasta que el fix este en Azure.

Evidencia:

```text
git rev-parse --show-toplevel
C:/Users/pj13e/Digital Products/Punto Evento

git log --oneline -10 --decorate
b83b066 (HEAD -> main, origin/main) Deploy company approval auto invite
dbb3f75 Deploy ACS email provider
7437baf Deploy prelaunch runtime changes

git status --short -- api/shared/companyAuth.js api/company-auth-login/index.js docs/API_CONTRACTS_MVP.md tasks/TASK-188-HANDOFF.md
 M api/company-auth-login/index.js
 M api/shared/companyAuth.js
 M docs/API_CONTRACTS_MVP.md
?? tasks/TASK-188-HANDOFF.md

TASK-188 estado:
Completada local/estructuralmente.
No se probo contra Azure real en esa ronda.
```

Riesgos o pendientes:

- Falta una tarea Infra Azure/deploy para publicar `TASK-188`.
- Falta reintentar el flujo completo despues del deploy:
  - empresa QA controlada;
  - approve auto-invite;
  - email recibido;
  - activar password;
  - logout;
  - login recurrente con mismo email/password;
  - panel correcto;
  - password incorrecto -> `401`;
  - soft cleanup/reject.

Siguiente recomendado:

1. Infra Azure: desplegar los cambios de `TASK-188` a Azure.
2. QA: reintentar `TASK-189` post-deploy con una empresa QA controlada y mailbox observable.
3. Mantener recomendacion no-go para invitar primeras empresas reales hasta que login recurrente quede aprobado en Azure.
