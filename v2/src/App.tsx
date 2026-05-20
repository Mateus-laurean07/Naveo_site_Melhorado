import { useEffect, useState } from "react";
import { getContent } from "@/content";
import { parseLocation, Locale, Route } from "@/lib/router";
import { HomePage } from "@/pages/HomePage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { MethodPage } from "@/pages/MethodPage";
import { CasesPage } from "@/pages/CasesPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { ThanksPage } from "@/pages/ThanksPage";
import { LegalPage } from "@/pages/LegalPage";
import { ProductPage } from "@/pages/ProductPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  const [{ lang, route }, setLoc] = useState(() => parseLocation(window.location.pathname));
  const t = getContent(lang);

  useEffect(() => {
    document.documentElement.lang = t.locale;
    document.title = t.seo.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t.seo.description);
  }, [t.locale, route]);

  useEffect(() => {
    const onPop = () => setLoc(parseLocation(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Intercept internal link clicks for SPA navigation
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const target = e.target as HTMLElement;
      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;

      // External, hash, mailto, tel — leave alone
      if (a.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // Hash anchor on same page → smooth scroll
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
        return;
      }

      // Internal SPA navigation
      e.preventDefault();
      window.history.pushState({}, "", href);
      window.scrollTo({ top: 0, behavior: "instant" });
      setLoc(parseLocation(href));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return renderRoute(route, t, lang);
}

function renderRoute(route: Route, t: ReturnType<typeof getContent>, lang: Locale) {
  switch (route) {
    case "home": return <HomePage t={t} lang={lang} />;
    case "portfolio": return <PortfolioPage t={t} lang={lang} />;
    case "metodo": return <MethodPage t={t} lang={lang} />;
    case "cases": return <CasesPage t={t} lang={lang} />;
    case "sobre": return <AboutPage t={t} lang={lang} />;
    case "contato": return <ContactPage t={t} lang={lang} />;
    case "obrigado": return <ThanksPage t={t} lang={lang} />;
    case "termos": return <LegalPage t={t} lang={lang} doc="terms" />;
    case "privacidade": return <LegalPage t={t} lang={lang} doc="privacy" />;
    case "agrodesapego": return <ProductPage t={t} lang={lang} slug="agrodesapego" />;
    case "cruzetaclub": return <ProductPage t={t} lang={lang} slug="cruzetaclub" />;
    case "navbarber": return <ProductPage t={t} lang={lang} slug="navbarber" />;
    case "pharmagenius": return <ProductPage t={t} lang={lang} slug="pharmagenius" />;
    default: return <NotFoundPage t={t} lang={lang} />;
  }
}
