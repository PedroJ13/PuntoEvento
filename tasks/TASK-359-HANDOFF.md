# TASK-359 HANDOFF - QA local visual publico post-logica aprobacion

Equipo: QA
Fecha: 2026-06-12
Ambiente: local con servidor temporal `http://127.0.0.1:<puerto>` y API mock local
Tarea validada: `tasks/TASK-359-assignment.md`

## Resultado

**Aprobado para deploy con observaciones P3.**

Los ajustes publicos posteriores al cierre de la logica de aprobacion pasan validacion local/estructural:

- comparacion/paquetes ocultos;
- CTAs nuevos claros para contacto directo y cotizacion;
- links visibles prefieren rutas limpias donde existe equivalente;
- hashes legacy principales siguen funcionando;
- desktop y mobile sin overflow ni botones cortados en las rutas revisadas.

## Precondiciones

Existen los handoffs requeridos:

- `tasks/TASK-356-HANDOFF.md`
- `tasks/TASK-357-HANDOFF.md`
- `tasks/TASK-358-HANDOFF.md`

## Ambiente local

- Repo root: `C:/Users/pj13e/Digital Products/Punto Evento`
- Servidor temporal Node con fallback a `index.html` para rutas limpias.
- API mock local para:
  - `GET /api/public/services`
  - `GET /api/public/companies/aurisbel-pasteleria-341388`
  - `POST /api/public/leads`
- Viewports:
  - Desktop `1366x768`
  - Mobile `390x844`
- Asset revisado:
  - `index.html` referencia `app.js?v=39`.

## Checks ejecutados

### Estructurales

- `node --check app.js` -> OK
- `rg` sobre `index.html` / `app.js`:
  - no aparece `Comparacion rapida de precios`;
  - no aparece `Paquetes de boda`;
  - no aparece `Elegir servicio`;
  - no aparece `Solicitar cotizacion` / `Solicitar cotización`;
  - no aparece `Enviar por formulario`;
  - aparece `Contactar empresa`;
  - `index.html` referencia `app.js?v=39`.

### Playwright local

Rutas revisadas:

- `/`
- `/#inicio`
- `/#bodas`
- `/#empresas`
- `/#proveedor/aurisbel-pasteleria-341388/queques-personalizados`
- `/proveedores/salones-eventos`
- `/proveedores/catering`
- `/proveedores/fotografia-video`
- `/proveedores/musica-dj`
- `/proveedores/decoracion`
- `/proveedores/pasteleria-reposteria`

Viewports responsive revisados:

- `/` en mobile `390x844`
- `/#bodas` en mobile `390x844`
- `/#proveedor/aurisbel-pasteleria-341388/queques-personalizados` en mobile `390x844`
- `/proveedores/pasteleria-reposteria` en mobile `390x844`

## Resultados por escenario

### 1. Home/publico

**Aprobado.**

- Home carga `200`.
- No hay pagina en blanco.
- No hay errores de consola.
- No aparece `Comparacion rapida de precios`.
- No aparece `Paquetes de boda`.
- No aparece `Elegir servicio`.
- No hay links visibles hacia comparacion/paquetes ocultos.
- Se detectaron 6 links visibles de categorias hacia rutas limpias:
  - `/proveedores/salones-eventos`
  - `/proveedores/catering`
  - `/proveedores/fotografia-video`
  - `/proveedores/musica-dj`
  - `/proveedores/decoracion`
  - `/proveedores/pasteleria-reposteria`

### 2. Cards/listado

**Aprobado.**

- `/#bodas` carga `200`.
- Los cards/listado muestran `Contactar empresa`.
- Los cards/listado muestran `Pedir cotización`.
- El CTA de WhatsApp conserva URL `https://wa.me/...`.
- Al abrir el formulario desde un card, el drawer muestra `Pedir cotización por Queques personalizados`.
- No hay overflow desktop.
- No hay errores de consola.

### 3. Ficha publica

**Aprobado.**

- `/#proveedor/aurisbel-pasteleria-341388/queques-personalizados` carga `200`.
- La ficha muestra el servicio mock `Queques personalizados`.
- La ficha muestra CTAs `Contactar empresa` y `Pedir cotización`.
- No hay pagina en blanco.
- No hay overflow desktop/mobile.
- No hay errores de consola.

### 4. Rutas

**Aprobado.**

Rutas limpias existentes revisadas con `200`, sin pagina en blanco, sin overflow y sin errores de consola:

- `/proveedores/salones-eventos`
- `/proveedores/catering`
- `/proveedores/fotografia-video`
- `/proveedores/musica-dj`
- `/proveedores/decoracion`
- `/proveedores/pasteleria-reposteria`

Hashes legacy principales revisados con `200`, sin pagina en blanco, sin overflow y sin errores de consola:

- `/#inicio`
- `/#bodas`
- `/#empresas`
- `/#proveedor/aurisbel-pasteleria-341388/queques-personalizados`

### 5. Responsive

**Aprobado.**

En mobile `390x844`, sin overflow horizontal ni botones cortados en:

- `/`
- `/#bodas`
- `/#proveedor/aurisbel-pasteleria-341388/queques-personalizados`
- `/proveedores/pasteleria-reposteria`

## Evidencia

Se ejecuto Playwright headless con API mock. Resultado consolidado:

- Todas las rutas revisadas devolvieron `200`.
- `blank=false` en todas las rutas.
- `overflow=false` en todas las rutas.
- `errors=[]` en todas las rutas.
- Home forbidden copy: `ok=true`, `found=[]`.
- Home clean category links: `count=6`, `comparisonLinks=0`.
- Catalog CTAs:
  - `hasContact=true`;
  - `quoteCount=3`;
  - `whatsappHref` empieza con `https://wa.me/506...`;
  - `drawerTitle="Pedir cotización por Queques personalizados"`.
- Profile CTAs:
  - `hasService=true`;
  - `profileContact=2`;
  - `profileQuote=3`.

No se persistieron screenshots porque la evidencia textual/headless cubre los criterios solicitados y no hubo hallazgos visuales.

## P0/P1

No se encontraron P0/P1.

## P2/P3

| Severidad | Hallazgo | Impacto | Recomendacion |
| --- | --- | --- | --- |
| P3 | Validacion fue local con API mock, no Azure. | No bloquea deploy; la tarea era QA local/estructural. | Abrir/ejecutar deploy y QA Azure posterior para confirmar assets servidos, rewrites de Azure Static Web Apps y datos reales. |

## Riesgos o pendientes

- `#bodas`, `#empresas`, `#registro-empresa` y `#proveedor/...` permanecen como hashes por decision de `TASK-358`; no es regresion.
- La validacion de rutas limpias depende de fallback local equivalente al navigation fallback de Azure Static Web Apps; QA Azure debe confirmar despues de deploy.
- No se probaron envios reales de cotizacion; se valido apertura/copy del drawer y endpoint mock porque la tarea no pide integracion Azure.

## Recomendacion

**Aprobar para deploy.**

Siguiente recomendado: `TASK-360` Infra Azure para desplegar `index.html` con `app.js?v=39` y validar versiones/rutas en `https://puntoeventocr.com`; luego `TASK-361` QA Azure.
