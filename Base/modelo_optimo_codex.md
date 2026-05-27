# Modelo Óptimo de Trabajo en Codex

## Objetivo

Organizar proyectos en Codex de forma similar a un equipo real de desarrollo de software, permitiendo trabajar eficientemente en:

- Aplicaciones web
- APIs
- Bases de datos
- Reporting
- Infraestructura
- Automatizaciones
- Productos digitales en general

---

# Principio Principal

La mejor forma de trabajar en Codex NO es:

```text
1 chat = 1 equipo
```

La mejor forma es:

```text
1 repositorio centralizado
+ documentación fuerte
+ agentes especializados
+ tareas pequeñas
+ ramas pequeñas
+ PRs pequeños
```

---

# Arquitectura Recomendada

## Repositorio Central

Todo el proyecto debe vivir dentro de un único repositorio bien organizado.

Ejemplo:

```text
/project
    /frontend
    /backend
    /database
    /infra
    /reports
    /docs
    AGENTS.md
```

---

# Estructura Recomendada

## /frontend
Contiene:
- React
- Next.js
- Angular
- CSS
- UI components

---

## /backend
Contiene:
- APIs
- Servicios
- Lógica de negocio
- Autenticación
- Integraciones

---

## /database
Contiene:
- Scripts SQL
- Stored Procedures
- ETL
- Migraciones
- Optimización

---

## /infra
Contiene:
- Azure
- Terraform
- Docker
- CI/CD
- Kubernetes
- Pipelines

---

## /reports
Contiene:
- Power BI
- Reporting
- Dashboards
- Modelos analíticos

---

## /docs
Contiene:
- Arquitectura
- Reglas
- API contracts
- Modelos de datos
- Roadmap

---

# Modelo de Agentes

## Importante

Los "agentes" NO son bots permanentes.

Son sesiones temporales de Codex enfocadas en tareas específicas.

---

# Modelo Recomendado

## 1. Product / Architect Agent

Responsabilidades:
- Definir arquitectura
- Crear roadmap
- Crear backlog
- Dividir tareas
- Definir estándares

---

## 2. Frontend Agent

Responsabilidades:
- UI
- React
- Componentes
- Responsive design
- Integraciones frontend

---

## 3. Backend Agent

Responsabilidades:
- APIs
- Endpoints
- Servicios
- Seguridad
- Integraciones

---

## 4. Database / Data Agent

Responsabilidades:
- SQL
- Optimización
- ETL
- Snowflake
- SQL Server
- Data modeling

---

## 5. QA Agent

Responsabilidades:
- Testing
- Casos de prueba
- Validaciones
- Revisión de regresiones

---

## 6. Infra Agent

Responsabilidades:
- Azure
- Deployments
- Pipelines
- Monitoring
- Docker
- CI/CD

---

# Forma Correcta de Trabajar

## NO hacer esto

```text
"Haz toda la aplicación"
```

---

## Mejor hacer esto

```text
"Implementa login JWT"

"Crea endpoint de usuarios"

"Agrega paginación"

"Optimiza esta query"

"Crea pipeline Azure DevOps"
```

---

# Filosofía Correcta

## Tareas pequeñas

Codex funciona mucho mejor con:
- tareas pequeñas
- contexto claro
- objetivos específicos

---

## PRs pequeños

Preferir:
- cambios pequeños
- commits pequeños
- merges pequeños

Evitar:
- PR gigantes
- refactors masivos
- múltiples features mezcladas

---

# Flujo de Trabajo Ideal

```text
Idea
↓
Arquitectura
↓
Creación de tickets
↓
Agentes especializados
↓
QA
↓
Pull Request
↓
Merge
↓
Deploy
```

---

# Uso de Branches

## Recomendación

Una branch por feature.

Ejemplos:

```text
feature/login
feature/report-dashboard
feature/customer-api
bugfix/payment-timeout
infra/azure-pipeline
```

---

# Uso de AGENTS.md

## Qué es

`AGENTS.md` es un archivo Markdown que Codex lee automáticamente para entender:
- reglas
- arquitectura
- estándares
- convenciones

---

# Ejemplo de AGENTS.md

```md
# AGENTS.md

## Stack
- Backend: FastAPI
- Frontend: React
- DB: PostgreSQL

## Rules
- Nunca usar SELECT *
- Todo endpoint requiere test
- SQL complejo debe comentarse
- Controllers deben ser delgados
```

---

# Estructura Recomendada de AGENTS.md

## Global

```text
/AGENTS.md
```

Reglas globales del proyecto.

---

## Especializados

```text
/frontend/AGENTS.md
/backend/AGENTS.md
/database/AGENTS.md
/infra/AGENTS.md
```

Cada área tiene sus propias reglas.

---

# Recomendaciones Importantes

## Mantener contexto corto

No crear prompts gigantes.

Preferir:
- instrucciones concretas
- tareas específicas
- contexto mínimo necesario

---

## Documentación viva

Actualizar continuamente:
- arquitectura
- decisiones técnicas
- contratos API
- modelos de datos

---

## Mantener consistencia

Todos los agentes deben:
- seguir el mismo estilo
- usar las mismas reglas
- respetar la arquitectura

---

# Lo Más Importante

Lo que más mejora resultados en Codex:

1. Buen repositorio
2. Buen AGENTS.md
3. Arquitectura clara
4. Tareas pequeñas
5. Branches pequeñas
6. PRs pequeños
7. Contexto claro

---

# Recomendación Final

Pensar en Codex como:

```text
Un equipo de especialistas coordinados
```

NO como:

```text
Muchos chats independientes
```

El repositorio, la documentación y las reglas compartidas son el verdadero centro del sistema.
