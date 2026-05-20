import { motion } from "framer-motion";
import { Content, STACK_BLOCKS } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Stack({ t }: { t: Content }) {
  return (
    <section className="container-x py-[100px]">
      <SectionHead eyebrow={t.stack.eyebrow} title={t.stack.title} lead={t.stack.lead} />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-px bg-line border border-line rounded-lg overflow-hidden">
        {STACK_BLOCKS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="aspect-[1.4/1] bg-white hover:bg-bg-soft flex flex-col items-center justify-center gap-1.5 p-4 transition-colors"
          >
            <div className="font-display text-[22px] font-semibold text-ink tracking-[-0.02em]">{b.icon}</div>
            <div className="text-[12px] font-medium text-ink-dim">{b.name}</div>
            <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-mute">{b.type}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
