# TASK-090: Validacion manual navegador normal registro publico

## Equipo asignado

QA / Product Owner.

## Contexto

`TASK-089` valido que Azure ya tiene desplegado `app.js?v=20`, que la UI publica `#empresas` muestra el flujo nuevo y que el endpoint real:

```text
POST /api/companies/register
```

responde `201` y crea empresas `pending/free`.

Lo unico pendiente es observar el submit real desde el formulario visible en navegador normal, porque el navegador embebido de QA fallo al escribir en campos.

## Objetivo

Confirmar manualmente que el formulario visible en Azure envia el registro y muestra la confirmacion exacta en pantalla.

## URL

Abrir en navegador normal:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

## Datos sugeridos

Usar datos QA nuevos y unicos:

```text
Nombre comercial: QA Manual Registro <timestamp>
Provincia: San Jose
Canton: Santa Ana
WhatsApp: 50688889999
Email: qa-manual-registro-<timestamp>@example.test
Descripcion: Empresa QA para validar manualmente el registro publico Company en Azure.
```

Marcar el checkbox de permiso/confirmacion y enviar.

## Validaciones

Confirmar:

- La pagina no muestra `Fotos del perfil`.
- La pagina no muestra `Agregar fotos`.
- Existe `Ya tengo acceso` y apunta a `panel.html`.
- Al enviar, aparece esta frase exacta como texto visible:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

- No aparece `Registro demo recibido`.
- No aparece error tecnico, stack trace, token, cookie, SAS ni secreto.
- La pagina no queda con overflow horizontal en desktop.

Si puedes abrir DevTools/Network sin mucho esfuerzo, confirmar:

- Request: `POST /api/companies/register`.
- Status: `201`.
- No se llaman:
  - `/api/register-provider`
  - `/api/create-upload-url`
  - `/api/register-upload`

## Fuera de alcance

- No probar panel empresa.
- No probar admin.
- No hacer commit/push.
- No borrar datos QA.
- No usar credenciales admin.

## Entregable

Crear:

```text
tasks/TASK-090-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- Navegador usado.
- Datos QA creados, sin secretos.
- Confirmacion visible observada.
- Si se pudo observar Network, endpoints/status.
- Bugs o riesgos.
- Recomendacion:
  - listo para avanzar a `panel.html`;
  - o requiere ajuste Web Dev.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-090. Product/Architect debe leer tasks/TASK-090-HANDOFF.md.
```
