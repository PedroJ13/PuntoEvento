# TASK-071: QA local pagina publica conectada a servicios

## Equipo asignado

QA.

## Contexto

Web Dev completo `TASK-070` conectando la pagina publica a servicios publicados:

- Fuente principal: `GET /api/public/services`.
- Perfil principal: `GET /api/public/companies/{slug}`.
- Fallback local/demo: `data/providers.json` y `data/packages.json`.
- Nueva ruta compatible: `#proveedor/{empresa}/{servicio}`.

No se debe hacer commit/push/deploy de este bloque hasta pasar QA local.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-069-HANDOFF.md`
- `tasks/TASK-070-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`
- `data/providers.json`
- `data/packages.json`
- `data/categories.json`
- `data/event-types.json`

## Objetivo

Validar localmente que la pagina publica sigue funcionando y ahora presenta servicios publicados con contexto de empresa.

## Alcance de pruebas

Validar estructura/sintaxis:

- `node --check app.js`.
- No hay errores no controlados en consola al cargar la pagina.

Validar home:

- `#inicio` carga correctamente.
- Mantiene look actual de Punto Evento.
- Destacados muestran servicios y empresa asociada.
- Si API esta disponible, usa servicios publicados.
- Si API falla, usa fallback demo y muestra aviso discreto.

Validar listado:

- `#bodas` muestra resultados por servicio, no solo por empresa.
- Cada card incluye:
  - nombre del servicio;
  - empresa;
  - categoria;
  - provincia/zona si existe;
  - precio desde si existe;
  - imagen/cover si existe;
  - accion para cotizar;
  - accion/link para abrir perfil de empresa.
- Busqueda/filtros no rompen la pagina.
- Texto largo no se sale de cards/botones.

Validar perfil:

- `#proveedor/{empresa}` sigue funcionando.
- `#proveedor/{empresa}/{servicio}` abre perfil y destaca el servicio seleccionado.
- Perfil muestra varios servicios publicados de la empresa cuando existen.
- Carrusel/galeria sigue funcionando.
- Fallback demo conserva perfiles existentes.

Validar fallback:

- Simular API no disponible si es posible.
- Confirmar que la pagina no queda en blanco.
- Confirmar que el aviso demo es discreto y no invade la UI.

Validar responsive:

- Desktop.
- Mobile estrecho.
- Header/nav no se rompe.
- Cards, botones y titulos no tienen overflow obvio.

## Datos/API

Puedes probar contra:

```text
http://127.0.0.1:4173/index.html
```

o el servidor local que este activo.

Si el entorno local no puede llamar a Azure por CORS/ruta relativa, valida fallback y documenta la limitacion. No metas credenciales ni secretos.

## Criterios de aceptacion

- La pagina publica no queda en blanco.
- Home/listado/perfil cargan.
- Servicios se representan como unidad principal.
- Empresa asociada es visible.
- Rutas hash existentes no se rompen.
- Fallback demo funciona.
- Mobile y desktop son razonables.
- No hay errores JS no controlados.
- No se exponen datos privados en UI.

## Fuera de alcance

- No hacer deploy.
- No modificar codigo salvo que encuentres un bug bloqueante y lo documentes.
- No probar pagos/ranking.
- No probar login/panel empresa.
- No limpiar datos QA.

## Entregable

Crear:

```text
tasks/TASK-071-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- Navegador/URL local usada.
- Rutas probadas.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Hallazgos con archivo/seccion si aplica.
- Riesgos restantes.
- Recomendacion clara:
  - listo para commit/push, o
  - requiere ajuste Web Dev antes de commit.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-071. Product/Architect debe leer tasks/TASK-071-HANDOFF.md.
```
