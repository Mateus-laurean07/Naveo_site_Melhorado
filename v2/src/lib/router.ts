export const LOCALES = ["pt", "en", "es"] as const;
export type Locale = typeof LOCALES[number];

export type Route =
  | "home"
  | "portfolio"
  | "metodo"
  | "cases"
  | "sobre"
  | "contato"
  | "obrigado"
  | "termos"
  | "privacidade"
  | "agrodesapego"
  | "cruzetaclub"
  | "navbarber"
  | "pharmagenius"
  | "404";

const ROUTE_SLUGS: Record<Route, Record<Locale, string>> = {
  home: { pt: "", en: "", es: "" },
  portfolio: { pt: "portfolio", en: "portfolio", es: "portafolio" },
  metodo: { pt: "metodo", en: "method", es: "metodo" },
  cases: { pt: "cases", en: "cases", es: "casos" },
  sobre: { pt: "sobre", en: "about", es: "sobre" },
  contato: { pt: "contato", en: "contact", es: "contacto" },
  obrigado: { pt: "obrigado", en: "thanks", es: "gracias" },
  termos: { pt: "termos", en: "terms", es: "terminos" },
  privacidade: { pt: "privacidade", en: "privacy", es: "privacidad" },
  agrodesapego: { pt: "agrodesapego", en: "agrodesapego", es: "agrodesapego" },
  cruzetaclub: { pt: "cruzetaclub", en: "cruzetaclub", es: "cruzetaclub" },
  navbarber: { pt: "navbarber", en: "navbarber", es: "navbarber" },
  pharmagenius: { pt: "pharmagenius", en: "pharmagenius", es: "pharmagenius" },
  "404": { pt: "", en: "", es: "" },
};

export interface ParsedRoute {
  lang: Locale;
  route: Route;
}

export function parseLocation(pathname: string): ParsedRoute {
  const parts = pathname.split("/").filter(Boolean);
  let lang: Locale = "pt";
  let rest = parts;
  if (parts[0] === "en" || parts[0] === "es") {
    lang = parts[0] as Locale;
    rest = parts.slice(1);
  }
  const slug = rest[0] ?? "";
  if (!slug) return { lang, route: "home" };

  for (const [route, langs] of Object.entries(ROUTE_SLUGS)) {
    if (route === "404") continue;
    if (langs[lang] === slug) return { lang, route: route as Route };
    // Cross-lang fallback (any locale slug matches)
    if (Object.values(langs).includes(slug)) return { lang, route: route as Route };
  }
  return { lang, route: "404" };
}

export function pathFor(route: Route, lang: Locale = "pt"): string {
  if (route === "home") return lang === "pt" ? "/" : `/${lang}`;
  const slug = ROUTE_SLUGS[route][lang] || ROUTE_SLUGS[route].pt;
  return lang === "pt" ? `/${slug}` : `/${lang}/${slug}`;
}

export function navigate(route: Route, lang: Locale = "pt") {
  const url = pathFor(route, lang);
  if (window.location.pathname === url) return;
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
