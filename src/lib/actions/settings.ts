"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function updateProfileSettings(input: {
  launchDate: string | null;
  ministryName: string;
}): Promise<Result> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // Strip trailing whitespace; allow blank to clear. Supabase accepts a
  // YYYY-MM-DD string for the date column; null clears it.
  const ministryName = input.ministryName.trim() || null;
  let launchDate: string | null = null;
  if (input.launchDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.launchDate)) {
      return { ok: false, error: "Launch date must be YYYY-MM-DD." };
    }
    launchDate = input.launchDate;
  }

  const { error } = await supabase
    .from("profile")
    .update({ launch_date: launchDate, ministry_name: ministryName })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { ok: true };
}

export async function changePassword(input: {
  current: string;
  next: string;
  confirm: string;
}): Promise<Result> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { ok: false, error: "Not authenticated" };

  if (input.next.length < 12) {
    return { ok: false, error: "New password must be at least 12 characters." };
  }
  if (input.next !== input.confirm) {
    return { ok: false, error: "New passwords do not match." };
  }
  if (input.next === input.current) {
    return { ok: false, error: "New password must differ from the current password." };
  }

  // Re-verify current password before allowing the change. Supabase doesn't
  // require this — but we want the standard "enter your current password"
  // guard, both because the planter expects it and because it prevents
  // session-hijack misuse where an attacker with a stolen JWT could rotate
  // the password silently.
  const reauth = await supabase.auth.signInWithPassword({
    email: user.email,
    password: input.current,
  });
  if (reauth.error) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: input.next });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}
