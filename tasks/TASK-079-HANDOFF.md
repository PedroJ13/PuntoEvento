# TASK-079 Handoff - QA/Infra Azure carrusel con cover priorizado

## Resultado general

Aprobado. El sitio desplegado en Azure ya usa el frontend actualizado y el perfil publico muestra el `coverUrl` real como primer slide del carrusel.

No cambie codigo, datos ni configuracion. Solo cree este handoff.

## URL Azure usada

Base:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

Ruta principal:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

## Commit/deploy validado

No tuve un hash de commit visible desde Azure Static Web Apps, pero valide la precondicion por despliegue efectivo:

- `GET /index.html`: `200 OK`.
- `Last-Modified`: `Thu, 28 May 2026 21:48:34 GMT`.
- `index.html` publicado referencia `app.js?v=18`.
- El comportamiento nuevo del carrusel esta activo en Azure.

Headers relevantes observados:

- `Strict-Transport-Security`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` con `img-src` limitado a `self`, `blob:`, Unsplash y Blob Storage.

## Datos/API validados

`GET /api/public/services`: `200 OK`.

Servicio QA principal encontrado:

```text
serviceSlug: qa-moderacion-approve-20260528113350
companySlug: qa-company-register-test
coverUrl: .../cover/upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png
gallery[0]: .../gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png
```

`GET /api/public/companies/qa-company-register-test?service=qa-moderacion-approve-20260528113350`: `200 OK`.

La imagen publica en Blob respondio:

```text
HTTP: 200 OK
Content-Type: image/png
Content-Length: 20099
```

## Casos probados

### Perfil publico desktop

Ruta:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

Resultado: PASS.

- Perfil carga desde API.
- Empresa visible: `QA Company Register Test`.
- Servicio seleccionado visible: `QA Moderacion Approve 20260528113350`.
- Primer slide: `upload_9f0c80f0-b98e-4638-8be5-a3f74efc7a19.png`.
- Dimensiones naturales del primer slide: `1200 x 800`.
- Contador inicial: `1 / 2`.
- Miniaturas: `2`.
- URLs unicas en miniaturas: `2`.
- Galeria vieja `upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png` queda como segunda imagen.
- Imagenes rotas: `0`.
- Overflow horizontal: `false`.

### Interaccion del carrusel

Resultado: PASS.

- Boton siguiente cambia a la imagen de galeria antigua.
- La imagen posterior reporta dimensiones naturales `1 x 1`.
- Contador despues de siguiente: `2 / 2`.
- Miniatura activa cambia a indice `1`.
- Click en la primera miniatura vuelve al cover real.
- Contador vuelve a `1 / 2`.
- Miniatura activa vuelve a indice `0`.

### Regresion `#inicio`

Ruta:

```text
/index.html#inicio
```

Resultado: PASS.

- Renderizo servicios destacados: `3` cards.
- El cover real del servicio QA aparece en DOM.
- Al desplazar hasta la seccion, el cover real carga con dimensiones naturales `1200 x 800`.
- Imagenes rotas: `0`.
- Overflow horizontal: `false`.
- No se detectaron campos internos o secretos visibles.

### Regresion `#bodas`

Ruta:

```text
/index.html#bodas
```

Resultado: PASS.

- Renderizo servicios publicados: `4` resultados.
- El cover real del servicio QA aparece y carga con dimensiones naturales `1200 x 800`.
- Renderizo paquetes demo: `6`.
- Imagenes rotas: `0`.
- Overflow horizontal: `false`.
- No se detectaron campos internos o secretos visibles.

### Filtros sin coincidencias

Ruta:

```text
/index.html#bodas
```

Accion:

```text
Servicio = Salon y jardin
Provincia = Alajuela
Aplicar filtros
```

Resultado: PASS.

- Estado vacio visible: `No encontramos servicios con esos filtros`.
- Resultados de servicios: `0`.
- Paquetes demo siguen visibles: `6`.
- Overflow horizontal: `false`.
- No se detectaron campos internos o secretos visibles.

### Responsive mobile

Viewport:

```text
390 x 844
```

Resultado: PASS.

- Perfil carga correctamente.
- Primer slide sigue siendo el cover real `1200 x 800`.
- Contador: `1 / 2`.
- Miniaturas: `2`.
- URLs unicas en miniaturas: `2`.
- Carrusel visible dentro del contenedor.
- `clientWidth=375`, `scrollWidth=375`, sin overflow horizontal.
- Imagenes rotas: `0`.

## Consola y seguridad

Resultado: PASS.

- Logs de error JS capturados por el navegador: `[]`.
- No observe secretos ni campos internos en UI publica:
  - `sessionHash`
  - `tokenHash`
  - `partitionKey`
  - `rowKey`
  - `pendingBlobName`
  - `uploads-pending`
  - `sig=`
  - `sv=`
  - `secret`

## Evidencia visual resumida

La evidencia se tomo con navegador Codex in-app browser mediante lectura DOM y dimensiones naturales:

- Desktop perfil: `stageSrc` fue el cover real, `naturalWidth=1200`, `naturalHeight=800`, `count=1 / 2`.
- Siguiente slide: `stageSrc` fue la galeria vieja, `naturalWidth=1`, `naturalHeight=1`, `count=2 / 2`.
- Primera miniatura: regreso al cover real, `naturalWidth=1200`, `naturalHeight=800`, `count=1 / 2`.
- Mobile: cover real primero, `thumbCount=2`, `uniqueThumbCount=2`, `horizontalOverflow=false`.

No guarde screenshots como archivo para mantener el entregable limitado al handoff solicitado.

## Hallazgos

No encontre bloqueadores.

Observacion menor:

- En `#inicio`, la imagen del servicio QA carga por lazy-load cuando se desplaza hasta la seccion. Esto es comportamiento esperado; al entrar en viewport carga correctamente como `1200 x 800`.

## Archivos tocados

- `tasks/TASK-079-HANDOFF.md`

## Riesgos restantes

- La galeria antigua de `1 x 1` sigue publicada como segunda imagen. Ya no rompe el primer slide, pero si el usuario avanza el carrusel vera una imagen pobre.
- No valide login/panel empresa ni rotacion de credenciales porque esta fuera de alcance.
- No limpie datos QA publicados porque esta fuera de alcance.
- Falta que Product/Architect confirme el commit exacto si necesita trazabilidad por hash.

## Recomendacion

Listo para demo controlada del flujo publico con perfil/carrusel. Si la demo va a mostrar el boton siguiente del carrusel, recomiendo reemplazar o limpiar la galeria antigua `1 x 1` antes de presentarla a usuarios externos.
