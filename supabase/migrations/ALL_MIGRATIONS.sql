-- Migraciones combinadas para ejecución
-- Generado automáticamente

-- ============================================
-- Archivo: 20251113_collaboration_platform.sql
-- ============================================

-- Migration: collaboration platform core tables
-- Generated at 2025-11-13

create table if not exists public.client_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_email text not null,
  status text not null default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_account_id uuid references public.client_accounts(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  visibility text not null default 'client',
  service_package_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references auth.users(id) on delete set null,
  submitted_by uuid references auth.users(id) on delete set null,
  status text not null default 'submitted',
  objective text,
  audience text,
  key_messages text,
  budget_range text,
  deadline_date date,
  references_payload jsonb default '[]'::jsonb,
  attachments jsonb default '[]'::jsonb,
  ai_insights jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null,
  stage text,
  status text not null default 'active',
  workload jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  description text,
  due_at timestamptz,
  approved_at timestamptz,
  status text not null default 'pending',
  approved_by uuid references auth.users(id) on delete set null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  type text not null,
  title text,
  body text,
  files jsonb default '[]'::jsonb,
  status_tag text,
  visible_for_client boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  author_id uuid references auth.users(id) on delete cascade,
  parent_id uuid references public.project_comments(id) on delete cascade,
  message text not null,
  visibility text not null default 'client',
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  version integer not null default 1,
  type text not null,
  file_url text not null,
  notes text,
  is_final boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  from_price numeric,
  deliverables jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  type text not null,
  payload jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists client_account_id uuid references public.client_accounts(id) on delete set null,
  add column if not exists profile_type text not null default 'client';

create index if not exists idx_projects_client on public.projects (client_account_id);
create index if not exists idx_project_briefs_project on public.project_briefs (project_id);
create index if not exists idx_project_assignments_project on public.project_assignments (project_id);
create index if not exists idx_project_milestones_project on public.project_milestones (project_id);
create index if not exists idx_project_updates_project on public.project_updates (project_id);
create index if not exists idx_project_comments_project on public.project_comments (project_id);
create index if not exists idx_project_assets_project on public.project_assets (project_id);
create index if not exists idx_notifications_user on public.notifications (user_id);

comment on table public.client_accounts is 'Cuenta corporativa o de marca asociada a uno o varios usuarios clientes.';
comment on table public.projects is 'Proyectos gestionados por el estudio, vinculados a un brief y un squad.';
comment on table public.project_briefs is 'Brief colaborativo con información estratégica para iniciar un proyecto.';
comment on table public.project_assignments is 'Asignaciones de productores y especialistas a proyectos.';
comment on table public.project_milestones is 'Hitos y aprobaciones clave dentro del timeline.';
comment on table public.project_updates is 'Actualizaciones y propuestas visibles para el cliente.';
comment on table public.project_comments is 'Comentarios y conversaciones, con soporte para visibilidad interna.';
comment on table public.project_assets is 'Archivos y entregables versionados.';
comment on table public.notifications is 'Notificaciones in-app o disparadores de email para cada usuario.';



-- ============================================
-- Archivo: 20251113_collaboration_platform_rls.sql
-- ============================================

-- Migration: Row Level Security policies and seed roles
-- Generated at 2025-11-13

-- Ensure unique contact emails for client accounts to simplify seeds
do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'client_accounts_contact_email_key'
  ) then
    execute 'alter table public.client_accounts add constraint client_accounts_contact_email_key unique (contact_email)';
  end if;
end $$;

-- Enable RLS on collaborative tables
alter table public.client_accounts enable row level security;
alter table public.projects enable row level security;
alter table public.project_briefs enable row level security;
alter table public.project_assignments enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_updates enable row level security;
alter table public.project_comments enable row level security;
alter table public.project_assets enable row level security;
alter table public.notifications enable row level security;

-------------------------------------------------------------------------------
-- client_accounts policies
-------------------------------------------------------------------------------
create policy "client_accounts_select" on public.client_accounts
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        p.profile_type in ('producer','admin')
        or p.client_account_id = client_accounts.id
      )
  )
);

