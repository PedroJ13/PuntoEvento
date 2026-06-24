# Estado Operativo

Documento vivo para que Proyecto, Pulso, QA y Ejecucion Tecnica compartan el mismo punto de partida sin mezclar historia con estado actual.

Proyecto es responsable de mantenerlo corto y vigente despues de procesar handoffs.

## Ahora

- Cerrar el ciclo `TASK-365` a `TASK-372` de password-flows con lectura de handoffs y decision de cierre.
- Resolver la validacion funcional pendiente de `TASK-372` en Azure con cuenta/correo/admin autorizados.

## Siguiente

- Si `TASK-372` queda aprobado funcionalmente, mover el bloque password-flows a cierre de release.
- Revisar el bloque de imagenes de servicios (`TASK-361` a `TASK-363`) y decidir si requiere cierre adicional o QA publicado.
- Mantener `npm run check` y `npm run test:smoke` como smoke local antes de handoffs tecnicos que toquen la superficie estatica.
- Si `gitleaks` debe ser requisito formal, crear una tarea pequena para documentarlo en PATH o envolverlo en script npm con salida redactada.
- Actualizar `docs/MVP_RELEASE_STATUS.md`, `docs/BACKLOG.md` o `docs/DECISION_LOG.md` solo cuando el handoff cambie estado, alcance o decision.

## Bloqueado

- `TASK-372` no puede aprobarse funcionalmente completo sin una cuenta de empresa autorizada, buzon/correo destino verificable y credencial o sesion admin autorizada. Los smokes Azure quedaron aprobados, pero no sustituyen la prueba real de cambio/reset/admin reset.

## Hecho reciente

- `TASK-364` definio alcance MVP de password-flows para empresas.
- `TASK-365` a `TASK-369` completaron implementacion de cambio autenticado, reset por correo, UI de recuperacion y accion admin.
- `TASK-370` aprobo QA local con observaciones.
- `TASK-371` desplego en Azure y verifico recursos/smokes.
- `TASK-372` ejecuto smokes Azure y dejo bloqueada la validacion funcional por falta de cuenta autorizada.
- `TASK-373` implemento tooling local minimo, scripts npm, Playwright/axe, `docs/TOOLS.md` y smoke local.
- `TASK-374` QA local no aprobo: `npm run check` pasa, `npm run test:smoke` falla reproduciblemente en home publica desktop/mobile; sin P0/P1 de producto.
- `TASK-375` corrigio el smoke local: `npm run check` OK y `npm run test:smoke` OK, 4 passed desktop/mobile, cierre limpio, sin cloud.
- `TASK-376` aprobo QA local de cierre del tooling minimo: `npm run check` OK, `npm run test:smoke` OK, 4 passed desktop/mobile, puerto local sin listener despues del comando.

## Decision necesaria

- Definir si se entrega a QA una cuenta/correo/admin autorizados para cerrar `TASK-372`, o si Proyecto acepta el bloque como verificado solo por smokes tecnicos hasta nueva evidencia funcional.
