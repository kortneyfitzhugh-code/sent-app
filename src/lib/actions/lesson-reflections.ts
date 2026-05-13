"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function saveLessonReflection(input: {
  lessonId: string;
  questionNumber: number;
  questionText: string;
  answer: string;
}): Promise<Result> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase.from("lesson_reflection").upsert(
    {
      planter_id: user.id,
      lesson_id: input.lessonId,
      question_number: input.questionNumber,
      question_text: input.questionText,
      answer: input.answer,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "planter_id,lesson_id,question_number" }
  );
  if (error) return { ok: false, error: error.message };

  // The lesson page reads these on render; revalidate so the next navigation
  // shows the saved answer if the user moves away and back.
  revalidatePath("/modules", "layout");
  return { ok: true };
}
