# TASK-080: Rotar credencial admin interna post-pruebas

## Equipo asignado

Infra Azure / Product Owner.

## Contexto

El flujo publico con servicios publicados y carrusel con `coverUrl` priorizado ya fue validado en Azure por `TASK-079`.

Durante las pruebas anteriores se compartio una credencial temporal de administracion interna (`ADMIN_PASSWORD`) en el chat/proceso. Ya no debe seguir usandose para nuevas pruebas.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-047-HANDOFF.md`
- `tasks/TASK-048-HANDOFF.md`
- `tasks/TASK-079-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`

## Objetivo

Rotar `ADMIN_PASSWORD` en Azure Static Web Apps / Functions y validar que los endpoints internos protegidos siguen funcionando con la credencial nueva.

## Alcance

1. Generar una nueva contrasena fuerte para `ADMIN_PASSWORD`.
2. Actualizar la variable de ambiente/app setting en Azure:

```text
ADMIN_PASSWORD=<nuevo valor>
```

3. Mantener `ADMIN_USERNAME` igual salvo que Product Owner indique lo contrario.
4. Esperar a que Azure aplique la configuracion.
5. Actualizar solo el archivo local ignorado por git si necesitas correr scripts desde tu entorno:

```text
local-secrets/qa-admin.ps1
```

6. Validar que la credencial nueva permite ejecutar el flujo minimo de invitacion interna.
7. Validar que la credencial anterior ya no funciona.

## Validacion sugerida

Usar, si aplica:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\test-company-invite-flow.ps1
```

O una prueba mas pequena contra el endpoint interno de invitaciones si prefieres evitar crear demasiados datos QA.

Validaciones minimas:

- Con credencial nueva:
  - Crear invitacion interna devuelve `201`, o el smoke equivalente esperado.
  - Aceptar invitacion devuelve `200`, si corres el flujo completo.
  - `GET /api/companies/me` con cookie devuelve `200`, si corres el flujo completo.
  - Logout devuelve `200`, si corres el flujo completo.
- Con credencial anterior:
  - Crear invitacion interna devuelve `401`.

## Seguridad

- No escribir la nueva contrasena en archivos versionados.
- No pegar la nueva contrasena completa en el handoff.
- Redactar cookies, tokens, URLs de invitacion y headers sensibles.
- Si actualizas `local-secrets/qa-admin.ps1`, confirmar que sigue ignorado por git.
- No hacer commit ni push.

## Fuera de alcance

- No cambiar codigo de backend/frontend.
- No cambiar `ADMIN_USERNAME` salvo instruccion explicita.
- No limpiar datos QA.
- No tocar planes de pago ni ranking.

## Entregable

Crear:

```text
tasks/TASK-080-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- Donde se roto la variable, sin exponer el valor.
- Hora aproximada de aplicacion en Azure.
- Comandos o pruebas ejecutadas, con secretos redactados.
- Confirmacion de que la credencial nueva funciona.
- Confirmacion de que la credencial anterior falla con `401`.
- Confirmacion de que no se modificaron archivos versionados con secretos.
- Riesgos o pendientes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-080. Product/Architect debe leer tasks/TASK-080-HANDOFF.md.
```
