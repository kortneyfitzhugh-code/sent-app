import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// POST → /auth/sign-out. The redirect status matters here: default
// NextResponse.redirect on a POST returns 307, which makes the browser
// re-POST to the destination. That hits /login as POST and errors (405).
// We need a 303 See Other so the browser follows with GET to /login.
export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`, 303);
}
