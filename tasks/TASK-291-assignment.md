# TASK-291: Diseno/UX - especificacion del nuevo listado de servicios y drawer lateral

## Equipo asignado

Diseno/UX.

## Contexto

Product aprobo mejorar la pantalla `Mis servicios` del panel empresa despues de cerrar el P1 de upload/envio directo.

Problema actual:

- Los servicios cargados se ven como bloques de datos poco elegantes.
- Eventos largos rompen la lectura.
- Las acciones quedan pesadas.
- `Cargar servicio` debe convivir mejor con la lista.

Direccion aprobada:

- Listado tipo card horizontal por servicio.
- Portada/thumbnail a la izquierda.
- Estado, titulo, descripcion y metadata resumida al centro.
- Acciones con iconos/botones a la derecha.
- Crear/editar servicio con panel lateral/drawer.
- En mobile, el drawer debe comportarse como pantalla completa.

## Tarea

Definir una especificacion implementable para Web Dev.

## Alcance

Entregar:

1. Layout desktop del listado de servicios.
2. Layout mobile/responsive.
3. Estados de card:
   - `draft`
   - `pending`
   - `published`
   - `rejected`
   - sin portada
4. Metadata resumida:
   - categoria;
   - eventos con truncado tipo `Bodas, Cumpleanos +4`;
   - precio formateado;
   - fotos;
   - actualizado.
5. Acciones:
   - Ver publico;
   - Editar;
   - Desactivar.
6. Drawer lateral para:
   - Cargar servicio;
   - Editar servicio.
7. Reglas de microcopy:
   - `Guardar borrador`;
   - `Enviar servicio`;
   - mensajes claros si falla portada/upload;
   - no mostrar lenguaje tecnico.

## No tocar

- No redisenar sidebar completo.
- No redisenar pagina publica/admin.
- No cambiar contratos API.
- No pedir implementacion de nuevas features fuera del listado/drawer.

## Handoff esperado

Actualizar:

```text
tasks/TASK-291-HANDOFF.md
```

Debe incluir:

- Especificacion lista para Web Dev.
- Reglas responsive.
- Estados/empty/error/loading.
- Riesgos o decisiones pendientes.

