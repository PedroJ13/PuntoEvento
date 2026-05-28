# TASK-082: QA Azure flujo completo MVP

## Equipo asignado

QA / Infra Azure.

## Contexto

Ya quedaron validados en Azure:

- Pagina publica por servicios.
- Perfil con servicio seleccionado.
- Carrusel con `coverUrl` real primero.
- Limpieza de la imagen vieja `1 x 1` de galeria QA.
- Rotacion de `ADMIN_PASSWORD`.
- CRUD/API de servicios propios, upload, confirmacion y moderacion interna en tareas anteriores.

Ahora necesitamos responder una pregunta practica de Product Owner:

```text
Puede probarse un flujo completo de crear/ingresar empresa, crear servicio, subir imagen, aprobar y verlo publico?
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/QA_TEST_PLAN.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-079-HANDOFF.md`
- `tasks/TASK-080-HANDOFF.md`
- `tasks/TASK-081-HANDOFF.md`
- `tools/test-company-invite-flow.ps1`
- `index.html`
- `panel.html`
- `admin.html`

## Objetivo

Ejecutar una matriz MVP enfocada contra Azure real y entregar una respuesta clara:

- `Listo para prueba Product Owner`, o
- `Listo parcialmente con pasos API/manuales`, o
- `Bloqueado`.

## Ambiente

Base Azure:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Flujo minimo a validar

Usa datos QA nuevos y unicos para no pisar la empresa QA principal.

1. Registro de empresa:
   - Validar si puede hacerse desde UI publica (`#empresas`) o si hoy es API-only.
   - Si usas API, ejecutar `POST /api/companies/register`.
2. Acceso de empresa:
   - Crear invitacion interna.
   - Aceptar invitacion.
   - Confirmar sesion con `GET /api/companies/me`.
3. Panel empresa:
   - Abrir `panel.html` en Azure.
   - Confirmar si usa API real con sesion o si todavia funciona solo como demo/local.
   - Crear o validar servicio propio con API si UI no esta integrada.
4. Servicio propio:
   - Crear servicio.
   - Editar servicio.
   - Desactivar/eliminar servicio de prueba o confirmar comportamiento.
5. Imagen:
   - Firmar upload.
   - Subir imagen real pequena pero valida.
   - Confirmar upload.
6. Moderacion interna:
   - Aprobar empresa, servicio e imagen pendiente con endpoints internos.
7. Publicacion:
   - Confirmar que el servicio aprobado aparece en `/api/public/services`.
   - Confirmar que aparece visualmente en `#inicio` o `#bodas` si cumple filtros.
   - Confirmar que el perfil publico de empresa/servicio abre y renderiza imagen real.
8. Seguridad/regresion:
   - Sin secretos en UI.
   - Sin errores JS no controlados.
   - Mobile minimo 390px.
   - Servicio draft/pending/inactive no aparece publico, si se puede validar sin ensuciar demasiado datos.

## Puntos que debes clasificar

En el handoff, separar claramente:

- Flujos que Product Owner puede probar en navegador sin tocar API.
- Flujos que hoy requieren PowerShell/API/admin manual.
- Flujos bloqueados o incompletos.

Esta distincion es clave para decidir si Pedro puede probarlo directamente o si primero hace falta Web Dev.

## Seguridad

- No pegar credenciales, cookies, tokens, SAS, invite URLs ni passwords.
- Redactar headers y respuestas sensibles.
- Usar `local-secrets/qa-admin.ps1` solo si lo necesitas y confirmar que sigue ignorado.
- No hacer commit ni push.
- No borrar datos reales.
- Si creas datos QA, usar nombres/emails claramente QA.

## Entregable

Crear:

```text
tasks/TASK-082-HANDOFF.md
```

Debe incluir:

- Resultado general: listo / parcial / bloqueado.
- Tabla de casos probados con PASS/FAIL/PARCIAL.
- Datos QA creados: companySlug, serviceSlug e ids necesarios, sin secretos.
- Que se probo por navegador y que se probo por API/script.
- Evidencia de publicacion visual.
- Bugs P0/P1/P2 encontrados.
- Riesgos aceptables.
- Recomendacion exacta:
  - si Product Owner ya puede probar y en que URLs;
  - o si hay que crear una tarea Web Dev/Backend antes.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-082. Product/Architect debe leer tasks/TASK-082-HANDOFF.md.
```
