"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Mark a task complete. Upserts into task_assignment with completed_at = now().
// The DB-side trg_enforce_planter_only trigger guards Planter-Only tasks
// from being assigned to a non-planter; RLS guards write access to the row.
export async function markTaskComplete(taskId: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" } as const;

  const { error } = await supabase.from("task_assignment").upsert(
    {
      planter_id: user.id,
      task_id: taskId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "planter_id,task_id" }
  );

  if (error) return { error: error.message } as const;

  revalidatePath("/modules", "layout");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}

export async function unmarkTaskComplete(taskId: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" } as const;

  const { error } = await supabase
    .from("task_assignment")
    .update({ completed_at: null })
    .eq("planter_id", user.id)
    .eq("task_id", taskId);

  if (error) return { error: error.message } as const;

  revalidatePath("/modules", "layout");
  revalidatePath("/dashboard");
  return { ok: true } as const;
}
