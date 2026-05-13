// Parse a lesson's `teaching` markdown into the four structural sections
// that render distinctly: prose body, key scriptures, reflection questions,
// activation. The teaching text uses a small markdown subset:
//
//   plain paragraph     → body prose
//   ## Heading          → top-level section break (Key Scriptures / Reflection
//                          Questions / Activation)
//   ### Reference       → scripture reference subhead
//   > "quote"           → scripture verse pull-quote
//   1. text             → numbered reflection question
//
// This parser is forgiving: if a section is missing, that field is empty.

export type Scripture = {
  reference: string;
  quote: string;
  note: string;
};

export type ReflectionQuestion = {
  number: number;
  text: string;
};

export type ParsedLesson = {
  body: string;             // raw markdown of the body prose
  scriptures: Scripture[];
  reflections: ReflectionQuestion[];
  activation: string;       // plain prose
};

const SECTION_HEADINGS = {
  scriptures: /^##\s+Key Scriptures\s*$/i,
  reflections: /^##\s+Reflection Questions\s*$/i,
  activation: /^##\s+Activation\s*$/i,
};

export function parseLessonTeaching(teaching: string): ParsedLesson {
  // Split the doc on `##` section headings while keeping the heading lines.
  const blocks = teaching.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  const sections = { body: [] as string[], scriptures: [] as string[], reflections: [] as string[], activation: [] as string[] };
  let current: keyof typeof sections = "body";

  for (const block of blocks) {
    if (SECTION_HEADINGS.scriptures.test(block)) { current = "scriptures"; continue; }
    if (SECTION_HEADINGS.reflections.test(block)) { current = "reflections"; continue; }
    if (SECTION_HEADINGS.activation.test(block))  { current = "activation"; continue; }
    sections[current].push(block);
  }

  return {
    body: sections.body.join("\n\n"),
    scriptures: parseScriptures(sections.scriptures),
    reflections: parseReflections(sections.reflections),
    activation: sections.activation.join("\n\n"),
  };
}

function parseScriptures(blocks: string[]): Scripture[] {
  // Within the Key Scriptures section, each scripture is three sibling
  // paragraph blocks in order: "### Reference", "> Quote", "Commentary note".
  // Some have multi-paragraph notes — collect everything until the next ###.
  const out: Scripture[] = [];
  let current: Partial<Scripture> | null = null;
  const noteLines: string[] = [];

  function commit() {
    if (current && current.reference) {
      out.push({
        reference: current.reference,
        quote: current.quote ?? "",
        note: noteLines.join("\n\n").trim(),
      });
    }
    current = null;
    noteLines.length = 0;
  }

  for (const block of blocks) {
    if (block.startsWith("### ")) {
      commit();
      current = { reference: block.slice(4).trim() };
    } else if (block.startsWith(">")) {
      if (current) current.quote = block.replace(/^>\s*/, "").trim();
    } else if (current) {
      noteLines.push(block);
    }
  }
  commit();
  return out;
}

function parseReflections(blocks: string[]): ReflectionQuestion[] {
  // After `## Reflection Questions`, each numbered item is its own block
  // ("1. ...", "2. ..."). The number drives the answer's stable key.
  const out: ReflectionQuestion[] = [];
  for (const block of blocks) {
    const m = block.match(/^(\d+)\.\s+([\s\S]+)$/);
    if (m) {
      out.push({ number: Number(m[1]), text: m[2].trim() });
    }
  }
  return out;
}
