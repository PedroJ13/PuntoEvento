# TASK-236: QA - revalidar paleta global en Azure

## Equipo asignado

QA.

## Contexto

`TASK-235` debe desplegar los ajustes de paleta global a Azure. El objetivo es validar coherencia visual de color sin redisenio profundo.

## Tarea

Revalidar en Azure la pagina publica, admin, panel empresa y emails si hay evidencia disponible.

## Alcance

1. Leer:
   - `tasks/TASK-231-HANDOFF.md`;
   - `tasks/TASK-232-HANDOFF.md`;
   - `tasks/TASK-233-HANDOFF.md`;
   - `tasks/TASK-235-HANDOFF.md`.
2. Validar en Azure:
   - `/`;
   - `/panel.html`;
   - `/admin.html`;
   - `/api/public/services?limit=1`.
3. Validar pagina publica en desktop/mobile.
4. Validar admin en desktop/mobile, al menos login y superficies visibles con credencial disponible.
5. Validar panel empresa como regresion visual minima.
6. Si hay evidencia de email, revisar que los colores/marca rendericen correctamente.

## No tocar

- No implementar fixes.
- No modificar datos reales.
- No limpiar Azure.
- No cambiar app settings.

## Verificacion

- Sin P0/P1 visuales.
- Colores coherentes con panel empresa.
- Contraste suficiente.
- No hay overflow o textos cortados.
- Flujos principales siguen accesibles.
- Observaciones P2/P3 quedan clasificadas.

## Handoff esperado

Crear `tasks/TASK-236-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- URLs validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion de cierre para Product / Architect / Release.
