"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Role = "planter" | "team_member" | "network_admin";

const ROLES: { id: Role; title: string; body: string; tail: string }[] = [
  {
    id: "planter",
    title: "Planter",
    body: "I am planting or preparing to plant a church.",
    tail: "Begins formation. Selects a track.",
  },
  {
    id: "team_member",
    title: "Team Member",
    body: "I have been invited to join a planter’s team.",
    tail: "Requires invite code from a planter.",
  },
  {
    id: "network_admin",
    title: "Network Admin",
    body: "I oversee planters in my network or organization.",
    tail: "Network provisioning required. Read-only access.",
  },
];

export default function RoleStep() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [role, setRole] = useState<Role>("planter");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setBusy(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expired. Please sign in again.");
      setBusy(false);
      return;
    }
    const { error: updateError } = await supabase
      .from("profile")
      .update({ role })
      .eq("id", user.id);
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    // Team Member and Network Admin branches are out of scope for Session 1 —
    // they short-circuit to a notice. Planter continues to geography.
    if (role !== "planter") {
      router.push(`/onboarding/role-branch?role=${role}`);
      return;
    }
    router.push("/onboarding/geography");
  }

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current="role" />
      <div className="flex flex-col gap-3">
        <p className="label">Screen 11 · Step 02 of 05</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">How will you use Sent?</h1>
        <p className="font-body text-smoke text-sm">
          This choice routes the rest of your experience. It is not a label — it is an
          assignment.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROLES.map((r) => {
          const selected = r.id === role;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`card text-left p-5 transition-colors ${
                selected
                  ? "border-fire ring-1 ring-fire/40"
                  : "hover:border-ash"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="display text-2xl">{r.title}</span>
                <span className={`label ${selected ? "text-fire" : "text-smoke"}`}>
                  {selected ? "Selected" : "Select"}
                </span>
              </div>
              <p className="font-body text-bone mt-3">{r.body}</p>
              <p className="font-body text-smoke text-sm mt-1">{r.tail}</p>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm font-body text-fire">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button onClick={() => router.back()} className="btn-ghost">
          ← Back
        </button>
        <button onClick={handleContinue} className="btn-fire" disabled={busy}>
          {busy ? "Saving…" : `Continue as ${ROLES.find((r) => r.id === role)?.title} →`}
        </button>
      </div>
    </div>
  );
}