create policy "client_accounts_update_admin" on public.client_accounts
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type = 'admin'
  )
);

-------------------------------------------------------------------------------
-- projects policies
-------------------------------------------------------------------------------
create policy "projects_select_by_role" on public.projects
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = projects.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = projects.id
      and pa.user_id = auth.uid()
  )
);

create policy "projects_insert_clients" on public.projects
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type = 'client'
      and p.client_account_id = projects.client_account_id
  )
);

create policy "projects_update_producers" on public.projects
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-------------------------------------------------------------------------------
-- project_briefs policies
-------------------------------------------------------------------------------
create policy "project_briefs_select_scope" on public.project_briefs
for select using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_briefs.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1
    from public.project_assignments pa
    where pa.project_id = project_briefs.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_briefs_insert_clients" on public.project_briefs
for insert with check (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_briefs.project_id
      and p.profile_type = 'client'
      and p.client_account_id = pr.client_account_id
  )
);

create policy "project_briefs_update_producers" on public.project_briefs
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-------------------------------------------------------------------------------
-- project_assignments policies
-------------------------------------------------------------------------------
create policy "project_assignments_select_scope" on public.project_assignments
for select using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
  or user_id = auth.uid()
);

create policy "project_assignments_modify_producers" on public.project_assignments
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-------------------------------------------------------------------------------
-- project_milestones / project_updates / project_comments / project_assets
-------------------------------------------------------------------------------
create policy "project_milestones_select_scope" on public.project_milestones
for select using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_milestones.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = project_milestones.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_milestones_modify_producers" on public.project_milestones
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-- Reuse same pattern for updates/comments/assets
create policy "project_updates_select_scope" on public.project_updates
for select using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_updates.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = project_updates.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_updates_modify_producers" on public.project_updates
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

create policy "project_comments_select_scope" on public.project_comments
for select using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_comments.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = project_comments.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_comments_modify_collaborators" on public.project_comments
for insert with check (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_comments.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = project_comments.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_assets_select_scope" on public.project_assets
for select using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = auth.uid()
    where pr.id = project_assets.project_id
      and (
        p.profile_type in ('producer','admin')
        or (p.profile_type = 'client' and p.client_account_id = pr.client_account_id)
      )
  )
  or exists (
    select 1 from public.project_assignments pa
    where pa.project_id = project_assets.project_id
      and pa.user_id = auth.uid()
  )
);

create policy "project_assets_modify_producers" on public.project_assets
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-------------------------------------------------------------------------------
-- notifications policies
-------------------------------------------------------------------------------
create policy "notifications_access_owner" on public.notifications
for select using (user_id = auth.uid());

create policy "notifications_manage_service" on public.notifications
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer','admin')
  )
);

-------------------------------------------------------------------------------
-- Seed demo roles and client account (optional; runs only if emails exist)
-------------------------------------------------------------------------------
do $$
declare
  demo_account_id uuid;
begin
  insert into public.client_accounts (company_name, contact_email, status)
  values ('Demo Brand', 'client@demo.com', 'active')
  on conflict (contact_email) do update
  set company_name = excluded.company_name,
      status = excluded.status
  returning id into demo_account_id;

  update public.profiles
  set profile_type = 'client',
      client_account_id = demo_account_id
  where id in (select id from auth.users where email = 'client@demo.com');

  update public.profiles
  set profile_type = 'producer',
      client_account_id = null
  where id in (select id from auth.users where email = 'producer@ilyr.art');

  update public.profiles
  set profile_type = 'creative',
      client_account_id = null
  where id in (select id from auth.users where email = 'creative@ilyr.art');

  update public.profiles
  set profile_type = 'admin',
      client_account_id = null
  where id in (select id from auth.users where email = 'admin@ilyr.art');
end $$;



-- ============================================
-- Archivo: 20251113_creator_dashboard.sql
-- ============================================

