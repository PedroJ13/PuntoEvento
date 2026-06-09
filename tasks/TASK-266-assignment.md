# TASK-266: QA Azure - catalogo real vacio sin referencias

## Equipo asignado

QA.

## Contexto

Depende de `TASK-265`.

`TASK-264` corrigio localmente el P2 detectado en `TASK-263`: con API publica OK y catalogo real vacio, no deben aparecer paquetes/proveedores estaticos de referencia.

## Tarea

Revalidar en Azure que el catalogo real vacio no muestra referencias estaticas debajo del estado vacio.

## Alcance

- Pagina publica `/`.
- Resultados `/#bodas`.
- Ruta de proveedor inexistente o sin catalogo real, si aplica.
- API publica `/api/public/services?limit=50`.

## No tocar

- No crear empresas.
- No enviar leads.
- No usar credenciales reales.
- No limpiar datos.
- No cambiar codigo.

## Verificacion

- Azure sirve `app.js?v=32`.
- `/api/public/services?limit=50` devuelve `0` items.
- `/#bodas` muestra estado vacio controlado.
- No aparecen:
  - `Paquetes de boda`
  - `Comparacion rapida de precios`
  - `Casa Arboleda Eventos`
  - `Bocados y Copas`
  - `Luz Viva Producciones`
  - `Flor de Abril`
  - `Captura Dorada`
  - `Nexo Corporativo`
- Regresion basica: home, registro empresa, panel y admin cargan.

## Handoff esperado

Crear `tasks/TASK-266-HANDOFF.md` con:

- Resultado aprobado/no aprobado.
- Assets Azure observados.
- Evidencia de catalogo vacio sin referencias.
- P0/P1/P2/P3.
- Recomendacion go/no-go para test con primera empresa real.
