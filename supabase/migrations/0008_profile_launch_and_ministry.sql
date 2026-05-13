-- Session 4 — settings expansion.
-- Add launch_date and ministry_name to the profile so the planter can drive
-- their dashboard runway and identify their plant. Both are optional; the
-- dashboard renders a graceful fallback when launch_date is null.
alter table public.profile
  add column if not exists launch_date date,
  add column if not exists ministry_name text;
