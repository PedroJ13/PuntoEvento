# TASK-020: Backend propuesta de autenticacion empresa

## Equipo

Backend API.

## Estado

Completada.

## Resultado general

Recomendacion para MVP cerrado:

```text
Usar token temporal/invitacion con sesion propia server-side como opcion primaria.
```

Alternativa aceptable si Product/Architect quiere usar identidad administrada por Azure desde el inicio:

```text
Azure Static Web Apps Auth, mapeando x-ms-client-principal a Users/Companies.
```

Motivo de la recomendacion primaria:

- El proyecto esta en una fase de MVP cerrado e invitacion a primeras empresas.
- `POST /api/companies/register` ya crea `Company` en estado `pending`.
- El panel empresa actual es demo local y todavia no tiene login real.
- Se necesita desbloquear pronto `/api/companies/me` y CRUD de servicios con aislamiento Empresa A vs Empresa B.
- Un flujo de invitacion evita implementar passwords, evita depender de cuentas Microsoft/GitHub de proveedores, y funciona bien para un grupo inicial controlado.

## Fuentes revisadas

Documentos/repo:

- `AGENTS.md`
- `chat-start/BACKEND_API.md`
- `docs/README.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-018-HANDOFF.md`
- `tasks/TASK-019-HANDOFF.md`
- `api/companies-register/index.js`
- `api/shared/config.js`
- `api/shared/validation.js`
- `panel.html`
- `panel.js`
- `staticwebapp.config.json`

Referencias oficiales usadas para contrastar Azure Static Web Apps Auth:

- Microsoft Learn: `Accessing user information in Azure Static Web Apps`
  - `https://learn.microsoft.com/en-us/azure/static-web-apps/user-information`
- Microsoft Learn: `Custom authentication in Azure Static Web Apps`
  - `https://learn.microsoft.com/en-gb/azure/static-web-apps/authentication-custom`

Resumen tecnico relevante de las referencias:

- Azure Static Web Apps expone informacion de usuario autenticado a Functions mediante header `x-ms-client-principal`.
- Static Web Apps usa rutas `/.auth/*` para login/logout/me.
- Se pueden usar roles y custom roles, pero para asociar una empresa concreta igual se necesita una tabla propia `Users` o equivalente.

## Estado actual que condiciona la decision

- `POST /api/companies/register` ya funciona en Azure.
- La tabla `Companies` existe y persistio una entidad QA.
- El registro nuevo crea solo `Company`, no crea `User`, password ni sesion.
- `panel.html` es demo local y guarda servicios en `localStorage`.
- `staticwebapp.config.json` no tiene reglas de auth para `/panel` ni `/api/companies/me`.
- La app esta en Azure Static Web Apps Free segun inventario infra previo.
- SendGrid no esta completo; email real todavia no debe asumirse como listo.

## Opciones evaluadas

### 1. Azure Static Web Apps Auth / Easy Auth

Descripcion:

Usar autenticacion integrada de Static Web Apps. El usuario entra por `/.auth/login/<provider>`. Las Functions leen el header `x-ms-client-principal`, extraen `identityProvider` y `userId`, y buscan en una tabla `Users` que empresa corresponde a ese usuario.

Complejidad:

```text
Media.
```

Requiere:

- Configurar rutas protegidas en `staticwebapp.config.json`.
- Implementar helper backend para leer `x-ms-client-principal`.
- Crear tabla `Users`.
- Crear flujo para asociar usuario autenticado a `companyId`.

Costo:

```text
Bajo si se usa auth integrada disponible en Static Web Apps.
```

Seguridad:

```text
Buena para MVP si se valida server-side y se usa mapping Users -> companyId.
```

Encaje con Azure Static Web Apps + Functions:

```text
Alto.
```

Impacto UX:

- Bueno si las empresas usan el proveedor elegido.
- Puede ser friccion si proveedores no tienen o no quieren usar cuenta Microsoft/GitHub.
- Para Google u otros proveedores puede requerir configuracion adicional/custom provider.

