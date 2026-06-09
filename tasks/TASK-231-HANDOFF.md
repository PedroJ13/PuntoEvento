# TASK-231-HANDOFF: Guia de paleta global Punto Evento CR

Equipo: Diseno UX  
Fecha: 2026-06-04  
Estado: completado como guia, sin cambios de codigo

## Resumen UX

El panel empresa ya establecio la direccion premium de `Punto Evento CR`: negro profundo, dorado sobrio, fondos claros calidos y tarjetas blancas/calidas. La recomendacion es extender esa paleta a pagina publica, admin interno y emails solo por color, sin cambiar layout, componentes, rutas ni flujos.

Objetivo:

- Que todas las superficies se sientan de la misma marca.
- Quitar dependencia visual del teal como color principal.
- Mantener contraste, lectura y estados operativos claros.
- No abrir un redisenio profundo antes del pre-lanzamiento controlado.

## Referencia revisada

Fuente principal:

```text
panel.css
```

Superficies revisadas:

```text
styles.css
admin.css
api/shared/email.js
```

## Paleta / tokens recomendados

Usar estos tokens como fuente comun de color para `styles.css`, `admin.css` y estilos inline de emails.

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

Equivalencias desde la paleta anterior:

```text
--ink -> --brand-ink
--muted -> --brand-muted
--line -> --brand-line
--soft -> --brand-surface-muted
--paper -> --brand-surface
--teal -> --brand-ink para CTAs principales
--teal-dark -> --brand-ink-soft o --brand-gold-dark segun contexto
--coral -> --brand-error
--amber -> --brand-gold
--leaf -> --brand-success
--blue -> evitar como color de marca principal; usar solo si existe razon funcional
```

## Aplicacion por superficie

## Pagina publica (`index.html` / `styles.css`)

Alcance recomendado:

- Solo color.
- No cambiar layout de home, buscador, cards, ficha publica ni drawer.
- No cambiar copy, navegacion ni flujo de cotizacion.

Aplicacion:

- Fondo general: `--brand-bg` o gradiente sutil hacia `--brand-surface`.
- Superficies/cards: `--brand-surface`.
- Secciones suaves/bandas: `--brand-surface-muted`.
- Texto principal: `--brand-ink`.
- Texto secundario: `--brand-muted`.
- Bordes: `--brand-line`.
- CTAs principales: fondo `--brand-ink`, texto blanco.
- Hover CTA principal: `--brand-ink-soft`.
- Botones secundarios: fondo `--brand-gold-soft`, texto `--brand-ink`.
- Botones ghost: fondo `--brand-surface`, borde `--brand-line`, texto `--brand-ink`.
- Eyebrows/acentos: `--brand-gold-dark`.
- Precio destacado: `--brand-gold-dark` o `--brand-ink`, no teal.
- Focus ring: `rgba(185, 147, 75, 0.26)`.

Hero:

- Mantener imagen actual.
- Cambiar overlay solo si se necesita legibilidad:
  - recomendado: `rgba(23, 25, 29, 0.72)` hacia transparente.
- No usar dorado como overlay grande.

Tags/badges:

- `Servicio publicado` / `Verificado`: success suave.
- `Precio`: gold suave.
- Planes/destacados: gold suave con texto ink/gold-dark.

Drawer de cotizacion:

- Fondo `--brand-surface`.
- CTA `Enviar solicitud`: `--brand-ink`.
- Mensajes success/error/warning segun tokens de estado.

## Admin interno (`admin.html` / `admin.css`)

Alcance recomendado:

- Solo color.
- Mantener estructura actual de login, tabs, expediente, cards y acciones.
- Admin debe priorizar claridad operativa sobre lujo visual.

Aplicacion:

- Fondo admin: `--brand-bg`.
- Login card, toolbar, tabs, expediente, cards: `--brand-surface`.
- Fondos internos/metadata: `--brand-surface-muted`.
- Texto principal: `--brand-ink`.
- Texto secundario: `--brand-muted`.
- Bordes: `--brand-line`.
- Tabs activos: fondo `--brand-surface`, texto `--brand-ink`, borde/sombra suave.
- Tabs inactivos: texto `--brand-muted`, fondo transparente o `--brand-surface-muted`.
- Nota admin / dependencia: usar warning o error segun severidad, no teal.

Acciones admin:

- Accion primaria/aprobar: mantener success, no dorado.
- Rechazar: error.
- Pendiente/advertencias: warning.
- Acciones neutrales: ink o ghost.

Estados admin:

```text
pending / pending review -> warning-bg + warning
approved / published -> success-bg + success
rejected -> error-bg + error
draft -> disabled-bg + ink-soft
inactive -> disabled-bg + muted/ink-soft
error -> error
success -> success
warning -> warning
```

Importante:

