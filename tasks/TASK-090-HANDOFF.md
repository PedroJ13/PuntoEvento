# TASK-090 Handoff - Validacion manual navegador normal registro publico

## Resultado general

Aprobado.

Se valido en Google Chrome con perfil temporal que el formulario visible publicado en Azure envia el registro real, recibe `201` y muestra la confirmacion exacta esperada en pantalla.

## Navegador usado

- Google Chrome `148.0.7778.179`
- Perfil temporal aislado para QA.
- Network observado con Chrome DevTools Protocol.

## URL probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

## Datos QA creados

```text
Nombre comercial: QA Manual Registro 20260528235910
Provincia: San Jose
Canton: Santa Ana
WhatsApp: 50688889999
Email: qa-manual-registro-20260528235910@example.test
Descripcion: Empresa QA para validar manualmente el registro publico Company en Azure.
```

No se usaron credenciales admin, cookies, tokens ni secretos.

## Validaciones UI

- PASS: la pagina no muestra `Fotos del perfil`.
- PASS: la pagina no muestra `Agregar fotos`.
- PASS: `Ya tengo acceso` existe y apunta a `panel.html`.
- PASS: se marco el checkbox de permiso/confirmacion.
- PASS: la pagina no queda con overflow horizontal en desktop.
- PASS: no aparece `Registro demo recibido`.
- PASS: no aparece error tecnico, stack trace, token, cookie, SAS, connection string ni secreto.

## Confirmacion visible observada

Texto visible tras enviar:

```text
REGISTRO RECIBIDO Registro recibido Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision. Te contactaremos si necesitamos confirmar algun dato de QA Manual Registro 20260528235910. Registrar otra empresa
```

Validacion exacta:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

Resultado: PASS, la frase exacta aparece como texto visible.

## Network observado

Request observado:

```text
POST https://zealous-field-08fdd720f.7.azurestaticapps.net/api/companies/register
```

Status:

```text
201
```

Payload observado:

```json
{
  "companyName": "QA Manual Registro 20260528235910",
  "email": "qa-manual-registro-20260528235910@example.test",
  "whatsapp": "50688889999",
  "province": "San Jose",
  "canton": "Santa Ana",
  "description": "Empresa QA para validar manualmente el registro publico Company en Azure."
}
```

Endpoints legacy:

- PASS: no se llamo `/api/register-provider`.
- PASS: no se llamo `/api/create-upload-url`.
- PASS: no se llamo `/api/register-upload`.

## Bugs o riesgos

No se encontraron bugs bloqueantes en el alcance de TASK-090.

Riesgos pendientes fuera de alcance:

- `panel.html` aun debe validarse/conectarse como siguiente bloque.
- `admin.html` real para moderar Companies/Services/Uploads queda fuera de esta tarea.

## Recomendacion

Listo para avanzar a `panel.html`.
