# Setup Neon Postgres — passo a passo

Esse arquivo descreve como conectar o site da Naveo com a Neon. Tudo configurado uma única vez. Total: ~5 minutos.

**🎉 O Worker cria as tabelas e popula seed sozinho** na primeira chamada da API — você só precisa setar o `DATABASE_URL`. O arquivo `schema.sql` continua no repo como referência/backup, mas não é obrigatório rodar manualmente.

---

## 1. Pegar a Connection String

1. Painel da Neon → seu projeto → aba **Connection Details**.
2. Selecione:
   - **Connection type:** Pooled
   - **Driver:** Direct (TCP via `psql`) — *no nosso caso o driver HTTP do Neon Serverless usa a URL pooled normalmente*
3. Copie a string que começa com `postgresql://...?sslmode=require`.

Exemplo (não use essa, ela é fake):
```
postgresql://naveo_owner:abc123XYZ@ep-cool-rain-12345.us-east-2.aws.neon.tech/naveo?sslmode=require
```

⚠️ **Essa string é segredo.** Não cole em chat, não commite, não compartilhe.

---

## 2. Configurar os secrets no Cloudflare

Você precisa setar 4 valores como secrets no Worker. Tem duas formas:

### Opção A — via Dashboard (mais fácil pra começar)

1. Cloudflare Dashboard → **Workers & Pages** → clique no projeto **naveo-site**.
2. Aba **Settings** → **Variables and Secrets**.
3. Em **Environment Variables**, clique em **Add variable** e crie 4 entradas (todas como **Secret**, não Plain text):

| Nome             | Valor                                                                  |
|------------------|------------------------------------------------------------------------|
| `DATABASE_URL`   | sua connection string da Neon (postgresql://...)                       |
| `ADMIN_EMAIL`    | `naveo@gmail.com`                                                       |
| `ADMIN_PASSWORD` | `123456` *(ou troque pra algo mais seguro)*                            |
| `ADMIN_TOKEN`    | uma string random (32+ chars). Gera uma no [random.org](https://www.random.org/strings/?num=1&len=40&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new) |

4. Clique em **Save** depois de cada uma.
5. Faça um novo deploy (`git push` ou redeploy no dashboard) pra Cloudflare pegar os secrets.

### Opção B — via wrangler CLI (se você tem instalado)

```bash
cd naveo-site

# Cada comando vai pedir o valor — digita e enter
wrangler secret put DATABASE_URL
wrangler secret put ADMIN_EMAIL
wrangler secret put ADMIN_PASSWORD
wrangler secret put ADMIN_TOKEN
```

---

## 3. Testar local (opcional)

Se quiser testar antes de deploy:

```bash
cd naveo-site
npm install
```

Crie um arquivo `.dev.vars` na raiz (já ignorado no `.gitignore`):

```
DATABASE_URL="postgresql://...?sslmode=require"
ADMIN_EMAIL="naveo@gmail.com"
ADMIN_PASSWORD="123456"
ADMIN_TOKEN="qualquer-string-random-aqui"
```

Rode:

```bash
npm run dev
```

Abre em http://localhost:8787 com hot-reload.

---

## 4. Deploy

Se você tem o GitHub conectado ao Cloudflare:

```bash
git push origin main
```

O Cloudflare detecta o push, builda o Worker e republica. Em ~1 minuto o `/api/*` tá vivo.

Se você prefere via CLI:

```bash
wrangler deploy
```

---

## 5. Validar

Depois do deploy:

1. **API pública** — abra https://seu-site.com/api/posts no browser. Deve retornar JSON com 6 posts.
2. **Admin** — abra `/admin/login`, entre com `naveo@gmail.com` / `123456`. Dashboard deve mostrar 6 posts, 8 cases, 4 mensagens.
3. **Form de contato** — preencha em `/contato` e envie. Vá pro admin → Mensagens. A submissão tem que aparecer no topo.

---

## Troubleshooting

**Erro "DATABASE_URL not configured" no /api/posts**
→ Os secrets não estão sendo lidos. Verifique:
- Estão marcados como **Secret** no Cloudflare (não como Plain text)
- Você fez um novo deploy depois de adicioná-los

**Erro "Sessão expirada" logo após login**
→ O token retornado pelo /api/auth/login não bate com env.ADMIN_TOKEN. Confirme que setou `ADMIN_TOKEN` no Cloudflare.

**Mensagens não estão sendo salvas mas o WhatsApp abre**
→ O fetch pra /api/messages tá silencioso (não bloqueia o WhatsApp). Abra DevTools → Network e dispare o form de novo. Veja a response do POST /api/messages.

**Quero migrar dados que já estavam no localStorage anterior**
→ Não dá automaticamente. Mas posts e cases já têm seed no schema.sql. Mensagens novas começam vazias (só o seed de 4 demos).

---

## Estrutura

```
naveo-site/
├── src/
│   └── worker.js           ← Cloudflare Worker — todas as rotas /api/*
├── schema.sql              ← DDL + seed pra rodar uma vez na Neon
├── wrangler.toml           ← config Cloudflare (main = src/worker.js + assets dist/)
├── package.json            ← dep: @neondatabase/serverless + devDep: wrangler
├── SETUP_NEON.md           ← este arquivo
└── dist/                   ← site estático (assets servidos diretamente)
    ├── admin/
    │   ├── admin.js        ← Auth + Storage agora chamam /api/*
    │   ├── login/          ← POST /api/auth/login → guarda token
    │   ├── posts/, cases/, messages/  ← consomem /api/{posts,cases,messages}
    └── js/main.js          ← form de /contato → POST /api/messages
```
