// ============================================================================
// Inicializa o banco Neon — cria tabelas + seed inicial.
// Uso: DATABASE_URL="postgresql://..." node scripts/init-db.mjs
// ============================================================================

import { neon } from "@neondatabase/serverless";
import { webcrypto as crypto } from "node:crypto";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL não setado.");
  console.error('   Uso: DATABASE_URL="postgresql://..." node scripts/init-db.mjs');
  process.exit(1);
}

const sql = neon(url);

// Helpers de hash (mesma fórmula usada no worker — SHA-256 com salt único)
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

async function main() {
  console.log("🔌 Conectando na Neon...");

  // ============ USERS ============
  console.log("📝 Criando tabela users...");
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

  // ============ POSTS ============
  console.log("📝 Criando tabela posts...");
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

  // ============ CASES ============
  console.log("📝 Criando tabela cases...");
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

  // ============ MESSAGES ============
  console.log("📝 Criando tabela messages...");
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

  // ============ SEED USERS (admin) ============
  const [{ count: usersCount }] = await sql`SELECT COUNT(*)::int as count FROM users`;
  if (usersCount === 0) {
    console.log("🌱 Criando usuário admin (naveo@gmail.com / 123456)...");
    const salt = randomSalt();
    const password_hash = await sha256("123456" + salt);
    await sql`
      INSERT INTO users (id, email, password_hash, salt, name, role)
      VALUES ('u_admin', 'naveo@gmail.com', ${password_hash}, ${salt}, 'Admin Naveo', 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
  } else {
    console.log(`⏭  Users já existem (${usersCount} registros), pulando seed.`);
  }

  // ============ SEED POSTS ============
  const [{ count: postsCount }] = await sql`SELECT COUNT(*)::int as count FROM posts`;
  if (postsCount === 0) {
    console.log("🌱 Populando 6 posts iniciais...");
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
  } else {
    console.log(`⏭  Posts já existem (${postsCount} registros), pulando seed.`);
  }

  // ============ SEED CASES ============
  const [{ count: casesCount }] = await sql`SELECT COUNT(*)::int as count FROM cases`;
  if (casesCount === 0) {
    console.log("🌱 Populando 8 cases iniciais...");
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
  } else {
    console.log(`⏭  Cases já existem (${casesCount} registros), pulando seed.`);
  }

  // ============ SEED MESSAGES ============
  const [{ count: msgCount }] = await sql`SELECT COUNT(*)::int as count FROM messages`;
  if (msgCount === 0) {
    console.log("🌱 Populando 4 mensagens iniciais...");
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
  } else {
    console.log(`⏭  Mensagens já existem (${msgCount} registros), pulando seed.`);
  }

  // ============ Sanity check ============
  console.log("\n📊 Status final:");
  const counts = await sql`
    SELECT 'posts' as tabela, COUNT(*)::int as total FROM posts
    UNION ALL SELECT 'cases', COUNT(*)::int FROM cases
    UNION ALL SELECT 'messages', COUNT(*)::int FROM messages
  `;
  counts.forEach((r) => console.log(`   ${r.tabela.padEnd(10)} ${r.total} registros`));

  console.log("\n✅ Banco inicializado com sucesso!");
}

main().catch((e) => {
  console.error("\n❌ Erro:", e.message);
  process.exit(1);
});
