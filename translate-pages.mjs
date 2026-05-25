// Translate all PT pages to EN and ES
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "dist");

// PT source pages (relative to dist/)
const SOURCES = [
  "index.html",
  "quem-somos/index.html",
  "cases/index.html",
  "cases/agrodesapego/index.html",
  "cases/cruzetaclub/index.html",
  "cases/navbarber/index.html",
  "cases/pharmagenius/index.html",
  "cases/obrasimples/index.html",
  "cases/cuidarbemcard/index.html",
  "cases/greenfuturehub/index.html",
  "cases/centrodediagnostico/index.html",
  "blog/index.html",
  "blog/jornada-empreendedor/index.html",
  "blog/performance-em-vendas/index.html",
  "blog/mentoria-funil-de-vendas/index.html",
  "blog/sistema-aquisicao-clientes/index.html",
  "blog/marketing-orientado-dados/index.html",
  "blog/funil-vendas-conversoes/index.html",
  "contato/index.html",
];

// ============================================================
// COMMON TRANSLATIONS (UI, nav, buttons, eyebrows)
// ============================================================
const DICTS = {
  en: {
    // <html lang>
    'lang="pt-BR"': 'lang="en"',
    // Nav
    ">Início<": ">Home<",
    ">Portfólio<": ">Portfolio<",
    ">Cases<": ">Cases<",
    ">Blog<": ">Blog<",
    ">Quem somos<": ">About<",
    ">Contato<": ">Contact<",
    ">Agendar diagnóstico →<": ">Book diagnosis →<",
    "Agendar diagnóstico <span class=\"arrow\">": "Book diagnosis <span class=\"arrow\">",
    "Agendar conversa <span class=\"arrow\">": "Schedule conversation <span class=\"arrow\">",
    "Chamar no WhatsApp <span class=\"arrow\">": "WhatsApp us <span class=\"arrow\">",
    // Common eyebrows
    ">Onde estamos<": ">Where we are<",
    ">Quem confia<": ">Trusted by<",
    ">Como trabalhamos<": ">How we work<",
    ">O que construímos<": ">What we build<",
    ">Portfólio Naveo<": ">Naveo Portfolio<",
    ">Cases de cliente<": ">Client cases<",
    ">Stack<": ">Stack<",
    ">Fale com a gente<": ">Talk to us<",
    ">Vamos conversar<": ">Let&#39;s talk<",
    ">Skin in the game<": ">Skin in the game<",
    ">Por que a Naveo<": ">Why Naveo<",
    ">Quem faz acontecer<": ">Who makes it happen<",
    ">Metodologia<": ">Methodology<",
    ">Histórias de transformação<": ">Transformation stories<",
    ">Nosso portfólio de sucesso<": ">Our successful portfolio<",
    ">Outras formas<": ">Other ways<",
    ">Desafio<": ">Challenge<",
    ">Solução<": ">Solution<",
    ">Resultado<": ">Result<",
    // Footer headings
    "<h4>Empresa</h4>": "<h4>Company</h4>",
    "<h4>Produtos próprios</h4>": "<h4>Our products</h4>",
    "<h4>Contato</h4>": "<h4>Contact</h4>",
    "<h4>Idioma</h4>": "<h4>Language</h4>",
    "Quem somos</a></li>": "About</a></li>",
    "Portfólio Naveo</a></li>": "Naveo Portfolio</a></li>",
    "Cases de cliente</a></li>": "Client cases</a></li>",
    "Blog</a></li>": "Blog</a></li>",
    "Contato</a></li>": "Contact</a></li>",
    "Pharma Genius (em breve)": "Pharma Genius (soon)",
    // Form
    "Nome completo": "Full name",
    "E-mail": "Email",
    "Telefone com WhatsApp": "Phone with WhatsApp",
    "Nome da empresa": "Company name",
    "Qual seu interesse principal?": "What is your main interest?",
    "Mensagem": "Message",
    "Digite seu nome completo": "Type your full name",
    "Digite o nome da empresa": "Type the company name",
    "Selecione o que mais se aproxima": "Select what best matches",
    "Transformação de negócios": "Business transformation",
    "Sistemas sob medida": "Custom systems",
    "IA aplicada / Agentes": "Applied AI / Agents",
    "Marketplace": "Marketplace",
    "Fintech / Pagamentos": "Fintech / Payments",
    "Performance / Vendas": "Performance / Sales",
    "Site de alta conversão": "High-conversion website",
    "Outro": "Other",
    "Concordo com a política de privacidade e autorizo o tratamento dos meus dados pra fins de contato comercial.": "I agree with the privacy policy and authorize the processing of my data for commercial contact purposes.",
    "Ao enviar, abrimos seu WhatsApp com a mensagem pré-preenchida pra fechar o agendamento.": "When you submit, we open your WhatsApp with the pre-filled message to close the appointment.",
    "Conta o que tá acontecendo na operação. Quanto mais contexto, melhor o diagnóstico.": "Tell us what&#39;s happening in your operation. The more context, the better the diagnosis.",
    "Enviar <span class=\"arrow\">": "Submit <span class=\"arrow\">",
    // CTA Final
    "Bora <em>construir</em> junto?": "Let&#39;s <em>build</em> together?",
    "Bora construir junto?": "Let&#39;s build together?",
    "Agendar conversa": "Schedule conversation",
    "Chamar no WhatsApp": "WhatsApp us",
    "Diagnóstico de 1h, gratuito e sem compromisso.": "1-hour diagnosis, free and no strings attached.",
    "Estamos prontos para transformar sua visão em um negócio real e lucrativo. O primeiro passo para redefinir seu negócio começa com uma conversa.": "We are ready to turn your vision into a real and profitable business. The first step begins with a conversation.",
    // Common buttons / links
    "Ver cases": "See cases",
    "Ver todos os cases": "See all cases",
    "Quero ser um case de sucesso": "I want to be a success case",
    "Quero construir o meu também": "I want to build mine too",
    "Veja nossos cases": "See our cases",
    "Conheça nossa história": "Read our story",
    "Visitar o site": "Visit site",
    "Ler mais": "Read more",
    "Próxima →": "Next →",
    "← Anterior": "← Previous",
    "Voltar pro blog": "Back to blog",
    "← Voltar pro blog": "← Back to blog",
    "Continue lendo": "Keep reading",
    // Footer brand text
    "Builder de Engenharia Criativa. Desenvolvemos produtos digitais e plataformas sob medida — sistemas, marketplaces, automações e IA aplicada.":
      "Creative Engineering Builder. We develop digital products and tailored platforms — systems, marketplaces, automations and applied AI.",
    "Lucas do Rio Verde, MT · Brasil": "Lucas do Rio Verde, MT · Brazil",
    "© 2026 Naveo Engenharia Criativa.": "© 2026 Naveo Creative Engineering.",
    "Construído com Engenharia Criativa.": "Built with Creative Engineering.",
    // Hero
    "Builder de Engenharia Criativa": "Creative Engineering Builder",
    "Engenharia Criativa que <em>transforma</em> negócios.": "Creative Engineering that <em>transforms</em> business.",
    "Sistemas, marketplaces, automações e IA aplicada. Construímos, integramos e sustentamos a operação digital que seu negócio precisa pra escalar.":
      "Systems, marketplaces, automations and applied AI. We build, integrate and sustain the digital operation your business needs to scale.",
  },
  es: {
    'lang="pt-BR"': 'lang="es"',
    ">Início<": ">Inicio<",
    ">Portfólio<": ">Portafolio<",
    ">Cases<": ">Casos<",
    ">Blog<": ">Blog<",
    ">Quem somos<": ">Quiénes somos<",
    ">Contato<": ">Contacto<",
    ">Agendar diagnóstico →<": ">Agendar diagnóstico →<",
    "Agendar diagnóstico <span class=\"arrow\">": "Agendar diagnóstico <span class=\"arrow\">",
    "Agendar conversa <span class=\"arrow\">": "Agendar conversación <span class=\"arrow\">",
    "Chamar no WhatsApp <span class=\"arrow\">": "Llamar por WhatsApp <span class=\"arrow\">",
    ">Onde estamos<": ">Dónde estamos<",
    ">Quem confia<": ">Quién confía<",
    ">Como trabalhamos<": ">Cómo trabajamos<",
    ">O que construímos<": ">Lo que construimos<",
    ">Portfólio Naveo<": ">Portafolio Naveo<",
    ">Cases de cliente<": ">Casos de cliente<",
    ">Stack<": ">Stack<",
    ">Fale com a gente<": ">Habla con nosotros<",
    ">Vamos conversar<": ">Conversemos<",
    ">Skin in the game<": ">Skin in the game<",
    ">Por que a Naveo<": ">Por qué Naveo<",
    ">Quem faz acontecer<": ">Quién lo hace posible<",
    ">Metodologia<": ">Metodología<",
    ">Histórias de transformação<": ">Historias de transformación<",
    ">Nosso portfólio de sucesso<": ">Nuestro portafolio de éxito<",
    ">Outras formas<": ">Otras formas<",
    ">Desafio<": ">Desafío<",
    ">Solução<": ">Solución<",
    ">Resultado<": ">Resultado<",
    "<h4>Empresa</h4>": "<h4>Empresa</h4>",
    "<h4>Produtos próprios</h4>": "<h4>Productos propios</h4>",
    "<h4>Contato</h4>": "<h4>Contacto</h4>",
    "<h4>Idioma</h4>": "<h4>Idioma</h4>",
    "Quem somos</a></li>": "Quiénes somos</a></li>",
    "Portfólio Naveo</a></li>": "Portafolio Naveo</a></li>",
    "Cases de cliente</a></li>": "Casos de cliente</a></li>",
    "Blog</a></li>": "Blog</a></li>",
    "Contato</a></li>": "Contacto</a></li>",
    "Pharma Genius (em breve)": "Pharma Genius (próximamente)",
    "Nome completo": "Nombre completo",
    "E-mail": "Correo electrónico",
    "Telefone com WhatsApp": "Teléfono con WhatsApp",
    "Nome da empresa": "Nombre de la empresa",
    "Qual seu interesse principal?": "¿Cuál es tu interés principal?",
    "Mensagem": "Mensaje",
    "Digite seu nome completo": "Escribe tu nombre completo",
    "Digite o nome da empresa": "Escribe el nombre de la empresa",
    "Selecione o que mais se aproxima": "Selecciona lo que más se acerca",
    "Transformação de negócios": "Transformación de negocios",
    "Sistemas sob medida": "Sistemas a medida",
    "IA aplicada / Agentes": "IA aplicada / Agentes",
    "Marketplace": "Marketplace",
    "Fintech / Pagamentos": "Fintech / Pagos",
    "Performance / Vendas": "Performance / Ventas",
    "Site de alta conversão": "Sitio de alta conversión",
    "Outro": "Otro",
    "Concordo com a política de privacidade e autorizo o tratamento dos meus dados pra fins de contato comercial.": "Acepto la política de privacidad y autorizo el tratamiento de mis datos con fines de contacto comercial.",
    "Ao enviar, abrimos seu WhatsApp com a mensagem pré-preenchida pra fechar o agendamento.": "Al enviar, abrimos tu WhatsApp con el mensaje pre-llenado para cerrar la cita.",
    "Conta o que tá acontecendo na operação. Quanto mais contexto, melhor o diagnóstico.": "Cuenta qué está pasando en la operación. Cuanto más contexto, mejor el diagnóstico.",
    "Enviar <span class=\"arrow\">": "Enviar <span class=\"arrow\">",
    "Bora <em>construir</em> junto?": "¿Vamos a <em>construir</em> juntos?",
    "Bora construir junto?": "¿Vamos a construir juntos?",
    "Agendar conversa": "Agendar conversación",
    "Chamar no WhatsApp": "Llamar por WhatsApp",
    "Diagnóstico de 1h, gratuito e sem compromisso.": "Diagnóstico de 1h, gratuito y sin compromiso.",
    "Estamos prontos para transformar sua visão em um negócio real e lucrativo. O primeiro passo para redefinir seu negócio começa com uma conversa.": "Estamos listos para transformar tu visión en un negocio real y rentable. El primer paso comienza con una conversación.",
    "Ver cases": "Ver casos",
    "Ver todos os cases": "Ver todos los casos",
    "Quero ser um case de sucesso": "Quiero ser un caso de éxito",
    "Quero construir o meu também": "Quiero construir el mío también",
    "Veja nossos cases": "Mira nuestros casos",
    "Conheça nossa história": "Conoce nuestra historia",
    "Visitar o site": "Visitar el sitio",
    "Ler mais": "Leer más",
    "Próxima →": "Siguiente →",
    "← Anterior": "← Anterior",
    "Voltar pro blog": "Volver al blog",
    "← Voltar pro blog": "← Volver al blog",
    "Continue lendo": "Sigue leyendo",
    "Builder de Engenharia Criativa. Desenvolvemos produtos digitais e plataformas sob medida — sistemas, marketplaces, automações e IA aplicada.":
      "Builder de Ingeniería Creativa. Desarrollamos productos digitales y plataformas a medida — sistemas, marketplaces, automatizaciones e IA aplicada.",
    "Lucas do Rio Verde, MT · Brasil": "Lucas do Rio Verde, MT · Brasil",
    "© 2026 Naveo Engenharia Criativa.": "© 2026 Naveo Ingeniería Creativa.",
    "Construído com Engenharia Criativa.": "Construido con Ingeniería Creativa.",
    "Builder de Engenharia Criativa": "Builder de Ingeniería Creativa",
    "Engenharia Criativa que <em>transforma</em> negócios.": "Ingeniería Creativa que <em>transforma</em> negocios.",
    "Sistemas, marketplaces, automações e IA aplicada. Construímos, integramos e sustentamos a operação digital que seu negócio precisa pra escalar.":
      "Sistemas, marketplaces, automatizaciones e IA aplicada. Construimos, integramos y sostenemos la operación digital que tu negocio necesita para escalar.",
  },
};

