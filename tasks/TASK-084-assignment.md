# TASK-084: Conectar panel empresa a API real

## Equipo asignado

Web Dev.

## Dependencia

Ejecutar despues de `TASK-083` o en paralelo solo si se coordina para evitar conflictos en UI/contratos.

## Contexto

`TASK-082` encontro que `panel.html` carga en Azure, pero sigue siendo demo local:

```text
Demo local
Esta demo no guarda en Azure todavia
panel.js usa localStorage
```

Para que Product Owner pruebe el flujo completo desde navegador, la empresa debe poder entrar a su panel real y gestionar servicios reales.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `panel.html`
- `panel.js`
- `panel.css`
- `api/companies-me/index.js`
- `api/company-services-list/index.js`
- `api/company-services-create/index.js`
- `api/company-services-update/index.js`
- `api/company-services-delete/index.js`
- `api/uploads-sign/index.js`
- `api/uploads-confirm/index.js`

## Objetivo

Convertir `panel.html` en panel real MVP para empresa autenticada por cookie de invitacion.

## Alcance

1. Al cargar `panel.html`, llamar:

```text
GET /api/companies/me
GET /api/companies/me/services
```

2. Si no hay sesion, mostrar estado claro:

```text
Necesitas abrir el enlace de invitacion para entrar al panel.
```

3. Listar servicios reales de la empresa autenticada.
4. Crear servicio real con:

```text
POST /api/companies/me/services
```

5. Editar servicio real con:

```text
PATCH /api/companies/me/services/{serviceId}
```

6. Desactivar/eliminar servicio real con:

```text
DELETE /api/companies/me/services/{serviceId}
```

7. Subir cover de servicio usando:

```text
POST /api/uploads/sign
PUT <SAS>
POST /api/uploads/confirm
```

8. Mostrar estados `draft`, `pending`, `published`, `rejected`, `inactive`.
9. Incluir navegacion clara:
   - volver a pagina publica;
   - cerrar sesion si existe endpoint/flujo disponible;
   - ver perfil publico cuando la empresa/servicio ya este publicado;
   - estado claro cuando el servicio queda pendiente de aprobacion.
10. Mantener un modo demo local solo si es explicitamente detectado por query param, por ejemplo:

```text
panel.html?demo=local
```

11. No exponer cookies, SAS, tokens ni secretos en UI.

## Fuera de alcance

- Admin/moderacion.
- Registro publico.
- Pago/ranking.
- Email real.

## Verificacion local esperada

- `node --check panel.js`.
- Prueba con mocks o ambiente local de API:
  - sin sesion;
  - sesion valida;
  - listar servicios;
  - crear/editar/desactivar;
  - upload feliz y error.
- Mobile 390px sin overflow.
- Sin errores JS no controlados.

## Entregable

Crear:

```text
tasks/TASK-084-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Rutas/endpoints integrados.
- Como se probo.
- Riesgos pendientes.
- Si requiere commit/push antes de QA Azure.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-084. Product/Architect debe leer tasks/TASK-084-HANDOFF.md.
```
