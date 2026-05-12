"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { PasswordField } from "@/components/PasswordField";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 12) {
      setError("Password must be at least 12 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    setBusy(false);
    if (signupError) {
      setError(signupError.message);
      return;
    }
    router.push("/onboarding/role");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-10">
      <StepHeader current="account" />
      <div className="flex flex-col gap-3">
        <p className="label">Screen 11 · Step 01 of 05</p>
        <h1 className="display text-4xl md:text-5xl leading-tight">Create your account.</h1>
        <p className="font-body text-smoke text-sm">
          The form is the screen. No social login, no shortcuts — this is the first decision
          of formation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Field label="Full name">
          <input
            className="input-shell"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Marcus Jenkins"
            required
            autoComplete="name"
          />
        </Field>
        <Field label="Email">
          <input
            className="input-shell"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </Field>
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 12 characters"
          required
          minLength={12}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter"
          required
          autoComplete="new-password"
        />

        {error && (
          <p className="text-sm font-body text-fire" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-fire w-full mt-2" disabled={busy}>
          {busy ? "Creating…" : "Continue →"}
        </button>

        <p className="font-body text-sm text-smoke">
          Already have an account?{" "}
          <Link href="/login" className="text-bone underline underline-offset-4">
            Sign in.
          </Link>
        </p>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

