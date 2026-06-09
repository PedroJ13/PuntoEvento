# TASK-242: Web Dev - ajustes finales visuales pagina publica y ficha proveedor

## Equipo asignado

Web Dev.

## Contexto

Product envio una revision visual adicional con cinco observaciones:

1. En la ficha publica de proveedor, algunos nombres largos como `Fatima Wedding` se quiebran mal dentro del panel.
2. En la pagina publica, eliminar opciones de navegacion indicadas por Product en las capturas, en todas las paginas donde aparezcan.
3. La pagina publica al 100% debe sentirse mas cercana a como se ve al 80%-90%, con mejor densidad visual.
4. El logo publico debe verse un poco mas grande.
5. Los tipos de letra deben ser consistentes con el panel empresa.

## Tarea

Aplicar ajustes visuales acotados en pagina publica y ficha publica de proveedor.

## Alcance

1. Ficha publica de proveedor:
   - Evitar cortes feos en nombres largos de empresa.
   - Ajustar ancho del panel, `font-size`, `line-height`, `word-break`, `text-wrap` o `clamp()` segun corresponda.
   - Mantener look premium sin que el nombre invada otros contenidos.
2. Navegacion publica:
   - Remover las opciones publicas indicadas por Product en las capturas, especialmente `Servicios` y `Proveedor`, de todas las paginas/superficies publicas donde aparezcan.
   - No eliminar rutas/hash internas si siguen siendo necesarias para funcionamiento.
   - Mantener `Inicio`, `Buscar`, `Empresas` y CTA principal si corresponden al flujo actual.
3. Home/hero:
   - Ajustar escala/densidad para que al 100% se vea mas parecido al estado percibido en 80%-90%.
   - Reducir exceso de escala en hero/titulo/espaciado si aplica.
   - Mantener buscador visible sin overflow.
4. Logo publico:
   - Hacerlo ligeramente mas grande sin romper header ni mobile.
   - Seguir usando `assets/images/logo-punto-evento-cr-panel.png`.
5. Tipografia:
   - Alinear familias y pesos con el panel empresa tanto como sea posible.
   - Evitar serif gigante donde cause cortes; usar `clamp()` o variantes responsive.
6. Actualizar cache busting de `styles.css` / `index.html` si corresponde.

## No tocar

- No cambiar backend/API.
- No cambiar admin interno salvo tarea separada.
- No cambiar panel empresa.
- No cambiar flujo de busqueda, contacto, WhatsApp, solicitud ni registro.
- No cambiar datos ni rutas funcionales.
- No redisenar desde cero.

## Verificacion

- Home al 100% se ve mas compacta/equilibrada, sin requerir zoom 80%-90%.
- Logo publico mas grande, sin cortar ni crecer demasiado el header.
- `Servicios` y `Proveedor` ya no aparecen como opciones visibles de nav publica donde Product pidio eliminarlas.
- Ficha publica con nombres largos no rompe el panel.
- Desktop `1440x900`, `1920x1080` y mobile `390x844` sin overflow horizontal.
- `#bodas` y ficha publica siguen funcionando.
- Drawer de contacto/cotizacion sigue abriendo.
- `git diff --check -- index.html styles.css app.js` OK.
- Si se toca JS: `node --check app.js` OK.

## Handoff esperado

Crear `tasks/TASK-242-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Evidencia desktop/mobile.
- Como se resolvio el nombre largo.
- Que opciones de nav se removieron.
- Riesgos.
- Recomendacion para QA `TASK-245`.