Riesgo de implementacion:

- Medio por configuracion de proveedores, roles y mapping.
- Riesgo de asumir que el email del proveedor es suficiente. No debe usarse solo email; se debe mapear `provider + userId`.

Como identifica `companyId`:

```text
x-ms-client-principal -> provider/userId -> Users table -> companyId
```

Donde guarda usuarios/sesiones/tokens:

- Sesion la maneja Static Web Apps.
- Tabla propia `Users` guarda mapping:

```json
{
  "PartitionKey": "company_123",
  "RowKey": "user_123",
  "provider": "aad",
  "providerUserId": "...",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active"
}
```

### 2. Magic link por email

Descripcion:

La empresa escribe su email. Backend genera token de un solo uso, lo guarda hasheado con expiracion y envia un link. Al abrir el link, se crea una sesion server-side.

Complejidad:

```text
Media-alta.
```

Costo:

```text
Bajo, pero depende de proveedor de email real.
```

Seguridad:

```text
Buena si tokens son largos, hasheados, de un solo uso, expiran rapido y la sesion queda server-side.
```

Encaje con Azure Static Web Apps + Functions:

```text
Bueno, pero requiere endpoints propios de auth y cookies/sesiones.
```

Impacto UX:

```text
Muy bueno para proveedores no tecnicos: sin password.
```

Riesgo de implementacion:

- Medio-alto porque email real aun no esta listo.
- Riesgo de entrega, spam y soporte de links expirados.

Como identifica `companyId`:

```text
Session cookie -> CompanySessions table -> companyId
```

Donde guarda usuarios/sesiones/tokens:

- `CompanyLoginTokens`: token hasheado, expiracion, usado/no usado.
- `CompanySessions`: sessionId hasheado, companyId, userId/email, expiracion.

### 3. Email + password propio

Descripcion:

Implementar registro/login propio con password.

Complejidad:

```text
Alta.
```

Costo:

```text
Bajo en infraestructura, alto en responsabilidad de seguridad.
```

Seguridad:

```text
Riesgosa para este MVP si no se implementa con mucha disciplina.
```

Requiere:

- Hash fuerte de password.
- Reset password.
- Rate limiting.
- Lockout.
- Politica de password.
- Proteccion CSRF/session.
- Auditoria.

Encaje con Azure Static Web Apps + Functions:

```text
Tecnico posible, pero no recomendable ahora.
```

Impacto UX:

Familiar, pero agrega recuperacion de password y soporte.

Riesgo de implementacion:

```text
Alto.
```

Como identifica `companyId`:

```text
Session cookie/JWT propio -> session/user table -> companyId
```

Conclusion:

No recomendado para MVP inicial.

### 4. Token temporal/invitacion para MVP cerrado

Descripcion:

Admin/Product aprueba o invita a una empresa. Backend genera un token aleatorio largo de invitacion, lo guarda hasheado con expiracion y `companyId`, y entrega el link a la empresa. La empresa abre:

```text
/panel/login?token=...
```

El frontend llama un endpoint de aceptacion. Backend valida el token, crea una sesion server-side y responde con cookie `HttpOnly; Secure; SameSite=Lax`.

Complejidad:

```text
Media-baja.
```

Costo:

```text
Muy bajo.
```

Seguridad:

```text
Aceptable para MVP cerrado si se implementa con tokens largos, expiracion y sesiones server-side.
```

Encaje con Azure Static Web Apps + Functions:

```text
Bueno.
```

Impacto UX:

- Muy simple para primeras empresas.
- No requiere password ni cuenta externa.
- Menos elegante para produccion abierta.

Riesgo de implementacion:

- Bajo-medio.
- Riesgo principal: enlaces reenviados o filtrados.
- Mitigacion: expiracion corta, revocacion, un solo uso para invitacion, sesiones con expiracion, HTTPS, cookie HttpOnly.

