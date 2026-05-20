import { Content } from "@/content/types";
import { Layout } from "@/components/Layout";

export function NotFoundPage({ t, lang }: { t: Content; lang: string }) {
  return (
    <Layout t={t} lang={lang}>
      <section className="min-h-[70vh] flex items-center justify-center py-24">
        <div className="container-narrow text-center">
          <div className="font-display font-medium gradient-text text-[clamp(140px,22vw,300px)] leading-none tracking-[-0.04em] opacity-30">404</div>
          <h1 className="font-display font-medium text-ink tracking-[-0.025em] text-[clamp(28px,4vw,48px)] mb-5">
            Página não encontrada.
          </h1>
          <p className="text-ink-dim mb-9">Confere o endereço ou volta pra home.</p>
          <a href={lang === "pt" ? "/" : `/${lang}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-medium text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
            Voltar pra home →
          </a>
        </div>
      </section>
    </Layout>
  );
}
