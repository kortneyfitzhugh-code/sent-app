"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PasswordField } from "@/components/PasswordField";
import {
  changePassword,
  requestEmailChange,
  updateProfileSettings,
} from "@/lib/actions/settings";

export function SettingsForms({
  initialLaunchDate,
  initialMinistryName,
  currentEmail,
}: {
  initialLaunchDate: string;
  initialMinistryName: string;
  currentEmail: string;
}) {
  return (
    <>
      <PlantForm
        initialLaunchDate={initialLaunchDate}
        initialMinistryName={initialMinistryName}
      />
      <EmailForm currentEmail={currentEmail} />
      <PasswordForm />
    </>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(null);
    startTransition(async () => {
      const res = await requestEmailChange({ newEmail: next, confirmEmail: confirm });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSent(next.trim().toLowerCase());
      setNext("");
      setConfirm("");
    });
  }

  return (
    <section>
      <h2 className="label mb-3">Email</h2>
      <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="label">Current email</span>
          <input
            className="input-shell opacity-70 cursor-not-allowed"
            type="email"
            value={currentEmail}
            readOnly
            aria-readonly
            tabIndex={-1}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">New email</span>
          <input
            className="input-shell"
            type="email"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="you@new-address.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">Confirm new email</span>
          <input
            className="input-shell"
            type="email"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter the new address"
            autoComplete="email"
            required
          />
        </label>

        {error && <p className="font-body text-fire text-sm">{error}</p>}
        {sent && (
          <div className="card p-4 border-alive/40">
            <p className="font-body text-bone text-sm leading-relaxed">
              Two confirmation emails have been sent — one to your new address
              and one to your current address. You must click the link in both
              emails before your email address will update. Check both inboxes
              including spam.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="label">
            We'll keep showing your current email until you click the
            verification link.
          </p>
          <button
            type="submit"
            className="btn-fire"
            disabled={pending || !next || !confirm}
          >
            {pending ? "Sending…" : "Send verification"}
          </button>
        </div>
      </form>
    </section>
  );
}

function PlantForm({
  initialLaunchDate,
  initialMinistryName,
}: {
  initialLaunchDate: string;
  initialMinistryName: string;
}) {
  const router = useRouter();
  const [launchDate, setLaunchDate] = useState(initialLaunchDate);
  const [ministryName, setMinistryName] = useState(initialMinistryName);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty =
    launchDate !== initialLaunchDate || ministryName !== initialMinistryName;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await updateProfileSettings({
        launchDate: launchDate || null,
        ministryName,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice("Saved.");
      router.refresh();
    });
  }

  return (
    <section>
      <h2 className="label mb-3">Your plant</h2>
      <form
        onSubmit={handleSubmit}
        className="card p-5 flex flex-col gap-5"
      >
        <label className="flex flex-col gap-2">
          <span className="label">Church / ministry name</span>
          <input
            className="input-shell"
            value={ministryName}
            onChange={(e) => setMinistryName(e.target.value)}
            placeholder="Gracefield · Kansas City"
            maxLength={120}
          />
          <span className="label">
            Shown across the app once the church is named. Leave blank if you
            haven't named it yet.
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">First public gathering · launch date</span>
          <input
            className="input-shell max-w-xs"
            type="date"
            value={launchDate}
            onChange={(e) => setLaunchDate(e.target.value)}
          />
          <span className="label">
            Drives the runway countdown on your dashboard. Move it as the
            Spirit moves it — this is a target, not a deadline.
          </span>
        </label>

        {error && <p className="font-body text-fire text-sm">{error}</p>}
        {notice && <p className="font-body text-alive text-sm">{notice}</p>}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="label">
            {launchDate
              ? `Counting down to ${formatLong(launchDate)}.`
              : "No launch date set — dashboard runway shows a placeholder."}
          </p>
          <button type="submit" className="btn-fire" disabled={pending || !dirty}>
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await changePassword({ current, next, confirm });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice("Password changed.");
      setCurrent("");
      setNext("");
      setConfirm("");
    });
  }

  return (
    <section>
      <h2 className="label mb-3">Password</h2>
      <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-5">
        <PasswordField
          label="Current password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          autoComplete="current-password"
        />
        <PasswordField
          label="New password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          placeholder="At least 12 characters"
          required
          minLength={12}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />

        {error && <p className="font-body text-fire text-sm">{error}</p>}
        {notice && <p className="font-body text-alive text-sm">{notice}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-fire"
            disabled={pending || !current || !next || !confirm}
          >
            {pending ? "Changing…" : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}

function formatLong(iso: string): string {
  // Treat the YYYY-MM-DD string as a local date — Date(iso) would treat it as
  // UTC midnight which can flip to the previous day in negative-offset zones.
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
