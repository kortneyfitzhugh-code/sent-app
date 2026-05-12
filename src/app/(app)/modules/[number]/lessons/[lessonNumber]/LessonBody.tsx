// Renders the lesson body. Splits on blank lines. Lines starting with "> "
// render as pull-quote callouts (the apostolic-mentor voice cue from the dossier).
export function LessonBody({ teaching }: { teaching: string }) {
  const blocks = teaching.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        if (block.startsWith(">")) {
          const quote = block.replace(/^>\s*/, "");
          return (
            <blockquote
              key={i}
              className="border-l-2 border-fire pl-5 py-2 font-display text-2xl md:text-3xl leading-snug text-bone"
            >
              {quote}
              <footer className="label mt-3 font-body normal-case tracking-normal text-smoke">
                — The Lesson
              </footer>
            </blockquote>
          );
        }
        return (
          <p key={i} className="font-body text-bone text-lg leading-relaxed">
            {block}
          </p>
        );
      })}
    </div>
  );
}
