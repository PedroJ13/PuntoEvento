# TASK-251 HANDOFF

## Resumen

Se oculto el acceso legacy/demo del admin productivo y se reemplazaron terminos tecnicos visibles.

- El boton `Ver modo demo local` ya no aparece en login normal.
- El modo local queda retenido solo por `?demo=local`.
- Pestañas soporte siguen ocultas por `.support-tab`; sus textos se renombraron por si se habilitan localmente.
- `Company -> Services` ahora es `Empresas y servicios`.
- `uploads pendientes` ahora es `imagenes pendientes`.
- `Cover` ahora se muestra como `Portada`.
- `Sin preview` / `Preview no disponible` ahora usan `vista previa`.
- `Upload ID` y `Scope` ahora se muestran como `Imagen ID` y `Ambito`.

## Archivos tocados

- `admin.html`
- `admin.js`

## Superficies ocultas o retenidas

- Normal productivo: no se muestra boton de modo local ni pestañas soporte.
- Local explicito: `admin.html?demo=local` conserva el flujo de referencia sin tocar endpoints ni credenciales.
- Se mantuvieron nombres internos como `demoMode`, `data-demo-login` y rutas `/internal/uploads/...` porque son codigo/contrato, no copy normal.

## Verificacion

- `node --check admin.js`
- `git diff --check -- index.html app.js admin.html admin.js`
- `rg -n "Legacy|Company -> Services|uploads pendientes|Cover|Sin preview|Preview no disponible|Ver modo demo local|Servicios demo" admin.html admin.js admin.css` sin coincidencias.
- Playwright smoke local:
  - Admin normal no muestra terminos prohibidos: `adminFound: []`.
  - Boton de modo local oculto: `demoLoginVisible: false`.

## Riesgos

- No se cambio autenticacion ni endpoints admin; la validacion de login real requiere Azure con credenciales configuradas.
- La palabra `uploads` permanece en claves internas y rutas API, por contrato existente.

## Pendientes

- QA debe validar admin productivo en Azure con credenciales reales: login, expediente, aprobar/rechazar y vista de imagenes pendientes.

## Siguiente recomendacion

Despues del deploy, revisar `admin.html` sin query param y con `?demo=local` para confirmar que el modo local solo aparece en la ruta explicita.
