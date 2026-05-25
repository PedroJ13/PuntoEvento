# Infraestructura Azure para MVP

## Objetivo

Definir una arquitectura de bajo costo para que el desarrollo web contemple desde el inicio como se publicara la pagina, como se cargaran las imagenes de empresas/proveedores y que piezas se deben evitar hasta validar el MVP.

La prioridad es:

- Mantener costos bajos.
- Publicar rapido.
- Evitar servidores permanentes.
- Permitir que las imagenes de proveedores vivan en Azure.
- Dejar el camino listo para crecer sin rehacer toda la web.

## Estado actual del proyecto

El proyecto actual es una pagina estatica:

- `index.html`
- `styles.css`
- `app.js`
- `data/providers.json`
- `data/packages.json`
- `data/categories.json`
- `staticwebapp.config.json`
- Sin backend.
- Sin base de datos.
- Sin proceso de build.
- Sin login de proveedores.
- Datos de proveedores cargados desde JSON estatico.
- Paquetes y categorias cargados desde JSON estatico.
- Imagenes demo cargadas desde Unsplash, con camino preparado para Azure Blob Storage.

Esto es ideal para una demo y para un primer despliegue barato.

## Arquitectura recomendada para MVP barato

```text
Usuario visita la pagina
        ->
Azure Static Web Apps Free
        ->
Frontend HTML/CSS/JS
        ->
providers.json o endpoint simple
        ->
Imagenes servidas desde Azure Blob Storage
```

Para el MVP, evitar:

- App Service.
- Maquinas virtuales.
- Kubernetes.
- Contenedores.
- Azure SQL.
- Cosmos DB si no hay necesidad real.
- CDN al inicio si el trafico es bajo.
- Panel completo de administracion desde el dia uno.

## Servicios Azure propuestos

## 1. Frontend

Servicio recomendado:

```text
Azure Static Web Apps
Plan: Free
```

Uso:

- Hospedar la pagina publica.
- Servir HTML, CSS, JS y assets estaticos.
- HTTPS automatico.
- Despliegue desde GitHub Actions.

Configuracion:

```text
App location: /
Api location: vacio
Output location: vacio
Build command: vacio
```

El proyecto ya incluye:

```text
staticwebapp.config.json
```

Ese archivo define:

- Fallback a `index.html`.
- Headers basicos de seguridad.
- Cache para CSS, JS y assets.
- Cache corto para `data/*`, porque los datos del MVP pueden cambiar sin tocar codigo.
- `connect-src 'self'` para permitir cargar `data/providers.json`.
- Permiso temporal para imagenes desde Unsplash.
- Permiso preparado para imagenes desde Azure Blob Storage.

## 2. Imagenes de proveedores

Servicio recomendado:

```text
Azure Blob Storage
Redundancia: LRS
Tier: Hot
Acceso: publico solo para lectura de imagenes aprobadas
```

Por que:

- Es mas barato que montar un servidor para archivos.
- Escala bien.
- La pagina puede cargar las imagenes directamente por URL.
- No requiere backend para mostrar imagenes.

Estructura sugerida:

```text
providers/
  proveedor-id/
    logo.webp
    cover.webp
    gallery-01.webp
    gallery-02.webp
    gallery-03.webp
```

Ejemplo real:

```text
providers/casa-arboleda/logo.webp
providers/casa-arboleda/cover.webp
providers/casa-arboleda/gallery-01.webp
```

URLs esperadas:

```text
https://<storage-account>.blob.core.windows.net/public/providers/casa-arboleda/cover.webp
```

En una fase posterior, si hay trafico real:

```text
https://cdn.puntoevento.cr/providers/casa-arboleda/cover.webp
```

## 3. Datos de proveedores

Para optimizar costos, usar fases.

## Fase MVP 1: archivo JSON

Usar un archivo estatico:

```text
data/providers.json
data/packages.json
data/categories.json
```

Ejemplo:

