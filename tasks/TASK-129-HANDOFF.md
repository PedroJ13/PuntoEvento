# TASK-129: QA panel empresa Round 2

## Estado

No aprobado en Azure. Aprobado solo como evidencia local del repo.

## Ambiente validado

- Azure Static Web Apps: `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`
- Local repo: `panel.html?demo=local` con Chromium headless.

## Resultado general

El codigo local de `panel.html` / `panel.js` implementa seleccion multiple de imagenes, limite de 10, cover unico en la seleccion, validacion de formato/tamano y flujo `Guardar borrador -> Enviar a revision`.

Azure aun sirve la version anterior del panel:

- `panel.html` referencia `panel.js?v=4`.
- El input de servicio existe, pero no tiene `multiple`.
- No aparece copy de maximo 10 imagenes.
- En desktop/mobile se observaron errores `401` esperados por no tener sesion, pero el problema principal es que la UI desplegada no contiene el cambio Round 2.

## Casos ejecutados

| Caso | Resultado |
| --- | --- |
| Agregar varias imagenes a un servicio | PASS local: 3 previews creados. FAIL Azure: input desplegado no permite multiple. |
| Marcar una como cover | PASS local: al seleccionar la segunda imagen, su boton queda como `Cover`. |
| Confirmar galeria | PASS local estructural: `cover` queda unico y las demas se envian como `gallery` en `uploadServiceImages`. No validado real en Azure por deploy viejo. |
| Intentar imagen 11 | PASS local: mensaje `Maximo 10 imagenes por servicio, incluyendo el cover.` y no agrega mas previews. |
| Intentar segundo cover | PASS local: la UI reemplaza el cover seleccionado, dejando solo uno. |
| Formato invalido y >5 MB | PASS local: mensaje `Usa solo JPG, PNG o WEBP de hasta 5 MB por imagen.` |
| Guardar borrador y enviar a revision | Parcial local/estructural: botones y endpoint `/submit-review` presentes; no se ejecuto flujo real en Azure porque la UI desplegada es anterior. |
| Imagenes pendientes hasta admin | Parcial local/estructural: copy indica aprobacion pendiente y uploads usan `/uploads/sign` + `/uploads/confirm`; no validado real en Azure. |
| Desktop/mobile | PASS local para presencia de input multiple; FAIL Azure por deploy viejo. |

## Evidencia local

Playwright local en `panel.html?demo=local`:

- `preview3=3`
- Botones iniciales: `Cover`, `Usar como cover`, `Usar como cover`
- Tras marcar segunda imagen: boton `data-set-cover="1"` queda `Cover`
- Intento de 11 imagenes: mensaje de maximo 10 y previews permanecen en 3
- Formato invalido y archivo mayor a 5 MB: mensaje de JPG/PNG/WEBP hasta 5 MB
- Mobile: `input[data-service-photos][multiple]` existe
- Sin errores de consola

Checks sintacticos locales:

- `node --check panel.js`: OK.

## Hallazgos

1. `P1` Azure no tiene desplegado `TASK-125`; el panel visible no permite validar la carga multiple real.
2. `P1` No se pudo completar subida real con SAS, borrador real y envio real en Azure porque la pantalla desplegada no ofrece la UI requerida.
3. `P2` La regla de reemplazo de cover queda resuelta localmente como seleccion unica dentro del set nuevo; sigue pendiente decision de producto para reemplazar un cover ya publicado.

## Recomendacion

Desplegar la version local actual y repetir `TASK-129` con una sesion real de empresa. La evidencia local es buena para merge/deploy, pero no basta para aprobar el comportamiento en Azure.

