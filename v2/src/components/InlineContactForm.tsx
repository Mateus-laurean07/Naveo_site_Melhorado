import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Content } from "@/content/types";
import { Locale, navigate } from "@/lib/router";

export function InlineContactForm({ t, lang }: { t: Content; lang: string }) {
  const L = labels[lang as keyof typeof labels] ?? labels.pt;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, any> = {};
    formData.forEach((v, k) => { payload[k] = v; });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, lang, locale: t.locale, source: "home-inline" }),
      });
      if (!res.ok) throw new Error();
      navigate("obrigado", lang as Locale);
    } catch {
      setError(L.error);
      setSubmitting(false);
    }
  }

  return (
    <section id="contato" className="bg-bg-soft border-t border-line py-[120px]">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-4">{L.eyebrow}</div>
            <h2 className="font-display font-semibold text-ink tracking-[-0.028em] leading-[1.0] text-[clamp(36px,5vw,72px)] mb-5 text-balance">{L.title}</h2>
            <p className="text-ink-dim text-[15.5px] leading-[1.6] max-w-[480px] mb-9">{L.sub}</p>

            <ul className="space-y-3 text-[14px]">
              {L.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-ink-1">
                  <span className="text-accent shrink-0">→</span><span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 pt-7 border-t border-line">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-mute mb-3">{L.directLabel}</div>
              <div className="space-y-1 text-[14px]">
                <a href="mailto:contato@naveo.com.br" className="block text-ink hover:text-accent transition-colors">contato@naveo.com.br</a>
                <a href="https://wa.me/5565996865004" target="_blank" rel="noopener noreferrer" className="block text-ink hover:text-accent transition-colors">WhatsApp · +55 65 99686-5004</a>
              </div>
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-white border border-line rounded-2xl p-8 md:p-10 space-y-5 shadow-soft"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={L.name} name="name" required />
              <Field label={L.company} name="company" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={L.email} name="email" type="email" required />
              <Field label={L.phone} name="phone" type="tel" required placeholder="+55 ..." />
            </div>

            <Select label={L.projectLabel} name="projectType" options={L.projectOptions} required />
            <Select label={L.budgetLabel} name="budget" options={L.budgetOptions} />

            <Textarea label={L.messageLabel} name="message" required rows={4} placeholder={L.messagePh} />

            <label className="flex items-start gap-3 text-[12.5px] text-ink-dim cursor-pointer">
              <input type="checkbox" name="lgpd" required className="mt-1 w-4 h-4 accent-[#1e54e0]" />
              <span>{L.lgpd}</span>
            </label>

            {error && <div className="text-sm text-accent bg-accent-bg border border-accent/20 rounded-md px-4 py-3">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-accent text-white text-[14.5px] font-medium hover:bg-accent-hover transition-colors disabled:opacity-60 group"
            >
              {submitting ? L.sending : L.submit}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

            <p className="text-[11px] text-ink-mute font-mono">{L.timeNote}</p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <input type={type} name={name} required={required} placeholder={placeholder}
        className="w-full bg-white border border-line-mid rounded-md px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
    </label>
  );
}
function Textarea({ label, name, required, rows = 4, placeholder }: { label: string; name: string; required?: boolean; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <textarea name={name} required={required} rows={rows} placeholder={placeholder}
        className="w-full bg-white border border-line-mid rounded-md px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-y" />
    </label>
  );
}
function Select({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-ink-faint mb-2 font-mono">{label}{required && <span className="text-accent ml-0.5">*</span>}</span>
      <select name={name} required={required} defaultValue=""
        className="w-full bg-white border border-line-mid rounded-md px-4 py-3 text-[14.5px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
        <option value="" disabled>—</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
    </label>
  );
}

const labels = {
  pt: {
    eyebrow: "Bora conversar",
    title: "Conta seu cenário. Diagnóstico em até 5 dias.",
    sub: "Form rápido. Quanto mais contexto, mais útil a primeira conversa.",
    bullets: ["Resposta no WhatsApp em até 4h úteis", "Diagnóstico estruturado em até 5 dias", "Conversa de 1h gratuita, sem compromisso", "Faixa de investimento e roadmap inicial"],
    directLabel: "Direto",
    name: "Nome", company: "Empresa", email: "E-mail", phone: "WhatsApp",
    projectLabel: "Tipo de projeto", budgetLabel: "Orçamento estimado",
    messageLabel: "Conta sua dor / projeto", messagePh: "Ex: 8 unidades empurrando papel pra RH, preciso parar.",
    lgpd: "Concordo com a Política de Privacidade e autorizo retorno comercial (LGPD).",
    submit: "Enviar", sending: "Enviando…",
    error: "Erro ao enviar. Tenta o WhatsApp +55 65 99686-5004.",
    timeNote: "Respostas em até 4h úteis · Seg-Sex · 9h-18h BRT",
    projectOptions: ["Sistema sob medida / ERP interno", "Marketplace com IA", "Site de alta conversão", "Fintech / pagamentos", "Automação / IA aplicada", "Ideia que precisa virar produto", "Outro"],
    budgetOptions: ["Até R$ 30 mil", "R$ 30k – R$ 80k", "R$ 80k – R$ 150k", "R$ 150k+", "Ainda não sei"],
  },
  en: {
    eyebrow: "Let's talk",
    title: "Tell us your scenario. Diagnosis within 5 days.",
    sub: "Quick form. The more context, the more useful our first call.",
    bullets: ["WhatsApp reply within 4 business hours", "Structured diagnosis within 5 business days", "Free 1h consultation, no strings", "Investment range and initial roadmap"],
    directLabel: "Direct",
    name: "Name", company: "Company", email: "Email", phone: "WhatsApp",
    projectLabel: "Project type", budgetLabel: "Estimated budget",
    messageLabel: "Tell us your pain / project", messagePh: "e.g. 8 units pushing paper, want to stop.",
    lgpd: "I agree with the Privacy Policy and authorize sales follow-up.",
    submit: "Send", sending: "Sending…",
    error: "Error. Try WhatsApp +55 65 99686-5004.",
    timeNote: "Reply within 4 business hours · Mon-Fri · 9am-6pm BRT",
    projectOptions: ["Custom system / Internal ERP", "AI marketplace", "High-conversion site", "Fintech / payments", "Automation / Applied AI", "Idea that needs to become a product", "Other"],
    budgetOptions: ["Up to US$ 6k", "US$ 6k – US$ 16k", "US$ 16k – US$ 30k", "US$ 30k+", "Not sure yet"],
  },
  es: {
    eyebrow: "Hablemos",
    title: "Cuéntanos tu escenario. Diagnóstico en hasta 5 días.",
    sub: "Formulario rápido. Más contexto = mejor conversación.",
    bullets: ["Respuesta WhatsApp en hasta 4h hábiles", "Diagnóstico estructurado en hasta 5 días", "Conversación de 1h gratuita", "Rango de inversión y roadmap inicial"],
    directLabel: "Directo",
    name: "Nombre", company: "Empresa", email: "Correo", phone: "WhatsApp",
    projectLabel: "Tipo de proyecto", budgetLabel: "Presupuesto estimado",
    messageLabel: "Cuéntanos tu dolor / proyecto", messagePh: "Ej: 8 unidades empujando papel, quiero parar.",
    lgpd: "Acepto la Política de Privacidad y autorizo seguimiento comercial.",
    submit: "Enviar", sending: "Enviando…",
    error: "Error. Prueba WhatsApp +55 65 99686-5004.",
    timeNote: "Respuesta en hasta 4h hábiles · Lun-Vie · 9h-18h BRT",
    projectOptions: ["Sistema a medida / ERP interno", "Marketplace con IA", "Sitio de alta conversión", "Fintech / pagos", "Automatización / IA aplicada", "Idea que necesita volverse producto", "Otro"],
    budgetOptions: ["Hasta US$ 6k", "US$ 6k – US$ 16k", "US$ 16k – US$ 30k", "US$ 30k+", "Aún no sé"],
  },
};
