import Link from "next/link";
import { SentMark } from "@/components/SentMark";

type Profile = {
  full_name: string;
  email: string;
  role: "planter" | "team_member" | "network_admin";
  city: string | null;
  state: string | null;
  country: string | null;
};

const NAV: { href: string; label: string; meta?: string }[] = [
  { href: "/dashboard", label: "Dashboard", meta: "Today" },
  { href: "/modules", label: "My Modules", meta: "1/11" },
  { href: "/tasks", label: "All Tasks" },
  { href: "/team", label: "My Team" },
  { href: "/worksheets", label: "Worksheets" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Settings" },
];

const ROLE_LABEL: Record<Profile["role"], string> = {
  planter: "Planter",
  team_member: "Team Member",
  network_admin: "Network Admin",
};

export function Sidebar({ profile }: { profile: Profile }) {
  const initials = profile.full_name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const location = [profile.city, profile.state].filter(Boolean).join(", ");

  return (
    <aside className="hidden md:flex md:flex-col bg-carbon border-r border-cinder min-h-screen p-8 gap-10 sticky top-0">
      <SentMark />

      <nav className="flex flex-col gap-1">
        <p className="label mb-2">Navigate</p>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-cinder transition-colors group"
          >
            <span className="font-nav uppercase tracking-wider3 text-sm text-bone group-hover:text-bone">
              {item.label}
            </span>
            {item.meta && (
              <span className="label group-hover:text-bone">{item.meta}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto card p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-fire/15 border border-fire/40 grid place-items-center font-nav text-fire text-sm tracking-wider3">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-bone text-sm truncate">{profile.full_name}</p>
          <p className="label truncate">
            {ROLE_LABEL[profile.role]}
            {location && ` · ${location}`}
          </p>
        </div>
      </div>
    </aside>
  );
}