```json
[
  {
    "id": "casa-arboleda",
    "name": "Casa Arboleda Eventos",
    "category": "Salon y jardin",
    "location": "Santa Ana, San Jose",
    "price": "Desde CRC 28,500 / pers.",
    "rating": "4.9",
    "reviews": 38,
    "coverImage": "https://<storage-account>.blob.core.windows.net/public/providers/casa-arboleda/cover.webp",
    "gallery": [
      "https://<storage-account>.blob.core.windows.net/public/providers/casa-arboleda/gallery-01.webp",
      "https://<storage-account>.blob.core.windows.net/public/providers/casa-arboleda/gallery-02.webp"
    ],
    "whatsapp": "50688888888",
    "verified": true
  }
]
```

Ventajas:

- Costo casi cero.
- Facil de versionar.
- No requiere backend.
- Suficiente para validar mercado.

Desventajas:

- Cada cambio requiere actualizar archivo y redesplegar.
- No hay panel de administracion.
- No sirve si muchos proveedores cambian datos todos los dias.

## Fase MVP 2: Azure Table Storage

Cuando el archivo JSON ya sea incomodo, pasar a:

```text
Azure Table Storage
```

Uso:

- Guardar proveedores.
- Guardar URLs de imagenes.
- Guardar estado de aprobacion.
- Consultar por categoria o provincia.

Ventaja:

- Mas barato y simple que Azure SQL o Cosmos DB para datos basicos.

## 4. Subida de imagenes

Para ahorrar en desarrollo y reducir riesgo, no construir un panel completo al inicio.

## Flujo recomendado para MVP

```text
Empresa envia formulario
        ->
Ustedes revisan datos e imagenes
        ->
Ustedes suben imagenes a Azure Blob Storage
        ->
Se actualiza providers.json
        ->
Se redespliega la pagina
```

Formulario inicial recomendado:

- Google Forms.
- Microsoft Forms.
- Typeform si ya se paga.
- Email/WhatsApp para pilotos manuales.

Este enfoque evita construir desde el inicio:

- Login.
- Recuperacion de password.
- Panel de proveedor.
- Permisos.
- Moderacion automatica.
- Antivirus.
- Procesamiento complejo de imagenes.

## Fase posterior: subida automatizada

Cuando haya suficientes proveedores, agregar:

```text
Azure Functions Consumption
```

Uso:

- Generar SAS temporal para subida segura.
- Validar metadatos.
- Registrar imagen en Table Storage.
- Ejecutarse solo cuando alguien sube o actualiza imagenes.

Flujo:

```text
Proveedor autenticado solicita subir imagen
        ->
Azure Function genera SAS temporal
        ->
Frontend sube archivo directo a Blob Storage
        ->
Azure Function registra URL y estado pendiente
        ->
Admin aprueba
        ->
Imagen aparece en la pagina
```

## Reglas para imagenes

El desarrollo web debe contemplar estas reglas desde el inicio:

- No guardar imagenes dentro de `app.js`.
- No depender de Unsplash para produccion.
- Cada proveedor debe tener `coverImage`.
- Cada proveedor puede tener `gallery`.
- Usar URLs completas desde Blob Storage o CDN.
- Usar `loading="lazy"` en imagenes fuera del primer viewport.
- Usar imagen hero optimizada.
- Preferir `.webp`.
- Mantener JPG como respaldo solo si hace falta.

Tamanos sugeridos:

```text
Logo: 400x400
Cover/card: 900x675
Hero/ficha: 1600x1000
Galeria: 1200x900
```

Peso recomendado:

```text
Cards: menos de 250 KB
Hero: menos de 500 KB
Logo: menos de 100 KB
```

## Cambios recomendados en el frontend

## 1. Separar datos del codigo

Hoy los proveedores estan dentro de `app.js`.

Cambiar a:

```text
data/providers.json
```

Y cargarlo desde el frontend:

```js
const response = await fetch("data/providers.json");
const providers = await response.json();
```

