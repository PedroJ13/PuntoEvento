# Reinicio controlado del proyecto

## Objetivo

Reiniciar la forma de trabajar en Punto Evento para sacarle mas provecho a Codex, sin perder el codigo existente ni la pagina principal que ya funciona bien.

## Principio

El reinicio no significa borrar.

Significa:

- Congelar lo que funciona como baseline.
- Documentar arquitectura y decisiones.
- Separar responsabilidades.
- Crear backlog pequeno.
- Trabajar por ramas/tareas pequenas.

## Estado actual

El proyecto ya tiene:

- Pagina publica funcional.
- Datos estaticos demo.
- Admin demo.
- Azure Functions.
- Documentos de registro, infra, QA y coordinacion.
- Hosting en Azure Static Web Apps.

## Que se conserva

Se conserva la pagina principal actual:

- Home.
- Busqueda.
- Landing de bodas.
- Ficha de proveedor.
- Carrusel.
- Estilo visual base.

Esta parte solo debe cambiar con tareas puntuales, no con una reescritura completa.

## Que se replantea

Se replantea:

- Registro de empresas.
- Login administrativo.
- Panel de empresa.
- Modelo de multiples servicios por empresa.
- Upload real de imagenes.
- Busqueda por servicio.
- Planes destacados.

## Estructura objetivo gradual

No mover archivos de golpe.

Fase 1:

```text
/
  pagina publica actual
  admin actual
  api actual
  docs/
```

Fase 2:

```text
/
  frontend/
    public-site/
    admin/
  api/
  data/
  assets/
  docs/
```

La fase 2 requiere revisar Azure Static Web Apps antes de mover archivos.

## Plan de reinicio

## Paso 1: Baseline

- Confirmar que la pagina publica actual funciona.
- Documentar rutas actuales.
- Crear un commit de baseline antes de cambios grandes.

## Paso 2: Modelo

- Acordar modelo `Empresa -> Servicios`.
- Definir campos minimos.
- Definir estados: draft, pending, published, rejected.

## Paso 3: Admin

- Crear flujo admin por pantallas:
  - registro,
  - login,
  - dashboard,
  - perfil empresa,
  - servicios,
  - editor de servicio,
  - fotos,
  - plan.

## Paso 4: API

- Definir contratos.
- Implementar endpoints pequenos.
- Validar seguridad y permisos.

## Paso 5: QA

- Crear matriz de pruebas.
- Probar regresion publica.
- Probar flujo admin.

## No hacer aun

- No migrar a framework grande sin razon.
- No meter DB server tradicional si Azure serverless alcanza.
- No rehacer la home actual.
- No mezclar pagos con registro inicial.

