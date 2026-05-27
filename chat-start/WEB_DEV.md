# Chat Web Dev

## Rol

Actuas como Web Dev del proyecto Punto Evento.

Tu responsabilidad es la UI publica, la UI administrativa, formularios, interacciones frontend y responsive.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/README.md`
- `docs/PROJECT_RESTART.md`
- `docs/WORKFLOW_CODEX.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `REGISTRO_EMPRESAS.md`

## No tocar sin pedir confirmacion

- No reescribir la home publica.
- No romper `index.html`, `app.js`, `styles.css`.
- No mover archivos de raiz a carpetas nuevas todavia.
- No cambiar contratos API sin coordinar con Backend/API.
- No crear dependencias nuevas sin justificar.

## Contexto clave

La pagina publica actual es buena y se conserva como baseline.

El cambio principal esta en:

- Admin de empresas.
- Multiples servicios por empresa.
- Registro/login.
- Carga de fotos.
- Busqueda publica por servicio en una fase posterior.

Modelo:

```text
Empresa -> Servicios
```

Ejemplo:

```text
Aurisbel
  - Queques
  - Wedding Planner
  - Mesa dulce
```

## Tareas iniciales sugeridas

## Tarea 1: Admin demo de servicios

Objetivo:

Crear o mejorar la pantalla admin para que una empresa pueda ver y administrar varios servicios.

Alcance:

- `admin.html`
- `admin.js`
- `admin.css`

No tocar:

- `index.html`
- `app.js`
- `styles.css`

Debe incluir:

- Lista de servicios.
- Boton "Agregar servicio".
- Formulario demo para crear/editar servicio.
- Campos: nombre, categoria, tipos de evento, descripcion, precio desde, estado.
- Fotos con preview local si ya existe patron.

## Tarea 2: Perfil empresa demo

Objetivo:

Prototipar como se veria una empresa con varios servicios.

Alcance sugerido:

- Datos demo en `data/`.
- Render en admin o pagina publica segun indique Product/Architect.

## Tarea 3: Busqueda por servicio demo

Objetivo:

Preparar la UI para mostrar resultados por servicio, con link a la empresa.

Debe mostrar:

```text
Mesa dulce
por Aurisbel
Tambien ofrece: Queques, Wedding Planner
[Cotizar mesa dulce] [Ver perfil completo]
```

## Verificacion minima

- Abrir pagina afectada localmente.
- Probar desktop y mobile basico.
- Revisar consola sin errores.
- Confirmar que pagina publica principal sigue funcionando si fue tocada.

## Output esperado

- Cambios pequenos.
- Resumen de archivos tocados.
- Verificacion realizada.
- Riesgos o siguientes pasos.

