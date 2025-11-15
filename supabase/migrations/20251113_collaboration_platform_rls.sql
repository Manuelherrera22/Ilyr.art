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

