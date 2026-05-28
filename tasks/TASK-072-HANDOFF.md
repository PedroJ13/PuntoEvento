# TASK-072 HANDOFF - QA/Infra Azure pagina publica conectada a servicios

## Resultado general

Aprobado con observaciones.

La pagina publica en Azure carga datos reales desde los endpoints publicos por servicio, no muestra aviso de fallback demo cuando la API responde y mantiene una experiencia usable en desktop y mobile.

No se modifico codigo.

## URL Azure usada

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Commit/deploy validado

Commit local usado como referencia:

```text
59aae24 Connect public page to services
```

Validacion realizada contra la Static Web App publica de Azure indicada en la asignacion.

## Rutas probadas

| Ruta | Resultado |
| --- | --- |
| `/index.html#inicio` | Carga home con destacados reales desde API, sin aviso fallback |
| `/index.html#bodas` | Carga listado de 4 servicios publicados reales |
| `/index.html#proveedor/qa-company-register-test` | Carga perfil publicado real desde API |
| `/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350` | Carga perfil real y destaca el servicio seleccionado |

## Evidencia API

### `/api/public/services`

Verificacion HTTP directa:

```text
Status: 200
Items: 4
Primer servicio: QA Moderacion Approve 20260528113350
Empresa asociada: QA Company Register Test
Slug servicio: qa-moderacion-approve-20260528113350
```

### `/api/public/companies/qa-company-register-test`

Verificacion HTTP directa:

```text
Status: 200
Empresa: QA Company Register Test
Slug: qa-company-register-test
Estado: published
Servicios publicados: 4
Primer servicio: QA Moderacion Approve 20260528113350
```

## Evidencia funcional UI

### Home `#inicio`

Observado en navegador:

```text
Titulo hero: Encontra proveedores confiables para tu evento
Aviso fallback: no visible
Cards destacadas: 3
Servicios destacados reales:
- QA Moderacion Approve 20260528113350
- QA Moderacion Approve 20260528113208
- QA Moderacion Approve 20260528113032
Empresa asociada: QA Company Register Test
Provincia: Heredia
Acciones: Ver empresa / Cotizar servicio
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

### Listado `#bodas`

Observado en navegador:

```text
Aviso fallback: no visible
Resultados: 4 servicios
Todos los resultados son servicios QA publicados de QA Company Register Test
No aparece servicio rechazado/no publicado conocido
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

Cada card revisada muestra:

```text
- nombre del servicio
- empresa asociada
- categoria QA Moderacion
- provincia Heredia
- precio Consultar
- imagen o fallback
- accion Cotizar servicio
- link Ver empresa
```

Servicios visibles:

```text
- QA Moderacion Approve 20260528113350
- QA Moderacion Approve 20260528113208
- QA Moderacion Approve 20260528113032
- QA Moderacion Approve 20260528112858
```

Filtros:

```text
Formulario #weddingFilters presente.
Opciones de provincia/servicio presentes.
Filtro province=Heredia aplicado en navegador embebido, mantiene 4 resultados publicados de Heredia.
```

### Perfil empresa

Ruta:

```text
/index.html#proveedor/qa-company-register-test
```

Resultado:

```text
Titulo: QA Company Register Test
Estado visible: Empresa publicada
Plan visible: free
Ubicacion: San Francisco, Heredia
Servicios publicados visibles: 4
Servicio destacado por defecto: QA Moderacion Approve 20260528113350
Carrusel/galeria: 1 / 1
Imagen galeria: carga como image/png 1 x 1
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

### Perfil empresa + servicio seleccionado

Ruta:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

Resultado:

