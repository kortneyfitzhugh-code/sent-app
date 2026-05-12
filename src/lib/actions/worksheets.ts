"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Upsert a single worksheet field. JSONB value supports text, dates,
// radio strings, arrays of blocks/partners, etc.
export async function saveWorksheetField(
  worksheetId: string,
  fieldKey: string,
  value: unknown
) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" } as const;

  const { error } = await supabase.from("worksheet_response").upsert(
    {
      planter_id: user.id,
      worksheet_id: worksheetId,
      field_key: fieldKey,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "planter_id,worksheet_id,field_key" }
  );

  if (error) return { error: error.message } as const;
  return { ok: true } as const;
}

// Mark a worksheet complete (the "locking" CTA). Idempotent.
export async function completeWorksheet(worksheetId: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" } as const;

  const { error } = await supabase.from("worksheet_completion").upsert(
    {
      planter_id: user.id,
      worksheet_id: worksheetId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "planter_id,worksheet_id" }
  );

  if (error) return { error: error.message } as const;
  revalidatePath("/worksheets", "layout");
  revalidatePath("/modules", "layout");
  return { ok: true } as const;
}
