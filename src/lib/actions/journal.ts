"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EntryType =
  | "prophetic_word"
  | "scripture"
  | "dream_vision"
  | "conversation";

const VALID_TYPES: EntryType[] = [
  "prophetic_word",
  "scripture",
  "dream_vision",
  "conversation",
];

export type CreateInput = {
  worksheetId: string;
  parentEntryId?: string | null;
  entryType: EntryType;
  headline: string;
  body: string;
  whereLocation?: string;
  scriptureRef?: string;
  threads?: string[];
};

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function createJournalEntry(
  input: CreateInput
): Promise<Result<{ id: string }>> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const headline = input.headline.trim();
  const body = input.body.trim();
  if (!headline) return { ok: false, error: "Headline is required." };
  if (!body) return { ok: false, error: "Body is required." };
  if (!VALID_TYPES.includes(input.entryType)) {
    return { ok: false, error: "Pick an entry type." };
  }

  // Light tag normalization: trim, drop empties, dedupe (case-insensitive),
  // cap to 8 tags so the chip row doesn't blow up.
  const threads = Array.from(
    new Set(
      (input.threads ?? [])
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.toLowerCase())
    )
  ).slice(0, 8);

  const { data, error } = await supabase
    .from("journal_entry")
    .insert({
      planter_id: user.id,
      worksheet_id: input.worksheetId,
      parent_entry_id: input.parentEntryId ?? null,
      entry_type: input.entryType,
      headline,
      body,
      where_location: input.whereLocation?.trim() || null,
      scripture_ref: input.scriptureRef?.trim() || null,
      threads,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/journal");
  return { ok: true, data: { id: data.id } };
}
