# TASK-139: Web Dev - admin muestra imagenes dentro del servicio

## Equipo asignado

Web Dev.

## Contexto

Product Owner reviso `admin.html` y pidio:

1. No mostrar imagenes como entidad separada de servicios.
2. Mostrar imagenes dentro del servicio, con preview visible.
3. Aprobar solo empresa y servicios; el servicio incluye sus imagenes.
4. Quitar el bloque viejo final de tres columnas: empresas, servicios, imagenes.

Depende de `TASK-138` para el contrato final de preview/publicacion de imagenes.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/API_CONTRACTS_MVP.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-137-HANDOFF.md`
- `tasks/TASK-138-HANDOFF.md` cuando exista.
- `admin.html`
- `admin.js`
- `admin.css`

## Objetivo

Ajustar la UI de moderacion para que el expediente de empresa muestre cada servicio con sus imagenes pendientes dentro del mismo bloque, y que la aprobacion principal sea empresa/servicio.

## Alcance

1. En `Modelo nuevo`, mantener expediente por empresa.
2. En cada card de servicio:
   - mostrar datos del servicio;
   - mostrar previews de imagenes asociadas;
   - distinguir cover y galeria;
   - mostrar estado de cada imagen como informacion, no como accion principal separada.
3. Cambiar copy/botones para que el admin entienda:
   - aprobar empresa;
   - aprobar servicio con sus imagenes;
   - rechazar servicio si algo del servicio o sus imagenes no esta listo.
4. Quitar/ocultar el bloque viejo final de listas globales:
   - `Empresas pendientes`;
   - `Servicios revisables`;
   - `Imagenes pendientes`.
5. No mostrar uploads como columna o entidad separada para decision primaria.
6. Subir cache busting de `admin.js` y/o `admin.css` si cambia runtime.

## Fuera de alcance

- Cambiar reglas backend.
- Cambiar formulario publico de registro.
- Redisenar visual completo; esta es tarea de programacion/estructura.

## Verificacion minima esperada

- `node --check admin.js`.
- Smoke local/mock con empresa, servicio y 2 imagenes:
  - servicio muestra imagenes dentro;
  - no aparece bloque final viejo de tres columnas;
  - no hay boton principal de aprobar upload separado.

## Entregable

Crear:

```text
tasks/TASK-139-HANDOFF.md
```

Debe incluir:

- archivos modificados;
- version/cache busting nueva;
- como se renderizan las imagenes;
- verificacion ejecutada;
- riesgos o pendientes;
- si requiere deploy.

## Aviso al terminar

```text
Termine TASK-139. Product/Architect debe leer tasks/TASK-139-HANDOFF.md.
```
