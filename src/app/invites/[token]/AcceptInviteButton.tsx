"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { acceptInvite } from "@/lib/actions/team";

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function accept() {
    setError(null);
    startTransition(async () => {
      const res = await acceptInvite(token);
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={accept} disabled={pending} className="btn-fire self-start">
        {pending ? "Accepting…" : "Accept invitation →"}
      </button>
      {error && <p className="font-body text-fire text-sm">{error}</p>}
    </div>
  );
}
