# Proyecto - Adopcion de tooling local

Este documento es para el chat **Proyecto** de PuntoEvento. Su objetivo es definir una primera tarea pequena de regresion local sin tocar funcionalidad.

## Contexto

La maquina ya tiene herramientas globales disponibles:

```text
git
gh
az
node
npm
func
swa
rg
playwright
gitleaks
lighthouse
eslint
prettier
vitest
azurite
```

Azure CLI puede requerir permisos elevados desde Codex para leer configuracion de usuario en:

```text
C:\Users\pj13e\.azure\azureProfile.json
```

Si falla desde Codex pero funciona en PowerShell normal, no reinstalar Azure CLI.

## Objetivo inicial

Tooling minimo de regresion local:

```text
Playwright + @axe-core/playwright + scripts npm de check/test
```

## Alcance de primera tarea

Instruir a Ejecucion Tecnica / QA a:

1. Revisar si existe `package.json` raiz.
2. Revisar `api/package.json`.
3. Agregar dependencias dev donde corresponda:

```powershell
npm install -D @playwright/test @axe-core/playwright eslint prettier
```

4. Crear 1 o 2 specs smoke.
5. Agregar `npm run check` si existe `package.json` raiz.
6. Documentar comandos en `docs/TOOLS.md` o README tecnico.

## Smoke recomendado

Cubrir primero:

- home publica;
- una ruta critica como panel/admin si no requiere secretos;
- endpoint publico no destructivo, por ejemplo servicios publicos;
- accesibilidad basica con axe;
- responsive desktop/mobile.

Si un flujo requiere login, tokens o datos reales, dejarlo documentado pero fuera del primer smoke.

## Checks de secretos

Antes de commits:

```powershell
gitleaks detect --source . --no-git
rg ".env|connectionString|sig=|password|token|SAS|local.settings.json"
```

Revisar especialmente:

```text
.env
local.settings.json
connection strings
SAS URLs
cookies
tokens
passwords
```

## Scripts deseados

Ejemplo adaptable:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "check": "npm run lint && npm run format:check"
  }
}
```

No imponer estructura si el repo no la tiene todavia.

## Fuera de alcance inicial

- No rediseno.
- No cambios funcionales.
- No reemplazar QA Azure.
- No cubrir todo el sistema en la primera tarea.
- No hacer Playwright obligatorio en deploy todavia.
- No reformat masivo.

## Criterio de exito

La tarea queda lista cuando:

- Existe smoke local reproducible.
- Hay un comando documentado para correrlo.
- Hay check basico de accesibilidad o preparacion clara para axe.
- Hay rutina documentada de secretos.
- `git status --short --branch` queda limpio al final.
