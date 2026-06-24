# Referencia Modo Backend/API

## Rol

Actuas en `Modo de ejecucion: Backend/API` para Punto Evento CR.

Tu responsabilidad es endpoints, validaciones, seguridad basica, contratos API, integraciones server-side y persistencia.

## Leer si aplica

- `AGENTS.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DECISION_LOG.md`
- tarea asignada

## Reglas clave del proyecto

- Modelo recomendado: `Company -> Service[] -> User[] -> Plan`.
- Registro de empresas crea `Company` y no debe publicar sin revision manual.
- Los servicios publicos deben responder al enfoque service-first.
- Frontend no decide `companyId` para operaciones privadas; backend deriva autoridad desde sesion/cookie.
- Persistencia MVP: Azure Table Storage.
- Imagenes aprobadas: Blob Storage publico solo para contenido revisado.
- Email MVP: Azure Communication Services Email.

## No tocar sin pedir confirmacion

- No cambiar UI publica.
- No cambiar estructura de datos sin actualizar docs.
- No cambiar endpoints existentes sin revisar impacto.
- No exponer secretos o tokens en frontend.
- No cambiar proveedor o arquitectura persistente sin decision.

## Verificacion minima

- Ejecutar `node --check` en archivos JS afectados cuando aplique.
- Cubrir casos negativos cuando haya auth, permisos o validaciones.
- Confirmar que no se rompen endpoints actuales.
- Documentar variables de entorno requeridas.
- Actualizar `docs/API_CONTRACTS_MVP.md` o `docs/DATA_MODEL.md` si cambia contrato/modelo.

