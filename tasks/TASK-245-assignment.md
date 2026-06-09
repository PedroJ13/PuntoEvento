# TASK-245: QA - validar ajustes visuales publicos y login admin local/estructural

## Equipo asignado

QA.

## Contexto

`TASK-242` debe ajustar detalles visuales de pagina publica/ficha publica. `TASK-243` y `TASK-244` deben evitar el prompt nativo del navegador cuando fallan credenciales admin y mostrar mensaje inline.

## Tarea

Validar local/estructuralmente ambos frentes antes de deploy.

## Alcance

1. Leer:
   - `tasks/TASK-242-HANDOFF.md`;
   - `tasks/TASK-243-HANDOFF.md`;
   - `tasks/TASK-244-HANDOFF.md`.
2. Validar pagina publica:
   - home al 100%;
   - `#bodas`;
   - ficha publica con nombre largo;
   - logo publico;
   - nav publica sin opciones removidas;
   - drawer de contacto/cotizacion.
3. Validar admin:
   - credenciales invalidas;
   - ausencia de prompt nativo del navegador;
   - mensaje inline claro;
   - credenciales validas si QA tiene credencial local/controlada;
   - modo demo local.
4. Validar regresion minima de panel empresa.
5. Validar desktop y mobile.

## No tocar

- No implementar fixes.
- No desplegar.
- No cambiar credenciales.
- No limpiar datos.

## Verificacion

- Sin P0/P1.
- Nombres largos no rompen panel.
- Home al 100% no requiere zoom para verse equilibrada.
- Logo publico mas grande sin corte.
- Nav publica no muestra opciones eliminadas.
- Admin no muestra prompt nativo ante credenciales invalidas.
- Admin muestra mensaje inline.
- Flujos principales siguen accesibles.

## Handoff esperado

Crear `tasks/TASK-245-HANDOFF.md` con:

- Resultado: aprobado / no aprobado.
- Superficies validadas.
- Evidencia desktop/mobile.
- Hallazgos por severidad.
- Recomendacion para Infra Azure `TASK-246` si aprueba.
