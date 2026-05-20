import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { Layout } from "@/components/Layout";

export function ThanksPage({ t, lang }: { t: Content; lang: string }) {
  const L = labels[lang as keyof typeof labels] ?? labels.pt;
  return (
    <Layout t={t} lang={lang}>
      <section className="min-h-[80vh] flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container-narrow text-center"
        >
          <div className="inline-grid place-items-center w-20 h-20 rounded-full text-white text-3xl mb-10"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)", boxShadow: "0 8px 40px rgba(124,58,237,0.4)" }}>✓</div>
          <h1 className="font-display font-medium text-ink tracking-[-0.03em] leading-[1.0] text-[clamp(40px,6vw,84px)] mb-6">
            {L.title}
          </h1>
          <p className="text-ink-dim text-[clamp(15px,1.3vw,19px)] max-w-[580px] mx-auto leading-[1.6] mb-9">
            {L.sub}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={lang === "pt" ? "/" : `/${lang}`} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-medium text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
              {L.home}
            </a>
            <a href={lang === "pt" ? "/portfolio" : `/${lang}/portfolio`} className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-ink rounded-full text-[14px] font-medium border border-line-mid hover:border-line-strong hover:bg-white/5 transition-colors">
              {L.portfolio} →
            </a>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}

const labels = {
  pt: { title: "Recebemos. Bora conversar.", sub: "Em até 4h úteis você recebe um retorno no WhatsApp. Em até 5 dias úteis devolvemos um diagnóstico estruturado do seu cenário.", home: "Voltar pra home", portfolio: "Conhecer o portfólio" },
  en: { title: "Got it. Let's talk.", sub: "Within 4 business hours you'll hear from us on WhatsApp. Within 5 business days we'll return a structured diagnosis of your scenario.", home: "Back home", portfolio: "See our portfolio" },
  es: { title: "Recibido. Hablemos.", sub: "En hasta 4h hábiles recibes una respuesta en WhatsApp. En hasta 5 días hábiles devolvemos un diagnóstico estructurado de tu escenario.", home: "Volver al inicio", portfolio: "Ver portafolio" },
};
