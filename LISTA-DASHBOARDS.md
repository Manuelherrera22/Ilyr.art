# 📊 Lista Completa de Dashboards - Ilyrart

## 🎯 Resumen Ejecutivo

Este documento lista todos los dashboards y portales disponibles en la plataforma Ilyrart, organizados por rol de usuario y funcionalidad.

---

## 1. 🛡️ **Dashboard de Administrador** (`/admin`)

**Ruta:** `/admin/*`  
**Roles permitidos:** `admin`  
**Estado:** ✅ Completo y funcional

### Secciones Principales:

#### 1.1. **Métricas del Sistema** (`/admin` o `/admin/`)
- **Componente:** `SystemMetrics.jsx`
- **Funcionalidades:**
  - Métricas principales del sistema (usuarios, proyectos, ingresos)
  - Gráficos de distribución de proyectos
  - Actividad del sistema en tiempo real
  - Resumen ejecutivo con KPIs
  - Indicadores de tendencia (↑↓) con porcentajes de cambio
  - Animaciones y efectos visuales avanzados

#### 1.2. **Gestión de Cuentas** (`/admin/accounts`)
- **Componente:** `AccountsManagement.jsx`
- **Funcionalidades:**
  - Lista de cuentas de clientes corporativos
  - Estadísticas rápidas (Activas, Inactivas, Suspendidas, Total)
  - Búsqueda por nombre o email
  - Crear nueva cuenta
  - Editar cuenta existente
  - Cambiar estado de cuenta (active/inactive/suspended)
  - Visualización de usuarios asociados por cuenta

#### 1.3. **Gestión de Usuarios** (`/admin/users`)
- **Componente:** `UsersManagement.jsx`
- **Funcionalidades:**
  - Lista completa de usuarios del sistema
  - Estadísticas por rol (Admin, Client, Creative, Producer)
  - Búsqueda por nombre o rol
  - Editar rol de usuario
  - Asignar cuenta de cliente a usuarios
  - Visualización de cuenta asociada
  - Badges de rol con colores distintivos

#### 1.4. **Gestión de Servicios** (`/admin/services`)
- **Componente:** `ServicesManagement.jsx`
- **Funcionalidades:**
  - Lista de paquetes de servicio
  - Estadísticas (Total paquetes, Precio promedio, Total entregables)
  - Búsqueda por nombre o descripción
  - Crear nuevo paquete
  - Editar paquete existente
  - Eliminar paquete
  - Gestión de entregables por paquete
  - Visualización de precios

#### 1.5. **Gestión de Proyectos** (`/admin/projects`)
- **Componente:** `ProjectsManagement.jsx`
- **Funcionalidades:**
  - Lista de todos los proyectos
  - Estadísticas por estado (draft, active, paused, completed, archived)
  - Búsqueda y filtros por estado
  - Crear nuevo proyecto
  - Editar proyecto
  - Cambiar estado (Pausar/Activar)
  - Archivar proyecto
  - Control de visibilidad (público/cliente)
  - Barra de progreso con efecto shimmer
  - Visualización de hitos y usuarios asignados

#### 1.6. **Publicación de Proyectos** (`/admin/publishing`)
- **Componente:** `ProjectsPublishing.jsx`
- **Funcionalidades:**
  - Gestión de actualizaciones de proyectos
  - Estadísticas (Total, Publicadas, Hitos, Pendientes)
  - Tabs: "Actualizaciones" y "Visibilidad de Proyectos"
  - Crear/editar actualizaciones
  - Control de visibilidad de actualizaciones (público/cliente)
  - Cambiar visibilidad de proyectos
  - Filtros por estado y búsqueda
  - Gestión de archivos adjuntos

#### 1.7. **Seguimiento de Proyectos** (`/admin/tracking`)
- **Componente:** `ProjectsTracking.jsx`
- **Funcionalidades:**
  - Métricas principales (Activos, Completados, A Tiempo, Retrasados, Ingresos, Tiempo promedio)
  - Filtros de tiempo (7d, 30d, 90d, 1y)
  - Métricas de rendimiento (On-Time Rate, Quality Score, Client Satisfaction, Team Productivity)
  - Próximos hitos con fechas límite
  - Actividad reciente del sistema
  - Tendencias del período con gráficos
  - Indicadores de cambio y tendencia

