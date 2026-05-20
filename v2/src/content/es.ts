import { Content, IMG } from "./types";

export const es: Content = {
  locale: "es",
  nav: { portfolio: "Portafolio", method: "Método", cases: "Casos", about: "Sobre", contact: "Agendar diagnóstico" },
  hero: {
    eyebrow: "Builder de Ingeniería Creativa",
    headline: [
      { text: "Desarrollamos" },
      { text: "productos digitales" },
      { text: "y plataformas" },
      { text: "personalizadas", italic: true },
      { text: "para tu negocio." },
    ],
    sub: "Sistemas, marketplaces, automatizaciones, IA aplicada. Construimos, integramos y sostenemos la tecnología que tu operación necesita.",
    ctaPrimary: "Agendar diagnóstico",
    ctaSecondary: "Ver portafolio",
    scroll: "Desplázate para explorar",
  },
  marquee: ["Ingeniería Creativa", "Sistemas", "Marketplaces", "Automatizaciones", "IA Aplicada", "Fintech", "Sitios de Conversión", "PWA", "Visión de Dueño"],
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
    title: "Capacidades técnicas en seis frentes.",
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
    title: "12 empresas propias. Skin in the game real.",
    lead: "Antes de ofrecértelo, lo construimos para nosotros. Cada negocio propio es un laboratorio vivo del método.",
    heroes: [
      { name: "Agrodesapego", tag: "Marketplace · IA", desc: "Venta de maquinaria agrícola con IA negociadora", url: "https://agrodesapego.com.br", img: IMG.agro },
      { name: "Cruzeta Club", tag: "Comunidad · SaaS", desc: "Gestión de clubes de autos", url: "https://cruzetaclub.com.br", img: IMG.cruzeta },
      { name: "Navbarber", tag: "SaaS Vertical", desc: "Gestión para barberías modernas", url: "https://navbarber.com.br", img: IMG.navbarber },
      { name: "Pharma Genius", tag: "Próximamente", desc: "Plataforma farmacéutica · lanzamiento próximo", url: "#", img: IMG.pharma },
    ],
    mini: [
      { name: "Criativando", tag: "Plataforma" }, { name: "uRocket", tag: "Fintech" }, { name: "VaiPedindo", tag: "Fintech" }, { name: "Farol Entidades", tag: "Comunidad" },
      { name: "automapost", tag: "Automatización" }, { name: "talk", tag: "SaaS" }, { name: "eventeu", tag: "Plataforma" }, { name: "obafestinha", tag: "Plataforma" },
    ],
  },
  cases: {
    eyebrow: "Casos de cliente",
    title: "Tú nos traes el dolor. Nosotros desarrollamos.",
    lead: "Empresas que llegaron con una demanda puntual y salieron con una operación digital completa.",
    items: [
      { tag: "Plataforma operacional · Gestión documental", title: "Facilita Higienização", desc: "Red de higienización industrial con múltiples unidades. Empujaba papel, certificados venciendo sin que nadie viera, riesgo laboral latente. Construimos un GED multiunidad con firma legal, PWA para gerentes y dashboard de plazos.", quote: "“Trajeron algo que no imaginaba que era posible.”", metrics: [{ v: "PWA", l: "iPhone, Android, iPad" }, { v: "LGPD", l: "Cumplimiento total" }, { v: "90d", l: "De la firma al go-live" }], img: IMG.facilita },
      { tag: "ERP Vertical · Construcción", title: "ObraSimples", desc: "Cliente llegó pidiendo solución fintech. Identificamos una oportunidad mayor: un ERP/Micro SaaS a medida para pequeños emprendedores de la construcción. Facturación, PIX, gestión financiera, control de stock, presupuestos.", quote: "“Nos mostraron una nueva oportunidad de nuevo negocio.”", metrics: [{ v: "A medida", l: "Cliente dueño del código" }, { v: "Fintech", l: "PIX + facturas integrados" }, { v: "MRR", l: "Soporte continuo" }], img: IMG.obrasimples },
      { tag: "Plataforma de salud · desde cero", title: "Cuidar Bem Card", desc: "Empresa de salud creada desde cero, del modelo de negocio a la plataforma completa. Concepto, desarrollo, branding, go-to-market — Ingeniería Creativa de punta a punta.", quote: "“Se convirtió en un negocio completo que está cambiando cómo las personas acceden a servicios de salud.”", metrics: [{ v: "300%", l: "Crecimiento en 12 meses" }, { v: "3", l: "Estados brasileños" }, { v: "0→1", l: "Concepto a operación" }], img: IMG.cuidarbem },
    ],
  },
  logos: { eyebrow: "Confían", title: "Equipos que eligieron construir juntos.", lead: "De redes regionales a sistemas cooperativos. Diferentes sectores, el mismo método." },
  stack: { eyebrow: "Stack", title: "Tecnología moderna y probada.", lead: "Las herramientas que usamos para construir productos que escalan — probadas en 12 negocios propios." },
  testimonials: {
    eyebrow: "Voces", title: "Visión de dueño, en la práctica.", lead: "Lo que dicen los clientes después de subir a nuestro barco.",
    items: [
      { quote: "Trajeron algo que yo no imaginaba que era posible. Salí con un sistema que cambió toda nuestra operación.", name: "Cliente Facilita Higienização", role: "Director · Red industrial · BR" },
      { quote: "No solo necesitábamos un sistema — nos mostraron una nueva oportunidad de negocio. Skin in the game real.", name: "Thiago Piccini", role: "Fundador · ObraSimples" },
      { quote: "Transformaron nuestra visión en un negocio completo que está cambiando cómo las personas acceden a salud.", name: "Renata Jacomeli", role: "CEO · Cuidar Bem Card" },
    ],
  },
  manifesto: { quote: "No vendemos horas. Construimos la operación.", attr: "Naveo · Lucas do Rio Verde, MT · Brasil" },
  ctaFinal: { title: "¿Construimos juntos?", sub: "Diagnóstico de 1h, gratuito y sin compromiso. Entendemos tu operación, mapeamos cuellos de botella y devolvemos un diagnóstico estructurado en hasta 5 días hábiles.", btn: "Hablar por WhatsApp" },
  footer: {
    about: "Builder de Ingeniería Creativa. Desarrollamos productos digitales y plataformas a medida — sistemas, marketplaces, automatizaciones e IA aplicada.",
    location: "Lucas do Rio Verde, MT · Brasil",
    cols: [
      { title: "Empresa", items: [{ label: "Sobre", href: "/es/sobre" }, { label: "Portafolio", href: "/es/portafolio" }, { label: "Casos", href: "/es/casos" }, { label: "Método", href: "/es/metodo" }, { label: "Contacto", href: "/es/contacto" }] },
      { title: "Productos propios", items: [{ label: "Agrodesapego", href: "/es/agrodesapego" }, { label: "Cruzeta Club", href: "/es/cruzetaclub" }, { label: "Navbarber", href: "/es/navbarber" }, { label: "Pharma Genius (próximamente)", href: "/es/pharmagenius" }] },
      { title: "Contacto", items: [{ label: "contato@naveo.com.br", href: "mailto:contato@naveo.com.br" }, { label: "WhatsApp", href: "https://wa.me/5565996865004" }, { label: "LinkedIn", href: "https://www.linkedin.com" }, { label: "Instagram", href: "https://www.instagram.com/naveoce" }] },
      { title: "Legal", items: [{ label: "Términos", href: "/es/terminos" }, { label: "Privacidad", href: "/es/privacidad" }, { label: "Português · English · Español", href: "/" }] },
    ],
    copyright: "© {year} Naveo Engenharia Criativa.", tag: "Construido con Ingeniería Creativa.",
  },
  seo: { title: "Naveo · Ingeniería Creativa", description: "Desarrollamos productos digitales y plataformas personalizadas para tu negocio. Sistemas, marketplaces, automatizaciones, IA aplicada. Construimos, integramos y sostenemos la tecnología que tu operación necesita." },
};
