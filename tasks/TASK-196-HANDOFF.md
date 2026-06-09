# TASK-196: Web Dev - admin por estado real de empresa y servicios

## Equipo

Web Dev

## Estado

Completada local/estructuralmente.

## Cambios realizados

- Admin abre el flujo operativo `Empresas y servicios` como superficie principal.
- Tabs legacy/demo quedan ocultos para no distraer del flujo MVP.
- Empresa `pending` o `draft` muestra acciones `Aprobar empresa` y `Rechazar empresa`.
- Empresa `published` ya no muestra accion principal de aprobar empresa.
- Empresa aprobada muestra nota: `Empresa aprobada. Revisa los servicios pendientes de esta empresa.`
- Empresa publicada con servicio pendiente enfoca acciones en `Aprobar servicio` / `Rechazar servicio`.
- Feedback especifico por entidad:
  - Empresa: mantiene mensajes de invite de `TASK-181`.
  - Servicio aprobado: `Servicio aprobado.`
  - Servicio rechazado: `Servicio rechazado.`

## Archivos cambiados

- `admin.html`
- `admin.js`
- `admin.css`

## Cache busting

- `admin.html` carga `styles.css?v=20`.
- `admin.html` carga `admin.css?v=13`.
- `admin.html` carga `admin.js?v=18`.

## Estados probados

- Empresa pendiente:
  - Mostro una accion de aprobar empresa.
- Empresa publicada con servicio pendiente:
  - No mostro aprobar empresa.
  - Mostro una accion de aprobar servicio.
- Aprobar servicio:
  - Mostro feedback `Servicio aprobado.`

## Cambios de navegacion admin

- Tab visible principal: `Empresas y servicios`.
- Tabs `Legacy`, `Demo` y `Servicios demo` quedan en DOM como soporte pero ocultos con `.support-tab`.
- No se elimino funcionalidad legacy/demo; solo se oculto del flujo operativo principal.

## Verificacion

- `node --check admin.js`: OK.
- Playwright local con mocks en `http://127.0.0.1:60002/admin.html`:
  - `pendingHasCompanyApprove=1`.
  - `publishedHasCompanyApprove=0`.
  - `serviceApproveCount=1`.
  - Feedback posterior: `Servicio aprobado.`
  - `supportTabsVisible=false`.
  - Texto legacy/demo no visible.

## Dependencias Backend/API

- La UI depende de que los listados internos traigan `company.status` real.
- Si el servicio trae `companyStatus=published`, el boton de servicio se habilita incluso si la empresa no vino completa en `companies/pending`.

## Recomendacion para QA

Validar en Azure con:

- Empresa nueva pendiente.
- Empresa ya publicada con servicio pendiente.
- Acciones de aprobar/rechazar servicio.
- Confirmar que admin no sugiere aprobar empresa cuando la empresa ya esta publicada.
