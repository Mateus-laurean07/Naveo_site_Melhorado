import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Portfolio({ t }: { t: Content }) {
  return (
    <section id="portfolio" className="container-x py-[140px]">
      <SectionHead eyebrow={t.portfolio.eyebrow} title={t.portfolio.title} lead={t.portfolio.lead} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {t.portfolio.heroes.map((p, i) => (
          <motion.a
            key={i}
            href={p.url}
            target={p.url === "#" ? undefined : "_blank"}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
            className="group relative aspect-[4/3] rounded-[20px] overflow-hidden border border-line lift hover:border-accent/40"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
              style={{ backgroundImage: `url('${p.img}')`, filter: "saturate(0.7) brightness(0.65)" }}
            />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.9) 100%)" }} />

            <div className="absolute top-6 right-6 w-11 h-11 grid place-items-center rounded-full bg-ink/10 backdrop-blur-md border border-line-mid text-ink group-hover:bg-accent group-hover:text-bg group-hover:border-accent transition-all">
              →
            </div>

            <div className="absolute bottom-0 inset-x-0 p-8 z-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-2">{p.tag}</div>
              <h3 className="font-display text-[clamp(26px,3vw,36px)] font-medium tracking-[-0.018em] leading-tight text-ink">{p.name}</h3>
              <p className="text-ink/70 text-[13.5px] mt-2 max-w-[380px]">{p.desc}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {t.portfolio.mini.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
            className="bg-bg-card border border-line rounded-2xl px-5 py-5 hover:border-line-strong hover:bg-bg-elev transition-all"
          >
            <div className="font-medium text-[15px] tracking-[-0.01em] text-ink mb-1">{p.name}</div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-mute">{p.tag}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
