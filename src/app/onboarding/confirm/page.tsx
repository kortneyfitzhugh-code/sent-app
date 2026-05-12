import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmCard } from "./ConfirmCard";

export default async function ConfirmStep() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, email, role, city, state, country, track_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/signup");

  let track: { name: string; module_count: number; duration_label: string | null } | null = null;
  if (profile.track_id) {
    const { data } = await supabase
      .from("track")
      .select("name, module_count, duration_label")
      .eq("id", profile.track_id)
      .maybeSingle();
    track = data ?? null;
  }

  return <ConfirmCard profile={profile} track={track} />;
}
