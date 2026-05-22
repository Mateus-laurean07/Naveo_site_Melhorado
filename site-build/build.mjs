import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");

// === CONFIG ===
const SITE_BASE = "https://naveo-docs.pages.dev";
const SITE_NAME = "Naveo";
const SITE_TAGLINE = "Creative Engineering";
const OG_IMAGE = `${SITE_BASE}/assets/logo-verde.webp`;

marked.setOptions({ gfm: true, breaks: false });
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// =================================================================
// IMAGENS DE BANCO (Unsplash placeholders — substituir depois)
// =================================================================
const IMG = {
  // Cases
  facilita: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1400&q=80",
  obrasimples: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
  cuidarbem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  // Portfolio destaques
  agro: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80",
  cruzeta: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
  navbarber: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80",
  pharma: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1400&q=80",
};

// =================================================================
// i18n — Strings em PT, EN, ES
// =================================================================
// Shared lists (across i18n)
const CLIENT_LOGOS = [
  { name: "Facilita",         slug: "facilita" },
  { name: "ObraSimples",      slug: "obrasimples" },
  { name: "Cuidar Bem",       slug: "cuidarbem" },
  { name: "Sicredi",          slug: "sicredi" },
  { name: "Green Future Hub", slug: "greenfuturehub" },
  { name: "O'Gourmet",        slug: "ogourmet" },
  { name: "Festi Pizza",      slug: "festipizza" },
  { name: "Bassani Móveis",   slug: "bassanimoveis" },
  { name: "Serra Summit",     slug: "serrasummit" },
  { name: "CD Marau",         slug: "cdmarau" },
  { name: "Gestão BPO",       slug: "gestaobpo" },
  { name: "Alternativa",      slug: "alternativa" },
];

// Detecta automaticamente se existe arquivo de logo em dist/assets/clients/
// Aceita .svg, .png, .webp, .jpg (nessa ordem de prioridade)
const CLIENTS_DIR = resolve(ROOT, "dist", "assets", "clients");
function resolveClientLogo(slug) {
  for (const ext of ["svg", "png", "webp", "jpg", "jpeg"]) {
    const path = resolve(CLIENTS_DIR, `${slug}.${ext}`);
    if (existsSync(path)) return `/assets/clients/${slug}.${ext}`;
  }
  return null;
}

const STACK_BLOCKS = [
  { slug: "nextdotjs",   name: "Next.js",    type: "Frontend" },
  { slug: "supabase",    name: "Supabase",   type: "Backend" },
  { slug: "postgresql",  name: "Postgres",   type: "Database" },
  { slug: "n8n",         name: "n8n",        type: "Automation" },
  { slug: "claude",      name: "Claude",     type: "AI" },
  { slug: "whatsapp",    name: "Evolution",  type: "WhatsApp" },
  { slug: "resend",      name: "Resend",     type: "Email" },
  { slug: "tailwindcss", name: "Tailwind",   type: "Styling" },
  { slug: "figma",       name: "Figma",      type: "Design" },
  { slug: "github",      name: "GitHub",     type: "Code" },
  { slug: "vercel",      name: "Vercel",     type: "Deploy" },
  { slug: "cloudflare",  name: "Cloudflare", type: "Edge" },
];

