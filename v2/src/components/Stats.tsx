import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Content } from "@/content/types";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
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

export function Stats({ t }: { t: Content }) {
  return (
    <section className="bg-bg-soft border-y border-line py-[100px]">
      <div className="container-x">
        <div className="max-w-[760px] mb-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5">
            <span className="inline-block w-6 h-px bg-accent" /> {t.stats.eyebrow}
          </div>
          <h2 className="font-display font-semibold text-ink tracking-[-0.02em] leading-[1.1] text-[clamp(28px,4vw,52px)] mb-3">{t.stats.title}</h2>
          <p className="text-ink-dim text-[15.5px] leading-[1.6] max-w-prose">{t.stats.lead}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line border-t border-line">
          {t.stats.items.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="py-10 px-2 sm:px-6 first:pl-0"
            >
              <div className="font-display font-semibold text-ink tracking-[-0.035em] leading-[0.95] text-[clamp(48px,6vw,80px)] mb-3">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-ink-dim text-[13.5px] leading-snug max-w-[200px]">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