-- Migration: Creator Dashboard - Jobs, Payments, Quality Control
-- Generated at 2025-11-13

-- Tabla de trabajos disponibles para creadores
create table if not exists public.creator_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  category text not null, -- 'vfx', 'cgi', 'post', 'animation', etc.
  skills_required text[] default '{}',
  budget_amount numeric not null,
  budget_currency text not null default 'USD',
  estimated_hours integer,
  deadline_date date not null,
  status text not null default 'open', -- 'open', 'assigned', 'in_progress', 'submitted', 'in_review', 'approved', 'rejected', 'completed', 'cancelled'
  assigned_to uuid references auth.users(id) on delete set null,
  assigned_at timestamptz,
  started_at timestamptz,
  submitted_at timestamptz,
  quality_score numeric, -- 0-100
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Tabla de entregas de trabajos
create table if not exists public.creator_deliverables (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.creator_jobs(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  version integer not null default 1,
  file_url text not null,
  file_type text not null,
  file_size bigint,
  notes text,
  status text not null default 'pending', -- 'pending', 'in_review', 'approved', 'rejected', 'revision_requested'
  quality_review_id uuid, -- referencia a creator_quality_reviews
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Tabla de revisiones de calidad
create table if not exists public.creator_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references public.creator_deliverables(id) on delete cascade,
  job_id uuid references public.creator_jobs(id) on delete cascade,
  reviewed_by uuid references auth.users(id) on delete set null, -- productor o admin
  overall_score numeric not null, -- 0-100
  technical_score numeric, -- 0-100
  creative_score numeric, -- 0-100
  adherence_score numeric, -- 0-100 (cumplimiento del brief)
  feedback text,
  checklist jsonb default '{}'::jsonb, -- checklist de calidad
  status text not null default 'pending', -- 'pending', 'passed', 'failed', 'needs_revision'
  passed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Tabla de pagos
create table if not exists public.creator_payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.creator_jobs(id) on delete cascade,
  creator_id uuid references auth.users(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'USD',
  status text not null default 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  payment_method text, -- 'bank_transfer', 'paypal', 'stripe', etc.
  transaction_id text,
  paid_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Tabla de retroalimentación estructurada
create table if not exists public.creator_feedback (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.creator_jobs(id) on delete cascade,
  deliverable_id uuid references public.creator_deliverables(id) on delete cascade,
  from_user_id uuid references auth.users(id) on delete set null, -- quien da feedback
  to_user_id uuid references auth.users(id) on delete cascade, -- creador
  feedback_type text not null, -- 'technical', 'creative', 'general', 'revision'
  title text,
  message text not null,
  priority text not null default 'normal', -- 'low', 'normal', 'high', 'urgent'
  status text not null default 'open', -- 'open', 'acknowledged', 'resolved', 'closed'
  resolved_at timestamptz,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Índices para mejorar rendimiento
create index if not exists idx_creator_jobs_status on public.creator_jobs (status);
create index if not exists idx_creator_jobs_assigned_to on public.creator_jobs (assigned_to);
create index if not exists idx_creator_jobs_project on public.creator_jobs (project_id);
create index if not exists idx_creator_deliverables_job on public.creator_deliverables (job_id);
create index if not exists idx_creator_quality_reviews_deliverable on public.creator_quality_reviews (deliverable_id);
create index if not exists idx_creator_payments_creator on public.creator_payments (creator_id);
create index if not exists idx_creator_payments_status on public.creator_payments (status);
create index if not exists idx_creator_feedback_job on public.creator_feedback (job_id);
create index if not exists idx_creator_feedback_to_user on public.creator_feedback (to_user_id);

-- Comentarios
comment on table public.creator_jobs is 'Trabajos disponibles para creadores con presupuesto y requisitos definidos por Ilyrart';
comment on table public.creator_deliverables is 'Entregas de trabajos por parte de los creadores';
comment on table public.creator_quality_reviews is 'Revisiones de calidad con scoring y checklist';
comment on table public.creator_payments is 'Pagos a creadores por trabajos completados';
comment on table public.creator_feedback is 'Retroalimentación estructurada entre productores y creadores';


-- ============================================
-- Archivo: 20251113_creator_dashboard_rls.sql
-- ============================================

-- Migration: RLS policies for Creator Dashboard tables
-- Generated at 2025-11-13

-- Enable RLS
alter table public.creator_jobs enable row level security;
alter table public.creator_deliverables enable row level security;
alter table public.creator_quality_reviews enable row level security;
alter table public.creator_payments enable row level security;
alter table public.creator_feedback enable row level security;

-------------------------------------------------------------------------------
-- creator_jobs policies
-------------------------------------------------------------------------------
-- Los creadores pueden ver trabajos abiertos y sus propios trabajos asignados
create policy "creator_jobs_select_open_and_assigned" on public.creator_jobs
for select using (
  status = 'open'
  or assigned_to = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- Solo productores y admins pueden crear/actualizar trabajos
create policy "creator_jobs_insert_producers" on public.creator_jobs
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

create policy "creator_jobs_update_producers_and_creators" on public.creator_jobs
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
  or assigned_to = auth.uid()
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
  or assigned_to = auth.uid()
);

-------------------------------------------------------------------------------
-- creator_deliverables policies
-------------------------------------------------------------------------------
-- Creadores pueden ver sus entregas, productores y admins todas
create policy "creator_deliverables_select" on public.creator_deliverables
for select using (
  submitted_by = auth.uid()
  or exists (
    select 1 from public.creator_jobs cj
    where cj.id = creator_deliverables.job_id
      and cj.assigned_to = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- Creadores pueden crear entregas para sus trabajos asignados
create policy "creator_deliverables_insert" on public.creator_deliverables
for insert with check (
  submitted_by = auth.uid()
  and exists (
    select 1 from public.creator_jobs cj
    where cj.id = creator_deliverables.job_id
      and cj.assigned_to = auth.uid()
      and cj.status in ('assigned', 'in_progress')
  )
);

-- Creadores pueden actualizar sus entregas pendientes, productores todas
create policy "creator_deliverables_update" on public.creator_deliverables
for update using (
  (submitted_by = auth.uid() and status = 'pending')
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-------------------------------------------------------------------------------
-- creator_quality_reviews policies
-------------------------------------------------------------------------------
-- Creadores pueden ver revisiones de sus entregas, productores todas
create policy "creator_quality_reviews_select" on public.creator_quality_reviews
for select using (
  exists (
    select 1 from public.creator_deliverables cd
    join public.creator_jobs cj on cj.id = cd.job_id
    where cd.id = creator_quality_reviews.deliverable_id
      and cj.assigned_to = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- Solo productores y admins pueden crear/actualizar revisiones
create policy "creator_quality_reviews_insert" on public.creator_quality_reviews
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

create policy "creator_quality_reviews_update" on public.creator_quality_reviews
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-------------------------------------------------------------------------------
-- creator_payments policies
-------------------------------------------------------------------------------
-- Creadores pueden ver sus propios pagos, productores y admins todos
create policy "creator_payments_select" on public.creator_payments
for select using (
  creator_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- Solo productores y admins pueden crear/actualizar pagos
create policy "creator_payments_insert" on public.creator_payments
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

create policy "creator_payments_update" on public.creator_payments
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-------------------------------------------------------------------------------
-- creator_feedback policies
-------------------------------------------------------------------------------
-- Creadores pueden ver feedback dirigido a ellos, productores todos
create policy "creator_feedback_select" on public.creator_feedback
for select using (
  to_user_id = auth.uid()
  or from_user_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- Cualquier usuario autenticado puede crear feedback
create policy "creator_feedback_insert" on public.creator_feedback
for insert with check (
  auth.uid() is not null
  and (
    from_user_id = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.profile_type in ('producer', 'admin')
    )
  )
);

-- Creadores pueden actualizar feedback dirigido a ellos, productores todos
create policy "creator_feedback_update" on public.creator_feedback
for update using (
  to_user_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);


