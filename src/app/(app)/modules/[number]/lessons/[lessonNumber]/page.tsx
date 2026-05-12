import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LessonBody } from "./LessonBody";
import { MarkReadButton } from "./MarkReadButton";
import { SectionMarker } from "./SectionMarker";

export default async function LessonReader({
  params,
}: {
  params: { number: string; lessonNumber: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("track_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.track_id) redirect("/onboarding/track");

  const { data: mod } = await supabase
    .from("module")
    .select("id, number, name, anchor_scripture_ref, anchor_scripture_text")
    .eq("track_id", profile.track_id)
    .eq("number", params.number)
    .maybeSingle();
  if (!mod) notFound();

  const lessonNum = parseInt(params.lessonNumber, 10);
  if (isNaN(lessonNum)) notFound();

  const { data: lesson } = await supabase
    .from("lesson")
    .select("id, number, title, estimated_minutes, is_anchor, hook, teaching")
    .eq("module_id", mod.id)
    .eq("number", lessonNum)
    .maybeSingle();
  if (!lesson) notFound();

  // Find the task this lesson satisfies (if any), and current completion state.
  const { data: linkedTask } = await supabase
    .from("task")
    .select("id, number, title")
    .eq("module_id", mod.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  let taskCompleted = false;
  if (linkedTask) {
    const { data: assignment } = await supabase
      .from("task_assignment")
      .select("completed_at")
      .eq("planter_id", user.id)
      .eq("task_id", linkedTask.id)
      .maybeSingle();
    taskCompleted = !!assignment?.completed_at;
  }

  // Lessons rail neighbors
  const { data: siblings } = await supabase
    .from("lesson")
    .select("number, title, is_anchor, teaching")
    .eq("module_id", mod.id)
    .order("number", { ascending: true });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <article className="flex flex-col gap-10 max-w-3xl">
        {/* Crumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/modules/${mod.number}`}
            className="label hover:text-bone transition-colors"
          >
            ‹ Module {mod.number.padStart(2, "0")}
          </Link>
          {linkedTask && (
            <p className="label">
              Task {String(linkedTask.number).padStart(2, "0")} · {lesson.estimated_minutes ?? "—"} min read
            </p>
          )}
        </div>

        {/* Header block */}
        <header className="flex flex-col gap-4">
          {lesson.is_anchor && <p className="label text-fire">The anchor lesson</p>}
          <p className="label">
            Module {mod.number.padStart(2, "0")} · Lesson {lesson.number} of {siblings?.length ?? 7}
          </p>
          <h1 className="display text-5xl md:text-6xl leading-none">{lesson.title}</h1>
          {linkedTask && (
            <p className="font-body text-smoke text-sm border-l border-cinder pl-4">
              This task IS this lesson — reading completes it.
            </p>
          )}
        </header>

        {/* Body */}
        {lesson.teaching ? (
          <>
            {lesson.hook && (
              <section>
                <SectionMarker numeral="I" name="Opening" />
                <p className="font-body text-bone text-lg leading-relaxed">{lesson.hook}</p>
              </section>
            )}
            <section>
              <SectionMarker numeral="II" name="The Lesson" />
              <LessonBody teaching={lesson.teaching} />
            </section>
            {linkedTask && (
              <section className="border-t border-cinder pt-8">
                <MarkReadButton
                  taskId={linkedTask.id}
                  completed={taskCompleted}
                  returnTo={`/modules/${mod.number}`}
                />
              </section>
            )}
          </>
        ) : (
          <section className="card p-8 flex flex-col gap-3">
            <p className="label text-fire">Coming in Session 3</p>
            <p className="font-body text-bone">
              This lesson's full body lands in Session 3. The structure is here — hook,
              scripture anchor, teaching, reflection — and your task progress will count
              the moment the content is published.
            </p>
            {lesson.hook && (
              <p className="font-body text-smoke text-sm italic">"{lesson.hook}"</p>
            )}
          </section>
        )}
      </article>

      {/* Right rail: lessons in this module */}
      <aside className="hidden xl:flex flex-col gap-4">
        <p className="label">Lessons · Module {mod.number.padStart(2, "0")}</p>
        <ol className="flex flex-col gap-2">
          {(siblings ?? []).map((l) => {
            const isCurrent = l.number === lesson.number;
            const hasContent = !!l.teaching;
            return (
              <li key={l.number}>
                {hasContent ? (
                  <Link
                    href={`/modules/${mod.number}/lessons/${l.number}`}
                    className={`card p-3 flex items-baseline gap-3 hover:border-ash transition-colors ${
                      isCurrent ? "border-fire" : ""
                    }`}
                  >
                    <span className="label shrink-0">L{l.number}</span>
                    <span
                      className={`font-body text-sm leading-tight ${
                        isCurrent ? "text-bone" : "text-bone"
                      }`}
                    >
                      {l.title}
                    </span>
                  </Link>
                ) : (
                  <div className="card p-3 flex items-baseline gap-3 opacity-50">
                    <span className="label shrink-0">L{l.number}</span>
                    <span className="font-body text-sm text-smoke leading-tight">
                      {l.title}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {mod.anchor_scripture_text && (
          <div className="card p-4 mt-2">
            <p className="label mb-2">Scripture anchor</p>
            <p className="font-body text-bone text-sm italic">
              "{mod.anchor_scripture_text}"
            </p>
            <p className="label mt-2">{mod.anchor_scripture_ref}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
