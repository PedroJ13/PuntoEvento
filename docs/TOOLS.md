# Herramientas Locales

Este repo mantiene un smoke local minimo para regresion rapida de la superficie estatica. No reemplaza QA Azure ni flujos con credenciales reales.

## Instalacion local

```powershell
npm install
```

## Smoke local

```powershell
npm run test:smoke
```

El smoke levanta un servidor estatico local controlado por `tools/run-smoke.mjs` en `127.0.0.1:4174`, ejecuta Playwright y apaga el servidor al finalizar. Valida:

- home publica;
- panel empresa sin autenticacion;
- admin sin autenticacion;
- responsive desktop/mobile configurado en Playwright;
- accesibilidad basica con axe, bloqueando violaciones `critical` en `main`.

## Check local

```powershell
npm run check
```

Incluye:

- `npm run lint`
- `npm run format:check`

## Revision basica de secretos

Antes de commitear cambios sensibles, correr:

```powershell
gitleaks detect --source . --no-git
rg ".env|connectionString|sig=|password|token|SAS|local.settings.json"
```

Revisar especialmente:

- `.env`
- `local.settings.json`
- connection strings
- SAS URLs
- cookies
- tokens
- passwords

No pegar secretos en handoffs, logs, issues ni documentos.

## Servidor estatico opcional

Si se quiere inspeccionar manualmente la superficie estatica:

```powershell
node tools/local-static-server.mjs 4174
```

Luego abrir `http://127.0.0.1:4174`.

## Fuera de alcance

- No usa Azure.
- No usa SQL.
- No valida login real ni reset real.
- No usa cookies, tokens, correos ni credenciales reales.
