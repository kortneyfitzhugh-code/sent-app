"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { markTaskComplete, unmarkTaskComplete } from "@/lib/actions/tasks";

export function MarkReadButton({
  taskId,
  completed,
  returnTo,
}: {
  taskId: string;
  completed: boolean;
  returnTo: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () =>
    startTransition(async () => {
      const fn = completed ? unmarkTaskComplete : markTaskComplete;
      await fn(taskId);
      router.refresh();
    });

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div>
        <p className="label">
          {completed ? "Completed" : "Reading completes this task."}
        </p>
        {!completed && (
          <p className="font-body text-smoke text-sm mt-1">
            When you've sat with this, mark it read.
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={onClick} disabled={pending} className={completed ? "btn-ghost" : "btn-fire"}>
          {pending ? "Saving…" : completed ? "Unmark as read" : "Mark as read →"}
        </button>
        <a href={returnTo} className="btn-ghost">
          Back to module
        </a>
      </div>
    </div>
  );
}
