"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl, sendEmail, teamInviteEmail } from "@/lib/resend";

type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

// Ensure the planter has a team row; create one on first invite if missing.
async function getOrCreatePlanterTeam(supabase: ReturnType<typeof createSupabaseServerClient>, userId: string) {
  const { data: existing } = await supabase
    .from("team")
    .select("id, name")
    .eq("planter_id", userId)
    .maybeSingle();
  if (existing) return existing;

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();
  const teamName = `${profile?.full_name ?? "Planter"}'s team`;

  const { data: created, error } = await supabase
    .from("team")
    .insert({ planter_id: userId, name: teamName })
    .select("id, name")
    .single();
  if (error) throw new Error(error.message);
  return created;
}

export async function createTeamInvite(email: string): Promise<ActionResult<{ inviteId: string; emailSent: boolean; emailError?: string }>> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
    return { ok: false, error: "Enter a valid email." };
  }

  // Only planters can invite. RLS would block the insert anyway, but a clean
  // error is friendlier than a row-level violation.
  const { data: profile } = await supabase
    .from("profile")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "planter") {
    return { ok: false, error: "Only planters can invite team members." };
  }

  let team;
  try {
    team = await getOrCreatePlanterTeam(supabase, user.id);
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create team." };
  }

  // Reject if there's already a live (un-accepted, un-cancelled, un-expired) invite for this email.
  const { data: existing } = await supabase
    .from("team_invite")
    .select("id, accepted_at, cancelled_at, expires_at")
    .eq("team_id", team.id)
    .eq("email", trimmed)
    .is("accepted_at", null)
    .is("cancelled_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "An invite to this email is already pending." };
  }

  const { data: invite, error } = await supabase
    .from("team_invite")
    .insert({ team_id: team.id, inviter_id: user.id, email: trimmed })
    .select("id, token")
    .single();
  if (error) return { ok: false, error: error.message };

  const inviteUrl = `${getSiteUrl()}/invites/${invite.token}`;
  const { subject, html } = teamInviteEmail({
    inviterName: profile.full_name ?? "Your planter",
    teamName: team.name,
    inviteUrl,
  });

  const send = await sendEmail({ to: trimmed, subject, html });

  revalidatePath("/team");
  return {
    ok: true,
    data: {
      inviteId: invite.id,
      emailSent: send.ok,
      emailError: send.ok ? undefined : send.error,
    },
  };
}

export async function cancelTeamInvite(inviteId: string): Promise<ActionResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase
    .from("team_invite")
    .update({ cancelled_at: new Date().toISOString() })
    .eq("id", inviteId)
    .is("accepted_at", null)
    .is("cancelled_at", null);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/team");
  return { ok: true };
}

export async function resendTeamInvite(inviteId: string): Promise<ActionResult<{ emailSent: boolean; emailError?: string }>> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { data: invite } = await supabase
    .from("team_invite")
    .select("id, email, token, team:team_id(name, planter_id), inviter:inviter_id(full_name)")
    .eq("id", inviteId)
    .maybeSingle();
  if (!invite) return { ok: false, error: "Invite not found." };

  const team = invite.team as any;
  if (team?.planter_id !== user.id) {
    return { ok: false, error: "You don't own this invite." };
  }

  const inviteUrl = `${getSiteUrl()}/invites/${invite.token}`;
  const { subject, html } = teamInviteEmail({
    inviterName: (invite.inviter as any)?.full_name ?? "Your planter",
    teamName: team?.name ?? "the team",
    inviteUrl,
  });

  const send = await sendEmail({ to: invite.email, subject, html });
  return {
    ok: true,
    data: { emailSent: send.ok, emailError: send.ok ? undefined : send.error },
  };
}

export async function acceptInvite(token: string): Promise<ActionResult<{ teamId: string }>> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to accept this invite." };

  // accept_invite is a SECURITY DEFINER function; see migration 0007.
  const { data, error } = await supabase.rpc("accept_invite", { _token: token });
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Invite could not be accepted." };

  revalidatePath("/team");
  revalidatePath("/dashboard");
  return { ok: true, data: { teamId: data as string } };
}
