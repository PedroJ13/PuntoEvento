# TASK-070: Web Dev conectar pagina publica a servicios publicados

## Equipo asignado

Frontend / Web Dev.

## Contexto

`TASK-069` aprobo en Azure real los endpoints publicos por servicio:

```text
GET /api/public/services
GET /api/public/companies/{slug}
```

Ya se puede avanzar a que la pagina publica use servicios publicados reales en vez de depender solo de `data/providers.json`.

La pagina publica actual esta visualmente bien y debe conservarse como base. La tarea no es rehacer la home, sino conectar la experiencia a la API publica de servicios.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-067-HANDOFF.md`
- `tasks/TASK-069-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`
- `data/providers.json`
- `data/packages.json`
- `data/categories.json`
- `data/event-types.json`

## Objetivo

Conectar la pagina publica a servicios publicados para que el usuario vea resultados por servicio.

Ejemplo esperado:

```text
Busqueda: mesa dulce
Resultado: Mesa dulce
Empresa: Aurisbel
Acciones: Cotizar servicio / Ver perfil de empresa
Perfil empresa: muestra otros servicios publicados de esa empresa
```

## Alcance funcional

1. Cargar servicios publicados desde:

```text
/api/public/services
```

2. Mantener fallback local/demo:
   - Si la API no responde, usar datos demo existentes.
   - El fallback debe permitir seguir abriendo `index.html` o servidor local sin backend.
   - Mostrar un mensaje/estado discreto si se esta usando demo por fallback.

3. Actualizar la experiencia de resultados:
   - Cards/listados deben representar servicios, no solo empresas.
   - Mostrar nombre del servicio.
   - Mostrar empresa asociada.
   - Mostrar categoria, provincia, precio desde si existe.
   - Usar `coverUrl` real si existe.
   - Boton principal para cotizar ese servicio.
   - Link/boton para ver perfil de empresa.

4. Conectar busqueda/filtros:
   - El formulario de busqueda debe consultar o filtrar por `q`.
   - Categoria/evento/provincia deben mapearse a params API cuando aplique.
   - Si se decide filtrar client-side tras cargar servicios, documentarlo.

5. Conectar perfil empresa:
   - Usar:

```text
/api/public/companies/{slug}
```

   - Mostrar empresa publicada con sus servicios publicados.
   - Si el usuario llega desde un servicio, destacar ese servicio usando `selectedServiceSlug` o slug local.
   - Mantener carrusel/galeria visual cuando existan `coverUrl` y `gallery`.
   - Si la API falla o no hay perfil, usar fallback demo actual sin romper la pagina.

6. Mantener compatibilidad razonable con rutas hash actuales:
   - No romper `#inicio`, `#bodas`, `#proveedor`.
   - Si agregas rutas nuevas, documentarlas en el handoff.

## Criterios de aceptacion

- La home sigue cargando y se ve profesional.
- La pagina publica no queda en blanco si la API falla.
- `GET /api/public/services` se usa cuando esta disponible.
- Resultados representan servicios publicados.
- Perfil empresa muestra multiples servicios publicados.
- Imagenes publicas renderizan cuando existe `coverUrl`.
- No se muestran servicios no publicados si la API los excluye.
- No se exponen campos privados en UI.
- Desktop y mobile siguen sin overflow obvio.
- Consola del navegador sin errores no controlados.

## Reglas de diseno

- No rehacer la home desde cero.
- No convertirla en landing generica.
- Mantener el look actual de Punto Evento.
- Evitar textos largos explicando la funcionalidad dentro de la UI.
- Los estados de carga/error deben ser discretos y utiles.
- Cuidar que cards, botones y titulos no se desborden en mobile.

## Fuera de alcance

- No implementar login de empresa.
- No implementar pagos/ranking.
- No crear endpoints nuevos.
- No cambiar contratos API.
- No tocar admin/panel salvo que sea estrictamente necesario y lo documentes.
- No eliminar fallback demo todavia.

## Verificacion minima

Ejecutar localmente y validar:

- Home.
- Busqueda con texto.
- Listado de bodas/proveedores/servicios segun ruta actual.
- Perfil de empresa.
- Fallback demo si API no esta disponible.
- Responsive basico desktop/mobile.

Si usas dev server, indica URL local.

## Entregable

Crear:

```text
tasks/TASK-070-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Rutas/flows revisados.
- Fuente de datos usada y fallback.
- Validaciones manuales realizadas.
- Screenshots si el entorno lo permite o descripcion visual.
- Riesgos restantes.
- Siguiente tarea recomendada:
  - QA local de pagina publica conectada, o
  - ajuste requerido antes de QA.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-070. Product/Architect debe leer tasks/TASK-070-HANDOFF.md.
```
