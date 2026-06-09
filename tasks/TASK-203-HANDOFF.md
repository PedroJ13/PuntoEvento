# TASK-203-HANDOFF: Guia visual minima marca y panel empresa

Equipo: Diseno / UX  
Fecha: 2026-06-04  
Estado: completado como guia, sin cambios de codigo

## Resumen visual

La direccion recomendada es un refresh premium sobrio para el panel privado de empresas, inspirado en las referencias recibidas:

- marca editorial con monograma `PE`;
- negro profundo + dorado como acento;
- fondo claro calido;
- tarjetas blancas con borde suave;
- sidebar izquierdo para navegacion del panel;
- area principal amplia y limpia;
- CTAs principales oscuros;
- acciones secundarias claras, con iconos cuando reduzcan ruido.

No recomiendo redisenar ahora la pagina publica, el admin interno ni el perfil publico. El alcance debe concentrarse en `panel.html` / `panel.css` / `panel.js` y en el uso minimo de marca compartida si Web Dev necesita algun token global.

## Referencias revisadas

- `Reference Images/Propeusta logo e imagen de pagina.jpeg`
- `Reference Images/Propuesta Panel de Empresas.jpeg`
- Panel actual: `panel.html`, `panel.css`, `panel.js`

Lectura UX de las referencias:

- Logo: monograma `PE`, serif, negro/dorado, arco fino, estrellas decorativas y pin integrado.
- Tagline: `CATALOGO DE PROVEEDORES PARA EVENTOS`.
- Panel: sidebar fijo a la izquierda, logo arriba, menu vertical, bloque de ayuda abajo, header editorial, resumen de empresa, tarjetas de servicio y botones con iconos.

## Guia de marca minima

### Logo

Version recomendada para MVP:

- Usar una version horizontal/vertical simple del logo en el sidebar.
- En el sidebar desktop, mostrar:
  - monograma `PE`;
  - texto `Punto Evento`;
  - tagline corto debajo.
- En mobile, usar solo monograma `PE` o texto `Punto Evento` segun espacio.

Reglas minimas:

- No usar el JPEG de referencia como asset final si queda borroso o con fondo no controlado.
- Si no existe logo vectorial, Web Dev puede recrear temporalmente un lockup tipografico con texto y monograma CSS/HTML.
- Mantener alto del logo desktop entre `92px` y `132px` incluyendo tagline.
- Mantener monograma minimo de `44px` de alto para legibilidad.
- Fondo recomendado: claro calido.
- Contraste: `Punto` en negro profundo, `Evento` o acento en dorado.

### Tagline

Confirmacion recomendada:

```text
Catalogo digital de proveedores para eventos
```

Uso:

- En logo/sidebar puede ir en mayusculas espaciadas:
  - `CATALOGO DIGITAL DE PROVEEDORES`
  - `PARA EVENTOS`
- En textos normales usar sentence case:
  - `Catalogo digital de proveedores para eventos.`

No usar tagline largo dentro de botones.

### Paleta

Tokens sugeridos:

```text
--brand-ink: #17191d
--brand-ink-soft: #2a2c31
--brand-gold: #b9934b
--brand-gold-dark: #8f6f35
--brand-gold-soft: #efe4cf
--brand-bg: #f8f5ef
--brand-surface: #fffdf8
--brand-surface-muted: #f3eee6
--brand-line: #e4dacb
--brand-muted: #6f6a62
--brand-success: #2f6b4f
--brand-success-bg: #dfeee5
--brand-warning: #8b641d
--brand-warning-bg: #fff2d6
--brand-error: #a44735
--brand-error-bg: #fbe3dc
--brand-disabled: #b8afa2
--brand-disabled-bg: #eee8df
```

Uso:

- Primario: negro profundo para CTAs y texto principal.
- Acento: dorado para detalles, iconos, eyebrows, active nav y numeros destacados.
- Fondo: claro calido, no blanco puro en toda la pantalla.
- Tarjetas: blanco calido con borde suave.
- Estados: mantener color + texto, nunca depender solo del color.

