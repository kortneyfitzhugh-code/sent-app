"use client";

import { useRef, useState, useTransition } from "react";
import { askSent } from "@/lib/actions/ask-sent";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What patterns do you notice across what I've written so far?",
  "Where is my consecration plan strongest, and where is it thin?",
  "What am I avoiding in Module 0?",
  "What scripture might apply to what I'm holding right now?",
];

export function AskSentChat({ hasContext }: { hasContext: boolean }) {
  const [history, setHistory] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  function submit(question: string) {
    if (!question.trim() || pending) return;
    setInput("");
    setError(null);
    const userTurn: Turn = { role: "user", content: question };
    const turnsAtSend = history; // snapshot — don't include the new user turn yet
    setHistory((h) => [...h, userTurn]);
    startTransition(async () => {
      const res = await askSent(turnsAtSend, question);
      if (res.ok) {
        setHistory((h) => [...h, { role: "assistant", content: res.reply }]);
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {!hasContext && (
        <div className="card p-4 border-fire/40 flex flex-col gap-2">
          <p className="label text-fire">No worksheet context yet</p>
          <p className="font-body text-smoke text-sm">
            Ask Sent works best after you have written something in your
            worksheets. Start with WS1 — Personal Consecration Plan. You can
            still ask questions now; the answers will be general until your
            worksheets have content to draw from.
          </p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex flex-col gap-3">
          <p className="label">Try one of these</p>
          <ul className="flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => submit(s)}
                  disabled={pending}
                  className="card p-3 text-left w-full hover:border-ash transition-colors disabled:opacity-50"
                >
                  <span className="font-body text-bone text-sm">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {history.map((t, i) => (
            <li key={i} className={t.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[95%]"}>
              <p className="label mb-1">{t.role === "user" ? "You" : "Ask Sent"}</p>
              <div
                className={`card p-4 ${
                  t.role === "user"
                    ? "bg-cinder/40 border-cinder"
                    : "border-fire/20"
                }`}
              >
                <p className="font-body text-bone whitespace-pre-wrap leading-relaxed">
                  {t.content}
                </p>
              </div>
            </li>
          ))}
          {pending && (
            <li className="self-start">
              <p className="label mb-1">Ask Sent</p>
              <div className="card p-4 border-fire/20">
                <p className="font-body text-smoke italic">Reading your draft…</p>
              </div>
            </li>
          )}
          <div ref={endRef} />
        </ol>
      )}

      {error && (
        <div className="card p-3 border-fire">
          <p className="font-body text-fire text-sm">{error}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex flex-col gap-2 sticky bottom-0 bg-void/90 backdrop-blur pt-4 -mx-6 md:-mx-10 px-6 md:px-10 border-t border-cinder"
      >
        <label className="flex flex-col gap-2">
          <span className="label">Ask</span>
          <textarea
            className="input-shell min-h-[88px] resize-y font-body leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question. Ask Sent will read your worksheets to answer."
            disabled={pending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit(input);
              }
            }}
          />
        </label>
        <div className="flex items-center justify-between gap-3 pb-4">
          <p className="label">
            ⌘ + Enter to send · Ask Sent suggests, you sign.
          </p>
          <button type="submit" className="btn-fire" disabled={pending || !input.trim()}>
            {pending ? "Thinking…" : "Ask →"}
          </button>
        </div>
      </form>
    </div>
  );
}
