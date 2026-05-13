import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { WorksheetForm, type FieldDef, type FieldOption } from "./WorksheetForm";

export default async function WS1Page() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Locate WS1 in the planter's track (V1 = Church Planting Module 0).
  const { data: ws } = await supabase
    .from("worksheet")
    .select("id, code, title, purpose, is_locking, ai_excluded, module_id, module:module(number, name)")
    .eq("code", "WS1")
    .maybeSingle();
  if (!ws) notFound();

  const { data: fieldRows } = await supabase
    .from("worksheet_field")
    .select(
      "section_number, section_title, question_number, field_key, prompt, helper, kind, options, max_chars, feeds_ai, display_order"
    )
    .eq("worksheet_id", ws.id)
    .order("display_order", { ascending: true });

  const fields: FieldDef[] = (fieldRows ?? []).map((f) => ({
    sectionNumber: f.section_number,
    sectionTitle: f.section_title,
    questionNumber: f.question_number,
    fieldKey: f.field_key,
    prompt: f.prompt,
    helper: f.helper,
    kind: f.kind as FieldDef["kind"],
    options: (f.options as FieldOption[] | null) ?? null,
    maxChars: f.max_chars,
    feedsAi: f.feeds_ai,
  }));

  const { data: responses } = await supabase
    .from("worksheet_response")
    .select("field_key, value, updated_at")
    .eq("planter_id", user.id)
    .eq("worksheet_id", ws.id);

  const initial: Record<string, unknown> = {};
  let lastSaved: string | null = null;
  for (const r of responses ?? []) {
    initial[r.field_key] = r.value;
    if (!lastSaved || (r.updated_at && r.updated_at > lastSaved)) {
      lastSaved = r.updated_at;
    }
  }

  const { data: completion } = await supabase
    .from("worksheet_completion")
    .select("completed_at")
    .eq("planter_id", user.id)
    .eq("worksheet_id", ws.id)
    .maybeSingle();

  const moduleNumber = (ws.module as any)?.number ?? "0";

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-8 max-w-3xl">
        <div className="flex items-center justify-between">
          <Link
            href={`/modules/${moduleNumber}`}
            className="label hover:text-bone transition-colors"
          >
            ‹ Module {String(moduleNumber).padStart(2, "0")}
          </Link>
          <p className="label">
            Worksheet · {ws.code} · {ws.is_locking ? "Locking" : "Open"}
          </p>
        </div>

        <header className="flex flex-col gap-3">
          <p className="label text-fire">{ws.code} · Locking worksheet</p>
          <h1 className="display text-5xl md:text-6xl leading-none">{ws.title}</h1>
          {ws.purpose && (
            <p className="font-body text-smoke text-sm">{ws.purpose}</p>
          )}
        </header>

        <section className="card p-5 border-l-2 border-fire">
          <p className="display text-2xl leading-tight mb-2">
            This is not a form. It is a covenant.
          </p>
          <p className="font-body text-smoke text-sm">
            Fill it slowly. Write it as if you will be held to it — because you will. The
            Spirit is the witness; your accountability partner is the human voice. Save
            and return as often as you need.
          </p>
        </section>

        <WorksheetForm
          worksheetId={ws.id}
          fields={fields}
          initial={initial}
          lastSaved={lastSaved}
          completedAt={completion?.completed_at ?? null}
        />
      </div>

    </div>
  );
}
