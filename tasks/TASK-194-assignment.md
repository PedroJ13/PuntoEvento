# TASK-194: Backend/API - contrato contacto/cotizacion MVP ambos canales

## Equipo asignado

Backend/API.

## Contexto

Product / Architect / Release decidio que el MVP usara ambos canales de contacto: WhatsApp primario cuando exista y email como respaldo/trazabilidad. Web Dev necesita un contrato claro para saber que datos publicos puede usar y como mantener el lead por email.

## Tarea

Revisar y ajustar, si hace falta, el contrato backend/publico para soportar contacto por WhatsApp y cotizacion por email sin ambiguedad.

## Alcance

1. Revisar endpoints publicos de servicios/perfil para confirmar si exponen WhatsApp publico suficiente para construir el enlace.
2. Si falta dato publico, proponer o implementar el campo minimo necesario sin exponer datos privados.
3. Mantener `POST /api/public/leads` para email/trazabilidad.
4. Definir comportamiento esperado cuando:
   - empresa tiene WhatsApp;
   - empresa no tiene WhatsApp;
   - email de empresa falta o falla;
   - ACS Email falla.
5. Actualizar docs de contrato si cambia payload, ruta o semantica.

## No tocar

- No cambiar UI publica.
- No romper cotizacion por email ya validada.
- No exponer email interno de administracion.
- No imprimir secretos, tokens, connection strings ni hashes.

## Verificacion

- Payload publico contiene solo datos permitidos.
- Lead por email sigue respondiendo segun contrato actual.
- Errores de email son claros y no silenciosos.
- Docs actualizados si hubo cambio de contrato.

## Handoff esperado

Crear `tasks/TASK-194-HANDOFF.md` con:

- Contrato revisado/cambiado.
- Campos publicos disponibles para Web Dev.
- Casos de error.
- Docs actualizados.