---

## 2. ✨ **Dashboard de Creativos** (`/creative`)

**Ruta:** `/creative/*`  
**Roles permitidos:** `creative`, `producer`, `admin`  
**Estado:** ✅ Completo y funcional

### Secciones Principales:

#### 2.1. **Dashboard Principal** (`/creative` o `/creative/dashboard`)
- **Componente:** `CreativeDashboard.jsx`
- **Funcionalidades:**
  - Estadísticas rápidas (Trabajos activos, Ingresos, Calificación promedio, Trabajos completados)
  - Trabajos activos recientes
  - Enlaces rápidos a secciones principales
  - Métricas de calidad y rendimiento
  - Gráficos de progreso

#### 2.2. **Trabajos Disponibles** (`/creative/available`)
- **Componente:** `AvailableJobsList.jsx`
- **Funcionalidades:**
  - Lista de trabajos disponibles para aplicar
  - Búsqueda y filtros avanzados
  - Ordenamiento (fecha, presupuesto, relevancia)
  - Información detallada de cada trabajo
  - Sistema de recomendaciones IA
  - Match score con trabajos

#### 2.3. **Mis Trabajos Activos** (`/creative/jobs`)
- **Componente:** `MyActiveJobs.jsx`
- **Funcionalidades:**
  - Lista de trabajos asignados
  - Filtros por estado (En progreso, En revisión, Completado)
  - Estadísticas rápidas
  - Progreso de cada trabajo
  - Fechas límite destacadas

#### 2.4. **Detalle de Trabajo** (`/creative/jobs/:jobId`)
- **Componente:** `JobDetailView.jsx`
- **Funcionalidades:**
  - Información completa del trabajo
  - Barra de progreso detallada
  - Presupuesto y fechas
  - Revisiones de calidad
  - Hitos y entregables
  - Comentarios y feedback
  - Archivos adjuntos

#### 2.5. **Pagos** (`/creative/payments`)
- **Componente:** `PaymentsView.jsx`
- **Funcionalidades:**
  - Historial de pagos
  - Estadísticas financieras
  - Filtros por estado y fecha
  - Búsqueda de transacciones
  - Exportación de reportes
  - Próximos pagos pendientes

#### 2.6. **Portafolio** (`/creative/portfolio`)
- **Componente:** `CreatorPortfolio.jsx`
- **Funcionalidades:**
  - Trabajos completados
  - Estadísticas de portafolio
  - Habilidades destacadas
  - Visualización de proyectos
  - Métricas de éxito

#### 2.7. **Sistema de Logros** (`/creative/achievements`)
- **Componente:** `AchievementsSystem.jsx`
- **Funcionalidades:**
  - Nivel y XP del usuario
  - Racha de días activos
  - Badges desbloqueables
  - Progreso hacia siguiente nivel
  - Estadísticas de gamificación

#### 2.8. **Calendario** (`/creative/calendar`)
- **Componente:** `CalendarView.jsx`
- **Funcionalidades:**
  - Vista de calendario mensual
  - Fechas límite destacadas
  - Próximos hitos
  - Filtros por proyecto
  - Vista de lista de eventos

#### 2.9. **Analíticas Avanzadas** (`/creative/analytics`)
- **Componente:** `AdvancedAnalytics.jsx`
- **Funcionalidades:**
  - Métricas de rendimiento
  - Gráficos de productividad
  - Análisis de ingresos
  - Tendencias temporales
  - Comparativas de período
  - Exportación de datos

#### 2.10. **Mensajería** (`/creative/messages`)
- **Componente:** `MessagingSystem.jsx`
- **Funcionalidades:**
  - Chat en tiempo real
  - Lista de conversaciones
  - Búsqueda de mensajes
  - Notificaciones
  - Archivos adjuntos
  - Vista responsive con back button en móvil

