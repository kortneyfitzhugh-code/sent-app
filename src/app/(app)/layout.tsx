import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/app/Sidebar";
import { MobileNav } from "@/components/app/MobileNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, email, role, city, state, country, track_id, onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_complete) redirect("/onboarding/role");

  // Sidebar counts. Across the planter's whole track for "All Tasks" so the
  // counter reflects the same scope the page does. V1 only has Module 0
  // seeded with tasks; future modules surface here automatically.
  let totalTaskCount = 0;
  let completedTaskCount = 0;
  if (profile.track_id) {
    const { data: trackTasks } = await supabase
      .from("task")
      .select("id, module:module_id(track_id)")
      .eq("module.track_id", profile.track_id);
    type Row = { id: string; module: { track_id: string } | null };
    const inTrackIds = ((trackTasks ?? []) as unknown as Row[])
      .filter((t) => t.module && t.module.track_id === profile.track_id)
      .map((t) => t.id);
    totalTaskCount = inTrackIds.length;

    if (inTrackIds.length > 0) {
      const { count } = await supabase
        .from("task_assignment")
        .select("id", { count: "exact", head: true })
        .eq("planter_id", user.id)
        .in("task_id", inTrackIds)
        .not("completed_at", "is", null);
      completedTaskCount = count ?? 0;
    }
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <Sidebar
        profile={profile}
        taskCounts={{ completed: completedTaskCount, total: totalTaskCount }}
      />
      <div className="pb-20 md:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
