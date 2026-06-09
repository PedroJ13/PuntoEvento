# TASK-233: Backend API - alinear colores minimos de emails Punto Evento CR

## Equipo asignado

Backend API.

## Contexto

`TASK-231` debe definir una guia minima de paleta global basada en el panel empresa. Los emails transaccionales ya usan `Punto Evento CR`; ahora se quiere alinear color/marca de forma ligera.

## Tarea

Alinear los templates HTML de email con la paleta aprobada, sin cambiar contenido funcional ni contratos de envio.

## Alcance

1. Leer `tasks/TASK-231-HANDOFF.md`.
2. Identificar templates o helpers de email en `/api`.
3. Aplicar colores minimos a:
   - email de activacion de empresa;
   - email interno de nueva empresa registrada;
   - email interno de servicio enviado a revision;
   - email de cotizacion/contacto si usa HTML.
4. Mantener `Punto Evento CR` como marca visible.
5. Mantener links, datos operativos y campos actuales.
6. No cambiar proveedor ACS Email ni app settings.

## No tocar

- No cambiar flujo de envio.
- No cambiar destinatarios, subjects, payloads ni estados `emailStatus`.
- No cambiar API publica ni contratos.
- No agregar dependencias.
- No tocar frontend.

## Verificacion

- Templates siguen generando HTML valido.
- No se exponen secretos ni tokens en logs.
- El cambio es solo visual/copy de marca si ya existia.
- Prueba local/estructural de funciones afectadas si el repo la permite.
- `git diff --check -- api` OK.

## Handoff esperado

Crear `tasks/TASK-233-HANDOFF.md` con:

- Templates/helpers modificados.
- Resumen de colores aplicados.
- Confirmacion de que no cambio contrato ni provider.
- Pruebas/checks ejecutados.
- Riesgos.
- Recomendacion para QA `TASK-234`.