#### 2.11. **Gestión de Habilidades** (`/creative/skills`)
- **Componente:** `SkillsManagement.jsx`
- **Funcionalidades:**
  - Lista de habilidades profesionales
  - Estadísticas de habilidades
  - Agregar/editar habilidades
  - Niveles de competencia
  - Categorías de habilidades

#### 2.12. **Recomendaciones de Trabajos** (`/creative/recommendations`)
- **Componente:** `JobRecommendations.jsx`
- **Funcionalidades:**
  - Trabajos recomendados por IA
  - Match score personalizado
  - Razones de recomendación
  - Filtros por relevancia
  - Aplicación rápida

---

## 3. 🏢 **Dashboard de Cliente** (`/client`)

**Ruta:** `/client/*`  
**Roles permitidos:** `client`, `producer`, `admin`  
**Estado:** ✅ Funcional (en desarrollo)

### Secciones Principales:

#### 3.1. **Resumen** (`/client` o `/client/`)
- **Componente:** `ClientHome` (inline)
- **Funcionalidades:**
  - Próximos pasos del partnership
  - Acceso rápido a crear brief
  - Información sobre funcionalidades disponibles
  - Guía de uso del portal

#### 3.2. **Nuevo Brief** (`/client/brief/new`)
- **Componente:** `ClientBriefForm.jsx`
- **Funcionalidades:**
  - Formulario inteligente para crear briefs
  - Campos estructurados
  - Validación de datos
  - Envío de solicitudes

#### 3.3. **Vista de Proyectos** (`/client/projects`)
- **Componente:** `ProjectsOverview.jsx`
- **Funcionalidades:**
  - Lista de proyectos del cliente
  - Estado de cada proyecto
  - Filtros y búsqueda
  - Acceso rápido a detalles

#### 3.4. **Detalle de Proyecto** (`/client/projects/:projectId`)
- **Componente:** `ClientProjectDetail.jsx`
- **Funcionalidades:**
  - Información completa del proyecto
  - Timeline de hitos
  - Entregables y versiones
  - Comentarios y feedback
  - Descarga de archivos

---

## 4. 🎬 **Dashboard de Productor** (`/producer`)

**Ruta:** `/producer/*`  
**Roles permitidos:** `producer`, `admin`  
**Estado:** ✅ Funcional (en desarrollo)

### Secciones Principales:

#### 4.1. **Resumen** (`/producer` o `/producer/`)
- **Componente:** `ProducerOverview` (inline)
- **Funcionalidades:**
  - Panel de control del productor
  - Información sobre briefs y asignaciones
  - Acceso rápido a secciones

#### 4.2. **Bandeja de Briefs** (`/producer/briefs`)
- **Componente:** `BriefsBoard` (inline) + `BriefList.jsx` + `BriefDetail.jsx`
- **Funcionalidades:**
  - Lista de briefs pendientes
  - Vista detallada de brief seleccionado
  - Cambio de estado de briefs
  - Notas y coordinación
  - Validaciones IA
  - Recomendaciones de pipeline

#### 4.3. **Asignaciones** (`/producer/assignments`)
- **Componente:** `ProjectAssignments.jsx`
- **Funcionalidades:**
  - Gestión de asignaciones de equipo
  - Control de carga de trabajo
  - Coordinación de sesiones
  - Vista de proyectos asignados

---

## 5. 📱 **Dashboard General** (`/dashboard`)

**Ruta:** `/dashboard/*`  
**Roles permitidos:** Todos (público después de login)  
**Estado:** ✅ Funcional

### Secciones Principales:

#### 5.1. **Flujo DIY** (`/dashboard/diy`)
- **Componente:** `DIYDashboardPage.jsx`
- **Funcionalidades:**
  - Herramientas de creación DIY
  - Flujo de trabajo personalizado

#### 5.2. **Gestor de Ideas** (`/dashboard/professional`)
- **Componente:** `ProfessionalDashboardPage.jsx`
- **Funcionalidades:**
  - Gestión profesional de ideas
  - Organización de proyectos

#### 5.3. **Canvas IA Pro** (`/dashboard/canvas`)
- **Componente:** `CanvasIAProPage.jsx`
- **Funcionalidades:**
  - Canvas inteligente con IA
  - Herramientas avanzadas

