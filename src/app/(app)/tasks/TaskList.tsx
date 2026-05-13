"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { markTaskComplete, unmarkTaskComplete } from "@/lib/actions/tasks";

export type TaskRow = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  kind: string;
  planterOnly: boolean;
  coachInvolved: boolean;
  lesson: { number: number; title: string } | null;
  completed: boolean;
};

export type LessonGroup = {
  kind: "lesson" | "module";
  title: string;
  moduleNumber: string;
  lessonNumber: number | null;
  tasks: TaskRow[];
};

type FilterKey =
  | "all"
  | "complete"
  | "incomplete"
  | "planter_only"
  | "team_assignable";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "complete", label: "Complete" },
  { key: "incomplete", label: "Incomplete" },
  { key: "planter_only", label: "Planter only" },
  { key: "team_assignable", label: "Team assignable" },
];

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

function matchesFilter(t: TaskRow, f: FilterKey): boolean {
  switch (f) {
    case "all": return true;
    case "complete": return t.completed;
    case "incomplete": return !t.completed;
    case "planter_only": return t.planterOnly;
    case "team_assignable": return !t.planterOnly;
  }
}

export function TaskList({ groups }: { groups: LessonGroup[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredGroups = useMemo(
    () => groups
      .map((g) => ({ ...g, tasks: g.tasks.filter((t) => matchesFilter(t, filter)) }))
      .filter((g) => g.tasks.length > 0),
    [groups, filter]
  );

  const total = useMemo(
    () => groups.reduce((acc, g) => acc + g.tasks.length, 0),
    [groups]
  );
  const visible = useMemo(
    () => filteredGroups.reduce((acc, g) => acc + g.tasks.length, 0),
    [filteredGroups]
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar */}
      <div className="flex flex-col gap-2">
        <p className="label">Filter</p>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const selected = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md border text-xs font-nav uppercase tracking-wider3 transition-colors ${
                  selected
                    ? "bg-fire/15 border-fire text-bone"
                    : "border-cinder text-smoke hover:border-ash hover:text-bone"
                }`}
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-auto label self-center">
            {visible} of {total}
          </span>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <p className="font-body text-smoke text-sm">No tasks match this filter.</p>
      ) : (
        filteredGroups.map((g) => (
          <section key={g.title} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <p className="label">{g.title}</p>
              {g.kind === "lesson" && g.lessonNumber !== null && (
                <Link
                  href={`/modules/${g.moduleNumber}/lessons/${g.lessonNumber}`}
                  className="label hover:text-bone transition-colors"
                >
                  Open lesson →
                </Link>
              )}
            </div>
            <ul className="flex flex-col gap-2">
              {g.tasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  expanded={expandedId === t.id}
                  onToggle={() =>
                    setExpandedId((current) => (current === t.id ? null : t.id))
                  }
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function TaskCard({
  task,
  expanded,
  onToggle,
}: {
  task: TaskRow;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const isCheckpoint = task.kind === "checkpoint";
  const isMilestone = task.kind === "milestone";

  // Border treatment: gold for milestones, fire for checkpoint, alive for
  // completed (only when not also a milestone/checkpoint), cinder otherwise.
  const borderClass = task.completed
    ? "border-alive/40"
    : isCheckpoint
    ? "border-fire/60"
    : isMilestone
    ? "border-l-4 border-gold border-y border-r border-y-cinder border-r-cinder"
    : "border-cinder";

  function toggleComplete() {
    const fn = task.completed ? unmarkTaskComplete : markTaskComplete;
    startTransition(async () => {
      await fn(task.id);
    });
  }

  return (
    <li className={`card ${borderClass} transition-colors`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left"
        aria-expanded={expanded}
      >
        {/* Status indicator (checkmark / lock / dot) */}
        <span className="shrink-0 mt-0.5 w-6 h-6 grid place-items-center">
          {task.completed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                 className="text-alive" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : task.planterOnly ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="text-smoke" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-ash" aria-hidden />
          )}
        </span>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="label">T{String(task.number).padStart(2, "0")}</span>
            <span
              className={`label ${
                isCheckpoint
                  ? "text-fire"
                  : isMilestone
                  ? "text-gold"
                  : "text-smoke"
              }`}
            >
              {KIND_LABEL[task.kind] ?? task.kind}
            </span>
            {task.planterOnly ? (
              <span className="label text-fire">Planter only</span>
            ) : (
              <span className="label">Team assignable</span>
            )}
            {task.coachInvolved && <span className="label">Coach involved</span>}
            {task.lesson && (
              <span className="label">L{task.lesson.number}</span>
            )}
          </div>
          <p
            className={`font-body ${
              task.completed
                ? "text-smoke line-through decoration-ash"
                : "text-bone"
            }`}
          >
            {task.title}
          </p>
        </div>

        <span
          className={`shrink-0 label transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 -mt-1 flex flex-col gap-4 border-t border-cinder/60">
          <div className="pt-4">
            {task.description ? (
              <p className="font-body text-smoke text-sm leading-relaxed">
                {task.description}
              </p>
            ) : (
              <p className="font-body text-smoke text-sm italic">
                No detail copy yet for this task.
              </p>
            )}
          </div>

          {isMilestone && (
            <div className="border-l-2 border-gold pl-3">
              <p className="label text-gold">Milestone</p>
              <p className="font-body text-smoke text-xs mt-1">
                Milestones are gates — completing this marks a real shift in the
                planting season.
              </p>
            </div>
          )}
          {isCheckpoint && (
            <div className="border-l-2 border-fire pl-3">
              <p className="label text-fire">Coaching checkpoint</p>
              <p className="font-body text-smoke text-xs mt-1">
                Self-reflection in V1; coach interaction in V2. Module 0 closes
                here.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="label">
              {task.completed ? "Marked complete" : "Not yet complete"}
            </p>
            <button
              type="button"
              onClick={toggleComplete}
              disabled={pending}
              className={task.completed ? "btn-ghost" : "btn-fire"}
            >
              {pending
                ? "Saving…"
                : task.completed
                ? "Unmark complete"
                : "Mark complete"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
