import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardView } from "./DashboardView";

// The 9 modules that anchor the runway stages bar. Modules 3.5 and bonus
// are intentionally NOT in this set — they sit outside the stage path per
// the design spec.
const STAGE_MODULES = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8"]);

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, role, track_id, city, state, launch_date, ministry_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.track_id) redirect("/onboarding/track");

  const { data: track } = await supabase
    .from("track")
    .select("id, name, module_count, duration_label")
    .eq("id", profile.track_id)
    .maybeSingle();

  // First module of the track. For V1 this is Module 0 on the Church Planting track.
  const { data: modules } = await supabase
    .from("module")
    .select("id, number, name, subtitle, anchor_scripture_ref, anchor_scripture_text, primary_objective")
    .eq("track_id", profile.track_id)
    .order("display_order", { ascending: true })
    .limit(1);

  const firstModule = modules?.[0] ?? null;

  let taskCount = 0;
  let completedTasks = 0;
  let completedStageModules = 0;
  if (firstModule) {
    const { data: tasks } = await supabase
      .from("task")
      .select("id")
      .eq("module_id", firstModule.id);
    const taskIds = (tasks ?? []).map((t) => t.id);
    taskCount = taskIds.length;

    if (taskIds.length > 0) {
      const { count: done } = await supabase
        .from("task_assignment")
        .select("id", { count: "exact", head: true })
        .eq("planter_id", user.id)
        .in("task_id", taskIds)
        .not("completed_at", "is", null);
      completedTasks = done ?? 0;
    }
  }

  // For the runway stages bar — count how many of the 9 stage modules
  // (0,1,2,3,4,5,6,7,8) are fully complete (every task in the module has
  // a task_assignment row with completed_at set). Modules 3.5 and bonus are
  // intentionally excluded from the stage path per the design spec.
  {
    const { data: stageTasks } = await supabase
      .from("task")
      .select("id, module:module_id(number, track_id)")
      .eq("module.track_id", profile.track_id);

    type Row = { id: string; module: { number: string; track_id: string } | null };
    const inTrack = ((stageTasks ?? []) as unknown as Row[]).filter(
      (t) => t.module && STAGE_MODULES.has(t.module.number)
    );

    const taskIds = inTrack.map((t) => t.id);
    let doneIds = new Set<string>();
    if (taskIds.length > 0) {
      const { data: completions } = await supabase
        .from("task_assignment")
        .select("task_id")
        .eq("planter_id", user.id)
        .in("task_id", taskIds)
        .not("completed_at", "is", null);
      doneIds = new Set((completions ?? []).map((c) => c.task_id));
    }

    const byModule = new Map<string, { total: number; done: number }>();
    for (const t of inTrack) {
      if (!t.module) continue;
      const key = t.module.number;
      const bucket = byModule.get(key) ?? { total: 0, done: 0 };
      bucket.total += 1;
      if (doneIds.has(t.id)) bucket.done += 1;
      byModule.set(key, bucket);
    }

    completedStageModules = [...byModule.values()].filter(
      (b) => b.total > 0 && b.done === b.total
    ).length;
  }

  return (
    <DashboardView
      profile={profile}
      track={track}
      module={firstModule}
      taskCount={taskCount}
      completedTasks={completedTasks}
      completedStageModules={completedStageModules}
    />
  );
}
