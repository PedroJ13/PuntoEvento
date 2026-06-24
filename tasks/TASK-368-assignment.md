# TASK-368: Web Dev recuperar acceso y pantalla publica de reset

## Equipo encargado

Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Mensaje para iniciar el chat

```text
Lee este archivo de asignacion: tasks/TASK-368-assignment.md.
Implementa la UI de recuperar acceso/reset y al terminar crea `tasks/TASK-368-HANDOFF.md`.
```

## Archivos que debe leer antes de trabajar

Obligatorios:

- `AGENTS.md`
- `codex-project-templates/EJECUCION_TECNICA.md`
- `codex-project-templates/WEB_DEV.md`
- `codex-project-templates/CHAT_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-367-HANDOFF.md`

## Objetivo

Agregar UI para recuperar acceso desde login y completar reset con token en ruta publica segura.

## Contexto

El backend de `TASK-367` define endpoints de reset. La UI debe evitar revelar si el correo existe y no debe guardar token/password en storage.

## Alcance

- Agregar enlace `Recuperar acceso` en login empresa.
- Agregar formulario para solicitar instrucciones por email.
- Agregar ruta/pantalla publica `company-password-reset?token=...` o la ruta definida por `TASK-364`.
- Validar token al cargar.
- Mostrar estados seguro: valido, invalido, expirado, usado.
- Agregar ojos Ver/Ocultar en nuevo password y confirmacion.
- Subir cache busting de assets tocados.

## Fuera de alcance

- No implementar backend.
- No tocar admin reset.
- No cambiar registro publico de empresas salvo enlace necesario.
- No guardar token/password en localStorage/sessionStorage.

## Criterios de aceptacion

- Solicitud de reset muestra mensaje generico.
- Token invalido muestra estado seguro.
- Token valido permite completar reset.
- Exito ofrece volver al login.
- No se imprime token/password en consola, UI admin, handoff o storage.

## Verificacion requerida

- `node --check` en JS tocado.
- Revision de rutas SPA.
- Busqueda de storage/logs peligrosos.
- Validacion local/estructural con token sintetico/invalido.

## Handoff requerido

Crear:

```text
tasks/TASK-368-HANDOFF.md
```

Debe incluir formato extra de Ejecucion Tecnica.

