"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Track = {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  category: string;
  status: "active" | "coming_soon";
  module_count: number;
  duration_label: string | null;
};

export function TrackPicker({ tracks }: { tracks: Track[] }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const active = useMemo(() => tracks.find((t) => t.status === "active"), [tracks]);
  const [selected, setSelected] = useState<string | null>(active?.id ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const foundation = tracks.filter((t) => t.category === "foundation");
  const fivefold = tracks.filter((t) => t.category === "five_fold");

  async function handleContinue() {
    if (!selected) {
      setError("Select a track to continue.");
      return;
    }
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
      .update({ track_id: selected })
      .eq("id", user.id);
    setBusy(false);
    if (upd) {
      setError(upd.message);
      return;
    }
    router.push("/onboarding/confirm");
  }

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current="track" />
      <div className="flex flex-col gap-3">
        <p className="label">Step 04 of 05 · Choose your formation track</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">Which path are you walking?</h1>
        <p className="font-body text-smoke text-sm">
          Sent runs eight formation tracks. Each one is a complete curriculum — its own
          modules, worksheets, mentors, and rhythm. Pick the one that matches your primary
          assignment, not every gift you carry. You can only walk one path at a time.
        </p>
      </div>

      <Section title="Foundation tracks">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundation.map((t) => (
            <TrackCard
              key={t.id}
              track={t}
              selected={selected === t.id}
              onSelect={() => t.status === "active" && setSelected(t.id)}
            />
          ))}
        </div>
      </Section>

      <Section title="The five-fold tracks" caption="Ephesians 4:11 · in order">
        {/* Single column on mobile/tablet — five-across is cramped under ~1280px. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {fivefold.map((t) => (
            <TrackCard
              key={t.id}
              track={t}
              selected={selected === t.id}
              onSelect={() => t.status === "active" && setSelected(t.id)}
            />
          ))}
        </div>
      </Section>

      <p className="font-body text-smoke text-xs border-l border-cinder pl-4">
        One track at a time. A planter who also carries a prophetic gift still walks the
        Church Planting track. The Prophet track is a separate formation path for those
        whose primary assignment is prophetic ministry — not a supplement to another path.
      </p>

      {error && <p className="text-sm font-body text-fire">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button onClick={() => router.back()} className="btn-ghost">
          ‹ Back · Geography
        </button>
        <button onClick={handleContinue} className="btn-fire" disabled={busy}>
          {busy ? "Saving…" : "Continue · Confirm ›"}
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="label text-bone">{title}</h2>
        {caption && <span className="label">{caption}</span>}
      </div>
      {children}
    </section>
  );
}

function TrackCard({
  track,
  selected,
  onSelect,
}: {
  track: Track;
  selected: boolean;
  onSelect: () => void;
}) {
  const locked = track.status !== "active";
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      className={`card text-left p-5 flex flex-col gap-3 min-h-[180px] transition-colors ${
        selected
          ? "border-fire ring-1 ring-fire/40"
          : locked
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-ash"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="label">Formation</span>
        <span className={`label ${locked ? "text-smoke" : "text-fire"}`}>
          {locked ? "Coming soon" : selected ? "✓ Selected" : "Active"}
        </span>
      </div>
      <div>
        <h3 className="display text-2xl leading-tight">{track.name}</h3>
        {track.subtitle && (
          <p className="font-body text-smoke text-sm mt-2">{track.subtitle}</p>
        )}
      </div>
      <div className="mt-auto label">
        {locked
          ? "Available in a future release."
          : `${track.module_count} modules · ${track.duration_label}`}
      </div>
    </button>
  );
}
