# Recomendacion Pulso: Email MVP con Azure Communication Services

## Contexto

La prueba Product Owner fue positiva y el flujo base parece funcionar. Para pre-lanzamiento quedan prioridades operativas relacionadas con acceso recurrente de empresas y notificaciones.

El codigo/propuesta actual apunta a SendGrid, pero SendGrid implica un costo mensual aproximado de USD 20 en planes pagos. Para el volumen inicial esperado de Punto Evento, parece mejor evitar una mensualidad fija.

Como el proyecto ya usa Azure Static Web Apps, Azure Functions, Blob Storage y Table Storage, recomendamos usar Azure Communication Services Email para el MVP.

## Recomendacion

Usar Azure Communication Services Email como proveedor principal de email MVP.

Mantener el codigo preparado para proveedor configurable, evitando amarrar la arquitectura a SendGrid.

## Motivo

- Menor costo inicial para bajo volumen.
- Mejor alineacion con la infraestructura Azure existente.
- Menos proveedores externos que administrar.
- Permite pay-as-you-go mientras se valida volumen real.
- SendGrid puede quedar como alternativa futura si el volumen, deliverability o features lo justifican.

## Prioridad sugerida

P1 pre-lanzamiento.

El email es necesario para operar el marketplace:

1. Empresas deben recibir cotizaciones/leads.
2. Punto Evento debe recibir avisos de registros o servicios pendientes de revision.
3. El flujo de auth email/password probablemente necesitara emails transaccionales.

## Tareas sugeridas

### TASK A: Decision de proveedor email MVP

Rol: Product / Architect / Release

Tarea:
Documentar decision de usar Azure Communication Services Email como proveedor MVP y dejar SendGrid como alternativa futura.

Docs sugeridos:

- `docs/DECISION_LOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/BACKLOG.md`

Resultado esperado:
Decision formal y tareas delegadas.

### TASK B: Configuracion Azure Communication Services Email

Rol: Infra Azure

Tarea:
Configurar Azure Communication Services Email para el ambiente MVP.

Alcance:

- Crear/configurar recurso necesario en Azure.
- Configurar dominio/remitente permitido.
- Definir variables de entorno para Azure Functions.
- Documentar nombres de variables.
- Ejecutar smoke test de envio controlado.

No tocar:

- UI publica.
- Contratos API salvo coordinacion con Backend/API.

Resultado esperado:
Infra lista para que Backend/API envie emails desde Azure Functions.

### TASK C: Backend provider de email configurable

Rol: Backend/API

Tarea:
Implementar capa de envio de email configurable usando Azure Communication Services Email como provider MVP.

Alcance:

- Evitar acoplamiento directo a SendGrid.
- Leer config desde variables de entorno.
- Crear helper/servicio interno de email.
- Manejar errores sin romper flujos principales.
- No exponer secretos en frontend.

Primeros casos:

- Email interno cuando una empresa se registra.
- Email interno cuando un servicio se envia a revision.
- Email a empresa cuando recibe una cotizacion.

Resultado esperado:
Backend puede enviar emails transaccionales MVP usando Azure Communication Services Email.

### TASK D: QA email MVP

Rol: QA

Tarea:
Validar envio de emails en ambiente Azure con casos controlados.

Casos:

- Registro de empresa genera aviso interno.
- Servicio enviado a revision genera aviso interno.
- Cotizacion publica genera email a empresa.
- Fallo de email no duplica registros ni rompe flujo principal.
- No se exponen secretos ni datos tecnicos al usuario.

Resultado esperado:
QA aprueba o clasifica hallazgos P0/P1/P2.

## Riesgo si no se hace

- Se paga mensualidad innecesaria antes de validar volumen real.
- Se amarra el proyecto a SendGrid sin necesidad.
- Se lanza sin notificaciones operativas.
- Se pueden perder cotizaciones si la empresa no recibe aviso.
- El equipo tendria que revisar manualmente registros y servicios pendientes.

## Recomendacion final

Avanzar con Azure Communication Services Email como proveedor MVP y pedir a Infra Azure que confirme configuracion/costos antes de que Backend/API implemente la capa de email.