const i18n = {
  pt: {
    locale: "pt-BR",
    nav: { portfolio: "Portfólio", method: "Método", cases: "Cases", about: "Sobre", contact: "Agendar diagnóstico" },
    hero: {
      eyebrow: "Builder de Engenharia Criativa",
      headline: [
        { text: "Desenvolvemos" },
        { text: "produtos digitais" },
        { text: "e plataformas" },
        { text: "customizadas", em: true },
        { text: "ao seu negócio." },
      ],
      sub: "Sistemas, marketplaces, automações, IA aplicada. Construímos, integramos e sustentamos a tecnologia que sua operação precisa.",
      ctaPrimary: "Agendar diagnóstico",
      ctaSecondary: "Ver portfólio",
      scroll: "Role para descobrir",
    },
    marquee: [
      "Engenharia Criativa", "Sistemas", "Marketplaces", "Automações",
      "IA Aplicada", "Fintech", "Sites de Conversão", "PWA", "Visão de Dono",
    ],
    stats: {
      eyebrow: "Skin in the game",
      title: "Os números que importam.",
      lead: "Aplicamos o método primeiro nos nossos negócios. Antes de oferecer pra você, provamos com a gente.",
      items: [
        { value: 12, label: "Empresas próprias criadas" },
        { value: 4, label: "Bancos digitais construídos" },
        { value: 8, label: "Setores atendidos", suffix: "+" },
        { value: 100, label: "Equipe interna · sem terceirização", suffix: "%" },
      ],
    },
    method: {
      eyebrow: "Engenharia Criativa",
      title: "O método em 6 passos.",
      lead: "Da primeira conversa ao sistema rodando. Investigação profunda, MVP em dias, construção faseada e sustentação contínua.",
      aria: "Etapas do método",
      hint: "← arraste ou role pro lado →",
      steps: [
        { num: "01", title: "Conexão & Diagnóstico", desc: "Entendemos seu contexto, ERP, fluxos e gargalos.", list: ["Diagnóstico de 1h gratuito", "Investigação do contexto", "Mapeamento de stakeholders", "Briefing estratégico"] },
        { num: "02", title: "Direcionamento Estratégico", desc: "Roadmap, visão macro e matriz de prioridades.", list: ["Roadmap personalizado", "Posicionamento + proposta de valor", "Matriz de priorização", "Documento de visão"] },
        { num: "03", title: "MVP em Dias", desc: "Protótipo funcional antes do contrato, validação ao vivo.", list: ["Protótipo em 3 a 7 dias", "Demonstração ao vivo", "Visão expandida", "Skin in the game"] },
        { num: "04", title: "Construção Faseada", desc: "Sprints curtos, entrega incremental, validação por etapa.", list: ["Sprints curtos com metas claras", "Entrega contínua", "Painel Notion compartilhado", "Reuniões quinzenais"] },
        { num: "05", title: "Integração & Go-Live", desc: "Conexão com seu ERP atual, treinamento, go-live faseado.", list: ["Integração via API", "Treinamento da equipe", "Go-live faseado", "Conformidade LGPD"] },
        { num: "06", title: "Sustentação Contínua", desc: "10h técnicas mensais, suporte WhatsApp, garantia 90 dias.", list: ["10h técnicas/mês", "Suporte WhatsApp em 4h", "Garantia de 90 dias", "Roadmap evolutivo"] },
      ],
    },
    capabilities: {
      eyebrow: "O que construímos",
      title: "Capacidades técnicas em <em>seis frentes</em>.",
      lead: "Cliente não compra capacidade — compra resolução de dor. Mas o conjunto técnico precisa estar pronto.",
      items: [
        { icon: "</>", title: "Sistemas sob medida", desc: "Plataformas web, PWAs, ERPs internos, GEDs e sistemas multi-unidade desenhados pra sua operação." },
        { icon: "⌬", title: "Marketplaces com IA", desc: "Compra e venda com agentes inteligentes negociando via WhatsApp, automação de leads e gestão integrada." },
        { icon: "∞", title: "Automações inteligentes", desc: "Fluxos automatizados com n8n, integrações por API, agentes que substituem trabalho manual repetitivo." },
        { icon: "◈", title: "IA aplicada", desc: "Agentes negociadores, OCR, classificação automática, análise preditiva. IA com propósito e resultado." },
        { icon: "$", title: "Fintech & pagamentos", desc: "Conta whitelabel, sub-acquiring, pagamentos integrados, banco digital. Construímos 4 até hoje." },
        { icon: "⚡", title: "Sites de alta conversão", desc: "Sites institucionais e landing pages que convertem — não decorativos, orientados a métrica." },
      ],
    },
    portfolio: {
      eyebrow: "Portfólio Naveo",
      title: "12 empresas próprias. <em>Skin in the game</em> de verdade.",
      lead: "Antes de oferecer pra você, construímos pros nossos. Cada negócio próprio é um laboratório vivo do método.",
      heroes: [
        { name: "Agrodesapego", tag: "Marketplace · IA", desc: "Venda de máquinas agrícolas com IA negociadora", url: "https://agrodesapego.com.br", img: IMG.agro },
        { name: "Cruzeta Club", tag: "Comunidade · SaaS", desc: "Gestão de clubes de carros", url: "https://cruzetaclub.com.br", img: IMG.cruzeta },
        { name: "Navbarber", tag: "SaaS Vertical", desc: "Gestão para barbearias modernas", url: "https://navbarber.com.br", img: IMG.navbarber },
        { name: "Pharma Genius", tag: "Em breve", desc: "Plataforma farmacêutica · lançamento próximo", url: "#", img: IMG.pharma },
      ],
      mini: [
        { name: "Criativando", tag: "Plataforma" },
        { name: "uRocket", tag: "Fintech" },
        { name: "VaiPedindo", tag: "Fintech" },
        { name: "Farol Entidades", tag: "Comunidade" },
        { name: "automapost", tag: "Automação" },
        { name: "talk", tag: "SaaS" },
        { name: "eventeu", tag: "Plataforma" },
        { name: "obafestinha", tag: "Plataforma" },
      ],
    },
    cases: {
      eyebrow: "Cases de cliente",
      title: "Você nos traz a dor. <em>A gente desenvolve.</em>",
      lead: "Empresas que chegaram com uma demanda pontual e saíram com uma operação digital completa.",
      items: [
        {
          tag: "Plataforma operacional · GED",
          title: "Facilita Higienização",
          desc: "Rede de higienização industrial com múltiplas unidades. Empurrava papel, ASOs vencendo sem ninguém ver, risco trabalhista latente. Construímos um GED multi-unidade com assinatura jurídica, PWA pros gerentes e dashboard de prazos.",
          quote: "“Vocês trouxeram algo que eu não imaginava.”",
          metrics: [
            { v: "PWA", l: "iPhone, Android, iPad" },
            { v: "LGPD", l: "Conformidade total" },
            { v: "90d", l: "Da assinatura ao go-live" },
          ],
          img: IMG.facilita,
        },
        {
          tag: "ERP Vertical · Construção civil",
          title: "ObraSimples",
          desc: "Cliente chegou pedindo solução fintech. A gente identificou oportunidade maior: um ERP/Micro SaaS sob medida pra pequenos empreendedores da construção civil. Boletos, PIX, gestão financeira, controle de estoque, orçamentos e notas fiscais.",
          quote: "“Nos mostraram uma nova oportunidade de novo negócio.”",
          metrics: [
            { v: "Sob medida", l: "Cliente é dono do código" },
            { v: "Fintech", l: "PIX + boletos integrados" },
            { v: "MRR", l: "Sustentação contínua" },
          ],
          img: IMG.obrasimples,
        },
        {
          tag: "Plataforma de saúde · do zero",
          title: "Cuidar Bem Card",
          desc: "Empresa de saúde criada do zero, do modelo de negócio à plataforma completa. Conceito, desenvolvimento, branding, go-to-market — Engenharia Criativa de ponta a ponta.",
          quote: "“Transformou em um negócio completo que está mudando a forma como as pessoas acessam serviços de saúde.”",
          metrics: [
            { v: "300%", l: "Crescimento em 12 meses" },
            { v: "3", l: "Estados brasileiros" },
            { v: "0→1", l: "Conceito até operação" },
          ],
          img: IMG.cuidarbem,
        },
      ],
    },
    logos: {
      eyebrow: "Quem confia",
      title: "Empresas que escolheram <em>construir junto</em>.",
      lead: "De redes regionais a sistemas cooperativos. Diferentes setores, mesmo método.",
      aria: "Empresas que confiam na Naveo",
    },
    stack: {
      eyebrow: "Stack",
      title: "Tecnologia <em>moderna e batalhada</em>.",
      lead: "As ferramentas que usamos pra construir produtos que escalam — testadas em 12 negócios próprios.",
    },
    testimonials: {
      eyebrow: "O que dizem",
      title: "<em>Visão de dono</em>, na prática.",
      lead: "O que falam os clientes depois que entram no nosso barco.",
      items: [
        { quote: "Vocês trouxeram algo que eu não imaginava era possível. Saí com um sistema que mudou nossa operação inteira.", name: "Cliente Facilita Higienização", role: "Diretor · Rede industrial · MT" },
        { quote: "Não precisamos só fazer um sistema, vocês nos mostraram uma nova oportunidade de negócio. Skin in the game de verdade.", name: "Thiago Piccini", role: "Fundador · ObraSimples" },
        { quote: "Transformaram nossa visão em um negócio completo que está mudando a forma como as pessoas acessam saúde.", name: "Renata Jacomeli", role: "CEO · Cuidar Bem Card" },
      ],
    },
    manifesto: {
      quote: "Não vendemos hora. <em>Construímos a operação.</em>",
      attr: "Naveo · Lucas do Rio Verde, MT · Brasil",
    },
    ctaFinal: {
      title: "Bora <em>construir</em> junto?",
      sub: "Diagnóstico de 1h, gratuito e sem compromisso. A gente entende sua operação, mapeia gargalos e devolve um diagnóstico estruturado em até 5 dias úteis.",
      btn: "Chamar no WhatsApp",
    },
    footer: {
      about: "Builder de Engenharia Criativa. Desenvolvemos produtos digitais e plataformas sob medida — sistemas, marketplaces, automações e IA aplicada.",
      location: "Lucas do Rio Verde, MT · Brasil",
      cols: [
        { title: "Empresa", items: [
          { label: "Sobre", href: "#sobre" },
          { label: "Portfólio Naveo", href: "#portfolio" },
          { label: "Cases de cliente", href: "#cases" },
          { label: "Método", href: "#metodo" },
        ]},
        { title: "Produtos próprios", items: [
          { label: "Agrodesapego ↗", href: "https://agrodesapego.com.br" },
          { label: "Cruzeta Club ↗", href: "https://cruzetaclub.com.br" },
          { label: "Navbarber ↗", href: "https://navbarber.com.br" },
          { label: "Pharma Genius (em breve)", href: "#" },
        ]},
        { title: "Contato", items: [
          { label: "contato@naveo.com.br", href: "mailto:contato@naveo.com.br" },
          { label: "WhatsApp ↗", href: "https://wa.me/5565996865004" },
          { label: "LinkedIn ↗", href: "https://www.linkedin.com" },
          { label: "Instagram ↗", href: "https://www.instagram.com/naveoce" },
        ]},
        { title: "Idioma", items: [
          { label: "Português", href: "/" },
          { label: "English", href: "/en" },
          { label: "Español", href: "/es" },
        ]},
      ],
      copyright: "© {year} Naveo Engenharia Criativa.",
      tag: "Construído com Engenharia Criativa.",
    },
    seo: {
      title: "Naveo · Engenharia Criativa",
      description: "Desenvolvemos produtos digitais e plataformas customizadas ao seu negócio. Sistemas, marketplaces, automações, IA aplicada. Construímos, integramos e sustentamos a tecnologia que sua operação precisa.",
    },
  },

  en: {
    locale: "en",
    nav: { portfolio: "Portfolio", method: "Method", cases: "Cases", about: "About", contact: "Book a diagnosis" },
    hero: {
      eyebrow: "Creative Engineering Builder",
      headline: [
        { text: "We build" },
        { text: "digital products" },
        { text: "and platforms" },
        { text: "tailored", em: true },
        { text: "to your business." },
      ],
      sub: "Systems, marketplaces, automations, applied AI. We build, integrate and sustain the technology your operation needs.",
      ctaPrimary: "Book a diagnosis",
      ctaSecondary: "View portfolio",
      scroll: "Scroll to explore",
    },
    marquee: [
      "Creative Engineering", "Systems", "Marketplaces", "Automations",
      "Applied AI", "Fintech", "Conversion Sites", "PWA", "Owner Mindset",
    ],
    stats: {
      eyebrow: "Skin in the game",
      title: "The numbers that matter.",
      lead: "We apply the method to our own ventures first. Before offering it to you, we prove it on ourselves.",
      items: [
        { value: 12, label: "In-house ventures built" },
        { value: 4, label: "Digital banks delivered" },
        { value: 8, label: "Industries served", suffix: "+" },
        { value: 100, label: "In-house team · no outsourcing", suffix: "%" },
      ],
    },
    method: {
      eyebrow: "Creative Engineering",
      title: "The 6-step method.",
      lead: "From first conversation to system in production. Deep investigation, MVP in days, phased build and ongoing sustainment.",
      aria: "Method steps",
      hint: "← drag or scroll sideways →",
      steps: [
        { num: "01", title: "Connect & Diagnose", desc: "We understand your context, ERP, flows and bottlenecks.", list: ["Free 1h diagnosis", "Context investigation", "Stakeholder mapping", "Strategic briefing"] },
        { num: "02", title: "Strategic Direction", desc: "Roadmap, macro vision and priority matrix.", list: ["Custom roadmap", "Positioning + value prop", "Priority matrix", "Vision document"] },
        { num: "03", title: "MVP in Days", desc: "Functional prototype before the contract, live validation.", list: ["Prototype in 3 to 7 days", "Live demonstration", "Expanded vision", "Skin in the game"] },
        { num: "04", title: "Phased Build", desc: "Short sprints, incremental delivery, validation by step.", list: ["Short sprints with clear goals", "Continuous delivery", "Shared Notion panel", "Biweekly meetings"] },
        { num: "05", title: "Integration & Go-Live", desc: "Connection to your current ERP, training, phased go-live.", list: ["API integration", "Team training", "Phased go-live", "LGPD/GDPR compliance"] },
        { num: "06", title: "Ongoing Sustainment", desc: "10 monthly tech hours, WhatsApp support, 90-day warranty.", list: ["10 tech hours/month", "WhatsApp support in 4h", "90-day warranty", "Evolution roadmap"] },
      ],
    },
    capabilities: {
      eyebrow: "What we build",
      title: "Technical capabilities across <em>six fronts</em>.",
      lead: "Clients don't buy capabilities — they buy pain resolution. But the technical kit has to be ready.",
      items: [
        { icon: "</>", title: "Custom systems", desc: "Web platforms, PWAs, internal ERPs, document systems and multi-unit setups designed for your operation." },
        { icon: "⌬", title: "AI marketplaces", desc: "Buy and sell with intelligent agents negotiating via WhatsApp, lead automation and integrated management." },
        { icon: "∞", title: "Smart automations", desc: "Automated flows with n8n, API integrations, agents that replace repetitive manual work." },
        { icon: "◈", title: "Applied AI", desc: "Negotiator agents, OCR, automatic classification, predictive analytics. AI with purpose and outcome." },
        { icon: "$", title: "Fintech & payments", desc: "Whitelabel accounts, sub-acquiring, integrated payments, digital banking. We've built 4 to date." },
        { icon: "⚡", title: "High-conversion sites", desc: "Institutional sites and landing pages that convert — not decorative, metric-driven." },
      ],
    },
    portfolio: {
      eyebrow: "Naveo Portfolio",
      title: "12 in-house ventures. <em>Real skin in the game.</em>",
      lead: "Before offering it to you, we built ours. Each in-house business is a living lab for the method.",
      heroes: [
        { name: "Agrodesapego", tag: "Marketplace · AI", desc: "Used farm equipment sales with AI negotiator", url: "https://agrodesapego.com.br", img: IMG.agro },
        { name: "Cruzeta Club", tag: "Community · SaaS", desc: "Car club management platform", url: "https://cruzetaclub.com.br", img: IMG.cruzeta },
        { name: "Navbarber", tag: "Vertical SaaS", desc: "Modern barbershop management", url: "https://navbarber.com.br", img: IMG.navbarber },
        { name: "Pharma Genius", tag: "Coming soon", desc: "Pharmaceutical platform · launching soon", url: "#", img: IMG.pharma },
      ],
      mini: [
        { name: "Criativando", tag: "Platform" },
        { name: "uRocket", tag: "Fintech" },
        { name: "VaiPedindo", tag: "Fintech" },
        { name: "Farol Entidades", tag: "Community" },
        { name: "automapost", tag: "Automation" },
        { name: "talk", tag: "SaaS" },
        { name: "eventeu", tag: "Platform" },
        { name: "obafestinha", tag: "Platform" },
      ],
    },
    cases: {
      eyebrow: "Client cases",
      title: "You bring the pain. <em>We build the solution.</em>",
      lead: "Companies that came with a specific demand and left with a complete digital operation.",
      items: [
        {
          tag: "Operational platform · Document management",
          title: "Facilita Higienização",
          desc: "Industrial cleaning network with multiple units. They were pushing paper, certificates expiring unnoticed, labor risk latent. We built a multi-unit DMS with legal e-signature, PWA for managers and deadline dashboard.",
          quote: "“You brought something I didn't imagine was possible.”",
          metrics: [
            { v: "PWA", l: "iPhone, Android, iPad" },
            { v: "LGPD", l: "Full compliance" },
            { v: "90d", l: "From signing to go-live" },
          ],
          img: IMG.facilita,
        },
        {
          tag: "Vertical ERP · Construction",
          title: "ObraSimples",
          desc: "Client came asking for a fintech solution. We identified a bigger opportunity: a custom ERP/Micro SaaS for small construction entrepreneurs. Invoices, PIX, financial management, inventory control, quotes and tax invoices.",
          quote: "“They showed us a new opportunity for a new business.”",
          metrics: [
            { v: "Custom", l: "Client owns the code" },
            { v: "Fintech", l: "PIX + invoices integrated" },
            { v: "MRR", l: "Ongoing sustainment" },
          ],
          img: IMG.obrasimples,
        },
        {
          tag: "Healthcare platform · from zero",
          title: "Cuidar Bem Card",
          desc: "Healthcare company built from scratch, from business model to complete platform. Concept, development, branding, go-to-market — Creative Engineering end-to-end.",
          quote: "“It turned into a complete business that is changing how people access healthcare services.”",
          metrics: [
            { v: "300%", l: "12-month growth" },
            { v: "3", l: "Brazilian states" },
            { v: "0→1", l: "Concept to operation" },
          ],
          img: IMG.cuidarbem,
        },
      ],
    },
    logos: {
      eyebrow: "Trusted by",
      title: "Teams that chose to <em>build together</em>.",
      lead: "From regional networks to cooperative systems. Different industries, same method.",
      aria: "Companies that trust Naveo",
    },
    stack: {
      eyebrow: "Stack",
      title: "<em>Modern and battle-tested</em> technology.",
      lead: "The tools we use to build products that scale — proven across 12 in-house ventures.",
    },
    testimonials: {
      eyebrow: "Voices",
      title: "<em>Owner mindset</em>, in practice.",
      lead: "What clients say after they get in our boat.",
      items: [
        { quote: "You brought something I didn't imagine was possible. I left with a system that changed our entire operation.", name: "Facilita Higienização client", role: "Director · Industrial network · BR" },
        { quote: "We didn't just need a system — you showed us a new business opportunity. Real skin in the game.", name: "Thiago Piccini", role: "Founder · ObraSimples" },
        { quote: "You turned our vision into a complete business that is changing how people access healthcare.", name: "Renata Jacomeli", role: "CEO · Cuidar Bem Card" },
      ],
    },
    manifesto: {
      quote: "We don't sell hours. <em>We build the operation.</em>",
      attr: "Naveo · Lucas do Rio Verde, MT · Brazil",
    },
    ctaFinal: {
      title: "Let's <em>build</em> together?",
      sub: "1-hour diagnosis, free and no strings attached. We understand your operation, map bottlenecks and return a structured diagnosis within 5 business days.",
      btn: "Talk on WhatsApp",
    },
    footer: {
      about: "Creative Engineering Builder. We build digital products and platforms tailored to your business — systems, marketplaces, automations and applied AI.",
      location: "Lucas do Rio Verde, MT · Brazil",
      cols: [
        { title: "Company", items: [
          { label: "About", href: "#sobre" },
          { label: "Naveo Portfolio", href: "#portfolio" },
          { label: "Client cases", href: "#cases" },
          { label: "Method", href: "#metodo" },
        ]},
        { title: "Our products", items: [
          { label: "Agrodesapego ↗", href: "https://agrodesapego.com.br" },
          { label: "Cruzeta Club ↗", href: "https://cruzetaclub.com.br" },
          { label: "Navbarber ↗", href: "https://navbarber.com.br" },
          { label: "Pharma Genius (soon)", href: "#" },
        ]},
        { title: "Contact", items: [
          { label: "contato@naveo.com.br", href: "mailto:contato@naveo.com.br" },
          { label: "WhatsApp ↗", href: "https://wa.me/5565996865004" },
          { label: "LinkedIn ↗", href: "https://www.linkedin.com" },
          { label: "Instagram ↗", href: "https://www.instagram.com/naveoce" },
        ]},
        { title: "Language", items: [
          { label: "Português", href: "/" },
          { label: "English", href: "/en" },
          { label: "Español", href: "/es" },
        ]},
      ],
      copyright: "© {year} Naveo Engenharia Criativa.",
      tag: "Built with Creative Engineering.",
    },
    seo: {
      title: "Naveo · Creative Engineering",
      description: "We develop digital products and platforms tailored to your business. Systems, marketplaces, automations, applied AI. We build, integrate and sustain the technology your operation needs.",
    },
  },

  es: {
    locale: "es",
    nav: { portfolio: "Portafolio", method: "Método", cases: "Casos", about: "Sobre", contact: "Agendar diagnóstico" },
    hero: {
      eyebrow: "Builder de Ingeniería Creativa",
      headline: [
        { text: "Desarrollamos" },
        { text: "productos digitales" },
        { text: "y plataformas" },
        { text: "personalizadas", em: true },
        { text: "para tu negocio." },
      ],
      sub: "Sistemas, marketplaces, automatizaciones, IA aplicada. Construimos, integramos y sostenemos la tecnología que tu operación necesita.",
      ctaPrimary: "Agendar diagnóstico",
      ctaSecondary: "Ver portafolio",
      scroll: "Desplázate para explorar",
    },
    marquee: [
      "Ingeniería Creativa", "Sistemas", "Marketplaces", "Automatizaciones",
      "IA Aplicada", "Fintech", "Sitios de Conversión", "PWA", "Visión de Dueño",
    ],
    stats: {
      eyebrow: "Skin in the game",
      title: "Los números que importan.",
      lead: "Aplicamos el método primero en nuestras propias empresas. Antes de ofrecértelo, lo probamos en nosotros.",
      items: [
        { value: 12, label: "Empresas propias creadas" },
        { value: 4, label: "Bancos digitales construidos" },
        { value: 8, label: "Sectores atendidos", suffix: "+" },
        { value: 100, label: "Equipo interno · sin tercerización", suffix: "%" },
      ],
    },
    method: {
      eyebrow: "Ingeniería Creativa",
      title: "El método en 6 pasos.",
      lead: "De la primera conversación al sistema funcionando. Investigación profunda, MVP en días, construcción por fases y soporte continuo.",
      aria: "Pasos del método",
      hint: "← arrastra o desliza al lado →",
      steps: [
        { num: "01", title: "Conexión & Diagnóstico", desc: "Entendemos tu contexto, ERP, flujos y cuellos de botella.", list: ["Diagnóstico gratuito de 1h", "Investigación del contexto", "Mapeo de stakeholders", "Briefing estratégico"] },
        { num: "02", title: "Dirección Estratégica", desc: "Roadmap, visión macro y matriz de prioridades.", list: ["Roadmap personalizado", "Posicionamiento + propuesta de valor", "Matriz de priorización", "Documento de visión"] },
        { num: "03", title: "MVP en Días", desc: "Prototipo funcional antes del contrato, validación en vivo.", list: ["Prototipo en 3 a 7 días", "Demostración en vivo", "Visión expandida", "Skin in the game"] },
        { num: "04", title: "Construcción por Fases", desc: "Sprints cortos, entrega incremental, validación por etapa.", list: ["Sprints cortos con metas claras", "Entrega continua", "Panel Notion compartido", "Reuniones quincenales"] },
        { num: "05", title: "Integración & Go-Live", desc: "Conexión con tu ERP actual, capacitación, go-live por fases.", list: ["Integración vía API", "Capacitación del equipo", "Go-live por fases", "Cumplimiento LGPD"] },
        { num: "06", title: "Soporte Continuo", desc: "10h técnicas mensuales, soporte WhatsApp, garantía 90 días.", list: ["10h técnicas/mes", "Soporte WhatsApp en 4h", "Garantía de 90 días", "Roadmap evolutivo"] },
      ],
    },
    capabilities: {
      eyebrow: "Lo que construimos",
      title: "Capacidades técnicas en <em>seis frentes</em>.",
      lead: "El cliente no compra capacidad — compra resolución de dolor. Pero el kit técnico tiene que estar listo.",
      items: [
        { icon: "</>", title: "Sistemas a medida", desc: "Plataformas web, PWAs, ERPs internos, gestores documentales y configuraciones multiunidad diseñadas para tu operación." },
        { icon: "⌬", title: "Marketplaces con IA", desc: "Compra y venta con agentes inteligentes negociando vía WhatsApp, automatización de leads y gestión integrada." },
        { icon: "∞", title: "Automatizaciones inteligentes", desc: "Flujos automatizados con n8n, integraciones por API, agentes que reemplazan el trabajo manual repetitivo." },
        { icon: "◈", title: "IA aplicada", desc: "Agentes negociadores, OCR, clasificación automática, análisis predictivo. IA con propósito y resultado." },
        { icon: "$", title: "Fintech & pagos", desc: "Cuenta whitelabel, sub-acquiring, pagos integrados, banca digital. Hemos construido 4 hasta hoy." },
        { icon: "⚡", title: "Sitios de alta conversión", desc: "Sitios institucionales y landing pages que convierten — no decorativos, orientados a métrica." },
      ],
    },
    portfolio: {
      eyebrow: "Portafolio Naveo",
      title: "12 empresas propias. <em>Skin in the game</em> real.",
      lead: "Antes de ofrecértelo, lo construimos para nosotros. Cada negocio propio es un laboratorio vivo del método.",
      heroes: [
        { name: "Agrodesapego", tag: "Marketplace · IA", desc: "Venta de maquinaria agrícola con IA negociadora", url: "https://agrodesapego.com.br", img: IMG.agro },
        { name: "Cruzeta Club", tag: "Comunidad · SaaS", desc: "Gestión de clubes de autos", url: "https://cruzetaclub.com.br", img: IMG.cruzeta },
        { name: "Navbarber", tag: "SaaS Vertical", desc: "Gestión para barberías modernas", url: "https://navbarber.com.br", img: IMG.navbarber },
        { name: "Pharma Genius", tag: "Próximamente", desc: "Plataforma farmacéutica · lanzamiento próximo", url: "#", img: IMG.pharma },
      ],
      mini: [
        { name: "Criativando", tag: "Plataforma" },
        { name: "uRocket", tag: "Fintech" },
        { name: "VaiPedindo", tag: "Fintech" },
        { name: "Farol Entidades", tag: "Comunidad" },
        { name: "automapost", tag: "Automatización" },
        { name: "talk", tag: "SaaS" },
        { name: "eventeu", tag: "Plataforma" },
        { name: "obafestinha", tag: "Plataforma" },
      ],
    },
    cases: {
      eyebrow: "Casos de cliente",
      title: "Tú nos traes el dolor. <em>Nosotros desarrollamos.</em>",
      lead: "Empresas que llegaron con una demanda puntual y salieron con una operación digital completa.",
      items: [
        {
          tag: "Plataforma operacional · Gestión documental",
          title: "Facilita Higienização",
          desc: "Red de higienización industrial con múltiples unidades. Empujaba papel, certificados venciendo sin que nadie viera, riesgo laboral latente. Construimos un GED multiunidad con firma legal, PWA para gerentes y dashboard de plazos.",
          quote: "“Trajeron algo que no imaginaba que era posible.”",
          metrics: [
            { v: "PWA", l: "iPhone, Android, iPad" },
            { v: "LGPD", l: "Cumplimiento total" },
            { v: "90d", l: "De la firma al go-live" },
          ],
          img: IMG.facilita,
        },
        {
          tag: "ERP Vertical · Construcción",
          title: "ObraSimples",
          desc: "Cliente llegó pidiendo solución fintech. Identificamos una oportunidad mayor: un ERP/Micro SaaS a medida para pequeños emprendedores de la construcción. Facturación, PIX, gestión financiera, control de stock, presupuestos.",
          quote: "“Nos mostraron una nueva oportunidad de nuevo negocio.”",
          metrics: [
            { v: "A medida", l: "Cliente dueño del código" },
            { v: "Fintech", l: "PIX + facturas integrados" },
            { v: "MRR", l: "Soporte continuo" },
          ],
          img: IMG.obrasimples,
        },
        {
          tag: "Plataforma de salud · desde cero",
          title: "Cuidar Bem Card",
          desc: "Empresa de salud creada desde cero, del modelo de negocio a la plataforma completa. Concepto, desarrollo, branding, go-to-market — Ingeniería Creativa de punta a punta.",
          quote: "“Se convirtió en un negocio completo que está cambiando cómo las personas acceden a servicios de salud.”",
          metrics: [
            { v: "300%", l: "Crecimiento en 12 meses" },
            { v: "3", l: "Estados brasileños" },
            { v: "0→1", l: "Concepto a operación" },
          ],
          img: IMG.cuidarbem,
        },
      ],
    },
    logos: {
      eyebrow: "Confían",
      title: "Equipos que eligieron <em>construir juntos</em>.",
      lead: "De redes regionales a sistemas cooperativos. Diferentes sectores, el mismo método.",
      aria: "Empresas que confían en Naveo",
    },
    stack: {
      eyebrow: "Stack",
      title: "Tecnología <em>moderna y probada</em>.",
      lead: "Las herramientas que usamos para construir productos que escalan — probadas en 12 negocios propios.",
    },
    testimonials: {
      eyebrow: "Voces",
      title: "<em>Visión de dueño</em>, en la práctica.",
      lead: "Lo que dicen los clientes después de subir a nuestro barco.",
      items: [
        { quote: "Trajeron algo que yo no imaginaba que era posible. Salí con un sistema que cambió toda nuestra operación.", name: "Cliente Facilita Higienização", role: "Director · Red industrial · BR" },
        { quote: "No solo necesitábamos un sistema — nos mostraron una nueva oportunidad de negocio. Skin in the game real.", name: "Thiago Piccini", role: "Fundador · ObraSimples" },
        { quote: "Transformaron nuestra visión en un negocio completo que está cambiando cómo las personas acceden a salud.", name: "Renata Jacomeli", role: "CEO · Cuidar Bem Card" },
      ],
    },
    manifesto: {
      quote: "No vendemos horas. <em>Construimos la operación.</em>",
      attr: "Naveo · Lucas do Rio Verde, MT · Brasil",
    },
    ctaFinal: {
      title: "¿<em>Construimos</em> juntos?",
      sub: "Diagnóstico de 1h, gratuito y sin compromiso. Entendemos tu operación, mapeamos cuellos de botella y devolvemos un diagnóstico estructurado en hasta 5 días hábiles.",
      btn: "Hablar por WhatsApp",
    },
    footer: {
      about: "Builder de Ingeniería Creativa. Desarrollamos productos digitales y plataformas a medida — sistemas, marketplaces, automatizaciones e IA aplicada.",
      location: "Lucas do Rio Verde, MT · Brasil",
      cols: [
        { title: "Empresa", items: [
          { label: "Sobre", href: "#sobre" },
          { label: "Portafolio Naveo", href: "#portfolio" },
          { label: "Casos de cliente", href: "#cases" },
          { label: "Método", href: "#metodo" },
        ]},
        { title: "Productos propios", items: [
          { label: "Agrodesapego ↗", href: "https://agrodesapego.com.br" },
          { label: "Cruzeta Club ↗", href: "https://cruzetaclub.com.br" },
          { label: "Navbarber ↗", href: "https://navbarber.com.br" },
          { label: "Pharma Genius (próximamente)", href: "#" },
        ]},
        { title: "Contacto", items: [
          { label: "contato@naveo.com.br", href: "mailto:contato@naveo.com.br" },
          { label: "WhatsApp ↗", href: "https://wa.me/5565996865004" },
          { label: "LinkedIn ↗", href: "https://www.linkedin.com" },
          { label: "Instagram ↗", href: "https://www.instagram.com/naveoce" },
        ]},
        { title: "Idioma", items: [
          { label: "Português", href: "/" },
          { label: "English", href: "/en" },
          { label: "Español", href: "/es" },
        ]},
      ],
      copyright: "© {year} Naveo Engenharia Criativa.",
      tag: "Construido con Ingeniería Creativa.",
    },
    seo: {
      title: "Naveo · Ingeniería Creativa",
      description: "Desarrollamos productos digitales y plataformas personalizadas para tu negocio. Sistemas, marketplaces, automatizaciones, IA aplicada. Construimos, integramos y sostenemos la tecnología que tu operación necesita.",
    },
  },
};