Como identifica `companyId`:

```text
Cookie de sesion -> CompanySessions table -> companyId
```

Donde guarda usuarios/sesiones/tokens:

Tabla `CompanyInvites`:

```json
{
  "PartitionKey": "company_123",
  "RowKey": "invite_123",
  "tokenHash": "...",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active",
  "expiresAt": "2026-05-28T00:00:00Z",
  "usedAt": ""
}
```

Tabla `CompanySessions`:

```json
{
  "PartitionKey": "company_123",
  "RowKey": "session_123",
  "sessionHash": "...",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active",
  "expiresAt": "2026-06-10T00:00:00Z",
  "createdAt": "2026-05-27T00:00:00Z"
}
```

Tabla `Users` opcional desde el inicio:

```json
{
  "PartitionKey": "company_123",
  "RowKey": "user_123",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active",
  "authMethod": "invite",
  "createdAt": "2026-05-27T00:00:00Z"
}
```

### 5. Otra opcion: API key por empresa

Descripcion:

Dar un API key fijo por empresa para llamadas privadas.

Complejidad:

```text
Baja.
```

Costo:

```text
Bajo.
```

Seguridad:

```text
No recomendable para panel web.
```

Problema:

Un API key en frontend queda expuesto. No debe usarse como autenticacion de panel.

Conclusion:

Descartado.

## Recomendacion principal

Implementar autenticacion MVP cerrada con invitacion/token y sesion server-side.

Flujo recomendado:

1. Empresa se registra con `POST /api/companies/register`.
2. Company queda `pending`.
3. Admin/Product revisa o decide invitar.
4. Backend crea invitacion para `companyId`.
5. Empresa recibe link o Product lo comparte manualmente para MVP cerrado.
6. Empresa abre `/panel/login?token=...`.
7. Frontend llama `POST /api/company-auth/accept-invite`.
8. API valida token hasheado y no vencido.
9. API crea sesion en `CompanySessions`.
10. API responde cookie:

```text
Set-Cookie: pe_company_session=<random>; HttpOnly; Secure; SameSite=Lax; Path=/api
```

11. Endpoints privados leen cookie, buscan sesion, obtienen `companyId`.
12. Cada endpoint filtra por `companyId` server-side.

Por que esta opcion:

- Es la forma mas rapida de desbloquear `GET /api/companies/me`.
- No obliga a empresas a usar proveedor externo.
- No introduce passwords.
- Permite MVP cerrado con invitaciones controladas.
- Evita exponer tokens persistentes en frontend.

## Alternativa aceptable

Usar Azure Static Web Apps Auth como alternativa si Product/Architect prefiere identidad administrada por Azure.

Recomendacion si se toma esta ruta:

1. Proteger `/panel/*` con `allowedRoles: ["authenticated"]`.
2. Leer `x-ms-client-principal` en Functions.
3. Crear `Users` con mapping `identityProvider + userId -> companyId`.
4. No confiar solo en email.
5. Implementar endpoint `GET /api/companies/me` usando ese mapping.

Ventaja:

- Menos manejo propio de sesiones.
- Mejor base si se quiere auth formal pronto.

Desventaja:

- UX puede ser peor para empresas si el proveedor elegido no encaja.
- Requiere configurar y probar auth de Static Web Apps.
- De todas formas se necesita tabla `Users` para saber que empresa corresponde al usuario autenticado.

## Como se identifica companyId en cada request privado

Con la recomendacion principal:

```text
Request privado
  -> Cookie pe_company_session
  -> hash(session)
  -> CompanySessions
  -> companyId
  -> endpoint consulta Companies/Services por companyId
```

Regla obligatoria:

```text
El frontend nunca decide companyId para operaciones privadas.
```

El frontend puede mostrar `companyId`, pero backend siempre debe derivarlo desde la sesion.

