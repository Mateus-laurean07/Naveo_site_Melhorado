import { useEffect, useState } from "react";
import { Content } from "@/content/types";
import { cn } from "@/lib/cn";

interface Props { t: Content; lang: string; }

export function Header({ t, lang }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const langPath = (l: string) => (l === "pt" ? "/" : `/${l}`);
  const path = (slug: { pt: string; en: string; es: string }) =>
    lang === "pt" ? slug.pt : lang === "en" ? slug.en : slug.es;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-line"
          : "bg-white border-b border-transparent"
      )}
    >
      <div className="container-x flex items-center justify-between h-[68px]">
        <a href={langPath(lang)} className="flex items-center gap-2" aria-label="Naveo">
          <img src="/assets/isotipo-preto.webp" alt="" className="h-6 w-auto" />
          <span className="font-display text-[18px] font-semibold text-ink tracking-tight">Naveo</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          <a href={path({ pt: "/portfolio", en: "/en/portfolio", es: "/es/portafolio" })}
            className="px-3.5 py-2 text-[14px] text-ink-1 hover:text-ink transition-colors">{t.nav.portfolio}</a>
          <a href={path({ pt: "/metodo", en: "/en/method", es: "/es/metodo" })}
            className="px-3.5 py-2 text-[14px] text-ink-1 hover:text-ink transition-colors">{t.nav.method}</a>
          <a href={path({ pt: "/cases", en: "/en/cases", es: "/es/casos" })}
            className="px-3.5 py-2 text-[14px] text-ink-1 hover:text-ink transition-colors">{t.nav.cases}</a>
          <a href={path({ pt: "/sobre", en: "/en/about", es: "/es/sobre" })}
            className="px-3.5 py-2 text-[14px] text-ink-1 hover:text-ink transition-colors">{t.nav.about}</a>

          <div className="px-3 ml-2 flex items-center gap-0.5 text-[11px] font-mono uppercase tracking-wider text-ink-mute">
            <a href="/" className={cn("px-1.5 py-1 hover:text-ink transition-colors", lang === "pt" && "text-accent")}>PT</a>
            <span>·</span>
            <a href="/en" className={cn("px-1.5 py-1 hover:text-ink transition-colors", lang === "en" && "text-accent")}>EN</a>
            <span>·</span>
            <a href="/es" className={cn("px-1.5 py-1 hover:text-ink transition-colors", lang === "es" && "text-accent")}>ES</a>
          </div>

          <a
            href={path({ pt: "/contato", en: "/en/contact", es: "/es/contacto" })}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-accent text-white text-[13px] font-medium hover:bg-accent-hover transition-colors"
          >
            {t.nav.contact} →
          </a>
        </nav>
      </div>
    </header>
  );
}
