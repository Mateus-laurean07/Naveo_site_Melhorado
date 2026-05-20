import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { Layout, PageHero } from "@/components/Layout";
import { navigate, Locale } from "@/lib/router";

export function ContactPage({ t, lang }: { t: Content; lang: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, any> = {};
    formData.forEach((v, k) => {
      if (k in payload) {
        if (Array.isArray(payload[k])) payload[k].push(v);
        else payload[k] = [payload[k], v];
      } else {
        payload[k] = v;
      }
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, lang, locale: t.locale, userAgent: navigator.userAgent }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      navigate("obrigado", lang as Locale);
    } catch (err: any) {
      setError(
        lang === "en" ? "Could not submit. Please try WhatsApp +55 65 99686-5004."
        : lang === "es" ? "No se pudo enviar. Intenta WhatsApp +55 65 99686-5004."
        : "Não conseguimos enviar. Tente o WhatsApp +55 65 99686-5004."
      );
      setSubmitting(false);
    }
  }

  const L = labels[lang as keyof typeof labels] ?? labels.pt;

  return (
    <Layout t={t} lang={lang}>
      <PageHero eyebrow={L.eyebrow} title={L.title} sub={L.sub} />

      <section className="container-x py-20 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14), transparent 65%)" }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-strong rounded-3xl p-8 md:p-10 space-y-6 glow-border"
          >
            <Row>
              <Field label={L.name} name="name" required />
              <Field label={L.company} name="company" />
            </Row>
            <Row>
              <Field label={L.email} name="email" type="email" required />
              <Field label={L.phone} name="phone" type="tel" placeholder="+55 ..." required />
            </Row>

            <Select label={L.sectorLabel} name="sector" options={L.sectorOptions} required />
            <Select label={L.projectLabel} name="projectType" options={L.projectOptions} required />
            <Select label={L.stageLabel} name="stage" options={L.stageOptions} required />
            <Select label={L.budgetLabel} name="budget" options={L.budgetOptions} />

            <Textarea label={L.messageLabel} name="message" required rows={5} placeholder={L.messagePh} />

            <label className="flex items-start gap-3 text-[13px] text-ink-dim cursor-pointer">
              <input
                type="checkbox"
                name="lgpd"
                required
                className="mt-1 w-4 h-4 accent-[color:var(--accent,#c2410c)]"
                style={{ accentColor: "#c2410c" }}
              />
              <span>{L.lgpd}</span>
            </label>

            {error && <div className="text-sm text-accent-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-[14.5px] font-medium text-white overflow-hidden disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}
            >
              <span className="relative z-10 flex items-center gap-2.5">{submitting ? L.sending : L.submit} <span>→</span></span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, #a855f7 0%, #f472b6 100%)" }} />
            </button>

            <p className="text-[11.5px] text-ink-faint font-mono">{L.timeNote}</p>
          </motion.form>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-7">
              <Card title={L.directTitle}>
                <div className="space-y-3 text-[14px]">
                  <Line k={L.email} v={<a className="hover:text-accent" href="mailto:contato@naveo.com.br">contato@naveo.com.br</a>} />
                  <Line k="WhatsApp" v={<a className="hover:text-accent" href="https://wa.me/5565996865004">+55 65 99686-5004</a>} />
                  <Line k={L.locationLabel} v="Lucas do Rio Verde · MT · Brasil" />
                </div>
              </Card>

              <Card title={L.expectTitle}>
                <ul className="space-y-3 text-[13.5px] text-ink-dim">
                  {L.expectItems.map((it, i) => (
                    <li key={i} className="flex gap-3"><span className="text-accent">→</span>{it}</li>
                  ))}
                </ul>
              </Card>

              <Card title={L.notForTitle}>
                <ul className="space-y-2 text-[13.5px] text-ink-dim">
                  {L.notForItems.map((it, i) => (
                    <li key={i} className="flex gap-3"><span className="text-ink-faint">×</span>{it}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}
function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-ink-dim mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-line-mid rounded-xl px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-mute focus:border-accent-2 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
      />
    </label>
  );
}
function Textarea({ label, name, required, rows = 4, placeholder }: { label: string; name: string; required?: boolean; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-ink-dim mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-line-mid rounded-xl px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-mute focus:border-accent-2 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-y"
      />
    </label>
  );
}
function Select({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium uppercase tracking-[0.08em] text-ink-dim mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full bg-white/[0.04] border border-line-mid rounded-xl px-4 py-3 text-[14.5px] text-ink focus:border-accent-2 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
      >
        <option value="" disabled className="bg-bg-soft">—</option>
        {options.map((o) => (<option key={o} value={o} className="bg-bg-soft">{o}</option>))}
      </select>
    </label>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-7">
      <h3 className="font-display text-[18px] font-medium text-ink mb-4">{title}</h3>
      {children}
    </div>
  );
}
function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint mb-0.5">{k}</div>
      <div className="text-ink">{v}</div>
    </div>
  );
}

