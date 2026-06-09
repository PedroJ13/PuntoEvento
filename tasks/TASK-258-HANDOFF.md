# TASK-258 HANDOFF

## Resumen

Se pulió microcopy del panel empresa para quitar lenguaje técnico/inglés y evitar percepción de revisión manual.

## Textos reemplazados

- `email y password` -> `correo y contraseña`.
- `Password` -> `Contraseña`.
- `Confirmar password` -> `Confirmar contraseña`.
- `Define un password...` -> `Define una contraseña...`.
- `Los passwords no coinciden` -> `Las contraseñas no coinciden`.
- `Completar envio` -> `Enviar servicio`.
- `Tu informacion ya fue recibida` -> `Tu información fue recibida. Se publicará lo antes posible.`
- `¿Necesitas ayuda?`, `Estamos aquí...`, `Contáctanos` corregidos.
- Mensajes hacia empresas reemplazan revisión manual por preparación/publicación pronta.

## Archivos tocados

- `panel.html`
- `panel.js`

## Strings conservados por dependencia técnica

- `password` y `passwordConfirm` en `name`, variables y payload.
- `email` en `name`, variables y payload.
- `submit-review`, `pending`, `rejected` y otros estados internos.

## Verificación

- `node --check panel.js`
- Playwright smoke en `panel.html`:
  - `panelForbidden: []` para strings antiguos clave.
- `rg -n "email y password|Define un password|Los passwords|Completar envio|Tu informacion ya fue recibida|Estamos aqui|Contactanos" panel.html panel.js` sin coincidencias.

## Riesgos

- La API conserva el endpoint interno `submit-review`; no se cambió comportamiento ni contrato.
- Algunos estados internos siguen llamándose `pending/rejected`, pero la empresa ve etiquetas de producto.

## Pendientes

- QA debe validar login recurrente, activación por invitación, crear/editar/enviar servicio y logout con credenciales reales o ambiente preparado.

## Siguiente recomendación

Revisar el panel en Azure con una empresa de prueba y confirmar que ningún mensaje visible hable de revisión, moderación o aprobación manual.
