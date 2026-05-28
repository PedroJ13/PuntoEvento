# TASK-074 HANDOFF - QA local estado vacio filtros de servicios

## Resultado general

Aprobado.

La pagina publica local distingue correctamente:

- sin filtros activos: muestra todos los servicios disponibles;
- filtros con coincidencias: muestra solo coincidencias;
- filtros activos sin coincidencias: muestra estado vacio y no vuelve a listar todos los servicios.

No se modifico codigo de la app.

## URL local / navegador usado

Servidor local:

```text
http://127.0.0.1:4174/index.html
```

Ruta principal probada:

```text
http://127.0.0.1:4174/index.html#bodas
```

Navegador:

```text
Codex in-app browser
```

Datos:

```text
Fallback demo local, porque /api/public/services no esta disponible en el servidor estatico local.
```

## Validacion de estructura

Comando:

```powershell
C:\Users\pj13e\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
```

Resultado:

```text
OK
```

Nota:

```text
node --check app.js desde PATH fallo con "Access is denied"; se uso el Node bundled del runtime local.
```

## Casos probados

### 1. Carga inicial `#bodas` sin filtros activos

Resultado:

```text
Cards visibles: 6
Empty state visible: false
Select Servicio: Todos
Select Provincia: Todos
Aviso fallback: Mostrando datos demo porque la API publica no respondio.
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

Servicios visibles:

```text
- Boda esencial
- Catering celebracion
- Recepcion con DJ
- Flores para ceremonia
- Foto boda base
- Evento corporativo medio dia
```

### 2. Filtro con coincidencia

Filtro aplicado:

```text
service=Catering
province=San Jose
```

Resultado:

```text
Cards visibles: 1
Resultado: Catering celebracion
Meta: Bocados y Copas - Catering - San Pedro, San Jose
Empty state visible: false
Select Servicio mantiene: Catering
Select Provincia mantiene: San Jose
Toast: 1 servicio(s) encontrado(s).
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

### 3. Filtro sin coincidencias

Filtro aplicado:

```text
service=Catering
province=Alajuela
```

Resultado:

```text
Cards visibles: 0
Empty state visible: true
Titulo: No encontramos servicios con esos filtros
Copy: Prueba con otra categoria o provincia para ver mas opciones disponibles.
Boton: Limpiar filtros
Select Servicio mantiene: Catering
Select Provincia mantiene: Alajuela
Toast: No encontramos servicios con esos filtros.
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

Validacion clave:

```text
No vuelve a listar todos los servicios cuando no hay coincidencias.
```

### 4. Boton `Limpiar filtros`

Accion:

```text
Click en Limpiar filtros desde el empty state.
```

Resultado:

```text
Cards visibles despues de limpiar: 6
Empty state visible: false
Select Servicio: Todos
Select Provincia: Todos
Toast: Filtros limpiados.
Overflow horizontal: false
Consola: sin errores ni warnings capturados
```

## Responsive

Viewport mobile probado:

```text
390 x 844
```

Caso probado:

```text
service=Catering
province=Alajuela
```

Resultado:

```text
Cards visibles: 0
Empty state visible: true
Boton Limpiar filtros visible
Select Servicio mantiene: Catering
Select Provincia mantiene: Alajuela
scrollWidth: 375
clientWidth: 375
Overflow horizontal: false
Nav: scroll horizontal controlado
Consola: sin errores ni warnings capturados
```

Medicion del empty state:

```text
left: 14
right: 361
width: 347
viewportWidth: 375
```

El estado vacio queda dentro del contenedor mobile.

## Evidencia visual

Se intento capturar screenshot desde el Codex in-app browser, pero `Page.captureScreenshot` fallo por timeout CDP.

Evidencia disponible:

```text
- inspeccion DOM en navegador local;
- consola sin errores/warnings;
- interacciones reales para aplicar filtros y limpiar;
- medicion desktop/mobile de overflow y contenedores.
```

## Hallazgos

No se encontraron bugs bloqueantes ni regresiones en el alcance de TASK-074.

Observacion de entorno:

```text
El click por locator en "Aplicar filtros" dio timeout CDP en algunas ejecuciones del navegador embebido; la accion se completo con click CUA sobre el boton visible. El comportamiento de la app fue correcto.
```

## Riesgos restantes

- La validacion fue con fallback demo local; no se probo contra API real porque este bloque no debe hacer deploy y el servidor estatico local no expone `/api/public/services`.
- No se obtuvo screenshot por timeout del browser embebido.
- Los filtros siguen usando opciones fijas en el formulario; cuando crezcan los servicios reales, conviene poblar categorias/provincias desde catalogos o datos publicados.

## Recomendacion

Listo para commit/push del ajuste de Web Dev.
