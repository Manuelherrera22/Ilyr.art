-- Ejecutar este SQL directamente en Supabase SQL Editor
-- https://supabase.com/dashboard/project/irfjdnwxbzlcpbxhjuqq/sql/new

-- ============================================
-- TABLAS DEL DASHBOARD DE CREADORES
-- ============================================

-- Tabla de trabajos disponibles para creadores
create table if not exists public.creator_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  skills_required text[] default '{}',
  budget_amount numeric not null,
  budget_currency text not null default 'USD',
  estimated_hours integer,
  deadline_date date not null,
  status text not null default 'open',
  assigned_to uuid references auth.users(id) on delete set null,
  assigned_at timestamptz,
  started_at timestamptz,
  submitted_at timestamptz,
  quality_score numeric,
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
  status text not null default 'pending',
  quality_review_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Tabla de revisiones de calidad
create table if not exists public.creator_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references public.creator_deliverables(id) on delete cascade,
  job_id uuid references public.creator_jobs(id) on delete cascade,
  reviewed_by uuid references auth.users(id) on delete set null,
  overall_score numeric not null,
  technical_score numeric,
  creative_score numeric,
  adherence_score numeric,
  feedback text,
  checklist jsonb default '{}'::jsonb,
  status text not null default 'pending',
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
  status text not null default 'pending',
  payment_method text,
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
  from_user_id uuid references auth.users(id) on delete set null,
  to_user_id uuid references auth.users(id) on delete cascade,
  feedback_type text not null,
  title text,
  message text not null,
  priority text not null default 'normal',
  status text not null default 'open',
  resolved_at timestamptz,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Índices
create index if not exists idx_creator_jobs_status on public.creator_jobs (status);
create index if not exists idx_creator_jobs_assigned_to on public.creator_jobs (assigned_to);
create index if not exists idx_creator_jobs_project on public.creator_jobs (project_id);
create index if not exists idx_creator_deliverables_job on public.creator_deliverables (job_id);
create index if not exists idx_creator_quality_reviews_deliverable on public.creator_quality_reviews (deliverable_id);
create index if not exists idx_creator_payments_creator on public.creator_payments (creator_id);
create index if not exists idx_creator_payments_status on public.creator_payments (status);
create index if not exists idx_creator_feedback_job on public.creator_feedback (job_id);
create index if not exists idx_creator_feedback_to_user on public.creator_feedback (to_user_id);

-- ============================================
-- RLS POLICIES
-- ============================================

alter table public.creator_jobs enable row level security;
alter table public.creator_deliverables enable row level security;
alter table public.creator_quality_reviews enable row level security;
alter table public.creator_payments enable row level security;
alter table public.creator_feedback enable row level security;

-- creator_jobs policies
drop policy if exists "creator_jobs_select_open_and_assigned" on public.creator_jobs;
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

drop policy if exists "creator_jobs_insert_producers" on public.creator_jobs;
create policy "creator_jobs_insert_producers" on public.creator_jobs
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

drop policy if exists "creator_jobs_update_producers_and_creators" on public.creator_jobs;
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

-- creator_deliverables policies
drop policy if exists "creator_deliverables_select" on public.creator_deliverables;
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

drop policy if exists "creator_deliverables_insert" on public.creator_deliverables;
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

drop policy if exists "creator_deliverables_update" on public.creator_deliverables;
create policy "creator_deliverables_update" on public.creator_deliverables
for update using (
  (submitted_by = auth.uid() and status = 'pending')
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- creator_quality_reviews policies
drop policy if exists "creator_quality_reviews_select" on public.creator_quality_reviews;
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

drop policy if exists "creator_quality_reviews_insert" on public.creator_quality_reviews;
create policy "creator_quality_reviews_insert" on public.creator_quality_reviews
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

drop policy if exists "creator_quality_reviews_update" on public.creator_quality_reviews;
create policy "creator_quality_reviews_update" on public.creator_quality_reviews
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- creator_payments policies
drop policy if exists "creator_payments_select" on public.creator_payments;
create policy "creator_payments_select" on public.creator_payments
for select using (
  creator_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

drop policy if exists "creator_payments_insert" on public.creator_payments;
create policy "creator_payments_insert" on public.creator_payments
for insert with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

drop policy if exists "creator_payments_update" on public.creator_payments;
create policy "creator_payments_update" on public.creator_payments
for update using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);

-- creator_feedback policies
drop policy if exists "creator_feedback_select" on public.creator_feedback;
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

drop policy if exists "creator_feedback_insert" on public.creator_feedback;
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

drop policy if exists "creator_feedback_update" on public.creator_feedback;
create policy "creator_feedback_update" on public.creator_feedback
for update using (
  to_user_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.profile_type in ('producer', 'admin')
  )
);
