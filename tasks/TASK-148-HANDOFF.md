# TASK-148: QA readiness MVP local

## Equipo

QA

## Estado

Completada

## Formato QA requerido

```text
Equipo: QA
Tarea validada: readiness MVP local posterior a TASK-146
Ambiente: local, http://127.0.0.1:4173
Resultado: aprobado con observaciones
```

Nota: este handoff fue ajustado para seguir el skill `$punto-evento-qa`, indicado en `chat-start/QA.md` linea 9.

## Objetivo

Ejecutar una ronda QA sin cambios de codigo para validar flujos MVP visibles, regresion publica, panel empresa, admin interno, responsive basico y seguridad basica documentable desde el workspace local.

## Alcance

- Confirmacion de root Git.
- Lectura de contexto QA y documentos MVP indicados.
- Smoke local de pagina publica, panel empresa y admin interno.
- Revision responsive en desktop, tablet y mobile.
- Validacion manual asistida de cotizacion demo, formulario de registro y bloqueo admin sin sesion.
- Revision estatica de secretos/patrones sensibles visibles.
- Syntax check de JavaScript frontend y API.

## Fuera de alcance

- No se corrigio codigo.
- No se hizo deploy.
- No se ejecutaron flujos autenticados reales de Azure por falta de credenciales/sesion asignada en esta tarea.
- No se modificaron datos reales de Azure.
- No se reejecuto el flujo completo con empresa real, aprobacion real y publicacion real porque el prompt generado de QA no trae tarea pendiente y no se entregaron credenciales nuevas.

## Ambiente

```text
Workspace: C:\Users\pj13e\Digital Products\Punto Evento
Git root: C:/Users/pj13e/Digital Products/Punto Evento
Servidor local: http://127.0.0.1:4173
Fecha QA: 2026-05-30
```

## Verificacion ejecutada

- `git rev-parse --show-toplevel`
  - Resultado: `C:/Users/pj13e/Digital Products/Punto Evento`
- Lectura de:
  - `AGENTS.md`
  - `chat-start/QA.md`
  - `docs/README.md`
  - `docs/WORKFLOW_CODEX.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/MVP_CRITERIA.md`
  - `docs/QA_TEST_PLAN.md`
  - `docs/ROUTE_MAP_MVP.md`
  - `tasks/generated/prompts/qa-next-prompt.md`
  - `tasks/generated/manager-board.md`
- Servidor local:
  - `python -m http.server 4173 --bind 127.0.0.1`
  - `GET /index.html` respondio `200`.
- Smoke navegador local:
  - `index.html#inicio`
  - `index.html#bodas`
  - `index.html#proveedor/casa-arboleda`
  - `index.html#empresas`
  - `panel.html`
  - `admin.html`
- Viewports revisados:
  - Desktop: `1366x768`
  - Tablet: `768x900`
  - Mobile: `375x812`
- Checks automaticos por ruta/viewport:
  - Sin errores de consola detectados.
  - Sin imagenes rotas detectadas.
  - Sin overflow horizontal detectado.
  - Contenido principal visible.
- Interacciones:
  - Cotizacion demo en ficha proveedor: abre drawer, acepta campos requeridos y muestra confirmacion demo.
  - Registro empresa: bloquea requeridos con validacion HTML5; email y website invalidos permanecen invalidos; terminos/provincia requeridos quedan marcados como invalidos.
  - Registro empresa con texto `<img src=x onerror=alert(1)> QA`: el valor queda en el input, pero no se renderiza como HTML en `document.body.innerHTML` durante la prueba local.
  - Admin sin login: muestra login y mantiene panel interno oculto.
  - Admin modo demo local: muestra banner demo y deja claro que la revision interna real requiere login admin.
  - Panel empresa sin sesion: muestra estado `Empresa sin sesion` y mensaje de invitacion/sesion requerida.
- Revision estatica:
  - Busqueda de patrones `ADMIN_PASSWORD`, `AZURE`, `ACCOUNT_KEY`, `SENDGRID`, `sig=`, `SharedAccessSignature`, connection strings, `secret`, `password`, `key` en frontend/API.
  - No se encontraron secretos hardcodeados en frontend. Las referencias sensibles encontradas son uso esperado de variables de entorno en `api/shared/config.js` y manejo de password/auth en `admin.js` / `api/shared/adminAuth.js`.
  - `admin.js` mantiene filtro defensivo para no renderizar `sig=`, `tokenHash`, `sessionHash`, `pendingBlobName` ni `uploadUrl`.
