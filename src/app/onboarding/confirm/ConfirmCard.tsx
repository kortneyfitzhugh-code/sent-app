"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  full_name: string;
  email: string;
  role: "planter" | "team_member" | "network_admin";
  city: string | null;
  state: string | null;
  country: string | null;
  track_id: string | null;
};

const ROLE_LABEL: Record<Profile["role"], string> = {
  planter: "Planter",
  team_member: "Team Member",
  network_admin: "Network Admin",
};

export function ConfirmCard({
  profile,
  track,
}: {
  profile: Profile;
  track: { name: string; module_count: number; duration_label: string | null } | null;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBegin() {
    setBusy(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expired.");
      setBusy(false);
      return;
    }
    const { error: upd } = await supabase
      .from("profile")
      .update({ onboarding_complete: true })
      .eq("id", user.id);
    setBusy(false);
    if (upd) {
      setError(upd.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const location = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current="confirm" />
      <div className="flex flex-col gap-3">
        <p className="label">Screen 11 · Step 05 of 05 · Confirmation</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">Everything is ready.</h1>
        <p className="font-body text-smoke text-sm">
          Confirm below. The next screen is Module 00 — Before the Blueprint.
        </p>
      </div>

      <div className="card p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        <Row label="Name" value={profile.full_name} />
        <Row label="Email" value={profile.email} />
        <Row label="Role" value={ROLE_LABEL[profile.role]} />
        <Row label="Location" value={location || "—"} />
        <div className="md:col-span-2 border-t border-cinder pt-6">
          <p className="label">Track</p>
          {track ? (
            <>
              <p className="display text-3xl mt-2">{track.name}</p>
              <p className="label text-fire mt-1">
                Active · {track.module_count} modules · {track.duration_label}
              </p>
            </>
          ) : (
            <p className="font-body text-smoke mt-2">No track selected.</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm font-body text-fire">{error}</p>}

      <div className="flex flex-col gap-3">
        <button onClick={handleBegin} className="btn-fire w-full" disabled={busy || !track}>
          {busy ? "Provisioning…" : "Begin Module 0 →"}
        </button>
        <p className="label text-center">
          You can update your profile and settings at any time.
        </p>
      </div>

      <div className="flex justify-between gap-3">
        <button onClick={() => router.push("/onboarding/track")} className="btn-ghost">
          ← Edit track
        </button>
        <button onClick={() => router.push("/onboarding/geography")} className="btn-ghost">
          ← Edit geography
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="font-body text-bone mt-2">{value}</p>
    </div>
  );
}
