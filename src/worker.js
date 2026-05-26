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

    // SEM seed automático aqui.
    // Seed inicial é responsabilidade do scripts/init-db.mjs (rodado uma vez).
    // Se a tabela ficar vazia (ex: user deletou tudo), continua vazia — não
    // re-inserimos os dados de exemplo automaticamente.
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
