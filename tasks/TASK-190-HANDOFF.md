# TASK-190: Infra Azure - deploy fix login recurrente emails duplicados

## Equipo

Infra Azure.

## Estado

Completada.

## Objetivo

Desplegar a Azure los cambios de `TASK-188` para corregir login recurrente cuando existen multiples usuarios con el mismo email.

## Commit desplegado

- Branch: `main`
- Commit: `88a43ff1a21f5a8393ae3e03543ee82dc1b2adfa`
- Mensaje: `Deploy recurrent login duplicate email fix`
- Push a `origin/main`: completado.
- `HEAD` y `origin/main`: `88a43ff1a21f5a8393ae3e03543ee82dc1b2adfa`
- Azure Static Web Apps: `puntoevento`
- Environment: `Ready`
- `LastUpdatedOn` observado: `2026-06-01T17:28:02.218456+00:00`
- URL: `https://zealous-field-08fdd720f.7.azurestaticapps.net`

## Archivos incluidos

- `api/shared/companyAuth.js`
- `api/company-auth-login/index.js`
- `docs/API_CONTRACTS_MVP.md`

El commit fue acotado al fix de login recurrente y documentacion relacionada. No se tocaron UI, app settings, email provider ni datos.

## Checks ejecutados

Sintaxis:

```text
node --check api/shared/companyAuth.js
node --check api/company-auth-login/index.js
```

Resultado: OK.

Diff check:

```text
git diff --check -- api/shared/companyAuth.js api/company-auth-login/index.js docs/API_CONTRACTS_MVP.md
```

Resultado: OK; solo warnings esperados de normalizacion LF/CRLF en Windows.

## Smoke Azure

Smoke seguro de `/api/company-auth/login` con credenciales falsas/no reales:

```text
POST /api/company-auth/login
status: 401
body: { "error": "Invalid email or password" }
Set-Cookie: no presente
```

Lectura:

- La ruta de login responde en Azure.
- El error sigue siendo generico.
- No se emitio cookie para credenciales invalidas.
- No se imprimieron passwords reales, hashes, tokens, cookies ni secrets.

No se ejecuto smoke positivo con password real para evitar imprimir o manejar credenciales reales fuera de QA. La validacion funcional completa queda para `TASK-191`.

## Verificacion Git

```text
git log --oneline -3
88a43ff Deploy recurrent login duplicate email fix
b83b066 Deploy company approval auto invite
dbb3f75 Deploy ACS email provider
```

Los archivos del alcance quedaron limpios en working tree:

```text
api/shared/companyAuth.js
api/company-auth-login/index.js
docs/API_CONTRACTS_MVP.md
```

## Comandos usados con secretos redactados

No se imprimieron secretos, hashes, tokens, cookies ni passwords reales.

Comandos principales:

```powershell
node --check api/shared/companyAuth.js
node --check api/company-auth-login/index.js
git diff --check -- api/shared/companyAuth.js api/company-auth-login/index.js docs/API_CONTRACTS_MVP.md
git add api/shared/companyAuth.js api/company-auth-login/index.js docs/API_CONTRACTS_MVP.md
git commit -m "Deploy recurrent login duplicate email fix"
git push origin main
az staticwebapp environment list --name puntoevento --resource-group resource_group_main
Invoke-WebRequest https://zealous-field-08fdd720f.7.azurestaticapps.net/api/company-auth/login
git rev-parse HEAD
git rev-parse origin/main
```

## Riesgos

- El smoke de Infra solo valida ruta y error seguro; no valida el caso positivo de email duplicado.
- QA debe usar el flujo real con email/password observable para confirmar que selecciona la empresa correcta.
- La busqueda por email sigue siendo scan de usuarios por propiedad; aceptable para MVP/pre-lanzamiento, no para escala alta.

## Recomendacion para QA TASK-191

Reintentar en Azure:

- Activar empresa desde enlace recibido.
- Confirmar que activacion crea sesion y carga panel.
- Cerrar sesion.
- Login recurrente con mismo email/password debe devolver `200` y cargar la empresa correcta.
- Password incorrecto debe devolver `401`.
- Confirmar que responses/logs no exponen `passwordHash`, tokens, cookies ni secretos.
