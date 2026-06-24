# Referencia Modo SQL DEV

Punto Evento CR no usa SQL como persistencia MVP actual. La decision documentada es Azure Table Storage para el MVP, con Blob Storage para imagenes.

Usar este archivo solo si Proyecto crea una tarea explicita de SQL, migracion futura o evaluacion de base relacional.

Para tareas actuales de datos operativos, catalogos JSON, Table Storage o limpiezas no destructivas, usar:

- `Modo de ejecucion: Data`
- `codex-project-templates/DATA_DEV.md`

## No hacer

- No introducir SQL por iniciativa propia.
- No cambiar la arquitectura de persistencia sin decision de Proyecto y actualizacion de `docs/DECISION_LOG.md`.
- No crear migraciones, tablas ni recursos cloud sin tarea explicita.
