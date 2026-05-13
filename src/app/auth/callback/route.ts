import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Supabase auth callback. Lands here after any of:
//   * signup confirmation        (?type=signup)
//   * email-change confirmation  (?type=email_change)
//   * magic-link sign-in         (?type=magiclink)
//   * password recovery          (?type=recovery)
//   * invite                     (?type=invite)
// All flows exchange a `code` for a session via PKCE. The `type` param
// drives where we send the planter afterwards.
//
// A `next` query param overrides the default destination (used when a
// page like /invites/[token] kicks off auth and wants the planter back).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next");
  // Supabase also surfaces failures as ?error=...&error_description=...
  // Treat those as a soft failure → /login with a message.
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("auth_error", errorDescription);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createSupabaseServerClient();
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("auth_error", error.message);
      return NextResponse.redirect(loginUrl);
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Explicit `next` wins (used by /invites/[token] etc.). Restrict to
  // same-origin paths so we don't accept open-redirect bait.
  if (next && next.startsWith("/")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Email change: send back to /settings with a flag the page reads to
  // show the confirmation banner.
  if (type === "email_change") {
    const settingsUrl = new URL("/settings", origin);
    settingsUrl.searchParams.set("email_changed", "1");
    return NextResponse.redirect(settingsUrl);
  }

  // Password recovery: drop the planter on settings so they can set a new
  // password without re-authenticating (their session is fresh from
  // exchangeCodeForSession).
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/settings`);
  }

  // Signup / magic-link / invite / default: route by profile state.
  const { data: profile } = await supabase
    .from("profile")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  const destination = profile?.onboarding_complete ? "/dashboard" : "/onboarding/role";
  return NextResponse.redirect(`${origin}${destination}`);
}
