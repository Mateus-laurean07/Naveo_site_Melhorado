import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Method({ t }: { t: Content }) {
  return (
    <section id="metodo" className="py-[140px] bg-bg-1 border-y border-line">
      <div className="container-x">
        <SectionHead eyebrow={t.method.eyebrow} title={t.method.title} lead={t.method.lead} />
      </div>

      <div className="overflow-x-auto pb-6 [scrollbar-color:#2a2a2f_transparent] [scrollbar-width:thin]">
        <div className="flex gap-5 px-8 lg:px-[max(2rem,calc((100vw-1440px)/2+2rem))] pr-16">
          {t.method.steps.map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              className="shrink-0 w-[420px] h-[500px] bg-bg-card border border-line rounded-[20px] p-9 flex flex-col justify-between hover:border-line-strong lift"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="font-mono text-[12px] text-accent tracking-[0.18em] font-medium">{s.num}</div>
                  <div className="font-mono text-[10.5px] text-ink-mute uppercase tracking-[0.14em]">Step</div>
                </div>
                <h3 className="font-display text-[28px] font-medium tracking-[-0.02em] leading-[1.1] text-ink mb-4">{s.title}</h3>
                <p className="text-ink-dim text-[15px] leading-[1.55]">{s.desc}</p>
              </div>
              <ul className="space-y-2.5">
                {s.list.map((li, j) => (
                  <li key={j} className="text-[12.5px] text-ink-dim relative pl-5 font-mono">
                    <span className="absolute left-0 text-accent">→</span>{li}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