// =================================================================
// HELPERS
// =================================================================
function headlineHTML(words) {
  return words.map(w => {
    const inner = w.em ? `<em>${escapeHtml(w.text)}</em>` : escapeHtml(w.text);
    return `<span class="word"><span>${inner}</span></span>`;
  }).join(" ");
}

function langPaths(currentLang) {
  return {
    pt: currentLang === "pt" ? "/" : "/",
    en: currentLang === "en" ? "/en" : "/en",
    es: currentLang === "es" ? "/es" : "/es",
  };
}

// =================================================================
// PAGE RENDERER (homepage)
// =================================================================
function renderPage(lang) {
  const t = i18n[lang];
  const path = lang === "pt" ? "/" : `/${lang}`;
  const canonical = `${SITE_BASE}${path}`;
  const fullTitle = t.seo.title;
  const desc = t.seo.description;
  const year = new Date().getFullYear();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Naveo Engenharia Criativa",
    url: SITE_BASE,
    logo: `${SITE_BASE}/assets/logo-verde.webp`,
    description: desc,
    foundingLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Lucas do Rio Verde", addressRegion: "MT", addressCountry: "BR" } },
    founders: [
      { "@type": "Person", name: "Jonathan Tebaldi" },
      { "@type": "Person", name: "Vitor Righi" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "tebaldi@naveo.com.br",
      telephone: "+55-65-99686-5004",
      areaServed: "BR",
      availableLanguage: ["pt-BR", "en", "es"],
    },
  };

  const hreflang = [
    `<link rel="alternate" hreflang="pt-BR" href="${SITE_BASE}/" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_BASE}/en" />`,
    `<link rel="alternate" hreflang="es" href="${SITE_BASE}/es" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_BASE}/" />`,
  ].join("\n  ");

  // === marquee duplicated for seamless loop
  const marqueeItems = t.marquee.concat(t.marquee).map((m, idx) =>
    `<span class="marquee__item${idx % 2 === 1 ? " dim" : ""}">${escapeHtml(m)}</span>`
  ).join("\n        ");

  return `<!doctype html>
<html lang="${t.locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <link rel="canonical" href="${canonical}" />

  ${hreflang}

  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${t.locale}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(desc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${OG_IMAGE}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(desc)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />

  <meta name="theme-color" content="#000000" />
  <meta name="color-scheme" content="dark" />

  <link rel="icon" type="image/webp" href="/assets/isotipo-verde.webp" />
  <link rel="apple-touch-icon" href="/assets/isotipo-verde.webp" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" />

  <link rel="stylesheet" href="/style.css" />

  <script type="application/ld+json">
${JSON.stringify(orgJsonLd, null, 2)}
  </script>
</head>
<body>

  <!-- Loader -->
  <div class="loader" aria-hidden="true">
    <img src="/assets/isotipo-verde.webp" alt="" class="loader__mark" />
  </div>

  <!-- Grain overlay -->
  <div class="grain" aria-hidden="true"></div>

  <!-- Scroll progress -->
  <div class="scroll-progress" aria-hidden="true"></div>

  <!-- Custom cursor -->
  <div class="cursor"></div>
  <div class="cursor-ring"></div>

  <!-- Header -->
  <header class="site-header">
    <a href="${path}" class="site-header__home" aria-label="Início"></a>

    <nav class="site-nav" aria-label="Main">
      <a href="#portfolio">${escapeHtml(t.nav.portfolio)}</a>
      <a href="#metodo">${escapeHtml(t.nav.method)}</a>
      <a href="#cases">${escapeHtml(t.nav.cases)}</a>
      <span class="site-nav__lang">
        <a href="/" class="${lang === "pt" ? "active" : ""}">PT</a>
        <span>·</span>
        <a href="/en" class="${lang === "en" ? "active" : ""}">EN</a>
        <span>·</span>
        <a href="/es" class="${lang === "es" ? "active" : ""}">ES</a>
      </span>
      <a href="https://wa.me/5565996865004" target="_blank" rel="noopener" class="site-nav__cta">${escapeHtml(t.nav.contact)} →</a>
    </nav>
  </header>

  <main>

    <!-- HERO -->
    <section class="hero">
      <canvas id="hero-canvas" class="hero__canvas" aria-hidden="true"></canvas>
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="hero__content">
        <span class="hero__eyebrow">${escapeHtml(t.hero.eyebrow)}</span>
        <h1 class="hero__headline">
          ${headlineHTML(t.hero.headline)}
        </h1>
        <p class="hero__sub">${escapeHtml(t.hero.sub)}</p>
        <div class="hero__ctas">
          <a href="https://wa.me/5565996865004" target="_blank" rel="noopener" class="btn btn--primary magnetic" data-magnetic="0.3">
            <span class="magnetic__inner">${escapeHtml(t.hero.ctaPrimary)} <span class="arrow">↗</span></span>
          </a>
          <a href="#portfolio" class="btn btn--ghost magnetic" data-magnetic="0.2">
            <span class="magnetic__inner">${escapeHtml(t.hero.ctaSecondary)} <span class="arrow">→</span></span>
          </a>
        </div>
      </div>
      <div class="hero__scroll">
        ${escapeHtml(t.hero.scroll)}
        <span class="hero__scroll__line"></span>
      </div>
    </section>

    <!-- Marquee -->
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee">
        ${marqueeItems}
      </div>
    </div>

    <!-- STATS -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.stats.eyebrow)}</span>
          <h2 class="section-title">${escapeHtml(t.stats.title)}</h2>
          <p class="section-lead">${escapeHtml(t.stats.lead)}</p>
        </div>
        <div class="stats-row">
          ${t.stats.items.map(s => `
          <div class="stat reveal">
            <div class="stat__value" data-counter="${s.value}" data-suffix="${escapeHtml(s.suffix || "")}">0</div>
            <div class="stat__label">${escapeHtml(s.label)}</div>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- METHOD horizontal scroll -->
    <section id="metodo" class="method section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.method.eyebrow)}</span>
          <h2 class="section-title">${t.method.title}</h2>
          <p class="section-lead">${escapeHtml(t.method.lead)}</p>
        </div>
      </div>
      <div class="method__horizontal-wrap" role="region" aria-label="${escapeHtml(t.method.aria)}" tabindex="0">
        <div class="method__horizontal">
          ${t.method.steps.map(s => `
          <article class="method-card" data-num="${escapeHtml(s.num)}">
            <div>
              <div class="method-card__num">${escapeHtml(s.num)}</div>
              <h3 class="method-card__title">${escapeHtml(s.title)}</h3>
              <p class="method-card__desc">${escapeHtml(s.desc)}</p>
            </div>
            <ul class="method-card__list">
              ${s.list.map(li => `<li>${escapeHtml(li)}</li>`).join("\n              ")}
            </ul>
          </article>`).join("")}
        </div>
        <div class="method__hint" aria-hidden="true">${escapeHtml(t.method.hint)}</div>
      </div>
    </section>

    <!-- CAPABILITIES -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.capabilities.eyebrow)}</span>
          <h2 class="section-title">${t.capabilities.title}</h2>
          <p class="section-lead">${escapeHtml(t.capabilities.lead)}</p>
        </div>
        <div class="capabilities">
          ${t.capabilities.items.map(c => `
          <div class="capability reveal">
            <div class="capability__icon">${escapeHtml(c.icon)}</div>
            <div>
              <h3 class="capability__title">${escapeHtml(c.title)}</h3>
              <p class="capability__desc">${escapeHtml(c.desc)}</p>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- PORTFOLIO -->
    <section id="portfolio" class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.portfolio.eyebrow)}</span>
          <h2 class="section-title">${t.portfolio.title}</h2>
          <p class="section-lead">${escapeHtml(t.portfolio.lead)}</p>
        </div>
        <div class="portfolio-heroes">
          ${t.portfolio.heroes.map(p => `
          <a href="${p.url}" ${p.url === "#" ? "" : "target=\"_blank\" rel=\"noopener\""} class="portfolio-hero reveal">
            <div class="portfolio-hero__media" style="background-image:url('${p.img}')"></div>
            <div class="portfolio-hero__overlay"></div>
            <div class="portfolio-hero__link">↗</div>
            <div class="portfolio-hero__content">
              <span class="portfolio-hero__tag">${escapeHtml(p.tag)}</span>
              <h3 class="portfolio-hero__name">${escapeHtml(p.name)}</h3>
              <p class="portfolio-hero__desc">${escapeHtml(p.desc)}</p>
            </div>
          </a>`).join("")}
        </div>
        <div class="portfolio-mini-grid">
          ${t.portfolio.mini.map((p, i) => `
          <div class="portfolio-mini reveal" style="transition-delay: ${(i * 0.06).toFixed(2)}s">
            <div class="portfolio-mini__name">${escapeHtml(p.name)}</div>
            <div class="portfolio-mini__tag">${escapeHtml(p.tag)}</div>
            <div class="portfolio-mini__arrow" aria-hidden="true">↗</div>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- CASES -->
    <section id="cases" class="section section--lg">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.cases.eyebrow)}</span>
          <h2 class="section-title">${t.cases.title}</h2>
          <p class="section-lead">${escapeHtml(t.cases.lead)}</p>
        </div>
        <div class="cases">
          ${t.cases.items.map((c, idx) => `
          <article class="case ${idx % 2 === 1 ? "case--reverse" : ""}">
            <div class="case__media reveal">
              <div class="case__media__inner" style="background-image:url('${c.img}')"></div>
            </div>
            <div class="case__body reveal">
              <div class="case__tag">${escapeHtml(c.tag)}</div>
              <h3 class="case__title">${escapeHtml(c.title)}</h3>
              <p class="case__desc">${escapeHtml(c.desc)}</p>
              <div class="case__quote">${escapeHtml(c.quote)}</div>
              <div class="case__metrics">
                ${c.metrics.map(m => `
                <div class="case__metric">
                  <strong>${escapeHtml(m.v)}</strong>
                  <span>${escapeHtml(m.l)}</span>
                </div>`).join("")}
              </div>
            </div>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <!-- LOGOS -->
    <section class="section section--sm">
      <div class="container">
        <div class="section-head section-head--centered reveal">
          <span class="section-eyebrow">${escapeHtml(t.logos.eyebrow)}</span>
          <h2 class="section-title">${t.logos.title}</h2>
          <p class="section-lead" style="margin-left:auto;margin-right:auto;">${escapeHtml(t.logos.lead)}</p>
        </div>
      </div>
      <div class="logos-marquee reveal" aria-label="${escapeHtml(t.logos.aria)}">
        <div class="logos-marquee__track">
          ${[...CLIENT_LOGOS, ...CLIENT_LOGOS].map(c => {
            const src = resolveClientLogo(c.slug);
            return src
              ? `<div class="logo-chip logo-chip--img" title="${escapeHtml(c.name)}"><img src="${src}" alt="${escapeHtml(c.name)}" loading="lazy" /></div>`
              : `<div class="logo-chip">${escapeHtml(c.name)}</div>`;
          }).join("\n          ")}
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.testimonials.eyebrow)}</span>
          <h2 class="section-title">${t.testimonials.title}</h2>
          <p class="section-lead">${escapeHtml(t.testimonials.lead)}</p>
        </div>
        <div class="testimonials">
          ${t.testimonials.items.map(it => `
          <div class="testimonial reveal">
            <p class="testimonial__quote">${escapeHtml(it.quote)}</p>
            <div class="testimonial__author">
              <div class="testimonial__name">${escapeHtml(it.name)}</div>
              <div class="testimonial__role">${escapeHtml(it.role)}</div>
            </div>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- STACK -->
    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-eyebrow">${escapeHtml(t.stack.eyebrow)}</span>
          <h2 class="section-title">${t.stack.title}</h2>
          <p class="section-lead">${escapeHtml(t.stack.lead)}</p>
        </div>
        <div class="stack-grid reveal">
          ${STACK_BLOCKS.map(b => `
          <div class="stack-cell">
            <img class="stack-cell__icon" src="/assets/stack/${b.slug}.svg" alt="${escapeHtml(b.name)} logo" loading="lazy" width="40" height="40" />
            <div class="stack-cell__name">${escapeHtml(b.name)}</div>
            <div class="stack-cell__type">${escapeHtml(b.type)}</div>
          </div>`).join("")}
        </div>
      </div>
    </section>

    <!-- MANIFESTO -->
    <section id="sobre" class="manifesto">
      <div class="container--narrow">
        <p class="manifesto__quote reveal">${t.manifesto.quote}</p>
        <div class="manifesto__attribution reveal">${escapeHtml(t.manifesto.attr)}</div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-final">
      <div class="container--narrow">
        <div class="cta-final__inner">
          <h2 class="cta-final__title reveal">${t.ctaFinal.title}</h2>
          <p class="cta-final__sub reveal">${escapeHtml(t.ctaFinal.sub)}</p>
          <a href="https://wa.me/5565996865004" target="_blank" rel="noopener" class="btn btn--primary magnetic reveal" data-magnetic="0.3">
            <span class="magnetic__inner">${escapeHtml(t.ctaFinal.btn)} <span class="arrow">↗</span></span>
          </a>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer__big-mark">naveo</div>
      <div class="site-footer__grid">
        <div class="footer-brand">
          <img src="/assets/logo-verde.webp" alt="Naveo" />
          <p>${escapeHtml(t.footer.about)}</p>
          <p style="margin-top:14px;font-size:13px;color:var(--text-faint);">${escapeHtml(t.footer.location)}</p>
        </div>
        ${t.footer.cols.map(col => `
        <div class="footer-col">
          <h4>${escapeHtml(col.title)}</h4>
          <ul>
            ${col.items.map(it => `
            <li><a href="${it.href}" ${it.href.startsWith("http") ? "target=\"_blank\" rel=\"noopener\"" : ""}>${escapeHtml(it.label)}</a></li>`).join("")}
          </ul>
        </div>`).join("")}
      </div>
      <div class="site-footer__bottom">
        <div>${escapeHtml(t.footer.copyright.replace("{year}", year))}</div>
        <div>${escapeHtml(t.footer.tag)}</div>
      </div>
    </div>
  </footer>

  <script type="module" src="/js/three-scene.js"></script>
  <script type="module" src="/js/main.js"></script>

</body>
</html>`;
}

// =================================================================
// BRAND DOCS (mantém comportamento existente)
// =================================================================
function brandDocsShell({ title, body, active }) {
  const navItems = [
    { slug: "index", href: "/brand/", label: "Início" },
    { slug: "brand-guideline", href: "/brand/brand-guideline", label: "Brand Guideline" },
    { slug: "metodo", href: "/brand/metodo", label: "Método Engenharia Criativa" },
  ];
  const nav = navItems
    .map(i => `<a class="nav-link${i.slug === active ? " active" : ""}" href="${i.href}">${escapeHtml(i.label)}</a>`)
    .join("\n          ");
  const crumbs = active === "index" ? "" : `<div class="crumbs">Documentação Naveo · ${escapeHtml(navItems.find(n => n.slug === active)?.label ?? "")}</div>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="googlebot" content="noindex, nofollow" />
  <meta name="referrer" content="no-referrer" />
  <title>${escapeHtml(title)} · Naveo</title>
  <link rel="icon" type="image/webp" href="/assets/isotipo-verde.webp" />
  <link rel="stylesheet" href="/brand/style.css" />
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <a class="brand" href="/brand/">
        <div class="brand-mark">N</div>
        <div>
          <div class="brand-name">Naveo</div>
          <div class="brand-tag">Creative Engineering · Docs</div>
        </div>
      </a>
      <div class="nav-section">Documentação</div>
      <nav>
          ${nav}
      </nav>
      <div class="nav-section" style="margin-top:32px;">Site público</div>
      <a class="nav-link" href="/" style="margin-left:0;">← Voltar ao site</a>
      <div class="sidebar-foot">Interno · Versão 1.0<br />Maio 2026</div>
    </aside>
    <main class="main">
      ${crumbs}
      <article class="content">
${body}
      </article>
    </main>
  </div>
</body>
</html>`;
}

function renderMarkdownFile(srcPath) {
  return marked.parse(readFileSync(srcPath, "utf8"));
}

// =================================================================
// WRITE PUBLIC SITE
// =================================================================
mkdirSync(resolve(DIST, "en"), { recursive: true });
mkdirSync(resolve(DIST, "es"), { recursive: true });
mkdirSync(resolve(DIST, "js"), { recursive: true });
mkdirSync(resolve(DIST, "brand"), { recursive: true });

writeFileSync(resolve(DIST, "index.html"), renderPage("pt"));
writeFileSync(resolve(DIST, "en/index.html"), renderPage("en"));
writeFileSync(resolve(DIST, "es/index.html"), renderPage("es"));

// =================================================================
// WRITE BRAND DOCS
// =================================================================
const brandIndexBody = `
        <section class="hero">
          <h1>Documentação Naveo</h1>
          <p>Manual de marca, método e referência interna. Versão consolidada — Maio 2026.</p>
        </section>
        <div class="cards">
          <a class="card" href="/brand/brand-guideline">
            <div class="card-tag">Estratégico</div>
            <h2 class="card-title">Brand Guideline</h2>
            <p class="card-desc">Identidade, posicionamento, ICP, tom de voz, frases aprovadas e banidas, estrutura do site, pricing e método. 16 seções.</p>
            <div class="card-cta">Abrir →</div>
          </a>
          <a class="card" href="/brand/metodo">
            <div class="card-tag">Copy de página</div>
            <h2 class="card-title">Método Engenharia Criativa</h2>
            <p class="card-desc">Os 6 passos do método, copy pronta da página <code>/engenharia-criativa</code> do site.</p>
            <div class="card-cta">Abrir →</div>
          </a>
        </div>
        <div class="meta-grid">
          <div class="meta-item"><div class="meta-label">Categoria</div><div class="meta-value">Builder de Engenharia Criativa</div></div>
          <div class="meta-item"><div class="meta-label">Sede</div><div class="meta-value">Lucas do Rio Verde, MT</div></div>
          <div class="meta-item"><div class="meta-label">Sócios</div><div class="meta-value">Jonathan Tebaldi · Vitor Righi</div></div>
          <div class="meta-item"><div class="meta-label">Status</div><div class="meta-value">Documento vivo · v1.0</div></div>
        </div>`;

writeFileSync(resolve(DIST, "brand/index.html"), brandDocsShell({ title: "Documentação", body: brandIndexBody, active: "index" }));
writeFileSync(resolve(DIST, "brand/brand-guideline.html"), brandDocsShell({
  title: "Brand Guideline",
  body: renderMarkdownFile(resolve(ROOT, "BRAND_GUIDELINE.md")),
  active: "brand-guideline",
}));
writeFileSync(resolve(DIST, "brand/metodo.html"), brandDocsShell({
  title: "Método Engenharia Criativa",
  body: renderMarkdownFile(resolve(ROOT, "PAGINA_METODO_ENGENHARIA_CRIATIVA.md")),
  active: "metodo",
}));

// =================================================================
// ROBOTS, SITEMAP, HEADERS
// =================================================================
writeFileSync(resolve(DIST, "robots.txt"), `# Naveo
User-agent: *
Allow: /
Disallow: /brand/
Disallow: /brand

Sitemap: ${SITE_BASE}/sitemap.xml
`);

const today = new Date().toISOString().split("T")[0];
const sitemapUrls = [
  { loc: `${SITE_BASE}/`, alts: { "pt-BR": `${SITE_BASE}/`, en: `${SITE_BASE}/en`, es: `${SITE_BASE}/es` } },
  { loc: `${SITE_BASE}/en`, alts: { "pt-BR": `${SITE_BASE}/`, en: `${SITE_BASE}/en`, es: `${SITE_BASE}/es` } },
  { loc: `${SITE_BASE}/es`, alts: { "pt-BR": `${SITE_BASE}/`, en: `${SITE_BASE}/en`, es: `${SITE_BASE}/es` } },
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    ${Object.entries(u.alts).map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`).join("\n    ")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_BASE}/" />
  </url>`).join("\n")}
</urlset>
`;
writeFileSync(resolve(DIST, "sitemap.xml"), sitemapXml);

writeFileSync(resolve(DIST, "_headers"), `/brand/*
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex

/brand
  X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex
`);

console.log("✓ build complete");
console.log("  Public site (PT/EN/ES):");
console.log("    - dist/index.html");
console.log("    - dist/en/index.html");
console.log("    - dist/es/index.html");
console.log("  Assets:");
console.log("    - dist/style.css");
console.log("    - dist/js/main.js");
console.log("    - dist/js/three-scene.js");
console.log("  SEO:");
console.log("    - dist/robots.txt");
console.log("    - dist/sitemap.xml (com hreflang)");
console.log("    - dist/_headers (noindex /brand)");
console.log("  Brand docs (noindex):");
console.log("    - dist/brand/*");
