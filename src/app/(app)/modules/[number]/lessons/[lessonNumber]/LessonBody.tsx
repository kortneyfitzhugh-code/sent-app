// Renders the lesson body. The teaching field uses a small markdown subset:
//
//   plain paragraph     → <p>
//   ## Heading          → top-level section heading (Key Scriptures / Reflection
//                          Questions / Activation)
//   ### Heading         → scripture reference subhead
//   > "quote"           → scripture verse pull-quote
//   1. text             → numbered list item (a paragraph that begins with N.)
//
// The format is line-oriented within blocks separated by blank lines.
export function LessonBody({ teaching }: { teaching: string }) {
  const blocks = teaching.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        // ## Sub-section heading — sits below the lesson-level I·Opening / II·The
        // Lesson markers, so it's a chapter mark rather than a display heading.
        if (block.startsWith("## ")) {
          return (
            <div
              key={i}
              className="flex items-center gap-4 mt-6 first:mt-0 text-bone"
            >
              <span className="font-display tracking-wider2 text-xl uppercase">
                {block.slice(3).trim()}
              </span>
              <span aria-hidden className="h-px flex-1 bg-cinder" />
            </div>
          );
        }

        // ### Scripture reference — small caps in fire, like a marginal anchor.
        if (block.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="font-nav uppercase tracking-wider3 text-xs text-fire mt-2"
            >
              {block.slice(4).trim()}
            </h3>
          );
        }

        // > Pull-quote / scripture verse
        if (block.startsWith(">")) {
          const quote = block.replace(/^>\s*/, "");
          return (
            <blockquote
              key={i}
              className="border-l-2 border-fire pl-5 py-1 font-body italic text-bone text-lg leading-relaxed"
            >
              {quote}
            </blockquote>
          );
        }

        // 1. Numbered question
        const numMatch = block.match(/^(\d+)\.\s+(.+)$/s);
        if (numMatch) {
          const [, num, body] = numMatch;
          return (
            <div key={i} className="flex gap-4">
              <span className="font-display text-2xl text-fire/70 shrink-0 w-8 leading-none pt-1">
                {num}
              </span>
              <p className="font-body text-bone text-lg leading-relaxed">{body}</p>
            </div>
          );
        }

        // Plain paragraph
        return (
          <p key={i} className="font-body text-bone text-lg leading-relaxed">
            {block}
          </p>
        );
      })}
    </div>
  );
}
