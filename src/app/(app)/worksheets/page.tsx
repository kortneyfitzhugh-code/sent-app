import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function WorksheetsIndex() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("track_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.track_id) redirect("/onboarding/track");

  // Worksheets for the first module of the track.
  const { data: mod } = await supabase
    .from("module")
    .select("id, number, name")
    .eq("track_id", profile.track_id)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!mod) return null;

  const [{ data: worksheets }, { data: completions }] = await Promise.all([
    supabase
      .from("worksheet")
      .select("id, code, title, purpose, visibility, ai_excluded, is_locking")
      .eq("module_id", mod.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("worksheet_completion")
      .select("worksheet_id, completed_at")
      .eq("planter_id", user.id),
  ]);

  const completedIds = new Set(
    (completions ?? []).filter((c) => c.completed_at).map((c) => c.worksheet_id)
  );

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-3">
        <p className="label">Module {mod.number.padStart(2, "0")} · Worksheets</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">{mod.name}</h1>
      </div>

      <ul className="flex flex-col gap-3">
        {(worksheets ?? []).map((w) => {
          const isWs1 = w.code === "WS1";
          const isComplete = completedIds.has(w.id);
          return (
            <li key={w.id}>
              {isWs1 ? (
                <Link
                  href="/worksheets/ws1"
                  className="card p-5 flex items-start gap-4 hover:border-ash transition-colors"
                >
                  <Body w={w} isComplete={isComplete} active />
                </Link>
              ) : (
                <div className="card p-5 flex items-start gap-4 opacity-60 cursor-not-allowed">
                  <Body w={w} isComplete={isComplete} active={false} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Body({
  w,
  isComplete,
  active,
}: {
  w: {
    code: string;
    title: string;
    purpose: string | null;
    visibility: string;
    ai_excluded: boolean;
    is_locking: boolean;
  };
  isComplete: boolean;
  active: boolean;
}) {
  return (
    <>
      <span className="label shrink-0 mt-1">{w.code}</span>
      <div className="flex-1 min-w-0">
        <p className="display text-2xl leading-tight">{w.title}</p>
        {w.purpose && <p className="font-body text-smoke text-sm mt-2">{w.purpose}</p>}
        <p className="label mt-3">
          {w.is_locking ? "Locking" : "Open"} ·{" "}
          {w.ai_excluded ? "Not AI" : "Feeds Ask Sent"} ·{" "}
          {w.visibility.replace(/_/g, " ")}
        </p>
      </div>
      <span
        className={`label shrink-0 ${
          isComplete ? "text-alive" : active ? "text-fire" : "text-smoke"
        }`}
      >
        {isComplete ? "Done" : active ? "Open" : "Session 2.5"}
      </span>
    </>
  );
}
