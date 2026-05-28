# TASK-088 Handoff - Reintento QA local registro publico Company

## Resultado general

Aprobado para commit/push y QA Azure.

El reintento local confirma que los dos hallazgos de `TASK-086` quedaron corregidos despues de `TASK-087`:

- La confirmacion exitosa contiene la frase exacta visible.
- Un non-2xx de `/api/companies/register` muestra error usable y ya no cae en `Registro demo recibido`.

## URLs/locales usadas

- `http://127.0.0.1:4288/index.html#empresas`
- `http://127.0.0.1:4288/index.html?success=1#empresas`
- `http://127.0.0.1:4288/index.html?error=1#empresas`
- `http://127.0.0.1:4288/index.html?viewport=390x844#empresas`
- `http://127.0.0.1:4288/index.html?viewport=1366x768#empresas`

## Cambios realizados

Solo documentacion de QA.

No se modifico codigo de la app.

## Archivos tocados

- `tasks/TASK-088-HANDOFF.md`

## Casos probados

### Lecturas requeridas

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

### Sintaxis

PASS:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

### UI `#empresas`

PASS:

- La pagina renderiza sin errores JS no controlados.
- El copy explica registro gratis y acceso posterior al panel.
- `Ya tengo acceso` existe y apunta a `panel.html`.
- `Publicar empresa` apunta a `#empresas`.
- `Crear perfil gratis` y `Empezar` apuntan a `#registro-empresa`.
- No existe UI activa de `Fotos del perfil`.
- No existe input activo `companyPhotos` ni `input[name="photos"]`.
- No aparece `Agregar fotos` como parte del registro publico.
- No hay CTA publico prominente hacia `admin.html`.

Nota: `app.js` todavia conserva una funcion legacy inactiva `companiesPage()` con UI de fotos. La ruta activa `empresas` usa `companiesPageNew`, por lo que no afecta el render probado.

## Evidencia de submit exitoso

Mock API respondio `201` para:

```text
POST /api/companies/register
```

Payload observado:

```json
{
  "companyName": "QA Eventos TASK 088",
  "email": "qa-task088@example.com",
  "whatsapp": "50688889999",
  "province": "San Jose",
  "canton": "Santa Ana",
  "description": "Empresa de prueba QA para validar registro publico Company despues de TASK 087."
}
```

Validaciones:

- PASS: no llamo `/api/register-provider`.
- PASS: no llamo `/api/create-upload-url`.
- PASS: no llamo `/api/register-upload`.
- PASS: mostro la confirmacion exacta visible:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

Texto visible observado en confirmacion:

```text
REGISTRO RECIBIDO Registro recibido Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision. Te contactaremos si necesitamos confirmar algun dato de QA Eventos TASK 088. Registrar otra empresa
```

## Evidencia de error controlado

Mock API respondio `500` para:

```text
POST /api/companies/register
```

Payload observado:

```json
{
  "companyName": "QA Error TASK 088",
  "email": "qa-error-task088@example.com",
  "whatsapp": "50677778888",
  "province": "Heredia",
  "canton": "Belen",
  "description": "Empresa de prueba QA para validar error controlado sin detalles internos."
}
```

Validaciones:

- PASS: muestra `No pudimos completar el registro`.
- PASS: muestra `El registro no pudo completarse. Revisa los datos e intentalo de nuevo en unos minutos.`
- PASS: no muestra `Registro demo recibido`.
- PASS: no muestra detalles internos ni stack traces del mock (`INTERNAL_SECRET_STACK_SHOULD_NOT_RENDER`, `stack line 1`).

Texto visible observado:

```text
REGISTRO NO ENVIADO No pudimos completar el registro El registro no pudo completarse. Revisa los datos e intentalo de nuevo en unos minutos. Volver al formulario
```

## Responsive

PASS en 390 x 844-ish:

- Sin overflow horizontal.
- Campos y botones no se salen del contenedor.
- Textos de botones no se cortan.
- Sin UI legacy de fotos.
- Sin enlaces visibles a `admin.html`.

PASS en 1366 x 768-ish:

- Sin overflow horizontal.
- Campos y botones no se salen del contenedor.
- Textos de botones no se cortan.
- Sin UI legacy de fotos.
- Sin enlaces visibles a `admin.html`.

## Errores o bugs encontrados

No se encontraron bugs P0/P1/P2 en el alcance de `TASK-088`.

Observacion menor:

- Queda deuda tecnica por la funcion legacy inactiva `companiesPage()` que conserva textos/campos de fotos. No afecta la ruta activa probada, pero puede confundir futuros escaneos.

## Riesgos pendientes

- No se hizo QA Azure real porque esta fuera de alcance.
- No se hizo commit/push porque esta fuera de alcance.
- `panel.html` real y `admin.html` real siguen fuera de alcance en esta prueba.
- La prueba uso mock local; falta confirmar el mismo comportamiento despues de deploy.

## Recomendacion

Listo para commit/push y QA Azure del registro publico `#empresas` conectado a `POST /api/companies/register`.