## Tipografia

Recomendacion:

- Titulos/editorial: `Cormorant Garamond`, `Playfair Display` o `Georgia` como fallback.
- UI/cuerpo: `Inter`, `Segoe UI`, system sans.

Si Product no quiere cargar fuentes externas:

- Usar `Georgia` para titulos grandes y `system-ui` para UI/cuerpo.
- Evitar que todo el panel dependa de una fuente web externa para funcionar.

Jerarquia basica:

- H1 panel: serif/display, `56-72px` desktop, `34-40px` mobile, line-height `0.95-1.05`.
- H2 seccion: serif/display, `30-40px` desktop, `26-32px` mobile.
- H3/card title: sans o serif discreta, `20-24px`.
- Body: `15-16px`, line-height `1.45-1.6`.
- Labels: `12-13px`, peso `650-750`, color muted/ink.
- Eyebrow: uppercase, dorado, `12px`, letter spacing leve solo si se acepta romper la regla general de letter spacing `0` en este contexto de marca.
- Botones: `14-15px`, peso `700`.

## Componentes base

### Botones

Primario:

- Fondo `--brand-ink`.
- Texto blanco.
- Icono opcional a la izquierda o derecha.
- Uso: `Cargar servicio`, `Guardar y enviar`, `Activar acceso`, `Iniciar sesion`.

Secundario:

- Fondo blanco/calido.
- Borde `--brand-line`.
- Texto `--brand-ink`.
- Uso: `Volver a la pagina publica`, `Ver publico`, `Editar`.

Destructivo/sensible:

- No usar dorado.
- Usar fondo suave + texto error o borde error.
- Uso: `Desactivar`.

Iconos:

- Recomendado usar icono + texto para acciones frecuentes del panel:
  - volver;
  - cerrar sesion;
  - cargar servicio;
  - ver publico;
  - editar;
  - desactivar;
  - portada;
  - quitar foto.
- Icon-only solo para acciones muy obvias o compactas, siempre con `aria-label` y tooltip.

Tamanos:

- Desktop CTA: altura `46-48px`.
- Compacto: altura minima `40-42px`.
- Mobile/touch: altura minima `44px`.
- Radio: `10-14px`; mantener sobrio, no pill excesivo salvo badges.

### Inputs

- Fondo blanco.
- Borde claro `--brand-line`.
- Focus con anillo dorado suave o ink suave:
  - `box-shadow: 0 0 0 4px rgba(185, 147, 75, 0.18)`.
- Labels visibles arriba, no solo placeholder.
- Mensajes de ayuda en muted.

### Tarjetas

- Fondo `--brand-surface`.
- Borde `--brand-line`.
- Radio `12-16px`.
- Sombra muy suave o ninguna; premium debe sentirse limpio, no flotante excesivo.
- Padding desktop `24-32px`; mobile `18-20px`.

### Badges / estados

Mapeo sugerido:

- `draft` / `En carga`: neutral, fondo gris calido.
- `pending` / `Recibido`: warning suave dorado.
- `published` / `Publicado`: success suave.
- `rejected` / `Necesita ajuste`: error suave.
- `inactive` / `Inactivo`: neutral oscuro.

Copy recomendado:

```text
draft -> En carga
pending -> Recibido
published -> Publicado
rejected -> Necesita ajuste
inactive -> Inactivo
```

No mostrar valores tecnicos en UI.

### Sidebar active / disabled

Activo:

- Fondo `--brand-gold-soft`.
- Texto `--brand-ink`.
- Icono dorado o ink.
- Borde/indicador izquierdo opcional en dorado.

Disponible no activo:

- Fondo transparente.
- Texto `--brand-ink-soft`.

Deshabilitado / proximamente:

