-- Session 4 redux item 2: WS2 Prophetic Confirmation Journal.
--
-- The static 8-field WS2 schema (entry1.*, patterns.*) we seeded in
-- migration 0004 was designed for a single-entry worksheet. The design
-- evolved to a multi-entry sealed journal — there is no way to model that
-- against (planter, worksheet, field_key) without abusing the schema.
--
-- We add a dedicated journal_entry table linked to the WS2 worksheet via
-- worksheet_id. The original worksheet_field rows stay in place as
-- curriculum metadata (no responses written against them) — they can be
-- repurposed for the patterns-reflection feature in a later phase.

create table if not exists public.journal_entry (
  id              uuid primary key default gen_random_uuid(),
  planter_id      uuid not null references public.profile(id) on delete cascade,
  worksheet_id    uuid not null references public.worksheet(id) on delete cascade,
  parent_entry_id uuid references public.journal_entry(id) on delete set null,
  entry_type      text not null
    check (entry_type in ('prophetic_word','scripture','dream_vision','conversation')),
  headline        text not null,
  body            text not null,
  where_location  text,
  scripture_ref   text,
  threads         text[] not null default '{}',
  sealed_at       timestamptz not null default now()
);

create index if not exists journal_entry_planter_idx
  on public.journal_entry (planter_id, sealed_at desc);
create index if not exists journal_entry_parent_idx
  on public.journal_entry (parent_entry_id);

alter table public.journal_entry enable row level security;

drop policy if exists journal_entry_self_select on public.journal_entry;
create policy journal_entry_self_select on public.journal_entry
  for select using (planter_id = auth.uid());

drop policy if exists journal_entry_self_insert on public.journal_entry;
create policy journal_entry_self_insert on public.journal_entry
  for insert with check (planter_id = auth.uid());

drop policy if exists journal_entry_self_delete on public.journal_entry;
create policy journal_entry_self_delete on public.journal_entry
  for delete using (planter_id = auth.uid());
