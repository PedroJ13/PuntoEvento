# TASK-206: QA - validar refresh visual panel empresa

## Equipo asignado

QA.

## Contexto

Web Dev debe implementar en `TASK-205` el refresh visual aprobado para el panel privado de empresas. QA debe validar que el rediseño mejora la presentacion sin romper flujos MVP existentes.

## Tarea

Validar el panel empresa actualizado y una regresion minima de superficies no incluidas.

## Alcance

1. Validar panel empresa:
   - login/activacion;
   - layout desktop con sidebar;
   - layout mobile/responsive;
   - `Mi empresa`;
   - `Mis servicios`;
   - cargar servicio;
   - editar servicio;
   - desactivar servicio;
   - subir fotos/elegir portada si el entorno lo permite;
   - `Guardar y enviar`;
   - `Volver a la pagina publica`;
   - `Cerrar sesion`.
2. Validar items futuros:
   - `Mensajes`;
   - `Configuracion`;
   - `Metricas`;
   - `Planes`;
   - `Reportes`;
   - deben verse deshabilitados o `Proximamente`;
   - no deben navegar ni parecer funciones rotas.
3. Validar regresion minima:
   - pagina publica carga;
   - admin interno carga;
   - no hay rotura visual obvia por CSS compartido.
4. Clasificar hallazgos P0/P1/P2/P3.

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

Crear `tasks/TASK-206-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Bugs clasificados.
- Riesgos aceptables.
- Recomendacion para Product / Architect / Release.

