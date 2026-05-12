"use client";

import { useState } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function PasswordField({ label, ...inputProps }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="flex flex-col gap-2">
      <span className="label">{label}</span>
      <div className="relative">
        <input
          {...inputProps}
          type={visible ? "text" : "password"}
          className="input-shell pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 px-3 grid place-items-center text-smoke hover:text-bone transition-colors"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </label>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3.3 4.1M6.5 6.5C3.6 8.3 2 12 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4.4-.9" />
      <path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
