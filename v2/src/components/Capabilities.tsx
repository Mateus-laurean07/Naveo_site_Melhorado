import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { SectionHead } from "./SectionHead";

// Imagens cinematográficas para cada capacidade (Unsplash)
const CAP_IMAGES: Record<string, string> = {
  "</>": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",  // dev workstation
  "⌬":  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",   // tech display
  "∞":  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",   // automation
  "◈":  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80", // AI / abstract
  "$":  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80", // fintech
  "⚡": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80", // analytics dashboards
};

export function Capabilities({ t }: { t: Content }) {
  return (
    <section className="container-x py-[120px]">
      <SectionHead eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} lead={t.capabilities.lead} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {t.capabilities.items.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
            className="bg-white border border-line rounded-xl overflow-hidden lift hover:shadow-card group"
          >
            <div className="aspect-[16/10] overflow-hidden bg-bg-soft">
              <div className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                style={{ backgroundImage: `url('${CAP_IMAGES[c.icon] || CAP_IMAGES["</>"]}')` }}
              />
            </div>
            <div className="p-7 px-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="font-display text-[20px] font-semibold tracking-[-0.014em] leading-[1.2] text-ink mb-2.5">{c.title}</h3>
              <p className="text-ink-dim text-[14px] leading-[1.55]">{c.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
