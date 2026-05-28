# TASK-073: Web Dev estado vacio filtros sin resultados

## Equipo asignado

Frontend / Web Dev.

## Contexto

`TASK-072` aprobo en Azure la pagina publica conectada a servicios publicados. La experiencia ya consume datos reales desde:

```text
/api/public/services
/api/public/companies/{slug}
```

Quedo un hallazgo P2:

```text
Cuando los filtros no tienen coincidencias, `filteredServices()` devuelve todos los servicios.
```

Esto puede confundir porque el usuario cree que aplico un filtro, pero ve todos los resultados.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/WEB_DEV.md`
- `docs/BACKLOG.md`
- `tasks/TASK-070-HANDOFF.md`
- `tasks/TASK-071-HANDOFF.md`
- `tasks/TASK-072-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Ajustar la pagina publica para que los filtros sin coincidencias muestren un estado vacio claro y no todos los servicios.

## Alcance

1. Cambiar la logica de filtros para distinguir:
   - sin filtros activos: mostrar todos los servicios;
   - filtros activos con coincidencias: mostrar coincidencias;
   - filtros activos sin coincidencias: mostrar estado vacio.
2. El estado vacio debe ser visualmente discreto y profesional.
3. Debe aparecer en `#bodas` cuando no hay resultados.
4. Debe mantener home, perfil y fallback demo sin romperse.
5. Si aplica, limpiar o ajustar el toast para que no prometa resultados cuando no hay coincidencias.

## Criterios de aceptacion

- `#bodas` sin filtros muestra servicios disponibles.
- `#bodas` con filtro que coincide muestra solo coincidencias.
- `#bodas` con filtro que no coincide muestra estado vacio, no todos los servicios.
- No hay errores JS no controlados.
- No hay overflow horizontal en desktop/mobile.
- El mensaje vacio no expone detalles tecnicos ni menciona API.
- Fallback demo sigue funcionando si API no responde.

## Fuera de alcance

- No cambiar contratos API.
- No implementar filtros server-side.
- No tocar admin/panel empresa.
- No subir imagenes reales en esta tarea.
- No hacer deploy.

## Verificacion minima

Validar localmente:

- `node --check app.js`.
- `#inicio`.
- `#bodas` sin filtros.
- `#bodas` con filtro que coincide.
- `#bodas` con filtro que no coincide.
- Mobile estrecho basico.

## Entregable

Crear:

```text
tasks/TASK-073-HANDOFF.md
```

Debe incluir:

- Resultado general.
- Archivos modificados.
- Casos probados.
- Estado visual del empty state.
- Riesgos restantes.
- Recomendacion:
  - listo para QA local, o
  - requiere ajuste adicional.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-073. Product/Architect debe leer tasks/TASK-073-HANDOFF.md.
```