// ============================================================
// PAGE-SPECIFIC TRANSLATIONS (long content per file)
// ============================================================
const PAGE_DICTS = {
  "index.html": {
    en: {
      // Capacidades section
      "Capacidades técnicas em <em>seis frentes</em>.": "Technical capabilities in <em>six fronts</em>.",
      "Cliente não compra capacidade — compra resolução de dor. Mas o conjunto técnico precisa estar pronto.":
        "The client doesn&#39;t buy capability — they buy pain relief. But the technical set must be ready.",
      ">Sistemas sob medida<": ">Custom systems<",
      "Plataformas web, PWAs, ERPs internos, GEDs e sistemas multi-unidade desenhados pra sua operação.":
        "Web platforms, PWAs, internal ERPs, DMS and multi-unit systems designed for your operation.",
      ">Marketplaces com IA<": ">Marketplaces with AI<",
      "Compra e venda com agentes inteligentes negociando via WhatsApp, automação de leads e gestão integrada.":
        "Buying and selling with intelligent agents negotiating via WhatsApp, lead automation and integrated management.",
      ">Automações inteligentes<": ">Smart automations<",
      "Fluxos automatizados com n8n, integrações por API, agentes que substituem trabalho manual repetitivo.":
        "Automated workflows with n8n, API integrations, agents that replace repetitive manual work.",
      ">IA aplicada<": ">Applied AI<",
      "Agentes negociadores, OCR, classificação automática, análise preditiva. IA com propósito e resultado.":
        "Negotiating agents, OCR, automatic classification, predictive analysis. AI with purpose and result.",
      ">Fintech &amp; pagamentos<": ">Fintech &amp; payments<",
      "Conta whitelabel, sub-acquiring, pagamentos integrados, banco digital. Construímos 4 até hoje.":
        "Whitelabel account, sub-acquiring, integrated payments, digital bank. We&#39;ve built 4 so far.",
      ">Sites de alta conversão<": ">High-conversion sites<",
      "Sites institucionais e landing pages que convertem — não decorativos, orientados a métrica.":
        "Institutional sites and landing pages that convert — not decorative, metric-driven.",
      // Processo
      "Do diagnóstico ao go-live, com <em>engenharia em cada passo</em>.":
        "From diagnosis to go-live, with <em>engineering at every step</em>.",
      "Método aplicado em 12 negócios próprios e dezenas de cases de cliente. Investigação profunda, MVP em dias, construção faseada e sustentação contínua.":
        "Method applied across 12 own businesses and dozens of client cases. Deep investigation, MVP in days, phased construction and continuous support.",
      ">Diagnóstico<": ">Diagnosis<",
      "Entendemos seu contexto, ERP atual, fluxos e gargalos. Saímos com briefing estratégico mapeado.":
        "We understand your context, current ERP, flows and bottlenecks. We leave with a mapped strategic brief.",
      ">Visão &amp; Roadmap<": ">Vision &amp; Roadmap<",
      "Proposta com escopo, prazos e investimento. Priorização clara, visão de produto e matriz de riscos.":
        "Proposal with scope, deadlines and investment. Clear prioritization, product vision and risk matrix.",
      ">Construção faseada<": ">Phased construction<",
      "Entregas a cada 15 dias, painel Notion compartilhado, validação contínua. Você vê o produto crescendo.":
        "Releases every 15 days, shared Notion dashboard, continuous validation. You see the product growing.",
      ">Integração &amp; Go-Live<": ">Integration &amp; Go-Live<",
      "Conexão com ERP atual via API, treinamento da equipe, conformidade LGPD, go-live faseado e seguro.":
        "Connection to current ERP via API, team training, LGPD compliance, phased and safe go-live.",
      ">Sustentação contínua<": ">Continuous support<",
      "10h técnicas/mês, suporte WhatsApp em 4h, garantia de 90 dias pós go-live, roadmap evolutivo trimestral.":
        "10h technical/month, WhatsApp support in 4h, 90-day post go-live warranty, quarterly evolving roadmap.",
      // Portfolio
      "12 empresas próprias. <em>Skin in the game</em> de verdade.":
        "12 own companies. Real <em>skin in the game</em>.",
      "Antes de oferecer pra você, construímos pros nossos. Cada negócio próprio é um laboratório vivo do método — fintech, agro, saúde, comunidade, automação.":
        "Before offering to you, we build for ourselves. Each own business is a living lab of the method — fintech, agro, health, community, automation.",
      "Venda de máquinas agrícolas com IA negociadora": "Agricultural machinery sales with AI negotiator",
      "Gestão de clubes de carros": "Car club management",
      "Gestão para barbearias modernas": "Management for modern barbershops",
      "Plataforma farmacêutica · lançamento próximo": "Pharmaceutical platform · launching soon",
      "12 negócios próprios em diferentes setores — e contando.": "12 own businesses in different sectors — and counting.",
      // Cases
      "Você nos traz a dor. <em>A gente desenvolve.</em>": "You bring us the pain. <em>We develop the solution.</em>",
      "Empresas que chegaram com uma demanda pontual e saíram com uma operação digital completa.":
        "Companies that came with a specific demand and left with a complete digital operation.",
      // Partners
      "Soluções únicas.<br/><em>Resultados concretos.</em>": "Unique solutions.<br/><em>Concrete results.</em>",
      "Construímos junto com empresas líderes em diferentes setores — agro, saúde, construção, fintech, varejo, ESG. De redes regionais a sistemas cooperativos: quem entra no nosso barco contrata parceria, não fornecedor.":
        "We build alongside leading companies in different sectors — agro, health, construction, fintech, retail, ESG. From regional networks to cooperative systems: whoever joins our boat hires partnership, not vendor.",
      // Stack
      "Tecnologia <em>moderna e batalhada</em>.": "<em>Modern and battle-tested</em> technology.",
      "As ferramentas que usamos pra construir produtos que escalam — testadas em 12 negócios próprios.":
        "The tools we use to build products that scale — tested in 12 own businesses.",
    },
    es: {
      "Capacidades técnicas em <em>seis frentes</em>.": "Capacidades técnicas en <em>seis frentes</em>.",
      "Cliente não compra capacidade — compra resolução de dor. Mas o conjunto técnico precisa estar pronto.":
        "El cliente no compra capacidad — compra resolución de dolor. Pero el conjunto técnico necesita estar listo.",
      ">Sistemas sob medida<": ">Sistemas a medida<",
      "Plataformas web, PWAs, ERPs internos, GEDs e sistemas multi-unidade desenhados pra sua operação.":
        "Plataformas web, PWAs, ERPs internos, GEDs y sistemas multi-unidad diseñados para tu operación.",
      ">Marketplaces com IA<": ">Marketplaces con IA<",
      "Compra e venda com agentes inteligentes negociando via WhatsApp, automação de leads e gestão integrada.":
        "Compra y venta con agentes inteligentes negociando vía WhatsApp, automatización de leads y gestión integrada.",
      ">Automações inteligentes<": ">Automatizaciones inteligentes<",
      "Fluxos automatizados com n8n, integrações por API, agentes que substituem trabalho manual repetitivo.":
        "Flujos automatizados con n8n, integraciones por API, agentes que reemplazan trabajo manual repetitivo.",
      ">IA aplicada<": ">IA aplicada<",
      "Agentes negociadores, OCR, classificação automática, análise preditiva. IA com propósito e resultado.":
        "Agentes negociadores, OCR, clasificación automática, análisis predictivo. IA con propósito y resultado.",
      ">Fintech &amp; pagamentos<": ">Fintech &amp; pagos<",
      "Conta whitelabel, sub-acquiring, pagamentos integrados, banco digital. Construímos 4 até hoje.":
        "Cuenta whitelabel, sub-acquiring, pagos integrados, banco digital. Hemos construido 4 hasta hoy.",
      ">Sites de alta conversão<": ">Sitios de alta conversión<",
      "Sites institucionais e landing pages que convertem — não decorativos, orientados a métrica.":
        "Sitios institucionales y landing pages que convierten — no decorativos, orientados a métricas.",
      "Do diagnóstico ao go-live, com <em>engenharia em cada passo</em>.":
        "Del diagnóstico al go-live, con <em>ingeniería en cada paso</em>.",
      "Método aplicado em 12 negócios próprios e dezenas de cases de cliente. Investigação profunda, MVP em dias, construção faseada e sustentação contínua.":
        "Método aplicado en 12 negocios propios y decenas de casos de cliente. Investigación profunda, MVP en días, construcción por fases y sostenimiento continuo.",
      ">Diagnóstico<": ">Diagnóstico<",
      "Entendemos seu contexto, ERP atual, fluxos e gargalos. Saímos com briefing estratégico mapeado.":
        "Entendemos tu contexto, ERP actual, flujos y cuellos de botella. Salimos con briefing estratégico mapeado.",
      ">Visão &amp; Roadmap<": ">Visión &amp; Roadmap<",
      "Proposta com escopo, prazos e investimento. Priorização clara, visão de produto e matriz de riscos.":
        "Propuesta con alcance, plazos e inversión. Priorización clara, visión de producto y matriz de riesgos.",
      ">Construção faseada<": ">Construcción por fases<",
      "Entregas a cada 15 dias, painel Notion compartilhado, validação contínua. Você vê o produto crescendo.":
        "Entregas cada 15 días, panel Notion compartido, validación continua. Ves el producto creciendo.",
      ">Integração &amp; Go-Live<": ">Integración &amp; Go-Live<",
      "Conexão com ERP atual via API, treinamento da equipe, conformidade LGPD, go-live faseado e seguro.":
        "Conexión con ERP actual vía API, capacitación del equipo, conformidad LGPD, go-live por fases y seguro.",
      ">Sustentação contínua<": ">Sostenimiento continuo<",
      "10h técnicas/mês, suporte WhatsApp em 4h, garantia de 90 dias pós go-live, roadmap evolutivo trimestral.":
        "10h técnicas/mes, soporte WhatsApp en 4h, garantía de 90 días post go-live, roadmap evolutivo trimestral.",
      "12 empresas próprias. <em>Skin in the game</em> de verdade.":
        "12 empresas propias. <em>Skin in the game</em> de verdad.",
      "Antes de oferecer pra você, construímos pros nossos. Cada negócio próprio é um laboratório vivo do método — fintech, agro, saúde, comunidade, automação.":
        "Antes de ofrecerte, construimos para los nuestros. Cada negocio propio es un laboratorio vivo del método — fintech, agro, salud, comunidad, automatización.",
      "Venda de máquinas agrícolas com IA negociadora": "Venta de maquinaria agrícola con IA negociadora",
      "Gestão de clubes de carros": "Gestión de clubes de autos",
      "Gestão para barbearias modernas": "Gestión para barberías modernas",
      "Plataforma farmacêutica · lançamento próximo": "Plataforma farmacéutica · lanzamiento próximo",
      "12 negócios próprios em diferentes setores — e contando.": "12 negocios propios en diferentes sectores — y contando.",
      "Você nos traz a dor. <em>A gente desenvolve.</em>": "Tú nos traes el dolor. <em>Nosotros desarrollamos.</em>",
      "Empresas que chegaram com uma demanda pontual e saíram com uma operação digital completa.":
        "Empresas que llegaron con una demanda puntual y salieron con una operación digital completa.",
      "Soluções únicas.<br/><em>Resultados concretos.</em>": "Soluciones únicas.<br/><em>Resultados concretos.</em>",
      "Construímos junto com empresas líderes em diferentes setores — agro, saúde, construção, fintech, varejo, ESG. De redes regionais a sistemas cooperativos: quem entra no nosso barco contrata parceria, não fornecedor.":
        "Construimos junto a empresas líderes en distintos sectores — agro, salud, construcción, fintech, retail, ESG. De redes regionales a sistemas cooperativos: quien entra en nuestro barco contrata sociedad, no proveedor.",
      "Tecnologia <em>moderna e batalhada</em>.": "Tecnología <em>moderna y probada</em>.",
      "As ferramentas que usamos pra construir produtos que escalam — testadas em 12 negócios próprios.":
        "Las herramientas que usamos para construir productos que escalan — probadas en 12 negocios propios.",
    },
  },
  "quem-somos/index.html": {
    en: {
      "Engenharia Criativa é o <em>nosso DNA</em>.": "Creative Engineering is <em>our DNA</em>.",
      "Somos visionários, executores e transformadores. Uma equipe multidisciplinar unida pela missão de redefinir o que é possível no mundo dos negócios.":
        "We are visionaries, executors and transformers. A multidisciplinary team united by the mission of redefining what is possible in business.",
      "Uma jornada de <em>transformação</em> e criação.": "A journey of <em>transformation</em> and creation.",
    },
    es: {
      "Engenharia Criativa é o <em>nosso DNA</em>.": "La Ingeniería Creativa es <em>nuestro ADN</em>.",
      "Somos visionários, executores e transformadores. Uma equipe multidisciplinar unida pela missão de redefinir o que é possível no mundo dos negócios.":
        "Somos visionarios, ejecutores y transformadores. Un equipo multidisciplinario unido por la misión de redefinir lo que es posible en el mundo de los negocios.",
      "Uma jornada de <em>transformação</em> e criação.": "Un viaje de <em>transformación</em> y creación.",
    },
  },
  "cases/index.html": {
    en: {
      "Transformações reais, <em>negócios extraordinários</em>.": "Real transformations, <em>extraordinary businesses</em>.",
      "Conheça algumas das jornadas de transformação que conduzimos — criando, escalando e redefinindo negócios em mercados diferentes.":
        "Discover some of the transformation journeys we led — creating, scaling and redefining businesses in different markets.",
      "Não medimos sucesso por <em>métrica abstrata</em>.": "We don&#39;t measure success by <em>abstract metric</em>.",
      "Os negócios que <em>construímos</em> juntos.": "The businesses we <em>built</em> together.",
    },
    es: {
      "Transformações reais, <em>negócios extraordinários</em>.": "Transformaciones reales, <em>negocios extraordinarios</em>.",
      "Conheça algumas das jornadas de transformação que conduzimos — criando, escalando e redefinindo negócios em mercados diferentes.":
        "Conoce algunos de los viajes de transformación que condujimos — creando, escalando y redefiniendo negocios en distintos mercados.",
      "Não medimos sucesso por <em>métrica abstrata</em>.": "No medimos el éxito por <em>métrica abstracta</em>.",
      "Os negócios que <em>construímos</em> juntos.": "Los negocios que <em>construimos</em> juntos.",
    },
  },
  "blog/index.html": {
    en: {
      "Blog Naveo <em>Engenharia Criativa</em>.": "<em>Creative Engineering</em> Blog.",
      "Explore nossos artigos e descubra como a Engenharia Criativa está redefinindo o que é possível no mundo dos negócios.":
        "Explore our articles and discover how Creative Engineering is redefining what&#39;s possible in business.",
      "Quer aplicar isso na <em>sua operação</em>?": "Want to apply this in <em>your operation</em>?",
    },
    es: {
      "Blog Naveo <em>Engenharia Criativa</em>.": "Blog <em>Ingeniería Creativa</em>.",
      "Explore nossos artigos e descubra como a Engenharia Criativa está redefinindo o que é possível no mundo dos negócios.":
        "Explora nuestros artículos y descubre cómo la Ingeniería Creativa está redefiniendo lo que es posible en el mundo de los negocios.",
      "Quer aplicar isso na <em>sua operação</em>?": "¿Quieres aplicar esto en <em>tu operación</em>?",
    },
  },
  "contato/index.html": {
    en: {
      "Transforme sua visão em <em>realidade</em>.": "Turn your vision into <em>reality</em>.",
      "Estamos prontos para ajudar você a criar ou transformar seu negócio através da Engenharia Criativa. O primeiro passo começa com uma conversa.":
        "We are ready to help you create or transform your business through Creative Engineering. The first step begins with a conversation.",
      "Entre em contato": "Get in touch",
      "Diagnóstico de <em>1h</em>, gratuito.": "<em>1-hour</em> diagnosis, free.",
      "Preencha o formulário pra agendar uma consulta estratégica gratuita. Nossa equipe entra em contato em até 24h pra marcar o melhor horário.":
        "Fill out the form to schedule a free strategic consultation. Our team will reach out within 24h to find the best time.",
      "Propostas, parcerias e imprensa": "Proposals, partnerships and press",
      "Resposta em até 4h em horário comercial": "Reply within 4h during business hours",
      "Atendimento Brasil + LATAM": "Coverage Brazil + LATAM",
    },
    es: {
      "Transforme sua visão em <em>realidade</em>.": "Transforma tu visión en <em>realidad</em>.",
      "Estamos prontos para ajudar você a criar ou transformar seu negócio através da Engenharia Criativa. O primeiro passo começa com uma conversa.":
        "Estamos listos para ayudarte a crear o transformar tu negocio a través de la Ingeniería Creativa. El primer paso comienza con una conversación.",
      "Entre em contato": "Contáctanos",
      "Diagnóstico de <em>1h</em>, gratuito.": "Diagnóstico de <em>1h</em>, gratuito.",
      "Preencha o formulário pra agendar uma consulta estratégica gratuita. Nossa equipe entra em contato em até 24h pra marcar o melhor horário.":
        "Completa el formulario para agendar una consultoría estratégica gratuita. Nuestro equipo te contactará en hasta 24h para coordinar el mejor horario.",
      "Propostas, parcerias e imprensa": "Propuestas, alianzas y prensa",
      "Resposta em até 4h em horário comercial": "Respuesta en hasta 4h en horario laboral",
      "Atendimento Brasil + LATAM": "Atención Brasil + LATAM",
    },
  },
};

