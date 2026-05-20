import { motion } from "framer-motion";
import { Content } from "@/content/types";

const HERO_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=85";

export function Hero({ t }: { t: Content }) {
  const contactHref = t.locale === "pt-BR" ? "/contato" : t.locale === "en" ? "/en/contact" : "/es/contacto";
  const portfolioHref = t.locale === "pt-BR" ? "/portfolio" : t.locale === "en" ? "/en/portfolio" : "/es/portafolio";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Top text block */}
      <div className="container-x pt-[140px] pb-16 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full bg-accent-bg text-accent border border-accent/15"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] font-medium">{t.hero.eyebrow}</span>
        </motion.div>

        <h1 className="font-display font-semibold tracking-[-0.025em] leading-[1.0] text-[clamp(44px,7.5vw,108px)] max-w-[1200px] mb-7 text-ink text-balance">
          {t.hero.headline.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
              className={`inline-block mr-[0.18em] ${w.italic ? "text-accent" : ""}`}
            >
              {w.text}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="text-ink-dim text-[clamp(16px,1.3vw,20px)] leading-[1.55] max-w-[680px] mb-10"
        >
          {t.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href={contactHref}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-accent text-white text-[14.5px] font-medium hover:bg-accent-hover transition-colors group"
          >
            {t.hero.ctaPrimary} <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href={portfolioHref}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-ink text-[14.5px] font-medium border border-line-mid hover:border-ink-1 hover:bg-bg-soft transition-colors"
          >
            {t.hero.ctaSecondary} <span>→</span>
          </a>
        </motion.div>
      </div>

      {/* Cinematic full-width image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
        className="relative w-full h-[60vh] min-h-[420px] max-h-[680px] overflow-hidden"
      >
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.0) 60%, rgba(255,255,255,0.9) 100%)" }} />
      </motion.div>
    </section>
  );
}
