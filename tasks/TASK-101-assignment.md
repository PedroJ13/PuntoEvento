# TASK-101: Alinear credencial admin para QA Azure

## Equipo asignado

Infra Azure / Product.

## Contexto

`TASK-100` confirmo que el deploy de `admin.html` conectado al modelo nuevo esta visible en Azure:

- `admin.html` carga.
- `admin.css?v=7` esta presente.
- `admin.js?v=10` esta presente.
- `admin.js?v=10` contiene `/internal/companies/pending`.

Pero QA no pudo completar la validacion autenticada porque la credencial disponible en `local-secrets/qa-admin.ps1` no autentica contra Azure. Los endpoints internos responden `401` con esa credencial y sin credencial.

Esto bloquea la prueba Product Owner completa desde navegador.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/INFRA_AZURE.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-100-HANDOFF.md`
- `api/shared/adminAuth.js`
- `local-secrets/qa-admin.ps1` si existe localmente.

## Objetivo

Dejar una credencial admin valida para QA Azure de `admin.html`, sin exponer secretos en handoffs, commits ni chats.

## Alcance

1. Revisar en Azure Static Web Apps las variables de ambiente:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
2. Confirmar si coinciden con el valor local esperado por QA.
3. Si hay duda, rotar `ADMIN_PASSWORD` en Azure a un valor temporal controlado para QA.
4. Actualizar localmente `local-secrets/qa-admin.ps1` con formato PowerShell valido.
5. No commitear `local-secrets/qa-admin.ps1`.
6. Verificar que la credencial autentica contra Azure usando header admin soportado.
7. Registrar resultado saneado en el handoff, sin incluir usuario/password reales.

## Formato recomendado para `local-secrets/qa-admin.ps1`

El archivo debe poder cargarse con dot-source normal:

```powershell
$env:ADMIN_USERNAME = "<usuario-admin>"
$env:ADMIN_PASSWORD = "<password-admin>"
```

No dejar ambas asignaciones pegadas en una sola linea sin separador.

## Verificacion sugerida

No imprimir secretos.

```powershell
. .\local-secrets\qa-admin.ps1
$authPlain = "$($env:ADMIN_USERNAME):$($env:ADMIN_PASSWORD)"
$authHeader = "Basic " + [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($authPlain))
Invoke-WebRequest -UseBasicParsing -Method Get -Uri "https://zealous-field-08fdd720f.7.azurestaticapps.net/api/internal/companies/pending" -Headers @{ "X-Punto-Admin-Credential" = $authHeader }
```

Resultado esperado con credencial valida:

```text
200
```

Tambien validar que una credencial invalida siga devolviendo:

```text
401
```

## Fuera de alcance

- Cambiar codigo de auth salvo que se demuestre bug real despues de validar credenciales.
- Cambiar `admin.html`, `admin.js` o `admin.css`.
- Ejecutar acciones approve/reject reales de QA.
- Publicar secretos en handoff o chat.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-101-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado o bloqueado.
- Si la credencial fue confirmada o rotada, sin mostrar valores.
- Si `local-secrets/qa-admin.ps1` quedo con formato valido.
- Endpoint usado para verificar.
- Status HTTP con credencial valida.
- Status HTTP con credencial invalida.
- Si se requiere esperar propagacion de Azure.
- Recomendacion para repetir `TASK-100`.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-101. Product/Architect debe leer tasks/TASK-101-HANDOFF.md.
```
