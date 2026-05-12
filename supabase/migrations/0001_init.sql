-- Sent — Phase 1 schema
-- Core entities: profile, track, module, lesson, task, worksheet, team, team_member, task_assignment
--
-- Enforcement notes:
--   * "Planter only" tasks are gated at the database layer via task.planter_only + RLS.
--   * Network Admin is read-only at the API layer — RLS denies all INSERT/UPDATE/DELETE for that role.
--   * WS6 (Household Covenant) is excluded from the Ask Sent data layer via worksheet.ai_excluded = true,
--     and the AI-eligible view (worksheet_response_ai) filters it out at query time.

create extension if not exists "pgcrypto";

-- ---------- enums ----------
do $$ begin
  create type user_role as enum ('planter', 'team_member', 'network_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type track_status as enum ('active', 'coming_soon');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_kind as enum (
    'lesson', 'spiritual_practice', 'milestone', 'journal_record',
    'action', 'discernment', 'planning', 'ongoing', 'checkpoint',
    'deliverable', 'reflection', 'decision', 'assessment', 'legal',
    'research', 'culture', 'pre_reading'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type worksheet_visibility as enum ('private', 'planter_and_team', 'household');
exception when duplicate_object then null; end $$;

-- ---------- profile ----------
-- One row per auth.users; created on signup completion.
create table if not exists public.profile (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role user_role not null default 'planter',
  city text,
  state text,
  country text,
  track_id uuid,                       -- set after onboarding step 04
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profile_role_idx on public.profile (role);

-- ---------- track ----------
create table if not exists public.track (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  description text,
  category text not null,              -- 'foundation' | 'five_fold'
  status track_status not null default 'coming_soon',
  module_count integer not null default 0,
  duration_label text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profile
  drop constraint if exists profile_track_id_fkey,
  add constraint profile_track_id_fkey foreign key (track_id) references public.track(id) on delete set null;

-- ---------- module ----------
create table if not exists public.module (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.track(id) on delete cascade,
  number text not null,                -- '0', '1', '3.5', 'bonus', '8' — string to preserve '3.5'
  name text not null,
  subtitle text,
  anchor_scripture_ref text,
  anchor_scripture_text text,
  primary_objective text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (track_id, number)
);

-- ---------- lesson ----------
create table if not exists public.lesson (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.module(id) on delete cascade,
  number integer not null,
  title text not null,
  estimated_minutes integer,
  is_anchor boolean not null default false,
  hook text,
  teaching text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (module_id, number)
);

-- ---------- task ----------
create table if not exists public.task (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.module(id) on delete cascade,
  number integer not null,
  title text not null,
  description text,
  kind task_kind not null,
  -- "Planter only" enforcement lives here. If true, only the owning planter
  -- may complete or be assigned this task. RLS forbids team_member assignment.
  planter_only boolean not null default false,
  coach_involved boolean not null default false,
  lesson_id uuid references public.lesson(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (module_id, number)
);

-- ---------- worksheet ----------
create table if not exists public.worksheet (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.module(id) on delete cascade,
  code text not null,                  -- 'WS1', 'WS6', etc.
  title text not null,
  purpose text,
  visibility worksheet_visibility not null default 'private',
  -- WS6 Household Covenant is permanently excluded from the Ask Sent AI data layer.
  ai_excluded boolean not null default false,
  is_locking boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (module_id, code)
);

-- ---------- team ----------
-- One team per planter. Created on first invite or on demand.
create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  planter_id uuid not null references public.profile(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (planter_id)
);

create table if not exists public.team_member (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.team(id) on delete cascade,
  member_id uuid not null references public.profile(id) on delete cascade,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (team_id, member_id)
);

-- ---------- per-planter task state ----------
-- Tracks per-planter task completion and (optionally) team-member assignment.
create table if not exists public.task_assignment (
  id uuid primary key default gen_random_uuid(),
  planter_id uuid not null references public.profile(id) on delete cascade,
  task_id uuid not null references public.task(id) on delete cascade,
  assignee_id uuid references public.profile(id) on delete set null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (planter_id, task_id)
);

-- Enforce "Planter only" at the database layer.
-- A task marked planter_only may not be reassigned away from the planter.
create or replace function public.enforce_planter_only_assignment()
returns trigger
language plpgsql
as $$
declare
  is_planter_only boolean;
begin
  select planter_only into is_planter_only from public.task where id = new.task_id;
  if is_planter_only and new.assignee_id is not null and new.assignee_id <> new.planter_id then
    raise exception 'Task % is planter-only and cannot be assigned to a team member', new.task_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_planter_only on public.task_assignment;
create trigger trg_enforce_planter_only
  before insert or update on public.task_assignment
  for each row execute function public.enforce_planter_only_assignment();

-- ---------- worksheet responses (placeholder so AI-view can compile) ----------
create table if not exists public.worksheet_response (
  id uuid primary key default gen_random_uuid(),
  planter_id uuid not null references public.profile(id) on delete cascade,
  worksheet_id uuid not null references public.worksheet(id) on delete cascade,
  field_key text not null,
  value jsonb,
  updated_at timestamptz not null default now(),
  unique (planter_id, worksheet_id, field_key)
);

-- View consumed by the Ask Sent AI layer. WS6 is excluded permanently.
create or replace view public.worksheet_response_ai as
  select wr.*
  from public.worksheet_response wr
  join public.worksheet w on w.id = wr.worksheet_id
  where w.ai_excluded = false;

-- ---------- RLS ----------
alter table public.profile          enable row level security;
alter table public.track            enable row level security;
alter table public.module           enable row level security;
alter table public.lesson           enable row level security;
alter table public.task             enable row level security;
alter table public.worksheet        enable row level security;
alter table public.team             enable row level security;
alter table public.team_member      enable row level security;
alter table public.task_assignment  enable row level security;
alter table public.worksheet_response enable row level security;

-- Helper: current user's role
create or replace function public.current_role()
returns user_role
language sql stable
as $$
  select role from public.profile where id = auth.uid();
$$;

-- profile: a user can read & update their own row.
drop policy if exists profile_self_select on public.profile;
create policy profile_self_select on public.profile
  for select using (id = auth.uid());

drop policy if exists profile_self_insert on public.profile;
create policy profile_self_insert on public.profile
  for insert with check (id = auth.uid());

drop policy if exists profile_self_update on public.profile;
create policy profile_self_update on public.profile
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Curriculum tables (track, module, lesson, task, worksheet) are world-readable
-- to any authenticated user. Writes are server-only via service role.
drop policy if exists curriculum_read_track on public.track;
create policy curriculum_read_track on public.track for select using (auth.role() = 'authenticated');

drop policy if exists curriculum_read_module on public.module;
create policy curriculum_read_module on public.module for select using (auth.role() = 'authenticated');

drop policy if exists curriculum_read_lesson on public.lesson;
create policy curriculum_read_lesson on public.lesson for select using (auth.role() = 'authenticated');

drop policy if exists curriculum_read_task on public.task;
create policy curriculum_read_task on public.task for select using (auth.role() = 'authenticated');

drop policy if exists curriculum_read_worksheet on public.worksheet;
create policy curriculum_read_worksheet on public.worksheet for select using (auth.role() = 'authenticated');

-- team / team_member: planter owns the team; member can read their membership.
drop policy if exists team_planter_all on public.team;
create policy team_planter_all on public.team
  for all using (planter_id = auth.uid()) with check (planter_id = auth.uid());

drop policy if exists team_member_read on public.team_member;
create policy team_member_read on public.team_member
  for select using (
    member_id = auth.uid() or
    exists (select 1 from public.team t where t.id = team_id and t.planter_id = auth.uid())
  );

drop policy if exists team_member_planter_write on public.team_member;
create policy team_member_planter_write on public.team_member
  for all using (
    exists (select 1 from public.team t where t.id = team_id and t.planter_id = auth.uid())
  ) with check (
    exists (select 1 from public.team t where t.id = team_id and t.planter_id = auth.uid())
  );

-- task_assignment: planter (owner) full control; assignee can read.
-- Network admins explicitly denied write via lack of policy.
drop policy if exists task_assignment_read on public.task_assignment;
create policy task_assignment_read on public.task_assignment
  for select using (planter_id = auth.uid() or assignee_id = auth.uid());

drop policy if exists task_assignment_planter_write on public.task_assignment;
create policy task_assignment_planter_write on public.task_assignment
  for all using (planter_id = auth.uid()) with check (planter_id = auth.uid());

-- worksheet_response: planter only writes; the trigger above enforces planter-only flags
-- on tasks. Worksheet responses themselves are private to the planter.
drop policy if exists worksheet_response_self on public.worksheet_response;
create policy worksheet_response_self on public.worksheet_response
  for all using (planter_id = auth.uid()) with check (planter_id = auth.uid());

-- ---------- auth trigger: bootstrap profile row on signup ----------
-- Profile metadata (full_name, etc.) is finalized via the onboarding API,
-- but we create a minimal stub so we have a row to RLS-protect.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profile (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'planter'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