Esto permite que el equipo actualice proveedores sin tocar la logica visual.

## 2. Normalizar estructura de proveedor

Usar esta forma base:

```json
{
  "id": "casa-arboleda",
  "name": "Casa Arboleda Eventos",
  "category": "Salon y jardin",
  "location": "Santa Ana, San Jose",
  "description": "Espacio versatil para bodas y eventos privados.",
  "price": "Desde CRC 28,500 / pers.",
  "rating": "4.9",
  "reviews": 38,
  "tags": ["Verificado", "Responde rapido", "Precio publicado"],
  "coverImage": "https://...",
  "gallery": ["https://..."],
  "whatsapp": "50688888888",
  "status": "published"
}
```

## 3. Preparar fallback de imagen

Si una imagen falla, mostrar una imagen generica:

```text
assets/images/fallback-provider.svg
```

Para produccion se puede reemplazar por:

```text
assets/images/fallback-provider.webp
```

## 4. Mantener la pagina estatica

Mientras sea posible, el frontend debe funcionar sin backend obligatorio.

Eso permite:

- Menos costo.
- Menos mantenimiento.
- Menos puntos de falla.
- Despliegue mas simple.

## Seguridad minima

Para MVP:

- El contenedor publico de Blob debe exponer solo imagenes aprobadas.
- No subir archivos ejecutables.
- Validar extension antes de publicar.
- Convertir imagenes a `.webp` antes de usarlas.
- No permitir que proveedores escriban directamente sin SAS temporal.
- Si se usa SAS, debe expirar rapido.

Extensiones permitidas:

```text
.jpg
.jpeg
.png
.webp
```

Extensiones finales recomendadas para publicar:

```text
.webp
```

## Cache

Para imagenes con nombre versionado:

```text
cover-v1.webp
cover-v2.webp
```

Se puede usar cache largo:

```text
Cache-Control: public, max-age=31536000, immutable
```

Si se reemplaza la imagen manteniendo el mismo nombre, puede tardar en verse el cambio por cache. Por eso se recomienda versionar nombres.

## Variables por ambiente

Para mantenerlo simple:

```js
const CONFIG = {
  providersUrl: "data/providers.json",
  imageBaseUrl: "https://<storage-account>.blob.core.windows.net/public"
};
```

Mas adelante esto puede pasar a:

```text
config.production.json
config.development.json
```

## Estimacion de fases

## Fase 1: demo publicada

Servicios:

- Azure Static Web Apps Free.
- Imagenes actuales o imagenes locales.
- Sin backend.

Resultado:

- URL publica para presentar.

## Fase 2: proveedores reales manuales

Servicios:

- Azure Static Web Apps Free.
- Azure Blob Storage LRS Hot.
- `data/providers.json`.
- Formulario externo para recibir datos.

Resultado:

- Empresas reales pueden aparecer en la pagina.
- Ustedes controlan publicacion manualmente.

## Fase 3: administracion basica

Servicios:

- Azure Static Web Apps.
- Azure Blob Storage.
- Azure Table Storage.
- Azure Functions Consumption.

Resultado:

- Subida mas ordenada.
- Datos editables sin tocar codigo.
- Moderacion manual.

## Fase 4: plataforma mas completa

Servicios posibles:

- Login de proveedores.
- Panel admin.
- Notificaciones.
- Analitica.
- CDN o Azure Front Door.
- Base de datos mas robusta si el volumen lo exige.

Esta fase debe hacerse solo si el MVP valida demanda.

## Decision recomendada ahora

Implementar el desarrollo web pensando en esta primera version:

```text
Frontend: Azure Static Web Apps Free
Datos: data/providers.json
Imagenes: Azure Blob Storage LRS Hot
Subida: manual por el equipo
Formulario: externo
Backend: ninguno al inicio
CDN: no al inicio
Base de datos: no al inicio
```

Esta es la forma mas barata y razonable para validar el producto sin bloquear el crecimiento futuro.
