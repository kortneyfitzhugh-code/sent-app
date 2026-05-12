import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Email confirmation / magic-link callback. Supabase appends `?code=...`.
// On success, route based on profile state:
//   - onboarding_complete = true  → /dashboard
//   - otherwise                   → /onboarding/role
//   - no session                  → /login
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const supabase = createSupabaseServerClient();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : `/${next}`}`);
  }

  const { data: profile } = await supabase
    .from("profile")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  const destination = profile?.onboarding_complete ? "/dashboard" : "/onboarding/role";
  return NextResponse.redirect(`${origin}${destination}`);
}
