-- Session 4 item 4: per-planter answers to lesson reflection questions.
-- The lesson teaching text carries the question prose; this table stores
-- the answers keyed by (planter, lesson, question number).
create table if not exists public.lesson_reflection (
  id              uuid primary key default gen_random_uuid(),
  planter_id      uuid not null references public.profile(id) on delete cascade,
  lesson_id       uuid not null references public.lesson(id) on delete cascade,
  question_number integer not null,
  -- Snapshot of the question at the time of answering, so an edit to the
  -- lesson text in a later migration doesn't orphan the answer's meaning.
  question_text   text not null,
  answer          text,
  updated_at      timestamptz not null default now(),
  unique (planter_id, lesson_id, question_number)
);

create index if not exists lesson_reflection_planter_lesson_idx
  on public.lesson_reflection (planter_id, lesson_id);

alter table public.lesson_reflection enable row level security;

drop policy if exists lesson_reflection_self on public.lesson_reflection;
create policy lesson_reflection_self on public.lesson_reflection
  for all using (planter_id = auth.uid()) with check (planter_id = auth.uid());
