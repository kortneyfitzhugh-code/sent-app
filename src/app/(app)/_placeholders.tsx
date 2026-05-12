// Shared placeholder for routes wired in later sessions.
// `session` labels when this surface comes online so the nav doesn't read as broken.
export function Placeholder({
  title,
  body,
  session,
}: {
  title: string;
  body: string;
  session: "Session 2" | "Session 3" | "Session 4";
}) {
  return (
    <div className="p-6 md:p-10 flex flex-col gap-4 max-w-xl">
      <p className="label text-fire">{session} · Placeholder shell</p>
      <h1 className="display text-4xl md:text-5xl leading-tight">{title}</h1>
      <p className="font-body text-smoke">{body}</p>
      <p className="font-body text-smoke text-sm border-t border-cinder pt-4 mt-2">
        Navigation is intentional — this route exists so the nav never 404s. The full
        surface ships in {session}.
      </p>
    </div>
  );
}
