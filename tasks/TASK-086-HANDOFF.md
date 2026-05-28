# TASK-086 Handoff - QA local registro publico Company

## Objetivo

Validar localmente en navegador el registro publico `#empresas` conectado al modelo nuevo `Company`, antes de commit/push/deploy.

## Resultado

Requiere ajuste de Web Dev antes de marcar TASK-086 como verde estricto.

El flujo principal de registro funciona contra mock local y envia el payload correcto a `POST /api/companies/register`, pero hay 2 desviaciones contra los criterios de la asignacion:

- La confirmacion es clara, pero no aparece como el texto exacto solicitado con punto despues de `Registro recibido`.
- En entorno local (`localhost` / `127.0.0.1`), un error controlado de API cae en confirmacion demo por la rama `isLocalDemoEnvironment()`, no en mensaje de error usable.

## Cambios realizados

Solo documentacion de QA.

No se cambio codigo de la app.

## Archivos tocados

- `tasks/TASK-086-HANDOFF.md`

## Verificacion

Lecturas realizadas:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `tasks/TASK-083-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

Sintaxis:

- PASS: `node --check app.js`

URL local usada:

- `http://127.0.0.1:4186/index.html#empresas`

QA UI `#empresas`:

- PASS: la pagina renderiza sin errores JS no controlados en consola.
- PASS: el copy indica registro gratis y acceso posterior al panel.
- PASS: `Ya tengo acceso` existe y apunta a `panel.html`.
- PASS: `Publicar empresa` apunta a `#empresas`.
- PASS: `Crear perfil gratis` y `Empezar` apuntan a `#registro-empresa`.
- PASS: no hay UI activa `Fotos del perfil`.
- PASS: no hay input activo `companyPhotos` ni `input[name="photos"]` en el registro publico renderizado.
- PASS: no hay texto activo `Agregar fotos`.
- PASS: no hay CTA/enlace publico prominente a `admin.html`.
- Nota: `app.js` conserva una funcion legacy `companiesPage()` con UI de fotos, pero la ruta activa `empresas` usa `companiesPageNew`. Esto queda como deuda/riesgo de mantenimiento, no como bug activo.

Submit exitoso contra mock:

- PASS: se llamo `POST /api/companies/register`.
- PASS: no se llamo `/api/register-provider`.
- PASS: no se llamo `/api/create-upload-url`.
- PASS: no se llamo `/api/register-upload`.
- PASS: payload observado:

```json
{
  "companyName": "QA Eventos TASK 086",
  "email": "qa-task086@example.com",
  "whatsapp": "50688889999",
  "province": "San Jose",
  "canton": "Santa Ana",
  "description": "Empresa de prueba QA para validar registro publico con modelo Company."
}
```

Confirmacion exitosa:

- FAIL menor: el criterio pedia texto exacto:
  `Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.`
- Actual observado:
  `Registro recibido Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.`
- La informacion es correcta, pero al estar separada entre heading y parrafo no aparece la frase exacta con punto.

Error controlado de API:

- FAIL: por inspeccion de `app.js`, si `registerCompanyInAzure()` falla y el host es `localhost`, `127.0.0.1` o vacio, la app ejecuta confirmacion demo:
  `Registro demo recibido`
- Esto impide validar localmente que un `500` controlado muestre el mensaje de error real sin detalles internos.
- Riesgo: un error de API local puede parecer exito demo.
- Limitacion de ejecucion: despues del caso exitoso, la automatizacion del navegador empezo a fallar al ingresar texto con `Browser Use virtual clipboard is not installed`; aun asi, la rama de codigo confirma el comportamiento descrito.

Responsive:

- PASS en viewport solicitado 390x844-ish: sin overflow horizontal, sin controles fuera de contenedor, sin textos de botones cortados.
- PASS en viewport solicitado 1366x768-ish: sin overflow horizontal, sin controles fuera de contenedor, sin textos de botones cortados.

## Bugs / hallazgos

1. P1 - Error API local se presenta como confirmacion demo.
   - Impacto: QA local no puede distinguir API caida/error controlado de una confirmacion demo.
   - Evidencia: `catch` de submit usa `isLocalDemoEnvironment()` y renderiza `mode: "demo"`.
   - Recomendacion: permitir modo QA/mock que fuerce mensaje de error cuando `/api/companies/register` responde non-2xx, o limitar fallback demo a ausencia real de API si Product lo aprueba.

2. P2 - Texto de confirmacion no cumple exact match solicitado.
   - Impacto: criterio de QA automatizable falla aunque el usuario entiende el mensaje.
   - Recomendacion: renderizar la frase exacta como una sola oracion visible o ajustar el criterio si Product acepta heading + cuerpo.

3. P3 - Codigo legacy de `companiesPage()` conserva UI de fotos inactiva.
   - Impacto: no rompe la UI actual, pero puede confundir futuras tareas o reactivar campos legacy por accidente.
   - Recomendacion: planificar limpieza pequena cuando Product/Architect autoricen refactor seguro.

## Riesgos

- No se hizo QA contra Azure real por estar fuera de alcance.
- No se hizo commit/push por estar fuera de alcance.
- `panel.html` y admin real quedan fuera de esta validacion.
- El fallback demo local puede ocultar fallas reales del endpoint durante QA.

## Pendientes

- Web Dev debe decidir/corregir manejo de error local para cumplir la prueba de mock API.
- Web Dev debe ajustar la confirmacion exacta o Product debe relajar ese criterio.
- Ejecutar TASK siguiente de deploy/QA Azure una vez estos puntos esten resueltos o aceptados como excepcion.

## Recomendacion para Product/Architect

No recomendar commit/push como QA verde estricto todavia.

Recomendacion: pedir ajuste Web Dev corto para:

- mostrar error usable en local cuando `/api/companies/register` devuelve non-2xx durante QA;
- alinear la frase exacta de confirmacion.

Despues de ese ajuste, repetir QA local y luego avanzar a commit/push + QA Azure.
