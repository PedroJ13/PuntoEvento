# TASK-252 HANDOFF

## Resumen

Se implementó fallback público sin catálogo de referencia en productivo cuando falla `/api/public/services`.

- En host productivo, si la API pública falla:
  - `services = []`
  - `serviceDataSource = "error"`
  - se muestra el estado controlado `No pudimos cargar los servicios publicados. Intenta de nuevo en unos minutos.`
- En local o con `?demo=local`, se conserva el fallback de referencia para desarrollo.
- El fallback de perfil público también evita caer a ficha de referencia en productivo si falla la API de empresa.

## Archivos tocados

- `app.js`

## Política implementada

- Demo/referencia permitido:
  - `localhost`
  - `127.0.0.1`
  - archivo local sin hostname
  - query explícito `?demo=local`
- Productivo:
  - cualquier otro hostname muestra estado controlado sin renderizar servicios de referencia.

## Verificación

- `node --check app.js`
- Playwright smoke con host productivo simulado `punto-evento.test`:
  - API OK: `apiOkHasPublished: 1`
  - API fallida productiva: `prodFailControlled: true`
  - Sin cards de referencia en productivo: `prodFailNoDemoCard: true`
  - API fallida local mantiene referencia: `localFailUsesReference: true`

## Riesgos

- Si la API falla en Azure, el listado queda vacío por diseño hasta que el servicio responda.
- El fallback de referencia sigue existiendo para desarrollo local; los nombres internos `demo` permanecen por compatibilidad.

## Pendientes

- QA debe validar en Azure con una falla real o simulada de `/api/public/services`.

## Siguiente recomendación

Después del deploy, probar `#bodas` en Azure con API OK y revisar logs si aparece el estado controlado.
