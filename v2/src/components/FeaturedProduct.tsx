import { motion } from "framer-motion";

export interface FeaturedProductData {
  num: string;
  brand: string;
  tagline: string;
  desc: string;
  highlights: string[];
  img: string;
  url: string;
  status: "live" | "soon";
  cta: string;
}

export function FeaturedProduct({ data, reverse }: { data: FeaturedProductData; reverse?: boolean }) {
  return (
    <section className="py-[100px] border-b border-line">
      <div className="container-x">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-5 ${reverse ? "lg:[direction:ltr]" : ""}`}
          >
            <div className="flex items-center gap-4 mb-7">
              <span className="font-mono text-[12px] text-accent tracking-[0.18em] font-medium">{data.num}</span>
              <span className="h-px flex-1 bg-line max-w-[60px]" />
              <span className={`font-mono text-[10.5px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${data.status === "live" ? "bg-accent-bg text-accent" : "bg-bg-soft text-ink-faint"}`}>
                {data.status === "live" ? "● LIVE" : "EM BREVE"}
              </span>
            </div>

            <h2 className="font-display font-semibold text-ink tracking-[-0.03em] leading-[0.95] text-[clamp(36px,5.5vw,72px)] mb-6">{data.brand}</h2>
            <p className="text-[clamp(17px,1.4vw,22px)] font-display text-ink-1 leading-[1.35] mb-5 max-w-[600px]">{data.tagline}</p>
            <p className="text-ink-dim text-[15px] leading-[1.6] mb-7 max-w-prose">{data.desc}</p>

            <ul className="space-y-2.5 mb-9">
              {data.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] text-ink-1">
                  <span className="text-accent shrink-0 mt-0.5">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {data.status === "live" && (
              <a href={data.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-ink text-white text-[14px] font-medium hover:bg-accent transition-colors group">
                {data.cta} <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className={`lg:col-span-7 ${reverse ? "lg:[direction:ltr]" : ""}`}
          >
            <div className="aspect-[16/11] rounded-2xl overflow-hidden border border-line bg-bg-soft shadow-card relative">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${data.img}')` }} />
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border border-line text-ink text-[11px] font-mono uppercase tracking-[0.12em]">
                {data.brand}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
