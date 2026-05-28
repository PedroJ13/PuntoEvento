# TASK-072: QA/Infra Azure pagina publica conectada a servicios

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-071` aprobo localmente la pagina publica conectada a servicios con observaciones.

Product/Architect debe hacer commit/push del bloque frontend antes de que ejecutes esta tarea. Espera a que el deploy de Azure Static Web Apps termine para el commit que modifica:

- `index.html`
- `app.js`
- `styles.css`

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `tasks/TASK-069-HANDOFF.md`
- `tasks/TASK-070-HANDOFF.md`
- `tasks/TASK-071-HANDOFF.md`
- `index.html`
- `app.js`
- `styles.css`

## Objetivo

Validar en Azure real que la pagina publica consume los endpoints publicos por servicio y mantiene una experiencia usable en desktop/mobile.

## URL base

Usar la Static Web App actual:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Precondicion

Confirmar que el workflow/deploy termino para el commit que conecta el frontend a:

```text
/api/public/services
/api/public/companies/{slug}
```

## Alcance de pruebas

Validar carga/API:

- Abrir `/index.html#inicio`.
- Confirmar que no aparece el aviso de fallback demo cuando la API responde.
- Confirmar en Network/observacion funcional que se consumen:
  - `/api/public/services`
  - `/api/public/companies/{slug}` al abrir perfil.
- Confirmar que no hay errores JS no controlados en consola si el entorno lo permite.

Validar home:

- Mantiene look actual de Punto Evento.
- Destacados muestran servicios publicados reales con empresa asociada.
- Imagenes publicas renderizan si hay `coverUrl`.
- No hay overflow horizontal.

Validar listado:

- Abrir `#bodas`.
- Confirmar que los resultados son servicios.
- Cada card debe mostrar:
  - servicio;
  - empresa;
  - categoria;
  - provincia/zona;
  - precio desde si existe;
  - imagen si existe;
  - accion de cotizar;
  - accion/link para ver empresa.
- Probar filtros/busqueda disponibles.
- Confirmar que no se muestran servicios rechazados/no publicados conocidos.

Validar perfil:

- Abrir una ruta con empresa publicada real, por ejemplo:

```text
/index.html#proveedor/qa-company-register-test
```

- Abrir una ruta con empresa y servicio publicado real si tienes slug:

```text
/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

- Confirmar que carga perfil de empresa desde API.
- Confirmar que muestra servicios publicados de esa empresa.
- Confirmar que destaca el servicio seleccionado cuando aplique.
- Confirmar que carrusel/galeria no se rompe.

Validar cotizacion:

- Desde un servicio, abrir accion de cotizar.
- Confirmar que el drawer/modal abre y no rompe la pagina.

Validar responsive:

- Desktop.
- Mobile estrecho.
- Sin overflow horizontal.
- Header/nav usable.
- Cards y botones no se salen.

Validar seguridad UI:

- No mostrar:
  - emails privados;
  - `sessionHash`;
  - `tokenHash`;
  - `partitionKey`;
  - `rowKey`;
  - `pendingBlobName`;
  - `uploads-pending`;
  - `sig=`;
  - `sv=`;
  - secrets.

## Observacion conocida de TASK-071

En fallback demo, `#proveedor/{empresa}/{servicio}` puede no destacar el servicio seleccionado porque conserva el perfil demo legacy.

No bloquear por eso si en Azure/API real el servicio seleccionado si se destaca.

## Fuera de alcance

- No cambiar codigo.
- No limpiar datos QA.
- No probar login/panel empresa.
- No probar pagos/ranking.
- No rotar credenciales admin en esta tarea.

## Entregable

Crear:

```text
tasks/TASK-072-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / aprobado con observaciones / bloqueado.
- URL Azure usada.
- Commit/deploy validado si lo tienes visible.
- Rutas probadas.
- Evidencia visual resumida o screenshots si el entorno lo permite.
- Confirmacion de consumo API o evidencia funcional.
- Hallazgos con archivo/seccion si aplica.
- Riesgos restantes.
- Recomendacion:
  - listo para siguiente bloque de producto, o
  - requiere ajuste Web Dev antes de avanzar.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-072. Product/Architect debe leer tasks/TASK-072-HANDOFF.md.
```