```text
Perfil carga desde API.
Servicio seleccionado destacado: QA Moderacion Approve 20260528113350
Lista de servicios publicados: 4
Item seleccionado marcado: true
Carrusel/galeria no rompe.
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

Esto corrige la observacion local de TASK-071 para modo API real: en Azure el servicio seleccionado si queda destacado.

### Cotizacion

Accion probada:

```text
Boton Cotizar servicio en perfil real
```

Resultado:

```text
Drawer abierto: true
aria-hidden: false
Titulo: Cotizar proveedores seleccionados
Foco inicial: select del formulario
Campos visibles: tipo de evento, fecha tentativa, invitados, nombre, WhatsApp, detalles
Consola: sin errores ni warnings capturados
```

Nota tecnica: el click por locator del browser embebido dio timeout CDP, pero el click real por coordenadas CUA sobre el boton visible abrio correctamente el drawer.

## Imagenes

Endpoint de imagen publica verificado:

```text
URL: https://storagepuntoevento.blob.core.windows.net/public/companies/company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2/services/service_57b80edc-9bb4-43f8-b957-7ffa8959b934/cover/upload_e750b341-74f0-4db0-921e-83557cb9d1d4.png
Status: 200
Content-Type: image/png
Content-Length: 67
```

Observacion:

```text
Las URLs publicas de imagen existen y responden 200.
La imagen QA publicada es un PNG de 1 x 1 / 67 bytes, suficiente para validar plumbing tecnico pero pobre para demo visual.
```

## Responsive

Viewport mobile probado:

```text
390 x 844
```

Resultados:

```text
#inicio:
- scrollWidth = clientWidth
- overflow horizontal: false
- fallback: no visible
- nav scrollable horizontal controlado

#bodas:
- scrollWidth = clientWidth
- overflow horizontal: false
- 4 resultados visibles
- fallback: no visible
- nav scrollable horizontal controlado

#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350:
- scrollWidth = clientWidth
- overflow horizontal: false
- 4 servicios visibles
- fallback: no visible
- nav scrollable horizontal controlado
```

## Seguridad UI

Escaneo de texto/HTML visible en home, listado y perfil:

```text
No se detecto:
- emails privados
- sessionHash
- tokenHash
- partitionKey
- rowKey
- pendingBlobName
- uploads-pending
- sig=
- sv=
- secret
```

## Evidencia visual

Se intento capturar screenshot desde el Codex in-app browser, pero `Page.captureScreenshot` fallo por timeout CDP.

La evidencia queda documentada por:

```text
- inspeccion DOM del navegador embebido;
- consola sin errores/warnings;
- clicks reales CUA para cotizacion;
- verificaciones HTTP directas de API e imagen publica.
```

## Hallazgos

### Observacion P2 - Filtros sin resultados devuelven todos los servicios

Archivo/seccion:

```text
app.js:426
```

Detalle:

La funcion `filteredServices()` devuelve `services` completo cuando `matches.length` es 0:

```text
return matches.length ? matches : services;
```

Impacto:

Un filtro que no coincida con ningun servicio puede mostrar todos los servicios, lo que puede confundir a usuarios y dar la impresion de que el filtro no se aplico.

No bloqueo esta tarea porque el filtro probado con `province=Heredia` coincide con los datos publicados actuales y mantiene resultados correctos.

### Observacion P3 - Imagen QA valida tecnicamente pero no sirve como demo visual

Detalle:

La imagen publica responde 200 y el carrusel carga, pero el asset QA observado es `image/png` de 67 bytes / 1 x 1.

Impacto:

Para una demo controlada de carga de imagenes, conviene publicar al menos una imagen real de mayor dimension para validar encuadre, recorte, cards y carrusel con material visual representativo.

## Riesgos restantes

- No se valido el workflow de GitHub Actions/Azure desde UI de Azure; se valido el sitio desplegado y endpoints publicos ya activos.
- Screenshot no disponible por timeout del browser embebido.
- La prueba responsive cubrio desktop/default y mobile 390 x 844; no cubre tablets ni todos los breakpoints.
- Filtros con cero resultados pueden comportarse como "mostrar todo" por implementacion actual.
- Datos QA tienen imagenes publicas tecnicamente validas pero visualmente minimas.

## Recomendacion

Listo para siguiente bloque de producto.

Antes de una demo a stakeholders, recomiendo:

```text
1. Cargar una imagen real publicada para el servicio QA principal.
2. Ajustar Web Dev para que filtros sin coincidencias muestren estado vacio en vez de todos los servicios.
3. Mantener esta URL como ambiente de demo controlado mientras se siga usando el set QA publicado.
```
