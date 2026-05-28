# TASK-088: Reintento QA local registro publico Company

## Equipo asignado

QA.

## Contexto

`TASK-086` encontro dos fallos menores en el registro publico `#empresas` conectado al modelo `Company`.

`TASK-087` aplico los ajustes:

- confirmacion exitosa con la frase exacta visible;
- error local/non-2xx ya no cae en confirmacion demo.

Necesitamos repetir QA local antes de commit/push y QA Azure.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-083-HANDOFF.md`
- `tasks/TASK-086-HANDOFF.md`
- `tasks/TASK-087-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar localmente que el registro publico `#empresas` queda verde despues del ajuste de `TASK-087`.

## Alcance de pruebas

### Sintaxis

Ejecutar:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

### UI `#empresas`

Abrir localmente:

```text
index.html#empresas
```

Validar:

- La pagina renderiza sin errores JS no controlados.
- El copy explica registro gratis y acceso posterior al panel.
- Existe CTA `Ya tengo acceso` y apunta a `panel.html`.
- CTAs de registro apuntan a `#empresas` / `#registro-empresa`.
- No existe UI activa de `Fotos del perfil`.
- No existe input activo `companyPhotos`.
- No aparece `Agregar fotos` como parte del registro publico.
- No hay CTA publico prominente hacia `admin.html`.

### Submit exitoso con mock API

Confirmar que el submit llama:

```text
POST /api/companies/register
```

Payload esperado:

```text
companyName
email
whatsapp
province
canton
description
```

Validar:

- No llama `/api/register-provider`.
- No llama `/api/create-upload-url`.
- No llama `/api/register-upload`.
- Con respuesta `201`, muestra como texto visible continuo:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

### Error controlado con mock API

Con respuesta non-2xx de:

```text
POST /api/companies/register
```

Validar:

- Muestra error usable:

```text
No pudimos completar el registro
El registro no pudo completarse. Revisa los datos e intentalo de nuevo en unos minutos.
```

- No muestra `Registro demo recibido`.
- No muestra detalles internos ni stack traces.

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

## Fuera de alcance

- No probar Azure real.
- No hacer commit/push.
- No modificar codigo salvo que QA encuentre un bloqueo y Product/Architect lo reasigne.
- No validar `panel.html` real.
- No validar `admin.html` real.

## Entregable

Crear:

```text
tasks/TASK-088-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- URLs/locales usadas.
- Casos probados.
- Evidencia de payload/endpoints observados.
- Confirmacion de exito exacta y error controlado.
- Errores o bugs encontrados.
- Riesgos pendientes.
- Recomendacion:
  - listo para commit/push y QA Azure;
  - o requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-088. Product/Architect debe leer tasks/TASK-088-HANDOFF.md.
```
