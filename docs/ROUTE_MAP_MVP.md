# Mapa de rutas MVP

Este documento consolida las rutas actuales de Punto Evento para evitar abrir frentes duplicados entre pagina publica, panel empresa, admin interno y API.

Fuente revisada:

- `staticwebapp.config.json`
- `index.html`, `app.js`
- `panel.html`, `panel.js`
- `admin.html`, `admin.js`
- `api/*/function.json`
- `docs/API_CONTRACTS_MVP.md`

## Ambiente principal

```text
Azure Static Web Apps:
https://zealous-field-08fdd720f.7.azurestaticapps.net
```

## Superficies estaticas

| Ruta | Archivo | Uso MVP | Estado |
| --- | --- | --- | --- |
| `/` | `index.html` | Pagina publica: busqueda, perfil publico y registro de empresa. | Activa |
| `/index.html` | `index.html` | Entrada explicita equivalente a `/`. | Activa |
| `/admin` | rewrite a `admin.html` | Alias corto para admin interno. | Activa |
| `/admin.html` | `admin.html` | Admin interno para moderar empresas y servicios. | Activa |
| `/panel.html` | `panel.html` | Panel empresa para aceptar invitacion, gestionar servicios e imagenes. | Activa |
| `/assets/*` | `assets/*` | Assets locales cacheados. | Activa |
| `/data/*` | `data/*` | JSON demo/catalogos estaticos. | Activa |

La configuracion actual usa navigation fallback a `index.html`, con exclusiones para assets, CSS, JS, imagenes y JSON.

## Rutas hash de pagina publica

| Ruta hash | Uso MVP | Notas |
| --- | --- | --- |
| `#inicio` | Home y busqueda principal. | Usa servicios publicados cuando la API responde. |
| `#bodas` | Listado/filtros de servicios. | Conserva naming historico de la pagina actual. |
| `#proveedor/:slug` | Perfil publico de empresa. | Puede recibir servicio seleccionado como tercer segmento. |
| `#proveedor/:slug/:serviceSlug` | Perfil de empresa con servicio destacado. | Alineado al flujo servicio -> empresa. |
| `#empresas` | Landing/registro para empresas proveedoras. | Registro gratis inicial. |
| `#registro-empresa` | Ancla interna del formulario de registro. | Usada por CTAs dentro de `#empresas`. |

## API publica

| Metodo | Ruta | Consumidor | Uso MVP |
| --- | --- | --- | --- |
| `GET` | `/api/public/services` | `app.js` | Lista/busca servicios publicados con contexto de empresa. |
| `GET` | `/api/public/companies/{slug}` | `app.js` | Perfil publico de empresa y servicios publicados. |
| `POST` | `/api/public/leads` | `app.js` futuro | Recibe cotizacion publica y la envia por email a la empresa del servicio publicado. |
| `POST` | `/api/companies/register` | `app.js` | Registro gratis de empresa en estado pendiente. |

## API de panel empresa

Estas rutas requieren sesion de empresa por cookie server-side creada desde invitacion.

| Metodo | Ruta | Consumidor | Uso MVP |
| --- | --- | --- | --- |
| `POST` | `/api/company-auth/accept-invite` | `panel.js` | Acepta invitacion y crea sesion. |
| `POST` | `/api/company-auth/activate` | `panel.js` futuro | Activa invitacion y define password para login recurrente. |
| `POST` | `/api/company-auth/login` | `panel.js` futuro | Login recurrente con email/password. |
| `POST` | `/api/company-auth/logout` | `panel.js` | Cierra sesion de empresa. |
| `GET` | `/api/companies/me` | `panel.js` | Carga perfil de la empresa autenticada. |
| `GET` | `/api/companies/me/services` | `panel.js` | Lista servicios propios. |
| `POST` | `/api/companies/me/services` | `panel.js` | Crea servicio propio como borrador. |
| `PATCH` | `/api/companies/me/services/{serviceId}` | `panel.js` | Edita servicio propio. |
| `POST` | `/api/companies/me/services/{serviceId}/submit-review` | `panel.js` | Envia servicio a revision. |
| `DELETE` | `/api/companies/me/services/{serviceId}` | `panel.js` | Desactiva servicio propio. |
| `POST` | `/api/uploads/sign` | `panel.js` | Genera URL temporal para subir imagen. |
| `POST` | `/api/uploads/confirm` | `panel.js` | Confirma upload y lo deja pendiente de revision. |

## API interna admin

