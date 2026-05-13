import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TaskList, type LessonGroup, type TaskRow } from "./TaskList";

export default async function AllTasksPage() {
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

  // V1 has Module 0 only. Future modules surface here automatically.
  const { data: modules } = await supabase
    .from("module")
    .select("id, number, name")
    .eq("track_id", profile.track_id)
    .order("display_order", { ascending: true })
    .limit(1);
  const mod = modules?.[0] ?? null;

  if (!mod) {
    return (
      <div className="p-6 md:p-10 max-w-xl">
        <h1 className="display text-4xl">No tasks yet</h1>
        <p className="font-body text-smoke mt-4">
          Your track has no modules seeded.
        </p>
      </div>
    );
  }

  const [{ data: tasks }, { data: lessons }, { data: completions }] = await Promise.all([
    supabase
      .from("task")
      .select("id, number, title, description, kind, planter_only, coach_involved, lesson_id")
      .eq("module_id", mod.id)
      .order("number", { ascending: true }),
    supabase
      .from("lesson")
      .select("id, number, title")
      .eq("module_id", mod.id)
      .order("number", { ascending: true }),
    supabase
      .from("task_assignment")
      .select("task_id, completed_at")
      .eq("planter_id", user.id),
  ]);

  const lessonById = new Map<string, { number: number; title: string }>(
    (lessons ?? []).map((l) => [l.id, { number: l.number, title: l.title }])
  );
  const doneByTaskId = new Map<string, boolean>(
    (completions ?? []).map((c) => [c.task_id, !!c.completed_at])
  );

  const rows: TaskRow[] = (tasks ?? []).map((t) => ({
    id: t.id,
    number: t.number,
    title: t.title,
    description: t.description ?? null,
    kind: t.kind,
    planterOnly: t.planter_only,
    coachInvolved: t.coach_involved,
    lesson: t.lesson_id ? lessonById.get(t.lesson_id) ?? null : null,
    completed: doneByTaskId.get(t.id) ?? false,
  }));

  // Group by lesson_id where present, otherwise into a "module-level" bucket.
  // V1: only Task 08 is linked to L1 (the anchor study); everything else
  // surfaces under module-level. As more tasks get lesson links, the
  // grouping will fill out automatically.
  const lessonGroups: LessonGroup[] = [];
  const moduleLevelTasks: TaskRow[] = [];
  const seenLessonIds = new Map<string, TaskRow[]>();
  for (const r of rows) {
    if (r.lesson) {
      const key = `${r.lesson.number}`;
      const arr = seenLessonIds.get(key) ?? [];
      arr.push(r);
      seenLessonIds.set(key, arr);
    } else {
      moduleLevelTasks.push(r);
    }
  }
  for (const [, tasksInLesson] of [...seenLessonIds.entries()].sort(
    (a, b) => Number(a[0]) - Number(b[0])
  )) {
    const first = tasksInLesson[0];
    if (!first.lesson) continue;
    lessonGroups.push({
      kind: "lesson",
      title: `L${first.lesson.number} · ${first.lesson.title}`,
      moduleNumber: mod.number,
      lessonNumber: first.lesson.number,
      tasks: tasksInLesson,
    });
  }
  if (moduleLevelTasks.length > 0) {
    lessonGroups.push({
      kind: "module",
      title: `Module ${mod.number.padStart(2, "0")} · Module-level tasks`,
      moduleNumber: mod.number,
      lessonNumber: null,
      tasks: moduleLevelTasks,
    });
  }

  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-3xl">
      <header className="flex flex-col gap-3">
        <p className="label">All tasks · {mod.name}</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">
          {rows.filter((r) => r.completed).length} of {rows.length} complete
        </h1>
        <p className="font-body text-smoke text-sm">
          Tasks are grouped by lesson where the database links them. Planter-only
          enforcement runs in the database — the lock is honest.
        </p>
      </header>

      <TaskList groups={lessonGroups} />
    </div>
  );
}
