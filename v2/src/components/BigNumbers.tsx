import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface NumItem { value: number; label: string; suffix?: string; ctx?: string; }

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix && <span className="text-accent">{suffix}</span>}</span>;
}

export function BigNumbers({ eyebrow, title, items }: { eyebrow: string; title: string; items: NumItem[] }) {
  return (
    <section className="container-x py-[120px]">
      <div className="max-w-[820px] mb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5">
          <span className="inline-block w-6 h-px bg-accent" />{eyebrow}
        </div>
        <h2 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.08] text-[clamp(32px,4.5vw,60px)] text-balance">
          {title.split(/(\*[^*]+\*)/g).map((p, i) =>
            p.startsWith("*") && p.endsWith("*") ? <span key={i} className="text-accent">{p.slice(1, -1)}</span> : <span key={i}>{p}</span>
          )}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {items.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white p-9 px-7 hover:bg-bg-soft transition-colors"
          >
            <div className="font-display font-semibold text-ink tracking-[-0.04em] leading-[0.9] text-[clamp(60px,8vw,124px)] mb-3">
              <Counter target={n.value} suffix={n.suffix} />
            </div>
            <div className="font-display text-[16px] text-ink font-semibold mb-1.5">{n.label}</div>
            {n.ctx && <div className="text-ink-dim text-[13px] leading-[1.55] mt-2">{n.ctx}</div>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
