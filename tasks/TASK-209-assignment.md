# TASK-209: Web Dev - ajustes finales panel empresa

## Equipo asignado

Web Dev.

## Contexto

El refresh visual del panel empresa fue aprobado en `TASK-208`, pero Product pidio tres ajustes finales de ultimo momento antes de seguir con primeras empresas:

- cambiar `Tipos de evento` de tarjetas/checkboxes a una lista de seleccion multiple similar al select de `Categoria`;
- usar la imagen de referencia del logo en el bloque de marca del panel;
- agregar iconos sencillos de linea blanca al menu lateral.

Este ajuste aplica solo al panel privado de empresas.

## Tarea

Implementar ajustes visuales y de formulario en `panel.html`, `panel.css` y `panel.js`, sin modificar API ni otros flujos.

## Alcance

1. Reemplazar el bloque actual de `Tipos de evento` del formulario de servicio:
   - quitar la grilla de tarjetas/checkboxes;
   - usar una lista/select de seleccion multiple;
   - mantener la capacidad de seleccionar uno o varios tipos de evento;
   - cargar opciones desde el catalogo actual de tipos de evento;
   - al editar un servicio, preseleccionar los tipos existentes;
   - al guardar/enviar, persistir el array `eventTypes` como hoy.
2. Mantener `Categoria` como seleccion unica, sin cambiar su contrato.
3. Ajustar el bloque de marca/logo del panel para usar como referencia:
   - `Reference Images/Propeusta logo e imagen de pagina.jpeg`.
4. Si se usa el JPEG directamente, cuidar que no se vea borroso, recortado mal ni con fondo incoherente. Si no es apto como asset productivo, crear una version visual simple derivada en CSS/HTML o asset local documentado.
5. Agregar iconos sencillos de linea blanca al menu lateral:
   - `Mi empresa`: icono tipo edificio/fabrica/empresa;
   - `Mis servicios`: icono tipo herramienta/servicio;
   - futuros items pueden usar iconos simples coherentes si no aumenta riesgo;
   - evitar ilustraciones complejas.
6. Mantener items futuros como `Proximamente` y no navegables.
7. Actualizar cache busting de `panel.css` / `panel.js` si corresponde.

## No tocar

- No cambiar backend/API.
- No cambiar auth, emails, moderacion, uploads ni modelos.
- No redisenar pagina publica.
- No redisenar admin interno.
- No redisenar perfil publico.
- No abrir nuevo sistema de iconos complejo.
- No implementar mensajes, metricas, planes, reportes ni pagos.

## Verificacion

- `Tipos de evento` permite seleccionar multiples opciones.
- Crear servicio guarda los tipos seleccionados.
- Editar servicio muestra los tipos previamente seleccionados.
- Validacion sigue exigiendo al menos un tipo de evento.
- Logo/marca se ve limpio en desktop y mobile.
- Menu lateral muestra iconos simples sin romper alineacion.
- `Mi empresa`, `Mis servicios`, `Guardar`, `Guardar y enviar`, `Editar`, `Desactivar`, `Volver a la pagina publica` y `Cerrar sesion` siguen funcionando.
- Sin overflow ni textos cortados en mobile.

## Handoff esperado

Crear `tasks/TASK-209-HANDOFF.md` con:

- Resumen de cambios.
- Archivos tocados.
- Versiones/cache busting.
- Decision tomada sobre uso directo o derivado del JPEG de logo.
- Verificacion local.
- Riesgos.
- Recomendacion para QA `TASK-210`.
