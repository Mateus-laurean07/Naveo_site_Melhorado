/* ============================================================================
   Naveo · Cloudflare Worker — API layer
   Conecta com Neon Postgres via @neondatabase/serverless (driver HTTP).
   Rotas /api/* são handled aqui. Tudo o resto = static assets do /dist.
   ============================================================================
   Secrets esperados (definir via wrangler secret put ou dashboard):
   - DATABASE_URL   (postgresql://... da Neon, com sslmode=require)
   - ADMIN_EMAIL    (ex: naveo@gmail.com)
   - ADMIN_PASSWORD (ex: 123456)
   - ADMIN_TOKEN    (string random 32+ chars — devolvida no login, valida nas rotas admin)
   ============================================================================ */

import { neon } from "@neondatabase/serverless";

// ----------------------------------------------------------------------------
// HASH HELPERS (SHA-256 com salt — Web Crypto API, funciona em Workers + Node)
// ----------------------------------------------------------------------------
function randomSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password, salt) {
  return sha256(password + salt);
}

function randomToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ----------------------------------------------------------------------------
// AUTO-BOOTSTRAP — Cria tabelas e popula seed na primeira chamada
// ----------------------------------------------------------------------------
// Idempotente (CREATE TABLE IF NOT EXISTS + ON CONFLICT DO NOTHING).
// Cacheia a Promise: só roda 1× por instância do Worker.
let bootstrapPromise = null;

