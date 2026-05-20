import { Content } from "@/content/types";

export function Footer({ t }: { t: Content }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-[80px] pb-8 bg-white">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/isotipo-preto.webp" alt="" className="h-6 w-auto" />
              <span className="font-display text-[18px] font-semibold text-ink">Naveo</span>
            </div>
            <p className="text-ink-dim text-[14px] leading-[1.55] max-w-[320px]">{t.footer.about}</p>
            <p className="text-ink-mute text-[12.5px] mt-3 font-mono">{t.footer.location}</p>
          </div>
          {t.footer.cols.map((col, i) => (
            <div key={i}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute mb-4 font-medium">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map((it, j) => (
                  <li key={j}>
                    <a
                      href={it.href}
                      target={it.href.startsWith("http") ? "_blank" : undefined}
                      rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[13.5px] text-ink-1 hover:text-accent transition-colors"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-6 flex flex-wrap justify-between gap-3 font-mono text-[12px] text-ink-mute">
          <div>{t.footer.copyright.replace("{year}", String(year))}</div>
          <div>{t.footer.tag}</div>
        </div>
      </div>
    </footer>
  );
}
