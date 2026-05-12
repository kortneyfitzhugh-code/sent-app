export function SentMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const wordmark =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  const tagline =
    size === "lg" ? "text-xs" : size === "sm" ? "text-[10px]" : "text-[11px]";
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className={`wordmark ${wordmark}`}>SENT</span>
        <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-fire" />
      </div>
      <span className={`label ${tagline} mt-1 text-smoke`}>
        Born in prayer. Built for purpose.
      </span>
    </div>
  );
}
