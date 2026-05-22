import { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Content } from "@/content/types";

export function Layout({ t, lang, children }: { t: Content; lang: string; children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2px] bg-accent z-[200] transition-[width]"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      <Header t={t} lang={lang} />
      <main className="pt-[96px]">{children}</main>
      <Footer t={t} />
    </>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="container-x pt-24 pb-20 border-b border-line">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4 flex items-center gap-2.5">
        <span className="inline-block w-6 h-px bg-accent" />
        {eyebrow}
      </div>
      <h1 className="font-display font-semibold text-ink tracking-[-0.025em] leading-[1.05] text-[clamp(36px,5.5vw,72px)] max-w-[1100px] mb-5 text-balance">
        {title.split(/(\*[^*]+\*)/).map((p, i) =>
          p.startsWith("*") && p.endsWith("*")
            ? <span key={i} className="text-accent">{p.slice(1, -1)}</span>
            : <span key={i}>{p}</span>
        )}
      </h1>
      {sub && <p className="text-ink-dim text-[clamp(16px,1.3vw,19px)] max-w-[680px] leading-[1.55]">{sub}</p>}
    </section>
  );
}
