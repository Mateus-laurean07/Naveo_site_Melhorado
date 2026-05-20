import { Content } from "@/content/types";
import { Layout, PageHero } from "@/components/Layout";
import { motion } from "framer-motion";

export function MethodPage({ t, lang }: { t: Content; lang: string }) {
  return (
    <Layout t={t} lang={lang}>
      <PageHero
        eyebrow="Engenharia Criativa"
        title="O método que transforma dor em produto digital rodando."
        sub="Da primeira conversa ao sistema em produção. Seis passos. Cada um com entregáveis claros."
      />

      <section className="container-x py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-20 gap-x-16">
          {t.method.steps.map((s, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              className="border-t border-line-mid pt-8"
            >
              <div className="font-mono text-[12px] text-accent tracking-[0.15em] mb-4">{s.num}</div>
              <h3 className="font-display text-[clamp(24px,3vw,36px)] font-medium tracking-[-0.018em] text-ink mb-4">{s.title}</h3>
              <p className="text-ink-dim text-[15.5px] leading-[1.6] mb-6 max-w-prose">{s.desc}</p>
              <ul className="space-y-2.5">
                {s.list.map((li, j) => (
                  <li key={j} className="text-[13.5px] text-ink relative pl-5 font-mono">
                    <span className="absolute left-0 text-accent">→</span>{li}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.02] border-y border-line py-24">
        <div className="container-narrow">
          <h2 className="font-display font-medium text-ink tracking-[-0.022em] leading-[1.1] text-[clamp(28px,4vw,52px)] mb-6">
            <span className="gradient-text font-medium">Engenharia Criativa</span> não é metodologia abstrata.
          </h2>
          <p className="text-ink-dim text-[17px] leading-[1.6] max-w-prose mb-5">
            É a forma como a Naveo trabalha desde a primeira conversa até o sistema em produção. Rigor da engenharia somado à liberdade da criatividade — aplicado em cada projeto.
          </p>
          <p className="text-ink-dim text-[17px] leading-[1.6] max-w-prose">
            O cliente chega com uma dor. A gente investiga o contexto, desenha um MVP em dias, apresenta uma visão maior do que ele imaginou, valida com ele, constrói por etapas e fica sustentando depois. Esse é o ciclo.
          </p>
        </div>
      </section>
    </Layout>
  );
}
