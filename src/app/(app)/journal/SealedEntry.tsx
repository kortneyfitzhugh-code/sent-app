"use client";

import { useState } from "react";
import { JournalComposer } from "./JournalComposer";

export type SealedEntryRow = {
  id: string;
  entryType: "prophetic_word" | "scripture" | "dream_vision" | "conversation";
  headline: string;
  body: string;
  whereLocation: string | null;
  scriptureRef: string | null;
  threads: string[];
  sealedAt: string;
  parentHeadline: string | null;
};

const TYPE_LABEL: Record<SealedEntryRow["entryType"], string> = {
  prophetic_word: "Prophetic Word",
  scripture: "Scripture",
  dream_vision: "Dream or Vision",
  conversation: "Conversation",
};

export function SealedEntry({
  entry,
  worksheetId,
}: {
  entry: SealedEntryRow;
  worksheetId: string;
}) {
  const [showFollowUp, setShowFollowUp] = useState(false);

  return (
    <li className="card p-5 flex flex-col gap-4 border-cinder">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="label text-fire">{TYPE_LABEL[entry.entryType]}</span>
          <span className="label">· {formatDateTime(entry.sealedAt)}</span>
          {entry.scriptureRef && (
            <span className="label">· {entry.scriptureRef}</span>
          )}
        </div>
        <span
          className="label text-alive"
          aria-label="Sealed and immutable"
        >
          Sealed
        </span>
      </div>

      {entry.parentHeadline && (
        <p className="label text-smoke italic truncate">
          ↳ Follow-up to "{entry.parentHeadline}"
        </p>
      )}

      <h3 className="display text-2xl md:text-3xl leading-snug text-bone">
        {entry.headline}
      </h3>

      <p className="font-body text-bone leading-relaxed whitespace-pre-wrap">
        {entry.body}
      </p>

      {entry.whereLocation && (
        <p className="font-body text-smoke text-sm">
          <span className="label mr-2">Where</span>
          {entry.whereLocation}
        </p>
      )}

      {entry.threads.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.threads.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-md border border-cinder text-xs font-nav uppercase tracking-wider3 text-smoke"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Follow-up — opens an inline composer prefilled with parentEntryId */}
      {!showFollowUp ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowFollowUp(true)}
            className="label hover:text-bone transition-colors"
          >
            + Follow-up entry
          </button>
        </div>
      ) : (
        <JournalComposer
          worksheetId={worksheetId}
          parentEntryId={entry.id}
          parentHeadline={entry.headline}
          onClose={() => setShowFollowUp(false)}
        />
      )}
    </li>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
