import Link from "next/link";
import { Greeting } from "./Greeting";
import { RunwayStages } from "./RunwayStages";

type Profile = {
  full_name: string;
  role: "planter" | "team_member" | "network_admin";
  city: string | null;
  state: string | null;
  launch_date: string | null;
  ministry_name: string | null;
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
  completedStageModules,
}: {
  profile: Profile;
  track: Track;
  module: Module;
  taskCount: number;
  completedTasks: number;
  completedStageModules: number;
}) {
  // Real runway derived from the planter's launch_date (set in /settings).
  // When not set, the card surfaces a "Set in settings" affordance instead.
  const today = startOfLocalDay(new Date());
  const launch = profile.launch_date ? parseLocalDate(profile.launch_date) : null;
  const runwayDays = launch ? Math.max(0, daysBetween(today, launch)) : null;
  const launchPassed = launch && launch.getTime() < today.getTime();
  const progressPct = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="label">
              {profile.ministry_name ?? "Sent · Dashboard"}
            </p>
            <Greeting firstName={firstName(profile.full_name)} />
          </div>
          <p className="label hidden md:block">
            {[profile.city, profile.state].filter(Boolean).join(", ") || "Set location in settings"}
          </p>
        </div>

        {/* Runway card */}
        <section className="card p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="label">Runway to launch</p>
            <Link
              href="/settings"
              className="label hover:text-bone transition-colors"
            >
              {launch ? "Edit in settings →" : "Set in settings →"}
            </Link>
          </div>
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="font-display text-7xl md:text-8xl leading-none text-bone">
              {runwayDays ?? "—"}
            </span>
            <div className="flex flex-col">
              <span className="label">
                {launchPassed ? "Past launch" : "Days"}
              </span>
              <span className="label">
                {launch
                  ? `Target · ${formatShort(launch)}`
                  : "No target set yet"}
              </span>
              <span className="label">First public gathering</span>
            </div>
          </div>

          <RunwayStages completedModules={completedStageModules} />

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

function firstName(fullName: string): string {
  return fullName.split(/\s+/)[0] || "Friend";
}

function parseLocalDate(iso: string): Date {
  // Treat YYYY-MM-DD as a local date — new Date("2026-12-06") would be UTC.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}
function formatShort(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
