"use client";

import { useEffect, useState } from "react";

// Time-of-day greeting based on the planter's *local* time. Server-rendered
// markup falls back to "{First}." so that hydration is byte-identical until
// the effect runs on the client; otherwise SSR would emit the server's
// timezone-of-day and React would scream about a mismatch.
export function Greeting({ firstName }: { firstName: string }) {
  const [phrase, setPhrase] = useState<string | null>(null);

  useEffect(() => {
    setPhrase(`${timeOfDay()}, ${firstName}.`);
  }, [firstName]);

  return (
    <h1 className="display text-3xl md:text-4xl mt-1">
      {phrase ?? `${firstName}.`}
    </h1>
  );
}

function timeOfDay(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good evening";   // late night still reads as evening
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
