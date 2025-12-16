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
