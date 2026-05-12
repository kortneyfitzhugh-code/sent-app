"use client";

import Link from "next/link";
import { useTransition } from "react";
import { markTaskComplete, unmarkTaskComplete } from "@/lib/actions/tasks";

type Task = {
  id: string;
  number: number;
  title: string;
  kind: string;
  planter_only: boolean;
  coach_involved: boolean;
  lesson_id: string | null;
};

const KIND_LABEL: Record<string, string> = {
  lesson: "Lesson",
  spiritual_practice: "Spiritual practice",
  milestone: "Milestone",
  journal_record: "Journal",
  action: "Action",
  discernment: "Discernment",
  planning: "Planning",
  ongoing: "Ongoing",
  checkpoint: "Checkpoint",
  deliverable: "Deliverable",
  reflection: "Reflection",
  decision: "Decision",
  assessment: "Assessment",
  legal: "Legal",
  research: "Research",
  culture: "Culture",
  pre_reading: "Pre-reading",
};

export function TaskRow({
  task,
  completed,
  lessonNumber,
  moduleNumber,
}: {
  task: Task;
  completed: boolean;
  lessonNumber: number | null;
  moduleNumber: string;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const fn = completed ? unmarkTaskComplete : markTaskComplete;
      await fn(task.id);
    });

  return (
    <li
      className={`card p-4 flex flex-col md:flex-row md:items-center gap-3 transition-colors ${
        completed ? "border-alive/30" : ""
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={completed}
        aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
        className={`w-6 h-6 rounded-md border grid place-items-center transition-colors shrink-0 ${
          completed
            ? "bg-alive/20 border-alive text-alive"
            : "border-ash hover:border-fire text-transparent hover:text-fire"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="label">T{String(task.number).padStart(2, "0")}</span>
          <span className="label">{KIND_LABEL[task.kind] ?? task.kind}</span>
          {task.planter_only && (
            <span className="label text-fire">Planter only</span>
          )}
          {task.coach_involved && <span className="label">Coach involved</span>}
          {task.lesson_id && lessonNumber && (
            <Link
              href={`/modules/${moduleNumber}/lessons/${lessonNumber}`}
              className="label text-bone underline underline-offset-4"
            >
              L{lessonNumber} →
            </Link>
          )}
        </div>
        <p
          className={`font-body mt-1 ${
            completed ? "text-smoke line-through decoration-ash" : "text-bone"
          }`}
        >
          {task.title}
        </p>
      </div>
    </li>
  );
}