const labels = {
  pt: {
    eyebrow: "Vamos conversar",
    title: "Conta o seu cenário. A gente devolve um diagnóstico em até 5 dias úteis.",
    sub: "Form rápido (3 min). Preencha com o máximo de contexto que conseguir — quanto mais sabemos antes, mais útil é a primeira conversa.",
    name: "Nome", company: "Empresa", email: "E-mail", phone: "WhatsApp",
    sectorLabel: "Setor", projectLabel: "Tipo de projeto", stageLabel: "Estágio atual", budgetLabel: "Orçamento estimado",
    messageLabel: "Conta um pouco da sua dor / projeto", messagePh: "Ex: tenho 8 unidades empurrando papel pra RH. Quero parar com isso.",
    lgpd: "Concordo com a Política de Privacidade e autorizo o uso dos meus dados para retorno comercial (LGPD).",
    submit: "Enviar diagnóstico", sending: "Enviando…",
    directTitle: "Direto comigo", locationLabel: "Localização",
    timeNote: "Resposta em até 4h úteis · Segunda a sexta · 9h-18h BRT",
    sectorOptions: ["Agronegócio", "Saúde / Healthtech", "Construção civil", "Educação", "Food / Alimentação", "Fintech / Pagamentos", "Indústria / Produção", "Varejo / E-commerce", "Serviços", "Outro"],
    projectOptions: ["Sistema sob medida / ERP interno", "Marketplace com IA", "Site de alta conversão", "Fintech / pagamentos", "Automação / IA aplicada", "Tenho ideia, não sei por onde começar", "Outro"],
    stageOptions: ["Só tenho uma ideia", "Tenho operação rodando (papel/planilha)", "Tenho produto e quero escalar", "Quero migrar de SaaS pronto", "Quero modernizar sistema atual"],
    budgetOptions: ["Até R$ 30 mil", "R$ 30k – R$ 80k", "R$ 80k – R$ 150k", "R$ 150k+", "Ainda não sei"],
    expectTitle: "O que esperar",
    expectItems: ["Resposta no WhatsApp em até 4h úteis", "Diagnóstico estruturado em até 5 dias úteis", "Conversa de 1h gratuita, sem compromisso", "Faixa de investimento e roadmap inicial"],
    notForTitle: "Não somos pra você se…",
    notForItems: ["Procura agência de marketing pura", "Precisa de SaaS pronto e barato", "Quer terceirizar e esquecer o projeto"],
  },
  en: {
    eyebrow: "Let's talk",
    title: "Tell us your scenario. We'll send a diagnosis within 5 business days.",
    sub: "Quick form (3 min). The more context you share now, the more useful our first conversation will be.",
    name: "Name", company: "Company", email: "Email", phone: "WhatsApp",
    sectorLabel: "Industry", projectLabel: "Project type", stageLabel: "Current stage", budgetLabel: "Estimated budget",
    messageLabel: "Tell us about your pain / project", messagePh: "e.g. I have 8 units pushing paper to HR. Want to stop that.",
    lgpd: "I agree with the Privacy Policy and authorize the use of my data for sales follow-up (LGPD/GDPR).",
    submit: "Send diagnosis", sending: "Sending…",
    directTitle: "Direct contact", locationLabel: "Location",
    timeNote: "Reply within 4 business hours · Mon-Fri · 9am-6pm BRT",
    sectorOptions: ["Agribusiness", "Healthcare", "Construction", "Education", "Food", "Fintech / Payments", "Industry / Manufacturing", "Retail / E-commerce", "Services", "Other"],
    projectOptions: ["Custom system / Internal ERP", "AI marketplace", "High-conversion site", "Fintech / payments", "Automation / Applied AI", "I have an idea, not sure where to start", "Other"],
    stageOptions: ["Just have an idea", "Running on paper/spreadsheet", "Have a product, want to scale", "Want to leave generic SaaS", "Want to modernize current system"],
    budgetOptions: ["Up to US$ 6k", "US$ 6k – US$ 16k", "US$ 16k – US$ 30k", "US$ 30k+", "Not sure yet"],
    expectTitle: "What to expect",
    expectItems: ["WhatsApp reply within 4 business hours", "Structured diagnosis within 5 business days", "1-hour free consultation, no strings", "Investment range and initial roadmap"],
    notForTitle: "We're not for you if…",
    notForItems: ["You need a pure marketing agency", "You want cheap ready-made SaaS", "You want to outsource and forget"],
  },
  es: {
    eyebrow: "Hablemos",
    title: "Cuéntanos tu escenario. Devolvemos un diagnóstico en hasta 5 días hábiles.",
    sub: "Formulario rápido (3 min). Cuanto más contexto compartas ahora, más útil será nuestra primera conversación.",
    name: "Nombre", company: "Empresa", email: "Correo", phone: "WhatsApp",
    sectorLabel: "Sector", projectLabel: "Tipo de proyecto", stageLabel: "Etapa actual", budgetLabel: "Presupuesto estimado",
    messageLabel: "Cuéntanos tu dolor / proyecto", messagePh: "Ej: tengo 8 unidades empujando papel a RRHH. Quiero parar con eso.",
    lgpd: "Acepto la Política de Privacidad y autorizo el uso de mis datos para seguimiento comercial (LGPD).",
    submit: "Enviar diagnóstico", sending: "Enviando…",
    directTitle: "Contacto directo", locationLabel: "Ubicación",
    timeNote: "Respuesta en hasta 4h hábiles · Lun-Vie · 9h-18h BRT",
    sectorOptions: ["Agroindustria", "Salud", "Construcción", "Educación", "Alimentación", "Fintech / Pagos", "Industria", "Retail / E-commerce", "Servicios", "Otro"],
    projectOptions: ["Sistema a medida / ERP interno", "Marketplace con IA", "Sitio de alta conversión", "Fintech / pagos", "Automatización / IA aplicada", "Tengo una idea, no sé por dónde empezar", "Otro"],
    stageOptions: ["Solo tengo una idea", "Operación en papel/planilla", "Tengo producto y quiero escalar", "Quiero migrar de SaaS genérico", "Quiero modernizar sistema actual"],
    budgetOptions: ["Hasta US$ 6k", "US$ 6k – US$ 16k", "US$ 16k – US$ 30k", "US$ 30k+", "Aún no sé"],
    expectTitle: "Qué esperar",
    expectItems: ["Respuesta en WhatsApp en hasta 4h hábiles", "Diagnóstico estructurado en hasta 5 días hábiles", "Conversación de 1h gratuita, sin compromiso", "Rango de inversión y roadmap inicial"],
    notForTitle: "No somos para ti si…",
    notForItems: ["Buscas una agencia de marketing pura", "Quieres SaaS genérico barato", "Quieres tercerizar y olvidar"],
  },
};
