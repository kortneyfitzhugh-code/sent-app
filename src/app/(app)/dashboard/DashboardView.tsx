import Link from "next/link";

type Profile = {
  full_name: string;
  role: "planter" | "team_member" | "network_admin";
  city: string | null;
  state: string | null;
};

type Track = { name: string; module_count: number; duration_label: string | null } | null;

type Module = {
  number: string;
  name: string;
  subtitle: string | null;
  anchor_scripture_ref: string | null;
  anchor_scripture_text: string | null;
  primary_objective: string | null;
} | null;

export function DashboardView({
  profile,
  track,
  module: mod,
  taskCount,
  completedTasks,
}: {
  profile: Profile;
  track: Track;
  module: Module;
  taskCount: number;
  completedTasks: number;
}) {
  // Static placeholders for Session 1. Real runway, prophetic prompt, team activity,
  // and worksheet progress are wired in Session 2.
  const runwayDays = 213;
  const moduleDayIn = 14;
  const moduleEstimatedDays = 227;
  const runwayPct = Math.round((moduleDayIn / moduleEstimatedDays) * 100);
  const progressPct = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="label">Sent · Dashboard</p>
            <h1 className="display text-3xl md:text-4xl mt-1">
              {greet(profile.full_name)}
            </h1>
          </div>
          <p className="label hidden md:block">
            {[profile.city, profile.state].filter(Boolean).join(", ") || "Set location in settings"}
          </p>
        </div>

        {/* Runway card */}
        <section className="card p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="label">Runway to launch</p>
            <p className="label">Set in settings</p>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-7xl md:text-8xl leading-none text-bone">
              {runwayDays}
            </span>
            <div className="flex flex-col">
              <span className="label">Days</span>
              <span className="label">Target · Dec 6, 2026</span>
              <span className="label">First public gathering</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Pill>Sent</Pill>
                <Pill>Foundations</Pill>
                <Pill>Gathering</Pill>
                <Pill emphasis>Launch</Pill>
              </div>
              <p className="label">{runwayPct}% of runway used</p>
            </div>
            <div className="h-2 w-full bg-ash/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-fire transition-[width] duration-300"
                style={{ width: `${Math.min(runwayPct, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="label">Day 14 of {moduleEstimatedDays}</p>
              <p className="label">Today · Fri May 12 · Day 14 of this module</p>
            </div>
          </div>

          <blockquote className="border-l-2 border-fire pl-4 font-display text-2xl md:text-3xl leading-tight text-bone">
            The covering comes before the calling becomes visible. Make the call this week.
            <footer className="label mt-3 font-body normal-case tracking-normal text-smoke">
              Drawn from your Module 0 worksheet · Apostolic Covering
            </footer>
          </blockquote>
        </section>

        {/* Active module */}
        {mod && (
          <Link
            href={`/modules/${mod.number}`}
            className="card p-6 md:p-8 flex flex-col gap-5 hover:border-ash transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="label text-fire">
                Module {String(mod.number).padStart(2, "0")} · Active
              </p>
              <p className="label">
                {completedTasks} of {taskCount} tasks · {progressPct}%
              </p>
            </div>
            <div>
              <h2 className="display text-4xl md:text-5xl leading-none">{mod.name}</h2>
              {mod.subtitle && (
                <p className="font-body text-smoke mt-3">{mod.subtitle}</p>
              )}
            </div>

            {mod.anchor_scripture_text && (
              <div className="border-l border-cinder pl-4">
                <p className="label">{mod.anchor_scripture_ref}</p>
                <p className="font-body text-bone mt-2 italic">“{mod.anchor_scripture_text}”</p>
              </div>
            )}

            <div className="h-2 w-full bg-ash/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-fire transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <p className="label text-bone">Open module →</p>
          </Link>
        )}
      </div>

      {/* Right rail */}
      <aside className="hidden xl:flex flex-col gap-6">
        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label">Team activity</p>
            <span className="label">Team →</span>
          </div>
          <ul className="flex flex-col gap-4">
            <ActivityItem name="No team yet" verb="" detail="Invite your first member from My Team." when="" />
          </ul>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label">Active worksheets</p>
            <Link href="/worksheets" className="label hover:text-bone transition-colors">
              All →
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/worksheets/ws1"
                className="flex flex-col gap-1 hover:text-bone transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-body text-bone text-sm">Personal Consecration Plan</p>
                  <span className="label">WS1</span>
                </div>
                <p className="label">Open · Feeds Ask Sent</p>
              </Link>
            </li>
            <li>
              <div className="flex flex-col gap-1 opacity-60">
                <div className="flex items-center justify-between">
                  <p className="font-body text-bone text-sm">Household Covenant</p>
                  <span className="label">WS6</span>
                </div>
                <p className="label">Session 2.5 · Not AI</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="card p-5 border-fire/40">
          <p className="label text-fire mb-3">Ask Sent · tool, not coach</p>
          <p className="font-body text-bone text-sm">
            Looking at your consecration plan, what hours are you protecting for prayer this
            week?
          </p>
          <p className="label mt-3">Suggested · based on Module 0 →</p>
        </section>
      </aside>
    </div>
  );
}

function Pill({
  children,
  emphasis,
}: {
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <span
      className={`label ${
        emphasis ? "text-fire" : "text-smoke"
      }`}
    >
      {children}
    </span>
  );
}

function ActivityItem({
  name,
  verb,
  detail,
  when,
}: {
  name: string;
  verb: string;
  detail: string;
  when: string;
}) {
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="font-nav uppercase tracking-wider3 text-xs text-bone">{name}</p>
        {verb && <p className="label">{verb}</p>}
      </div>
      <p className="font-body text-smoke text-sm">{detail}</p>
      {when && <p className="label">{when}</p>}
    </li>
  );
}

function greet(name: string) {
  const first = name.split(/\s+/)[0] || "Friend";
  return `Today, ${first}.`;
}
