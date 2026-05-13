// Renders the prose body of a lesson — the paragraphs between "The Lesson"
// and "Key Scriptures". The other sections (scriptures, reflections,
// activation) are now broken out into their own components and rendered
// as distinct sections by the lesson page. This component used to handle
// the whole markdown subset but now is body-prose only.
//
// Supported here:
//   plain paragraph     → <p>
//   > "quote"           → fire-bordered pull-quote
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
              className="border-l-2 border-fire pl-5 py-1 font-body italic text-bone text-lg leading-relaxed"
            >
              {quote}
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
