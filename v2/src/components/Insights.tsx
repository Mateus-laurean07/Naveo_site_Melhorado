import { motion } from "framer-motion";
import { SectionHead } from "./SectionHead";

interface InsightCard {
  cat: string;
  title: string;
  desc: string;
  img: string;
  href: string;
}

const POSTS_PT: InsightCard[] = [
  {
    cat: "ENGENHARIA CRIATIVA",
    title: "Quando trocar planilha por sistema sob medida",
    desc: "5 sinais de que sua operação chegou no limite das ferramentas genéricas.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    cat: "IA APLICADA",
    title: "IA negociadora no WhatsApp: o que dá e o que não dá",
    desc: "Cases reais e armadilhas comuns ao usar IA em conversas comerciais.",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    cat: "FINTECH",
    title: "4 bancos digitais depois: o que aprendemos",
    desc: "Decisões de arquitetura que economizam meses na construção fintech.",
    img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    cat: "PROCESSO",
    title: "MVP em 7 dias: como entregamos antes do contrato",
    desc: "Por dentro do processo Naveo de desenhar, validar e construir rápido.",
    img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    cat: "OPERAÇÃO",
    title: "Multi-unidade sem perder a cabeça",
    desc: "Arquitetura de permissões e governança pra redes operando em escala.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    cat: "VISÃO DE DONO",
    title: "Por que não cobramos por hora",
    desc: "O modelo Naveo: projeto fechado + MRR de sustentação. Como funciona.",
    img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
];

export function Insights({ lang }: { lang: string }) {
  const L = labels[lang as keyof typeof labels] ?? labels.pt;
  return (
    <section className="bg-bg-soft border-y border-line py-[120px]">
      <div className="container-x">
        <SectionHead eyebrow={L.eyebrow} title={L.title} lead={L.lead} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {POSTS_PT.map((p, i) => (
            <motion.a
              key={i}
              href={p.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
              className="group block"
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-bg-1 mb-5 border border-line">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url('${p.img}')` }}
                />
              </div>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent mb-2">{p.cat}</div>
              <h3 className="font-display text-[19px] font-semibold tracking-[-0.012em] leading-[1.25] text-ink mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
              <p className="text-ink-dim text-[13.5px] leading-[1.55]">{p.desc}</p>
            </motion.a>
          ))}
        </div>
        <div className="mt-14 text-center">
          <a href="#" className="inline-flex items-center gap-2 text-accent text-[14.5px] font-medium hover:text-accent-hover group">
            {L.cta} <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const labels = {
  pt: { eyebrow: "Insights", title: "Conteúdo da equipe Naveo.", lead: "O que estamos pensando, construindo e aprendendo. Decisões de arquitetura, padrões de método, cases na prática.", cta: "Ver todos os insights" },
  en: { eyebrow: "Insights", title: "From the Naveo team.", lead: "What we're thinking, building and learning. Architecture decisions, method patterns, real cases.", cta: "View all insights" },
  es: { eyebrow: "Insights", title: "Del equipo Naveo.", lead: "Lo que estamos pensando, construyendo y aprendiendo. Decisiones de arquitectura, patrones de método, casos reales.", cta: "Ver todos los insights" },
};
