import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// V1 has a single active track / single starter module. Bounce to it.
export default async function ModulesIndex() {
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

  const { data: module0 } = await supabase
    .from("module")
    .select("number")
    .eq("track_id", profile.track_id)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  redirect(`/modules/${module0?.number ?? "0"}`);
}
