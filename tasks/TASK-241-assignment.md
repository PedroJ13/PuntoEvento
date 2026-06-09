# TASK-241: QA - revalidar refresh visual publico en Azure

## Equipo asignado

QA.

## Contexto

`TASK-240` debe desplegar el refresh visual publico a Azure.

## Tarea

Revalidar en Azure el refresh visual de pagina publica y ficha publica de empresa/proveedor.

## Alcance

1. Leer:
   - `tasks/TASK-237-HANDOFF.md`;
   - `tasks/TASK-238-HANDOFF.md`;
   - `tasks/TASK-240-HANDOFF.md`.
2. Validar en Azure:
   - `/`;
   - una ruta/listado de busqueda;
   - una ficha publica de empresa/proveedor;
   - `/api/public/services?limit=1`.
3. Validar desktop y mobile.
4. Confirmar que:
   - logo publico coincide con panel empresa;
   - tipografia/hero/ficha publica se alinean a guia;
   - CTAs siguen funcionales;
   - no hay overflow;
   - panel y admin no tienen regresiones basicas.

## No tocar

- No implementar fixes.
- No cambiar datos reales.
- No limpiar Azure.
- No cambiar app settings.

## Verificacion

- Sin P0/P1 visuales o funcionales.
- Busqueda/listado/perfil/contacto siguen accesibles.
- Menu superior/cintillo no debe evaluarse contra las imagenes de referencia, porque Product lo excluyo.
- Observaciones P2/P3 quedan clasificadas.

## Handoff esperado

Crear `tasks/TASK-241-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- URLs validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion de cierre para Product / Architect / Release.
