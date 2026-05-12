"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Other",
];

export default function GeographyStep() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("United States");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
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
    const { error: upd } = await supabase
      .from("profile")
      .update({ city, state, country })
      .eq("id", user.id);
    setBusy(false);
    if (upd) {
      setError(upd.message);
      return;
    }
    router.push("/onboarding/track");
  }

  return (
    <form onSubmit={handleContinue} className="flex flex-col gap-10">
      <StepHeader current="geography" />
      <div className="flex flex-col gap-3">
        <p className="label">Screen 11 · Step 03 of 05</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">
          Where are you <em className="not-italic text-fire">sent</em>?
        </h1>
        <p className="font-body text-smoke text-sm">
          This is the question the rest of the platform answers. Be specific.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="label">City</span>
          <input
            className="input-shell"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Kansas City"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label">State / Province</span>
          <input
            className="input-shell"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="Missouri"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label">Country</span>
          <select
            className="input-shell"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-carbon">
                {c}
              </option>
            ))}
          </select>
        </label>
        <p className="font-body text-smoke text-xs">
          Used to connect you with planters in your region and to inform Ask Sent’s context.
          Never shared publicly.
        </p>
      </div>

      {error && <p className="text-sm font-body text-fire">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          ← Back
        </button>
        <button type="submit" className="btn-fire" disabled={busy}>
          {busy ? "Saving…" : "Continue →"}
        </button>
      </div>
    </form>
  );
}
