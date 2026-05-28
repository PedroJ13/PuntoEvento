# TASK-085: Crear admin UI para moderacion del modelo nuevo

## Equipo asignado

Web Dev.

## Dependencia

Ejecutar despues de `TASK-083` y `TASK-084`, salvo que Product/Architect indique otra secuencia.

## Contexto

`TASK-082` encontro que `admin.html` existe y muestra login, pero sigue enfocado en revision legacy de proveedores.

La moderacion real del modelo nuevo hoy se hace por API:

```text
POST /api/internal/companies/{companyId}/approve
POST /api/internal/companies/{companyId}/reject
POST /api/internal/services/{companyId}/{serviceId}/approve
POST /api/internal/services/{companyId}/{serviceId}/reject
POST /api/internal/uploads/{companyId}/{uploadId}/approve
POST /api/internal/uploads/{companyId}/{uploadId}/reject
```

Para que Product Owner pruebe de punta a punta, necesita aprobar/rechazar desde UI.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-082-HANDOFF.md`
- `admin.html`
- `admin.js`
- `admin.css`
- `api/shared/adminAuth.js`
- `api/internal-companies-approve/index.js`
- `api/internal-companies-reject/index.js`
- `api/internal-services-approve/index.js`
- `api/internal-services-reject/index.js`
- `api/internal-uploads-approve/index.js`
- `api/internal-uploads-reject/index.js`

## Objetivo

Agregar UI admin interna para moderar Companies, Services y Uploads del modelo nuevo, manteniendo compatibilidad con el flujo legacy mientras exista.

## Alcance

1. Revisar si existen endpoints de listado para pendientes del modelo nuevo.
2. Si existen, conectar `admin.html` para listar:
   - empresas pendientes;
   - servicios pendientes;
   - uploads pendientes.
3. Si no existen endpoints de listado, documentar el bloqueo y proponer endpoints minimos. No inventar mocks que parezcan reales.
4. Agregar acciones de aprobar/rechazar cuando haya IDs disponibles.
5. Usar el mecanismo admin actual de credencial interna, sin exponer secretos.
6. Mostrar estados claros: pendiente, aprobado, rechazado, error.
7. No mostrar `tokenHash`, `sessionHash`, SAS, cookies ni secretos.
8. Mantener `admin.html` como ruta interna/directa. No pedir agregarlo como boton prominente en la pagina publica salvo decision explicita de Product/Architect.

## Fuera de alcance

- Crear endpoints backend nuevos, salvo que Product/Architect reasigne como Backend/API.
- Panel empresa.
- Registro publico.
- Pagos/ranking.

## Verificacion local esperada

- `node --check admin.js`.
- Login admin sigue funcionando visualmente.
- Si hay endpoints de listado, probar listar/aprobar/rechazar con mocks o datos QA.
- Si no hay endpoints de listado, el handoff debe decir claramente: `bloqueado por falta de endpoint de listado`.
- Mobile/tablet basico sin controles cortados.

## Entregable

Crear:

```text
tasks/TASK-085-HANDOFF.md
```

Debe incluir:

- Resultado general: completado o bloqueado.
- Si encontro endpoints de listado o no.
- Archivos modificados.
- Como se probo.
- Riesgos pendientes.
- Siguiente tarea recomendada si hace falta Backend/API.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-085. Product/Architect debe leer tasks/TASK-085-HANDOFF.md.
```
