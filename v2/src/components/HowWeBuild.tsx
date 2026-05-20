import { motion } from "framer-motion";

interface Step { num: string; title: string; line: string; }

export function HowWeBuild({ title, lead, steps, cta }: { title: string; lead: string; steps: Step[]; cta?: { label: string; href: string } }) {
  return (
    <section className="py-[120px] bg-bg-soft border-y border-line">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">Como construímos</div>
            <h2 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.08] text-[clamp(32px,4.5vw,58px)] mb-5 text-balance">
              {title.split(/(\*[^*]+\*)/g).map((p, i) =>
                p.startsWith("*") && p.endsWith("*") ? <span key={i} className="text-accent">{p.slice(1, -1)}</span> : <span key={i}>{p}</span>
              )}
            </h2>
            <p className="text-ink-dim text-[16px] leading-[1.6] max-w-[480px] mb-7">{lead}</p>
            {cta && (
              <a href={cta.href} className="inline-flex items-center gap-2 text-accent text-[14.5px] font-medium hover:text-accent-hover transition-colors group">
                {cta.label} <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-7">
            <ol className="relative border-l border-line">
              {steps.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-8 pb-10 last:pb-0 group"
                >
                  <span className="absolute left-[-7px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-line-mid group-hover:border-accent transition-colors" />
                  <span className="absolute left-[-3px] top-[10px] w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[12px] text-accent tracking-[0.15em] font-medium">{s.num}</span>
                    <h3 className="font-display text-[20px] font-semibold text-ink tracking-[-0.012em]">{s.title}</h3>
                  </div>
                  <p className="text-ink-dim text-[14.5px] leading-[1.55] max-w-[540px]">{s.line}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
