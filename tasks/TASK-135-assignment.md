# TASK-135: Web Dev - corregir carga de expediente admin Round 2

## Equipo asignado

Web Dev.

## Superficie

```text
admin.html
admin.js
admin.css
```

## Contexto

`TASK-132` aprobo la API Round 2 post-deploy y cerro el P0 de aprobaciones fuera de orden, pero encontro un P1 en la UI admin.

En Azure autenticado, con `Modelo nuevo` activo:

```text
caseMarkup=1
companyCount=0
serviceCount=0
uploadCount=0
selectable=0
scopedServices=0
scopedUploads=0
```

El expediente existe en DOM, pero no carga los pendientes reales creados por QA. La API si respondio correctamente para reglas de moderacion.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `tasks/TASK-126-HANDOFF.md`
- `tasks/TASK-132-HANDOFF.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`

## Objetivo

Corregir la carga de datos del tab `Modelo nuevo` para que el expediente admin muestre empresas, servicios y uploads pendientes reales en Azure.

## Alcance

1. Revisar como `admin.js` consume:
   - `GET /api/internal/companies/pending`;
   - `GET /api/internal/services/pending`;
   - `GET /api/internal/uploads/pending`.
2. Corregir la causa por la que los contadores quedan en `0` desde navegador aun cuando existen pendientes.
3. Mantener acciones de aprobar/rechazar concentradas en el expediente.
4. Mantener bloqueos visuales:
   - servicio no aprobable si empresa no esta `published`;
   - upload no aprobable si empresa no esta `published`;
   - upload de servicio no aprobable si servicio no esta `published`.
5. Subir cache busting de `admin.js` y/o `admin.css` si cambia runtime.

## Fuera de alcance

- Cambiar reglas backend ya aprobadas en `TASK-132`.
- Redisenar todo el admin.
- Crear endpoints nuevos salvo que sea absolutamente necesario y se documente por que.
- Hacer limpieza de datos QA.

## Verificacion minima esperada

- `node --check admin.js`.
- Prueba local o mock que demuestre que contadores/lista de empresas se llenan cuando las respuestas internas traen pendientes.
- Smoke en Azure o instrucciones claras para deploy/QA si no puedes desplegar.

## Entregable

Crear:

```text
tasks/TASK-135-HANDOFF.md
```

Debe incluir:

- causa encontrada;
- archivos modificados;
- version/cache busting nueva si aplica;
- verificacion ejecutada;
- si requiere deploy;
- riesgos o pendientes;
- recomendacion para QA reintento admin UI.

## Aviso al terminar

```text
Termine TASK-135. Product/Architect debe leer tasks/TASK-135-HANDOFF.md.
```
