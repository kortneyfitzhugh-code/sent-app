"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  cancelTeamInvite,
  createTeamInvite,
  resendTeamInvite,
} from "@/lib/actions/team";

type Member = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  invitedAt: string;
  acceptedAt: string | null;
};
type Invite = {
  id: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  state: "pending" | "accepted" | "cancelled" | "expired";
};

export function TeamManager({
  members,
  invites,
}: {
  teamExists: boolean;
  members: Member[];
  invites: Invite[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await createTeamInvite(email);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEmail("");
      if (res.data.emailSent) {
        setNotice("Invite created and email sent.");
      } else {
        setNotice(
          `Invite created. Email delivery failed: ${res.data.emailError ?? "unknown"}. The invite link is still active — share it manually.`
        );
      }
      router.refresh();
    });
  }

  function handleCancel(inviteId: string) {
    startTransition(async () => {
      const res = await cancelTeamInvite(inviteId);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function handleResend(inviteId: string) {
    startTransition(async () => {
      const res = await resendTeamInvite(inviteId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice(
        res.data.emailSent
          ? "Email resent."
          : `Resend failed: ${res.data.emailError ?? "unknown"}.`
      );
    });
  }

  const pendingInvites = invites.filter((i) => i.state === "pending");
  const historicalInvites = invites.filter((i) => i.state !== "pending");
  const acceptedMembers = members.filter((m) => m.acceptedAt);

  return (
    <div className="flex flex-col gap-8">
      <section className="card p-5">
        <p className="label mb-3">Invite a team member</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            className="input-shell flex-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={pending}
            required
          />
          <button type="submit" className="btn-fire" disabled={pending || !email.trim()}>
            {pending ? "Sending…" : "Send invite"}
          </button>
        </form>
        {error && <p className="font-body text-fire text-sm mt-3">{error}</p>}
        {notice && <p className="font-body text-smoke text-sm mt-3">{notice}</p>}
      </section>

      <section className="flex flex-col gap-3">
        <p className="label">Active members · {acceptedMembers.length}</p>
        {acceptedMembers.length === 0 ? (
          <p className="font-body text-smoke text-sm">
            No one has accepted yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {acceptedMembers.map((m) => (
              <li key={m.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-bone">{m.name}</p>
                  <p className="label">{m.email}</p>
                </div>
                <span className="label text-alive">
                  Joined {relative(m.acceptedAt!)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <p className="label">Pending invites · {pendingInvites.length}</p>
        {pendingInvites.length === 0 ? (
          <p className="font-body text-smoke text-sm">No pending invites.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pendingInvites.map((i) => (
              <li key={i.id} className="card p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-body text-bone truncate">{i.email}</p>
                  <p className="label">
                    Sent {relative(i.createdAt)} · expires {relative(i.expiresAt)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleResend(i.id)}
                    disabled={pending}
                    className="btn-ghost"
                  >
                    Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancel(i.id)}
                    disabled={pending}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {historicalInvites.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="label">History · {historicalInvites.length}</p>
          <ul className="flex flex-col gap-2">
            {historicalInvites.map((i) => (
              <li key={i.id} className="card p-3 flex items-center justify-between opacity-70">
                <p className="font-body text-bone text-sm truncate">{i.email}</p>
                <span className="label">
                  {i.state}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function relative(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(ms);
  const future = ms > 0;
  const min = Math.round(abs / 60000);
  if (min < 60) return future ? `in ${min} min` : `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return future ? `in ${hr}h` : `${hr}h ago`;
  const d = Math.round(hr / 24);
  return future ? `in ${d}d` : `${d}d ago`;
}
