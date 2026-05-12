type Step = "account" | "role" | "geography" | "track" | "confirm";
const ORDER: Step[] = ["account", "role", "geography", "track", "confirm"];
const LABEL: Record<Step, string> = {
  account: "Account",
  role: "Role",
  geography: "Geography",
  track: "Track",
  confirm: "Confirm",
};

export function StepHeader({ current }: { current: Step }) {
  const idx = ORDER.indexOf(current);
  return (
    <ol className="flex items-center gap-3 flex-wrap text-smoke">
      {ORDER.map((s, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-nav tracking-wider3 border ${
                active
                  ? "bg-fire border-fire text-bone"
                  : done
                  ? "bg-cinder border-ash text-bone"
                  : "border-cinder text-smoke"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`label hidden md:inline ${
                active ? "text-bone" : done ? "text-bone/70" : "text-smoke"
              }`}
            >
              {LABEL[s]}
            </span>
            {i < ORDER.length - 1 && <span className="text-cinder hidden md:inline">·</span>}
          </li>
        );
      })}
    </ol>
  );
}
