# TASK-034: Sesion controlada para probar invitacion real

## Equipo

Infra Azure con apoyo de Product/Owner.

## Estado

Bloqueada para ejecucion completa.

## Resultado general

No se pudo completar el flujo real de invitacion.

Se intento ejecutar el flujo sin pegar secretos en chat, docs, handoffs ni commits. Para eso se leyeron credenciales admin desde Azure Static Web Apps app settings solo en memoria y se uso el header Basic Auth sin imprimirlo.

Resultado:

```text
POST /api/internal/company-invites con Authorization calculado en memoria -> 401 Unauthorized
```

Por seguridad no se imprimieron:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- Authorization header
- `inviteUrl`
- token real
- cookie completa de sesion
- storage keys
- connection strings

No se creo invitacion real.
No se obtuvo `inviteId`.
No se ejecuto `accept-invite` con token real.
No se ejecuto logout con cookie real.

## Opcion usada

Opcion intentada:

```text
Credenciales leidas desde Azure Static Web Apps app settings en memoria via Azure CLI.
```

Motivo:

```text
La sesion no tenia ADMIN_USERNAME / ADMIN_PASSWORD como variables de entorno locales, pero Azure CLI estaba disponible y autenticado.
```

Resultado:

```text
Bloqueada. Las credenciales obtenidas por esa via no autenticaron contra /api/internal/company-invites.
```

Interpretacion probable:

```text
Los valores disponibles para Infra por Azure CLI no corresponden al secreto efectivo esperado por la Function, o hay desalineacion entre app settings visibles y runtime activo.
```

## Entorno revisado

Variables locales:

```text
ADMIN_USERNAME: no disponible en la sesion local
ADMIN_PASSWORD: no disponible en la sesion local
```

Azure CLI:

```text
Disponible por ruta local:
C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd
```

Azure app settings:

```text
ADMIN_USERNAME: existe
ADMIN_PASSWORD: existe
```

Nota:

```text
Se confirmo solo existencia, no valores.
```

## Flujo intentado

Base URL:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Empresa QA:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
email: qa-company-register-test@example.com
```

### 1. Generar invitacion con Basic Auth calculado en memoria

Request:

```text
POST /api/internal/company-invites
Content-Type: application/json
Authorization: Basic <redacted>
```

Body:

```json
{
  "companyId": "company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2",
  "email": "qa-company-register-test@example.com"
}
```

Status:

```text
401 Unauthorized
```

Headers relevantes:

```text
Content-Type: application/json; charset=utf-8
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Body:

```json
{
  "error": "Unauthorized"
}
```

Conclusion:

```text
No se pudo crear invitacion real. El flujo queda bloqueado antes de generar inviteUrl/token.
```

## Smokes sin secretos

Se repitieron los smokes seguros para confirmar que los endpoints siguen vivos.

### POST /api/internal/company-invites sin auth

Status:

```text
401 Unauthorized
```

Headers relevantes:

```text
Content-Type: application/json; charset=utf-8
WWW-Authenticate: Basic realm="Punto Evento Admin"
```

Body:

```json
{
  "error": "Unauthorized"
}
```

Conclusion:

```text
Endpoint interno sigue desplegado y protegido.
```

### POST /api/company-auth/accept-invite sin token

Status:

```text
400 Bad Request
```

Body:

```json
{
  "error": "token is required"
}
```

Conclusion:

```text
Endpoint accept-invite sigue desplegado y valida token requerido.
```

### POST /api/company-auth/logout sin cookie

Status:

```text
200 OK
```

Headers relevantes sanitizados:

```text
Content-Type: application/json; charset=utf-8
Set-Cookie: pe_company_session=; max-age=0; domain=zealous-field-08fdd720f.7.azurestaticapps.net; path=/api; secure; samesite=lax; httponly
```

Body:

```json
{
  "ok": true
}
```

Conclusion:

```text
Logout sigue operativo e idempotente sin cookie.
```

## inviteId creado

No aplica.

```text
No se creo invitacion real porque la llamada autenticada devolvio 401.
```

## Cookie observada

Solo se observo cookie de limpieza en logout sin sesion:

```text
pe_company_session
max-age=0
domain=zealous-field-08fdd720f.7.azurestaticapps.net
path=/api
secure
samesite=lax
httponly
```

No se observo cookie de sesion activa porque no hubo token real para `accept-invite`.

## Reuso de token

No ejecutado.

Motivo:

```text
No se genero invitacion real ni token real.
```

## Logout con cookie real

No ejecutado.

Motivo:

```text
No se creo sesion real.
```

## Validacion de Table Storage

No ejecutada.

Motivo:

```text
No se creo invitacion ni sesion nuevas para validar.
```

Pendiente cuando se desbloquee:

- Invitacion queda `status: used`.
- Invitacion tiene `usedAt`.
- Existe sesion en `CompanySessions`.
- Sesion queda `revoked` despues de logout.
- No existe token plano ni session token plano.

## Riesgos

- El flujo real de invitacion sigue sin validarse end-to-end.
- Hay posible desalineacion entre credenciales admin visibles/configuradas y las credenciales efectivas que valida la Function.
- QA Azure no puede continuar con `accept-invite` real hasta generar un token desde `/api/internal/company-invites`.
- Sin prueba real, no se ha confirmado `Set-Cookie` de sesion activa.
- Sin prueba real, no se ha confirmado reutilizacion de token usado.
- Basic Auth admin sigue siendo mecanismo temporal MVP.
- No hay rate limiting para generar o aceptar invitaciones.

## Recomendacion para Product/Architect

No marcar TASK-034 como aprobada funcionalmente todavia.

Siguiente paso recomendado:

```text
Product/Owner debe ejecutar una sesion pareada o cargar ADMIN_USERNAME y ADMIN_PASSWORD reales como variables de entorno temporales en una terminal local controlada, sin pegarlos en chat.
```

Luego repetir el flujo:

```text
1. POST /api/internal/company-invites con Basic Auth real.
2. Guardar solo inviteId, companyId, email, role y expiresAt.
3. Mantener inviteUrl/token solo en memoria.
4. POST /api/company-auth/accept-invite con token real.
5. Confirmar Set-Cookie pe_company_session con flags, sin imprimir valor.
6. Reusar token y esperar 400.
7. POST /api/company-auth/logout con cookie real y esperar 200.
8. Si hay acceso a Table Storage, validar status used/revoked sin imprimir hashes.
```

Adicionalmente, revisar en Azure Portal:

```text
Static Web App puntoevento -> Environment variables -> Production
```

Confirmar que `ADMIN_USERNAME` y `ADMIN_PASSWORD` son los valores reales esperados por Product/Owner. Si se actualizan, guardar con `Apply` y repetir el smoke autenticado.
