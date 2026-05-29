# TASK-116: Panel empresa con `Enviar a revision`

## Equipo

Web Dev.

## Estado

Completada.

## Resultado general

El panel empresa ahora separa claramente el flujo:

```text
Guardar borrador -> Enviar a revision
```

La empresa ya no edita `status` manualmente y el conteo de fotos dejo de ser un campo editable. La accion `Enviar a revision` llama al endpoint MVP `submit-review` para servicios en `draft` o `rejected`.

## Archivos modificados

- `panel.html`
- `panel.js`
- `panel.css`
- `tasks/TASK-116-HANDOFF.md`

## Cambios UI

- Se removio el selector editable `Estado` del formulario.
- Se removio `Cantidad de fotos` como input manual.
- Se agrego un bloque de lectura con:
  - `Estado actual`;
  - `Fotos aprobadas`.
- El submit principal ahora dice `Guardar borrador`.
- Se reemplazo `Como se revisa` por `Enviar a revision`.
- Cada card de servicio `draft` o `rejected` muestra accion `Enviar a revision`.
- Servicios `pending`, `published` o `inactive` muestran texto contextual en vez de accion.
- Se corrigio responsive mobile del resumen de empresa y encabezado del panel.

## Contrato API usado

Endpoint:

```text
POST /api/companies/me/services/{serviceId}/submit-review
```

Request:

```json
{}
```

Response OK esperado:

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "status": "pending",
  "updatedAt": "2026-05-29T00:00:00.000Z"
}
```

Manejo UI:

- `200`: actualiza el servicio a `pending`, refresca card y quita la accion.
- `400`: muestra validacion de campos minimos.
- `401`: indica sesion expirada/invalida.
- `404`: indica que el servicio no se encontro para la empresa.
- `409`: muestra mensaje entendible de estado no revisable.

## Validaciones de campos minimos

Antes de enviar a revision, la UI valida:

- nombre;
- categoria;
- al menos un tipo de evento;
- descripcion;
- precio desde.

Crear/editar servicio sigue usando `POST /api/companies/me/services` y `PATCH /api/companies/me/services/{serviceId}` sin enviar `status`.

## Verificacion ejecutada

- `node --check panel.js`: OK.
- `git diff --check -- panel.html panel.js panel.css`: OK, con avisos Git de conversion LF -> CRLF.
- Busqueda estructural:
  - no queda `name="status"`;
  - no queda `name="photoCount"`;
  - no queda texto `Cantidad de fotos`;
  - no queda `Como se revisa`.
- Browser demo local:
  - formulario nuevo muestra `Guardar borrador`;
  - `Enviar a revision` queda deshabilitado hasta guardar un borrador;
  - no existen inputs editables de estado ni cantidad de fotos;
  - servicio `draft` cambia a `pending` al enviar a revision en modo demo.
- Mock API modo real:
  - la UI llamo `POST /api/companies/me/services/svc-draft/submit-review` con body `{}`;
  - response `200` actualizo card a `Pendiente`;
  - response `409` mostro mensaje de error entendible.
- Smoke responsive basico con Edge headless:
  - `tasks/generated/TASK-116-desktop.png`;
  - `tasks/generated/TASK-116-mobile.png`.

## Riesgos pendientes

- No se probo contra Azure desplegado ni Azure Functions runtime real desde este chat.
- La administracion completa de galeria queda fuera de alcance; esta tarea solo remueve el conteo manual y mantiene el cover existente.
- `data/categories.json` todavia parece ser catalogo publico legacy; el panel ignora ese formato y usa categorias de servicio fallback hasta que Product/Data deje un catalogo compartido definitivo.
- Si una empresa edita campos en el formulario y presiona `Enviar a revision` sin guardar, la revision usa el ultimo borrador guardado; el copy indica guardar borrador primero.

## Recomendacion para QA

- Validar en Azure con sesion real de empresa:
  - crear servicio y confirmar que el request no envia `status`;
  - editar servicio publicado/rechazado y confirmar que queda `draft`;
  - enviar servicio `draft` y `rejected` a revision;
  - confirmar `pending` en UI despues de `200`;
  - confirmar mensaje claro para `409`;
  - revisar mobile y desktop del panel.

## Recomendacion para Product/Architect

Coordinar Product/Data para reemplazar o separar `data/categories.json` del catalogo publico legacy, porque el panel necesita categorias de servicio controladas y no ocasiones como `Bodas`.

## Siguiente tarea sugerida

QA Azure de `TASK-116` despues del deploy, usando una empresa real de prueba y al menos un servicio `draft`, `rejected` y `published`.
