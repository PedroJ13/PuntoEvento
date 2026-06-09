# TASK-195: Web Dev - lenguaje simple en panel empresa

## Equipo asignado

Web Dev.

## Contexto

El cliente percibio friccion en el panel empresa. La empresa necesita sentir que esta cargando su informacion, no que esta entrando en un tramite complejo. La revision interna se mantiene como regla operativa, pero el lenguaje visible debe ser mas simple.

## Tarea

Simplificar textos y acciones principales en crear/editar servicios del panel empresa.

## Alcance

1. Cambiar lenguaje visible hacia:
   - `Cargar servicio`
   - `Portada`
   - `Fotos del servicio`
   - `Tu informacion fue recibida`
2. Quitar o reducir textos que hablen de revision interna, cola, datos o fotos salvo donde sea necesario.
3. Evitar mostrar dos acciones principales confusas como `Guardar borrador` y `Enviar a revision` si Product ya pidio simplificar.
4. Mantener comportamiento backend actual, aunque internamente el servicio siga pasando por revision.
5. Validar mobile/desktop.

## No tocar

- No cambiar reglas backend de estados.
- No saltarse moderacion interna.
- No redisenar todo el panel.
- No cambiar autenticacion ni upload.

## Verificacion

- Empresa entiende que puede cargar servicio sin leer lenguaje burocratico.
- `cover` ya no aparece como texto visible; usar `portada`.
- La accion principal no compite con otra accion primaria.
- Flujo de carga sigue funcionando.

## Handoff esperado

Crear `tasks/TASK-195-HANDOFF.md` con:

- Textos cambiados.
- Pantallas probadas.
- Cualquier texto de revision que se conserve y motivo.
- Riesgos para QA.
