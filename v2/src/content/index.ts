import { pt } from "./pt";
import { en } from "./en";
import { es } from "./es";
import { Content } from "./types";

export const locales: Record<string, Content> = { pt, en, es };
export const defaultLocale = "pt";

export function detectLocale(): string {
  if (typeof window === "undefined") return defaultLocale;
  const path = window.location.pathname.split("/").filter(Boolean)[0];
  if (path === "en" || path === "es") return path;
  return defaultLocale;
}

export function getContent(locale: string): Content {
  return locales[locale] ?? locales[defaultLocale];
}
