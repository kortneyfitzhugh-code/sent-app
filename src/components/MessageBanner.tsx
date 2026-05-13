"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Renders a subtle dismissable info banner when the URL has `?message=...`.
// Used on `/` and `/login` so confirmations returning from Supabase land
// with visible feedback (e.g. "Check your email to confirm the change").
export function MessageBanner() {
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}

function Banner() {
  const params = useSearchParams();
  const raw = params.get("message");
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state if the message changes.
  useEffect(() => {
    setDismissed(false);
  }, [raw]);

  if (!raw || dismissed) return null;
  // Trim to prevent UI breakage from giant pasted strings, and strip stray
  // newlines that some redirect chains introduce.
  const message = raw.replace(/\s+/g, " ").trim().slice(0, 400);
  if (!message) return null;

  return (
    <div className="w-full bg-cinder border-b border-cinder">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-start gap-4">
        <p className="flex-1 font-body text-bone text-sm leading-relaxed">
          {message}
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss message"
          className="shrink-0 text-smoke hover:text-bone transition-colors -mt-0.5 -mr-1 p-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
