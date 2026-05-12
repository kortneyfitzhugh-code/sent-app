import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TeamManager } from "./TeamManager";

export default async function TeamPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "planter") {
    return (
      <div className="p-6 md:p-10 max-w-xl">
        <h1 className="display text-4xl">Team</h1>
        <p className="font-body text-smoke mt-4">
          Only planters can manage a team. If you were invited, ask the planter
          who invited you to forward the invite link.
        </p>
      </div>
    );
  }

  const { data: team } = await supabase
    .from("team")
    .select("id, name")
    .eq("planter_id", user.id)
    .maybeSingle();

  type MemberRow = { id: string; member_id: string; invited_at: string; accepted_at: string | null; member: { full_name: string | null; email: string | null } };
  type InviteRow = { id: string; email: string; created_at: string; expires_at: string; accepted_at: string | null; cancelled_at: string | null };

  const [members, invites] = team
    ? await Promise.all([
        supabase
          .from("team_member")
          .select("id, member_id, invited_at, accepted_at, member:profile!member_id(full_name, email)")
          .eq("team_id", team.id)
          .order("invited_at", { ascending: false }),
        supabase
          .from("team_invite")
          .select("id, email, created_at, expires_at, accepted_at, cancelled_at")
          .eq("team_id", team.id)
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] as MemberRow[] }, { data: [] as InviteRow[] }];

  const memberList = (members.data ?? []) as unknown as MemberRow[];
  const inviteList = (invites.data ?? []) as InviteRow[];

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-3xl">
      <header className="flex flex-col gap-3">
        <p className="label">My team</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">
          {team?.name ?? `${profile.full_name ?? "Your"}'s team`}
        </h1>
        <p className="font-body text-smoke">
          Invite team members by email. They receive a branded link that lets
          them sign up (or sign in) and accept. Planter-only tasks remain
          enforced at the database layer — invited members can be assigned
          team-eligible tasks, never planter-only ones.
        </p>
      </header>

      <TeamManager
        teamExists={!!team}
        members={memberList.map((m) => ({
          id: m.id,
          memberId: m.member_id,
          name: m.member?.full_name ?? "Unnamed",
          email: m.member?.email ?? "",
          invitedAt: m.invited_at,
          acceptedAt: m.accepted_at,
        }))}
        invites={inviteList.map((i) => ({
          id: i.id,
          email: i.email,
          createdAt: i.created_at,
          expiresAt: i.expires_at,
          state:
            i.accepted_at
              ? "accepted"
              : i.cancelled_at
              ? "cancelled"
              : new Date(i.expires_at) < new Date()
              ? "expired"
              : "pending",
        }))}
      />
    </div>
  );
}
