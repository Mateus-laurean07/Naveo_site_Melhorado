import { Content, IMG } from "@/content/types";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

export interface ProductData {
  slug: string;
  brand: string;
  url: string;
  status: "live" | "soon";
  category: string;
  hero: { title: string; sub: string };
  what: string;
  who: string;
  features: { title: string; desc: string }[];
  pricing?: { tier: string; price: string; features: string[] }[];
  hero_image: string;
  cta: { primary: string; secondary?: string };
}

export const PRODUCTS: Record<string, ProductData> = {
  agrodesapego: {
    slug: "agrodesapego",
    brand: "Agrodesapego",
    url: "https://agrodesapego.com.br",
    status: "live",
    category: "Marketplace · IA · Agro",
    hero: {
      title: "CRM e marketplace de máquinas agrícolas usadas com IA negociadora.",
      sub: "A IA do Agrodesapego conversa com comprador e vendedor no WhatsApp, traduz áudio em proposta, qualifica lead e dispara fotos automaticamente. Revenda vira rede.",
    },
    what: "Plataforma de venda de máquinas agrícolas usadas e novas. Revendedor cadastra estoque, recebe propostas, e uma IA negocia com o lead via WhatsApp 24/7. Vendedor abre direto na máquina certa, comprador recebe sugestões automáticas.",
    who: "Revendas de máquinas agrícolas, concessionárias multimarcas, vendedores autônomos do agro.",
    features: [
      { title: "Site da revenda", desc: "Cada revendedor ganha um site próprio com seu estoque, propostas filtradas e identidade." },
      { title: "IA negociadora no WhatsApp", desc: "A IA recebe áudio do lead, interpreta, busca no catálogo e responde com propostas certas." },
      { title: "CRM integrado", desc: "Todas as conversas viram lead. Cada lead tem ficha, histórico e status." },
      { title: "Catálogo inteligente", desc: "Cadastro de estoque com cruzamento por especificação técnica e disponibilidade." },
      { title: "Match automático", desc: "Quando entra uma máquina nova, o sistema avisa leads anteriores que pediram algo similar." },
      { title: "Anti-cabra-cega", desc: "Lead pede 'colheitadeira pra 1.200ha de soja' e a IA já sugere o modelo certo do estoque." },
    ],
    hero_image: IMG.agro,
    cta: { primary: "Acessar Agrodesapego", secondary: "Falar com a Naveo" },
  },
  cruzetaclub: {
    slug: "cruzetaclub",
    brand: "Cruzeta Club",
    url: "https://cruzetaclub.com.br",
    status: "live",
    category: "Comunidade · SaaS",
    hero: {
      title: "A plataforma de gestão para clubes de carros do Brasil.",
      sub: "Encontros, membros, anuidade, mídia, conteúdo e comunicação — tudo em um só lugar. Pensado por quem é apaixonado por carro.",
    },
    what: "SaaS de gestão completo para clubes de carros: cadastro de membros, controle de anuidade, agenda de encontros e eventos, galeria de fotos, comunicação interna e site público do clube.",
    who: "Clubes de carros (antigos, esportivos, off-road, customizados), comunidades automotivas, organizadores de encontros.",
    features: [
      { title: "Gestão de membros", desc: "Cadastro completo dos membros com carro, contato e histórico de eventos." },
      { title: "Anuidade automatizada", desc: "Cobrança recorrente integrada, lembretes automáticos, controle de inadimplência." },
      { title: "Agenda de encontros", desc: "Crie encontros, controle confirmações, mande lembretes pelo WhatsApp." },
      { title: "Galeria de mídia", desc: "Fotos e vídeos dos encontros organizados por evento e por membro." },
      { title: "Site público do clube", desc: "Cada clube tem um site próprio com sua identidade visual." },
      { title: "Comunicação integrada", desc: "Avisos por e-mail e WhatsApp pra toda a base ou pra grupos específicos." },
    ],
    hero_image: IMG.cruzeta,
    cta: { primary: "Acessar Cruzeta Club", secondary: "Falar com a Naveo" },
  },
  navbarber: {
    slug: "navbarber",
    brand: "NavBarber",
    url: "https://navbarber.com.br",
    status: "live",
    category: "SaaS Vertical · Barbearia",
    hero: {
      title: "Pare de perder cliente no WhatsApp. Sua agenda lotada todo dia — sem responder um único 'oi'.",
      sub: "A IA do NavBarber agenda, lembra, cobra e fideliza pelo seu próprio WhatsApp. 24/7, sem API paga.",
    },
    what: "Sistema completo de gestão de barbearia com IA integrada ao WhatsApp. Agendamento automático, lembretes, cobrança, comissão por serviço, DRE em tempo real, multi-unidade e CRM com automações de retenção.",
    who: "Donos de barbearia — do single shop à rede / franquia.",
    features: [
      { title: "IA no WhatsApp próprio", desc: "Sem API paga. A IA usa seu próprio número e responde como você responderia." },
      { title: "Agendamento automático", desc: "A IA consulta a agenda real e fecha horário direto na conversa." },
      { title: "Lembretes 1h + 24h", desc: "Reduz no-show. Lembrete configurável, cancelamento e remarcação automáticos." },
      { title: "DRE em tempo real", desc: "Receita, comissões, custos e lucro — atualização contínua com insights." },
      { title: "Comissão automática", desc: "Por serviço e por produto. Profissional vê só o que é dele." },
      { title: "Multi-unidade", desc: "Gestão consolidada de várias barbearias com permissões por papel." },
      { title: "PWA + Estoque + PDV", desc: "Apps separados pro dono e pro profissional. PDV integrado com estoque." },
      { title: "Assinaturas recorrentes", desc: "Plano de cliente fiel com cobrança automática mensal." },
    ],
    pricing: [
      { tier: "Starter", price: "R$ 199/mês", features: ["1 unidade", "2 profissionais", "IA completa", "Suporte WhatsApp"] },
      { tier: "Pro", price: "R$ 399/mês", features: ["2 unidades", "6 profissionais", "Tudo do Starter", "Relatórios avançados"] },
      { tier: "Enterprise", price: "R$ 599/mês", features: ["3 unidades", "20 profissionais", "Tudo do Pro", "Account manager"] },
    ],
    hero_image: IMG.navbarber,
    cta: { primary: "Começar agora", secondary: "Falar com a Naveo" },
  },
  pharmagenius: {
    slug: "pharmagenius",
    brand: "Pharma Genius",
    url: "#",
    status: "soon",
    category: "Healthtech · SaaS",
    hero: {
      title: "Plataforma farmacêutica em desenvolvimento.",
      sub: "Em breve. Pharma Genius está sendo construída agora. Cadastre-se para acompanhar o lançamento.",
    },
    what: "Plataforma farmacêutica em desenvolvimento pela Naveo. Detalhes serão divulgados no lançamento.",
    who: "Farmácias, redes farmacêuticas e profissionais da área de saúde.",
    features: [
      { title: "Em construção", desc: "A equipe Naveo está trabalhando no produto neste momento." },
      { title: "Skin in the game", desc: "Como em todos os negócios próprios, testamos primeiro na nossa operação." },
      { title: "Lançamento próximo", desc: "Cadastre-se para receber novidades em primeira mão." },
    ],
    hero_image: IMG.pharma,
    cta: { primary: "Avise-me no lançamento", secondary: "Conhecer a Naveo" },
  },
};

