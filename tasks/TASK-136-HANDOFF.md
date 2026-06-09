# TASK-136 Handoff - Deploy admin UI v14

## Resultado general

Aprobado.

Se desplego el fix de admin UI de `TASK-135` a Azure Static Web Apps. Azure ya sirve `admin.js?v=14` y mantiene `admin.css?v=8`.

QA puede reintentar la prueba enfocada de admin UI post-fix.

## Branch / commit desplegado

Branch:

```text
main
```

Commit previo:

```text
49bb02b
```

Commit desplegado:

```text
4a11fa0fa2b4767ea647dd510e7027f288324454
```

Mensaje:

```text
Deploy admin UI v14 fix
```

Archivos incluidos:

```text
admin.html
admin.js
```

No se tocaron API, reglas backend, credenciales ni datos QA.

## Ambiente

```text
Azure Static Web Apps: https://zealous-field-08fdd720f.7.azurestaticapps.net
Fecha UTC de verificacion: 2026-05-30T16:56Z aprox.
```

## Versiones observadas en Azure

Consulta directa contra `/admin.html`:

| Asset | Resultado |
| --- | --- |
| `admin.js?v=14` | OK |
| `admin.css?v=8` | OK |

Assets directos:

| URL | Status |
| --- | ---: |
| `/admin.html` | 200 |
| `/admin.js?v=14` | 200 |
| `/admin.css?v=8` | 200 |

## Smoke minimo

Se valido:

```text
/admin.html contiene admin.js?v=14
/admin.html contiene admin.css?v=8
/admin.js?v=14 contiene function internalSections
/admin.js?v=14 contiene function internalItemsFromResponse
GET /api/internal/companies/pending con X-Punto-Admin-Credential -> 200
```

No se imprimieron credenciales ni headers completos.

## Checks locales previos

Se uso el Node bundled del workspace porque el alias `node` del entorno WindowsApps falla con `Access is denied`.

```text
node --check admin.js -> OK
git diff --check -- admin.html admin.js -> OK, solo warnings LF/CRLF esperados
```

## Acciones ejecutadas

```text
git add -- admin.html admin.js
git commit -m "Deploy admin UI v14 fix"
git push origin main
```

El push a `main` disparo el deploy. La confirmacion final se hizo contra la URL publicada.

## Riesgos / pendientes

- No se repitio toda la matriz QA de admin; solo se confirmo deploy/versiones y smoke minimo.
- Quedan cambios locales de docs/tareas no incluidos en este commit.
- QA debe confirmar que el tab `Modelo nuevo` ya carga pendientes reales y que el expediente deja de quedarse en cero.

## Recomendacion

QA puede reintentar la prueba admin UI post-fix enfocada en:

- login admin;
- tab `Modelo nuevo`;
- contadores de Companies/Services/Uploads reales;
- expediente por empresa;
- mensajes/bloqueos visuales de aprobacion.
