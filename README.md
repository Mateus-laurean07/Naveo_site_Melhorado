# Naveo · Site

Site institucional e documentação interna da Naveo Engenharia Criativa.

## Estrutura

```
.
├── BRAND_GUIDELINE.md                       # Manual de marca v1.0 (16 seções)
├── PAGINA_METODO_ENGENHARIA_CRIATIVA.md     # Copy da página /metodo
├── dist/                                    # Build v1 (HTML estático) — deployed
├── site-build/                              # Script de build v1 (Node + marked)
└── v2/                                      # Site v2 (Vite + React + TS + Tailwind)
    ├── src/
    │   ├── App.tsx                          # Roteador SPA
    │   ├── main.tsx
    │   ├── index.css                        # Tailwind base + tokens
    │   ├── components/                      # Header, Hero, Stats, Method, etc.
    │   ├── pages/                           # HomePage, PortfolioPage, etc.
    │   ├── content/                         # i18n PT/EN/ES
    │   └── lib/                             # router, cn
    ├── public/                              # Assets estáticos (logos)
    ├── functions/api/contact.ts             # Cloudflare Pages Function (form)
    ├── tailwind.config.js
    ├── vite.config.ts
    └── dist/                                # Build v2
```

## Deployments (Cloudflare Pages)

| URL | O que é |
|---|---|
| https://naveo-docs.pages.dev | **v1** — docs internas (`/brand`) com noindex |
| https://naveo-docs.pages.dev/brand | Brand Guideline + Método (markdown renderizado) |
| https://naveo-v2.pages.dev | **v2** — site React light Base-style |

Ambos com noindex enquanto não promover pra `naveo.com.br`.

## Stack v2

- **Vite 5 + React 18 + TypeScript**
- **Tailwind CSS** (paleta light com accent azul)
- **framer-motion@12** (animações)
- **Fontes:** Geist + Inter + JetBrains Mono
- **Backend:** Cloudflare Pages Functions (`/api/contact`)
- **Deploy:** Cloudflare Pages via Wrangler

## Build local

```bash
# v1 (docs)
cd site-build && node build.mjs

# v2 (site React)
cd v2 && npm install && npm run build

# Deploy
npx wrangler pages deploy v2/dist --project-name=naveo-v2 --branch=main
```

## i18n

PT (default) · EN (`/en`) · ES (`/es`) — strings em `v2/src/content/{pt,en,es}.ts`.

## Form de contato

Endpoint: `POST /api/contact` (Cloudflare Pages Function em `v2/functions/api/contact.ts`).

Configurável via env vars no dashboard Cloudflare:

- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — envia email via Resend
- `DISCORD_WEBHOOK_URL` — notifica Discord
- `SLACK_WEBHOOK_URL` — notifica Slack
- `CONTACT_WEBHOOK_URL` — webhook genérico

Sem env vars, leads ficam só no log do Cloudflare Functions.

---

© Naveo Engenharia Criativa · Lucas do Rio Verde, MT