export function ProductPage({ t, lang, slug }: { t: Content; lang: string; slug: string }) {
  const p = PRODUCTS[slug];
  if (!p) return <Layout t={t} lang={lang}><div className="container-x py-20">Produto não encontrado.</div></Layout>;

  const isLive = p.status === "live";

  return (
    <Layout t={t} lang={lang}>
      <section className="relative border-b border-line overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" />
        </div>

        <div className="container-x relative z-10 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent mb-4">{p.category}</div>
            <div className="flex items-center gap-3 mb-5">
              <h1 className="font-display font-medium text-ink tracking-[-0.02em] text-[clamp(28px,4vw,52px)] leading-[1.0]">{p.brand}</h1>
              <span className={`font-mono text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${isLive ? "bg-accent/12 text-accent" : "bg-ink/8 text-ink-dim"}`}>
                {isLive ? "● ATIVO" : "EM BREVE"}
              </span>
            </div>
            <h2 className="font-display font-medium text-ink tracking-[-0.022em] leading-[1.1] text-[clamp(24px,3.2vw,42px)] mb-6 max-w-[820px]">
              {p.hero.title}
            </h2>
            <p className="text-ink-dim text-[clamp(15px,1.2vw,18px)] leading-[1.55] max-w-[620px] mb-9">{p.hero.sub}</p>

            <div className="flex flex-wrap gap-3">
              {isLive && (
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-medium text-white overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
                  <span className="relative z-10 flex items-center gap-2">{p.cta.primary} <span className="transition-transform group-hover:translate-x-1">↗</span></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #a855f7 0%, #f472b6 100%)" }} />
                </a>
              )}
              <a href={lang === "pt" ? "/contato" : `/${lang}/${lang === "en" ? "contact" : "contacto"}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-ink rounded-full text-[14px] font-medium border border-line-mid hover:border-line-strong hover:bg-white/5 transition-colors">
                {p.cta.secondary ?? "Falar com a Naveo"} →
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-strong shadow-[0_24px_80px_rgba(124,58,237,0.25)] relative">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${p.hero_image}')`, filter: "saturate(1.1) brightness(0.85)" }} />
              <div className="absolute inset-0 mix-blend-overlay"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), transparent 60%)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-x py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h3 className="font-display text-[28px] font-medium text-ink mb-5">O que é</h3>
          <p className="text-ink-dim text-[16px] leading-[1.65] max-w-prose">{p.what}</p>
        </div>
        <div className="lg:col-span-5">
          <h3 className="font-display text-[28px] font-medium text-ink mb-5">Pra quem</h3>
          <p className="text-ink-dim text-[16px] leading-[1.65]">{p.who}</p>
        </div>
      </section>

      <section className="bg-white/[0.02] border-y border-line py-24 relative overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)" }} />
        <div className="container-x relative">
          <h3 className="font-display font-medium text-ink tracking-[-0.02em] text-[clamp(28px,4vw,48px)] leading-[1.1] mb-12 max-w-[760px]">
            O que <span className="gradient-text">tem dentro</span>.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-7 hover:bg-white/[0.04] transition-colors glow-border">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] gradient-text-static font-semibold mb-3">FEAT {String(i + 1).padStart(2, "0")}</div>
                <h4 className="font-display text-[19px] font-medium text-ink mb-2">{f.title}</h4>
                <p className="text-ink-dim text-[13.5px] leading-[1.55]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {p.pricing && (
        <section className="container-x py-24">
          <h3 className="font-display font-medium text-ink tracking-[-0.02em] text-[clamp(28px,4vw,48px)] leading-[1.1] mb-12 max-w-[760px]">
            <span className="gradient-text">Pricing</span> direto, sem letra miúda.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {p.pricing.map((tier, i) => {
              const featured = i === 1;
              return (
                <div key={i} className={`rounded-3xl p-8 relative overflow-hidden ${featured ? "text-white" : "glass glow-border"}`}
                  style={featured ? { background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" } : undefined}>
                  {featured && <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[10px] font-mono uppercase tracking-wider">Popular</div>}
                  <div className={`font-mono text-[11px] uppercase tracking-[0.12em] mb-3 ${featured ? "text-white/80" : "text-ink-faint"}`}>{tier.tier}</div>
                  <div className={`font-display text-[36px] font-medium tracking-[-0.022em] mb-6 ${featured ? "text-white" : "text-ink"}`}>{tier.price}</div>
                  <ul className="space-y-2.5 text-[14px]">
                    {tier.features.map((f, k) => (
                      <li key={k} className={`flex items-start gap-2 ${featured ? "text-white/90" : "text-ink-dim"}`}>
                        <span className={featured ? "text-white" : "text-accent-2"}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="py-24 border-t border-line relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18), transparent 65%)" }} />
        <div className="container-narrow text-center relative">
          <h3 className="font-display font-medium text-ink tracking-[-0.025em] text-[clamp(28px,4.5vw,52px)] leading-[1.05] mb-7">
            Quer um produto digital <span className="gradient-text">assim</span> pro seu negócio?
          </h3>
          <p className="text-ink-dim text-[16px] leading-[1.6] max-w-[560px] mx-auto mb-9">
            {p.brand} é um dos negócios próprios da Naveo. Aplicamos o mesmo método pra construir o que sua operação precisa.
          </p>
          <a href={lang === "pt" ? "/contato" : `/${lang}/${lang === "en" ? "contact" : "contacto"}`}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-[14.5px] font-medium text-white overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
            <span className="relative z-10 flex items-center gap-2">Agendar diagnóstico <span className="transition-transform group-hover:translate-x-1">→</span></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #a855f7 0%, #f472b6 100%)" }} />
          </a>
        </div>
      </section>
    </Layout>
  );
}
