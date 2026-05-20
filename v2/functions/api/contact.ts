// Cloudflare Pages Function: POST /api/contact
//
// Receives the contact form submission, validates, and tries to deliver via:
//   1. Resend email (if RESEND_API_KEY + CONTACT_TO_EMAIL are set)
//   2. Discord webhook (if DISCORD_WEBHOOK_URL is set)
//   3. Slack webhook (if SLACK_WEBHOOK_URL is set)
//   4. Generic webhook (if CONTACT_WEBHOOK_URL is set)
//
// If no env is configured, it still returns 200 OK so the form works while
// integrations are wired up. Set vars in Cloudflare dashboard → Pages → naveo-v2 → Settings → Environment variables.

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  DISCORD_WEBHOOK_URL?: string;
  SLACK_WEBHOOK_URL?: string;
  CONTACT_WEBHOOK_URL?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  sector?: string;
  projectType?: string;
  stage?: string;
  budget?: string;
  message?: string;
  lgpd?: string;
  lang?: string;
  locale?: string;
  userAgent?: string;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let payload: ContactPayload = {};
  try {
    payload = await ctx.request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  // Basic validation
  const required: (keyof ContactPayload)[] = ["name", "email", "phone", "sector", "projectType", "stage", "message", "lgpd"];
  for (const field of required) {
    if (!payload[field] || String(payload[field]).trim().length < 1) {
      return json({ ok: false, error: `Missing field: ${field}` }, 400);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    return json({ ok: false, error: "Invalid email" }, 400);
  }

  const ip = ctx.request.headers.get("CF-Connecting-IP") || "unknown";
  const country = (ctx.request as any).cf?.country || "unknown";
  const ts = new Date().toISOString();

  const meta = { ip, country, ts, lang: payload.lang, ua: payload.userAgent };

  // Build text representation for email/webhook
  const text =
    `📩 Novo lead Naveo\n\n` +
    `Nome:      ${payload.name}\n` +
    `Empresa:   ${payload.company || "-"}\n` +
    `E-mail:    ${payload.email}\n` +
    `WhatsApp:  ${payload.phone}\n\n` +
    `Setor:     ${payload.sector}\n` +
    `Projeto:   ${payload.projectType}\n` +
    `Estágio:   ${payload.stage}\n` +
    `Budget:    ${payload.budget || "-"}\n\n` +
    `Mensagem:\n${payload.message}\n\n` +
    `---\nIdioma: ${payload.lang} · IP: ${ip} · País: ${country}\n${ts}`;

  const delivered: string[] = [];
  const errors: string[] = [];

  // 1) Resend
  if (ctx.env.RESEND_API_KEY && ctx.env.CONTACT_TO_EMAIL) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: ctx.env.CONTACT_FROM_EMAIL || "Naveo Site <noreply@naveo.com.br>",
          to: [ctx.env.CONTACT_TO_EMAIL],
          reply_to: payload.email,
          subject: `[Naveo] Novo lead — ${payload.name} (${payload.company || payload.sector})`,
          text,
        }),
      });
      if (r.ok) delivered.push("resend");
      else errors.push(`resend ${r.status}`);
    } catch (e: any) { errors.push(`resend ${e.message}`); }
  }

  // 2) Discord
  if (ctx.env.DISCORD_WEBHOOK_URL) {
    try {
      const r = await fetch(ctx.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text.slice(0, 1900),
          allowed_mentions: { parse: [] },
        }),
      });
      if (r.ok || r.status === 204) delivered.push("discord");
      else errors.push(`discord ${r.status}`);
    } catch (e: any) { errors.push(`discord ${e.message}`); }
  }

  // 3) Slack
  if (ctx.env.SLACK_WEBHOOK_URL) {
    try {
      const r = await fetch(ctx.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (r.ok) delivered.push("slack");
      else errors.push(`slack ${r.status}`);
    } catch (e: any) { errors.push(`slack ${e.message}`); }
  }

  // 4) Generic webhook
  if (ctx.env.CONTACT_WEBHOOK_URL) {
    try {
      const r = await fetch(ctx.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, meta }),
      });
      if (r.ok) delivered.push("webhook");
      else errors.push(`webhook ${r.status}`);
    } catch (e: any) { errors.push(`webhook ${e.message}`); }
  }

  // Always log to console (Cloudflare logs)
  console.log("contact-form-submission", JSON.stringify({ payload, meta, delivered, errors }));

  // Always return 200 to keep form UX clean
  return json({ ok: true, delivered, errorsCount: errors.length });
};

// CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
