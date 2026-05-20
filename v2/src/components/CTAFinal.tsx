import { motion } from "framer-motion";
import { Content } from "@/content/types";

const CTA_IMAGE = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=85";

export function CTAFinal({ t }: { t: Content }) {
  const contactHref = t.locale === "pt-BR" ? "/contato" : t.locale === "en" ? "/en/contact" : "/es/contacto";
  const btnText = t.locale === "pt-BR" ? "Agendar diagnóstico" : t.locale === "en" ? "Book a diagnosis" : "Agendar diagnóstico";

  return (
    <section className="relative w-full overflow-hidden bg-bg-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('${CTA_IMAGE}')`, filter: "brightness(0.55)" }}
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.7) 60%, rgba(30,84,224,0.45) 100%)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        className="container-x relative z-10 py-[140px] lg:py-[180px] text-center"
      >
        <h2 className="font-display font-semibold tracking-[-0.035em] leading-[0.95] text-[clamp(40px,7vw,108px)] mb-8 text-white text-balance max-w-[1100px] mx-auto">
          {t.ctaFinal.title.split(/(construir|build|Construimos)/i).map((p, i) =>
            /construir|build|Construimos/i.test(p)
              ? <span key={i} style={{ color: "#7aa2ff" }}>{p}</span>
              : <span key={i}>{p}</span>
          )}
        </h2>
        <p className="text-white/75 text-[clamp(16px,1.3vw,19px)] max-w-[600px] mx-auto mb-10">{t.ctaFinal.sub}</p>
        <a
          href={contactHref}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-md bg-accent text-white text-[14.5px] font-medium hover:bg-accent-hover transition-colors group"
        >
          {btnText} <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </motion.div>
    </section>
  );
}
