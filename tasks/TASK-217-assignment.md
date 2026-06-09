# TASK-217: Web Dev - renombrar marca visible a Punto Evento CR

## Equipo asignado

Web Dev.

## Contexto

Product decidio cambiar el nombre visible de la marca de `Punto Evento` a `Punto Evento CR`.

Motivo:

- `CR` especifica Costa Rica.
- Se detectaron paginas similares con nombre cercano a `Punto Evento`.
- La marca necesita diferenciarse mejor antes de primeras empresas reales.

Esta tarea debe iniciar despues de cerrar el P1 visual actual del panel empresa (`TASK-213`/`TASK-214`).

## Tarea

Actualizar el nombre visible en superficies frontend estaticas para que la marca sea `Punto Evento CR`.

## Alcance

1. Buscar usos visibles de `Punto Evento` en:
   - `index.html`;
   - `app.js`;
   - `panel.html`;
   - `panel.js`;
   - `admin.html`;
   - `admin.js`;
   - CSS solo si hay contenido textual o alt/title relacionado;
   - assets/metadata estaticos si aplica.
2. Cambiar texto visible, titulos, `alt`, `aria-label`, `title`, metadata y headings relevantes a `Punto Evento CR`.
3. Mantener la frase/tagline aprobada salvo que necesite incluir la marca:
   - `Catalogo digital de proveedores para eventos`.
4. Si el logo JPEG incluye texto interno `Punto Evento`, no editar la imagen en esta tarea; documentarlo como pendiente de asset final.
5. Actualizar cache busting de frontend si corresponde.

## No tocar

- No cambiar backend/API ni templates de email en esta tarea.
- No cambiar rutas, slugs, dominios, nombres de tablas, nombres de funciones ni keys de storage.
- No redisenar pagina publica, admin ni panel.
- No modificar el logo raster si requiere edicion grafica.
- No cambiar copy legal o fiscal inexistente.

## Verificacion

- Busqueda textual local confirma que los textos visibles frontend usan `Punto Evento CR` donde corresponde.
- Pagina publica carga y muestra `Punto Evento CR`.
- Panel empresa carga y muestra `Punto Evento CR` en marca/titulos/labels relevantes.
- Admin interno carga y muestra `Punto Evento CR` donde aplique.
- No hay cambios funcionales en busqueda, login, servicios, admin ni contacto.

## Handoff esperado

Crear `tasks/TASK-217-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Lista de lugares actualizados.
- Lista de usos no cambiados con motivo, si quedan.
- Verificacion local.
- Recomendacion para QA `TASK-219`.