- Texto `--brand-disabled`.
- Icono atenuado.
- Badge `Proximamente`.
- No debe parecer clickeable si no abre nada.

## Guia de panel empresa

### Layout

Desktop recomendado:

```text
panel-app
  sidebar 260-300px
  main flexible
```

Sidebar:

- Posicion izquierda.
- Alto completo de viewport.
- Logo arriba.
- Menu vertical.
- Bloque ayuda/contacto abajo.

Main:

- Fondo claro calido.
- Padding `32-48px`.
- Header superior con eyebrow, H1 y acciones arriba a la derecha.
- Decoracion sutil opcional con lineas/arcos dorados muy suaves, sin competir con formularios.

Mobile recomendado:

- Sidebar se convierte en bloque superior compacto o menu horizontal simple.
- No implementar drawer complejo si no es necesario.
- Mantener primero acciones criticas: `Mis servicios`, `Mi empresa`, `Cerrar sesion`.

### Acciones superiores

Mantener:

- `Volver a la pagina publica`
- `Cerrar sesion`

Tratamiento:

- `Volver a la pagina publica`: boton secundario con icono de flecha.
- `Cerrar sesion`: boton primario/oscuro o secundario oscuro, con icono de salida.
- No ocultar logout en desktop.
- En mobile, pueden apilarse o pasar a menu superior.

### Hero / titulo superior

Copy recomendado:

```text
Panel empresa
Carga tus servicios
Completa la informacion que quieres mostrar a clientes cuando tu servicio este publicado.
```

Notas:

- Mantener el H1 actual `Carga tus servicios`; encaja con MVP.
- Si se incluye vista `Mi empresa`, el H1 puede cambiar a `Actualiza tu empresa`.
- No introducir dashboard de metricas real.

### Tarjetas de resumen

Mantener los datos actuales:

- nombre de empresa;
- descripcion;
- cantidad de servicios;
- plan actual;
- estado de perfil.

Tratamiento:

- Card principal de empresa con icono lineal de tienda/empresa.
- Cards pequeñas para metricas.
- Numeros y estados pueden usar dorado.

Copy:

- `servicios`
- `plan actual`
- `perfil empresa`

### Vista `Mi empresa`

Incluida en guia como vista MVP, pero sin agregar campos nuevos si backend/UI actual no los edita.

Contenido minimo:

- resumen de empresa actual;
- estado del perfil;
- datos visibles disponibles;
- indicacion clara si la edicion completa aun no esta disponible.

Copy sugerido para estado no editable:

```text
Tu empresa esta registrada. Para cambiar datos generales, contacta al equipo de Punto Evento durante esta etapa inicial.
```

Si Product aprueba edicion futura, crear tarea separada.

### Vista `Mis servicios`

Debe ser la vista principal del panel MVP.

Contenido:

- lista de servicios;
- estado visible por servicio;
- accion `Cargar servicio`;
- acciones por servicio:
  - `Ver publico` si publicado;
  - `Editar`;
  - `Desactivar`;
  - `Completar envio` si aplica.
- formulario de servicio existente.

Tratamiento de cards de servicio:

- Mostrar badge de estado arriba.
- Titulo del servicio destacado.
- Acciones principales en la franja superior o derecha.
- Datos en mini-cards:
  - categoria;
  - eventos;
  - precio desde;
  - fotos;
  - actualizado.

Fotos:

- Mantener `Portada` como concepto, no `cover`.
- Botones:
  - `Usar como portada`
  - `Quitar`
- Si se usan iconos, mantener texto en acciones de foto porque afectan contenido publicado.

## Menu MVP

Activos recomendados:

- `Mi empresa`
- `Mis servicios`

Decision sobre `Inicio`:

- No recomiendo crear `Inicio` como vista nueva para MVP.
- Si se usa visualmente por fidelidad a la referencia, debe ser solo alias de resumen superior del panel y no una feature adicional.
- Recomendacion final para Web Dev: omitir `Inicio` como item activo en esta ronda, o mostrarlo como `Resumen` solo si apunta a contenido ya existente.

