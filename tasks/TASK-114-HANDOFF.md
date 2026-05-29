# TASK-114 Handoff

## Resultado general

Aprobado.

Azure ya sirve el deploy esperado y el flujo publico de registro en `index.html#empresas` resuelve `PO-001`: evita doble submit desde UI, muestra estado de envio, confirma el exito, limpia/oculta el formulario y permite `Registrar otra empresa`.

## URL probada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas
```

## Assets/versiones observadas

Consulta contra `index.html` publicado el 2026-05-29:

```json
{
  "Scripts": "app.js?v=21",
  "Stylesheets": "styles.css?v=16",
  "HasAppV21": true,
  "HasStylesV16": true
}
```

## Casos ejecutados

1. Se cargo `index.html#empresas` en Azure y se confirmaron `app.js?v=21` y `styles.css?v=16`.
2. Se completo el formulario con datos QA identificables:
   - `QA TASK-114 Doble Submit 20260529210616`
   - `qa-task-114-20260529210616@example.test`
3. Se ejecuto doble click en `Enviar registro gratis`.
4. Se valido estado durante envio con una demora controlada de la request real a Azure:
   - `registerRequests`: `1`
   - boton deshabilitado: `true`
   - texto del boton: `Enviando registro...`
   - estado visible: `Enviando registro. Espera un momento...`
5. Se confirmo exito:
   - aparece `Registro recibido`;
   - aparece `Registrar otra empresa`;
   - el formulario queda oculto;
   - los campos quedan vacios despues de la respuesta.
6. Se uso `Registrar otra empresa` con un segundo registro QA:
   - el formulario vuelve visible;
   - la confirmacion queda oculta;
   - campos vuelven limpios;
   - checkbox vuelve desmarcado.
7. Se valido mobile viewport basico `390x844`:
   - heading visible;
   - formulario presente;
   - boton `Enviar registro gratis` presente;
   - sin overflow horizontal observado.

## Resultado de doble submit

Aprobado.

Evidencia combinada:

- La prueba con doble click y demora controlada registro solo `1` request a `/api/companies/register`.
- El boton queda deshabilitado durante el envio.
- El texto cambia a `Enviando registro...`.
- El estado accesible muestra `Enviando registro. Espera un momento...`.
- La verificacion interna de empresas pendientes encontro una sola entidad para el email QA del doble click.

Verificacion de duplicados via API/admin:

```json
{
  "Status": 200,
  "MatchCount": 1,
  "CompanyIds": [
    "company_e04c0711-14ae-42b0-8607-acbea4cdb252"
  ],
  "Names": [
    "QA TASK-114 Doble Submit 20260529210616"
  ]
}
```

## Resultado mobile basico

Aprobado.

Viewport probado:

```json
{
  "width": 390,
  "height": 844,
  "headingVisible": true,
  "formVisibleInDom": true,
  "submitText": "Enviar registro gratis",
  "submitPresent": true,
  "submitHeight": 44,
  "hasHorizontalOverflow": false,
  "formWidth": 347
}
```

## Bugs o limitaciones

- No se encontraron bugs P0/P1 en el alcance de la tarea.
- La captura del estado durante envio se hizo con Playwright headless agregando una demora controlada antes de continuar la request real a Azure. Esto fue necesario porque la API responde rapido y el estado transitorio puede desaparecer antes de inspeccion manual.
- La prevencion de duplicados validada es de UI y evidencia admin para este caso. No reemplaza una regla backend/idempotencia futura si Producto la requiere.

## Recomendacion

Product / Architect puede marcar `PO-001` como resuelto para el deploy actual.
