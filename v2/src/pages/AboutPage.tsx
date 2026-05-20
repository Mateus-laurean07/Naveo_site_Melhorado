import { Content } from "@/content/types";
import { Layout, PageHero } from "@/components/Layout";
import { motion } from "framer-motion";

export function AboutPage({ t, lang }: { t: Content; lang: string }) {
  return (
    <Layout t={t} lang={lang}>
      <PageHero
        eyebrow="Quem somos"
        title="Naveo, do latim navigare — navegar, guiar."
        sub="A gente não vende consultoria de PowerPoint. Entra no barco, rema junto e fica sustentando depois."
      />

      <section className="container-x py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-display font-medium text-ink tracking-[-0.022em] leading-[1.1] text-[clamp(28px,3.5vw,46px)] mb-6">
              Builder de Engenharia Criativa, com base no <span className="italic text-accent">Mato Grosso</span>.
            </h2>
            <div className="text-ink-dim text-[16px] leading-[1.65] space-y-5 max-w-prose">
              <p>
                A Naveo é uma empresa que desenvolve tecnologia e novos negócios. Trabalhamos com sistemas sob medida, IA aplicada, integrações fintech, marketplaces e plataformas — sempre construindo o produto digital que o negócio precisa pra parar de empurrar papel, planilha ou processo manual.
              </p>
              <p>
                Não somos software house de hora-trabalhada. Não somos consultoria. Somos Builder: investigamos a operação, desenhamos um MVP em dias, validamos com você, construímos por etapas e ficamos sustentando depois.
              </p>
              <p>
                Antes de oferecer pra cliente, aplicamos o método primeiro nos nossos negócios — 12 empresas próprias até hoje, 4 bancos digitais criados, 8+ setores atendidos.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 glass rounded-3xl overflow-hidden">
            {[
              { label: "Sede", value: "Lucas do Rio Verde · MT · Brasil" },
              { label: "Sócios", value: "Jonathan Tebaldi · Vitor Righi" },
              { label: "Equipe", value: "100% interna · sem terceirização" },
              { label: "Empresas criadas", value: "12 próprias · 8+ setores" },
              { label: "Anos no jogo", value: "Empreendedores há mais de uma década" },
            ].map((row, i) => (
              <div key={i} className="p-5 px-6 border-b border-line last:border-b-0">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint mb-1">{row.label}</div>
                <div className="text-[14.5px] text-ink">{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24 border-t border-line">
        <div className="max-w-[820px] mb-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-2 mb-4 inline-block">O time</span>
          <h2 className="font-display font-medium text-ink tracking-[-0.022em] leading-[1.05] text-[clamp(28px,4vw,52px)]">
            Engenheiros que projetaram <span className="gradient-text">satélites</span>. Empreendedores que já venderam empresa.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              name: "Jonathan Tebaldi",
              role: "Sócio fundador · Engenharia & Produto",
              bio: "Fundador. Lidera a operação, a relação com cliente e a engenharia. Já criou, escalou e operou negócios em 8+ setores.",
            },
            {
              name: "Vitor Righi",
              role: "Sócio · Estratégia & Negócios",
              bio: "Sócio fundador. Atua na estratégia comercial, modelagem de negócio e relacionamento com parceiros.",
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-10 glow-border"
            >
              <div className="w-16 h-16 rounded-full grid place-items-center font-display text-xl text-white mb-5"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
                {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-display text-[22px] font-medium tracking-[-0.014em] text-ink">{p.name}</h3>
              <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-faint mt-1 mb-3">{p.role}</div>
              <p className="text-ink-dim text-[14px] leading-[1.55]">{p.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.02] border-y border-line py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)" }} />
        <div className="container-narrow text-center relative">
          <p className="font-display font-medium text-ink tracking-[-0.03em] leading-[1.1] text-[clamp(28px,4.5vw,60px)]">
            “Não vendemos hora. <span className="gradient-text font-medium">Construímos a operação.</span>”
          </p>
          <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-faint mt-7">
            Manifesto · Naveo Engenharia Criativa
          </div>
        </div>
      </section>
    </Layout>
  );
}
