import { Content } from "@/content/types";
import { Layout, PageHero } from "@/components/Layout";
import { Cases } from "@/components/Cases";

export function CasesPage({ t, lang }: { t: Content; lang: string }) {
  return (
    <Layout t={t} lang={lang}>
      <PageHero
        eyebrow="Cases de cliente"
        title="Você nos traz a dor. A gente desenvolve."
        sub="Empresas reais que chegaram com uma demanda pontual e saíram com uma operação digital completa. Não vendemos hora — construímos a operação."
      />
      <Cases t={t} />
    </Layout>
  );
}
