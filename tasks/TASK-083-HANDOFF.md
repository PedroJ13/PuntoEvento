# TASK-083 Handoff

## Resultado general

Se conecto la ruta publica `#empresas` al flujo nuevo del modelo `Company`.

La UI activa de registro ya no pide fotos de perfil ni intenta crear uploads desde el registro publico. El submit ahora usa:

```text
POST /api/companies/register
```

con los campos del contrato MVP:

```text
companyName
email
whatsapp
province
canton
description
```

## Archivos modificados

- `app.js`
- `index.html`
- `tasks/TASK-083-HANDOFF.md`

## Comportamiento nuevo

- `#empresas` muestra copy del flujo nuevo:
  - registro gratis;
  - revision de Punto Evento;
  - acceso posterior al panel;
  - creacion de servicios y fotos desde `panel.html`.
- El formulario publico solo captura datos basicos de empresa.
- La confirmacion Azure dice:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

- En local/demo, si la API no responde, se mantiene una confirmacion demo sin romper el flujo.
- Se actualizo cache-bust de `index.html`:

```text
app.js?v=19
```

## CTAs revisados

- Header `Publicar empresa`: sigue apuntando a `#empresas`.
- Hero empresas `Crear perfil gratis`: apunta a `#registro-empresa`.
- Hero empresas `Ya tengo acceso`: apunta a `panel.html`.
- Panel informativo dentro de registro `Ya tengo acceso`: apunta a `panel.html`.
- Plan gratis `Empezar`: apunta a `#registro-empresa`.
- No se agrego CTA publico prominente a `admin.html`.

## Fotos de perfil

La UI activa de `#empresas` ya no renderiza:

- `Fotos del perfil`;
- input `companyPhotos`;
- boton/texto `Agregar fotos`;
- preview local de imagenes.

El copy ahora explica que las fotos se cargan desde el panel empresa despues de recibir acceso.

## Pruebas locales

Validacion de sintaxis:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

Resultado: OK.

Validacion estructural con runtime Node y mock de DOM/fetch:

- `#empresas` usa la pagina nueva de registro.
- La UI renderizada contiene el copy del flujo nuevo.
- La UI renderizada contiene CTA `Ya tengo acceso` hacia `panel.html`.
- La UI renderizada no contiene `companyPhotos`, `Fotos del perfil` ni `Agregar fotos`.
- La UI renderizada contiene los campos requeridos por `POST /api/companies/register`.
- El bloque de submit llama a `/api/companies/register`.
- El payload del bloque de submit contiene `companyName`, `email`, `whatsapp`, `province`, `canton`, `description`.
- El bloque de submit ya no contiene endpoints legacy de upload ni payload legacy de provider.

No se hizo prueba Azure real ni deploy en esta tarea.

## Riesgos pendientes

- `panel.html` sigue pendiente de conectarse a sesion/API real; este cambio solo agrega el CTA de acceso.
- `admin.html` todavia no modera Companies/Services/Uploads del modelo nuevo.
- La verificacion visual fue estructural; QA local en navegador real debe validar mobile 390px y ausencia de overflow.
- Queda pendiente QA Azure post-commit/push para confirmar `POST /api/companies/register` desde navegador real.

## Requiere commit/push antes de QA Azure

Si. Para que QA Azure valide el flujo desde navegador, este cambio debe commitearse, pushearse y desplegarse en Static Web Apps.
