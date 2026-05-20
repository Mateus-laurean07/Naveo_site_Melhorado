import { Content, IMG } from "@/content/types";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Logos } from "@/components/Logos";
import { Capabilities } from "@/components/Capabilities";
import { FeaturedProduct, FeaturedProductData } from "@/components/FeaturedProduct";
import { Stats } from "@/components/Stats";
import { CaseStory, CaseStoryData } from "@/components/CaseStory";
import { Insights } from "@/components/Insights";
import { Testimonials } from "@/components/Testimonials";
import { Stack } from "@/components/Stack";
import { BigStatement } from "@/components/BigStatement";
import { CTAFinal } from "@/components/CTAFinal";
import { InlineContactForm } from "@/components/InlineContactForm";

export function HomePage({ t, lang }: { t: Content; lang: string }) {
  const products: FeaturedProductData[] = [
    {
      num: "01", brand: "Agrodesapego",
      tagline: "CRM e marketplace de máquinas agrícolas usadas com IA negociadora.",
      desc: "Revenda cadastra estoque. IA conversa com lead via WhatsApp 24/7. Lead pede 'colheitadeira pra 1.200ha de soja' e a IA já sugere o modelo certo do estoque.",
      highlights: ["Site próprio pra cada revenda", "IA negociadora no WhatsApp do cliente", "CRM integrado · todos os leads em ficha", "Match automático entre estoque e desejo"],
      img: IMG.agro, url: "https://agrodesapego.com.br", status: "live", cta: "Acessar Agrodesapego",
    },
    {
      num: "02", brand: "NavBarber",
      tagline: "Pare de perder cliente no WhatsApp. Agenda lotada todo dia — sem responder um 'oi'.",
      desc: "IA no WhatsApp da barbearia agenda, lembra, cobra e fideliza 24/7. DRE em tempo real, multi-unidade, comissão automática.",
      highlights: ["IA no seu WhatsApp · sem API paga", "Agendamento automático com agenda real", "DRE em tempo real · comissão por serviço", "Multi-unidade · PWA · PDV integrado"],
      img: IMG.navbarber, url: "https://navbarber.com.br", status: "live", cta: "Conhecer NavBarber",
    },
    {
      num: "03", brand: "Cruzeta Club",
      tagline: "A plataforma de gestão para clubes de carros do Brasil.",
      desc: "Membros, anuidade, encontros, mídia e comunicação interna em um lugar. Cada clube ganha seu site próprio.",
      highlights: ["Cadastro de membros com carro e histórico", "Anuidade recorrente automática", "Agenda de encontros com WhatsApp", "Site público próprio do clube"],
      img: IMG.cruzeta, url: "https://cruzetaclub.com.br", status: "live", cta: "Acessar Cruzeta Club",
    },
  ];

  const cases: CaseStoryData[] = [
    {
      num: "01", tag: "Plataforma operacional · Multi-unidade", title: "Facilita Higienização",
      desc: "Rede industrial empurrando papel entre unidades. ASOs vencendo sem ninguém ver, risco trabalhista latente. Construímos GED multi-unidade com assinatura jurídica, PWA pros gerentes e dashboard de prazos.",
      quote: "Vocês trouxeram algo que eu não imaginava era possível.",
      attribution: "Diretor · Cliente Facilita",
      metrics: [{ v: "PWA", l: "iPhone, Android, iPad" }, { v: "LGPD", l: "Conformidade total" }, { v: "90d", l: "Da assinatura ao go-live" }],
      img: IMG.facilita,
    },
    {
      num: "02", tag: "ERP Vertical · Construção civil", title: "ObraSimples",
      desc: "Cliente chegou pedindo solução fintech. Identificamos oportunidade maior: ERP/Micro SaaS sob medida pra construção civil. Boletos, PIX, gestão financeira, estoque, orçamentos.",
      quote: "Não precisamos só fazer um sistema — vocês nos mostraram uma nova oportunidade de negócio.",
      attribution: "Thiago Piccini · Fundador",
      metrics: [{ v: "Sob medida", l: "Cliente dono do código" }, { v: "Fintech", l: "PIX + boletos integrados" }, { v: "MRR", l: "Sustentação contínua" }],
      img: IMG.obrasimples,
    },
    {
      num: "03", tag: "Healthcare · do zero", title: "Cuidar Bem Card",
      desc: "Empresa de saúde criada do zero, do modelo de negócio à plataforma. Conceito, desenvolvimento, branding, go-to-market. Engenharia Criativa de ponta a ponta.",
      quote: "Transformaram nossa visão em um negócio completo que está mudando como as pessoas acessam saúde.",
      attribution: "Renata Jacomeli · CEO",
      metrics: [{ v: "300%", l: "Crescimento em 12 meses" }, { v: "3", l: "Estados brasileiros" }, { v: "0→1", l: "Conceito até operação" }],
      img: IMG.cuidarbem,
    },
  ];

  const copy = {
    pt: {
      statement: "Não vendemos hora. *Construímos a operação.*",
      statementSub: "Builder de Engenharia Criativa baseado em Lucas do Rio Verde · MT. Trabalhamos com empresas do Brasil inteiro.",
      productsEyebrow: "Nossos produtos",
      productsTitle: "Três produtos que *construímos e operamos*.",
      productsLead: "São negócios próprios. Cada um nasceu de uma dor real, validado primeiro com a gente — antes de oferecer pra cliente.",
      casesEyebrow: "Cases de cliente",
      casesTitle: "Você traz a dor. *A gente desenvolve.*",
      casesLead: "Empresas que chegaram com uma demanda pontual e saíram com uma operação digital completa.",
    },
    en: {
      statement: "We don't sell hours. *We build the operation.*",
      statementSub: "Creative Engineering Builder based in Lucas do Rio Verde, MT — Brazil. Working with companies across the country.",
      productsEyebrow: "Our products",
      productsTitle: "Three products *we built and run*.",
      productsLead: "Our own ventures. Each one was born from real pain, proven on ourselves first before offering to clients.",
      casesEyebrow: "Client cases",
      casesTitle: "You bring the pain. *We build it.*",
      casesLead: "Companies that came with a specific demand and left with a complete digital operation.",
    },
    es: {
      statement: "No vendemos horas. *Construimos la operación.*",
      statementSub: "Builder de Ingeniería Creativa basado en Lucas do Rio Verde · MT · Brasil. Trabajamos con empresas de todo el país.",
      productsEyebrow: "Nuestros productos",
      productsTitle: "Tres productos *que construimos y operamos*.",
      productsLead: "Negocios propios. Cada uno nació de un dolor real, validado primero con nosotros.",
      casesEyebrow: "Casos de cliente",
      casesTitle: "Tú traes el dolor. *Nosotros desarrollamos.*",
      casesLead: "Empresas que llegaron con una demanda puntual y salieron con una operación digital completa.",
    },
  };
  const c = copy[lang as keyof typeof copy] ?? copy.pt;

  return (
    <Layout t={t} lang={lang}>
      {/* 01 · Hero with cinematic image */}
      <Hero t={t} />

      {/* 02 · Statement strip (split, claim + sub) */}
      <BigStatement
        statement={c.statement}
        sub={c.statementSub}
        image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80"
      />

      {/* 03 · Logos de clientes */}
      <Logos t={t} />

      {/* 04 · Soluções / Capacidades (cards com imagem) */}
      <Capabilities t={t} />

      {/* 05 · Products section header + 3 featured */}
      <section className="container-x pt-[120px] pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5">
              <span className="inline-block w-6 h-px bg-accent" />{c.productsEyebrow}
            </div>
            <h2 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.05] text-[clamp(34px,5vw,68px)] text-balance">
              {c.productsTitle.split(/(\*[^*]+\*)/g).map((p, i) =>
                p.startsWith("*") && p.endsWith("*") ? <span key={i} className="text-accent">{p.slice(1, -1)}</span> : <span key={i}>{p}</span>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-ink-dim text-[16px] leading-[1.6] max-w-[480px]">{c.productsLead}</p>
          </div>
        </div>
      </section>
      {products.map((p, i) => (
        <FeaturedProduct key={p.brand} data={p} reverse={i % 2 === 1} />
      ))}

      {/* 06 · Stats (3-4 col, light, com header) */}
      <Stats t={t} />

      {/* 07 · Cases header + 3 cases magazine */}
      <section className="container-x pt-[120px] pb-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5">
          <span className="inline-block w-6 h-px bg-accent" />{c.casesEyebrow}
        </div>
        <h2 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.05] text-[clamp(34px,5vw,68px)] max-w-[1100px] text-balance mb-4">
          {c.casesTitle.split(/(\*[^*]+\*)/g).map((p, i) =>
            p.startsWith("*") && p.endsWith("*") ? <span key={i} className="text-accent">{p.slice(1, -1)}</span> : <span key={i}>{p}</span>
          )}
        </h2>
        <p className="text-ink-dim text-[16px] leading-[1.6] max-w-prose">{c.casesLead}</p>
      </section>
      {cases.map((cs, i) => (
        <CaseStory key={cs.title} data={cs} reverse={i % 2 === 1} />
      ))}

      {/* 08 · Insights (blog grid 3 col) */}
      <Insights lang={lang} />

      {/* 09 · Testimonials carrossel */}
      <Testimonials t={t} />

      {/* 10 · Tech stack */}
      <Stack t={t} />

      {/* 11 · CTA Final (dark com imagem) */}
      <CTAFinal t={t} />

      {/* 12 · Inline contact form */}
      <InlineContactForm t={t} lang={lang} />
    </Layout>
  );
}
