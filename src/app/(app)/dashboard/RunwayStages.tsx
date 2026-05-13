// Runway stages bar. Markers are positioned at module-completion milestones,
// not evenly spaced ticks. Stage definitions, per the design spec:
//   Sent        ← modules 0 + 1 complete (2/9)
//   Foundations ← modules 2 + 3 complete (4/9)
//   Gathering   ← modules 4 + 5 + 6 complete (7/9)
//   Launch      ← modules 7 + 8 complete (9/9)
// Modules 3.5 and bonus sit outside the stage path.

const TOTAL_STAGE_MODULES = 9;

const STAGES = [
  { key: "sent", label: "Sent", at: 2 / TOTAL_STAGE_MODULES },
  { key: "foundations", label: "Foundations", at: 4 / TOTAL_STAGE_MODULES },
  { key: "gathering", label: "Gathering", at: 7 / TOTAL_STAGE_MODULES },
  { key: "launch", label: "Launch", at: 9 / TOTAL_STAGE_MODULES },
] as const;

export function RunwayStages({
  completedModules,
}: {
  completedModules: number;
}) {
  const clamped = Math.max(0, Math.min(TOTAL_STAGE_MODULES, completedModules));
  const fillPct = (clamped / TOTAL_STAGE_MODULES) * 100;
  const currentStage =
    STAGES.find((s) => clamped < s.at * TOTAL_STAGE_MODULES)?.label ??
    "Launch reached";

  return (
    <div className="flex flex-col gap-3">
      {/* Labels above the bar, each anchored to its stage position. */}
      <div className="relative h-5">
        {STAGES.map((stage, i) => {
          const reached = clamped >= stage.at * TOTAL_STAGE_MODULES;
          const leftPct = stage.at * 100;
          const transform =
            i === 0
              ? "translateX(-50%)"
              : i === STAGES.length - 1
              ? "translateX(-100%)"
              : "translateX(-50%)";
          return (
            <span
              key={stage.key}
              className={`absolute top-0 font-nav uppercase tracking-wider3 text-[10px] whitespace-nowrap transition-colors ${
                reached ? "text-fire" : "text-smoke"
              }`}
              style={{ left: `${leftPct}%`, transform }}
            >
              {stage.label}
            </span>
          );
        })}
      </div>

      {/* The bar itself: track + fill + tick marks at each stage position. */}
      <div className="relative h-2">
        <div className="absolute inset-0 bg-ash/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-fire transition-[width] duration-300"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        {STAGES.map((stage) => {
          const reached = clamped >= stage.at * TOTAL_STAGE_MODULES;
          return (
            <span
              key={stage.key}
              aria-hidden
              className={`absolute top-1/2 -translate-y-1/2 w-0.5 h-3 rounded-full transition-colors ${
                reached ? "bg-fire" : "bg-ash"
              }`}
              style={{ left: `calc(${stage.at * 100}% - 1px)` }}
            />
          );
        })}
      </div>

      {/* Status line under the bar. */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="label">
          {clamped} of {TOTAL_STAGE_MODULES} modules complete
        </p>
        <p className="label">
          {clamped >= TOTAL_STAGE_MODULES
            ? "Launch reached · Module 08 closed"
            : `Currently in ${currentStage}`}
        </p>
      </div>
    </div>
  );
}