Visibles deshabilitados con badge `Proximamente`:

- `Mensajes`
- `Configuracion`
- `Ayuda/contacto`
- `Metricas`
- `Planes`
- `Reportes`

Nota UX:

- Si se incluye bloque de ayuda abajo del sidebar, `Ayuda/contacto` puede ser accion visible no deshabilitada siempre que solo abra contacto simple o mailto existente. Si requiere feature nueva, dejar `Proximamente`.

Copy menu:

```text
Mi empresa
Mis servicios
Mensajes · Proximamente
Configuracion · Proximamente
Metricas · Proximamente
Planes · Proximamente
Reportes · Proximamente
```

## Copy sugerido

Header:

```text
Panel empresa
Carga tus servicios
Completa la informacion que quieres mostrar a clientes cuando tu servicio este publicado.
```

Resumen:

```text
Empresa
Servicios
Plan actual
Perfil empresa
```

CTA:

```text
Cargar servicio
Guardar y enviar
Ver publico
Editar
Desactivar
Volver a la pagina publica
Cerrar sesion
```

Ayuda sidebar:

```text
¿Necesitas ayuda?
Estamos aqui para ayudarte a destacar tu negocio.
Contactanos
```

Estados:

```text
En carga
Recibido
Publicado
Necesita ajuste
Inactivo
Proximamente
```

Mensajes:

```text
Tu informacion fue recibida.
Este servicio ya esta publicado. Editalo si necesitas actualizarlo.
Completa los datos principales y las fotos que veran tus clientes.
```

## Pantallas incluidas

Incluido para Web Dev en una tarea posterior:

- `panel.html`
- `panel.css`
- ajustes pequenos en `panel.js` solo si son necesarios para menu/labels/estados ya existentes.
- login/activacion dentro del panel, adaptado visualmente a la misma marca.
- vista o seccion `Mi empresa` basada en datos existentes.
- vista o seccion `Mis servicios` basada en lista/formulario actuales.

## Pantallas excluidas

No incluir en este refresh:

- pagina publica completa;
- admin interno;
- perfil publico de empresa;
- nuevo dashboard de metricas;
- mensajes reales;
- configuracion editable avanzada;
- planes/pagos reales;
- reportes;
- cambios de API, auth, emails o moderacion.

## Riesgos

- Si se copia demasiado literal la referencia, se puede abrir un rediseño mayor y retrasar pre-lanzamiento.
- Si `Inicio` se implementa como vista nueva, puede crear expectativa de dashboard/metricas no incluidas.
- Si se usan fuentes externas sin decision Product, puede haber impacto de rendimiento o privacidad.
- Si el logo se usa desde JPEG de referencia, puede verse poco profesional por resolucion/fondo.
- Si se ocultan estados o acciones existentes por estetica, puede romper claridad operativa del panel.

## Decisiones que debe tomar Product / Architect / Release antes de Web Dev

1. Aprobar si el refresh visual se limita al panel empresa.
2. Confirmar tagline final:
   - recomendado: `Catalogo digital de proveedores para eventos`.
3. Decidir si Web Dev puede cargar una fuente externa o debe usar fallback local/sistema.
4. Confirmar si se debe crear/recrear logo temporal en HTML/CSS o esperar asset final.
5. Decidir `Inicio`:
   - recomendado: no crear vista nueva; usar `Mi empresa` y `Mis servicios` como activos MVP.
6. Confirmar si `Ayuda/contacto` sera accion real simple o item deshabilitado `Proximamente`.

## Siguiente tarea sugerida

Product / Architect / Release debe revisar esta guia en `TASK-204` y aprobar un alcance Web Dev pequeno:

```text
Refresh visual acotado de panel empresa con sidebar, marca PE premium, tokens dorado/negro/fondo calido, tarjetas y botones actualizados, sin features nuevas.
```
