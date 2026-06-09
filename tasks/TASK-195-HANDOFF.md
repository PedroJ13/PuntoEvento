# TASK-195: Web Dev - lenguaje simple en panel empresa

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Textos cambiados

- `Gestiona tus servicios` -> `Carga tus servicios`.
- `Agregar servicio` -> `Cargar servicio`.
- `Datos del servicio` -> `Informacion del servicio`.
- `Imagenes del servicio` -> `Fotos del servicio`.
- `Cover` / `Usar como cover` -> `Portada` / `Usar como portada`.
- `Guardar borrador` + `Enviar a revision` se reemplazo por una sola accion principal: `Guardar y enviar`.
- Mensaje final visible: `Tu informacion fue recibida.`
- Estados visibles simplificados:
  - `draft` -> `En carga`.
  - `pending` -> `Recibido`.
  - `rejected` -> `Necesita ajuste`.

## Comportamiento mantenido

- El backend sigue usando `draft`, `pending`, `submit-review` y moderacion interna.
- El submit principal guarda el servicio y luego llama el endpoint actual de envio a revision por debajo.
- El boton de tarjeta `Completar envio` queda disponible para servicios existentes que todavia esten en carga/necesiten ajuste.

## Archivos cambiados

- `panel.html`
- `panel.js`
- `panel.css`

## Cache busting

- `panel.html` carga `styles.css?v=20`.
- `panel.html` carga `panel.css?v=8`.
- `panel.html` carga `panel.js?v=7`.

## Pantallas probadas

- `http://127.0.0.1:60002/panel.html?demo=local`.
- Viewport mobile `390x844`.

## Verificacion

- `node --check panel.js`: OK.
- Playwright local:
  - Formulario mostro `Cargar servicio`.
  - Texto visible incluyo `Portada`.
  - No hubo boton visible `data-send-review`.
  - No aparecio lenguaje visible de `revision interna`, `Enviar a revision` ni `Guardar borrador`.
  - Submit demo mostro `Tu informacion fue recibida.`

## Textos de revision conservados y motivo

- Solo se conservan nombres internos de API/variables como `submit-review`, `coverUrl` o `imageType=cover` en JavaScript porque forman parte del contrato backend actual y no son visibles para la empresa.

## Riesgos para QA

- Aunque el lenguaje se simplifico, la accion principal ahora hace dos pasos: guardar y enviar. QA debe validar con API real que ambos requests ocurren correctamente.
- Si el backend rechaza `submit-review`, la UI muestra error pero el servicio podria haber quedado guardado como borrador interno.

## Recomendacion para QA

Validar en Azure: crear servicio nuevo, editar servicio existente, subir fotos, elegir portada, confirmar mensaje final y revisar que el servicio quede en estado pendiente/recibido para admin.
