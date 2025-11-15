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

