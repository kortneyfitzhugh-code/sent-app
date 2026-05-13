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
  targetHref: string | null;
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
                <TaskCard key={t.id} task={t} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function TaskCard({ task }: { task: TaskRow }) {
  const [pending, startTransition] = useTransition();
  const isCheckpoint = task.kind === "checkpoint";
  const isMilestone = task.kind === "milestone";

  // Border treatment, ranked: completed (alive) > milestone (gold) >
  // checkpoint (fire) > default (cinder).
  const borderClass = task.completed
    ? "border-alive/40"
    : isMilestone
    ? "border-l-4 border-gold border-y border-r border-y-cinder border-r-cinder"
    : isCheckpoint
    ? "border-fire/60"
    : "border-cinder";

  function toggleComplete() {
    const fn = task.completed ? unmarkTaskComplete : markTaskComplete;
    startTransition(async () => {
      await fn(task.id);
    });
  }

  // Whole card navigates when targetHref is set; the leading status icon
  // is a sibling button (not nested) so toggling completion doesn't fight
  // with the link.
  const body = (
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
        {task.lesson && <span className="label">L{task.lesson.number}</span>}
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
      {task.description && (
        <p className="font-body text-smoke text-sm leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  );

  return (
    <li className={`card ${borderClass} flex items-start gap-3 p-4 transition-colors`}>
      {/* Leading icon button — toggles completion. aria-pressed reflects state. */}
      <button
        type="button"
        onClick={toggleComplete}
        disabled={pending}
        aria-pressed={task.completed}
        aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
        className={`shrink-0 w-7 h-7 mt-0.5 rounded-md border grid place-items-center transition-colors ${
          task.completed
            ? "bg-alive/20 border-alive text-alive"
            : task.planterOnly
            ? "border-ash text-smoke hover:border-fire hover:text-fire"
            : "border-ash text-transparent hover:border-fire hover:text-fire"
        }`}
      >
        {task.completed ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : task.planterOnly ? (
          // Lock indicator when planter-only and incomplete — communicates
          // the DB-enforced restriction at a glance.
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        ) : null}
      </button>

      {/* Navigation surface — wraps the body so tapping the card opens the
          linked lesson or worksheet. Stays a plain div when targetHref
          is missing (future-module case). */}
      {task.targetHref ? (
        <Link
          href={task.targetHref}
          className="flex-1 min-w-0 flex items-start gap-3 group"
        >
          {body}
          <span
            aria-hidden
            className="shrink-0 mt-1 text-smoke group-hover:text-fire group-hover:translate-x-0.5 transition-all"
          >
            →
          </span>
        </Link>
      ) : (
        <div className="flex-1 min-w-0 flex items-start gap-3">
          {body}
        </div>
      )}
    </li>
  );
}
