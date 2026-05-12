import Link from "next/link";
import { SentMark } from "@/components/SentMark";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-12">
        <SentMark size="lg" />

        <div className="flex flex-col gap-4">
          <h1 className="display text-5xl md:text-6xl leading-none">
            You were not built
            <br />
            to stay.
          </h1>
          <p className="font-body text-smoke text-sm max-w-sm mx-auto">
            An apostolic companion for the planter, the prophet, and the sent one. Teaching,
            tools, and team — built in.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Link href="/signup" className="btn-fire w-full">
            Create your account
          </Link>
          <Link href="/login" className="btn-ghost w-full">
            Sign in
          </Link>
        </div>

        <p className="label text-smoke">
          Jeremiah 1:10 · Romans 10:15 · Acts 2:1–2
        </p>
      </div>
    </main>
  );
}
