# TASK-208: QA - revalidar refresh visual panel empresa post-deploy

## Equipo asignado

QA.

## Contexto

`TASK-206` no aprobo Azure porque el refresh visual de `TASK-205` no estaba desplegado. Despues de `TASK-207`, QA debe repetir la validacion sobre Azure real.

## Tarea

Revalidar en Azure el refresh visual del panel empresa ya desplegado.

## Alcance

1. Confirmar assets:
   - `/panel.html` contiene `panel.css?v=9`;
   - `/panel.html` contiene `panel.js?v=8`.
2. Validar panel empresa:
   - login recurrente;
   - activacion por invite si hay token disponible;
   - layout desktop con sidebar;
   - mobile/responsive sin overflow;
   - `Mi empresa`;
   - `Mis servicios`;
   - crear servicio;
   - editar servicio;
   - desactivar servicio;
   - upload real y `Portada` si el entorno lo permite;
   - `Guardar y enviar`;
   - `Volver a la pagina publica`;
   - `Cerrar sesion`.
3. Validar items futuros:
   - `Mensajes`, `Configuracion`, `Metricas`, `Planes`, `Reportes`;
   - visibles como `Proximamente`;
   - no navegables/no rotos.
4. Regresion minima:
   - pagina publica carga;
   - admin interno carga;
   - no hay rotura visual obvia por CSS compartido.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No aprobar go/no-go comercial final; entregar recomendacion.
- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.

## Verificacion

- Evidencia desktop y mobile.
- Versiones/assets observados.
- Flujos principales siguen funcionando.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-208-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Product / Architect / Release.

