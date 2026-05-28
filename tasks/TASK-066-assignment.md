# TASK-066: QA Azure render de imagen publica

## Equipo asignado

QA.

## Contexto

`TASK-065` resolvio el acceso publico a imagenes aprobadas en Azure Blob Storage:

- Storage Account `storagepuntoevento`: `allowBlobPublicAccess=true`.
- Container `public`: `publicAccess=blob`.
- Container `uploads-pending`: privado.
- Una URL real de `TASK-064` paso de `409` a `200 OK`.

Antes de continuar con endpoints publicos por servicio, necesitamos confirmar que una imagen publicada se puede renderizar en navegador como imagen, no solo responder por HTTP.

## Archivos que debes leer

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/BACKLOG.md`
- `docs/DECISION_LOG.md`
- `tasks/TASK-064-HANDOFF.md`
- `tasks/TASK-065-HANDOFF.md`

## Objetivo

Validar en Azure/navegador que `publicBlobUrl` de un upload aprobado:

- responde `200`,
- tiene `Content-Type` de imagen,
- renderiza correctamente en un `<img>`,
- no requiere SAS,
- no permite leer imagenes pendientes desde `uploads-pending`.

## URL de referencia

Usa la URL publicada en `tasks/TASK-065-HANDOFF.md` o cualquier `publicBlobUrl` aprobado equivalente.

No pegues SAS tokens, cookies ni secretos en el handoff.

## Alcance de pruebas

1. Abrir el `publicBlobUrl` directo en navegador.
2. Confirmar que se ve la imagen y no una respuesta XML/error.
3. Validar por PowerShell o navegador:
   - status `200`;
   - `Content-Type` esperado, por ejemplo `image/png`;
   - URL sin query string/SAS.
4. Crear una prueba HTML minima local o usar consola del navegador para montar:

```html
<img src="PUBLIC_BLOB_URL" alt="QA public blob">
```

5. Confirmar que la imagen renderiza como etiqueta `<img>`.
6. Probar que una URL de `uploads-pending` conocida o estimada no es accesible anonimamente.
7. Confirmar que listado anonimo del container `public` no esta disponible, si es facil repetirlo.

## Criterios de aceptacion

- `publicBlobUrl` aprobado renderiza visualmente.
- No hay SAS ni token en la URL.
- `uploads-pending` sigue privado.
- No se detecta listado anonimo del container `public`.
- No hay cambios de codigo.

## Fuera de alcance

- No modificar Storage.
- No limpiar blobs QA.
- No probar UI final de la pagina publica.
- No implementar endpoints publicos.

## Entregable

Crear:

```text
tasks/TASK-066-HANDOFF.md
```

Debe incluir:

- Resultado general.
- URL base/host probado, redactando cualquier dato sensible si aplica.
- Evidencia de render en navegador o prueba HTML.
- Status HTTP y `Content-Type`.
- Resultado de prueba contra `uploads-pending`.
- Hallazgos o riesgos restantes.
- Recomendacion:
  - listo para Backend API de endpoints publicos por servicio, o
  - requiere ajuste Infra.

## Nota para coordinacion

Al terminar, avisar en el chat de Product/Architect:

```text
Termine TASK-066. Product/Architect debe leer tasks/TASK-066-HANDOFF.md.
```
