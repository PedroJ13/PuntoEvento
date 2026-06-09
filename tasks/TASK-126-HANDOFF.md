# TASK-126: Admin interno - moderacion por expediente de empresa

## Estado

Completada.

## Resultado general

La pestana `Modelo nuevo` del admin ahora incluye una vista por expediente de empresa. Las listas globales quedan como resumen/entrada y las acciones de aprobar/rechazar se concentran en el expediente seleccionado, con bloqueos visuales para dependencias.

## Archivos modificados

- `admin.html`
- `admin.js`
- `admin.css`
- `tasks/TASK-126-HANDOFF.md`

## Flujo de expediente

1. Admin carga `Modelo nuevo`.
2. Se mantienen contadores globales de empresas, servicios y uploads.
3. Se muestra una lista `Empresas con actividad`.
4. Al seleccionar una empresa, el expediente muestra:
   - detalle de empresa;
   - servicios asociados;
   - imagenes/uploads asociados.
5. Las listas globales muestran `Ver expediente` en vez de aprobar/rechazar directamente.

## Acciones bloqueadas / permitidas

- Empresa:
  - aprobar/rechazar permitido desde expediente.
- Servicio:
  - aprobar bloqueado si la empresa no esta `published`;
  - rechazar permitido.
- Upload:
  - aprobar bloqueado si la empresa no esta `published`;
  - si `scope=service`, aprobar bloqueado si el servicio no esta `published`;
  - rechazar permitido.

Cuando una accion se bloquea, la UI muestra nota contextual.

## Dependencias API

- La UI bloquea acciones invalidas cuando tiene datos suficientes, pero TASK-127 debe mantener la validacion real en API.
- Si los listados internos no devuelven `companyStatus` o `serviceStatus`, la UI puede inferir desde los items cargados; QA debe confirmar que los endpoints enriquecen datos suficientes para expedientes reales.
- Los listados actuales son pendientes/globales; si se requiere expediente completo de empresas publicadas con servicios/uploads no pendientes, haria falta endpoint dedicado por `companyId`.

## Verificacion

- `node --check admin.js`: OK.
- `git diff --check -- admin.html admin.js admin.css`: OK, solo avisos LF -> CRLF.
- Smoke navegador local:
  - existe contenedor `[data-company-case]`;
  - existe lista `[data-case-company-list]`;
  - admin demo carga sin error.
- Captura:
  - `tasks/generated/TASK-126-mobile.png`.

## Recomendacion QA

Validar en Azure con credencial admin real:

- cargar `Modelo nuevo`;
- seleccionar una empresa pendiente;
- confirmar que servicios/uploads quedan dentro del expediente;
- confirmar que aprobar servicio se bloquea si empresa no esta publicada;
- confirmar que aprobar upload de servicio se bloquea si empresa o servicio no estan publicados;
- confirmar que las listas globales ya no invitan a aprobar fuera de contexto.
