-- Fix: the previous team_invite_recipient_read policy read from auth.users,
-- which the authenticated role can't SELECT from — every recipient hitting
-- /invites/[token] (or any team_invite read RLS-gated on email) 403s with
-- "permission denied for table users". Read from public.profile instead,
-- which already has its own self-only RLS so this is no information leak:
-- the policy compares the invite email to the *current user's* profile email.
drop policy if exists team_invite_recipient_read on public.team_invite;
create policy team_invite_recipient_read on public.team_invite
  for select
  using (
    lower(email) = lower((
      select email from public.profile where id = auth.uid()
    ))
  );
