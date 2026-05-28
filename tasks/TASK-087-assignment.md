# TASK-087: Ajustes QA registro publico Company

## Equipo asignado

Web Dev.

## Contexto

`TASK-086` valido localmente que el formulario publico `#empresas` ya llama correctamente:

```text
POST /api/companies/register
```

Tambien confirmo que ya no llama endpoints legacy ni muestra la carga vieja de fotos. Pero QA no lo marco verde estricto por dos desviaciones:

1. La confirmacion no contiene la frase exacta solicitada porque `Registro recibido` aparece separado del resto sin punto.
2. En localhost/127.0.0.1, un error controlado de API cae en confirmacion demo por `isLocalDemoEnvironment()`, lo cual puede ocultar fallas durante QA.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-083-HANDOFF.md`
- `tasks/TASK-086-HANDOFF.md`
- `app.js`
- `index.html`

## Objetivo

Hacer los ajustes minimos para que QA local pueda marcar verde el registro publico nuevo.

## Alcance

1. Ajustar confirmacion exitosa para que el texto visible incluya exactamente esta oracion:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

Puede seguir existiendo heading/copy adicional, pero esa oracion completa debe estar visible como texto continuo para QA/manual/automatizacion.

2. Ajustar manejo de error en local para que si `/api/companies/register` responde non-2xx, la UI muestre un error usable y no una confirmacion demo.

3. Mantener un fallback demo solo para ausencia real de API o modo demo explicito, si se conserva. Si no es posible distinguirlo bien, preferir error visible en QA local sobre falso exito.

4. No reintroducir:

```text
/api/register-provider
/api/create-upload-url
/api/register-upload
companyPhotos
Fotos del perfil
Agregar fotos
```

5. Mantener CTAs ya ajustados:
   - `Ya tengo acceso` -> `panel.html`.
   - CTAs de registro -> `#empresas` o `#registro-empresa`.
   - Sin CTA publico prominente hacia `admin.html`.

## Fuera de alcance

- Panel empresa real.
- Admin/moderacion real.
- Azure QA.
- Commit/push.
- Refactor amplio de `companiesPage()` legacy.

## Verificacion esperada

- `node --check app.js`.
- Mock de submit exitoso:
  - llama `/api/companies/register`;
  - muestra la oracion exacta de confirmacion.
- Mock de error non-2xx:
  - muestra error usable;
  - no muestra confirmacion demo.
- Verificar que endpoints legacy de provider/upload no se llaman.
- Mobile 390px sin overflow.

## Entregable

Crear:

```text
tasks/TASK-087-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Que se corrigio.
- Como se probo.
- Riesgos pendientes.
- Si queda listo para repetir QA local `TASK-086`.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-087. Product/Architect debe leer tasks/TASK-087-HANDOFF.md.
```
