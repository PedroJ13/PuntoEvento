# TASK-101 Handoff - Alinear credencial admin para QA Azure

## Resultado general

Aprobado.

La credencial admin para QA Azure quedo alineada y valida para `admin.html`.

Resultado final:

- `ADMIN_USERNAME` existe en Azure y se mantuvo.
- `ADMIN_PASSWORD` fue rotado en Azure Static Web Apps.
- `local-secrets/qa-admin.ps1` quedo actualizado localmente, ignorado por git y con formato PowerShell valido.
- `GET /api/internal/companies/pending` responde `200` con la credencial valida.
- El mismo endpoint responde `401` con una credencial invalida.

No se hizo commit ni push.

## Azure

Recurso:

```text
Static Web App: puntoevento
Resource group: resource_group_main
Base URL: https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Variables revisadas:

```text
ADMIN_USERNAME: existe
ADMIN_PASSWORD: existe antes de rotacion
```

Accion aplicada:

```text
ADMIN_PASSWORD rotado
ADMIN_USERNAME conservado desde Azure
```

Valor de usuario/password: no documentado por seguridad.

Hora efectiva de la rotacion final:

```text
Inicio rotacion final UTC: 2026-05-29T17:28:40Z
Validacion final UTC: 2026-05-29T17:29:01Z
```

## Nota de seguridad

Durante la correccion del archivo local, PowerShell intento cargar una linea invalida y el error incluyo un fragmento del password que habia quedado escrito en esa primera rotacion. Para cerrar ese riesgo, se hizo una segunda rotacion inmediata en Azure.

El valor que pudo quedar comprometido por ese error ya no es la credencial vigente. La credencial vigente es la de la rotacion final indicada arriba y no fue incluida en este handoff.

## Archivo local

Archivo local actualizado:

```text
local-secrets/qa-admin.ps1
```

Estado:

```text
Ignorado por git: si
Lineas: 2
Formato dot-source: valido
```

Formato final esperado:

```powershell
$env:ADMIN_USERNAME = "<redacted>"
$env:ADMIN_PASSWORD = "<redacted>"
```

Confirmacion de ignore:

```text
.gitignore:2:local-secrets/ local-secrets/qa-admin.ps1
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

No se imprimieron los valores finales de usuario, password, headers completos ni respuesta sensible.

## Archivos tocados

Versionados:

```text
tasks/TASK-101-HANDOFF.md
```

Locales ignorados:

```text
local-secrets/qa-admin.ps1
```

Otros archivos ya aparecian modificados/no versionados antes de esta tarea y no fueron cambiados por esta rotacion.

## Riesgos y pendientes

- La autenticacion admin sigue siendo una credencial compartida por variables de ambiente; sirve para QA/MVP controlado, pero no es ideal para operacion real.
- Conviene limitar la distribucion de `local-secrets/qa-admin.ps1` y rotar de nuevo si se comparte por un canal no seguro.
- No se ejecuto la UI completa de `admin.html`; esta tarea solo desbloquea credenciales.

## Recomendacion para repetir TASK-100

Repetir `TASK-100` ahora. La prueba debe cargar `local-secrets/qa-admin.ps1` con dot-source normal y validar desde navegador:

- login valido en `admin.html`;
- pestana `Modelo nuevo`;
- listados internos de Companies, Services y Uploads;
- respuesta `401` para login invalido;
- responsive y ausencia de campos internos visibles.
