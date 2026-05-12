"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { PasswordField } from "@/components/PasswordField";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signinError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signinError) {
      setError(signinError.message);
      return;
    }
    router.push(params.get("redirect") || "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className="label">Sign in</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">Welcome back.</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="label">Email</span>
          <input
            className="input-shell"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </label>
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="text-sm font-body text-fire">{error}</p>}

        <button type="submit" className="btn-fire w-full mt-2" disabled={busy}>
          {busy ? "Signing in…" : "Sign in →"}
        </button>

        <p className="font-body text-sm text-smoke">
          New here?{" "}
          <Link href="/signup" className="text-bone underline underline-offset-4">
            Create your account.
          </Link>
        </p>
      </form>
    </div>
  );
}
