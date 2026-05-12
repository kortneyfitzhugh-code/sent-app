import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TrackPicker } from "./TrackPicker";

export default async function TrackStep() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tracks } = await supabase
    .from("track")
    .select("id, slug, name, subtitle, category, status, module_count, duration_label")
    .order("display_order", { ascending: true });

  return <TrackPicker tracks={tracks ?? []} />;
}
