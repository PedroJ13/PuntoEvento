# TASK-205: Web Dev - branding base aprobado y refresh panel empresa

## Equipo asignado

Web Dev.

## Contexto

Diseno/UX completo `TASK-203` con una guia visual minima para marca premium y panel empresa. Product / Architect / Release aprobo alcance acotado en `TASK-204`.

Este trabajo es frontend visual/UX. No debe abrir rediseño profundo de pagina publica, admin interno ni perfil publico.

## Tarea

Implementar el refresh visual aprobado en el panel privado de empresas.

## Alcance

1. Usar como referencia:
   - `tasks/TASK-203-HANDOFF.md`;
   - `tasks/TASK-204-HANDOFF.md`;
   - `Reference Images/Propeusta logo e imagen de pagina.jpeg`;
   - `Reference Images/Propuesta Panel de Empresas.jpeg`.
2. Implementar branding base aprobado dentro del panel:
   - paleta negro/dorado/fondo claro calido;
   - tagline `Catalogo digital de proveedores para eventos`;
   - lockup/logo temporal si no hay asset final limpio;
   - tarjetas, botones, inputs, badges y estados segun guia.
3. Rediseñar `panel.html` / `panel.css` con layout de panel privado:
   - sidebar izquierdo desktop;
   - logo arriba;
   - bloque ayuda/contacto visual;
   - acciones superiores `Volver a la pagina publica` y `Cerrar sesion`;
   - area principal clara.
4. Mantener vistas MVP:
   - `Mi empresa`;
   - `Mis servicios`.
5. Mostrar items futuros deshabilitados con `Proximamente`:
   - `Mensajes`;
   - `Configuracion`;
   - `Metricas`;
   - `Planes`;
   - `Reportes`.
6. No crear vista nueva `Inicio`; si hace falta primer estado, usar `Mi empresa` o resumen con datos existentes.
7. Mantener flujos existentes:
   - activacion/login;
   - ver empresa;
   - crear/editar/desactivar servicios;
   - subir fotos;
   - elegir portada;
   - guardar y enviar.
8. Actualizar cache busting de assets si corresponde.

## No tocar

- No cambiar API/backend.
- No cambiar auth, emails, moderacion ni modelos.
- No rediseñar pagina publica.
- No rediseñar admin interno.
- No rediseñar perfil publico de empresa.
- No implementar mensajes, metricas, planes, reportes ni pagos.
- No usar JPEG de referencia como logo productivo si se ve borroso o con fondo no controlado.

## Verificacion

- `panel.html` carga correctamente.
- Login/activacion sigue usable.
- `Mi empresa` y `Mis servicios` son navegables/usables.
- `Cargar servicio`, `Guardar y enviar`, `Editar`, `Desactivar`, `Volver a la pagina publica` y `Cerrar sesion` siguen funcionando.
- Items `Proximamente` no navegan ni parecen rotos.
- Mobile y desktop no tienen overflow ni textos cortados.
- Pagina publica y admin no quedan afectados por cambios de estilos compartidos.

## Handoff esperado

Crear `tasks/TASK-205-HANDOFF.md` con:

- Resumen de implementacion.
- Archivos tocados.
- Decisiones visuales tomadas.
- Versiones/cache busting.
- Verificacion local.
- Riesgos.
- Recomendacion para QA `TASK-206`.

