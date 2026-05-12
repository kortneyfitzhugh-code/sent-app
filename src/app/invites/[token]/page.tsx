import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SentMark } from "@/components/SentMark";
import { AcceptInviteButton } from "./AcceptInviteButton";

// Validate that a string is a UUID before passing to the SECURITY DEFINER
// lookup_invite function — Supabase RPC would error on a malformed token
// and we'd rather render the friendly "not found" state.
function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export default async function AcceptInvitePage({
  params,
}: {
  params: { token: string };
}) {
  if (!isUuid(params.token)) notFound();

  const supabase = createSupabaseServerClient();
  const { data: rpcRows, error } = await supabase.rpc("lookup_invite", {
    _token: params.token,
  });

  if (error || !rpcRows || (Array.isArray(rpcRows) && rpcRows.length === 0)) {
    return <Shell><Missing /></Shell>;
  }

  const invite = Array.isArray(rpcRows) ? rpcRows[0] : rpcRows;
  const expired = new Date(invite.expires_at) < new Date();
  const accepted = !!invite.accepted_at;
  const cancelled = !!invite.cancelled_at;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let state: "accepted" | "cancelled" | "expired" | "ready" = "ready";
  if (accepted) state = "accepted";
  else if (cancelled) state = "cancelled";
  else if (expired) state = "expired";

  return (
    <Shell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="label text-fire">Team invitation · Sent</p>
          <h1 className="display text-4xl md:text-5xl leading-tight">
            {state === "ready" ? "You have been invited." : titleFor(state)}
          </h1>
        </header>

        <div className="card p-5 flex flex-col gap-4">
          <Row label="From" value={invite.inviter_name} />
          <Row label="Team" value={invite.team_name} />
          <Row label="To" value={invite.email} />
          {state === "ready" && (
            <Row
              label="Expires"
              value={new Date(invite.expires_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
          )}
        </div>

        {state === "ready" && !user && (
          <div className="flex flex-col gap-3">
            <p className="font-body text-smoke text-sm">
              Sign in to accept. New here?{" "}
              <Link
                href={`/signup?invite=${params.token}`}
                className="text-bone underline underline-offset-4"
              >
                Create your account
              </Link>{" "}
              with the invited email address, then return to this page.
            </p>
            <Link
              href={`/login?redirect=/invites/${params.token}`}
              className="btn-fire self-start"
            >
              Sign in to accept →
            </Link>
          </div>
        )}

        {state === "ready" && user && (
          <div className="flex flex-col gap-2">
            <AcceptInviteButton token={params.token} />
            <p className="label">
              You are signed in as {user.email}. Accepting will add you to{" "}
              {invite.team_name}.
            </p>
          </div>
        )}

        {state !== "ready" && (
          <p className="font-body text-smoke">
            {state === "accepted"
              ? "This invite has already been accepted. If that wasn't you, ask the planter to send a new one."
              : state === "cancelled"
              ? "This invite was cancelled. Ask the planter if they meant to."
              : "This invite has expired. Ask the planter to send a fresh one."}
          </p>
        )}

        <Link href="/" className="label">
          ← Back to Sent
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 md:px-12 md:py-8">
        <SentMark />
      </header>
      <main className="flex-1 px-6 pb-16 md:px-12 flex justify-center">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}

function Missing() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="display text-4xl">Invite not found.</h1>
      <p className="font-body text-smoke">
        This invite link is invalid or has been removed. Ask the planter who
        invited you to send a fresh one.
      </p>
      <Link href="/" className="btn-ghost self-start">
        Back to Sent
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="font-body text-bone mt-1">{value}</p>
    </div>
  );
}

function titleFor(s: "accepted" | "cancelled" | "expired"): string {
  if (s === "accepted") return "Already accepted.";
  if (s === "cancelled") return "Invite cancelled.";
  return "Invite expired.";
}