- No usar `--brand-gold` para aprobar o rechazar; el dorado es marca/acento, no estado.
- Admin debe mostrar estados por texto + color.

## Emails (`api/shared/email.js`)

Alcance recomendado para `TASK-233`:

- Agregar estilo inline minimo a templates existentes.
- No cambiar asuntos, destinatarios, payloads ni logica de envio.
- Mantener compatibilidad con clientes de correo.

Estructura visual recomendada:

- Contenedor externo:
  - background `#f8f5ef`;
  - padding `24px`;
  - font-family `Arial, sans-serif` o system-safe.
- Card:
  - background `#fffdf8`;
  - border `1px solid #e4dacb`;
  - border-radius `12px`;
  - padding `24px`;
  - color `#17191d`.
- Header:
  - texto `Punto Evento CR`;
  - color `#17191d`;
  - acento/borde superior `#b9934b`.
- H2:
  - color `#17191d`;
  - margin controlado.
- Links/CTA:
  - fondo `#17191d`;
  - texto blanco;
  - border-radius `8px`;
  - padding `10px 14px`;
  - display inline-block.
- Tablas:
  - label con fondo `#f3eee6`;
  - border `1px solid #e4dacb`;
  - texto `#17191d` / `#6f6a62`.

Colores inline permitidos:

```text
background page: #f8f5ef
surface: #fffdf8
surface muted: #f3eee6
text: #17191d
muted: #6f6a62
line: #e4dacb
accent: #b9934b
cta: #17191d
success: #2f6b4f
warning: #8b641d
error: #a44735
```

No recomendado en emails:

- Gradientes.
- Sombras fuertes.
- Fondos negros grandes.
- Texto dorado sobre fondo claro si es pequeño.
- Depender de fuentes web.

## Colores que no deben usarse si reducen contraste

Evitar:

- `--brand-gold` como texto pequeño sobre `--brand-bg` o `--brand-surface`.
- `--brand-disabled` como texto normal o label importante.
- Blanco sobre `--brand-gold-soft`.
- Dorado sobre blanco para botones principales.
- Error/success/warning solo por color sin texto.
- Teal anterior como color principal de CTAs, porque rompe continuidad con el panel premium.

Uso seguro:

- `--brand-gold-dark` para eyebrow, iconos pequeños y texto acento.
- `--brand-gold` para lineas, iconos grandes, detalles y highlights no criticos.
- `--brand-ink` para botones principales y texto de alto contraste.

## Recomendacion para Web Dev TASK-232

Implementar cambio acotado de color:

1. Agregar tokens `--brand-*` en `:root` de `styles.css` o mapear los tokens actuales a la nueva paleta.
2. Actualizar pagina publica:
   - botones;
   - fondos;
   - bandas;
   - cards;
   - badges;
   - focus rings;
   - drawer.
3. Actualizar admin:
   - fondo;
   - cards;
   - tabs;
   - estados;
   - botones;
   - mensajes.
4. No cambiar layout, nombres de clases, flujo, copy ni componentes.
5. Mantener `panel.css` como referencia y evitar regresiones visuales del panel.
6. Subir cache busting solo en archivos tocados.

Validacion local esperada para Web Dev:

- Desktop/mobile pagina publica.
- Desktop/mobile admin.
- Contraste visible en botones, labels, tabs y estados.
- Estados admin siguen distinguibles por texto y color.
- Cotizacion/contacto no pierde jerarquia.

## Recomendacion para Backend/API TASK-233

Implementar estilo inline minimo en `api/shared/email.js`:

1. Crear helper simple de wrapper visual para emails, si Web Dev/Product lo aprueba.
2. Aplicar colores inline de la guia.
3. Mantener asuntos y contenido funcional.
4. No cambiar proveedor ACS, destinatarios, replyTo ni payload.
5. No agregar logo raster en email para esta ronda, salvo decision explicita Product; texto `Punto Evento CR` es suficiente.

Validacion esperada:

- HTML generado conserva contenido actual.
- Texto plano derivado por `htmlToText` sigue legible.
- Links CTA siguen presentes.
- No se introducen dependencias externas.

## Riesgos

- Si se aplica dorado como color principal de texto o boton, puede bajar contraste y verse decorativo en vez de profesional.
- Si admin adopta demasiado estilo premium, puede perder claridad operativa.
- Si emails usan estilos complejos, algunos clientes de correo pueden renderizar mal.
- Si se cambian componentes junto con colores, el alcance se convierte en redisenio y aumenta riesgo QA.
- Si se elimina completamente la semantica de estados por colores success/warning/error, admin y panel pueden volverse confusos.

## Siguiente tarea sugerida

Continuar con:

```text
TASK-232 Web Dev: aplicar paleta global a pagina publica y admin solo con colores.
TASK-233 Backend/API: alinear colores minimos de emails con estilos inline.
```
