import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface CaseStoryData {
  num: string;
  tag: string;
  title: string;
  desc: string;
  quote: string;
  attribution: string;
  metrics: { v: string; l: string }[];
  img: string;
}

export function CaseStory({ data, reverse }: { data: CaseStoryData; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="py-[100px] border-b border-line">
      <div className="container-x">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className={`lg:col-span-7 ${reverse ? "lg:[direction:ltr]" : ""}`}
          >
            <div className="aspect-[16/11] rounded-2xl overflow-hidden bg-bg-soft border border-line relative shadow-card">
              <motion.div
                style={{ y, backgroundImage: `url('${data.img}')` }}
                className="absolute inset-[-8%] bg-cover bg-center"
              />
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur border border-line">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                <span className="font-mono text-[10.5px] text-ink-dim uppercase tracking-[0.14em]">CASE {data.num}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-5 ${reverse ? "lg:[direction:ltr]" : ""}`}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4">{data.tag}</div>
            <h3 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.022em] leading-[1.05] text-ink mb-5">{data.title}</h3>
            <p className="text-ink-dim text-[15.5px] leading-[1.6] mb-6">{data.desc}</p>

            <blockquote className="border-l-2 border-accent pl-5 py-1 mb-7">
              <p className="text-[14.5px] text-ink italic mb-2">"{data.quote}"</p>
              <cite className="not-italic font-mono text-[11px] text-ink-mute tracking-wider">— {data.attribution}</cite>
            </blockquote>

            <div className="flex flex-wrap gap-6 pt-6 border-t border-line">
              {data.metrics.map((m, j) => (
                <div key={j} className="min-w-[100px]">
                  <strong className="block font-display text-[24px] font-semibold text-ink tracking-[-0.02em]">{m.v}</strong>
                  <span className="font-mono text-[10.5px] text-ink-mute tracking-wider uppercase">{m.l}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
