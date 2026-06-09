# TASK-251: Web Dev - ocultar legacy/demo del admin productivo

## Equipo asignado

Web Dev.

## Contexto

QA Flujo MVP y Copy / Gramatica detectaron que el admin conserva superficies visibles de `Legacy`, `Demo`, `Servicios demo`, `Ver modo demo local` y textos tecnicos como `Company -> Services`, `uploads`, `Cover` o `preview`.

Decision Product / Architect / Release:

En Azure productivo/pre-lanzamiento, el admin debe enfocarse en el flujo nuevo de empresas y servicios. Legacy/demo puede conservarse solo para local o bajo bandera clara, pero no como superficie normal de operacion.

## Tarea

Ocultar superficies legacy/demo del admin productivo y limpiar microcopy tecnico visible en admin.

## Alcance

- `admin.html`
- `admin.js`
- `admin.css` solo si hace falta para ocultar/ordenar.

Cambios esperados:

- Ocultar tabs/controles legacy/demo en modo productivo.
- Mantenerlos disponibles solo si ya existe modo local/demo claro o query param segura.
- Reemplazar terminos tecnicos visibles:
  - `Legacy` -> `Flujo anterior` o no visible.
  - `Company -> Services` -> `Empresas y servicios`.
  - `uploads pendientes` -> `imagenes pendientes`.
  - `Cover` -> `Portada`.
  - `Sin preview` -> `Sin vista previa`.
  - `Preview no disponible` -> `Vista previa no disponible`.

## No tocar

- No cambiar endpoints admin.
- No cambiar credenciales ni auth.
- No eliminar codigo legacy si todavia sirve para soporte local; solo no exponerlo en productivo normal.
- No redisenar admin completo.

## Verificacion

- Abrir `admin.html` en modo normal.
- Confirmar que no se ven tabs/controles demo/legacy innecesarios.
- Login admin sigue funcionando.
- Vista de expedientes funciona.
- Acciones aprobar/rechazar siguen disponibles.
- No aparecen terminos tecnicos listados en superficies normales.

## Handoff esperado

Crear `tasks/TASK-251-HANDOFF.md` con:

- Superficies ocultadas.
- Textos reemplazados.
- Modo en que se conserva legacy/demo si aplica.
- Pruebas realizadas.
- Riesgos.