#### 5.4. **Inspiración** (`/dashboard/feed`)
- **Componente:** `InspirationFeedPage.jsx`
- **Funcionalidades:**
  - Feed de inspiración
  - Contenido curado

#### 5.5. **Mi Perfil** (`/dashboard/perfil`)
- **Componente:** `ProfilePage.jsx`
- **Funcionalidades:**
  - Gestión de perfil de usuario
  - Configuración de cuenta

#### 5.6. **Mi Actividad** (`/dashboard/activity`)
- **Componente:** `UserActivityPage.jsx`
- **Funcionalidades:**
  - Historial de actividad
  - Logs de acciones

---

## 6. 📊 **Página de Análisis Creativo** (`/analisis-creativo`)

**Ruta:** `/analisis-creativo`  
**Roles permitidos:** Todos  
**Estado:** ✅ Funcional

- **Componente:** `CreativeAnalysisPage.jsx`
- **Funcionalidades:**
  - Análisis de video con IA
  - Herramientas de análisis creativo
  - Reportes detallados

---

## 📋 **Resumen de Accesos por Rol**

### 👤 **Admin** (`admin`)
- ✅ `/admin` - Dashboard completo con todas las secciones
- ✅ Acceso a todos los demás dashboards

### 🎨 **Creative** (`creative`)
- ✅ `/creative` - Dashboard completo de creadores
- ✅ `/dashboard` - Dashboard general

### 🏢 **Client** (`client`)
- ✅ `/client` - Portal de cliente
- ✅ `/dashboard` - Dashboard general

### 🎬 **Producer** (`producer`)
- ✅ `/producer` - Portal de productor
- ✅ `/client` - Portal de cliente (acceso)
- ✅ `/creative` - Portal de creativos (acceso)
- ✅ `/dashboard` - Dashboard general

---

## 🔗 **Rutas de Acceso Rápido**

### Para Administradores:
```
/admin                    → Métricas del sistema
/admin/accounts           → Gestión de cuentas
/admin/users              → Gestión de usuarios
/admin/services           → Gestión de servicios
/admin/projects           → Gestión de proyectos
/admin/publishing         → Publicación de proyectos
/admin/tracking           → Seguimiento de proyectos
```

### Para Creativos:
```
/creative                 → Dashboard principal
/creative/available       → Trabajos disponibles
/creative/jobs            → Mis trabajos activos
/creative/payments         → Pagos
/creative/portfolio       → Portafolio
/creative/achievements    → Logros
/creative/calendar        → Calendario
/creative/analytics       → Analíticas
/creative/messages        → Mensajería
/creative/skills          → Habilidades
/creative/recommendations → Recomendaciones
```

### Para Clientes:
```
/client                   → Resumen
/client/brief/new         → Nuevo brief
/client/projects          → Proyectos
/client/projects/:id      → Detalle de proyecto
```

### Para Productores:
```
/producer                 → Resumen
/producer/briefs          → Bandeja de briefs
/producer/assignments     → Asignaciones
```

---

## 📝 **Notas Importantes**

1. **Autenticación:** Todos los dashboards requieren autenticación (excepto páginas públicas)
2. **TEST_MODE:** Actualmente activado para bypass de autenticación en desarrollo
3. **Responsive:** Todos los dashboards están optimizados para móvil, tablet y desktop
4. **Animaciones:** Uso extensivo de `framer-motion` para transiciones suaves
5. **Mock Data:** Los dashboards incluyen datos mock para testing cuando no hay datos reales

---

## 🚀 **Próximos Pasos Sugeridos**

1. ✅ Completar funcionalidades de Producer Portal
2. ✅ Mejorar integración de datos reales vs mock data
3. ✅ Agregar más métricas y analytics
4. ✅ Implementar notificaciones en tiempo real
5. ✅ Mejorar sistema de mensajería
6. ✅ Agregar exportación de reportes en más secciones

---

**Última actualización:** Diciembre 2024  
**Versión del documento:** 1.0