## Donde se guardan usuarios, sesiones y tokens

Tablas propuestas:

```text
CompanyInvites
CompanySessions
Users
AuditLog
```

Minimo para MVP cerrado:

```text
CompanyInvites
CompanySessions
```

Recomendado para no bloquear evolucion:

```text
Users
```

Campos minimos por tabla:

`CompanyInvites`:

- `PartitionKey = companyId`
- `RowKey = inviteId`
- `tokenHash`
- `email`
- `role = company_owner`
- `status = active | used | revoked | expired`
- `expiresAt`
- `usedAt`
- `createdAt`

`CompanySessions`:

- `PartitionKey = companyId`
- `RowKey = sessionId`
- `sessionHash`
- `email`
- `role`
- `status = active | revoked | expired`
- `expiresAt`
- `createdAt`
- `lastSeenAt`

`Users`:

- `PartitionKey = companyId`
- `RowKey = userId`
- `email`
- `role = company_owner`
- `status = active`
- `authMethod = invite | swa`
- `createdAt`

## Como se evita que Empresa A edite servicios de Empresa B

Reglas backend:

- Middleware/helper `requireCompanySession(req)` devuelve `companyId`.
- `GET /api/companies/me` ignora cualquier `companyId` enviado por query/body.
- `PATCH /api/companies/me` actualiza solo `PartitionKey=company`, `RowKey=companyId` de la sesion.
- `GET /api/companies/me/services` lista solo `Services` con `PartitionKey=companyId`.
- `POST /api/companies/me/services` crea servicio con `companyId` de la sesion.
- `PATCH /api/companies/me/services/{serviceId}` primero busca el servicio con `PartitionKey=companyId`; si no existe, responde `404` o `403` sin revelar si pertenece a otra empresa.
- Uploads con `scope=service` deben validar que `serviceId` pertenece a `companyId`.

Regla de seguridad:

```text
Ningun endpoint privado debe aceptar companyId como autoridad desde el cliente.
```

## Cambios requeridos en API

Primera tanda recomendada:

```text
POST /api/company-auth/accept-invite
POST /api/company-auth/logout
GET  /api/companies/me
```

Luego:

```text
PATCH /api/companies/me
GET   /api/companies/me/services
POST  /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
```

Helpers nuevos:

```text
api/shared/companyAuth.js
```

Funciones esperadas del helper:

- Parsear cookie `pe_company_session`.
- Hashear token/session.
- Buscar sesion activa.
- Validar expiracion.
- Devolver `{ companyId, email, role }`.
- Responder `401` si no hay sesion.
- Responder `403` si rol no permite accion.

Endpoint interno/admin futuro:

```text
POST /api/admin/companies/{companyId}/invite
```

Para MVP cerrado, esta creacion de invitacion podria hacerse primero con script/manual admin, pero debe quedar endpoint admin despues.

## Cambios requeridos en Azure

Para recomendacion principal:

- No requiere cambiar proveedor de auth de Static Web Apps.
- Agregar app settings:

```text
COMPANY_SESSION_COOKIE_NAME=pe_company_session
COMPANY_INVITE_TOKEN_TTL_MINUTES=1440
COMPANY_SESSION_TTL_DAYS=14
APP_PUBLIC_URL=https://zealous-field-08fdd720f.7.azurestaticapps.net
```

- Opcionalmente hacer explicito:

```text
AZURE_TABLE_COMPANIES=Companies
AZURE_TABLE_COMPANY_INVITES=CompanyInvites
AZURE_TABLE_COMPANY_SESSIONS=CompanySessions
AZURE_TABLE_USERS=Users
```

- Si se envia email real:

```text
SENDGRID_API_KEY
NOTIFICATION_EMAIL_FROM
NOTIFICATION_EMAIL_FROM_NAME
```

- Agregar reglas en `staticwebapp.config.json` cuando exista panel real:

```text
/panel/* puede seguir publico si el frontend maneja redireccion,
pero APIs privadas deben validar sesion server-side siempre.
```

Para alternativa Static Web Apps Auth:

- Configurar auth provider.
- Agregar rutas protegidas para `/panel/*`.
- Usar `/.auth/login/<provider>` y `/.auth/me`.
- Definir si se usaran roles custom.

## Impacto en /api/companies/register

`POST /api/companies/register` puede quedarse igual ahora.

No debe guardar password.

Recomendacion:

- Mantenerlo como registro publico que crea `Company pending`.
- En una tarea posterior, agregar opcionalmente envio de invitacion cuando Product/Architect defina si la invitacion sale:
  - automaticamente al registrar,
  - despues de revision admin,
  - o manualmente en MVP cerrado.

## Primer endpoint privado a implementar

Primero implementar:

```text
POST /api/company-auth/accept-invite
```

Despues implementar:

```text
GET /api/companies/me
```

Razon:

`GET /api/companies/me` necesita una fuente confiable de `companyId`. La invitacion/sesion crea esa fuente.

## Pruebas QA obligatorias

Autenticacion:

- Token valido crea sesion y setea cookie `HttpOnly; Secure; SameSite=Lax`.
- Token vencido responde `400` o `401`.
- Token usado no puede reutilizarse.
- Token revocado no funciona.
- Logout invalida la sesion.
- Sin cookie, `/api/companies/me` responde `401`.

Autorizacion:

- Empresa A no puede leer `companies/me` de Empresa B.
- Empresa A no puede editar servicio de Empresa B.
- Empresa A no puede subir foto a servicio de Empresa B.
- `companyId` enviado en body/query se ignora o rechaza.

Sesion:

- Sesion vencida responde `401`.
- Sesion revocada responde `401`.
- Cookie no aparece accesible desde JS si se valida en navegador.

Regresion:

- `/api/companies/register` sigue funcionando.
- `/api/register-provider` sigue funcionando por compatibilidad.
- Pagina publica no cambia.

## Riesgos

- El flujo de invitacion no es la solucion final para un marketplace abierto; es una solucion pragmatica para MVP cerrado.
- Si el link de invitacion se reenvia antes de ser usado, otra persona podria activar la sesion. Mitigar con expiracion, email visible, revocacion y un solo uso.
- Sin email real, la distribucion de invitaciones puede ser manual y operativamente fragil.
- Falta rate limiting para endpoints de accept-invite y login.
- Cookies en Azure Static Web Apps + Functions deben probarse en ambiente real, especialmente `Secure`, `SameSite` y `Path`.
- Si se usan tokens Bearer en localStorage en vez de cookies HttpOnly, aumenta riesgo XSS. No recomendado.

## Pendientes

- Product/Architect debe aprobar si el MVP sera cerrado por invitacion.
- Backend debe definir nombres finales de tablas y variables.
- Infra debe confirmar app settings nuevos.
- QA debe preparar casos Empresa A vs Empresa B con dos companies reales.
- Web Dev debe convertir `panel.html` de demo local a panel que llame APIs privadas solo despues de auth.
- Definir politica de expiracion:
  - invitacion: 24 horas o 7 dias,
  - sesion: 14 dias,
  - revocacion manual por admin.

## Proxima tarea recomendada

Backend API:

```text
Implementar helper `api/shared/companyAuth.js` y endpoint `POST /api/company-auth/accept-invite` con tablas `CompanyInvites` y `CompanySessions`, sin tocar todavia CRUD de servicios.
```

Product/Architect:

```text
Aprobar o rechazar la estrategia de MVP cerrado por invitacion, y decidir si las invitaciones se generan manualmente, despues de aprobacion admin o automaticamente tras registro.
```

Infra Azure:

```text
Preparar app settings para tablas/sesion y confirmar que Static Web Apps permite Set-Cookie esperado en Functions integradas.
```