async function ensureSchema(sql) {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    // USERS — tabela de admins
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id                 TEXT PRIMARY KEY,
        email              TEXT UNIQUE NOT NULL,
        password_hash      TEXT NOT NULL,
        salt               TEXT NOT NULL,
        name               TEXT,
        role               TEXT DEFAULT 'admin',
        session_token      TEXT,
        session_expires_at TIMESTAMPTZ,
        created_at         TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)`;
    await sql`CREATE INDEX IF NOT EXISTS users_token_idx ON users (session_token)`;

    // Seed admin se a tabela tá vazia (default: naveo@gmail.com / 123456)
    const [{ count: usersCount }] = await sql`SELECT COUNT(*)::int as count FROM users`;
    if (usersCount === 0) {
      const salt = randomSalt();
      const password_hash = await hashPassword("123456", salt);
      await sql`
        INSERT INTO users (id, email, password_hash, salt, name, role)
        VALUES ('u_admin', 'naveo@gmail.com', ${password_hash}, ${salt}, 'Admin Naveo', 'admin')
        ON CONFLICT (email) DO NOTHING
      `;
    }

    // DDL (separados pq o driver HTTP da Neon não roda multi-statement)
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id          TEXT PRIMARY KEY,
        title       TEXT NOT NULL,
        tag         TEXT NOT NULL,
        date        DATE NOT NULL,
        image       TEXT,
        excerpt     TEXT,
        lead        TEXT,
        body        TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS posts_date_idx ON posts (date DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS posts_tag_idx ON posts (tag)`;

    await sql`
      CREATE TABLE IF NOT EXISTS cases (
        id          TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        eyebrow     TEXT,
        setor       TEXT,
        ano         TEXT,
        live        TEXT,
        lead        TEXT,
        image       TEXT,
        tags        TEXT,
        desafio     TEXT,
        solucao     TEXT,
        resultado   TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id          TEXT PRIMARY KEY,
        nome        TEXT NOT NULL,
        email       TEXT NOT NULL,
        telefone    TEXT,
        empresa     TEXT,
        interesse   TEXT,
        mensagem    TEXT NOT NULL,
        date        TIMESTAMPTZ DEFAULT NOW(),
        read        BOOLEAN DEFAULT FALSE
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS messages_date_idx ON messages (date DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS messages_read_idx ON messages (read)`;

    // Seed só se as tabelas estiverem vazias
    const [{ count: postsCount }] = await sql`SELECT COUNT(*)::int as count FROM posts`;
    if (postsCount === 0) {
      const posts = [
        { id: "jornada-empreendedor", title: "A jornada do empreendedor: do zero à operação digital completa", tag: "Empreendedorismo", date: "2025-11-21", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80", excerpt: "Como conduzir um negócio do conceito ao go-live em 90 dias com método aplicado em 12 empresas próprias.", lead: "Quando alguém te procura com uma ideia, a tentação é entrar em modo execução...", body: "Etapa 1 — Investigação profunda, antes do contrato.\n\nA primeira hora gratuita não é venda — é diagnóstico..." },
        { id: "performance-em-vendas", title: "Performance em vendas: otimizando resultados com dados", tag: "Performance", date: "2025-11-18", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", excerpt: "Métricas que importam pra decisão de vendas — funil, CAC, LTV — e como sistemas internos viram fonte de verdade.", lead: "Time de vendas brasileiro reporta em planilha do gerente...", body: "" },
        { id: "mentoria-funil-de-vendas", title: "Mentoria e funil de vendas: virando estratégia em execução", tag: "Vendas", date: "2025-11-15", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", excerpt: "Quando o funil deixa de ser desenho e vira ferramenta operacional integrada ao CRM, WhatsApp e estoque.", lead: "", body: "" },
        { id: "sistema-aquisicao-clientes", title: "Sistema de aquisição de clientes que escala sem terceirização", tag: "Sistemas", date: "2025-11-12", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80", excerpt: "Como construir um motor de aquisição sob medida que cresce com o negócio sem virar dependência de fornecedor.", lead: "", body: "" },
        { id: "marketing-orientado-dados", title: "Marketing digital orientado a dados: o método na prática", tag: "Marketing", date: "2025-11-09", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", excerpt: "Tracking, atribuição e dashboard de decisão — sem isso, marketing é palpite caro. Como estruturar do zero.", lead: "", body: "" },
        { id: "funil-vendas-conversoes", title: "Funil de vendas: como aumentar conversões em cada etapa", tag: "Conversão", date: "2025-11-06", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80", excerpt: "Diagnóstico, gargalo e teste — o ciclo de melhoria contínua que vira receita previsível.", lead: "", body: "" },
      ];
      for (const p of posts) {
        await sql`
          INSERT INTO posts (id, title, tag, date, image, excerpt, lead, body)
          VALUES (${p.id}, ${p.title}, ${p.tag}, ${p.date}, ${p.image}, ${p.excerpt}, ${p.lead}, ${p.body})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const [{ count: casesCount }] = await sql`SELECT COUNT(*)::int as count FROM cases`;
    if (casesCount === 0) {
      const cases = [
        { id: "agrodesapego", name: "Agrodesapego", eyebrow: "Marketplace · IA", setor: "Agronegócio", ano: "2024", live: "https://agrodesapego.com.br", lead: "Marketplace de máquinas agrícolas usadas com agente de IA negociando via WhatsApp.", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80", tags: "Marketplace, IA Negociadora, Agro, WhatsApp", desafio: "Mercado de máquinas agrícolas usadas é fragmentado, opaco e dependente de corretor humano...", solucao: "Construímos um marketplace vertical com cadastro guiado pra vendedor...", resultado: "Tempo médio de fechamento caiu de semanas pra dias..." },
        { id: "cruzetaclub", name: "Cruzeta Club", eyebrow: "Comunidade · SaaS", setor: "Comunidade automotiva", ano: "2024", live: "https://cruzetaclub.com.br", lead: "Plataforma de gestão pra clubes de carros — controle de associados, eventos, pagamentos recorrentes.", image: "/assets/cases/cruzetaclub.jpg", tags: "Comunidade, SaaS, Eventos, Recorrência", desafio: "", solucao: "", resultado: "" },
        { id: "navbarber", name: "Navbarber", eyebrow: "SaaS Vertical", setor: "Beauty", ano: "2024", live: "https://navbarber.com.br", lead: "Plataforma de gestão pra barbearias modernas.", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80", tags: "SaaS Vertical, Marketplace, PWA", desafio: "", solucao: "", resultado: "" },
        { id: "pharmagenius", name: "Pharma Genius", eyebrow: "Em breve", setor: "Healthcare", ano: "2026", live: "", lead: "Plataforma farmacêutica em construção.", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=2000&q=80", tags: "Healthcare, Em construção", desafio: "", solucao: "", resultado: "" },
        { id: "obrasimples", name: "ObraSimples", eyebrow: "ERP Vertical", setor: "Construção", ano: "2024", live: "https://obrasimples.com.br", lead: "ERP/Micro SaaS sob medida pra pequenos empreendedores da construção civil.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80", tags: "ERP, Fintech, Micro SaaS", desafio: "", solucao: "", resultado: "" },
        { id: "cuidarbemcard", name: "Cuidar Bem Card", eyebrow: "Plataforma de Saúde", setor: "Healthcare", ano: "2023", live: "https://cuidarbemcard.com.br", lead: "Empresa de saúde criada do zero.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80", tags: "Saúde, 0→1, Branding", desafio: "", solucao: "", resultado: "" },
        { id: "greenfuturehub", name: "Green Future Hub", eyebrow: "ESG", setor: "ESG", ano: "2024", live: "https://greenfuturehub.com.br", lead: "Ecossistema colaborativo de inovação sustentável.", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80", tags: "ESG, Hub, Sustentabilidade", desafio: "", solucao: "", resultado: "" },
        { id: "centrodediagnostico", name: "Centro de Diagnóstico", eyebrow: "Saúde", setor: "Healthcare", ano: "2024", live: "https://centrodediagnostico.com.br", lead: "Clínica de diagnóstico por imagem com 20+ anos de história.", image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=2000&q=80", tags: "Saúde, IA, Multi-convênio", desafio: "", solucao: "", resultado: "" },
      ];
      for (const c of cases) {
        await sql`
          INSERT INTO cases (id, name, eyebrow, setor, ano, live, lead, image, tags, desafio, solucao, resultado)
          VALUES (${c.id}, ${c.name}, ${c.eyebrow}, ${c.setor}, ${c.ano}, ${c.live}, ${c.lead}, ${c.image}, ${c.tags}, ${c.desafio}, ${c.solucao}, ${c.resultado})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const [{ count: msgCount }] = await sql`SELECT COUNT(*)::int as count FROM messages`;
    if (msgCount === 0) {
      const messages = [
        { id: "m1", nome: "Carlos Mendes", email: "carlos@agrofarm.com.br", telefone: "(65) 98888-1234", empresa: "AgroFarm", interesse: "Marketplace", mensagem: "Tenho uma operação de comércio de máquinas e queria explorar a possibilidade de uma plataforma similar ao Agrodesapego, mas vertical pro setor.", date: "2025-11-22 10:14:00+00", read: false },
        { id: "m2", nome: "Ana Souza", email: "ana@clinicvision.com.br", telefone: "(11) 97777-5566", empresa: "ClinicVision", interesse: "IA aplicada / Agentes", mensagem: "Somos uma clínica de oftalmologia e queremos automatizar o atendimento WhatsApp de pacientes — triagem inicial e agendamento.", date: "2025-11-21 15:42:00+00", read: false },
        { id: "m3", nome: "Roberto Lima", email: "roberto@bypme.com", telefone: "(31) 96666-9999", empresa: "BY PME", interesse: "Sistemas sob medida", mensagem: "ERP atual não atende mais. Pequena rede com 4 lojas físicas + e-commerce, precisamos unificar.", date: "2025-11-20 09:28:00+00", read: true },
        { id: "m4", nome: "Juliana Castro", email: "juliana@flowtech.io", telefone: "(48) 99999-3333", empresa: "FlowTech", interesse: "Performance / Vendas", mensagem: "Time de vendas crescendo, CRM atual virou bagunça. Queria entender como vocês estruturam funil + automação.", date: "2025-11-19 14:05:00+00", read: true },
      ];
      for (const m of messages) {
        await sql`
          INSERT INTO messages (id, nome, email, telefone, empresa, interesse, mensagem, date, read)
          VALUES (${m.id}, ${m.nome}, ${m.email}, ${m.telefone}, ${m.empresa}, ${m.interesse}, ${m.mensagem}, ${m.date}, ${m.read})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }
  })();

  // Se falhar, deixa retry na próxima chamada
  bootstrapPromise.catch(() => { bootstrapPromise = null; });

  return bootstrapPromise;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });

const err = (msg, status = 400) =>
  new Response(JSON.stringify({ error: msg }), { status, headers: JSON_HEADERS });

// Slug helper (mesmo do front)
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

// Verifica o bearer token contra a tabela users.session_token
async function requireAuth(request, sql) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { error: err("Unauthorized", 401) };

  const [user] = await sql`
    SELECT id, email, name, role, session_expires_at
    FROM users
    WHERE session_token = ${token}
    LIMIT 1
  `;
  if (!user) return { error: err("Unauthorized", 401) };

  // Verifica expiração (se foi setada)
  if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
    return { error: err("Sessão expirada", 401) };
  }

  return { user };
}

// ----------------------------------------------------------------------------
// Router principal
// ----------------------------------------------------------------------------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Static assets handler — qualquer coisa fora de /api/* vai direto pro dist
    if (!path.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // CORS preflight (mesma origem normalmente, mas defensivo)
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Sanity check do DATABASE_URL
    if (!env.DATABASE_URL) {
      return err("DATABASE_URL not configured", 500);
    }

    const sql = neon(env.DATABASE_URL);

    // Auto-bootstrap schema + seed na primeira chamada (idempotente).
    // Pula pro endpoint de auth/login pra não atrasar o login.
    if (path !== "/api/auth/login") {
      try {
        await ensureSchema(sql);
      } catch (e) {
        console.error("Schema bootstrap failed:", e);
        return err("Erro ao inicializar banco: " + (e?.message || ""), 500);
      }
    }

    try {
      // ====================================================================
      // AUTH (tabela users)
      // ====================================================================
      // POST /api/auth/login { email, password }
      if (path === "/api/auth/login" && method === "POST") {
        // Garante que o schema + admin seed existem (caso seja primeiro request)
        await ensureSchema(sql);

        const { email, password } = await request.json();
        if (!email || !password) return err("Email e senha obrigatórios", 400);

        const [user] = await sql`
          SELECT id, email, password_hash, salt, name, role
          FROM users
          WHERE email = ${email.toLowerCase().trim()}
          LIMIT 1
        `;
        if (!user) return err("E-mail ou senha incorretos", 401);

        const expected = await hashPassword(password, user.salt);
        if (expected !== user.password_hash) {
          return err("E-mail ou senha incorretos", 401);
        }

        // Gera token novo e salva no usuário (expira em 7 dias)
        const token = randomToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        await sql`
          UPDATE users
          SET session_token = ${token}, session_expires_at = ${expiresAt}
          WHERE id = ${user.id}
        `;

        return json({ token, email: user.email, name: user.name });
      }

      // POST /api/auth/logout — invalida sessão atual
      if (path === "/api/auth/logout" && method === "POST") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        await sql`UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ${authResult.user.id}`;
        return json({ ok: true });
      }

      // GET /api/auth/me — checa se token é válido
      if (path === "/api/auth/me" && method === "GET") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        return json(authResult.user);
      }

      // ====================================================================
      // POSTS
      // ====================================================================
      // GET /api/posts — público, lista todos
      if (path === "/api/posts" && method === "GET") {
        const rows = await sql`
          SELECT id, title, tag, date::text, image, excerpt, lead, body
          FROM posts
          ORDER BY date DESC
        `;
        return json(rows);
      }

      // GET /api/posts/:id
      const postMatch = path.match(/^\/api\/posts\/([^/]+)$/);
      if (postMatch && method === "GET") {
        const [row] = await sql`
          SELECT id, title, tag, date::text, image, excerpt, lead, body
          FROM posts WHERE id = ${postMatch[1]}
        `;
        if (!row) return err("Post não encontrado", 404);
        return json(row);
      }

      // POST /api/posts — admin
      if (path === "/api/posts" && method === "POST") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        const p = await request.json();
        const id = (p.id || slugify(p.title || "")) || "post-" + Date.now();
        await sql`
          INSERT INTO posts (id, title, tag, date, image, excerpt, lead, body)
          VALUES (${id}, ${p.title}, ${p.tag}, ${p.date}, ${p.image || ""},
                  ${p.excerpt || ""}, ${p.lead || ""}, ${p.body || ""})
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            tag = EXCLUDED.tag,
            date = EXCLUDED.date,
            image = EXCLUDED.image,
            excerpt = EXCLUDED.excerpt,
            lead = EXCLUDED.lead,
            body = EXCLUDED.body,
            updated_at = NOW()
        `;
        return json({ ok: true, id });
      }

      // DELETE /api/posts/:id — admin
      if (postMatch && method === "DELETE") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        await sql`DELETE FROM posts WHERE id = ${postMatch[1]}`;
        return json({ ok: true });
      }

      // ====================================================================
      // CASES
      // ====================================================================
      // GET /api/cases — público
      if (path === "/api/cases" && method === "GET") {
        const rows = await sql`
          SELECT id, name, eyebrow, setor, ano, live, lead, image, tags,
                 desafio, solucao, resultado
          FROM cases
          ORDER BY created_at DESC
        `;
        return json(rows);
      }

      // GET /api/cases/:id
      const caseMatch = path.match(/^\/api\/cases\/([^/]+)$/);
      if (caseMatch && method === "GET") {
        const [row] = await sql`
          SELECT id, name, eyebrow, setor, ano, live, lead, image, tags,
                 desafio, solucao, resultado
          FROM cases WHERE id = ${caseMatch[1]}
        `;
        if (!row) return err("Case não encontrado", 404);
        return json(row);
      }

      // POST /api/cases — admin
      if (path === "/api/cases" && method === "POST") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        const c = await request.json();
        const id = (c.id || slugify(c.name || "")) || "case-" + Date.now();
        await sql`
          INSERT INTO cases (id, name, eyebrow, setor, ano, live, lead, image,
                             tags, desafio, solucao, resultado)
          VALUES (${id}, ${c.name}, ${c.eyebrow || ""}, ${c.setor || ""},
                  ${c.ano || ""}, ${c.live || ""}, ${c.lead || ""},
                  ${c.image || ""}, ${c.tags || ""}, ${c.desafio || ""},
                  ${c.solucao || ""}, ${c.resultado || ""})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            eyebrow = EXCLUDED.eyebrow,
            setor = EXCLUDED.setor,
            ano = EXCLUDED.ano,
            live = EXCLUDED.live,
            lead = EXCLUDED.lead,
            image = EXCLUDED.image,
            tags = EXCLUDED.tags,
            desafio = EXCLUDED.desafio,
            solucao = EXCLUDED.solucao,
            resultado = EXCLUDED.resultado,
            updated_at = NOW()
        `;
        return json({ ok: true, id });
      }

      // DELETE /api/cases/:id — admin
      if (caseMatch && method === "DELETE") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        await sql`DELETE FROM cases WHERE id = ${caseMatch[1]}`;
        return json({ ok: true });
      }

      // ====================================================================
      // MESSAGES
      // ====================================================================
      // POST /api/messages — público (form de contato)
      if (path === "/api/messages" && method === "POST") {
        const m = await request.json();
        if (!m.nome || !m.email || !m.mensagem) {
          return err("nome, email e mensagem são obrigatórios", 400);
        }
        const id = "m" + Date.now();
        await sql`
          INSERT INTO messages (id, nome, email, telefone, empresa, interesse, mensagem)
          VALUES (${id}, ${m.nome}, ${m.email}, ${m.telefone || ""},
                  ${m.empresa || ""}, ${m.interesse || ""}, ${m.mensagem})
        `;
        return json({ ok: true, id });
      }

      // GET /api/messages — admin
      if (path === "/api/messages" && method === "GET") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        const rows = await sql`
          SELECT id, nome, email, telefone, empresa, interesse, mensagem,
                 date::text, read
          FROM messages
          ORDER BY date DESC
        `;
        return json(rows);
      }

      // PATCH /api/messages/:id { read: true } — admin
      const msgMatch = path.match(/^\/api\/messages\/([^/]+)$/);
      if (msgMatch && method === "PATCH") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        const body = await request.json();
        if (typeof body.read === "boolean") {
          await sql`UPDATE messages SET read = ${body.read} WHERE id = ${msgMatch[1]}`;
        }
        return json({ ok: true });
      }

      // DELETE /api/messages/:id — admin
      if (msgMatch && method === "DELETE") {
        const authResult = await requireAuth(request, sql);
        if (authResult.error) return authResult.error;
        await sql`DELETE FROM messages WHERE id = ${msgMatch[1]}`;
        return json({ ok: true });
      }

      // Não encontrou rota
      return err("Rota não encontrada", 404);
    } catch (e) {
      console.error("API error:", e);
      return err("Internal server error: " + (e?.message || "unknown"), 500);
    }
  },
};
