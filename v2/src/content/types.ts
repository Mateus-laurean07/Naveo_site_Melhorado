export interface Content {
  locale: string;
  nav: { portfolio: string; method: string; cases: string; about: string; contact: string };
  hero: {
    eyebrow: string;
    headline: { text: string; italic?: boolean }[];
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  marquee: string[];
  stats: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { value: number; label: string; suffix?: string }[];
  };
  method: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: { num: string; title: string; desc: string; list: string[] }[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { icon: string; title: string; desc: string }[];
  };
  portfolio: {
    eyebrow: string;
    title: string;
    lead: string;
    heroes: { name: string; tag: string; desc: string; url: string; img: string }[];
    mini: { name: string; tag: string }[];
  };
  cases: {
    eyebrow: string;
    title: string;
    lead: string;
    items: {
      tag: string;
      title: string;
      desc: string;
      quote: string;
      metrics: { v: string; l: string }[];
      img: string;
    }[];
  };
  logos: { eyebrow: string; title: string; lead: string };
  stack: { eyebrow: string; title: string; lead: string };
  testimonials: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { quote: string; name: string; role: string }[];
  };
  manifesto: { quote: string; attr: string };
  ctaFinal: { title: string; sub: string; btn: string };
  footer: {
    about: string;
    location: string;
    cols: { title: string; items: { label: string; href: string }[] }[];
    copyright: string;
    tag: string;
  };
  seo: { title: string; description: string };
}

export const IMG = {
  facilita: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1400&q=80",
  obrasimples: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
  cuidarbem: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  agro: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80",
  cruzeta: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
  navbarber: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80",
  pharma: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1400&q=80",
};

export const CLIENT_LOGOS = [
  "Facilita", "ObraSimples", "Cuidar Bem", "Sicredi",
  "Green Future Hub", "O'Gourmet", "Festi Pizza", "Bassani Móveis",
  "Serra Summit", "CD Marau", "Gestão BPO", "Alternativa",
];

export const STACK_BLOCKS = [
  { icon: "N", name: "Next.js", type: "Frontend" },
  { icon: "S", name: "Supabase", type: "Backend" },
  { icon: "P", name: "Postgres", type: "Database" },
  { icon: "n8", name: "n8n", type: "Automation" },
  { icon: "AI", name: "OpenAI", type: "AI" },
  { icon: "W", name: "Evolution", type: "WhatsApp" },
  { icon: "R", name: "Resend", type: "Email" },
  { icon: "T", name: "Tailwind", type: "Styling" },
  { icon: "F", name: "Figma", type: "Design" },
  { icon: "G", name: "GitHub", type: "Code" },
  { icon: "V", name: "Vercel", type: "Deploy" },
  { icon: "CF", name: "Cloudflare", type: "Edge" },
];
