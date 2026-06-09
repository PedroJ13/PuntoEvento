# TASK-202: QA - revalidacion Azure ajustes cliente 2026-06-03 post-deploy

## Equipo asignado

QA.

## Contexto

`TASK-200` no aprobo porque los cambios `TASK-193` a `TASK-198` no estaban desplegados. Despues de `TASK-201`, QA debe repetir la validacion integrada sobre Azure.

## Tarea

Revalidar en Azure el bloque de hallazgos cliente 2026-06-03 ya desplegado.

## Alcance

1. Confirmar que Azure sirve:
   - `index.html` con `app.js?v=27` y `styles.css?v=20`;
   - `panel.html` con `panel.js?v=7`, `panel.css?v=8`, `styles.css?v=20`;
   - `admin.html` con `admin.js?v=18`, `admin.css?v=13`, `styles.css?v=20`;
   - backend email actualizado de `TASK-198`.
2. Validar pagina publica:
   - CTA `Contactar`;
   - WhatsApp cuando hay telefono disponible;
   - fallback email/formulario;
   - categorias/atajos de servicios;
   - foco en resultados al filtrar.
3. Validar panel empresa:
   - lenguaje simple;
   - `Portada`;
   - `Guardar y enviar` crea/guarda y envia correctamente a pendiente.
4. Validar admin:
   - empresa pendiente vs empresa aprobada con servicios pendientes;
   - acciones correctas por estado;
   - feedback especifico;
   - navegacion legacy/demo no visible en flujo principal.
5. Validar emails funcionales posibles:
   - activacion/aprobacion;
   - contacto/cotizacion;
   - internos de registro/servicio si QA/Product puede observar mailbox.
6. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No aprobar go/no-go final; entregar recomendacion.
- No publicar secretos ni tokens.
- No modificar datos reales fuera de entidades QA controladas.

## Verificacion

- Prueba desktop y mobile.
- Evidencia con URLs, timestamp y versiones.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-202-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia de assets/versiones.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion go/no-go para Product / Architect / Release.

