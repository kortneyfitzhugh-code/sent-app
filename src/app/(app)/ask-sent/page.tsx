import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AskSentChat } from "./AskSentChat";

export default async function AskSentPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Count how much worksheet context the model has to work with — surface
  // honestly so the planter isn't surprised when answers are thin.
  const { count: responseCount } = await supabase
    .from("worksheet_response_ai")
    .select("id", { count: "exact", head: true })
    .eq("planter_id", user.id);

  // Module 0 worksheets the planter could draw from (excluding WS6).
  const { data: worksheets } = await supabase
    .from("worksheet")
    .select("code, title, ai_excluded")
    .order("display_order", { ascending: true });

  const aiEligible = (worksheets ?? []).filter((w) => !w.ai_excluded);
  const excluded = (worksheets ?? []).filter((w) => w.ai_excluded);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-8 max-w-3xl">
        <header className="flex flex-col gap-3">
          <p className="label text-fire">Ask Sent · tool, not coach</p>
          <h1 className="display text-4xl md:text-5xl leading-tight">
            A reflection aid.
          </h1>
          <p className="font-body text-smoke">
            Ask Sent reads what you have written in your worksheets and reflects
            it back. It is not your covering, your coach, or your spouse — it
            will not pretend to be. WS6 (Household Covenant) is permanently
            excluded from this data layer by design.
          </p>
        </header>

        <AskSentChat hasContext={(responseCount ?? 0) > 0} />
      </div>

      <aside className="hidden xl:flex flex-col gap-4 sticky top-6 self-start">
        <section className="card p-4">
          <p className="label mb-3">What Ask Sent can read</p>
          <ul className="flex flex-col gap-1">
            {aiEligible.map((w) => (
              <li key={w.code} className="flex items-baseline gap-2">
                <span className="label shrink-0">{w.code}</span>
                <span className="font-body text-bone text-sm">{w.title}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4 border-cinder">
          <p className="label mb-3">Permanently excluded</p>
          <ul className="flex flex-col gap-1">
            {excluded.map((w) => (
              <li key={w.code} className="flex items-baseline gap-2">
                <span className="label shrink-0 text-smoke">{w.code}</span>
                <span className="font-body text-smoke text-sm">{w.title}</span>
              </li>
            ))}
          </ul>
          <p className="label text-smoke mt-3 border-t border-cinder pt-3">
            Household covenant and coaching checkpoint are private to you, your
            household, and (in V2) your coach.
          </p>
        </section>

        <p className="label text-smoke">
          {responseCount ?? 0} worksheet field
          {responseCount === 1 ? "" : "s"} feeding context
        </p>
      </aside>
    </div>
  );
}
