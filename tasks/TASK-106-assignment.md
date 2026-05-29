# TASK-106: QA Azure de admin UI sin `sig=` en DOM

## Equipo asignado

QA / Infra Azure.

## Dependencia

Esperar a que Azure Static Web Apps despliegue el commit que incluye:

```text
admin.html -> admin.js?v=12
admin.js -> placeholder legacy sin image.previewUrl
admin.css -> estilos de placeholder legacy
```

## Contexto

`TASK-104` valido que `admin.html` ya funciona en Azure:

- login admin real;
- `Revision` legacy;
- `Modelo nuevo`;
- approve real de Company, Service y Upload;
- responsive mobile/desktop.

El unico bloqueo fue que el DOM autenticado incluia `sig=` dentro de `img src` de imagenes legacy de `Revision`.

`TASK-105` corrigio ese punto:

- `imageMarkup(provider)` ya no renderiza `image.previewUrl` en `<img src>`.
- Renderiza placeholder seguro con tipo, nombre original saneado y estado.
- Conserva `data-image-id` y checkbox legacy.
- `admin.html` ahora apunta a `admin.js?v=12`.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-104-HANDOFF.md`
- `tasks/TASK-105-HANDOFF.md`
- `admin.html`
- `admin.js`
- `admin.css`

## Base URL

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html
```

## Objetivo

Confirmar en Azure que `admin.html` sigue funcionando y que el DOM renderizado ya no contiene `sig=` ni URLs sensibles.

## Preparacion

1. Esperar deploy exitoso en Azure.
2. Cargar credencial local:

```powershell
. .\local-secrets\qa-admin.ps1
```

3. No imprimir usuario, password, headers completos, cookies, tokens, invitaciones completas ni SAS.

## Casos requeridos

1. Deploy visible:
   - `GET /admin.html` responde `200`;
   - HTML contiene `admin.css?v=7`;
   - HTML contiene `admin.js?v=12`;
   - `admin.js?v=12` contiene `X-Punto-Admin-Credential`;
   - `admin.js?v=12` no contiene `Authorization:`;
   - `admin.js?v=12` no renderiza `image.previewUrl` en template legacy.
2. Login:
   - credencial valida entra al panel;
   - credencial invalida queda bloqueada.
3. Legacy `Revision`:
   - carga sin romperse;
   - imagenes legacy muestran placeholder seguro;
   - checkbox `data-image-id` sigue presente;
   - boton `Actualizar` funciona.
4. Seguridad DOM/render:
   - despues de login, revisar HTML/DOM renderizado de `Revision` y `Modelo nuevo`;
   - confirmar que no aparece `sig=`;
   - confirmar que no aparecen campos prohibidos.
5. `Modelo nuevo` smoke:
   - Companies, Services y Uploads cargan;
   - contadores visibles;
   - tarjetas no exponen campos prohibidos.
6. Acciones reales o smoke seguro:
   - si quedan datos QA pendientes controlados, aprobar/rechazar una Company, Service y Upload;
   - si no quedan datos QA suficientes, documentar counts y hacer refresh/smoke sin tocar datos reales.
7. Responsive:
   - mobile 390x844 sin overflow horizontal;
   - desktop 1366x768 sin overflow horizontal.
8. Consola:
   - sin `console.error` ni excepciones runtime.

## Campos prohibidos

Confirmar que no aparecen:

```text
tokenHash
sessionHash
pendingBlobName
pendingBlobUrl
uploadUrl
sig=
AccountKey
connectionString
partitionKey
rowKey
cookie
pe_company_session
```

## Fuera de alcance

- Rotar credenciales.
- Cambiar codigo.
- Crear endpoint preview seguro.
- Crear endpoint `submit-review`.
- Cambiar pagina publica o panel empresa.
- Hacer commit/push.

## Entregable

Crear:

```text
tasks/TASK-106-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado, requiere cambios o bloqueado.
- Casos ejecutados.
- Evidencia saneada de deploy `admin.js?v=12`.
- Confirmacion de campos prohibidos.
- Datos QA usados o creados, saneados.
- Evidencia/resumen responsive.
- Riesgos pendientes.
- Recomendacion: listo para prueba Product Owner completa, o requiere Web Dev/Backend/Infra.

## Aviso al terminar

Cuando termines, avisa en el chat Product/Architect:

```text
Termine TASK-106. Product/Architect debe leer tasks/TASK-106-HANDOFF.md.
```
