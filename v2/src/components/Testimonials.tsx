import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Content } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Testimonials({ t }: { t: Content }) {
  const [active, setActive] = useState(0);
  const total = t.testimonials.items.length;

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % total), 7000);
    return () => clearInterval(id);
  }, [total]);

  const item = t.testimonials.items[active];

  return (
    <section className="container-x py-[120px]">
      <SectionHead eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} lead={t.testimonials.lead} />

      <div className="bg-white border border-line rounded-2xl p-10 md:p-14 lg:p-16 shadow-soft min-h-[360px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-[900px]"
          >
            <span className="font-display text-[72px] leading-none text-accent select-none block mb-2">"</span>
            <p className="font-display text-[clamp(20px,2.4vw,32px)] text-ink leading-[1.4] tracking-[-0.01em] mb-9">{item.quote}</p>
            <footer>
              <div className="font-medium text-[15px] text-ink">{item.name}</div>
              <div className="font-mono text-[11.5px] text-ink-faint tracking-wider uppercase mt-0.5">{item.role}</div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-10 mt-10 border-t border-line">
          <div className="flex gap-2">
            {t.testimonials.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Depoimento ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-9 bg-accent" : "w-1.5 bg-line-mid hover:bg-ink-mute"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActive((a) => (a - 1 + total) % total)}
              className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-ink-1 hover:bg-bg-soft transition-colors"
              aria-label="Anterior"
            >←</button>
            <button
              onClick={() => setActive((a) => (a + 1) % total)}
              className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-ink-1 hover:bg-bg-soft transition-colors"
              aria-label="Próximo"
            >→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
