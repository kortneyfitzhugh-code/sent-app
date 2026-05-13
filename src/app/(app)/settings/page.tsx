import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsForms } from "./SettingsForms";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: { email_changed?: string };
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("full_name, email, role, city, state, country, launch_date, ministry_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding/role");

  const emailJustChanged = searchParams?.email_changed === "1";

  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 max-w-2xl">
      <header className="flex flex-col gap-3">
        <p className="label">Settings</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">
          Your profile
        </h1>
      </header>

      {emailJustChanged && (
        <div className="card p-4 border-alive/50">
          <p className="font-body text-bone text-sm">
            <span className="text-alive font-medium">Email confirmed.</span>{" "}
            Your account email is now {profile.email}.
          </p>
        </div>
      )}

      <section>
        <h2 className="label mb-3">Identity</h2>
        <dl className="card p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Row label="Name" value={profile.full_name} />
          <Row label="Email" value={profile.email} />
          <Row label="Role" value={profile.role.replace("_", " ")} />
          <Row
            label="Location"
            value={
              [profile.city, profile.state, profile.country]
                .filter(Boolean)
                .join(", ") || "—"
            }
          />
        </dl>
      </section>

      <SettingsForms
        initialLaunchDate={profile.launch_date ?? ""}
        initialMinistryName={profile.ministry_name ?? ""}
        currentEmail={profile.email}
      />

      <form action="/auth/sign-out" method="post">
        <button className="btn-ghost">Sign out</button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className="font-body text-bone mt-1 break-words">{value}</p>
    </div>
  );
}
