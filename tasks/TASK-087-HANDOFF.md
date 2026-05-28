# TASK-087 Handoff

## Resultado general

Se hicieron los ajustes minimos para que QA local pueda repetir la validacion del registro publico `#empresas` conectado al modelo `Company`.

El submit sigue usando:

```text
POST /api/companies/register
```

y ya no convierte errores locales de API en una confirmacion demo.

## Archivos modificados

- `app.js`
- `index.html`
- `tasks/TASK-087-HANDOFF.md`

## Que se corrigio

### Confirmacion exacta

La confirmacion exitosa ahora incluye como texto visible continuo la oracion exacta solicitada:

```text
Registro recibido. Punto Evento revisara la empresa y enviara acceso al panel para crear servicios, subir fotos y enviarlos a revision.
```

### Error local/non-2xx

El `catch` del submit ya no usa `isLocalDemoEnvironment()` para convertir fallos en `Registro demo recibido`.

Ahora, si `/api/companies/register` responde non-2xx o falla, la UI muestra:

```text
No pudimos completar el registro
El registro no pudo completarse. Revisa los datos e intentalo de nuevo en unos minutos.
```

Esto evita falsos exitos durante QA local.

### Cache

Se actualizo el cache-bust:

```text
app.js?v=20
```

## Como se probo

Validacion de sintaxis:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

Resultado: OK.

Mock de submit exitoso con DOM/fetch falsos:

- PASS: llama `/api/companies/register`.
- PASS: payload enviado:

```json
{
  "companyName": "QA Eventos",
  "email": "qa@example.com",
  "whatsapp": "50688889999",
  "province": "San Jose",
  "canton": "Santa Ana",
  "description": "Empresa de prueba para registro Company."
}
```

- PASS: la confirmacion contiene la oracion exacta solicitada.

Mock de submit con respuesta non-2xx:

- PASS: llama `/api/companies/register`.
- PASS: muestra error usable.
- PASS: no muestra `Registro demo recibido`.

Escaneo rapido:

- PASS: no se llaman endpoints legacy:
  - `/api/register-provider`
  - `/api/create-upload-url`
  - `/api/register-upload`
- PASS: los CTAs activos `Ya tengo acceso` siguen apuntando a `panel.html`.
- PASS: no se agrego CTA publico prominente hacia `admin.html`.

## Riesgos pendientes

- No se hizo QA visual real en navegador ni mobile 390px en esta tarea; queda para repetir QA local.
- `app.js` todavia conserva una funcion legacy inactiva `companiesPage()` con copy de fotos (`companyPhotos`, `Fotos del perfil`, `Agregar fotos`). La ruta activa `empresas` usa `companiesPageNew`, pero esa deuda puede confundir futuros grep/reviews.
- `panel.html` y admin real siguen fuera de alcance y pendientes para el flujo completo.
- No se hizo deploy ni QA Azure.

## Listo para repetir QA local TASK-086

Si. El ajuste apunta directamente a los dos hallazgos que bloquearon el verde estricto de TASK-086.
