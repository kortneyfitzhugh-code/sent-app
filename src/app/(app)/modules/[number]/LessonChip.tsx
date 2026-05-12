import Link from "next/link";

type Lesson = {
  id: string;
  number: number;
  title: string;
  is_anchor: boolean;
  estimated_minutes: number | null;
  teaching?: string | null;
};

// A chip is "active" (clickable) when the lesson row has a teaching body —
// derived in the parent. We render the L# + title with a locked treatment
// when inactive. Session 2.5 will seed teaching for L2–L7 and the chip flips
// automatically because `active` is computed from data, not hardcoded.
export function LessonChip({
  lesson,
  moduleNumber,
  active,
}: {
  lesson: Lesson;
  moduleNumber: string;
  active?: boolean;
}) {
  // Default heuristic for V1: the anchor lesson (L1) is the only one with a body.
  const isActive = active ?? lesson.is_anchor;

  const inner = (
    <div className="flex items-center gap-3 min-w-0">
      <span
        className={`shrink-0 grid place-items-center w-9 h-9 rounded-md border font-nav text-xs tracking-wider3 ${
          isActive
            ? "border-fire/40 text-fire bg-fire/5"
            : "border-cinder text-smoke"
        }`}
      >
        L{lesson.number}
      </span>
      <div className="min-w-0">
        <p
          className={`font-body text-sm leading-tight truncate ${
            isActive ? "text-bone" : "text-smoke"
          }`}
        >
          {lesson.title}
        </p>
        <p className="label mt-0.5">
          {lesson.is_anchor && "Anchor · "}
          {isActive
            ? lesson.estimated_minutes
              ? `${lesson.estimated_minutes} min · Open`
              : "Open"
            : "Locked · Session 2.5"}
        </p>
      </div>
    </div>
  );

  const baseClasses =
    "card p-3 block transition-colors min-h-[64px]";

  if (isActive) {
    return (
      <li>
        <Link
          href={`/modules/${moduleNumber}/lessons/${lesson.number}`}
          className={`${baseClasses} hover:border-ash`}
          title={lesson.title}
        >
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li
      aria-disabled
      className={`${baseClasses} opacity-60 cursor-not-allowed`}
      title={lesson.title}
    >
      {inner}
    </li>
  );
}
