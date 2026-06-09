# TASK-280 HANDOFF

Equipo: QA

Tarea validada: `TASK-280` - QA Azure del registro publico de empresa desde dominio propio.

## Resultado final

Resultado: **aprobado con observaciones**.

El bloqueo original queda corregido para el flujo de registro desde dominio propio:

- `https://puntoeventocr.com/#empresas` registra empresa QA con respuesta `201`.
- `https://www.puntoeventocr.com/#empresas` registra empresa QA con respuesta `201`.
- Ya no aparece `REGISTRO NO ENVIADO`.
- Ya no aparece `No pudimos completar el registro`.
- La UI muestra confirmacion visible de solicitud recibida.
- Las empresas quedan en `status=pending` y `plan=free`.

Go/no-go:

- **Go para registro publico desde dominio propio**.
- **Go condicionado para primera empresa real**: antes de aprobar una empresa real, Product/QA con credencial admin debe confirmar el enlace de activacion generado al aprobar y limpiar/rechazar las empresas QA creadas en este pase.

## Ambiente

- Apex: `https://puntoeventocr.com/#empresas`
- WWW: `https://www.puntoeventocr.com/#empresas`
- Navegador: Chromium/Playwright contra dominio real.
- Fecha QA: `2026-06-09`.
- Datos: empresas QA controladas, sin datos reales de clientes.
- No se publicaron correos privados, tokens, cookies, credenciales ni secretos.
- No se enviaron leads reales.

## Precondicion TASK-279

Confirmado por lectura de `tasks/TASK-279-HANDOFF.md` y `docs/MVP_RELEASE_STATUS.md`:

- `TASK-279` fue completada por Infra Azure.
- `ALLOWED_ORIGINS` incluye:
  - `https://puntoeventocr.com`
  - `https://www.puntoeventocr.com`
  - hostname anterior de Azure
- `APP_PUBLIC_URL` apunta a `https://puntoeventocr.com`.
- Infra habia validado smokes API `POST /api/companies/register` con `Origin` apex y `www` devolviendo `201`.

## Evidencia de registro desde apex

Ruta:

```text
https://puntoeventocr.com/#empresas
```

Datos QA:

| Campo | Valor |
|---|---|
| Nombre empresa | `QA TASK 280 APEX 20260609194026` |
| Email QA | `qa.task280.apex.20260609194026@example.com` |
| WhatsApp QA | `50688880000` |
| Provincia | `San Jose` |
| Canton | `San Jose` |

Respuesta capturada de `POST /api/companies/register`:

```json
{
  "companyId": "company_786ba20f-cfbc-4fd8-9b88-5ad76f5df3de",
  "slug": "qa-task-280-apex-20260609194026",
  "status": "pending",
  "plan": "free"
}
```

Resultado UI:

- Status HTTP: `201`.
- Confirmacion visible: `SOLICITUD RECIBIDA` / `Recibimos tu solicitud`.
- Mensaje visible: `Te enviaremos las instrucciones de acceso por correo cuando tu cuenta esté lista.`
- Error anterior no aparece.
- Errores de consola: ninguno.
- Desktop: `scrollWidth=1366`, `clientWidth=1366`.

## Evidencia de registro desde www

Ruta:

```text
https://www.puntoeventocr.com/#empresas
```

Datos QA:

| Campo | Valor |
|---|---|
| Nombre empresa | `QA TASK 280 WWW 20260609194026` |
| Email QA | `qa.task280.www.20260609194026@example.com` |
| WhatsApp QA | `50688880000` |
| Provincia | `San Jose` |
| Canton | `San Jose` |

Respuesta capturada de `POST /api/companies/register`:

```json
{
  "companyId": "company_d5f1e9e6-ec83-45d2-9a2a-08b89e834336",
  "slug": "qa-task-280-www-20260609194026",
  "status": "pending",
  "plan": "free"
}
```

Resultado UI:

- Status HTTP: `201`.
- Confirmacion visible: `SOLICITUD RECIBIDA` / `Recibimos tu solicitud`.
- Mensaje visible: `Te enviaremos las instrucciones de acceso por correo cuando tu cuenta esté lista.`
- Error anterior no aparece.
- Errores de consola: ninguno.
- Desktop: `scrollWidth=1366`, `clientWidth=1366`.

## Smoke adicional