// ============================================================
// URL prefix rewriter — adds /en/ or /es/ to internal links
// ============================================================
function rewriteUrls(html, lang, srcPath) {
  const prefix = "/" + lang;

  // STEP 1: Save lang switcher block to restore later (so it doesn't get prefixed by site-wide rules)
  // Pattern: site-nav__lang span
  const langBlockRegex = /<span class="site-nav__lang">[\s\S]*?<\/span>/;
  const langBlockMatch = html.match(langBlockRegex);
  const LANG_PLACEHOLDER = "__LANG_BLOCK_PLACEHOLDER__";
  if (langBlockMatch) {
    html = html.replace(langBlockRegex, LANG_PLACEHOLDER);
  }

  // STEP 2: Site-wide URL rewriting
  html = html.replace(/href="\/(quem-somos|cases|blog|contato)(\/?)(#[^"]+)?"/g,
    (_, page, slash, hash) => `href="${prefix}/${page}${slash}${hash || ""}"`);
  html = html.replace(/href="\/(cases|blog)\/([a-z0-9-]+)(\/?)"/g,
    (_, type, slug, slash) => `href="${prefix}/${type}/${slug}${slash}"`);
  html = html.replace(/href="\/(#[^"]+)"/g, `href="${prefix}/$1"`);
  html = html.replace(/href="\/"/g, `href="${prefix}/"`);

  // STEP 3: Reconstruct lang switcher with correct active state
  if (langBlockMatch) {
    // Derive the "logical path" from srcPath (e.g., "cases/agrodesapego/index.html" → "/cases/agrodesapego")
    const logical = srcPath
      .replace(/index\.html$/, "")
      .replace(/\/$/, "");
    const ptHref = "/" + logical;
    const enHref = "/en" + (logical ? "/" + logical : "");
    const esHref = "/es" + (logical ? "/" + logical : "");

    const ptClass = lang === "pt" ? ' class="active"' : "";
    const enClass = lang === "en" ? ' class="active"' : ' class=""';
    const esClass = lang === "es" ? ' class="active"' : ' class=""';

    const newBlock = `<span class="site-nav__lang">
          <a href="${ptHref || "/"}"${ptClass}>PT</a>
          <span>·</span>
          <a href="${enHref}"${enClass}>EN</a>
          <span>·</span>
          <a href="${esHref}"${esClass}>ES</a>
        </span>`;

    html = html.replace(LANG_PLACEHOLDER, newBlock);
  }

  return html;
}

