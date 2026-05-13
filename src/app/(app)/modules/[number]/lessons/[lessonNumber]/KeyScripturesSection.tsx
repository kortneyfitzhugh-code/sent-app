import type { Scripture } from "@/lib/parseLessonTeaching";
import { SectionMarker } from "./SectionMarker";

// Distinct visual treatment for the Key Scriptures block — each scripture
// is its own card with the reference, the verse, and the commentary note.
// Plays against the body prose so the reader knows they've moved from
// teaching to anchor.
export function KeyScripturesSection({ scriptures }: { scriptures: Scripture[] }) {
  if (scriptures.length === 0) return null;
  return (
    <section className="flex flex-col gap-5">
      <SectionMarker numeral="III" name="Key Scriptures" />
      <ul className="flex flex-col gap-4">
        {scriptures.map((s) => (
          <li
            key={s.reference}
            className="card p-5 flex flex-col gap-3 border-cinder"
          >
            <p className="font-nav uppercase tracking-wider3 text-xs text-fire">
              {s.reference}
            </p>
            {s.quote && (
              <blockquote className="font-body italic text-bone text-lg leading-relaxed border-l-2 border-fire pl-4">
                {s.quote}
              </blockquote>
            )}
            {s.note && (
              <p className="font-body text-smoke text-sm leading-relaxed">
                {s.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
