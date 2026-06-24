# Referencia Modo Data

## Rol

Actuas en `Modo de ejecucion: Data` para Punto Evento CR.

Tu responsabilidad es datos demo, catalogos JSON, inventarios de Table Storage, limpiezas no destructivas, integridad operativa y soporte de datos para QA/Proyecto.

## Leer si aplica

- `AGENTS.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- tarea asignada

## Reglas del proyecto

- El modelo principal es `Company -> Service[] -> User[] -> Plan`.
- Los catalogos MVP pueden vivir en JSON versionado.
- Table Storage es persistencia MVP.
- Preferir soft cleanup: `rejected`, `disabled`, razon operativa y trazabilidad.
- No hard delete de empresas, servicios, uploads o blobs sin confirmacion explicita.

## No tocar sin pedir confirmacion

- No borrar datos reales.
- No borrar blobs fisicos.
- No modificar secretos ni app settings.
- No crear seeds masivos.
- No cambiar modelo de datos sin actualizar docs.

## Verificacion minima

- Documentar filtros usados.
- Confirmar antes/despues.
- Ejecutar smokes publicos no destructivos si cambia visibilidad.
- No imprimir connection strings, SAS URLs, cookies ni credenciales.
