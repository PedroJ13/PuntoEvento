# TASK-268: Web Dev - reforzar jerarquia servicio primero en pagina publica

## Equipo asignado

Web Dev.

## Contexto

El modelo correcto de Punto Evento CR es `Empresa -> Servicios`, pero la busqueda publica debe mostrar resultados por servicio con contexto de empresa. La revision UX del 2026-06-08 recomienda reforzar visualmente esa jerarquia para evitar que el usuario crea que compara solo empresas.

Documentos base:

- `tasks/DISENO_UX_WEB_PAGE_FLOWS_REVIEW_2026-06-08.md`
- `docs/DATA_MODEL.md`
- `docs/WEB_PAGE_FLOWS.md`

## Tarea

Revisar y ajustar la jerarquia visual/copy de resultados publicos y ficha publica para que el servicio sea el foco principal y la empresa sea contexto.

## Alcance

1. En tarjetas/listados publicos:
   - titulo principal = servicio;
   - subtitulo/contexto = empresa;
   - categoria, ubicacion y precio deben apoyar la decision sin competir con el titulo.
2. En ficha publica:
   - el primer bloque debe dejar claro el servicio seleccionado;
   - mostrar empresa, categoria, ubicacion y CTA cerca del servicio.
3. Agregar o ajustar microcopy tipo:
   - `Estas cotizando este servicio de {empresa}.`
4. Confirmar que mobile mantiene identidad + servicio + CTA antes de contenido secundario largo.

## No tocar

- No cambiar endpoints publicos.
- No cambiar filtros ni busqueda.
- No redisenar pagina publica completa.
- No cambiar admin ni panel empresa.
- No agregar datos demo.

## Verificacion

- Home/resultados con catalogo vacio sigue controlado.
- Con datos publicados, tarjetas son servicio-first.
- Ficha publica mobile muestra servicio/empresa/CTA sin obligar a bajar por una galeria larga.
- No hay overflow de nombres largos.
- `git diff --check` sobre archivos tocados.

## Handoff esperado

Crear `tasks/TASK-268-HANDOFF.md` con:

- Archivos modificados.
- Evidencia desktop/mobile o descripcion verificable.
- Confirmacion de no cambios API.
- Riesgos visuales pendientes si aplica.
