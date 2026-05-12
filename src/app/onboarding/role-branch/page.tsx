"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const COPY: Record<string, { title: string; body: string }> = {
  team_member: {
    title: "Team Member onboarding is V1+.",
    body: "Your invite code flow lives behind a planter invitation. In Session 1, this branch is acknowledged but not provisioned. Your planter will invite you directly once their workspace is live.",
  },
  network_admin: {
    title: "Network Admin onboarding is V1+.",
    body: "Network provisioning (org name, region, invite roster) is built in a later session. Your access is read-only by design — you’ll see planter progress without touching their work.",
  },
};

export default function RoleBranch() {
  return (
    <Suspense fallback={null}>
      <RoleBranchInner />
    </Suspense>
  );
}

function RoleBranchInner() {
  const params = useSearchParams();
  const key = params.get("role") || "team_member";
  const c = COPY[key] ?? COPY.team_member;
  return (
    <div className="flex flex-col gap-8">
      <h1 className="display text-4xl">{c.title}</h1>
      <p className="font-body text-smoke">{c.body}</p>
      <div className="flex gap-3">
        <Link href="/onboarding/role" className="btn-ghost">
          ← Back to role
        </Link>
        <form action="/auth/sign-out" method="post">
          <button className="btn-ghost">Save &amp; exit</button>
        </form>
      </div>
    </div>
  );
}
