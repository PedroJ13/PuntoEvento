# TASK-080 Handoff - Rotacion credencial admin interna post-pruebas

## Resultado general

Aprobado.

Se roto `ADMIN_PASSWORD` en Azure Static Web Apps para `puntoevento` y se valido que:

- La credencial nueva permite crear una invitacion interna con `201`.
- La credencial anterior ya no permite crear invitaciones y responde `401`.
- `ADMIN_USERNAME` se mantuvo sin cambios.

No se hizo commit ni push.

## Variable rotada

Recurso Azure:

```text
Static Web App: puntoevento
Resource group: resource_group_main
Setting: ADMIN_PASSWORD
```

Valor nuevo: no documentado por seguridad.

Hora aproximada:

```text
Inicio rotacion UTC: 2026-05-28T22:00:15Z
Validacion UTC: 2026-05-28T22:00:47Z
```

## Archivos tocados

Versionados:

```text
tasks/TASK-080-HANDOFF.md
```

Ignorados/locales:

```text
local-secrets/qa-admin.ps1
```

`local-secrets/qa-admin.ps1` esta ignorado por git:

```text
.gitignore:2:local-secrets/ local-secrets/qa-admin.ps1
```

## Verificacion

Primero se intento generar la clave con una API criptografica no disponible en esta version de PowerShell. Ese intento fallo antes de modificar Azure.

Luego se ejecuto una rotacion con Azure CLI y smoke test minimo contra la API interna. Comandos/acciones ejecutadas, con secretos redacted:

```powershell
az staticwebapp appsettings set `
  --name puntoevento `
  --resource-group resource_group_main `
  --setting-names ADMIN_PASSWORD=<redacted> `
  --output none
```

Smoke test credencial nueva:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/company-invites
Header: X-Punto-Admin-Credential: <redacted>
Body: companyId=<qa company>, email=<qa email>
Resultado: 201
Intentos hasta aplicar config: 1
inviteUrl: <redacted>
```

Smoke test credencial anterior:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/company-invites
Header: X-Punto-Admin-Credential: <redacted old credential>
Body: companyId=<qa company>, email=<qa email>
Resultado: 401
```

Revision de git despues de actualizar el secreto local:

```text
local-secrets/qa-admin.ps1 no aparece en git status porque esta ignorado.
```

No se imprimieron passwords, tokens, cookies, headers sensibles ni invite URLs.

## Riesgos

- Se creo una invitacion QA nueva como parte del smoke test minimo. La URL/token de invitacion no fue registrada.
- La credencial admin sigue siendo una credencial compartida por environment variables. Para produccion real conviene migrar a identidad/roles o a un esquema administrativo mas auditable.
- Si alguien tiene una sesion o copia vieja de `local-secrets/qa-admin.ps1`, debe refrescarla desde el archivo local actualizado o pedir la nueva credencial por canal seguro.

## Pendientes

- Ejecutar QA post-rotacion si Product/QA quiere validar el flujo completo con `tools/test-company-invite-flow.ps1`.
- Registrar en el backlog que la rotacion post-pruebas quedo completada.
- Definir politica de rotacion periodica para credenciales internas mientras exista este mecanismo.

## Recomendacion para Product/Architect

La rotacion queda lista para continuar con demo controlada. Recomiendo no compartir la nueva clave en chats ni documentos versionados y tratar `local-secrets/qa-admin.ps1` como secreto local temporal hasta reemplazar este acceso por un mecanismo administrativo con usuarios, roles y auditoria.
