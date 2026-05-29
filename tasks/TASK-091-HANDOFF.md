# TASK-091 Handoff - QA local panel empresa real

## Resultado general

Aprobado para commit/push y QA Azure, con un riesgo de producto pendiente sobre el estado `draft` y la falta de endpoint explicito para enviar a revision.

El panel real se valido localmente con servidor mock y Chrome headless:

- Sin sesion muestra el estado correcto.
- `panel.html?demo=local` conserva demo local y no llama APIs reales.
- Con sesion mock carga empresa y servicios.
- Crea, edita y desactiva servicios usando endpoints correctos.
- Sube cover usando sign + PUT SAS + confirm.
- Si falla el upload despues de crear servicio, muestra error usable.
- Logout llama endpoint correcto y vuelve a estado sin sesion.
- No renderiza cookies, tokens, SAS ni secretos en UI.
- Responsive desktop/mobile sin overflow horizontal.

## URLs/locales usadas

- `http://127.0.0.1:4392/panel.html`
- `http://127.0.0.1:4392/panel.html?demo=local`

Ambiente de prueba:

- Servidor mock local en memoria.
- Google Chrome headless con perfil temporal.
- No se probo Azure real.
- No se hizo commit/push.

## Archivos tocados

- `tasks/TASK-091-HANDOFF.md`

## Casos probados

### Sintaxis

PASS:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check panel.js
```

### Sin sesion

PASS:

- Muestra `Necesitas abrir el enlace de invitacion para entrar al panel.`
- No lista servicios demo por defecto.
- No muestra datos sensibles.
- No hay errores JS no controlados.

Endpoints observados:

- `GET /api/companies/me` -> mock `401`
- `GET /api/companies/me/services` -> mock `401`

### Demo local explicito

PASS:

- `panel.html?demo=local` muestra `Modo demo local activo. No guarda en Azure.`
- Lista servicios demo (`Queques personalizados`, `Mesa dulce`).
- No llama APIs reales de empresa.

### Sesion/API mock

PASS:

- Carga empresa autenticada `QA TASK 091 Empresa`.
- Lista servicio `published` y servicio `draft`.
- El link publico aparece solo para servicio `published`.
- Servicio `draft` muestra `Visible cuando sea publicado.`

Endpoints observados:

- `GET /api/companies/me`
- `GET /api/companies/me/services`

### Crear servicio con cover

PASS:

- Crea servicio `Servicio creado con cover`.
- Actualiza lista de servicios.
- Ejecuta flujo de upload de cover:
  - `POST /api/uploads/sign`
  - `PUT <SAS mock>`
  - `POST /api/uploads/confirm`
- No renderiza el `uploadUrl`, `sig=` ni `sv=` en UI.

Endpoints observados:

- `POST /api/companies/me/services`
- `POST /api/uploads/sign`
- `PUT /mock-sas/upload_101?sv=MOCK&sig=SECRET`
- `POST /api/uploads/confirm`
- `GET /api/companies/me`
- `GET /api/companies/me/services`

Payload de creacion observado:

```json
{
  "name": "Servicio creado con cover",
  "category": "Catering",
  "eventTypes": ["Bodas"],
  "priceFrom": "CRC 99000",
  "description": "Servicio creado desde QA local con upload de cover.",
  "coverUrl": "",
  "gallery": []
}
```

### Editar servicio

PASS:

- Edita `Servicio borrador QA` a `Servicio borrador editado QA`.
- Mantiene status controlado por backend/mock.
- Actualiza la lista despues de guardar.

Endpoint observado:

- `PATCH /api/companies/me/services/svc_draft`

### Desactivar servicio

PASS:

- Desactiva `Servicio creado con cover`.
- El card queda con estado `Inactivo`.

Endpoint observado:

- `DELETE /api/companies/me/services/svc_created_100`

### Upload fallido despues de crear servicio

PASS:

- Mock devuelve error en `PUT <SAS>`.
- UI muestra error usable:

```text
No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo.
```

- No se llama `POST /api/uploads/confirm` despues del `PUT` fallido.

Endpoints observados:

- `POST /api/companies/me/services`
- `POST /api/uploads/sign`
- `PUT /mock-sas/upload_103?sv=MOCK&sig=SECRET` -> mock `500`

### Logout

PASS:

- Llama `POST /api/company-auth/logout`.
- Renderiza nuevamente estado sin sesion.
- Muestra `Sesion cerrada.`

## Seguridad / no secretos

PASS: en las superficies renderizadas no aparecieron:

- `pe_company_session`
- `token`
- `sessionHash`
- `tokenHash`
- `sig=`
- `sv=`
- `uploadUrl`
- `SAS`
- `connection string`
- `AccountKey`
- `DefaultEndpointsProtocol`

Nota: el `PUT <SAS mock>` existe en Network porque es parte esperada del flujo de upload, pero la URL firmada no se renderiza en la UI.

## Responsive

PASS en 390 x 844:

- `clientWidth=390`
- `scrollWidth=390`
- Sin overflow horizontal.
- Campos, botones y cards no se salen del contenedor.
- Textos de botones no se cortan.
- Sin secretos visibles.

PASS en 1366 x 768:

- `clientWidth=1351`
- `scrollWidth=1351`
- Sin overflow horizontal.
- Campos, botones y cards no se salen del contenedor.
- Textos de botones no se cortan.
- Sin secretos visibles.

## Errores JS

PASS:

- `Runtime.exceptionThrown`: ninguno.
- `console.error`: ninguno.

## Riesgo observado sobre revision

Riesgo P2/P3 de producto:

- No existe endpoint `POST /api/companies/me/services/{serviceId}/submit-review`.
- La UI incluye boton `Como se revisa` y muestra:

```text
Guarda el servicio y el equipo podra revisarlo desde admin interno.
```

El mensaje es suficientemente claro para MVP temporal, pero el servicio queda visualmente como `draft` despues de guardarse. Product/Architect debe decidir si este comportamiento se acepta temporalmente o si entra una tarea para crear endpoint/estado explicito de envio a revision.

## Bugs o riesgos

No se encontraron bugs P0/P1 en el alcance local con mocks.

Riesgos pendientes:

- Falta QA Azure real post commit/deploy.
- La publicacion final de cover depende de moderacion/admin real fuera de alcance.
- La falta de `submit-review` puede generar duda operativa en empresas reales si no se explica en onboarding.

## Recomendacion

Listo para commit/push y QA Azure de `panel.html` conectado a auth/API real.

Recomendacion adicional para Product/Architect:

- Decidir si el MVP acepta `draft` + mensaje de revision temporal, o si se crea tarea para endpoint `submit-review`.
