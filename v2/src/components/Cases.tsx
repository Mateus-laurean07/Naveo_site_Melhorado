import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Cases({ t }: { t: Content }) {
  return (
    <section id="cases" className="container-x py-[140px]">
      <SectionHead eyebrow={t.cases.eyebrow} title={t.cases.title} lead={t.cases.lead} />
      <div className="space-y-[120px]">
        {t.cases.items.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
          >
            <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
              <div className="aspect-[16/10] rounded-[20px] overflow-hidden border border-line bg-bg-card relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${c.img}')`, filter: "saturate(0.9) contrast(1.05)" }}
                />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 40%, rgba(10,10,11,0.4) 100%)" }} />
              </div>
            </div>
            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4">{c.tag}</div>
              <h3 className="font-display text-[clamp(28px,3.5vw,48px)] font-medium tracking-[-0.022em] leading-[1.05] text-ink mb-5">{c.title}</h3>
              <p className="text-ink-dim text-[16px] leading-[1.6] mb-6">{c.desc}</p>
              <div className="border-l border-accent pl-5 py-1 mb-7 text-[14.5px] text-ink/85 italic">{c.quote}</div>
              <div className="flex flex-wrap gap-7 pt-6 border-t border-line">
                {c.metrics.map((m, j) => (
                  <div key={j}>
                    <strong className="block font-display text-[28px] font-medium text-ink tracking-[-0.02em]">{m.v}</strong>
                    <span className="font-mono text-[11px] text-ink-mute tracking-wider uppercase">{m.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
