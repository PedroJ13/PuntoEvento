# TASK-089 Handoff - QA Azure registro publico Company

## Resultado general

Bloqueado parcial.

Azure tiene desplegada la UI esperada (`app.js?v=20`), el endpoint real `POST /api/companies/register` responde `201` y crea empresa `pending/free`, y la UI publicada no muestra la carga legacy de fotos.

Lo que no quedo validado de punta a punta fue el submit desde el formulario visible en navegador, porque el navegador embebido fallo al escribir en campos (`Browser Use virtual clipboard is not installed`) y luego no permitio una alternativa segura de ejecucion dentro de la pagina. Para no inventar evidencia, dejo el endpoint real validado por HTTP y recomiendo una pasada manual corta desde navegador normal o un reintento con herramienta de browser estable.

## Deploy validado

- Ambiente: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Ruta: `/index.html#empresas`
- Cache-bust publicado: `app.js?v=20`
- Commit exacto: no visible desde la prueba.

## Cambios realizados

Solo documentacion de QA.

No se cambio codigo, no se hizo commit/push y no se borraron datos reales.

## Archivos tocados

- `tasks/TASK-089-HANDOFF.md`

## UI Azure

URL probada:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

Validaciones:

- PASS: la pagina carga y renderiza `#empresas`.
- PASS: `index.html` referencia `app.js?v=20`.
- PASS: el copy explica registro gratis y acceso posterior al panel.
- PASS: `Ya tengo acceso` existe y apunta a `panel.html`.
- PASS: `Publicar empresa` apunta a `#empresas`.
- PASS: `Crear perfil gratis` y `Empezar` apuntan a `#registro-empresa`.
- PASS: no aparece `Fotos del perfil`.
- PASS: no aparece `Agregar fotos`.
- PASS: no existe input activo `companyPhotos` ni `input[name="photos"]`.
- PASS: no hay CTA publico prominente hacia `admin.html`.
- PASS: sin errores JS no controlados observados en logs de Azure.

## Registro real por endpoint Azure

Validacion ejecutada por HTTP directo contra Azure porque el navegador embebido no permitio completar el formulario visible.

Request:

```text
POST /api/companies/register
```

Payload enviado:

```json
{
  "companyName": "QA Azure Registro 20260528234811",
  "email": "qa-azure-registro-20260528234811@example.test",
  "whatsapp": "50688889999",
  "province": "San Jose",
  "canton": "Santa Ana",
  "description": "Empresa QA para validar registro publico Company en Azure."
}
```

Response:

```json
{
  "status": 201,
  "body": {
    "companyId": "company_fe95eee2-4295-4a2b-8fea-404dea98aabc",
    "slug": "qa-azure-registro-20260528234811",
    "status": "pending",
    "plan": "free"
  }
}
```

Datos QA creados:

- `companyName`: `QA Azure Registro 20260528234811`
- `email`: `qa-azure-registro-20260528234811@example.test`
- `companyId`: `company_fe95eee2-4295-4a2b-8fea-404dea98aabc`
- `slug`: `qa-azure-registro-20260528234811`

Endpoints legacy:

- No se llamaron en la validacion HTTP directa.
- La UI publicada y `app.js?v=20` mantienen el submit apuntando a `/api/companies/register`; no se observo UI activa que dispare `/api/register-provider`, `/api/create-upload-url` o `/api/register-upload`.

## Confirmacion visible

No validada desde submit real del formulario visible por limitacion de la herramienta de navegador.

Evidencia indirecta:

- Azure sirve `app.js?v=20`.
- `TASK-088` valido localmente con navegador que, con respuesta `201`, la confirmacion visible contiene:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

Pendiente:

- Repetir una pasada manual en navegador normal: llenar formulario, enviar y confirmar que aparece esa frase exacta.

## Error controlado

Validacion HTTP directa con payload invalido:

```json
{
  "companyName": "",
  "email": "not-an-email",
  "whatsapp": "",
  "province": "",
  "canton": "",
  "description": ""
}
```

Response:

```json
{
  "status": 400,
  "body": {
    "error": "Missing required fields",
    "details": {
      "missing": ["name", "whatsapp", "province", "description"]
    }
  }
}
```

Validaciones:

- PASS: no expone stack traces, secrets, connection strings ni storage keys.
- Pendiente UI: validar desde formulario visible que el usuario ve mensaje usable si ocurre non-2xx real.

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

## Regresion publica corta

PASS:

- `/index.html#inicio` carga con heading `Encontra proveedores confiables para tu evento`.
- `/index.html#bodas` carga con heading `Organiza tu boda con proveedores verificados`.
- Sin errores JS no controlados observados en logs de Azure para estas rutas.

## Bugs o riesgos

No se encontro bug P0/P1 de UI publicada o endpoint.

Riesgo pendiente:

- Falta confirmar manualmente el submit real desde el formulario visible en Azure y la confirmacion exacta en pantalla. La evidencia de API y deploy indica que deberia funcionar, pero QA no debe marcarlo verde completo sin esa observacion.
- El endpoint de validacion devuelve `missing: ["name", ...]` aunque el contrato/UI usan `companyName`. No bloquea el flujo feliz, pero conviene alinear el detalle de error en una tarea menor.

## Recomendacion

No marcar TASK-089 como aprobado completo todavia.

Recomendacion para Product/Architect:

1. Hacer una pasada manual corta en navegador normal sobre `https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas`.
2. Si el submit visible muestra la confirmacion exacta, avanzar a `panel.html`.
3. Registrar como deuda menor la alineacion del mensaje de validacion backend (`name` vs `companyName`).