- Syntax checks:
  - `node --check app.js`: aprobado.
  - `node --check panel.js`: aprobado.
  - `node --check admin.js`: aprobado.
  - `node --check` para todos los `.js` bajo `api`: aprobado.

## Resultado por area

| Area | Resultado | Notas |
| --- | --- | --- |
| Regresion publica | Aprobado local | Home, bodas, ficha proveedor y empresas cargan sin consola, sin imagenes rotas y sin overflow en los viewports revisados. |
| Cotizacion/contacto | Aprobado como demo local | La confirmacion indica que no se envia informacion real; Product debe aceptar si este alcance demo es suficiente para MVP. |
| Registro empresa | Aprobado local parcial | Validaciones visibles pasan. No se envio registro real contra API/Azure en esta ronda. |
| Panel empresa | Aprobado sin sesion | No expone datos de empresa real sin invitacion/sesion; indica que se requiere enlace de invitacion. Flujos autenticados no ejecutados. |
| Admin interno | Aprobado sin sesion/demo | Login requerido y panel interno oculto sin credenciales. Demo local bloquea revision real. Flujos reales autenticados no ejecutados. |
| Responsive | Aprobado local minimo | Sin overflow horizontal en desktop/tablet/mobile para rutas principales. |
| Seguridad basica | Aprobado local parcial | No se vieron secretos frontend ni render HTML peligroso en registro local; permisos reales Azure no revalidados en esta ronda. |

## Hallazgos

### P0

- Ninguno.

### P1

- Ninguno encontrado en esta ronda local.

### P2

- Cobertura autenticada real no ejecutada en esta ronda: no se probaron login empresa real, CRUD real, upload real, aprobacion/rechazo real ni aislamiento Empresa A vs Empresa B contra Azure. La evidencia previa en `docs/MVP_RELEASE_STATUS.md` y `TASK-146` queda vigente, pero esta ronda no la reemplaza.
- `tasks/generated/manager-board.md` y prompts generados estan desactualizados respecto al estado actual; el prompt QA dice que no hay tareas pendientes y el manager board generado es de `2026-05-28`. Esto puede inducir a chats especializados a trabajar sobre contexto viejo.

### P3

- En mobile, la muestra visible de `#inicio` no incluye el CTA superior `Publicar empresa` por el layout responsive, aunque la ruta `#empresas` sigue accesible desde navegacion y el formulario carga correctamente.
- No se pudo persistir screenshot desde el runtime del navegador interno por restriccion de permisos del entorno (`EPERM` al crear carpeta de artifacts). No bloquea el resultado funcional, pero limita evidencia visual persistente de esta ronda.

## Riesgos

- La recomendacion de release no debe basarse solo en esta ronda local: faltan re-prueba Product Owner y/o smoke Azure autenticado si se quiere cerrar invitacion a empresas reales.
- El flujo de cotizacion sigue siendo demo/controlado. Si el MVP promete recepcion real de oportunidades, Product / Architect / Release debe aceptar explicitamente este alcance o asignar implementacion del envio real.
- Los checks de seguridad fueron basicos; no sustituyen auditoria completa de auth, rate limiting, MIME real, expiracion SAS ni logging/auditoria admin.
- Workspace tiene muchos cambios/untracked previos. No se revirtieron ni se tocaron.

## Recomendacion release/no release

Recomendacion QA: `aprobado con observaciones para evidencia local; release condicionado / no liberar a empresas reales solo con esta evidencia`.

Motivo:

- No hay P0/P1 nuevos en la ronda local.
- La regresion publica, responsive minimo, admin sin sesion, panel sin sesion y cotizacion demo pasan localmente.
- Pero los criterios de salida todavia dependen de re-prueba Product Owner y de aceptar riesgos P2, especialmente cotizacion demo y falta de revalidacion autenticada real en esta tarea.

Siguiente recomendado:

- Product / Architect / Release: regenerar `tasks/generated/manager-board.md` y prompts.
- Product Owner: ejecutar re-prueba enfocada segun `docs/PRODUCT_OWNER_TEST_SCRIPT.md`.
- QA/Infra, si Product lo pide: smoke Azure autenticado de registro -> invitacion/login -> servicios -> upload -> aprobacion -> busqueda publica.
