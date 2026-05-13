"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { ReflectionQuestion } from "@/lib/parseLessonTeaching";
import { saveLessonReflection } from "@/lib/actions/lesson-reflections";
import { SectionMarker } from "./SectionMarker";

type AnswersMap = Record<number, string>;

// Reflection Questions section. Each question gets a numbered card with
// an autosaving textarea — the planter can answer in the app. 800ms
// debounce on text input, immediate commit on blur. Answer state lives
// in this component so each question is independent and doesn't trigger
// re-renders of siblings during typing.
export function ReflectionsSection({
  lessonId,
  questions,
  initialAnswers,
}: {
  lessonId: string;
  questions: ReflectionQuestion[];
  initialAnswers: AnswersMap;
}) {
  if (questions.length === 0) return null;

  return (
    <section className="flex flex-col gap-5">
      <SectionMarker numeral="IV" name="Reflection Questions" />
      <p className="font-body text-smoke text-sm">
        Sit with these. Write what's true, not what's tidy. Answers save
        automatically and are private to you.
      </p>
      <ol className="flex flex-col gap-4">
        {questions.map((q) => (
          <li key={q.number}>
            <ReflectionField
              lessonId={lessonId}
              question={q}
              initial={initialAnswers[q.number] ?? ""}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReflectionField({
  lessonId,
  question,
  initial,
}: {
  lessonId: string;
  question: ReflectionQuestion;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [savedAt, setSavedAt] = useState<string | null>(initial ? "loaded" : null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track the last value we wrote so we don't repeatedly commit the same text
  // (e.g. blur after debounce already fired).
  const committedRef = useRef<string>(initial);

  function commit(next: string) {
    if (next === committedRef.current) return;
    committedRef.current = next;
    startTransition(async () => {
      const res = await saveLessonReflection({
        lessonId,
        questionNumber: question.number,
        questionText: question.text,
        answer: next,
      });
      if (res.ok) {
        setSavedAt(new Date().toISOString());
        setError(null);
      } else {
        setError(res.error);
      }
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setValue(next);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => commit(next), 800);
  }

  function handleBlur() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    commit(value);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <span className="font-display text-2xl text-fire/70 shrink-0 w-7 leading-none pt-1">
          {question.number}
        </span>
        <p className="font-body text-bone text-base md:text-lg leading-relaxed">
          {question.text}
        </p>
      </div>
      <textarea
        className="input-shell min-h-[120px] resize-y font-body leading-relaxed"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type your reflection…"
      />
      <div className="flex items-center justify-between">
        <p className="label">
          {pending
            ? "Saving…"
            : error
            ? <span className="text-fire">{error}</span>
            : savedAt
            ? "Saved · private to you"
            : "Not yet written"}
        </p>
      </div>
    </div>
  );
}
