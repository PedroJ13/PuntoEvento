# Coordinacion entre chats/equipos del proyecto

## Objetivo

Coordinar los chats/equipos de Infra Azure, Web Dev y QA para que trabajen sobre la misma informacion y no tomen decisiones contradictorias.

## Recomendacion general

Usar archivos `.md` compartidos en el repositorio como fuente de verdad.

Cada chat/equipo debe leer:

- `EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md`
- `EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md`
- `EQUIPO_QA_NUEVO_ENFOQUE.md`
- `COORDINACION_EQUIPOS_CHATS.md`
- `REGISTRO_EMPRESAS.md`
- `NEXT_STEPS.md`

## Como comunicar a cada chat

## Chat Infra Azure

Mensaje sugerido:

```text
Lee estos archivos del repo antes de proponer infraestructura:
- EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md
- EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md
- EQUIPO_QA_NUEVO_ENFOQUE.md
- COORDINACION_EQUIPOS_CHATS.md

Tu responsabilidad es definir la arquitectura Azure para registro de empresas, login admin, carga de fotos, almacenamiento de empresas/servicios y publicacion. No asumas DB server tradicional si se puede resolver serverless/managed.
```

## Chat Web Dev

Mensaje sugerido:

```text
Lee estos archivos del repo antes de cambiar la web:
- EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md
- EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md
- EQUIPO_QA_NUEVO_ENFOQUE.md
- COORDINACION_EQUIPOS_CHATS.md

Tu responsabilidad es convertir el prototipo a modelo Empresa -> Servicios, crear registro/login/admin demo, y ajustar la busqueda publica para mostrar servicios con acceso al perfil completo de empresa.
```

## Chat QA

Mensaje sugerido:

```text
Lee estos archivos del repo antes de crear pruebas:
- EQUIPO_QA_NUEVO_ENFOQUE.md
- EQUIPO_WEB_DEV_NUEVO_ENFOQUE.md
- EQUIPO_INFRA_AZURE_NUEVO_ENFOQUE.md
- COORDINACION_EQUIPOS_CHATS.md

Tu responsabilidad es crear matriz de pruebas para registro, login, admin, multiples servicios por empresa, carga de fotos, busqueda publica y regresion de la pagina actual.
```

## Reglas de coordinacion

- Toda decision que afecte a mas de un equipo debe documentarse en un `.md`.
- Web Dev no debe inventar campos sin actualizar el modelo de datos.
- Infra no debe cambiar endpoints sin avisar a Web Dev y QA.
- QA debe probar contra criterios escritos, no contra supuestos.
- Los cambios de modelo deben versionarse.

## Fuente de verdad sugerida

Crear o mantener estos documentos:

```text
docs/
  product-model.md
  api-contract.md
  admin-flows.md
  qa-test-plan.md
  infra-azure.md
```

Por ahora se dejaron en la raiz para que sean faciles de encontrar.

## Cadencia recomendada

Antes de empezar un bloque:

1. Product/Admin define alcance.
2. Infra valida viabilidad.
3. Web Dev implementa contra contrato.
4. QA crea/actualiza casos.

Al cerrar un bloque:

1. Web Dev resume cambios.
2. Infra confirma impacto.
3. QA reporta resultado.
4. Se actualizan `.md` si cambio algo.

