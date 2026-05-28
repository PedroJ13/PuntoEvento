# TASK-089: QA Azure registro publico Company

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-088` aprobo localmente el registro publico `#empresas` conectado al modelo nuevo `Company`.

Product/Architect debe hacer commit/push antes de ejecutar esta tarea. Espera a que Azure Static Web Apps termine el deploy del commit que modifica:

- `app.js`
- `index.html`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-083-HANDOFF.md`
- `tasks/TASK-086-HANDOFF.md`
- `tasks/TASK-087-HANDOFF.md`
- `tasks/TASK-088-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar en Azure real que `index.html#empresas` registra empresas usando:

```text
POST /api/companies/register
```

y que la UI publicada refleja el flujo nuevo sin la carga vieja de fotos.

## Ambiente

Base Azure:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Ruta:

```text
/index.html#empresas
```

## Precondicion

Confirmar que el deploy nuevo esta activo:

- `index.html` referencia el cache-bust esperado (`app.js?v=20` o superior).
- La UI no muestra `Fotos del perfil` ni `Agregar fotos` en el registro publico.

## Alcance de pruebas

### UI

Validar:

- La pagina carga sin errores JS no controlados.
- El copy explica registro gratis y acceso posterior al panel.
- Existe CTA `Ya tengo acceso` y apunta a `panel.html`.
- CTAs de registro apuntan a `#empresas` / `#registro-empresa`.
- No existe UI activa de `Fotos del perfil`.
- No existe input activo `companyPhotos`.
- No aparece `Agregar fotos` como parte del registro publico.
- No hay CTA publico prominente hacia `admin.html`.

### Registro real

Crear una empresa QA nueva y unica desde navegador:

```text
companyName: QA Azure Registro <timestamp>
email: qa-azure-registro-<timestamp>@example.test
whatsapp: 50688889999
province: San Jose
canton: Santa Ana
description: Empresa QA para validar registro publico Company en Azure.
```

Validar:

- El request enviado es `POST /api/companies/register`.
- No se llaman endpoints legacy:
  - `/api/register-provider`
  - `/api/create-upload-url`
  - `/api/register-upload`
- El response esperado es `201`.
- La confirmacion visible contiene:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

### Error controlado

Si es posible sin alterar datos reales, provocar un error de validacion controlado. Por ejemplo:

- email invalido con validacion browser;
- campo requerido vacio;
- duplicado si el backend lo maneja de forma segura.

Validar:

- El usuario ve mensaje usable.
- No aparecen detalles internos, stack traces, secrets ni payload sensible.

### Responsive

Validar:

```text
390 x 844
1366 x 768 o similar
```

Debe cumplirse:

- Sin overflow horizontal.
- Campos y botones no se salen del contenedor.
- Textos de botones no se cortan.

### Regresion publica corta

Validar rapido:

- `/index.html#inicio` carga.
- `/index.html#bodas` carga.
- No hay errores JS no controlados.

## Seguridad

- No pegar cookies, tokens, credenciales ni secrets en el handoff.
- No usar `ADMIN_PASSWORD` para esta prueba salvo que necesites verificar en storage por canal seguro; si lo haces, redactar todo.
- No hacer commit/push.
- No borrar datos reales.

## Entregable

Crear:

```text
tasks/TASK-089-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- Commit/deploy validado si lo tienes visible.
- Datos QA creados: companyName, email, companyId/slug si se obtiene, sin secretos.
- Evidencia de endpoint/payload observado.
- Confirmacion visible observada.
- Validacion responsive.
- Bugs o riesgos.
- Recomendacion:
  - listo para avanzar a `panel.html`;
  - o requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-089. Product/Architect debe leer tasks/TASK-089-HANDOFF.md.
```
