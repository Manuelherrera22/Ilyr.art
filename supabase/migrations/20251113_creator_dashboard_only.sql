-- Migration: Creator Dashboard - Jobs, Payments, Quality Control
-- Solo tablas (sin RLS si ya existen)

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
