# TASK-238: Web Dev - refresh visual pagina publica y ficha empresa

## Equipo asignado

Web Dev.

## Contexto

`TASK-237` debe transformar la revision visual de Product en una guia implementable.

Product pidio aplicar un estilo mas cercano al panel empresa en la pagina publica y la ficha publica de empresa/proveedor:

- logo izquierdo igual al panel empresa;
- tipografia mas premium, cercana al panel;
- hero/imagen principal mas cuidada;
- ficha publica de empresa con colores/tipografia/estilo alineados;
- no tocar el cintillo/menu superior como funcionalidad.

## Tarea

Implementar el refresh visual acotado de pagina publica y ficha publica siguiendo `TASK-237-HANDOFF.md`.

## Alcance

1. Leer `tasks/TASK-237-HANDOFF.md`.
2. Actualizar pagina publica:
   - logo visible usando `assets/images/logo-punto-evento-cr-panel.png`;
   - tipografia/headings segun guia;
   - hero/imagen principal segun guia;
   - stats, categorias, flujo, cards y secciones principales solo a nivel visual.
3. Actualizar ficha publica de empresa/proveedor:
   - logo/header visual si aplica;
   - tipografia y acentos;
   - galeria/card/datos/CTAs con estilo consistente.
4. Mantener cache busting de `styles.css` / `app.js` si corresponde.
5. Mantener responsive mobile/desktop.

## No tocar

- No cambiar navegacion superior/cintillo salvo usar el logo indicado si ya vive ahi.
- No cambiar comportamiento de busqueda.
- No cambiar endpoints/API.
- No cambiar datos.
- No cambiar admin interno.
- No cambiar panel empresa.
- No cambiar flujo de contacto, WhatsApp o solicitud.
- No agregar dependencias pesadas ni fuentes externas sin justificar.

## Verificacion

- Pagina publica carga en desktop y mobile sin overflow.
- Ficha publica de empresa/proveedor carga en desktop y mobile sin overflow.
- Logo publico coincide con el logo aprobado del panel empresa.
- Tipografia de headings se percibe alineada al panel.
- CTAs siguen visibles y funcionales.
- Busqueda/listado/perfil siguen funcionando.
- `git diff --check -- index.html styles.css app.js` OK.
- Si se toca JS: `node --check app.js` OK.

## Handoff esperado

Crear `tasks/TASK-238-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Asset de logo usado.
- Versiones/cache busting.
- Evidencia local desktop/mobile.
- Riesgos.
- Recomendacion para QA `TASK-239`.
