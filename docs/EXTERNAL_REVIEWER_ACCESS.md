# Acceso para revisor externo

## Objetivo

Permitir que una persona externa revise el repositorio Punto Evento de forma segura, sin compartir credenciales, secretos ni accesos innecesarios.

Repo remoto actual:

```text
https://github.com/PedroJ13/PuntoEvento.git
```

## Antes de invitar a alguien

### 1. Confirmar que el repo remoto esta actualizado

Ejecutar:

```powershell
git status --short --branch
```

Si hay cambios locales sin commit o sin push, el revisor no los vera en GitHub.

Para que el revisor vea el estado actual, primero hay que:

```powershell
git add <archivos>
git commit -m "Update project state for external review"
git push
```

Usar un mensaje de commit mas especifico si los cambios pertenecen a una tarea concreta.

### 2. Revisar que no haya secretos

Antes de pushear, confirmar que no se incluyan:

- `.env` con credenciales.
- Tokens.
- Passwords.
- Connection strings.
- Claves privadas.
- Credenciales admin temporales.
- URLs con SAS tokens o parametros sensibles.

Si hay dudas, pedir una revision de seguridad antes del commit.

### 3. Definir tipo de acceso

Si el repositorio es privado, invitar como colaborador con el menor permiso necesario.

Recomendacion:

- Solo lectura si solo va a revisar.
- Write si realmente va a proponer cambios directos.
- Mejor pedir PR si va a editar.

## Como dar acceso en GitHub

1. Abrir el repo en GitHub:

```text
https://github.com/PedroJ13/PuntoEvento
```

2. Ir a:

```text
Settings -> Collaborators and teams -> Add people
```

3. Agregar el usuario GitHub de la persona.

4. Elegir permisos:

```text
Read
```

para revision simple.

5. Enviar invitacion.

## Que enviarle al revisor

Mensaje sugerido:

```text
Te comparto el repo de Punto Evento para revision:

https://github.com/PedroJ13/PuntoEvento

Por favor revisa primero:
- AGENTS.md
- docs/README.md
- docs/MVP_RELEASE_STATUS.md
- docs/MVP_CRITERIA.md
- docs/BACKLOG.md

Contexto:
Punto Evento es una plataforma para conectar personas que organizan eventos con empresas proveedoras.

Por ahora buscamos feedback de revision, no cambios directos.
Si encuentras hallazgos, por favor separalos por:
- P1: bloquea lanzamiento o flujo principal.
- P2: mejora importante pre-lanzamiento.
- P3: pulido o post-lanzamiento.

No necesitamos que revises secretos, credenciales ni configuracion privada de Azure.
```

## Si el revisor quiere correr el proyecto localmente

Pedirle que clone:

```powershell
git clone https://github.com/PedroJ13/PuntoEvento.git
cd PuntoEvento
```

Luego revisar el README o docs del proyecto para correrlo localmente.

Si hacen falta variables de entorno o credenciales, no compartirlas por chat abierto. Definir un metodo seguro aparte.

## Si el revisor quiere proponer cambios

Flujo recomendado:

1. Crear branch:

```powershell
git checkout -b review/<tema>
```

2. Hacer cambios pequenos.

3. Crear commit.

4. Abrir Pull Request.

5. No pushear directo a `main` salvo que se le haya pedido explicitamente.

## Reglas de seguridad

- No compartir credenciales Azure.
- No compartir `ADMIN_PASSWORD`.
- No compartir connection strings.
- No compartir tokens de GitHub.
- No compartir llaves privadas.
- No pedirle al revisor que guarde secretos en el repo.
- Si necesita probar admin, crear una credencial temporal y rotarla despues.

## Pendiente actual importante

Antes de invitar al revisor, confirmar si se quiere que vea:

- el ultimo estado pusheado en GitHub; o
- el estado local actual.

Si debe ver el estado local actual, hay que commitear y pushear los cambios pendientes.
