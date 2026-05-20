import { motion } from "framer-motion";
import { Content } from "@/content/types";

export function Manifesto({ t }: { t: Content }) {
  return (
    <section id="sobre" className="py-[140px] text-center bg-white border-b border-line">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="container-narrow"
      >
        <p className="font-display font-semibold text-ink tracking-[-0.03em] leading-[1.05] text-[clamp(32px,5.5vw,72px)] max-w-[1100px] mx-auto text-balance">
          {t.manifesto.quote.split(/(Construímos|We build|Construimos)/i).map((part, i) =>
            /Construímos|We build|Construimos/i.test(part)
              ? <span key={i} className="text-accent">{part}</span>
              : <span key={i}>{part}</span>
          )}
        </p>
        <div className="mt-9 font-mono text-[12.5px] uppercase tracking-[0.16em] text-ink-faint">{t.manifesto.attr}</div>
      </motion.div>
    </section>
  );
}
