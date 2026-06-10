# TASK-281: QA Azure - revalidar panel empresa desde dominio propio

## Equipo asignado

QA.

## Contexto

Incidente productivo reportado el 2026-06-09:

```text
Una empresa real no pudo guardar/enviar un servicio desde el panel empresa.
La UI mostro: "No se pudo guardar el servicio. Revisa los datos e intentalo de nuevo."
```

Esto ocurrio poco despues de corregir el incidente de registro desde dominio propio en `TASK-279` / `TASK-280`.

`TASK-279` actualizo:

```text
ALLOWED_ORIGINS=https://puntoeventocr.com,https://www.puntoeventocr.com,https://zealous-field-08fdd720f.7.azurestaticapps.net
APP_PUBLIC_URL=https://puntoeventocr.com
```

`TASK-280` aprobo registro publico desde dominio propio, pero no revalido el panel autenticado completo ni sus endpoints privados.

## Tarea

Reproducir y clasificar el fallo de guardar/enviar servicio desde el panel empresa en dominio propio.

## Alcance

Validar desde:

```text
https://puntoeventocr.com/panel.html
https://www.puntoeventocr.com/panel.html
```

Con una empresa QA/controlada o con la empresa afectada si Product provee acceso sin exponer secretos.

Reproducir:

1. Login o sesion activa de empresa.
2. Carga de `Mi empresa`.
3. Crear servicio minimo sin imagen.
4. Guardar servicio.
5. Editar servicio guardado.
6. Subir portada PNG/JPG valida menor al limite.
7. Confirmar upload.
8. Enviar servicio a revision.

## Captura obligatoria

En DevTools/Network o Playwright, documentar para cada fallo:

- URL exacta de la pagina (`apex`, `www` o hostname viejo).
- Endpoint fallido.
- Metodo HTTP.
- Status HTTP.
- Response body.
- Request headers relevantes:
  - `Origin`
  - `Referer`
  - si la cookie `pe_company_session` se envia a `/api`
- Archivo probado:
  - extension;
  - MIME si es visible;
  - tamano aproximado.

Endpoints a observar:

```text
GET /api/companies/me
GET /api/companies/me/services
POST /api/companies/me/services
PATCH /api/companies/me/services/{serviceId}
POST /api/uploads/sign
POST /api/uploads/confirm
POST /api/companies/me/services/{serviceId}/submit-review
```

## Clasificacion para siguientes equipos

Segun el status HTTP capturado:

- `403`: crear siguiente tarea para `Infra Azure` revisando `ALLOWED_ORIGINS`, dominio efectivo, `Origin` y `Referer` en endpoints privados.
- `401`: crear siguiente tarea para `Backend/API` si la sesion/cookie no se valida, o `QA/Product` si es sesion expirada/flujo de login.
- `400`, `409`, `413`, `415` o `500`: crear siguiente tarea para `Backend/API` con payload/response redactado.
- Request correcta pero UX confusa o error generico sin detalle: crear siguiente tarea para `Web Dev` para mostrar error accionable sin exponer detalles tecnicos.
- Si solo falla con una imagen especifica: clasificar validacion de archivo y abrir `Backend/API` o `Web Dev` segun response.

## No tocar

- No implementar codigo.
- No cambiar Azure config.
- No imprimir credenciales, cookies completas, tokens, correos privados ni datos reales sensibles.
- No publicar servicios reales durante la prueba.
- No dejar empresas/servicios QA publicados.

## Criterio de aprobacion

QA puede cerrar como aprobado solo si:

- crear servicio;
- guardar;
- subir portada;
- confirmar upload;
- enviar a revision;

funcionan desde dominio propio sin errores P0/P1.

Si falla, el handoff debe indicar con precision el siguiente equipo responsable y la tarea sugerida.

## Handoff esperado

Crear `tasks/TASK-281-HANDOFF.md` con:

- Resultado final: aprobado/no aprobado.
- Tabla de endpoints observados con status.
- Evidencia redactada del fallo si existe.
- Clasificacion por severidad.
- Recomendacion concreta:
  - `Infra Azure`,
  - `Backend/API`,
  - `Web Dev`,
  - o cierre sin accion.
