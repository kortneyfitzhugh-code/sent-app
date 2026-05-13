"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createJournalEntry, type EntryType } from "@/lib/actions/journal";

const TYPES: { value: EntryType; label: string }[] = [
  { value: "prophetic_word", label: "Prophetic Word" },
  { value: "scripture", label: "Scripture" },
  { value: "dream_vision", label: "Dream or Vision" },
  { value: "conversation", label: "Conversation" },
];

export function JournalComposer({
  worksheetId,
  parentEntryId,
  parentHeadline,
  onClose,
}: {
  worksheetId: string;
  parentEntryId?: string;
  parentHeadline?: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [entryType, setEntryType] = useState<EntryType>("prophetic_word");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [whereLocation, setWhereLocation] = useState("");
  const [scriptureRef, setScriptureRef] = useState("");
  const [threadsInput, setThreadsInput] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setEntryType("prophetic_word");
    setHeadline("");
    setBody("");
    setWhereLocation("");
    setScriptureRef("");
    setThreadsInput("");
    setConfirming(false);
    setError(null);
  }

  function handleSeal() {
    if (!headline.trim() || !body.trim()) {
      setError("Headline and body are required.");
      return;
    }
    if (!confirming) {
      setConfirming(true);
      return;
    }
    const threads = threadsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await createJournalEntry({
        worksheetId,
        parentEntryId: parentEntryId ?? null,
        entryType,
        headline,
        body,
        whereLocation,
        scriptureRef,
        threads,
      });
      if (res.ok) {
        reset();
        if (onClose) onClose();
        router.refresh();
      } else {
        setError(res.error);
        setConfirming(false);
      }
    });
  }

  return (
    <section className="card p-5 md:p-6 flex flex-col gap-5 border-fire/30">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <p className="label text-fire">
          {parentEntryId ? "New follow-up entry" : "New entry"}
        </p>
        {parentHeadline && (
          <p className="label text-smoke truncate max-w-[60%]">
            Follow-up to: {parentHeadline}
          </p>
        )}
      </div>

      {/* Type selector */}
      <div className="flex flex-col gap-2">
        <span className="label">Type</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Entry type">
          {TYPES.map((t) => {
            const selected = t.value === entryType;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setEntryType(t.value)}
                className={`px-3 py-1.5 rounded-md border text-xs font-nav uppercase tracking-wider3 transition-colors ${
                  selected
                    ? "bg-fire/15 border-fire text-bone"
                    : "border-cinder text-smoke hover:border-ash hover:text-bone"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="label">Headline</span>
        <input
          className="input-shell"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="One sentence — what was it?"
          maxLength={200}
          required
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="label">Body</span>
        <textarea
          className="input-shell min-h-[140px] resize-y font-body leading-relaxed"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What was said, seen, or shown? Be as close to exact as you can."
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="label">Where</span>
          <input
            className="input-shell"
            value={whereLocation}
            onChange={(e) => setWhereLocation(e.target.value)}
            placeholder="The context — a service, a conversation, a quiet morning"
            maxLength={200}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label">Scripture reference (optional)</span>
          <input
            className="input-shell"
            value={scriptureRef}
            onChange={(e) => setScriptureRef(e.target.value)}
            placeholder="Jeremiah 1:10"
            maxLength={120}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="label">Thread tags</span>
        <input
          className="input-shell"
          value={threadsInput}
          onChange={(e) => setThreadsInput(e.target.value)}
          placeholder="comma, separated, threads"
        />
        <span className="label">
          Tag this entry to link it with related ones — e.g. "covering",
          "household", "city".
        </span>
      </label>

      {error && (
        <p className="font-body text-fire text-sm">{error}</p>
      )}

      {confirming && !pending && (
        <div className="card p-4 border-fire/60 flex flex-col gap-3">
          <p className="font-body text-bone text-sm">
            <span className="text-fire font-medium">Once sealed, this entry cannot be edited.</span>{" "}
            Sealing creates a timestamped record. Read it back before you sign.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleSeal} className="btn-fire">
              Yes — seal this entry
            </button>
            <button onClick={() => setConfirming(false)} className="btn-ghost">
              Keep editing
            </button>
          </div>
        </div>
      )}

      {!confirming && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="label">
            {onClose
              ? "This entry will link back to the one above."
              : "Sealing is permanent. The journal is your evidence."}
          </p>
          <div className="flex gap-2">
            {onClose && (
              <button onClick={onClose} className="btn-ghost" type="button">
                Cancel
              </button>
            )}
            <button onClick={handleSeal} className="btn-fire" disabled={pending}>
              {pending ? "Sealing…" : "Seal entry"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