// ============================================================
// MAIN
// ============================================================
let totalGenerated = 0;
for (const src of SOURCES) {
  const srcPath = resolve(DIST, src);
  let pt;
  try {
    pt = readFileSync(srcPath, "utf8");
  } catch (e) {
    console.warn("skip (not found):", src);
    continue;
  }

  for (const lang of ["en", "es"]) {
    let html = pt;

    // Apply common dictionary
    const common = DICTS[lang];
    for (const [from, to] of Object.entries(common)) {
      html = html.split(from).join(to);
    }

    // Apply page-specific dictionary
    const pageDict = PAGE_DICTS[src]?.[lang];
    if (pageDict) {
      for (const [from, to] of Object.entries(pageDict)) {
        html = html.split(from).join(to);
      }
    }

    // Rewrite URLs to include /lang/ prefix + fix lang switcher
    html = rewriteUrls(html, lang, src);

    // Update canonical
    html = html.replace(
      /<link rel="canonical" href="https:\/\/naveo-docs\.pages\.dev[^"]*"/,
      (m) => {
        const url = m.match(/href="([^"]+)"/)[1];
        const path = url.replace("https://naveo-docs.pages.dev", "");
        return `<link rel="canonical" href="https://naveo-docs.pages.dev/${lang}${path === "/" ? "" : path}"`;
      }
    );

    // Write
    const destPath = resolve(DIST, lang, src);
    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, html);
    totalGenerated++;
  }
  console.log("✓", src);
}
console.log(`\nGenerated ${totalGenerated} files (${SOURCES.length} per lang × 2 langs)`);
