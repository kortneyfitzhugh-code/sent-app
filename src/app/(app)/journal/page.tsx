import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JournalComposer } from "./JournalComposer";
import { SealedEntry, type SealedEntryRow } from "./SealedEntry";

export default async function JournalPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // WS2 is the journal's worksheet anchor — entries are children of it.
  const { data: worksheet } = await supabase
    .from("worksheet")
    .select("id, title, purpose")
    .eq("code", "WS2")
    .maybeSingle();
  if (!worksheet) {
    return (
      <div className="p-6 md:p-10 max-w-xl">
        <h1 className="display text-4xl">Journal unavailable</h1>
        <p className="font-body text-smoke mt-4">
          WS2 isn't seeded for this track yet.
        </p>
      </div>
    );
  }

  const { data: entries } = await supabase
    .from("journal_entry")
    .select(
      "id, parent_entry_id, entry_type, headline, body, where_location, scripture_ref, threads, sealed_at"
    )
    .eq("planter_id", user.id)
    .order("sealed_at", { ascending: false });

  // Headline lookup so a follow-up entry can show "Follow-up to: …".
  const headlineById = new Map<string, string>(
    (entries ?? []).map((e) => [e.id, e.headline])
  );

  const rows: SealedEntryRow[] = (entries ?? []).map((e) => ({
    id: e.id,
    entryType: e.entry_type as SealedEntryRow["entryType"],
    headline: e.headline,
    body: e.body,
    whereLocation: e.where_location,
    scriptureRef: e.scripture_ref,
    threads: e.threads ?? [],
    sealedAt: e.sealed_at,
    parentHeadline: e.parent_entry_id
      ? headlineById.get(e.parent_entry_id) ?? null
      : null,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-8 max-w-3xl">
        <header className="flex flex-col gap-3">
          <p className="label">WS2 · Recurring journal</p>
          <h1 className="display text-4xl md:text-5xl leading-tight">
            {worksheet.title}
          </h1>
          <p className="font-body text-smoke text-sm">
            The day will come when you want to quit. The call will feel distant.
            The cost will feel too high. This journal exists for that day —
            return to it when the enemy tells you that God never spoke. Entries
            are sealed and timestamped at the moment you write them.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
            <Stat label="Sealed entries" value={rows.length} />
            <Stat
              label="This week"
              value={rows.filter((r) => isWithinDays(r.sealedAt, 7)).length}
            />
            <Stat
              label="Threads tracked"
              value={countUniqueThreads(rows)}
            />
          </div>
        </header>

        <JournalComposer worksheetId={worksheet.id} />

        <section className="flex flex-col gap-3">
          <p className="label">Sealed entries · newest first</p>
          {rows.length === 0 ? (
            <p className="font-body text-smoke text-sm">
              No entries yet. Your first sealed word goes above.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {rows.map((r) => (
                <SealedEntry key={r.id} entry={r} worksheetId={worksheet.id} />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Pattern-recognition rail — placeholder while Ask Sent is offline. */}
      <aside className="hidden xl:flex flex-col gap-4 sticky top-6 self-start">
        <div className="card p-5 border-cinder flex flex-col gap-3 opacity-90">
          <div className="flex items-center justify-between">
            <p className="label">Pattern recognition</p>
            <span className="label text-smoke">Coming soon</span>
          </div>
          <p className="font-body text-smoke text-sm">
            When this lands, your sealed entries will surface recurring
            themes, scripture clusters, and threads across the season — a
            reflection aid, not a coach. It uses only the entries you have
            chosen to seal.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-4xl text-bone leading-none">{value}</p>
      <p className="label mt-1">{label}</p>
    </div>
  );
}

function isWithinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() <= days * 86_400_000;
}

function countUniqueThreads(rows: SealedEntryRow[]): number {
  const s = new Set<string>();
  for (const r of rows) for (const t of r.threads) s.add(t.toLowerCase());
  return s.size;
}
