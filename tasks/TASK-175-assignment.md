# TASK-175: Infra Azure - configurar Azure Communication Services Email MVP

## Equipo asignado

Infra Azure.

## Contexto

Product / Architect / Release acepta la recomendacion de `docs/RECOMMENDATION_EMAIL_PROVIDER_MVP.md`: usar Azure Communication Services Email como proveedor MVP en vez de SendGrid.

## Tarea

Configurar Azure Communication Services Email para el ambiente MVP/pre-lanzamiento.

## Alcance

- Crear o confirmar recurso Azure Communication Services / Email Communication Service.
- Elegir dominio MVP:
  - preferido para velocidad: Azure Managed Domain si cubre el caso de prueba;
  - custom domain si Product decide usar dominio propio desde el inicio.
- Configurar sender/remitente permitido.
- Definir variables de entorno para Azure Functions sin imprimir valores.
- Cargar app settings necesarios en Azure.
- Ejecutar smoke de envio controlado si el recurso queda listo.
- Documentar mailbox/log observable para QA.

## No tocar

- Codigo backend.
- UI publica/panel/admin.
- Secretos en repo, handoff o chat.

## Docs a actualizar

- `docs/ARCHITECTURE.md` si se agregan recursos/variables nuevas.
- `docs/MVP_RELEASE_STATUS.md` via handoff.

## Verificacion

- Recurso ACS Email existe.
- Dominio/remitente queda listo o limitacion documentada.
- Variables existen en Azure, sin valores en handoff.
- QA tiene mailbox/log observable.

## Handoff esperado

Crear `tasks/TASK-175-HANDOFF.md` con:

- Recurso ACS Email creado/configurado: si/no.
- Tipo de dominio usado: Azure Managed Domain o custom domain.
- Sender/remitente listo: si/no.
- Variables configuradas: nombres, sin valores.
- Smoke de envio: resultado.
- Bloqueos/riesgos.
- Recomendacion para Backend/API y QA.
