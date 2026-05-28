# TASK-071 HANDOFF - QA local pagina publica conectada a servicios

## Resultado general

Aprobado con observaciones.

La pagina publica carga localmente, no queda en blanco, mantiene el look general de Punto Evento y representa resultados como servicios con contexto de empresa usando el fallback demo.

En el servidor local probado, la ruta relativa `/api/public/services` no esta disponible porque es un servidor estatico local. La pagina maneja correctamente esa condicion:

```text
Usa fallback demo.
Muestra aviso discreto.
No presenta errores JS no controlados.
```

No se modifico codigo.

## Navegador/URL local usada

Servidor local activo:

```text
http://127.0.0.1:4173/index.html
```

Navegador:

```text
Codex in-app browser
```

Vista responsive:

```text
Desktop/default browser viewport
Mobile override: 390 x 844
```

## Validaciones de estructura

Sintaxis:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

Resultado:

```text
OK
```

Consola navegador:

```text
Sin errores ni warnings capturados en las rutas probadas.
```

## Rutas probadas

| Ruta | Resultado |
| --- | --- |
| `#inicio` | Carga home, destacados por servicio, aviso fallback discreto |
| `#bodas` | Carga listado por servicio, 6 resultados demo |
| `#proveedor` | Mantiene perfil demo existente |
| `#proveedor/casa-arboleda` | Abre perfil demo de empresa |
| `#proveedor/casa-arboleda/boda-esencial` | Abre perfil de empresa, pero en fallback demo no destaca el servicio |
| `#empresas` | Carga pagina de empresas y formulario |

## Evidencia resumida

### Home `#inicio`

Resultado observado:

```text
Hero: "Encontra proveedores confiables para tu evento"
Cards destacadas: 3
Titulos destacados:
- Boda esencial
- Catering celebracion
- Recepcion con DJ
Meta visible:
- Empresa
- Categoria
- Provincia/zona
Aviso fallback:
"Mostrando datos demo porque la API publica no respondio."
Overflow horizontal: false
```

### Listado `#bodas`

Resultado observado:

```text
Cards de servicio: 6
Filtro presente: true
Cada card revisada incluye:
- nombre del servicio
- empresa asociada
- categoria
- provincia/zona
- precio desde
- imagen
- Ver empresa
- Cotizar servicio
Aviso fallback visible y discreto
Overflow horizontal: false
```

Primeras cards revisadas:

```text
Boda esencial - Casa Arboleda Eventos - Salon y jardin - Santa Ana, San Jose - CRC 28,500 / pers.
Catering celebracion - Bocados y Copas - Catering - San Pedro, San Jose - US$42 / pers.
Recepcion con DJ - Luz Viva Producciones - Musica y luces - Heredia - CRC 235,000
Flores para ceremonia - Flor de Abril - Decoracion floral - Escazu, San Jose - CRC 145,000
```

### Filtros

Filtro aplicado:

```text
service=Catering
province=San Jose
```

Resultado:

```text
Cards resultantes: 1
Resultado: Catering celebracion
Toast: Filtros aplicados.
Pagina en blanco: false
Overflow horizontal: false
```

### Cotizacion

Accion probada:

```text
Cotizar servicio
```

Resultado:

```text
Drawer abierto: true
aria-hidden: false
Titulo: Cotizar proveedores seleccionados
Campos: eventType, date, guests, name, phone, details
```

### Perfil

`#proveedor` y `#proveedor/casa-arboleda`:

```text
Perfil demo carga correctamente.
Titulo: Casa Arboleda Eventos
Galeria/carrusel: 1 / 6
Acciones de cotizacion visibles.
Overflow horizontal: false
```

`#proveedor/casa-arboleda/boda-esencial`:

```text
La ruta abre el perfil de empresa y no rompe la pagina.
En fallback demo se conserva el perfil legacy con paquetes, pero no aparece una lista de servicios con item seleccionado.
```

### Responsive

Mobile `390 x 844`:

```text
#inicio:
- scrollWidth = clientWidth
- overflow horizontal: false
- cards en 1 columna
- nav tiene scroll horizontal controlado

#bodas:
- scrollWidth = clientWidth
- overflow horizontal: false
- cards en 1 columna
- filtros en 1 columna
```

### Seguridad UI

Escaneo de texto/HTML visible en `#bodas`:

```text
No se detecto:
- sessionHash
- tokenHash
- partitionKey
- rowKey
- pendingBlobName
- uploads-pending
- AccountKey
- sig=
- sv=
- emails visibles
```

Imagenes:

```text
Imagenes visibles revisadas: 7
Imagenes rotas detectadas: 0
```

## Hallazgos

### Observacion P2 - Ruta con servicio no destaca servicio en fallback demo

Archivo/seccion:

```text
app.js:653
app.js:682
app.js:842
```

Detalle:

Cuando `serviceDataSource === "demo"`, `providerPage(companySlug, serviceSlug)` cae a `providerDemoPage(companySlug)`. Eso mantiene el perfil demo legacy, pero ignora `serviceSlug`.

Impacto:

```text
#proveedor/casa-arboleda/boda-esencial abre el perfil, pero no muestra el servicio seleccionado como destacado ni una lista de servicios con item seleccionado.
```

Evaluacion:

No bloquea el commit si Product acepta que el highlight por servicio aplica al modo API y que el fallback demo solo conserva perfiles legacy. Si se espera que el fallback tambien demuestre la nueva UX de servicio seleccionado, Web Dev deberia ajustar esta parte antes del commit.

### Observacion - API no disponible en servidor local estatico

Detalle:

```text
http://127.0.0.1:4173/api/public/services no existe en el servidor local estatico.
```

Impacto:

La QA local visual valido principalmente fallback demo. La conexion real a Azure API debe validarse post-deploy o con un servidor local que proxy `/api`.

Esto esta contemplado por la asignacion:

```text
Si el entorno local no puede llamar a Azure por CORS/ruta relativa, valida fallback y documenta la limitacion.
```

## Riesgos restantes

- No se valido visualmente el modo API real en local por ruta relativa `/api`.
- No se obtuvo screenshot por timeout de captura del browser; la evidencia queda como lectura DOM/textual.
- El fallback demo no representa multiples servicios publicados por empresa como lista seleccionable; muestra paquetes legacy.
- La prueba responsive fue en viewport 390 x 844 y desktop/default; no cubre tablets ni todos los breakpoints.
- La pagina depende de la API para demostrar empresas reales con multiples servicios publicados.

## Recomendacion clara

Listo para commit/push con observaciones, si Product/Architect acepta que:

```text
La UX completa de servicio seleccionado se valida en modo API/post-deploy, y el fallback demo solo garantiza continuidad de perfiles legacy.
```

Si se quiere que el fallback local tambien muestre servicio seleccionado y varios servicios por empresa, requiere ajuste Web Dev antes de commit.
