# TASK-247: QA - revalidar ajustes visuales publicos y login admin en Azure

## Equipo asignado

QA.

## Contexto

`TASK-246` debe desplegar a Azure los ajustes visuales publicos y el manejo de credenciales admin invalidas.

## Tarea

Revalidar en Azure el bloque completo.

## Alcance

1. Leer:
   - `tasks/TASK-242-HANDOFF.md`;
   - `tasks/TASK-243-HANDOFF.md`;
   - `tasks/TASK-244-HANDOFF.md`;
   - `tasks/TASK-246-HANDOFF.md`.
2. Validar en Azure:
   - `/`;
   - `/#bodas`;
   - ficha publica con proveedor de nombre largo;
   - `/admin.html`;
   - `/panel.html`;
   - `/api/public/services?limit=1`.
3. Validar desktop y mobile.
4. Confirmar:
   - nombre largo no rompe panel;
   - home al 100% se ve equilibrada;
   - logo publico mas grande sin corte;
   - opciones removidas no aparecen en nav publica;
   - admin con credenciales invalidas muestra mensaje inline;
   - no aparece prompt nativo del navegador;
   - panel/admin no tienen regresiones basicas.

## No tocar

- No implementar fixes.
- No cambiar datos reales.
- No limpiar Azure.
- No cambiar app settings.

## Verificacion

- Sin P0/P1.
- Observaciones P2/P3 clasificadas.
- Evidencia de ausencia de prompt nativo o descripcion clara del metodo usado.
- URLs y assets/versiones documentadas.

## Handoff esperado

Crear `tasks/TASK-247-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- URLs validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion de cierre para Product / Architect / Release.