Estas rutas usan credencial interna admin. En frontend se envia con `X-Punto-Admin-Credential`.
Si la credencial falta o es invalida, la API responde `401` JSON sin header `WWW-Authenticate` para evitar el prompt nativo del navegador.

| Metodo | Ruta | Consumidor | Uso MVP |
| --- | --- | --- | --- |
| `GET` | `/api/internal/companies/pending` | `admin.js` | Lista empresas pendientes para expediente. |
| `POST` | `/api/internal/companies/{companyId}/approve` | `admin.js` | Aprueba empresa. |
| `POST` | `/api/internal/companies/{companyId}/reject` | `admin.js` | Rechaza empresa. |
| `GET` | `/api/internal/services/pending` | `admin.js` | Lista servicios pendientes para expediente. |
| `POST` | `/api/internal/services/{companyId}/{serviceId}/approve` | `admin.js` | Aprueba servicio y publica imagenes pendientes asociadas. |
| `POST` | `/api/internal/services/{companyId}/{serviceId}/reject` | `admin.js` | Rechaza servicio. |
| `GET` | `/api/internal/uploads/pending` | `admin.js` | Soporte tecnico/listado de uploads pendientes. |
| `GET` | `/api/internal/uploads/{companyId}/{uploadId}/preview` | `admin.js` | Preview interno autenticado para imagenes pendientes. |
| `POST` | `/api/internal/uploads/{companyId}/{uploadId}/approve` | Soporte admin | Endpoint tecnico legado; flujo visual principal aprueba imagenes dentro del servicio. |
| `POST` | `/api/internal/uploads/{companyId}/{uploadId}/reject` | Soporte admin | Rechaza upload pendiente. |
| `POST` | `/api/internal/company-invites` | Admin/API controlado | Genera invitacion para acceso de empresa. |

Nota operativa: los listados internos aceptan `POST` en `function.json` para devolver `405` controlado en Azure cuando se invocan con metodo incorrecto.

## API legacy / compatibilidad

Mantener mientras existan dependencias historicas. No usar para nuevas tareas MVP salvo correcciones de compatibilidad.

| Metodo | Ruta | Uso historico |
| --- | --- | --- |
| `POST` | `/api/register-provider` | Registro legacy de proveedor plano. |
| `POST` | `/api/create-upload-url` | Upload legacy de proveedor plano. |
| `POST` | `/api/register-upload` | Confirmacion legacy de upload. |
| `GET`, `POST` | `/api/providers` | Catalogo legacy de proveedores. |
| `GET` | `/api/admin/pending-providers` | Admin legacy con prefijo `admin`. |
| `POST` | `/api/admin/approve-provider` | Aprobacion legacy con prefijo `admin`. |
| `POST` | `/api/admin/reject-provider` | Rechazo legacy con prefijo `admin`. |
| `GET` | `/api/admin-pending-providers` | Alias plano legacy. |
| `POST` | `/api/admin-approve-provider` | Alias plano legacy. |
| `POST` | `/api/admin-reject-provider` | Alias plano legacy. |

Regla vigente: no crear nuevas rutas bajo `/api/admin/...`; usar `/api/internal/...` para evitar conflictos con rutas reservadas de Azure Functions.

## Rutas objetivo no implementadas como URL limpia

Estas rutas siguen siendo objetivo de arquitectura, no compromiso para el MVP actual:

| Objetivo | Estado actual |
| --- | --- |
| `/servicios/:categoria` | Simulado en pagina publica con hash/listado. |
| `/empresa/:companySlug` | Simulado con `#proveedor/:slug`. |
| `/empresa/:companySlug/:serviceSlug` | Simulado con `#proveedor/:slug/:serviceSlug`. |
| `/panel/*` | Consolidado temporalmente en `panel.html`. |
| `/admin/*` | Consolidado temporalmente en `/admin` y `admin.html`. |

## Reglas de coordinacion

- Nuevas tareas de pagina publica deben priorizar `GET /api/public/services` y `GET /api/public/companies/{slug}`.
- Nuevas tareas de empresa deben usar solo rutas `/api/companies/me/*`, `/api/company-auth/*` y `/api/uploads/*`.
- Nuevas tareas de moderacion deben usar `/api/internal/*`.
- No mezclar endpoints legacy `provider` con nuevas features del modelo `Company -> Services`.
- Si cambia una ruta, actualizar este documento y `docs/API_CONTRACTS_MVP.md` en la misma tarea.
