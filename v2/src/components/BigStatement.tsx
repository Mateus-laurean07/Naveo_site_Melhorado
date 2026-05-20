import { motion } from "framer-motion";

export function BigStatement({ statement, sub, image }: { statement: string; sub?: string; image?: string }) {
  const parts = statement.split(/(\*[^*]+\*)/g);
  return (
    <section className="relative w-full overflow-hidden bg-bg-soft border-y border-line">
      <div className="container-x py-[140px] lg:py-[180px] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          <div className="lg:col-span-7">
            <h2 className="font-display font-semibold tracking-[-0.03em] leading-[0.98] text-[clamp(36px,6.5vw,92px)] text-ink text-balance">
              {parts.map((p, i) =>
                p.startsWith("*") && p.endsWith("*")
                  ? <span key={i} className="text-accent">{p.slice(1, -1)}</span>
                  : <span key={i}>{p}</span>
              )}
            </h2>
            {sub && <p className="mt-7 text-ink-dim text-[clamp(15px,1.3vw,19px)] max-w-[520px] leading-[1.55]">{sub}</p>}
          </div>
          {image && (
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-line shadow-card">
                <div className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${image}')` }} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
