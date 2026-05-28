# TASK-086: QA local registro publico Company

## Equipo asignado

QA.

## Contexto

`TASK-083` conecto `index.html#empresas` al flujo nuevo del modelo `Company`.

Antes de commit/push y QA Azure necesitamos validar en navegador local que:

- el formulario publico ya no usa el flujo legacy de proveedores;
- los CTAs de empresa apuntan al recorrido nuevo;
- la UI ya no muestra carga de fotos de perfil durante el registro;
- el submit envia el payload correcto a `/api/companies/register`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `tasks/TASK-083-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar localmente en navegador real el cambio de `#empresas` antes de commit/push.

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
- El copy explica que el registro es gratis y que luego se recibe acceso al panel.
- Existe CTA `Ya tengo acceso` y apunta a `panel.html`.
- `Crear perfil gratis`, `Publicar empresa`, `Crear empresa` o equivalentes apuntan a `#empresas` / `#registro-empresa` segun corresponda.
- No existe UI activa de `Fotos del perfil`.
- No existe input activo `companyPhotos`.
- No aparece `Agregar fotos` como parte del registro publico.
- No hay CTA publico prominente hacia `admin.html`.

### Submit con mock API

Usar mock/local interception si hace falta para confirmar que el submit llama:

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
- Con respuesta `201`, muestra confirmacion clara:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

- Con error API controlado, muestra mensaje usable sin exponer detalles internos.

### Responsive

Validar en:

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
tasks/TASK-086-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- URLs/locales usadas.
- Casos probados.
- Evidencia de payload/endpoints observados.
- Errores o bugs encontrados.
- Riesgos pendientes.
- Recomendacion:
  - listo para commit/push y QA Azure;
  - o requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-086. Product/Architect debe leer tasks/TASK-086-HANDOFF.md.
```