| Ruta | Resultado |
|---|---|
| `https://puntoeventocr.com/` | `200` |
| `https://www.puntoeventocr.com/` | `200` |
| `https://puntoeventocr.com/panel.html` | `200` |
| `https://puntoeventocr.com/admin.html` | `200` |
| `https://puntoeventocr.com/api/public/services?limit=5` | `200`, `items=0` |

## APP_PUBLIC_URL / activacion

Resultado: **no validado funcionalmente en esta sesion**.

Motivo:

- El admin requiere credencial configurada en Azure.
- El navegador QA no tenia sesion admin ni credencial guardada.
- Sin credencial admin no se puede aprobar empresa QA ni capturar evidencia del email/enlace de activacion.

Evidencia parcial:

- `TASK-279` confirma `APP_PUBLIC_URL=https://puntoeventocr.com`.
- El admin UI carga correctamente en `https://puntoeventocr.com/admin.html`.
- No se observo prompt nativo; el login inline aparece correctamente.

Pendiente recomendado:

- Product/QA con credencial admin debe aprobar una de las empresas QA o una empresa controlada nueva y confirmar que el enlace de activacion usa `https://puntoeventocr.com`.
- Despues de esa comprobacion, rechazar/limpiar las empresas QA creadas.

## Email interno

Resultado: **sin evidencia de mailbox en esta sesion**.

- El registro `201` normalmente dispara la notificacion interna de nueva empresa.
- No se reviso mailbox ni se documento destinatario/contenido.
- No se publica ninguna direccion privada en este handoff.

## Estado de empresas QA creadas

| Uso | Company ID | Slug | Estado observado | Limpieza |
|---|---|---|---|---|
| Apex | `company_786ba20f-cfbc-4fd8-9b88-5ad76f5df3de` | `qa-task-280-apex-20260609194026` | `pending` | pendiente de rechazo/cleanup por Admin/Infra |
| WWW | `company_d5f1e9e6-ec83-45d2-9a2a-08b89e834336` | `qa-task-280-www-20260609194026` | `pending` | pendiente de rechazo/cleanup por Admin/Infra |

Nota: no quedaron publicadas. Deben ser rechazadas o limpiadas antes de invitar/registrar primeras empresas reales si Product quiere mantener el ambiente completamente limpio.

## Hallazgos por severidad

### P0

- Ninguno.

### P1

- Ninguno para el registro desde dominio propio. El `403` original queda corregido en apex y `www`.

### P2

- Brecha de evidencia operativa: no se pudo confirmar funcionalmente el enlace de activacion con dominio canonico porque no habia credencial/sesion admin disponible.
- Las dos empresas QA quedaron `pending`; no son publicas, pero requieren rechazo/cleanup.

### P3

- No se valido recepcion de email interno por falta de mailbox/evidencia disponible.

## Riesgos o pendientes

- Si Product necesita levantar completamente el NO-GO de primera empresa real, falta una pasada breve con credencial admin: aprobar empresa QA, confirmar enlace de activacion canonico y rechazar/limpiar QA.
- El catalogo publico sigue vacio (`items=0`), coherente con el ambiente limpio.

## Siguiente recomendado

1. Admin/Infra/Product rechaza o limpia:
   - `company_786ba20f-cfbc-4fd8-9b88-5ad76f5df3de`
   - `company_d5f1e9e6-ec83-45d2-9a2a-08b89e834336`
2. QA/Product con credencial admin valida una aprobacion controlada y confirma que el link de activacion usa `https://puntoeventocr.com`.
3. Si ese smoke pasa, levantar el NO-GO temporal y proceder con la primera empresa real.

## Checks ejecutados

```powershell
git rev-parse --show-toplevel
Get-Content -Path AGENTS.md -Raw
Get-Content -Path chat-start/QA.md -Raw
Get-Content -Path tasks/TASK-280-assignment.md -Raw
Get-Content -Path docs/MVP_RELEASE_STATUS.md -Raw
Get-Content -Path docs/MVP_CRITERIA.md -Raw
Get-Content -Path tasks/TASK-279-HANDOFF.md -Raw
Get-Content -Path docs/API_CONTRACTS_MVP.md -Raw
Playwright Chromium: registro desde https://puntoeventocr.com/#empresas
Playwright Chromium: registro desde https://www.puntoeventocr.com/#empresas
Invoke-WebRequest: smokes publicos de dominio propio
```
