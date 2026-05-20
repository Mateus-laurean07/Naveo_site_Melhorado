import { motion } from "framer-motion";

interface Props {
  eyebrow: string;
  title: string;
  lead?: string;
  centered?: boolean;
}

function parseTitle(s: string) {
  const parts = s.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("*") && p.endsWith("*")) {
      return <span key={i} className="text-accent">{p.slice(1, -1)}</span>;
    }
    return <span key={i}>{p}</span>;
  });
}

export function SectionHead({ eyebrow, title, lead, centered }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`max-w-[860px] mb-14 ${centered ? "mx-auto text-center" : ""}`}
    >
      <div className={`font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
        <span className="inline-block w-6 h-px bg-accent" />
        {eyebrow}
      </div>
      <h2 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.05] text-[clamp(32px,5vw,64px)] mb-5 text-balance">
        {parseTitle(title)}
      </h2>
      {lead && (
        <p className="text-ink-dim text-[clamp(15px,1.2vw,18px)] leading-[1.55] max-w-prose text-pretty">
          {lead}
        </p>
      )}
    </motion.div>
  );
}
