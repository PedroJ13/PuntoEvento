# TASK-081: Limpiar imagen vieja 1x1 de galeria QA

## Equipo asignado

QA / Infra Azure.

## Contexto

`TASK-079` valido que el perfil publico ya muestra el `coverUrl` real como primer slide del carrusel. Sin embargo, la segunda imagen del carrusel sigue siendo una imagen tecnica vieja de `1 x 1`, creada durante pruebas iniciales.

Esto no bloquea el funcionamiento, pero si afecta una demo externa si alguien presiona el boton siguiente del carrusel.

Servicio QA principal:

```text
companyId: company_c0f05305-6b1d-4ba0-b4c2-cd987c324bd2
companySlug: qa-company-register-test
serviceId: service_57b80edc-9bb4-43f8-b957-7ffa8959b934
serviceSlug: qa-moderacion-approve-20260528113350
```

Imagen vieja observada:

```text
.../gallery/upload_470f509b-5929-41d1-a1d2-c37efff9ee9b.png
```

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `chat-start/INFRA_AZURE.md`
- `docs/BACKLOG.md`
- `docs/API_CONTRACTS_MVP.md`
- `tasks/TASK-076-HANDOFF.md`
- `tasks/TASK-079-HANDOFF.md`
- `tasks/TASK-080-HANDOFF.md`

## Objetivo

Dejar el perfil publico QA listo para demo visual, evitando que el carrusel muestre la imagen vieja `1 x 1`.

## Opciones aceptables

Elige la opcion mas segura segun lo que permita el backend/datos actuales:

1. Reemplazar la imagen de galeria vieja por una imagen real o representativa.
2. Remover/despublicar la imagen vieja de galeria si existe una via segura.
3. Si no existe endpoint o flujo seguro para removerla, documentar el bloqueo y proponer la tarea tecnica minima necesaria.

## Validacion esperada

Despues de la limpieza/reemplazo, validar en Azure:

```text
https://zealous-field-08fdd720f.7.azurestaticapps.net/index.html#proveedor/qa-company-register-test/qa-moderacion-approve-20260528113350
```

Debe cumplirse:

- El primer slide sigue siendo el cover real `1200 x 800`.
- Al usar el boton siguiente, no aparece una imagen `1 x 1`.
- No hay imagenes rotas.
- No hay URLs duplicadas en miniaturas.
- No hay overflow horizontal desktop/mobile.
- `#inicio` y `#bodas` siguen cargando sin errores.

## Seguridad

- No incluir credenciales, cookies, SAS tokens ni invitation URLs en el handoff.
- No commitear imagenes usadas solo como insumo QA.
- No hacer commit ni push.
- Si usas `local-secrets/qa-admin.ps1`, confirmar que sigue ignorado por git.

## Fuera de alcance

- No cambiar codigo frontend/backend salvo que descubras que no hay forma segura de resolverlo solo con datos.
- No limpiar todos los datos QA.
- No cambiar el cover real aprobado.
- No tocar planes, ranking ni pagos.

## Entregable

Crear:

```text
tasks/TASK-081-HANDOFF.md
```

Debe incluir:

- Resultado general: aprobado / bloqueado.
- Opcion elegida: reemplazo, remocion, o bloqueo documentado.
- Endpoints/comandos usados, con secretos redactados.
- URLs publicas finales relevantes, sin SAS ni query strings sensibles.
- Evidencia de dimensiones de las imagenes del carrusel.
- Confirmacion visual de perfil, `#inicio` y `#bodas`.
- Riesgos restantes.
- Recomendacion para Product/Architect.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-081. Product/Architect debe leer tasks/TASK-081-HANDOFF.md.
```
