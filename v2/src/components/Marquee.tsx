import { Content } from "@/content/types";

export function Marquee({ t }: { t: Content }) {
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="overflow-hidden py-7 border-y border-line bg-white">
      <div className="marquee-row">
        {items.map((it, i) => (
          <span key={i} className="font-display text-[clamp(24px,3vw,42px)] font-semibold inline-flex items-center gap-7 text-ink-mute">
            {it}
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
