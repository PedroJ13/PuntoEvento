# TASK-134: QA panel empresa Round 2 post-deploy

## Estado

Aprobado.

## Ambiente probado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`
- Fecha local: 2026-05-30
- Navegador: Chromium headless.
- Sesion real de empresa QA mediante invitacion interna, sin imprimir token/cookie.

## Versiones confirmadas

- `/panel.html` -> `panel.js?v=5`
- `/panel.html` -> `panel.css?v=5`

## Empresa / servicio QA usado

- Company: `company_46f2d1ab-e08a-43bb-8943-303f31764291`
- Company slug: `qa-round2-primary-20260530134649`
- Service: `service_ad0839d5-9471-496b-96fe-dd2495a5d597`
- Uploads creados:
  - 1 `cover`
  - 2 `gallery`

## Limpieza soft aplicada

Al terminar, los 3 uploads, el servicio y la empresa fueron rechazados por endpoints internos.

Resultado de limpieza:

```text
uploads reject -> 200, 200, 200
service reject -> 200
company reject -> 200
remainingPrimaryServices=0
remainingPrimaryUploads=0
```

## Resultado por caso

| Caso | Resultado |
| --- | --- |
| Confirmar versiones panel | PASS |
| Entrar con sesion real de empresa QA | PASS |
| Agregar varias imagenes a un servicio | PASS |
| Marcar una imagen como cover | PASS: al marcar la segunda imagen, el boton queda `Cover`. |
| Confirmar galeria | PASS: backend recibio 1 `cover` y 2 `gallery`, todos `pending`. |
| Intentar imagen 11 y confirmar bloqueo | PASS: mensaje `Maximo 10 imagenes por servicio, incluyendo el cover.` |
| Intentar segundo cover | PASS: la UI reemplaza claramente el cover seleccionado, dejando uno solo. |
| Formato invalido y >5 MB | PASS: mensaje `Usa solo JPG, PNG o WEBP de hasta 5 MB por imagen.` |
| Guardar borrador y enviar a revision | PASS: `Borrador guardado. Imagenes enviadas a revision.` y luego `Servicio enviado a revision.` |
| Confirmar imagenes pendientes hasta admin | PASS: 3 uploads quedaron `pending` hasta moderacion. |
| Desktop/mobile | PASS: funcional completo en desktop con sesion real; DOM responsive desktop/mobile confirma input multiple y copy de 10 imagenes. |

## Evidencia funcional

Panel real:

```text
previewCount10=10
previewCountAfterRemove=3
coverAfterSwitch=Cover
limitMessage=Maximo 10 imagenes por servicio, incluyendo el cover.
previewCountAfterLimit=3
invalidMessage=Usa solo JPG, PNG o WEBP de hasta 5 MB por imagen.
bigMessage=Usa solo JPG, PNG o WEBP de hasta 5 MB por imagen.
saveMessage=Borrador guardado. Imagenes enviadas a revision.
reviewMessage=Servicio enviado a revision.
consoleErrors=[]
```

Uploads tras guardar/enviar:

```text
uploadCountBeforeModeration=3
uploadTypesBeforeModeration=cover,gallery,gallery
statuses=pending,pending,pending
```

DOM responsive sin sesion:

```text
desktop multipleInput=1, max10Copy=1
mobile multipleInput=1, max10Copy=1
authMessage=Necesitas abrir el enlace de invitacion para entrar al panel.
```

## Riesgos / pendientes

- El flujo permite seleccionar/reemplazar cover entre imagenes nuevas; reemplazar un cover ya publicado sigue siendo decision posterior de producto/API.
- No se aprobaron imagenes en admin porque `TASK-132` encontro un P1 en la UI del expediente. La condicion de pendiente hasta admin si quedo validada por API.

## Recomendacion

`TASK-134` queda aprobado para panel empresa. La unica dependencia relacionada es corregir el P1 de visualizacion admin reportado en `TASK-132`.
