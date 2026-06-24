# Project Tooling Onboarding - Punto Evento

Usar este documento cuando un chat de Punto Evento no vea herramientas instaladas o necesite verificar GitHub, Azure, Azure Functions, Node o ripgrep.

Regla principal: no reinstalar herramientas antes de verificar `PATH`, autenticacion y permisos de Codex.

## PATH de herramientas

Si Codex no ve `git`, `gh`, `az`, `aws`, `node`, `npm`, `func`, `rg` o `pwsh`, cargar estas rutas en la sesion actual:

```powershell
$env:Path = "C:\Work\Tools\GitHubCLI\bin;C:\Program Files\Git\cmd;C:\Work\Tools\shims;C:\Work\Tools\NodeJS\node-v22.23.0-win-x64;C:\Work\Tools\npm-global;C:\Work\Tools\AzureCLI\Microsoft SDKs\Azure\CLI2\wbin;C:\Work\Tools\AWSCLIV2\Amazon\AWSCLIV2;C:\Work\Tools\ripgrep\bin;C:\Work\Tools\PowerShell\7.6.3;$env:Path"
```

Verificacion rapida:

```powershell
git --version
gh --version
az --version
aws --version
node --version
npm --version
func --version
rg --version
pwsh --version
```

Versiones esperadas aproximadas:

```text
git 2.54.0.windows.1
gh 2.95.0
az 2.87.0
aws-cli 2.35.8
node v22.23.0
npm 10.9.8
func 4.12.0
rg 15.1.0
pwsh 7.6.3
```

## Checklist al abrir Punto Evento

Desde la raiz del repo:

```powershell
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git status --short --branch
```

Si aparece `fatal: detected dubious ownership in repository`, agregar solo este repo como seguro:

```powershell
git config --global --add safe.directory "C:/Work/Productos Digitales/PuntoEvento"
```

No usar `safe.directory "*"` como solucion rapida.

## Git y ramas

Modo simple:

- Trabajar en `main` con commits pequenos cuando el cambio sea acotado.
- Crear rama `codex/<tema-corto>` cuando el cambio sea riesgoso, toque auth/API/infra/datos, tarde varios dias o requiera PR.
- Revisar `git status` antes y despues de cada tarea.
- No usar `git reset --hard` salvo pedido explicito del usuario.

## GitHub CLI

`gh` puede estar instalado y autenticado, pero Codex puede no tener permiso para leer la configuracion del usuario.

Verificar:

```powershell
gh auth status
gh repo list PedroJ13 --limit 5
```

Si falla con `Access is denied` leyendo `C:\Users\pj13e\AppData\Roaming\GitHub CLI\config.yml`, pedir permiso elevado para ese comando. No reinstalar `gh`.

## Azure

Azure CLI debe apuntar a la suscripcion usada por el proyecto.

Verificar:

```powershell
az account show -o table
az group list -o table
```

Recursos conocidos de Punto Evento:

- Azure Static Web Apps: `puntoevento`
- Resource group: `resource_group_main`
- Dominio publico: `https://puntoeventocr.com`
- Backend/API: Azure Functions bajo `/api`
- Persistencia MVP: Azure Table Storage
- Imagenes: Azure Blob Storage
- Email MVP: Azure Communication Services Email

No imprimir app settings, connection strings, SAS URLs, cookies, tokens ni passwords.

## Azure Functions

Para la API de Punto Evento, trabajar dentro de `api/` cuando aplique:

```powershell
cd api
npm install
func start
```

No correr `npm install` en la raiz salvo que exista `package.json` ahi y sea intencional.

## Seguridad

No pegar ni guardar en Markdown:

```text
Passwords
GitHub tokens
Azure connection strings
SAS URLs
Cookies
local.settings.json con secretos
.env con secretos
KeePass database secrets
```

Si un secreto se muestra en pantalla, captura, chat o commit, reportarlo y rotarlo.

