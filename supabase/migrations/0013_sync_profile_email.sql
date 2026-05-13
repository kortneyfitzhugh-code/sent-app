-- Keep public.profile.email in sync with auth.users.email.
-- Supabase only updates auth.users.email AFTER the planter clicks the
-- verification link sent by auth.updateUser({ email }) — so this trigger
-- is exactly the "do not update the displayed email until they confirm"
-- guarantee. Until then, profile.email (and therefore everything reading
-- it: Settings identity card, sidebar avatar, team_invite RLS) shows the
-- previous address.

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profile set email = new.email, updated_at = now()
      where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_change on auth.users;
create trigger on_auth_user_email_change
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();
