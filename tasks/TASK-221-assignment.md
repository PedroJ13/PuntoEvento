# TASK-221: QA - revalidar renombre Punto Evento CR en Azure

## Equipo asignado

QA.

## Contexto

Despues de `TASK-220`, Azure debe servir el renombre visible de marca a `Punto Evento CR`.

## Tarea

Revalidar en Azure real que la marca visible aparece como `Punto Evento CR` y que no hubo regresiones.

## Alcance

1. Confirmar assets/versiones nuevas servidas por Azure segun `TASK-220-HANDOFF.md`.
2. Validar frontend Azure:
   - pagina publica muestra `Punto Evento CR` donde corresponde;
   - panel empresa muestra `Punto Evento CR`;
   - admin interno muestra `Punto Evento CR`;
   - metadata/title/alt/aria relevantes actualizados si son observables.
3. Validar emails si QA dispone de flujo controlado:
   - cotizacion/contacto;
   - activacion/invitacion;
   - notificaciones internas si aplica;
   - asunto/cuerpo deben usar `Punto Evento CR`.
4. Regresion minima:
   - pagina publica carga;
   - panel login/activacion o modo disponible carga;
   - admin carga;
   - `/api/public/services?limit=1` responde.
5. Clasificar hallazgos P0/P1/P2/P3.

## No tocar

- No modificar datos reales fuera de entidades QA controladas.
- No publicar secretos, tokens ni credenciales.
- No declarar go comercial nuevo; entregar recomendacion para Product / Architect / Release.

## Verificacion

- Evidencia visual.
- Evidencia textual.
- Evidencia de emails si se ejecutan.
- Resultado final: aprobado, aprobado con observaciones o no aprobado.

## Handoff esperado

Crear `tasks/TASK-221-HANDOFF.md` con:

- Resultado por superficie.
- Evidencia resumida.
- Usos remanentes justificados.
- Bugs clasificados.
- Recomendacion para Product / Architect / Release.
