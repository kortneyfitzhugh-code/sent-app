-- Session 3: team invitations.
-- The team and team_member tables already exist (0001). We add the
-- invite token table and two SECURITY DEFINER helpers so an unauthenticated
-- recipient can look up an invite by token, and an authenticated user can
-- accept one — both without giving anonymous callers raw row access.

create table if not exists public.team_invite (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references public.team(id) on delete cascade,
  inviter_id   uuid not null references public.profile(id) on delete cascade,
  email        text not null,
  token        uuid not null default gen_random_uuid(),
  role         user_role not null default 'team_member',
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null default (now() + interval '14 days'),
  accepted_at  timestamptz,
  accepted_by  uuid references public.profile(id) on delete set null,
  cancelled_at timestamptz,
  unique (token)
);

create index if not exists team_invite_team_idx on public.team_invite (team_id);
create index if not exists team_invite_email_idx on public.team_invite (lower(email));

alter table public.team_invite enable row level security;

-- Planter owns the team can read/write their team's invites.
drop policy if exists team_invite_planter_all on public.team_invite;
create policy team_invite_planter_all on public.team_invite
  for all
  using   (exists (select 1 from public.team t where t.id = team_id and t.planter_id = auth.uid()))
  with check (exists (select 1 from public.team t where t.id = team_id and t.planter_id = auth.uid()));

-- An invited user can read the invite addressed to their auth email.
drop policy if exists team_invite_recipient_read on public.team_invite;
create policy team_invite_recipient_read on public.team_invite
  for select
  using (lower(email) = lower((select email from auth.users where id = auth.uid())));

-- Look up an invite by token. Returns enough to render the accept page
-- without leaking arbitrary invite metadata. Anonymous-callable.
create or replace function public.lookup_invite(_token uuid)
returns table (
  invite_id     uuid,
  team_name     text,
  inviter_name  text,
  email         text,
  expires_at    timestamptz,
  accepted_at   timestamptz,
  cancelled_at  timestamptz
)
language sql
security definer
set search_path = public
as $$
  select ti.id, t.name, p.full_name, ti.email,
         ti.expires_at, ti.accepted_at, ti.cancelled_at
    from public.team_invite ti
    join public.team    t on t.id = ti.team_id
    join public.profile p on p.id = ti.inviter_id
   where ti.token = _token
   limit 1;
$$;

grant execute on function public.lookup_invite(uuid) to anon, authenticated;

-- Accept an invite. The caller must be authenticated and the invite must
-- be live (not accepted, cancelled, or expired). Inserts a team_member row
-- and stamps the invite.
create or replace function public.accept_invite(_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inv record;
begin
  if auth.uid() is null then
    raise exception 'Must be signed in to accept an invite' using errcode = '28000';
  end if;

  select * into inv from public.team_invite where token = _token;
  if not found then
    raise exception 'Invite not found' using errcode = 'P0002';
  end if;
  if inv.accepted_at is not null then
    raise exception 'Invite was already accepted' using errcode = 'P0001';
  end if;
  if inv.cancelled_at is not null then
    raise exception 'Invite was cancelled' using errcode = 'P0001';
  end if;
  if inv.expires_at < now() then
    raise exception 'Invite has expired' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.team t
     where t.id = inv.team_id and t.planter_id = auth.uid()
  ) then
    raise exception 'You are the planter of this team' using errcode = 'P0001';
  end if;

  insert into public.team_member (team_id, member_id, invited_at, accepted_at)
       values (inv.team_id, auth.uid(), inv.created_at, now())
  on conflict (team_id, member_id) do update
     set accepted_at = coalesce(public.team_member.accepted_at, excluded.accepted_at);

  update public.team_invite
     set accepted_at = now(),
         accepted_by = auth.uid()
   where id = inv.id;

  return inv.team_id;
end;
$$;

grant execute on function public.accept_invite(uuid) to authenticated;
