import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { Layout, PageHero } from "@/components/Layout";

const ALL_VENTURES = [
  { name: "Agrodesapego", tag: "Marketplace · IA · Agro", desc: "CRM e marketplace de máquinas agrícolas usadas com IA negociadora via WhatsApp.", url: "https://agrodesapego.com.br", status: "Ativo" },
  { name: "Cruzeta Club", tag: "Comunidade · SaaS", desc: "Plataforma de gestão para clubes de carros — encontros, membros, conteúdo, mídia.", url: "https://cruzetaclub.com.br", status: "Ativo" },
  { name: "Navbarber", tag: "SaaS Vertical · Barbearia", desc: "IA no WhatsApp que agenda, cobra e fideliza. DRE em tempo real, multi-unidade.", url: "https://navbarber.com.br", status: "Ativo" },
  { name: "Pharma Genius", tag: "Healthtech · SaaS", desc: "Plataforma farmacêutica em desenvolvimento. Lançamento próximo.", url: "#", status: "Em breve" },
  { name: "Criativando", tag: "Plataforma Criativa", desc: "Soluções de criatividade aplicada para empresas.", url: "#", status: "Ativo" },
  { name: "Farol Entidades", tag: "Gestão · Associações", desc: "Software para gestão de entidades e associações.", url: "#", status: "Ativo" },
  { name: "uRocket", tag: "Fintech · Pagamentos", desc: "Soluções de pagamento e infraestrutura financeira.", url: "#", status: "Ativo" },
  { name: "automapost", tag: "Automação · Social", desc: "Automação de presença digital para empresas locais.", url: "#", status: "Ativo" },
  { name: "talk", tag: "SaaS · Comunicação", desc: "Plataforma de comunicação corporativa simplificada.", url: "#", status: "Ativo" },
  { name: "VaiPedindo", tag: "Fintech · Marketplace", desc: "Plataforma de pedidos com integração de pagamento.", url: "#", status: "Ativo" },
  { name: "eventeu", tag: "Plataforma · Eventos", desc: "Gestão de eventos do briefing ao check-in.", url: "#", status: "Ativo" },
  { name: "obafestinha", tag: "Plataforma · Eventos", desc: "Plataforma para festas e celebrações privadas.", url: "https://obafestinha.com.br", status: "Ativo" },
];

export function PortfolioPage({ t, lang }: { t: Content; lang: string }) {
  return (
    <Layout t={t} lang={lang}>
      <PageHero
        eyebrow="Portfólio Naveo"
        title="12 empresas próprias. Skin in the game de verdade."
        sub="Antes de oferecer pra cliente, construímos pra nós. Cada negócio próprio é um laboratório vivo do método de Engenharia Criativa."
      />

      <section className="container-x py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_VENTURES.map((v, i) => (
            <motion.a
              key={i}
              href={v.url}
              target={v.url === "#" ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className="group glass rounded-2xl p-7 glow-border hover:-translate-y-1 transition-all flex flex-col gap-3 spotlight"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint">{v.tag}</div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${v.status === "Ativo" ? "bg-accent/15 text-accent-2" : "bg-white/5 text-ink-faint"}`}>{v.status}</span>
              </div>
              <h3 className="font-display text-[26px] font-medium tracking-[-0.014em] text-ink">{v.name}</h3>
              <p className="text-ink-dim text-[13.5px] leading-[1.55]">{v.desc}</p>
              {v.url !== "#" && (
                <div className="mt-auto pt-3 text-[12.5px] font-mono gradient-text-static font-semibold">Visitar ↗</div>
              )}
            </motion.a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
