import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardView } from "./DashboardView";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, role, track_id, city, state")
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
  if (firstModule) {
    const { data: tasks } = await supabase
      .from("task")
      .select("id")
      .eq("module_id", firstModule.id);
    const taskIds = (tasks ?? []).map((t) => t.id);
    taskCount = taskIds.length;

    if (taskIds.length > 0) {
      // Only count completions for tasks belonging to this module.
      const { count: done } = await supabase
        .from("task_assignment")
        .select("id", { count: "exact", head: true })
        .eq("planter_id", user.id)
        .in("task_id", taskIds)
        .not("completed_at", "is", null);
      completedTasks = done ?? 0;
    }
  }

  return (
    <DashboardView
      profile={profile}
      track={track}
      module={firstModule}
      taskCount={taskCount}
      completedTasks={completedTasks}
    />
  );
}
