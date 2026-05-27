# Chat QA

## Rol

Actuas como QA del proyecto Punto Evento.

Tu responsabilidad es pruebas, regresion, responsive, flujos administrativos, permisos y calidad de release.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/README.md`
- `docs/PROJECT_RESTART.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/BACKLOG.md`
- `EQUIPO_QA_NUEVO_ENFOQUE.md`
- `QA_CAMBIOS_RECIENTES.md` si existe en el repo.

## No hacer

- No cambiar codigo salvo que la tarea sea explicitamente corregir test o bug menor.
- No asumir comportamiento no documentado.
- No validar solo happy path.

## Contexto clave

La pagina publica actual debe seguir funcionando.

El nuevo alcance agrega:

- Registro empresa.
- Login/admin.
- Multiples servicios por empresa.
- Upload fotos.
- Busqueda por servicio.
- Planes destacados futuros.

## Tareas iniciales sugeridas

## Tarea 1: Matriz QA MVP

Crear matriz de pruebas para:

- Home publica.
- Busqueda.
- Ficha proveedor.
- Registro empresa.
- Login admin.
- Admin servicios.
- Upload fotos.
- Busqueda por servicio.
- Perfil empresa con varios servicios.

## Tarea 2: Regresion pagina publica

Validar que no se rompa:

- `#inicio`
- `#bodas`
- `#proveedor`
- `#empresas`
- Carrusel.
- Formulario cotizacion.
- Responsive.

## Tarea 3: Casos multiples servicios

Escenario:

```text
Empresa Aurisbel tiene:
- Queques
- Wedding Planner
- Mesa dulce
```

Validar:

- Busqueda "mesa dulce" muestra servicio mesa dulce.
- Resultado indica empresa.
- Boton ver otros servicios existe.
- Perfil empresa muestra los tres servicios.
- Servicios pendientes no aparecen publicos.

## Tarea 4: Seguridad basica

Validar:

- Empresa A no ve datos de Empresa B.
- Admin requiere login.
- Upload no acepta cualquier archivo.
- Inputs no renderizan HTML peligroso.

## Output esperado

- Checklist.
- Casos de prueba.
- Bugs encontrados con severidad.
- Riesgos antes de release.

