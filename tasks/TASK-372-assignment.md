# TASK-372: QA Azure de password-flows con cuenta autorizada

## Equipo encargado

QA

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-372-assignment.md.
Valida en Azure el paquete de password-flows y al terminar crea `tasks/TASK-372-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/QA.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-371-HANDOFF.md`

## Objetivo

Validar en `https://puntoeventocr.com` que password-flows funcionan de forma segura con cuenta/destinatario autorizado.

## Contexto

Los flujos de reset y cambio de password son sensibles. QA debe evitar exponer passwords, tokens, cookies, hashes o links completos en evidencia.

## Alcance

- Login con ojo password.
- Mensajes seguros de login invalido.
- Cambio autenticado de password con cuenta QA autorizada.
- Solicitud de reset con respuesta generica.
- Token invalido en ruta publica muestra estado seguro.
- Reset real solo si hay destinatario autorizado.
- Accion admin reset solo si hay credencial admin QA autorizada.
- Confirmar que no se exponen secretos en DOM/respuestas/handoff.

## Fuera de alcance

- No usar cuentas reales sin autorizacion explicita.
- No publicar contrasenas, tokens, cookies ni enlaces completos.
- No corregir codigo.
- No modificar datos productivos fuera del guion.

## Criterios de aceptacion

- Sin P0/P1.
- Flujo real autorizado funciona o queda bloqueado por falta de credenciales/destinatario.
- Endpoints/rutas nuevos publicados y operativos.
- No se rompe login recurrente, panel empresa, admin ni catalogo publico.

## Verificacion requerida

- Navegador contra Azure.
- Network/DOM con datos sensibles redactados.
- Smokes publicos no destructivos.
- Evidencia redactada.

## Handoff requerido

Crear:

```text
tasks/TASK-372-HANDOFF.md
```

Debe incluir formato QA completo.

