# TASK-197: Web Dev - categorias publicas y foco en resultados

## Equipo asignado

Web Dev.

## Contexto

El cliente observo que la pagina publica mezcla tipos de evento con categorias de servicios. Para MVP conviene que los atajos/filtros publicos usen categorias reales de servicios, alineadas con el formulario del panel empresa. Tambien se observo que al filtrar se pierde foco y la pagina vuelve arriba.

## Tarea

Alinear filtros/atajos publicos con categorias de servicios y mejorar continuidad al aplicar filtros.

## Alcance

1. Revisar categorias usadas por panel empresa y pagina publica.
2. Usar categorias de servicios para atajos/filtros publicos donde hoy aparezcan tipos de evento confusos.
3. Mantener tipos de evento solo como ocasion/contexto si aun aportan, no como categoria principal.
4. Al aplicar filtros o busqueda, mantener foco/scroll en resultados.
5. Validar estado vacio.
6. Validar desktop y mobile.

## No tocar

- No redisenar la home completa.
- No cambiar el modelo de datos sin decision Product.
- No eliminar busqueda libre.
- No cambiar backend en esta tarea.

## Verificacion

- Atajos publicos corresponden a categorias de servicios.
- Al filtrar, el usuario queda en resultados o cerca de resultados.
- Estado vacio sigue siendo claro.
- No hay saltos visuales raros en mobile.

## Handoff esperado

Crear `tasks/TASK-197-HANDOFF.md` con:

- Categorias usadas.
- Comportamiento de scroll/foco.
- Pantallas probadas.
- Riesgos o decisiones pendientes.
