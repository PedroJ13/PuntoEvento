# Modelo de datos

## Idea central

Punto Evento debe modelar empresas y servicios por separado.

```text
Empresa -> Servicios
```

Una empresa puede tener N servicios.

Ejemplo:

```text
Empresa: Aurisbel
Servicios:
  - Queques
  - Wedding Planner
  - Mesa dulce
```

## Company

```json
{
  "id": "company_123",
  "slug": "aurisbel",
  "name": "Aurisbel",
  "status": "pending",
  "plan": "free",
  "email": "empresa@email.com",
  "whatsapp": "50688888888",
  "phone": "50622222222",
  "website": "https://...",
  "instagram": "https://...",
  "province": "Heredia",
  "canton": "San Francisco",
  "district": "Heredia",
  "address": "...",
  "description": "...",
  "logoUrl": "...",
  "coverUrl": "...",
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

## Service

```json
{
  "id": "service_123",
  "companyId": "company_123",
  "slug": "mesa-dulce",
  "name": "Mesa dulce",
  "category": "Mesas de dulces",
  "eventTypes": ["Bodas", "Baby Shower", "Cumpleanos"],
  "status": "published",
  "description": "...",
  "priceFrom": "CRC 120000",
  "coverUrl": "...",
  "gallery": ["...", "..."],
  "packages": [],
  "sortBoost": 0,
  "isFeatured": false,
  "featuredUntil": null,
  "createdAt": "2026-05-27T00:00:00Z",
  "updatedAt": "2026-05-27T00:00:00Z"
}
```

## User

```json
{
  "id": "user_123",
  "companyId": "company_123",
  "email": "empresa@email.com",
  "role": "company_owner",
  "status": "active",
  "createdAt": "2026-05-27T00:00:00Z"
}
```

## Lead

```json
{
  "id": "lead_123",
  "companyId": "company_123",
  "serviceId": "service_123",
  "eventType": "Boda",
  "date": "2026-08-15",
  "guests": 80,
  "name": "Cliente",
  "phone": "8888-8888",
  "message": "...",
  "createdAt": "2026-05-27T00:00:00Z"
}
```

## Estados

Company:

- draft
- pending
- published
- rejected
- suspended

Service:

- draft
- pending
- published
- rejected
- inactive

Plan:

- free
- featured
- premium

## Busqueda

Los resultados deben ser por servicio.

Si el usuario busca "mesa dulce":

```text
Mostrar servicio Mesa dulce de Aurisbel.
Mostrar link para ver otros servicios de Aurisbel.
```

El perfil de empresa muestra todos los servicios.

