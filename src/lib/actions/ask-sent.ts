"use server";

import Anthropic from "@anthropic-ai/sdk";
import { anthropic, ASK_SENT_MODEL, ASK_SENT_SYSTEM } from "@/lib/anthropic";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Turn = { role: "user" | "assistant"; content: string };

export type AskSentResult =
  | { ok: true; reply: string }
  | { ok: false; error: string };

// Builds a context block from the planter's worksheet responses, joined with
// the worksheet_field registry for the prompts. Pulls only from the
// worksheet_response_ai view — which already filters out WS6 (Household
// Covenant) and any other ai_excluded worksheet. We never see those.
async function buildWorksheetContext(): Promise<string> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "";

  const { data: rows } = await supabase
    .from("worksheet_response_ai")
    .select(
      "field_key, value, worksheet:worksheet_id(code, title), updated_at"
    )
    .eq("planter_id", user.id)
    .order("updated_at", { ascending: true });

  if (!rows || rows.length === 0) {
    return "(The planter has not yet filled out any worksheet fields. Note this honestly when relevant — do not invent content.)";
  }

  // Get field prompts in a single batched query.
  const fieldKeys = Array.from(new Set(rows.map((r) => r.field_key)));
  const { data: fields } = await supabase
    .from("worksheet_field")
    .select("field_key, prompt, section_title, worksheet_id")
    .in("field_key", fieldKeys);
  const promptByKey = new Map<string, string>(
    (fields ?? []).map((f) => [f.field_key, f.prompt])
  );

  // Group by worksheet code.
  const byWorksheet = new Map<string, { title: string; entries: string[] }>();
  for (const r of rows) {
    const w = (r.worksheet as any) ?? {};
    const key = `${w.code} — ${w.title}`;
    const bucket = byWorksheet.get(key) ?? { title: key, entries: [] };
    const prompt = promptByKey.get(r.field_key) ?? r.field_key;
    const valueStr = formatValue(r.value);
    if (valueStr) {
      bucket.entries.push(`  • ${prompt}\n    > ${valueStr}`);
    }
    byWorksheet.set(key, bucket);
  }

  const parts: string[] = [];
  for (const [key, bucket] of byWorksheet) {
    if (bucket.entries.length === 0) continue;
    parts.push(`### ${key}\n${bucket.entries.join("\n")}`);
  }

  return parts.length > 0
    ? parts.join("\n\n")
    : "(No worksheet content yet to draw from.)";
}

function formatValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
      .join("; ");
  }
  return JSON.stringify(value);
}

export async function askSent(
  history: Turn[],
  question: string
): Promise<AskSentResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };
  if (!question.trim()) return { ok: false, error: "Empty question" };
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      error:
        "Ask Sent is unavailable — ANTHROPIC_API_KEY is not configured on the server.",
    };
  }

  const context = await buildWorksheetContext();

  // System is a two-block array so the worksheet context can be cached:
  //   block 1 = the static system prompt (also cached)
  //   block 2 = the planter's worksheet context (cached, refreshes when worksheets change)
  // Within a conversation, the system blocks are byte-stable across turns so
  // cache reads accrue. Prompt caching is a prefix match — only the message
  // history changes between turns.
  const system = [
    { type: "text" as const, text: ASK_SENT_SYSTEM, cache_control: { type: "ephemeral" as const } },
    {
      type: "text" as const,
      text: `THE PLANTER'S WORKSHEET CONTEXT\n\nWhat follows is everything the planter has written across their non-excluded worksheets. WS6 (Household Covenant) is intentionally absent — do not claim knowledge of it.\n\n${context}`,
      cache_control: { type: "ephemeral" as const },
    },
  ];

  const messages = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user" as const, content: question },
  ];

  try {
    const response = await anthropic.messages.create({
      model: ASK_SENT_MODEL,
      max_tokens: 1024,
      system,
      messages,
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text) {
      return { ok: false, error: "Ask Sent returned an empty response." };
    }
    return { ok: true, reply: text };
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return { ok: false, error: "Ask Sent is rate-limited right now. Try again in a minute." };
    }
    if (err instanceof Anthropic.APIError) {
      return { ok: false, error: `Ask Sent failed: ${err.message}` };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

