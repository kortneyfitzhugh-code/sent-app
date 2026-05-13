import { SectionMarker } from "./SectionMarker";

// Activation — the call to action that closes a lesson. Per Fire & Night
// tokens, gold (#D4A847) is reserved for milestone treatments; the
// activation prompt qualifies as the lesson's milestone-grade moment.
export function ActivationSection({ text }: { text: string }) {
  if (!text.trim()) return null;
  // Render multi-paragraph activations cleanly.
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="flex flex-col gap-5">
      <SectionMarker numeral="V" name="Activation" />
      <div className="card p-6 md:p-8 border-l-4 border-gold bg-gold/5 flex flex-col gap-4">
        <p className="font-nav uppercase tracking-wider3 text-xs text-gold">
          A prompt for the week
        </p>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-body text-bone text-lg leading-relaxed"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
