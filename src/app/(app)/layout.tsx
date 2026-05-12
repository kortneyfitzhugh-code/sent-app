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

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <Sidebar profile={profile} />
      <div className="pb-20 md:pb-0">{children}</div>
      <MobileNav />
    </div>
  );
}
