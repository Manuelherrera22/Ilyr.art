## Arquitectura propuesta: Plataforma híbrida IA + Estudio

### 1. Roles y permisos
- **Cliente**: puede crear briefs, revisar propuestas, dejar feedback, aprobar hitos, descargar entregables.
- **Productor ILYR**: coordina proyectos, asigna talento, edita timelines, publica actualizaciones y controla la comunicación.
- **Especialista creativo** (VFX/CGI/Post): recibe tareas asignadas, sube avances, registra horas y responde feedback.
- **Administrador**: gestiona cuentas, paquetes, facturación y accesos especiales.

Recomendación: ampliar `profiles.profile_type` con valores `client`, `producer`, `creative`, `admin` y manejar permisos a nivel de ruta (React) y políticas RLS en Supabase.

### 2. Estructura de datos en Supabase
| Tabla | Campos clave | Descripción |
|-------|--------------|-------------|
| `client_accounts` | `id`, `company_name`, `contact_email`, `status` | Perfil corporativo del cliente, vinculado a uno o varios usuarios. |
| `project_briefs` | `id`, `client_id`, `created_by`, `status`, `objective`, `audience`, `references (jsonb)`, `deadline`, `budget_range`, `attachments` | Brief inicial; estados sugeridos: `draft`, `submitted`, `in_review`, `approved`, `archived`. |
| `project_assignments` | `id`, `project_id`, `user_id`, `role`, `stage`, `status` | Relación N:M entre proyectos y especialistas/productores. |
| `project_updates` | `id`, `project_id`, `author_id`, `type`, `title`, `body`, `files`, `status_tag`, `visible_for_client` | Bitácora de hitos, prototipos, entregas parciales. |
| `project_comments` | `id`, `project_id`, `author_id`, `message`, `parent_id`, `visibility` | Hilos de comunicación (público vs. interno). |
| `project_assets` | `id`, `project_id`, `version`, `type`, `file_url`, `notes`, `is_final` | Gestión de archivos fuente y entregas finales. |
| `project_milestones` | `id`, `project_id`, `name`, `due_at`, `approved_at`, `status`, `approved_by` | Seguimiento de cronograma y aprobaciones. |
| `service_packages` | `id`, `name`, `description`, `from_price`, `deliverables (jsonb)` | Catálogo de servicios y addons personalizados. |
| `notifications` | `id`, `user_id`, `project_id`, `type`, `payload`, `read_at` | Base para alertas in-app/email. |

### 3. Flujos clave
1. **Intake**: cliente auténtico completa `project_briefs`; trigger notifica a productores -> tablero de revisión.
2. **Evaluación**: productor revisa brief, usa `ILYR.Preview™` para generar moodboards; responde con `project_updates` tipo `proposal`.
3. **Asignación**: productor selecciona especialistas en `project_assignments`; se crean hitos y plantillas de tareas.
4. **Co-creación**: especialistas suben avances (`project_assets`), cliente deja feedback (`project_comments`). Estados de hito actualizados.
5. **Entrega final**: productor marca assets finales (`is_final = true`), se solicita aprobación cliente, se activa botón de descarga + cierre del proyecto.

### 4. Interfaces prioritarias
- **Portal de Cliente (`/dashboard/client`)**
  - Lista de proyectos con estado, próxima acción y responsable.
  - Módulo de brief (crear/editar), timeline visual, panel de entregables, bandeja de mensajes.
  - CTA para solicitar nuevo proyecto o agendar revisión.
- **Workspace de Productor (`/dashboard/producer`)**
  - Kanban de briefs por estado, backlog de tareas, calendario de hitos.
  - Vista de asignaciones y carga del equipo, plantillas de propuestas, integración con `ILYR.Preview™`.
- **Panel de Especialista (`/dashboard/creative`)**
  - Mis tareas, briefs asociados, subida rápida de renders, checklist de feedback pendiente.
  - Integración con repositorio de assets y registro de versiones.
- **Administración (`/dashboard/admin`)**
  - Gestión de cuentas, planes, analítica de uso, roles y permisos.

### 5. Integraciones futuras
- Calendly/OnceHub para agendar discovery y revisiones.
- Firma electrónica (HelloSign/Adobe Sign) para contratos y NDAs.
- Webhooks con herramientas de tracking (Notion/Jira) y almacenamiento S3 para assets pesados.
- Automatización de notificaciones vía email (Resend) y Slack/MS Teams para equipos internos.

### 6. Roadmap sugerido
1. Migraciones Supabase + seeds básicos.
2. Autorización basada en roles (React Router + RLS).
3. Página “Iniciar Brief” (formulario multistep) y bandeja de productor.
4. Comentarios y actualizaciones con archivos adjuntos.
5. Portal cliente con timeline y entregables.
6. Integraciones externas y automatizaciones.

