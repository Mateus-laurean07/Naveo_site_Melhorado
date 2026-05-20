import { motion } from "framer-motion";
import { Content, CLIENT_LOGOS } from "@/content/types";
import { SectionHead } from "./SectionHead";

export function Logos({ t }: { t: Content }) {
  return (
    <section className="container-x py-[100px] border-b border-line">
      <SectionHead eyebrow={t.logos.eyebrow} title={t.logos.title} lead={t.logos.lead} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-line border border-line rounded-lg overflow-hidden"
      >
        {CLIENT_LOGOS.map((l, i) => (
          <div
            key={i}
            className="bg-white hover:bg-bg-soft min-h-[100px] flex items-center justify-center px-5 text-center font-medium text-[14px] text-ink-dim hover:text-ink transition-colors"
          >
            {l}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
