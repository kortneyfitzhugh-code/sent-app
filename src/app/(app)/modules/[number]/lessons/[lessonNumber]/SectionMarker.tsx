// Quiet reading marker, not a heading. Sits above each section of the
// lesson body. Small ash text with a trailing thin rule — the kind of mark
// you'd see in a printed devotional, not a chapter heading.
export function SectionMarker({ numeral, name }: { numeral: string; name: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 text-ash" aria-label={`Section ${numeral}: ${name}`}>
      <span className="font-nav uppercase tracking-wider4 text-[10px]">
        {numeral} · {name}
      </span>
      <span aria-hidden className="h-px flex-1 bg-cinder" />
    </div>
  );
}
