# TASK-108 Handoff - Rotacion credencial admin expuesta en prueba PO

## Resultado general

Aprobado.

Se roto `ADMIN_PASSWORD` en Azure Static Web Apps despues de la exposicion reportada por Product Owner. La credencial nueva autentica contra el endpoint interno y una credencial invalida sigue siendo rechazada.

No se hizo commit ni push.

## Azure

Recurso:

```text
Static Web App: puntoevento
Resource group: resource_group_main
Base URL: https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Variables:

```text
ADMIN_USERNAME: existe y se mantuvo
ADMIN_PASSWORD: rotado
```

Valor nuevo: no documentado por seguridad.

Hora aproximada:

```text
Inicio rotacion UTC: 2026-05-29T19:44:38Z
Validacion UTC: 2026-05-29T19:45:00Z
```

## Verificacion

Endpoint usado:

```text
GET https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/companies/pending
```

Header usado:

```text
X-Punto-Admin-Credential: Basic <redacted>
```

Resultado con credencial valida:

```text
HTTP 200
Intentos hasta propagacion: 1
```

Resultado con credencial invalida:

```text
HTTP 401
```

Comando Azure ejecutado, saneado:

```powershell
az staticwebapp appsettings set `
  --name puntoevento `
  --resource-group resource_group_main `
  --setting-names ADMIN_PASSWORD=<redacted> `
  --output none
```

No se imprimieron password, header completo, token, cookie ni secretos.

## Secreto local

Archivo actualizado:

```text
local-secrets/qa-admin.ps1
```

Estado:

```text
Existe: si
Ignorado por git: si
Lineas antes: 2
Lineas despues: 2
Dot-source valido: si
```

Confirmacion de ignore:

```text
.gitignore:2:local-secrets/ local-secrets/qa-admin.ps1
```

Formato final:

```powershell
$env:ADMIN_USERNAME = "<redacted>"
$env:ADMIN_PASSWORD = "<redacted>"
```

## Archivos tocados

Versionados:

```text
tasks/TASK-108-HANDOFF.md
```

Locales ignorados:

```text
local-secrets/qa-admin.ps1
```

Otros cambios visibles en `git status` ya existian antes de esta tarea y no fueron modificados por esta rotacion.

## Riesgos pendientes

- La autenticacion admin sigue usando credencial compartida; sirve para MVP controlado, pero no debe ser el mecanismo definitivo para produccion.
- Si la nueva credencial se comparte por chat, captura o documento, debe rotarse otra vez.
- El guion Product Owner debe recordar que no se deben pegar credenciales ni capturar consola con secretos visibles.

## Recomendacion para re-prueba

Se puede repetir la prueba Product Owner o QA admin usando `local-secrets/qa-admin.ps1` como canal local seguro. Antes de invitar empresas reales, Product/Architect debe cerrar o aceptar explicitamente los hallazgos P1 de `docs/PRODUCT_OWNER_TEST_FINDINGS_2026-05-29.md`.
