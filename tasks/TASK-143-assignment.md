# TASK-143 - QA Azure ajustes Product Owner post-deploy

Equipo: QA

## Contexto

Product Owner pidio cerrar ajustes de programacion antes de otra pasada de diseno/experiencia:

- En admin, las imagenes deben verse dentro del servicio, no como entidad separada.
- El admin aprueba empresa y servicios; al aprobar servicio se publican tambien sus imagenes pendientes asociadas.
- El bloque viejo final de empresas/servicios/uploads globales no debe seguir visible como flujo principal.
- El registro publico debe usar provincia como lista y pedir contactos ampliados.

Infra Azure completo `TASK-142` y desplego el bloque de `TASK-138`, `TASK-139`, `TASK-140` y `TASK-141`.

## Leer antes de probar

- `tasks/TASK-138-HANDOFF.md`
- `tasks/TASK-139-HANDOFF.md`
- `tasks/TASK-140-HANDOFF.md`
- `tasks/TASK-141-HANDOFF.md`
- `tasks/TASK-142-HANDOFF.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `docs/MVP_RELEASE_STATUS.md`

## Ambiente

- Azure: `https://zealous-field-08fdd720f.7.azurestaticapps.net`
- Publica/registro: `https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#empresas`
- Admin interno: `https://zealous-field-08fdd720f.7.azurestaticapps.net/admin.html`
- Panel empresa: `https://zealous-field-08fdd720f.7.azurestaticapps.net/panel.html`

## Alcance de validacion

1. Confirmar versiones servidas:
   - `/index.html` carga `app.js?v=23` y `styles.css?v=17`.
   - `/admin.html` carga `admin.js?v=15` y `admin.css?v=9`.

2. Registro publico de empresa:
   - Provincia es un select/lista, no campo libre.
   - La lista coincide con el filtro publico: San Jose, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas, Limon.
   - El formulario permite enviar contactos ampliados: WhatsApp, telefono local, Instagram, Facebook, sitio web y TikTok si esta disponible.
   - `POST /api/companies/register` responde correctamente y los datos quedan visibles para revision interna donde corresponde.

3. Admin interno:
   - La vista principal ya no muestra al final el bloque viejo global separado de empresas, servicios e imagenes como flujo principal.
   - El expediente muestra servicios de la empresa.
   - Cada servicio muestra sus imagenes dentro del servicio con preview visible cuando existen uploads pendientes.
   - No hay flujo primario de aprobar imagenes como entidad separada; la accion esperada es aprobar empresa y aprobar servicio.
   - El admin no expone tokens, SAS, `sig=`, credenciales, ni URLs internas sensibles en DOM visible.

4. Moderacion con imagenes reales:
   - Crear o usar una empresa QA controlada.
   - Aprobar la empresa.
   - Crear un servicio desde panel empresa, subir al menos cover y una imagen de galeria, y enviarlo a revision.
   - Confirmar que admin ve las imagenes dentro de ese servicio.
   - Aprobar el servicio.
   - Confirmar que el servicio queda publicado con imagenes visibles en pagina publica/perfil.
   - Confirmar que aprobar servicio de empresa pendiente sigue bloqueado con `409`.

5. Contactos en superficies:
   - En admin, los contactos ampliados deben verse para revision.
   - En publico, solo deben exponerse los campos definidos como publicos.
   - El email de contacto no debe publicarse en catalogo publico si el contrato dice que es interno.

6. Responsive minimo:
   - Revisar registro y admin en desktop y mobile.
   - Confirmar que imagenes/servicios/contactos no se montan ni rompen layout.

## Criterio de aprobacion

QA aprueba si:

- Los ajustes Product Owner estan visibles en Azure.
- El flujo empresa -> servicio -> imagenes pendientes -> aprobacion servicio -> publico funciona con datos reales.
- No reaparece el bloque viejo global de moderacion como flujo principal.
- No hay P0/P1 abiertos.

Si aparece un problema, clasificarlo por superficie:

- Backend API
- Web Dev
- Infra Azure
- QA dato/procedimiento

## Entregable

Actualizar `tasks/TASK-143-HANDOFF.md` con:

- Resultado: aprobado / aprobado con observaciones / no aprobado.
- Evidencia de versiones servidas.
- Datos QA usados, sin secretos.
- Bugs encontrados con severidad y superficie.
- Recomendacion concreta para Product / Architect / Release.
