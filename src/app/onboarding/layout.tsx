import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SentMark } from "@/components/SentMark";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profile")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_complete) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 md:px-12 md:py-8 flex items-center justify-between">
        <SentMark />
        <form action="/auth/sign-out" method="post">
          <button className="label hover:text-bone transition-colors">Save &amp; exit</button>
        </form>
      </header>
      <main className="flex-1 px-6 pb-16 md:px-12 flex justify-center">
        <div className="w-full max-w-3xl xl:max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
