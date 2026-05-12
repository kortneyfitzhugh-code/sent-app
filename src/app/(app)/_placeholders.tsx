// Shared placeholder for routes wired in later sessions.
export function Placeholder({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="p-6 md:p-10 flex flex-col gap-4 max-w-xl">
      <p className="label">Session 2 +</p>
      <h1 className="display text-4xl md:text-5xl leading-tight">{title}</h1>
      <p className="font-body text-smoke">{body}</p>
    </div>
  );
}
