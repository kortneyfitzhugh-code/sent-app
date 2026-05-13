import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LessonChip } from "./LessonChip";
import { TaskRow } from "./TaskRow";

export default async function ModuleView({
  params,
}: {
  params: { number: string };
}) {
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

  const { data: mod } = await supabase
    .from("module")
    .select(
      "id, number, name, subtitle, anchor_scripture_ref, anchor_scripture_text, primary_objective"
    )
    .eq("track_id", profile.track_id)
    .eq("number", params.number)
    .maybeSingle();
  if (!mod) notFound();

  const [{ data: tasks }, { data: lessons }, { data: worksheets }, { data: assignments }, { data: completions }] =
    await Promise.all([
      supabase
        .from("task")
        .select("id, number, title, kind, planter_only, coach_involved, lesson_id")
        .eq("module_id", mod.id)
        .order("number", { ascending: true }),
      supabase
        .from("lesson")
        .select("id, number, title, is_anchor, estimated_minutes, teaching")
        .eq("module_id", mod.id)
        .order("number", { ascending: true }),
      supabase
        .from("worksheet")
        .select("id, code, title, visibility, ai_excluded, is_locking")
        .eq("module_id", mod.id)
        .order("display_order", { ascending: true }),
      supabase
        .from("task_assignment")
        .select("task_id, completed_at")
        .eq("planter_id", user.id),
      supabase
        .from("worksheet_completion")
        .select("worksheet_id, completed_at")
        .eq("planter_id", user.id),
    ]);

  const taskList = tasks ?? [];
  const lessonList = lessons ?? [];
  const worksheetList = worksheets ?? [];
  const completedTaskIds = new Set(
    (assignments ?? []).filter((a) => a.completed_at).map((a) => a.task_id)
  );
  const completedWorksheetIds = new Set(
    (completions ?? []).filter((c) => c.completed_at).map((c) => c.worksheet_id)
  );

  const completedCount = taskList.filter((t) => completedTaskIds.has(t.id)).length;
  const progressPct =
    taskList.length > 0 ? Math.round((completedCount / taskList.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="label hover:text-bone transition-colors">
            ‹ Dashboard
          </Link>
          <p className="label text-fire">Module {mod.number.padStart(2, "0")} · Active</p>
        </div>

        <section className="card p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <span className="display text-7xl md:text-8xl leading-none text-fire/80">
              {mod.number.padStart(2, "0")}
            </span>
            <p className="label">
              {completedCount} of {taskList.length} tasks · {progressPct}%
            </p>
          </div>
          <div>
            <h1 className="display text-4xl md:text-5xl leading-none">{mod.name}</h1>
            {mod.subtitle && <p className="font-body text-smoke mt-3">{mod.subtitle}</p>}
          </div>
          {mod.anchor_scripture_text && (
            <div className="border-l border-cinder pl-4">
              <p className="label">{mod.anchor_scripture_ref}</p>
              <p className="font-body text-bone mt-2 italic">“{mod.anchor_scripture_text}”</p>
            </div>
          )}
          {mod.primary_objective && (
            <p className="font-body text-smoke text-sm">{mod.primary_objective}</p>
          )}
          <div className="h-2 w-full bg-ash/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-fire transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Lessons rail.
            Each chip shows L# + lesson name. A chip is "active" (clickable)
            when the lesson row has a teaching body. When Session 2.5 seeds
            bodies for L2–L7, every chip flips to active automatically — no
            code change needed here. */}
        <section className="flex flex-col gap-3">
          <p className="label">Lessons · {lessonList.length}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lessonList.map((l) => (
              <LessonChip
                key={l.id}
                lesson={l}
                moduleNumber={mod.number}
                active={!!l.teaching && l.teaching.length > 0}
              />
            ))}
          </ul>
        </section>

        {/* Task list */}
        <section className="flex flex-col gap-3">
          <p className="label">Task list · {taskList.length}</p>
          <ul className="flex flex-col gap-2">
            {taskList.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                completed={completedTaskIds.has(t.id)}
                lessonNumber={
                  t.lesson_id
                    ? lessonList.find((l) => l.id === t.lesson_id)?.number ?? null
                    : null
                }
                moduleNumber={mod.number}
              />
            ))}
          </ul>
        </section>
      </div>

      {/* Right rail — module worksheets */}
      <aside className="hidden xl:flex flex-col gap-4">
        <p className="label">Module worksheets · {worksheetList.length}</p>
        {worksheetList.map((w) => {
          const isComplete = completedWorksheetIds.has(w.id);
          return (
            <Link
              key={w.id}
              href={w.code === "WS1" ? "/worksheets/ws1" : "/worksheets"}
              className="card p-4 flex flex-col gap-2 hover:border-ash transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="label">{w.code}</span>
                <span
                  className={`label ${
                    isComplete ? "text-alive" : w.is_locking ? "text-fire" : "text-smoke"
                  }`}
                >
                  {isComplete ? "Done" : w.is_locking ? "Locking" : "Open"}
                </span>
              </div>
              <p className="font-body text-bone text-sm">{w.title}</p>
              <p className="label">
                {w.visibility.replace(/_/g, " ")}
              </p>
            </Link>
          );
        })}
      </aside>
    </div>
  );
}
