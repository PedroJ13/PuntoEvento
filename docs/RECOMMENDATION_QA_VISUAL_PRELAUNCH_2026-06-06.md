# Recomendacion QA Visual: pre-lanzamiento 2026-06-06

## Contexto

Se ejecuto una revision visual/responsive pre-lanzamiento sobre las superficies principales de Punto Evento:

- Pagina publica: home y resultados.
- Ficha publica de proveedor.
- Drawer de contacto/cotizacion.
- Panel empresa: login, modo demo y formulario de servicio.
- Admin interno: login y modo demo.

Ambiente revisado:

```text
Local: http://127.0.0.1:4173
Viewports: desktop 1366x768, mobile 390x844
Datos: demo/local, sin credenciales reales y sin modificar archivos ni datos
```

## Resultado general

Resultado: aprobado con observaciones.

No se encontraron P1 visuales/responsive. No se detectaron imagenes rotas, scroll horizontal ni botones principales inutilizables en los viewports revisados.

La calidad visual general esta en condicion aceptable para pre-lanzamiento controlado, con tres mejoras recomendadas antes de demos mobile con empresas reales.

## Hallazgos P1

No se detectaron P1.

## Hallazgos P2

### Ficha publica de proveedor en mobile

Problema:

La galeria ocupa casi todo el primer viewport mobile y el nombre de la empresa aparece apenas al borde inferior.

Impacto:

El usuario ve una buena imagen inicial, pero la identidad del proveedor y el contexto comercial tardan en aparecer. Puede reducir reconocimiento inmediato al abrir una ficha desde resultados.

Prioridad sugerida:

P2 recomendable antes de demos o trafico mobile relevante.

Equipo sugerido:

Diseno/UX + Web Dev.

Recomendacion:

Definir si en mobile la ficha debe priorizar impacto visual por galeria o identidad/CTA visibles antes. Si se prioriza conversion, reducir altura inicial de galeria o superponer/adelantar nombre, categoria y CTA.

### Drawer de contacto en mobile

Problema:

El boton `Enviar solicitud` queda inicialmente cortado en el borde inferior del drawer mobile. El drawer permite scroll interno y el CTA se alcanza desplazando, pero no queda visible de entrada.

Impacto:

El flujo no esta bloqueado, pero el CTA principal de contacto queda menos evidente justo en el momento de conversion.

Prioridad sugerida:

P2 pre-lanzamiento.

Equipo sugerido:

Web Dev.

Recomendacion:

Ajustar altura, espaciado o comportamiento del drawer para que el CTA principal quede visible sin scroll inicial en mobile. Alternativa: CTA sticky al fondo del drawer con contenido desplazable encima.

### Panel empresa en mobile

Problema:

El sidebar completo ocupa practicamente el primer viewport mobile. El login y el contenido operativo aparecen despues del menu.

Impacto:

La experiencia se ve profesional, pero la primera accion util del proveedor queda desplazada. Para empresas reales nuevas puede sentirse menos directo.

Prioridad sugerida:

P2 recomendable antes de invitar o asistir a primeras empresas desde telefono.

Equipo sugerido:

Diseno/UX + Web Dev.

Recomendacion:

Evaluar un sidebar mobile compacto, colapsado o en barra superior, manteniendo visibles `Mi empresa` y `Mis servicios` sin empujar login/contenido operativo tan abajo.

## Hallazgos P3

### Admin interno

Problema:

El admin es usable y responsive, pero visualmente se siente mas operativo/legacy que la pagina publica y el panel empresa.

Impacto:

Aceptable porque es una superficie interna. Solo importa si se mostrara durante demos comerciales.

Recomendacion:

No abrir rediseño profundo ahora. Mantenerlo como mejora post-lanzamiento salvo que Product decida mostrar admin a terceros.

### Tipos de evento en panel empresa

Problema:

El selector multiple funciona, pero visualmente se percibe mas nativo/tecnico que el resto del panel premium.

Impacto:

Pulido menor.

Recomendacion:

Aceptar para pre-lanzamiento. Considerar chips/checkbox list mas adelante si se busca una experiencia mas cuidada.

### Logo raster

Problema:

El logo actual funciona visualmente, pero sigue siendo raster.

Impacto:

Riesgo bajo de nitidez en algunos tamanos o pantallas de alta densidad.

Recomendacion:

Mantener como P3 aceptado hasta contar con asset vectorial definitivo.

## Recomendacion para Product / Architect / Release

### Decision sugerida

Mantener `GO pre-lanzamiento controlado` con P2/P3 aceptados, siempre que el primer lote de empresas se acompane de monitoreo cercano.

### Tareas pequenas sugeridas

#### TASK A: CTA visible en drawer mobile

Rol:

Web Dev.

Tarea:

Ajustar el drawer de contacto en mobile para que `Enviar solicitud` sea visible sin scroll inicial o quede sticky al fondo.

Alcance:

- Pagina publica.
- Drawer de contacto.
- Mobile responsive.

No tocar:

- Backend/API de leads.
- Copy transaccional de emails.
- Rediseño general de pagina publica.

Verificacion:

- Abrir ficha publica en mobile.
- Abrir `Contactar`.
- Confirmar que el CTA principal es visible y usable.
- Confirmar que no hay scroll horizontal.

#### TASK B: Panel empresa mobile mas directo

Rol:

Diseno/UX + Web Dev.

Tarea:

Reducir la friccion inicial del panel empresa en mobile para que login/contenido operativo aparezca antes.

Alcance:

- `panel.html`.
- `panel.css`.
- Comportamiento visual mobile del sidebar/menu.

No tocar:

- API.
- Modelo de datos.
- Flujos de autenticacion.

Verificacion:

- Panel mobile sin sesion.
- Panel mobile con demo/sesion.
- Navegacion `Mi empresa` / `Mis servicios`.
- Botones de volver y cerrar sesion.

#### TASK C: Ficha publica mobile con identidad mas temprana

Rol:

Product / Diseno/UX, luego Web Dev si se aprueba.

Tarea:

Decidir si el perfil publico mobile debe mostrar antes el nombre del proveedor, categoria y CTA, aunque se reduzca la presencia inicial de la galeria.

Alcance:

- Ficha publica de proveedor.
- Mobile.

No tocar:

- Resultados publicos.
- Admin.
- Panel empresa.
- API.

Verificacion:

- Abrir ficha desde resultados.
- Confirmar que proveedor, categoria y CTA quedan visibles temprano.
- Confirmar que galeria sigue siendo atractiva y usable.

## Riesgos si no se corrige

- Menor conversion en contacto mobile por CTA parcialmente oculto.
- Primer contacto de proveedor con panel menos directo en telefono.
- Ficha publica mobile con buena imagen visual, pero menor reconocimiento inmediato del proveedor.

## Siguiente recomendado

Product / Architect / Release deberia decidir si estos P2 se aceptan para el primer lote real o si se abren como bloque de ajuste visual acotado antes de invitar empresas.

Recomendacion QA:

```text
Aceptar P3.
Abrir al menos TASK A si el contacto mobile sera parte de la prueba con primeras empresas.
Abrir TASK B si las primeras empresas usaran telefono para cargar informacion.
Dejar TASK C como decision Product/UX antes de tocar layout publico.
```
